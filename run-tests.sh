#!/bin/bash

# Hospital Management System - Test Runner Script
# Runs all tests and generates reports

echo "🧪 Hospital Management System - Test Suite"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
fi

# Check if testing dependencies are installed
if ! npm list vitest > /dev/null 2>&1; then
    echo "${YELLOW}⚠️  Testing dependencies not found. Installing...${NC}"
    npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
fi

echo ""
echo "📋 Running Test Suites..."
echo ""

# Run Firebase Integration Tests
echo "1️⃣  Firebase Integration Tests"
echo "--------------------------------"
npm run test:firebase
FIREBASE_EXIT=$?

echo ""
echo "2️⃣  Component Tests"
echo "--------------------------------"
npm run test:components
COMPONENT_EXIT=$?

echo ""
echo "3️⃣  E2E Workflow Tests"
echo "--------------------------------"
npm run test:e2e
E2E_EXIT=$?

echo ""
echo "📊 Generating Coverage Report..."
echo "--------------------------------"
npm run test:coverage
COVERAGE_EXIT=$?

echo ""
echo "=========================================="
echo "📈 Test Results Summary"
echo "=========================================="
echo ""

# Check results
if [ $FIREBASE_EXIT -eq 0 ]; then
    echo "${GREEN}✅ Firebase Integration Tests: PASSED${NC}"
else
    echo "${RED}❌ Firebase Integration Tests: FAILED${NC}"
fi

if [ $COMPONENT_EXIT -eq 0 ]; then
    echo "${GREEN}✅ Component Tests: PASSED${NC}"
else
    echo "${RED}❌ Component Tests: FAILED${NC}"
fi

if [ $E2E_EXIT -eq 0 ]; then
    echo "${GREEN}✅ E2E Workflow Tests: PASSED${NC}"
else
    echo "${RED}❌ E2E Workflow Tests: FAILED${NC}"
fi

if [ $COVERAGE_EXIT -eq 0 ]; then
    echo "${GREEN}✅ Coverage Report: GENERATED${NC}"
else
    echo "${YELLOW}⚠️  Coverage Report: INCOMPLETE${NC}"
fi

echo ""
echo "=========================================="

# Overall result
if [ $FIREBASE_EXIT -eq 0 ] && [ $COMPONENT_EXIT -eq 0 ] && [ $E2E_EXIT -eq 0 ]; then
    echo "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo ""
    echo "Coverage report available at: coverage/index.html"
    exit 0
else
    echo "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please review the test output above for details."
    exit 1
fi
