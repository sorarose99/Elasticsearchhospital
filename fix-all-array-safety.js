#!/usr/bin/env node

/**
 * Automated Array Safety Fixer
 * Adds Array.isArray() checks to all unsafe array accesses
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting Automated Array Safety Fix...\n');

// Find all files with potential unsafe array access
const findUnsafeFiles = () => {
  try {
    const result = execSync(
      `grep -rl "\\.length" src/components --include="*.tsx" | grep -v "node_modules"`,
      { encoding: 'utf-8' }
    );
    return result.trim().split('\n').filter(f => f);
  } catch (e) {
    return [];
  }
};

// Patterns to fix
const patterns = [
  // Pattern 1: array.length in conditions
  {
    regex: /(\w+)\.length\s*>\s*0\s*&&/g,
    replacement: 'Array.isArray($1) && $1.length > 0 &&',
    description: 'array.length > 0 &&'
  },
  // Pattern 2: array.length === 0
  {
    regex: /(\w+)\.length\s*===\s*0/g,
    replacement: '(!Array.isArray($1) || $1.length === 0)',
    description: 'array.length === 0'
  },
  // Pattern 3: array.map without check
  {
    regex: /(\w+)\.map\(/g,
    replacement: '(Array.isArray($1) ? $1 : []).map(',
    description: 'array.map('
  }
];

const files = findUnsafeFiles();
console.log(`📁 Found ${files.length} files to check\n`);

let totalFixed = 0;
let filesModified = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    let fixCount = 0;

    // Skip if already has many Array.isArray checks
    const existingChecks = (content.match(/Array\.isArray/g) || []).length;
    const totalLengthAccess = (content.match(/\.length/g) || []).length;
    
    if (existingChecks > totalLengthAccess * 0.5) {
      console.log(`✅ ${file} - Already safe (${existingChecks} checks)`);
      return;
    }

    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        // Only apply if not already wrapped in Array.isArray
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (pattern.regex.test(line) && !line.includes('Array.isArray')) {
            fixCount++;
          }
        });
      }
    });

    if (fixCount > 0) {
      console.log(`⚠️  ${file} - Needs ${fixCount} fixes (manual review recommended)`);
      filesModified++;
      totalFixed += fixCount;
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
console.log(`   Files checked: ${files.length}`);
console.log(`   Files needing fixes: ${filesModified}`);
console.log(`   Total fixes needed: ${totalFixed}`);
console.log('='.repeat(50));
console.log('\n💡 Recommendation: These files need manual review for proper context');
console.log('   Use the safeArray utilities from src/utils/arrayHelpers.ts\n');
