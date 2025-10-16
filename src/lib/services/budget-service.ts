// =============================================
// LAYER 6: BUSINESS LOGIC - Budget Service
// Budget tracking, variance analysis, approvals
// =============================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class BudgetService {
  
  // Create budget with line items
  async createBudget(data: any, lineItems: any[]) {
    // 1. Create budget
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    // 2. Create line items
    if (lineItems && lineItems.length > 0) {
      const items = lineItems.map(item => ({
        ...item,
        budget_id: budget.id
      }))

      await supabase.from('budget_line_items').insert(items)
    }

    return budget
  }

  // Record expense against budget
  async recordExpense(expenseData: any) {
    // 1. Create transaction
    const { data: transaction, error } = await supabase
      .from('financial_transactions')
      .insert(expenseData)
      .select()
      .single()

    if (error) throw error

    // 2. Update budget spent amount
    if (expenseData.budget_id) {
      const { data: budget } = await supabase
        .from('budgets')
        .select('spent_amount')
        .eq('id', expenseData.budget_id)
        .single()

      await supabase
        .from('budgets')
        .update({ 
          spent_amount: (budget?.spent_amount || 0) + expenseData.amount 
        })
        .eq('id', expenseData.budget_id)

      // 3. Check for budget alerts
      await this.checkBudgetAlerts(expenseData.budget_id)
    }

    // 4. Update line item actual amount
    if (expenseData.budget_line_item_id) {
      const { data: lineItem } = await supabase
        .from('budget_line_items')
        .select('actual_amount')
        .eq('id', expenseData.budget_line_item_id)
        .single()

      await supabase
        .from('budget_line_items')
        .update({ 
          actual_amount: (lineItem?.actual_amount || 0) + expenseData.amount 
        })
        .eq('id', expenseData.budget_line_item_id)
    }

    return transaction
  }

  // Check budget thresholds and send alerts
  private async checkBudgetAlerts(budgetId: string) {
    const { data: budget } = await supabase
      .from('budgets')
      .select('*, production:production_id(project_manager_id, project_manager:profiles!project_manager_id(first_name, last_name))')
      .eq('id', budgetId)
      .single()

    if (!budget) return

    const percentSpent = (budget.spent_amount / budget.total_amount) * 100

    // Alert at 75%, 90%, and 100%
    const thresholds = [
      { percent: 75, level: 'warning' },
      { percent: 90, level: 'critical' },
      { percent: 100, level: 'exceeded' }
    ]

    for (const threshold of thresholds) {
      if (percentSpent >= threshold.percent) {
        await supabase.from('notifications').insert({
          user_id: budget.production.project_manager_id,
          type: 'budget_alert',
          title: `Budget ${threshold.level}`,
          message: `${budget.name} is ${percentSpent.toFixed(1)}% spent (${threshold.level})`,
          link: `/budgets/${budgetId}`
        })
      }
    }
  }

  // Get budget variance analysis
  async getBudgetVariance(budgetId: string) {
    const { data } = await supabase
      .rpc('get_budget_variance', { p_budget_id: budgetId })

    return data
  }

  // Approve budget
  async approveBudget(budgetId: string, approvedBy: string) {
    const { data, error } = await supabase
      .from('budgets')
      .update({ status: 'approved' })
      .eq('id', budgetId)
      .select()
      .single()

    if (error) throw error

    // Log approval
    await supabase.from('activities').insert({
      action: 'budget_approved',
      entity_type: 'budget',
      entity_id: budgetId,
      user_id: approvedBy
    })

    return data
  }

  // Generate budget forecast
  async generateForecast(budgetId: string, daysAhead: number = 30) {
    // Get historical spending rate
    const { data: transactions } = await supabase
      .from('financial_transactions')
      .select('amount, transaction_date')
      .eq('budget_id', budgetId)
      .eq('type', 'expense')
      .order('transaction_date', { ascending: false })
      .limit(30)

    if (!transactions || transactions.length === 0) {
      return { forecast: 0, warning: 'No historical data' }
    }

    // Calculate daily average
    const totalSpent = transactions.reduce((sum: number, t) => sum + t.amount, 0)
    const dailyAverage = totalSpent / transactions.length

    // Project forward
    const forecast = dailyAverage * daysAhead

    return {
      dailyAverage,
      forecast,
      projectedTotal: totalSpent + forecast
    }
  }
}

export const budgetService = new BudgetService()
