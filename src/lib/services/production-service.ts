// =============================================
// LAYER 6: BUSINESS LOGIC - Production Service
// Workflow orchestration and business rules
// =============================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class ProductionService {
  
  // Create production with validation and setUp
  async createProduction(data: any) {
    // 1. Validate required fields
    if (!data.name || !data.workspace_id || !data.type) {
      throw new Error('Missing required fields')
    }

    // 2. Check user permissions
    const canCreate = await this.checkPermission(data.created_by, 'projects', 'create')
    if (!canCreate) {
      throw new Error('Insufficient permissions')
    }

    // 3. Create production
    const { data: production, error } = await supabase
      .from('productions')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    // 4. Create default budget
    if (data.budget) {
      await supabase.from('budgets').insert({
        workspace_id: data.workspace_id,
        production_id: production.id,
        name: `${production.name} Budget`,
        total_amount: data.budget,
        currency: data.budget_currency || 'USD',
        status: 'draft',
        created_by: data.created_by
      })
    }

    // 5. Create default milestones
    await this.createDefaultMilestones(production.id, data.workspace_id, data.created_by)

    // 6. Log activity
    await this.logActivity({
      workspace_id: data.workspace_id,
      user_id: data.created_by,
      action: 'created_production',
      entity_type: 'production',
      entity_id: production.id
    })

    return production
  }

  // Update production with business rules
  async updateProduction(productionId: string, updates: any, userId: string) {
    // 1. Get current production
    const { data: current } = await supabase
      .from('productions')
      .select('*')
      .eq('id', productionId)
      .single()

    if (!current) throw new Error('Production not found')

    // 2. Validate status transitions
    if (updates.status && !this.isValidStatusTransition(current.status, updates.status)) {
      throw new Error(`Cannot transition from ${current.status} to ${updates.status}`)
    }

    // 3. Recalculate health if needed
    if (updates.status || updates.budget_spent) {
      const { data: health } = await supabase
        .rpc('calculate_production_health', { p_production_id: productionId })
      updates.health = health
    }

    // 4. Update production
    const { data, error } = await supabase
      .from('productions')
      .update(updates)
      .eq('id', productionId)
      .select()
      .single()

    if (error) throw error

    // 5. Trigger notifications if status changed
    if (updates.status && updates.status !== current.status) {
      await this.notifyTeam(productionId, `Production status changed to ${updates.status}`)
    }

    return data
  }

  // Complete production workflow
  async completeProduction(productionId: string, userId: string) {
    // 1. Check all tasks are complete
    const { data: incompleteTasks } = await supabase
      .from('project_tasks')
      .select('id')
      .eq('production_id', productionId)
      .not('status', 'in', '(done,cancelled)')

    if (incompleteTasks && incompleteTasks.length > 0) {
      throw new Error(`Cannot complete: ${incompleteTasks.length} tasks still pending`)
    }

    // 2. Check all compliance items are valid
    const { data: expiredCompliance } = await supabase
      .from('project_compliance')
      .select('id')
      .eq('production_id', productionId)
      .in('status', ['expired', 'denied'])

    if (expiredCompliance && expiredCompliance.length > 0) {
      throw new Error('Cannot complete: Some compliance items are expired or denied')
    }

    // 3. Generate final report
    const report = await this.generateFinalReport(productionId)

    // 4. Update status
    const { data } = await supabase
      .from('productions')
      .update({ status: 'completed', progress: 100 })
      .eq('id', productionId)
      .select()
      .single()

    // 5. Archive related data
    await this.archiveProductionData(productionId)

    // 6. Notify stakeholders
    await this.notifyTeam(productionId, 'Production completed successfully! 🎉')

    return { production: data, report }
  }

  // Helper: Create default milestones
  private async createDefaultMilestones(productionId: string, workspaceId: string, userId: string) {
    const defaultMilestones = [
      { name: 'Kickoff', days_from_start: 0 },
      { name: 'Design Complete', days_from_start: 30 },
      { name: 'Production Start', days_from_start: 60 },
      { name: 'Final Delivery', days_from_start: 90 }
    ]

    const { data: production } = await supabase
      .from('productions')
      .select('start_date')
      .eq('id', productionId)
      .single()

    if (!production?.start_date) return

    const milestones = defaultMilestones.map(m => {
      const dueDate = new Date(production.start_date)
      dueDate.setDate(dueDate.getDate() + m.days_from_start)
      
      return {
        production_id: productionId,
        workspace_id: workspaceId,
        name: m.name,
        due_date: dueDate.toISOString(),
        status: 'pending',
        created_by: userId
      }
    })

    await supabase.from('project_milestones').insert(milestones)
  }

  // Helper: Validate status transitions
  private isValidStatusTransition(current: string, next: string): boolean {
    const validTransitions: Record<string, string[]> = {
      planning: ['active', 'on_hold', 'cancelled'],
      active: ['on_hold', 'completed', 'cancelled'],
      on_hold: ['active', 'cancelled'],
      completed: ['archived'],
      cancelled: ['archived'],
      archived: []
    }

    return validTransitions[current]?.includes(next) || false
  }

  // Helper: Notify team members
  private async notifyTeam(productionId: string, message: string) {
    const { data: production } = await supabase
      .from('productions')
      .select('team_members, project_manager_id, project_manager:profiles!project_manager_id(first_name, last_name)')
      .eq('id', productionId)
      .single()

    if (!production) return

    const recipients = [
      production.project_manager_id,
      ...(production.team_members || [])
    ].filter(Boolean)

    const notifications = recipients.map(userId => ({
      user_id: userId,
      type: 'production_update',
      title: 'Production Update',
      message,
      link: `/productions/${productionId}`
    }))

    await supabase.from('notifications').insert(notifications)
  }

  // Helper: Generate final report
  private async generateFinalReport(productionId: string) {
    const { data } = await supabase
      .rpc('get_production_summary', { p_production_id: productionId })
    
    return data
  }

  // Helper: Archive production data
  private async archiveProductionData(productionId: string) {
    // Archive files
    await supabase
      .from('files')
      .update({ status: 'archived' })
      .eq('production_id', productionId)

    // Close budgets
    await supabase
      .from('budgets')
      .update({ status: 'closed' })
      .eq('production_id', productionId)
  }

  // Helper: Check permissions
  private async checkPermission(userId: string, category: string, action: string): Promise<boolean> {
    const { data } = await supabase
      .rpc('has_permission', {
        p_user_id: userId,
        p_permission_category: category,
        p_permission_action: action
      })
    
    return data || false
  }

  // Helper: Log activity
  private async logActivity(activity: any) {
    await supabase.from('activities').insert(activity)
  }
}

export const productionService = new ProductionService()
