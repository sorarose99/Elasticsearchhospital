# Deployment Guide 🚀

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **One-Click Deploy**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sorarose99/Hospitalmangement)

2. **Manual Deploy**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Environment Variables Required

Copy these from your Firebase Console:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase project created and configured
- [ ] Firestore Database enabled
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Build runs successfully (`npm run build`)
- [ ] No console errors in production build

## Post-Deployment Steps

1. **Test the deployment**
   - Visit your deployed URL
   - Test login with demo accounts
   - Verify all modules load correctly

2. **Enable Firebase Services**
   - Go to Firebase Console
   - Enable Firestore Database
   - Enable Authentication
   - Set up Firestore security rules

3. **Monitor**
   - Check Firebase Console for errors
   - Monitor Analytics
   - Review user feedback

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Ensure all variables start with `VITE_`
- Restart dev server after changing `.env`
- Check Vercel/Netlify dashboard for correct values

### Firebase Connection Issues
- Verify Firebase config in `.env`
- Check Firebase project is active
- Ensure Firestore and Auth are enabled

## Support

For deployment issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
