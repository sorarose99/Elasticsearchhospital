# Hospital Management System - Deployment Guide

## 🚀 Complete Setup for Production-Ready Dynamic System

### Overview
This guide will help you deploy a fully dynamic hospital management system with:
- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Real-time Updates**: WebSocket connections
- **File Storage**: Secure file uploads and management
- **API**: RESTful API with comprehensive endpoints

---

## 📋 Prerequisites

### 1. **Accounts Required**
- [Supabase Account](https://supabase.com) (Free tier available)
- [Vercel Account](https://vercel.com) or similar hosting (Optional)

### 2. **Local Development Tools**
```bash
# Node.js (v18 or higher)
node --version

# Supabase CLI
npm install -g @supabase/cli

# Git
git --version
```

---

## 🏗️ Step 1: Supabase Setup

### 1.1 Create New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and set project details:
   - **Name**: `hospital-management-prod`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users

### 1.2 Database Configuration
```sql
-- Run this in Supabase SQL Editor
-- This will create all necessary tables and relationships

-- Copy the entire content from /supabase/migrations/001_create_hospital_tables.sql
-- and paste it in the SQL Editor, then click "Run"
```

### 1.3 Authentication Setup
1. Go to **Authentication > Settings**
2. Configure:
   - **Site URL**: `https://your-domain.com` (or `http://localhost:3000` for development)
   - **Redirect URLs**: Add your domain URLs
   - **JWT expiry**: 3600 seconds (1 hour)

### 1.4 Storage Setup
1. Go to **Storage**
2. Create bucket: `hospital-files`
3. Set bucket to **Private**
4. Configure RLS policies:
```sql
-- Storage policies for file uploads
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view files" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');
```

### 1.5 Edge Functions Deployment
```bash
# Initialize Supabase locally
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy edge functions
supabase functions deploy hospital-api --project-ref YOUR_PROJECT_REF
```

---

## 🌐 Step 2: Frontend Configuration

### 2.1 Environment Variables
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Configuration
NEXT_PUBLIC_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/hospital-api

# Optional: External integrations
NEXT_PUBLIC_HL7_ENDPOINT=your_hl7_endpoint
NEXT_PUBLIC_DICOM_SERVER=your_dicom_server
```

### 2.2 Update API Service Configuration
```typescript
// Update /services/ApiService.tsx
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/hospital-api';
```

### 2.3 Install Dependencies
```bash
npm install
# or
yarn install
```

---

## 🔧 Step 3: Backend API Setup

### 3.1 Deploy Edge Functions
The hospital API is already created in `/supabase/functions/server/hospital-api.tsx`. Deploy it:

```bash
# Deploy the edge function
supabase functions deploy hospital-api

# Test the deployment
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/hospital-api/health
```

### 3.2 Database Migrations
Run the migration script to create all tables:

```bash
# Apply migrations
supabase db push

# Or manually run the SQL script in Supabase dashboard
```

---

## 📊 Step 4: Sample Data (Optional)

### 4.1 Create Sample Data Script
```sql
-- Insert sample data for testing
-- Run this in Supabase SQL Editor

-- Sample Staff (Doctors, Nurses, etc.)
INSERT INTO public.staff (employee_id, first_name, last_name, email, phone, role, department, specialization, hire_date) VALUES
('EMP001', 'Ahmed', 'Hassan', 'ahmed@hospital.com', '+966501234567', 'doctor', 'Cardiology', 'Cardiologist', '2023-01-15'),
('EMP002', 'Sarah', 'Mohamed', 'sarah@hospital.com', '+966502345678', 'nurse', 'Emergency', 'Emergency Nursing', '2023-02-20'),
('EMP003', 'Omar', 'Ali', 'omar@hospital.com', '+966503456789', 'receptionist', 'Front Desk', null, '2023-03-10'),
('EMP004', 'Fatima', 'Khan', 'fatima@hospital.com', '+966504567890', 'lab_tech', 'Laboratory', 'Clinical Lab Tech', '2023-04-05');

-- Sample Patients
INSERT INTO public.patients (patient_number, first_name, last_name, date_of_birth, gender, phone, email, address, blood_type) VALUES
('P001', 'Mohammad', 'Abdullah', '1985-05-15', 'male', '+966551234567', 'mohammad@email.com', 'Riyadh, Saudi Arabia', 'A+'),
('P002', 'Aisha', 'Salem', '1990-08-22', 'female', '+966552345678', 'aisha@email.com', 'Jeddah, Saudi Arabia', 'B+'),
('P003', 'Khalid', 'Ahmed', '1978-12-10', 'male', '+966553456789', 'khalid@email.com', 'Dammam, Saudi Arabia', 'O+');

-- Sample Insurance Providers
INSERT INTO public.insurance_providers (name, code, contact_person, phone, email, coverage_percentage) VALUES
('Bupa Arabia', 'BUPA', 'John Smith', '+966501112233', 'contact@bupa.com.sa', 90),
('National Insurance', 'NIC', 'Ahmad Mohammad', '+966502223344', 'info@nic.com.sa', 80),
('Saudi Enaya', 'ENAYA', 'Sara Ahmed', '+966503334455', 'support@enaya.com.sa', 85);
```

---

## 🚀 Step 5: Production Deployment

### 5.1 Build and Test Locally
```bash
# Build the application
npm run build

# Test the production build
npm start
```

### 5.2 Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - NEXT_PUBLIC_API_URL
```

### 5.3 Alternative: Deploy to Other Platforms
- **Netlify**: Connect GitHub repo and set build commands
- **AWS Amplify**: Use the Amplify console
- **DigitalOcean**: Use App Platform
- **Self-hosted**: Use Docker with provided Dockerfile

---

## 🔒 Step 6: Security Configuration

### 6.1 Database Security
1. **Row Level Security (RLS)**: Already enabled in migration
2. **API Keys**: Keep service role key secure
3. **Database Access**: Restrict to necessary IPs

### 6.2 Application Security
```typescript
// Update CORS settings in edge function
app.use('*', cors({
  origin: ['https://your-production-domain.com'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

### 6.3 Authentication Security
1. Configure JWT expiry times
2. Set up MFA (Multi-Factor Authentication)
3. Configure session timeout
4. Set up audit logging

---

## 📈 Step 7: Monitoring and Analytics

### 7.1 Supabase Monitoring
1. Go to **Settings > API** - Monitor API usage
2. **Database** - Monitor query performance
3. **Storage** - Monitor file storage usage

### 7.2 Application Monitoring
```typescript
// Add error tracking service (optional)
// Sentry, LogRocket, or similar

// Add performance monitoring
// New Relic, DataDog, or similar
```

---

## 🔄 Step 8: Real-time Updates

### 8.1 Enable Realtime
1. Go to **Database > Replication**
2. Enable realtime for tables:
   - `patients`
   - `appointments` 
   - `lab_orders`
   - `nursing_tasks`

### 8.2 Test Real-time Features
```typescript
// The application already includes real-time subscriptions
// Test by opening multiple browser tabs and making changes
```

---

## 🧪 Step 9: Testing

### 9.1 API Testing
```bash
# Test authentication
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/hospital-api/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@hospital.com", "password": "secure_password"}'

# Test patient creation
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/hospital-api/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"first_name": "Test", "last_name": "Patient", "date_of_birth": "1990-01-01", "gender": "male", "phone": "+1234567890"}'
```

### 9.2 Frontend Testing
```bash
# Run tests
npm test

# E2E tests (if configured)
npm run test:e2e
```

---

## 📚 Step 10: Documentation and Training

### 10.1 User Roles and Permissions
- **Admin**: Full system access
- **Doctor**: Patient records, appointments, prescriptions
- **Nurse**: Patient care, vital signs, nursing tasks
- **Receptionist**: Appointments, patient registration, billing
- **Lab Tech**: Lab orders, results entry
- **Pharmacist**: Pharmacy orders, inventory
- **Radiologist**: Radiology orders, image management

### 10.2 User Training Materials
Create documentation for:
1. **Getting Started Guide**
2. **Role-specific workflows**
3. **Common troubleshooting**
4. **API documentation** (auto-generated)

---

## 🛠️ Maintenance and Updates

### 11.1 Regular Maintenance
- **Daily**: Monitor system health and performance
- **Weekly**: Review audit logs and security
- **Monthly**: Database optimization and cleanup
- **Quarterly**: Security updates and feature releases

### 11.2 Backup Strategy
```sql
-- Automated daily backups (Supabase Pro)
-- Manual backup commands
pg_dump YOUR_DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 11.3 Update Process
```bash
# Update dependencies
npm update

# Update Supabase CLI
npm install -g @supabase/cli@latest

# Deploy updates
supabase functions deploy hospital-api
```

---

## 🎯 Step 11: Going Live Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Backup systems tested
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] User acceptance testing completed

