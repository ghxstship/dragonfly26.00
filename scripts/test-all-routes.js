#!/usr/bin/env node

/**
 * Zero Tolerance Route Testing Script
 * Tests all module routes to ensure no "Error Loading Data" messages appear
 * 
 * Usage:
 *   node scripts/test-all-routes.js
 * 
 * Prerequisites:
 *   - Development server must be running (npm run dev)
 *   - You must be logged in to a workspace
 *   - Update WORKSPACE_ID below with your test workspace ID
 */

const BASE_URL = 'http://localhost:3000'
const WORKSPACE_ID = 'YOUR_WORKSPACE_ID_HERE' // Update this!

const routes = {
  'Dashboard': [
    `/workspace/${WORKSPACE_ID}/dashboard/overview`,
    `/workspace/${WORKSPACE_ID}/dashboard/my-agenda`,
    `/workspace/${WORKSPACE_ID}/dashboard/my-tasks`,
    `/workspace/${WORKSPACE_ID}/dashboard/my-assets`,
  ],
  'Projects': [
    `/workspace/${WORKSPACE_ID}/projects/overview`,
    `/workspace/${WORKSPACE_ID}/projects/productions`,
    `/workspace/${WORKSPACE_ID}/projects/activations`,
    `/workspace/${WORKSPACE_ID}/projects/schedule`,
    `/workspace/${WORKSPACE_ID}/projects/tasks`,
    `/workspace/${WORKSPACE_ID}/projects/milestones`,
    `/workspace/${WORKSPACE_ID}/projects/compliance`,
    `/workspace/${WORKSPACE_ID}/projects/safety`,
  ],
  'Events': [
    `/workspace/${WORKSPACE_ID}/events/overview`,
    `/workspace/${WORKSPACE_ID}/events/all-events`,
    `/workspace/${WORKSPACE_ID}/events/activities`,
    `/workspace/${WORKSPACE_ID}/events/run-of-show`,
    `/workspace/${WORKSPACE_ID}/events/bookings`,
    `/workspace/${WORKSPACE_ID}/events/tours`,
    `/workspace/${WORKSPACE_ID}/events/itineraries`,
    `/workspace/${WORKSPACE_ID}/events/incidents`,
    `/workspace/${WORKSPACE_ID}/events/shipping-receiving`,
  ],
  'People': [
    `/workspace/${WORKSPACE_ID}/people/personnel`,
    `/workspace/${WORKSPACE_ID}/people/teams`,
    `/workspace/${WORKSPACE_ID}/people/timekeeping`,
    `/workspace/${WORKSPACE_ID}/people/training`,
    `/workspace/${WORKSPACE_ID}/people/openings`,
  ],
  'Assets': [
    `/workspace/${WORKSPACE_ID}/assets/tracking`,
    `/workspace/${WORKSPACE_ID}/assets/inventory`,
    `/workspace/${WORKSPACE_ID}/assets/maintenance`,
    `/workspace/${WORKSPACE_ID}/assets/advances`,
  ],
  'Finance': [
    `/workspace/${WORKSPACE_ID}/finance/budgets`,
    `/workspace/${WORKSPACE_ID}/finance/transactions`,
    `/workspace/${WORKSPACE_ID}/finance/invoices`,
    `/workspace/${WORKSPACE_ID}/finance/payroll`,
  ],
  'Procurement': [
    `/workspace/${WORKSPACE_ID}/procurement/orders`,
    `/workspace/${WORKSPACE_ID}/procurement/agreements`,
    `/workspace/${WORKSPACE_ID}/procurement/requisitions`,
  ],
}

console.log('╔════════════════════════════════════════════════════════════╗')
console.log('║     ZERO TOLERANCE ROUTE TESTING SCRIPT                    ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

if (WORKSPACE_ID === 'YOUR_WORKSPACE_ID_HERE') {
  console.error('❌ ERROR: Please update WORKSPACE_ID in the script first!')
  console.log('\nTo get your workspace ID:')
  console.log('1. Log in to the app')
  console.log('2. Navigate to any workspace page')
  console.log('3. Copy the UUID from the URL after /workspace/')
  console.log('4. Update the WORKSPACE_ID variable in this script\n')
  process.exit(1)
}

console.log('📋 Test Configuration:')
console.log(`   Base URL: ${BASE_URL}`)
console.log(`   Workspace ID: ${WORKSPACE_ID}`)
console.log(`   Total Routes: ${Object.values(routes).flat().length}\n`)

console.log('⚠️  PREREQUISITES:')
console.log('   1. Development server is running (npm run dev)')
console.log('   2. You are logged in to the application')
console.log('   3. You have access to the specified workspace\n')

console.log('📝 MANUAL TESTING CHECKLIST:\n')

let totalRoutes = 0
for (const [module, moduleRoutes] of Object.entries(routes)) {
  console.log(`\n${module} Module:`)
  console.log('─'.repeat(60))
  
  moduleRoutes.forEach((route, index) => {
    totalRoutes++
    const tabName = route.split('/').pop()
    console.log(`  [ ] ${tabName.padEnd(20)} ${route}`)
  })
}

console.log('\n' + '═'.repeat(60))
console.log(`\nTotal Routes to Test: ${totalRoutes}`)

console.log('\n📝 WHAT TO CHECK FOR EACH ROUTE:')
console.log('   1. Page loads without errors')
console.log('   2. No "Error loading data" messages appear')
console.log('   3. Data tables/lists render correctly (or show empty state)')
console.log('   4. No console errors related to Supabase queries')
console.log('   5. Breadcrumbs display correctly\n')

console.log('🐛 COMMON ISSUES TO WATCH FOR:')
console.log('   ❌ "Could not find a relationship between..." errors')
console.log('   ❌ "column X.Y does not exist" errors')
console.log('   ❌ "table X does not exist" errors')
console.log('   ❌ Network errors with 400/500 status codes\n')

console.log('✅ EXPECTED BEHAVIOR:')
console.log('   • Empty states are OK (no data is fine)')
console.log('   • Loading spinners are OK (should finish)')
console.log('   • "No items found" messages are OK\n')

console.log('🔍 HOW TO TEST:')
console.log('   1. Open your browser to http://localhost:3000')
console.log('   2. Open Developer Tools (F12)')
console.log('   3. Go to Console tab to watch for errors')
console.log('   4. Visit each route listed above')
console.log('   5. Check the box [ ] once verified')
console.log('   6. Report any errors found\n')

console.log('📊 AUTOMATED CHECKS (Future):')
console.log('   • Implement Playwright/Cypress tests')
console.log('   • Add Supabase query mocking')
console.log('   • Create CI/CD integration tests\n')

console.log('═'.repeat(60))
console.log('Press Ctrl+C when testing is complete\n')
