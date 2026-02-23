# Hospital Management System

A comprehensive hospital management system built with React, TypeScript, and Firebase.

## Features

- Patient Management
- Appointment Scheduling
- Laboratory Management
- Pharmacy Management
- Radiology Management
- Billing & Insurance
- Staff Management
- Reports & Analytics
- Bilingual Support (English/Arabic)
- Dark Mode Support

## Tech Stack

- React 18
- TypeScript
- Vite
- Firebase (Authentication & Firestore)
- Tailwind CSS
- Radix UI Components
- Recharts for Analytics

## Deployment

### Deploy to Vercel

1. Push your code to GitHub (already done)
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Import from GitHub: `sorarose99/Hospitalmangement`
5. Configure environment variables from `.env.example`
6. Click "Deploy"

### Environment Variables Required

```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Demo Accounts

See `src/constants/demoAccounts.ts` for demo login credentials.

## License

Private - All rights reserved