### Launch Day
- [ ] Final deployment
- [ ] DNS propagation verified
- [ ] All services monitoring active
- [ ] Support team briefed
- [ ] User training completed
- [ ] Go-live announcement sent

### Post-Launch
- [ ] Monitor system performance (24-48 hours)
- [ ] Collect user feedback
- [ ] Address immediate issues
- [ ] Schedule follow-up reviews
- [ ] Plan next iteration features

---

## 🆘 Troubleshooting Guide

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check Supabase status
   curl https://YOUR_PROJECT_REF.supabase.co/rest/v1/
   ```

2. **Authentication Problems**
   ```typescript
   // Check JWT token expiry
   // Verify CORS settings
   // Check environment variables
   ```

3. **Real-time Not Working**
   ```sql
   -- Verify realtime is enabled
   SELECT * FROM pg_publication;
   ```

4. **File Upload Issues**
   ```typescript
   // Check storage bucket policies
   // Verify file size limits
   // Check CORS settings
   ```

### Support Contacts
- **Technical Issues**: Create GitHub issue
- **Supabase Issues**: [Supabase Support](https://supabase.com/support)
- **Emergency**: Implement your escalation process

---

## 📞 Next Steps

After successful deployment:

1. **Monitor Usage**: Track user adoption and system performance
2. **Collect Feedback**: Regular user feedback sessions
3. **Plan Enhancements**: Prioritize new features based on usage
4. **Scale Preparation**: Plan for increased load and users
5. **Integration Planning**: Connect with hospital systems (EMR, Lab equipment, etc.)

---

**🎉 Congratulations! You now have a fully functional, production-ready hospital management system with dynamic API integration, real-time updates, and comprehensive features for managing all aspects of healthcare operations.**

For additional support or custom modifications, refer to the codebase documentation and API specifications.