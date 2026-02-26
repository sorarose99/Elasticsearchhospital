#!/bin/bash

# Update Vercel URL Script
# Usage: ./update-vercel-url.sh <new-vercel-url>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the new Vercel URL"
    echo "Usage: ./update-vercel-url.sh https://elasticsearchhospital-xyz.vercel.app"
    exit 1
fi

NEW_URL="$1"
OLD_URL="https://hospitalmangement-main-fp19dhx1d-sorarose99s-projects.vercel.app"

echo "🔄 Updating Vercel URL in all documentation files..."
echo "Old URL: $OLD_URL"
echo "New URL: $NEW_URL"
echo ""

# List of files to update
FILES=(
    "README.md"
    "README_HACKATHON.md"
    "DEPLOYMENT_COMPLETE.md"
    "ALL_SUBMISSIONS_READY.md"
    "DEVPOST_COMPLETE_SUBMISSION.md"
    "QUICK_START.md"
    "FINAL_STATUS.md"
    "WINNING_SUMMARY.md"
    "HACKATHON_SUBMISSION.md"
    "SUBMISSION_READY.md"
    "VERCEL_DEPLOYMENT_READY.md"
)

# Update each file
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Updating $file..."
        sed -i.bak "s|$OLD_URL|$NEW_URL|g" "$file"
        rm "${file}.bak"
        echo "   ✅ Updated"
    else
        echo "   ⚠️  File not found: $file"
    fi
done

echo ""
echo "✅ All files updated!"
echo ""
echo "📋 Next steps:"
echo "1. Verify changes: git diff"
echo "2. Commit changes: git add . && git commit -m 'Update Vercel URL'"
echo "3. Push to GitHub: git push hackathon main"
echo "4. Test new URL: $NEW_URL"
echo "5. Submit to Devpost!"
