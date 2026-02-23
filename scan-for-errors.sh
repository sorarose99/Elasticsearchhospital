#!/bin/bash

echo "🔍 Starting Comprehensive Error Scan..."
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
ISSUES_FOUND=0

echo "📋 Scanning for common error patterns..."
echo ""

# 1. Check for undefined variables
echo "1️⃣  Checking for undefined variable access..."
UNDEFINED_VARS=$(grep -r "\.length" src/components --include="*.tsx" --include="*.ts" | grep -v "Array.isArray" | grep -v "safeArray" | grep -v "//" | wc -l)
if [ $UNDEFINED_VARS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $UNDEFINED_VARS potential undefined array access${NC}"
    echo "   Run: grep -r '\.length' src/components --include='*.tsx' | grep -v 'Array.isArray'"
    ISSUES_FOUND=$((ISSUES_FOUND + UNDEFINED_VARS))
else
    echo -e "${GREEN}✅ No unsafe array access found${NC}"
fi
echo ""

# 2. Check for missing null checks
echo "2️⃣  Checking for missing null checks..."
MISSING_CHECKS=$(grep -r "\.map(" src/components --include="*.tsx" | grep -v "?" | grep -v "Array.isArray" | grep -v "safeMap" | grep -v "//" | wc -l)
if [ $MISSING_CHECKS -gt 50 ]; then
    echo -e "${YELLOW}⚠️  Found $MISSING_CHECKS potential missing null checks${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 10))
else
    echo -e "${GREEN}✅ Null checks look good${NC}"
fi
echo ""

# 3. Check for console errors
echo "3️⃣  Checking for console.error calls..."
CONSOLE_ERRORS=$(grep -r "console.error" src --include="*.tsx" --include="*.ts" | wc -l)
echo "   Found $CONSOLE_ERRORS console.error statements (informational)"
echo ""

# 4. Check for TODO comments
echo "4️⃣  Checking for TODO/FIXME comments..."
TODOS=$(grep -r "TODO\|FIXME" src --include="*.tsx" --include="*.ts" | wc -l)
if [ $TODOS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $TODOS TODO/FIXME comments${NC}"
    echo "   Run: grep -r 'TODO\|FIXME' src --include='*.tsx'"
else
    echo -e "${GREEN}✅ No TODO/FIXME comments${NC}"
fi
echo ""

# 5. Check for empty catch blocks
echo "5️⃣  Checking for empty catch blocks..."
EMPTY_CATCH=$(grep -A 1 "} catch" src -r --include="*.tsx" --include="*.ts" | grep -c "}")
if [ $EMPTY_CATCH -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found potential empty catch blocks${NC}"
else
    echo -e "${GREEN}✅ No empty catch blocks${NC}"
fi
echo ""

# 6. Check TypeScript compilation
echo "6️⃣  Running TypeScript check..."
if command -v tsc &> /dev/null; then
    tsc --noEmit 2>&1 | head -20
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
    else
        echo -e "${RED}❌ TypeScript errors found${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 5))
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript not found, skipping${NC}"
fi
echo ""

# 7. Check for duplicate keys in objects
echo "7️⃣  Checking for duplicate object keys..."
DUPLICATES=$(npm run build 2>&1 | grep "Duplicate key" | wc -l)
if [ $DUPLICATES -gt 0 ]; then
    echo -e "${RED}❌ Found $DUPLICATES duplicate keys${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + DUPLICATES))
else
    echo -e "${GREEN}✅ No duplicate keys${NC}"
fi
echo ""

# 8. Check for missing dependencies
echo "8️⃣  Checking for missing dependencies..."
MISSING_DEPS=$(npm ls 2>&1 | grep "UNMET" | wc -l)
if [ $MISSING_DEPS -gt 0 ]; then
    echo -e "${RED}❌ Found $MISSING_DEPS missing dependencies${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + MISSING_DEPS))
else
    echo -e "${GREEN}✅ All dependencies installed${NC}"
fi
echo ""

# 9. Check for large files
echo "9️⃣  Checking for large component files..."
LARGE_FILES=$(find src/components -name "*.tsx" -size +100k | wc -l)
if [ $LARGE_FILES -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $LARGE_FILES large component files (>100KB)${NC}"
    find src/components -name "*.tsx" -size +100k -exec ls -lh {} \;
else
    echo -e "${GREEN}✅ No excessively large files${NC}"
fi
echo ""

# 10. Check build
echo "🔟 Running production build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 10))
fi
echo ""

# Summary
echo "========================================"
echo "📊 SCAN SUMMARY"
echo "========================================"
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No critical issues found!${NC}"
    echo -e "${GREEN}🎉 Application is ready for testing${NC}"
else
    echo -e "${YELLOW}⚠️  Found $ISSUES_FOUND potential issues${NC}"
    echo -e "${YELLOW}📝 Review the warnings above${NC}"
fi
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo "   3. Follow: COMPREHENSIVE_UI_TEST_PLAN.md"
echo ""
