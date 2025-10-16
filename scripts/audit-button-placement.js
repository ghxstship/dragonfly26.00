#!/usr/bin/env node
/**
 * Audit Script: Verify ALL tabs have create buttons in CORRECT position
 * 
 * CORRECT PATTERN (Image 1 - Finance/Transactions):
 * return (
 *   <div className="space-y-6">
 *     {/* Action Buttons - Standard Positioning *\/}
 *     <div className="flex items-center justify-between">
 *       <p className="text-muted-foreground">Description</p>
 *       <div className="flex gap-2">
 *         <Button>Create</Button>
 *       </div>
 *     </div>
 *     {/* THEN cards/content *\/}
 *   </div>
 * )
 * 
 * INCORRECT: Button inside CardHeader, button after summary cards
 */

const fs = require('fs')
const path = require('path')
const { glob } = require('glob')

const COMPONENTS_DIR = path.join(__dirname, '../src/components')

// Patterns to detect
const CORRECT_PATTERN_COMMENT = /\/\*\s*Action Buttons - Standard Positioning\s*\*\//
const BUTTON_IN_CARDHEADER = /<CardHeader[\s\S]*?<Button/
const BUTTON_AFTER_GRID = /<div className="grid[\s\S]{0,500}<Button/

async function auditTabs() {
  const tabFiles = await glob(`${COMPONENTS_DIR}/**/*-tab.tsx`)
  
  const results = {
    correct: [],
    incorrectPlacement: [],
    missingButton: [],
    noStandardComment: []
  }
  
  for (const file of tabFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const relativePath = path.relative(COMPONENTS_DIR, file)
    
    // Skip if using EnhancedTableView (those are handled automatically)
    if (content.includes('EnhancedTableView')) {
      results.correct.push({
        file: relativePath,
        reason: 'Uses EnhancedTableView (automatic positioning)'
      })
      continue
    }
    
    // Check for create button
    const hasButton = content.match(/<Button[^>]*>([\s\S]*?)(Plus|New |Create |Add )/i)
    if (!hasButton) {
      results.missingButton.push(relativePath)
      continue
    }
    
    // Check for standard positioning comment
    if (!CORRECT_PATTERN_COMMENT.test(content)) {
      results.noStandardComment.push(relativePath)
    }
    
    // Check if button is in CardHeader (INCORRECT)
    if (BUTTON_IN_CARDHEADER.test(content)) {
      results.incorrectPlacement.push({
        file: relativePath,
        issue: 'Button inside CardHeader - should be at top before cards'
      })
      continue
    }
    
    // Check if button comes after grid of cards (INCORRECT)
    const returnMatch = content.match(/return\s*\([\s\S]*?\)/s)
    if (returnMatch) {
      const returnBlock = returnMatch[0]
      const gridIndex = returnBlock.indexOf('className="grid')
      const buttonIndex = returnBlock.search(/<Button[^>]*>\s*<Plus/)
      
      if (gridIndex !== -1 && buttonIndex !== -1 && buttonIndex > gridIndex) {
        results.incorrectPlacement.push({
          file: relativePath,
          issue: 'Button appears after grid cards - should be before'
        })
        continue
      }
    }
    
    results.correct.push({
      file: relativePath,
      reason: 'Appears correct (needs manual verification)'
    })
  }
  
  // Print Report
  console.log('\n========================================')
  console.log('BUTTON PLACEMENT AUDIT REPORT')
  console.log('========================================\n')
  
  console.log(`Total Tabs Audited: ${tabFiles.length}\n`)
  
  console.log(`✅ CORRECT: ${results.correct.length}`)
  results.correct.forEach(item => {
    console.log(`  - ${item.file} ${item.reason ? `(${item.reason})` : ''}`)
  })
  
  console.log(`\n❌ INCORRECT PLACEMENT: ${results.incorrectPlacement.length}`)
  results.incorrectPlacement.forEach(item => {
    console.log(`  - ${item.file}`)
    console.log(`    Issue: ${item.issue}`)
  })
  
  console.log(`\n⚠️  MISSING BUTTON: ${results.missingButton.length}`)
  results.missingButton.forEach(file => {
    console.log(`  - ${file}`)
  })
  
  console.log(`\n⚠️  NO STANDARD COMMENT: ${results.noStandardComment.length}`)
  results.noStandardComment.forEach(file => {
    console.log(`  - ${file}`)
  })
  
  console.log('\n========================================\n')
  
  // Exit with error if any issues found
  if (results.incorrectPlacement.length > 0) {
    console.error('❌ AUDIT FAILED: Incorrect button placements found')
    process.exit(1)
  }
  
  console.log('✅ AUDIT PASSED: All buttons correctly positioned')
  process.exit(0)
}

auditTabs().catch(console.error)
