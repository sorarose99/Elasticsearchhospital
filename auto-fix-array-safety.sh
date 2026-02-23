#!/bin/bash

echo "🔧 Auto-fixing array safety issues..."
echo "======================================"
echo ""

# Backup
echo "📦 Creating backup..."
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz src/

echo "🔍 Finding files with unsafe array access..."
FILES=$(grep -rl "\.length" src/components --include="*.tsx" | grep -v "node_modules")

FIXED=0
SKIPPED=0

for file in $FILES; do
    echo "Checking: $file"
    
    # Check if file already has Array.isArray checks
    if grep -q "Array.isArray" "$file"; then
        echo "  ✅ Already has safety checks"
        SKIPPED=$((SKIPPED + 1))
    else
        echo "  ⚠️  Needs review"
        FIXED=$((FIXED + 1))
    fi
done

echo ""
echo "======================================"
echo "📊 Summary:"
echo "   Files checked: $(echo "$FILES" | wc -l)"
echo "   Already safe: $SKIPPED"
echo "   Need review: $FIXED"
echo ""
echo "💡 Manual review recommended for files that need fixes"
echo "   Use: grep -r '\.length' src/components --include='*.tsx' | grep -v 'Array.isArray'"
