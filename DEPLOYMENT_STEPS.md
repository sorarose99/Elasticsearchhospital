# Deployment Steps

## ✅ Step 1: GitHub - COMPLETED
Your code has been successfully pushed to: https://github.com/sorarose99/Hospitalmangement

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

Run this command in your terminal:

```bash
vercel
```

Follow the prompts:
1. Set up and deploy? → Yes
2. Which scope? → Select your account
3. Link to existing project? → No
4. What's your project's name? → hospitalmangement (or your preferred name)
5. In which directory is your code located? → ./
6. Want to override the settings? → No

Then deploy to production:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import from GitHub: `sorarose99/Hospitalmangement`
3. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables (from your .env file):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
5. Click "Deploy"

## Step 3: Configure Environment Variables

After deployment, add your Firebase credentials:

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

Or add them via the Vercel Dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add each variable

## Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

## Important Notes

- Make sure your Firebase project allows your Vercel domain in authorized domains
- Update Firebase Authentication settings to include your Vercel URL
- The app will be available at: `https://your-project-name.vercel.app`

## Troubleshooting

If you encounter issues:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure Firebase configuration is correct
4. Check that all dependencies are in package.json
