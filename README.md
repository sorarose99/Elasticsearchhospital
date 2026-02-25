# Hospital Management System 🏥

A comprehensive, bilingual hospital management system built with React, TypeScript, and Firebase.

## ✨ Features

### Core Modules
- 👥 **Patient Management** - Complete patient records and history
- 📅 **Appointment Scheduling** - Smart booking system with conflict detection
- 🔬 **Laboratory Management** - Test orders and results tracking
- 💊 **Pharmacy Management** - Medication inventory and prescriptions
- 🩻 **Radiology Management** - Imaging orders and reports
- 💰 **Billing & Insurance** - Invoice generation and payment tracking
- 👨‍⚕️ **Staff Management** - Employee records and scheduling
- 📊 **Reports & Analytics** - Comprehensive dashboards and insights

### User Experience
- 🌍 **Bilingual Support** - Full English/Arabic interface
- 🌙 **Dark Mode** - Eye-friendly dark theme
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Secure Authentication** - Firebase Auth + Local mode
- ⚡ **Offline Support** - Works without internet connection

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Firebase (Authentication, Firestore, Storage, Analytics)
- **Styling**: Tailwind CSS, Radix UI Components
- **Charts**: Recharts
- **State Management**: React Context API
- **Routing**: React Router v6

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/sorarose99/Hospitalmangement.git
cd Hospitalmangement

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Copy your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Local Mode

The system works without Firebase in local mode using browser localStorage. Perfect for development and testing.

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sorarose99/Hospitalmangement)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env`
4. Deploy!

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 👤 Demo Accounts

### Admin Account
- Email: `admin@clinic.com`
- Password: `admin123`

### Doctor Account
- Email: `doctor@clinic.com`
- Password: `doctor123`

### Receptionist Account
- Email: `reception@clinic.com`
- Password: `reception123`

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── admin/        # Admin dashboard
│   ├── auth/         # Authentication
│   ├── dashboards/   # Role-based dashboards
│   └── ...
├── config/           # Firebase & app configuration
├── hooks/            # Custom React hooks
├── services/         # API services
├── translations/     # i18n translations
└── utils/            # Utility functions
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

This is a private project. For access or contributions, please contact the repository owner.

## 📄 License

Private - All rights reserved

## 🆘 Support

For issues or questions, please open an issue on GitHub or contact the development team.
