#!/bin/bash

echo "🚀 Deploying Hospital Management System to Vercel..."
echo ""

# Deploy to Vercel
echo "📦 Starting deployment..."
vercel --prod \
  -e VITE_FIREBASE_API_KEY=AIzaSyApeskv8wZQkuI6IW2t6iTbPMvc9fuLxsw \
  -e VITE_FIREBASE_AUTH_DOMAIN=kirogames-9b218.firebaseapp.com \
  -e VITE_FIREBASE_PROJECT_ID=kirogames-9b218 \
  -e VITE_FIREBASE_STORAGE_BUCKET=kirogames-9b218.firebasestorage.app \
  -e VITE_FIREBASE_MESSAGING_SENDER_ID=336305648541 \
  -e VITE_FIREBASE_APP_ID=1:336305648541:web:4ec200880d9a6afa347574 \
  -e VITE_FIREBASE_MEASUREMENT_ID=G-CSNKQYYNE4

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should be live at the URL shown above"
echo ""
echo "📝 Next steps:"
echo "1. Update Firebase Authentication settings to allow your Vercel domain"
echo "2. Test the application at your Vercel URL"
echo "3. Configure custom domain if needed"
