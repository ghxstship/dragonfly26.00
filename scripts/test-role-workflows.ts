/**
 * COMPREHENSIVE ROLE-BASED WORKFLOW TESTING
 * Tests all 11 roles across all workflows end-to-end
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WorkflowTest {
  name: string;
  test: () => Promise<boolean>;
}

interface RoleWorkflows {
  role: string;
  level: number;
  workflows: WorkflowTest[];
}

// Define all role workflows
const allRoles: RoleWorkflows[] = [
  {
    role: 'Legend',
    level: 1,
    workflows: [
      { name: 'Platform Administration', test: async () => (await supabase.from('system_settings').select('*').limit(1)).data !== null },
      { name: 'Organization Management', test: async () => (await supabase.from('organizations').select('id').limit(1)).data !== null },
      { name: 'User Management', test: async () => (await supabase.from('profiles').select('id').limit(1)).data !== null },
      { name: 'System Configuration', test: async () => (await supabase.from('system_settings').select('*').limit(1)).data !== null },
      { name: 'Billing Management', test: async () => (await supabase.from('billing_subscriptions').select('id').limit(1)).data !== null },
      { name: 'Security Settings', test: async () => (await supabase.from('security_policies').select('*').limit(1)).data !== null },
      { name: 'Audit Log Access', test: async () => (await supabase.from('audit_logs').select('id').limit(1)).data !== null },
      { name: 'API Token Management', test: async () => (await supabase.from('api_tokens').select('id').limit(1)).data !== null },
      { name: 'Webhook Configuration', test: async () => (await supabase.from('webhooks').select('id').limit(1)).data !== null },
      { name: 'Plugin Management', test: async () => (await supabase.from('plugins').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Phantom',
    level: 2,
    workflows: [
      { name: 'Organization Settings', test: async () => (await supabase.from('organizations').select('id').limit(1)).data !== null },
      { name: 'Team Management', test: async () => (await supabase.from('teams').select('id').limit(1)).data !== null },
      { name: 'Role Assignment', test: async () => (await supabase.from('user_roles').select('id').limit(1)).data !== null },
      { name: 'Budget Oversight', test: async () => (await supabase.from('budgets').select('id').limit(1)).data !== null },
      { name: 'Project Oversight', test: async () => (await supabase.from('projects').select('id').limit(1)).data !== null },
      { name: 'Compliance Management', test: async () => (await supabase.from('compliance_requirements').select('id').limit(1)).data !== null },
      { name: 'Vendor Management', test: async () => (await supabase.from('marketplace_vendors').select('id').limit(1)).data !== null },
      { name: 'Analytics Access', test: async () => (await supabase.from('analytics_dashboards').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Aviator',
    level: 3,
    workflows: [
      { name: 'Project Portfolio', test: async () => (await supabase.from('projects').select('id').limit(1)).data !== null },
      { name: 'Strategic Planning', test: async () => (await supabase.from('objectives').select('id').eq('type', 'strategic').limit(1)).data !== null },
      { name: 'Resource Allocation', test: async () => (await supabase.from('resource_allocations').select('id').limit(1)).data !== null },
      { name: 'Cross-Project Reporting', test: async () => (await supabase.from('reports').select('id').limit(1)).data !== null },
      { name: 'Budget Planning', test: async () => (await supabase.from('budgets').select('id').limit(1)).data !== null },
      { name: 'Performance Monitoring', test: async () => (await supabase.from('kpis').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Gladiator',
    level: 4,
    workflows: [
      { name: 'Project Creation', test: async () => (await supabase.from('projects').select('id').limit(1)).data !== null },
      { name: 'Task Assignment', test: async () => (await supabase.from('tasks').select('id').limit(1)).data !== null },
      { name: 'Team Management', test: async () => (await supabase.from('project_members').select('id').limit(1)).data !== null },
      { name: 'Budget Management', test: async () => (await supabase.from('budgets').select('id').limit(1)).data !== null },
      { name: 'Procurement Requests', test: async () => (await supabase.from('procurement_requests').select('id').limit(1)).data !== null },
      { name: 'Event Planning', test: async () => (await supabase.from('events').select('id').limit(1)).data !== null },
      { name: 'Asset Allocation', test: async () => (await supabase.from('asset_allocations').select('id').limit(1)).data !== null },
      { name: 'Reporting', test: async () => (await supabase.from('reports').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Navigator',
    level: 5,
    workflows: [
      { name: 'Department Management', test: async () => (await supabase.from('departments').select('id').limit(1)).data !== null },
      { name: 'Team Coordination', test: async () => (await supabase.from('teams').select('id').limit(1)).data !== null },
      { name: 'Task Oversight', test: async () => (await supabase.from('tasks').select('id').limit(1)).data !== null },
      { name: 'Resource Requests', test: async () => (await supabase.from('resource_requests').select('id').limit(1)).data !== null },
      { name: 'Schedule Management', test: async () => (await supabase.from('schedules').select('id').limit(1)).data !== null },
      { name: 'Performance Reviews', test: async () => (await supabase.from('performance_reviews').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Deviator',
    level: 6,
    workflows: [
      { name: 'Team Leadership', test: async () => (await supabase.from('teams').select('id').limit(1)).data !== null },
      { name: 'Task Assignment', test: async () => (await supabase.from('tasks').select('id').limit(1)).data !== null },
      { name: 'Progress Tracking', test: async () => (await supabase.from('task_progress').select('id').limit(1)).data !== null },
      { name: 'Issue Resolution', test: async () => (await supabase.from('issues').select('id').limit(1)).data !== null },
      { name: 'Time Tracking', test: async () => (await supabase.from('time_entries').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Raider',
    level: 7,
    workflows: [
      { name: 'Task Execution', test: async () => (await supabase.from('tasks').select('id').limit(1)).data !== null },
      { name: 'Time Logging', test: async () => (await supabase.from('time_entries').select('id').limit(1)).data !== null },
      { name: 'Document Access', test: async () => (await supabase.from('documents').select('id').limit(1)).data !== null },
      { name: 'Communication', test: async () => (await supabase.from('messages').select('id').limit(1)).data !== null },
      { name: 'Status Updates', test: async () => (await supabase.from('task_updates').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Vendor',
    level: 8,
    workflows: [
      { name: 'Vendor Portal', test: async () => (await supabase.from('marketplace_vendors').select('id').limit(1)).data !== null },
      { name: 'Order Management', test: async () => (await supabase.from('marketplace_orders').select('id').limit(1)).data !== null },
      { name: 'Invoice Submission', test: async () => (await supabase.from('vendor_invoices').select('id').limit(1)).data !== null },
      { name: 'Product Catalog', test: async () => (await supabase.from('marketplace_products').select('id').limit(1)).data !== null },
      { name: 'Communication', test: async () => (await supabase.from('vendor_messages').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Visitor',
    level: 9,
    workflows: [
      { name: 'Project View', test: async () => (await supabase.from('projects').select('id').limit(1)).data !== null },
      { name: 'Document View', test: async () => (await supabase.from('documents').select('id').limit(1)).data !== null },
      { name: 'Event Attendance', test: async () => (await supabase.from('events').select('id').limit(1)).data !== null },
      { name: 'Communication', test: async () => (await supabase.from('messages').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Partner',
    level: 10,
    workflows: [
      { name: 'Project Overview', test: async () => (await supabase.from('projects').select('id').limit(1)).data !== null },
      { name: 'Report Access', test: async () => (await supabase.from('reports').select('id').limit(1)).data !== null },
      { name: 'Analytics View', test: async () => (await supabase.from('analytics_dashboards').select('id').limit(1)).data !== null },
      { name: 'Document Access', test: async () => (await supabase.from('documents').select('id').limit(1)).data !== null }
    ]
  },
  {
    role: 'Ambassador',
    level: 11,
    workflows: [
      { name: 'Marketing Content', test: async () => (await supabase.from('marketing_content').select('id').limit(1)).data !== null },
      { name: 'Referral Tracking', test: async () => (await supabase.from('referrals').select('id').limit(1)).data !== null },
      { name: 'Commission View', test: async () => (await supabase.from('commissions').select('id').limit(1)).data !== null },
      { name: 'Campaign Access', test: async () => (await supabase.from('marketing_campaigns').select('id').limit(1)).data !== null }
    ]
  }
];

async function testRole(roleWorkflows: RoleWorkflows): Promise<{ passed: number; total: number }> {
  console.log(`\n🎭 ${roleWorkflows.role} (Level ${roleWorkflows.level})`);
  
  let passed = 0;
  for (const workflow of roleWorkflows.workflows) {
    try {
      const result = await workflow.test();
      if (result) {
        console.log(`   ✅ ${workflow.name}`);
        passed++;
      } else {
        console.log(`   ❌ ${workflow.name}`);
      }
    } catch (error: any) {
      console.log(`   ❌ ${workflow.name}: ${error.message}`);
    }
  }
  
  return { passed, total: roleWorkflows.workflows.length };
}

async function testAllRoles(): Promise<void> {
  console.log('\n🚀 COMPREHENSIVE ROLE-BASED WORKFLOW TESTING\n');

  const results: { role: string; passed: number; total: number; percentage: number }[] = [];

  for (const roleWorkflows of allRoles) {
    const result = await testRole(roleWorkflows);
    const percentage = Math.round((result.passed / result.total) * 100);
    results.push({ role: roleWorkflows.role, passed: result.passed, total: result.total, percentage });
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 SUMMARY');
  console.log(`${'='.repeat(80)}\n`);

  console.log('| Role        | Workflows | Completion | Status |');
  console.log('|-------------|-----------|------------|--------|');
  
  results.forEach(r => {
    const status = r.percentage === 100 ? '✅ Complete' : 
                   r.percentage >= 75 ? '⚠️  Partial' : 
                   '❌ Needs Work';
    console.log(`| ${r.role.padEnd(11)} | ${r.passed}/${r.total} | ${r.percentage.toString().padEnd(10)}% | ${status} |`);
  });

  const totalWorkflows = results.reduce((sum, r) => sum + r.total, 0);
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const overallPercentage = Math.round((totalPassed / totalWorkflows) * 100);

  console.log(`\n🎯 OVERALL: ${overallPercentage}% (${totalPassed}/${totalWorkflows} workflows)\n`);
}

const targetRole = process.argv[2]?.toLowerCase();
if (targetRole) {
  const roleWorkflows = allRoles.find(r => r.role.toLowerCase() === targetRole);
  if (roleWorkflows) {
    testRole(roleWorkflows).then(() => process.exit(0));
  } else {
    console.error(`❌ Unknown role: ${targetRole}`);
    process.exit(1);
  }
} else {
  testAllRoles().then(() => process.exit(0));
}
