/**
 * Patient Portal - Comprehensive self-service portal for patients
 * Enhanced with detailed workflows and full patient experience
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { useLanguage } from '../../services/LanguageService';
import { 
  User, 
  Calendar as CalendarIcon, 
  FileText, 
  TestTube, 
  Pill, 
  CreditCard, 
  Download, 
  Eye, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Activity,
  MapPin,
  Bell,
  Shield,
  MessageSquare,
  Video,
  Upload,
  Printer,
  Edit,
  Star,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Save,
  Share,
  BookOpen,
  Stethoscope,
  Thermometer,
  Scale,
  Target,
  TrendingUp,
  Calendar as CalendarCheck,
  Users,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  insuranceProvider: string;
  policyNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicConditions: string[];
    surgeries: Array<{ procedure: string; date: string; hospital: string }>;
    familyHistory: string[];
  };
  preferences: {
    language: 'en' | 'ar';
    communicationMethod: 'email' | 'sms' | 'phone';
    appointmentReminders: boolean;
    labResultNotifications: boolean;
    marketingEmails: boolean;
  };
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  doctorSpecialty: string;
  department: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  location: string;
  reason: string;
  instructions?: string;
  telehealth?: boolean;
  meetingLink?: string;
  estimatedDuration: number;
  copay?: number;
  notes?: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  doctorSpecialty: string;
  visitType: string;
  diagnosis: string;
  diagnosisCode?: string;
  notes: string;
  prescriptions: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  procedures: Array<{
    name: string;
    code: string;
    description: string;
  }>;
  vitalSigns?: {
    height: string;
    weight: string;
    bmi: number;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
  followUp?: {
    required: boolean;
    timeframe: string;
    instructions: string;
  };
  attachments: Array<{
    name: string;
    type: string;
    url: string;
    uploadDate: string;
  }>;
}

interface LabResult {
  id: string;
  date: string;
  testName: string;
  testCode: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  orderedBy: string;
  category: string;
  units: string;
  flagged: boolean;
  comments?: string;
  trendData?: Array<{ date: string; value: number }>;
  referenceDocument?: string;
}

interface Bill {
  id: string;
  date: string;
  serviceDate: string;
  description: string;
  provider: string;
  amount: number;
  insuranceCovered: number;
  patientResponsibility: number;
  status: 'paid' | 'pending' | 'overdue' | 'processing' | 'denied';
  dueDate: string;
  paymentMethod?: string;
  transactionId?: string;
  itemizedCharges: Array<{
    service: string;
    code: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  refillsRemaining: number;
  totalRefills: number;
  status: 'active' | 'completed' | 'discontinued' | 'on_hold';
  instructions: string;
  sideEffects: string[];
  interactions: string[];
  pharmacy: string;
  lastFilled?: string;
  nextRefillDate?: string;
}

interface HealthGoal {
  id: string;
  title: string;
  category: 'weight' | 'exercise' | 'nutrition' | 'medication' | 'vitals' | 'lifestyle';
  target: string;
  currentValue: string;
  unit: string;
  startDate: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'achieved' | 'paused' | 'discontinued';
  milestones: Array<{
    date: string;
    value: string;
    note?: string;
  }>;
}

interface Message {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  content: string;
  type: 'general' | 'appointment' | 'lab_result' | 'prescription' | 'billing';
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export default function PatientPortal() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [healthGoalsDialog, setHealthGoalsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedLabResult, setSelectedLabResult] = useState<LabResult | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced mock patient data
  const patientData: PatientData = {
    id: 'P001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    address: '123 Main Street, City, State 12345',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    emergencyContact: {
      name: 'John Johnson',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    medicalHistory: {
      allergies: ['Penicillin', 'Shellfish', 'Latex'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      surgeries: [
        { procedure: 'Appendectomy', date: '2018-06-15', hospital: 'City General Hospital' },
        { procedure: 'Gallbladder Removal', date: '2020-09-22', hospital: 'Regional Medical Center' }
      ],
      familyHistory: ['Heart Disease (Father)', 'Diabetes (Mother)', 'Cancer (Grandmother)']
    },
    preferences: {
      language: 'en',
      communicationMethod: 'email',
      appointmentReminders: true,
      labResultNotifications: true,
      marketingEmails: false
    }
  };

  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      date: '2024-01-15',
      time: '10:00 AM',
      doctor: 'Dr. Emily Chen',
      doctorSpecialty: 'Cardiology',
      department: 'Cardiology',
      type: 'Follow-up',
      status: 'scheduled',
      location: 'Building A, Floor 3, Room 302',
      reason: 'Hypertension follow-up and medication review',
      instructions: 'Please bring your blood pressure log and current medications',
      telehealth: false,
      estimatedDuration: 30,
      copay: 25,
      notes: 'Fasting not required'
    },
    {
      id: '2',
      date: '2024-01-22',
      time: '2:30 PM',
      doctor: 'Dr. Michael Smith',
      doctorSpecialty: 'Internal Medicine',
      department: 'General Medicine',
      type: 'Annual Checkup',
      status: 'scheduled',
      location: 'Building B, Floor 1, Room 105',
      reason: 'Annual physical examination and preventive care',
      instructions: 'Fasting for 12 hours required for blood work',
      telehealth: false,
      estimatedDuration: 60,
      copay: 0,
      notes: 'Includes mammography and colonoscopy screening discussion'
    },
    {
      id: '3',
      date: '2024-01-18',
      time: '11:00 AM',
      doctor: 'Dr. Lisa Rodriguez',
      doctorSpecialty: 'Endocrinology',
      department: 'Endocrinology',
      type: 'Telehealth Consultation',
      status: 'scheduled',
      location: 'Virtual Visit',
      reason: 'Diabetes management and A1C review',
      instructions: 'Test your blood sugar before the appointment',
      telehealth: true,
      meetingLink: 'https://telehealth.hospital.com/join/abc123',
      estimatedDuration: 20,
      copay: 15
    }
  ];

  const recentRecords: MedicalRecord[] = [
    {
      id: '1',
      date: '2024-01-08',
      doctor: 'Dr. Emily Chen',
      doctorSpecialty: 'Cardiology',
      visitType: 'Follow-up Visit',
      diagnosis: 'Hypertension - Well Controlled',
      diagnosisCode: 'I10',
      notes: 'Blood pressure stable on current medication regimen. Patient reports good adherence to diet and exercise recommendations. Continue current treatment plan.',
      prescriptions: [
        {
          medication: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '90 days',
          instructions: 'Take in the morning with or without food'
        },
        {
          medication: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '90 days',
          instructions: 'Take with meals to reduce stomach upset'
        }
      ],
      procedures: [
        {
          name: 'Blood Pressure Measurement',
          code: '99213',
          description: 'Routine blood pressure check and assessment'
        }
      ],
      vitalSigns: {
        height: '5\'6"',
        weight: '145 lbs',
        bmi: 23.4,
        bloodPressure: '128/82',
        heartRate: 72,
        temperature: 98.6
      },
      followUp: {
        required: true,
        timeframe: '3 months',
        instructions: 'Continue monitoring blood pressure at home. Return if readings consistently above 140/90.'
      },
      attachments: [
        {
          name: 'Blood Pressure Log',
          type: 'PDF',
          url: '/documents/bp-log-jan2024.pdf',
          uploadDate: '2024-01-08'
        }
      ]
    },
    {
      id: '2',
      date: '2023-12-15',
      doctor: 'Dr. Sarah Williams',
      doctorSpecialty: 'Internal Medicine',
      visitType: 'Annual Physical',
      diagnosis: 'Annual Physical Exam - Normal',
      diagnosisCode: 'Z00.00',
      notes: 'Overall health excellent. All screening tests within normal limits. Discussed preventive care recommendations including mammography and colonoscopy screening.',
      prescriptions: [
        {
          medication: 'Vitamin D3',
          dosage: '1000 IU',
          frequency: 'Once daily',
          duration: '365 days',
          instructions: 'Take with food for better absorption'
        }
      ],
      procedures: [
        {
          name: 'Comprehensive Physical Exam',
          code: '99395',
          description: 'Annual preventive care examination'
        },
        {
          name: 'Mammography Screening',
          code: '77067',
          description: 'Bilateral mammography for breast cancer screening'
        }
      ],
      vitalSigns: {
        height: '5\'6"',
        weight: '142 lbs',
        bmi: 22.9,
        bloodPressure: '118/75',
        heartRate: 68,
        temperature: 98.4
      },
      followUp: {
        required: true,
        timeframe: '1 year',
        instructions: 'Schedule next annual physical. Continue current health maintenance routine.'
      },
      attachments: [
        {
          name: 'Mammography Report',
          type: 'PDF',
          url: '/documents/mammography-dec2023.pdf',
          uploadDate: '2023-12-15'
        },
        {
          name: 'Lab Results Summary',
          type: 'PDF',
          url: '/documents/labs-dec2023.pdf',
          uploadDate: '2023-12-15'
        }
      ]
    }
  ];

  const labResults: LabResult[] = [
    {
      id: '1',
      date: '2024-01-10',
      testName: 'Comprehensive Metabolic Panel',
      testCode: 'CMP',
      result: 'Normal',
      normalRange: 'Within normal limits',
      status: 'normal',
      orderedBy: 'Dr. Emily Chen',
      category: 'Chemistry',
      units: 'Various',
      flagged: false,
      comments: 'All values within normal range. Continue current medications.',
      trendData: [
        { date: '2023-10-10', value: 95 },
        { date: '2023-07-10', value: 98 },
        { date: '2024-01-10', value: 92 }
      ]
    },
    {
      id: '2',
      date: '2024-01-10',
      testName: 'Hemoglobin A1c',
      testCode: 'HbA1c',
      result: '6.8',
      normalRange: '<7.0',
      status: 'normal',
      orderedBy: 'Dr. Emily Chen',
      category: 'Diabetes Monitoring',
      units: '%',
      flagged: false,
      comments: 'Good diabetes control. Continue current management.',
      trendData: [
        { date: '2023-10-10', value: 7.2 },
        { date: '2023-07-10', value: 7.0 },
        { date: '2024-01-10', value: 6.8 }
      ]
    },
    {
      id: '3',
      date: '2024-01-10',
      testName: 'LDL Cholesterol',
      testCode: 'LDL',
      result: '145',
      normalRange: '<100',
      status: 'abnormal',
      orderedBy: 'Dr. Emily Chen',
      category: 'Lipid Panel',
      units: 'mg/dL',
      flagged: true,
      comments: 'Elevated LDL cholesterol. Discuss dietary modifications and consider statin therapy.',
      trendData: [
        { date: '2023-10-10', value: 155 },
        { date: '2023-07-10', value: 150 },
        { date: '2024-01-10', value: 145 }
      ]
    },
    {
      id: '4',
      date: '2024-01-05',
      testName: 'Complete Blood Count',
      testCode: 'CBC',
      result: 'Normal',
      normalRange: 'Within normal limits',
      status: 'normal',
      orderedBy: 'Dr. Sarah Williams',
      category: 'Hematology',
      units: 'Various',
      flagged: false,
      comments: 'All blood counts within normal range.'
    }
  ];

  const bills: Bill[] = [
    {
      id: '1',
      date: '2024-01-08',
      serviceDate: '2024-01-08',
      description: 'Cardiology Consultation',
      provider: 'Dr. Emily Chen',
      amount: 350.00,
      insuranceCovered: 280.00,
      patientResponsibility: 70.00,
      status: 'pending',
      dueDate: '2024-02-08',
      itemizedCharges: [
        { service: 'Office Visit - Established Patient', code: '99213', quantity: 1, unitPrice: 250.00, total: 250.00 },
        { service: 'EKG Interpretation', code: '93000', quantity: 1, unitPrice: 75.00, total: 75.00 },
        { service: 'Blood Pressure Monitoring', code: '99091', quantity: 1, unitPrice: 25.00, total: 25.00 }
      ]
    },
    {
      id: '2',
      date: '2023-12-15',
      serviceDate: '2023-12-15',
      description: 'Annual Physical Exam',
      provider: 'Dr. Sarah Williams',
      amount: 450.00,
      insuranceCovered: 450.00,
      patientResponsibility: 0.00,
      status: 'paid',
      dueDate: '2024-01-15',
      paymentMethod: 'Insurance',
      transactionId: 'INS-2023-12-15-001',
      itemizedCharges: [
        { service: 'Preventive Care Exam', code: '99395', quantity: 1, unitPrice: 300.00, total: 300.00 },
        { service: 'Mammography Screening', code: '77067', quantity: 1, unitPrice: 150.00, total: 150.00 }
      ]
    },
    {
      id: '3',
      date: '2023-11-20',
      serviceDate: '2023-11-20',
      description: 'Laboratory Tests',
      provider: 'Hospital Laboratory',
      amount: 185.00,
      insuranceCovered: 148.00,
      patientResponsibility: 37.00,
      status: 'paid',
      dueDate: '2023-12-20',
      paymentMethod: 'Credit Card',
      transactionId: 'CC-2023-11-25-789',
      itemizedCharges: [
        { service: 'Comprehensive Metabolic Panel', code: 'CMP', quantity: 1, unitPrice: 85.00, total: 85.00 },
        { service: 'Lipid Panel', code: 'LIPID', quantity: 1, unitPrice: 65.00, total: 65.00 },
        { service: 'HbA1c', code: 'A1C', quantity: 1, unitPrice: 35.00, total: 35.00 }
      ]
    }
  ];

  const medications: Medication[] = [
    {
      id: '1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Emily Chen',
      prescribedDate: '2024-01-08',
      startDate: '2024-01-08',
      refillsRemaining: 2,
      totalRefills: 5,
      status: 'active',
      instructions: 'Take in the morning with or without food. Monitor blood pressure regularly.',
      sideEffects: ['Dizziness', 'Dry cough', 'Fatigue'],
      interactions: ['NSAIDs', 'Potassium supplements'],
      pharmacy: 'City Pharmacy - Main Street',
      lastFilled: '2024-01-08',
      nextRefillDate: '2024-04-08'
    },
    {
      id: '2',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribedBy: 'Dr. Emily Chen',
      prescribedDate: '2024-01-08',
      startDate: '2024-01-08',
      refillsRemaining: 3,
      totalRefills: 5,
      status: 'active',
      instructions: 'Take with meals to reduce stomach upset. Monitor blood sugar levels.',
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
      interactions: ['Alcohol', 'Contrast dye'],
      pharmacy: 'City Pharmacy - Main Street',
      lastFilled: '2024-01-08',
      nextRefillDate: '2024-04-08'
    },
    {
      id: '3',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      dosage: '1000 IU',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Williams',
      prescribedDate: '2023-12-15',
      startDate: '2023-12-15',
      refillsRemaining: 4,
      totalRefills: 11,
      status: 'active',
      instructions: 'Take with food for better absorption.',
      sideEffects: ['Rare: kidney stones with high doses'],
      interactions: ['Thiazide diuretics'],
      pharmacy: 'City Pharmacy - Main Street',
      lastFilled: '2023-12-15',
      nextRefillDate: '2024-03-15'
    }
  ];

  const healthGoals: HealthGoal[] = [
    {
      id: '1',
      title: 'Weight Management',
      category: 'weight',
      target: '140',
      currentValue: '145',
      unit: 'lbs',
      startDate: '2024-01-01',
      targetDate: '2024-06-01',
      progress: 50,
      status: 'active',
      milestones: [
        { date: '2024-01-01', value: '150', note: 'Starting weight' },
        { date: '2024-01-15', value: '148', note: 'Good progress with diet changes' },
        { date: '2024-01-30', value: '145', note: 'Added exercise routine' }
      ]
    },
    {
      id: '2',
      title: 'Blood Pressure Control',
      category: 'vitals',
      target: '<130/80',
      currentValue: '128/82',
      unit: 'mmHg',
      startDate: '2023-12-01',
      targetDate: '2024-03-01',
      progress: 85,
      status: 'active',
      milestones: [
        { date: '2023-12-01', value: '145/95', note: 'Starting BP' },
        { date: '2024-01-01', value: '135/88', note: 'Medication adjustment' },
        { date: '2024-01-15', value: '128/82', note: 'Target almost reached' }
      ]
    },
    {
      id: '3',
      title: 'Daily Steps',
      category: 'exercise',
      target: '10000',
      currentValue: '8500',
      unit: 'steps',
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      progress: 70,
      status: 'active',
      milestones: [
        { date: '2024-01-01', value: '5000', note: 'Baseline activity' },
        { date: '2024-01-15', value: '7500', note: 'Added morning walks' },
        { date: '2024-01-30', value: '8500', note: 'Consistent improvement' }
      ]
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      subject: 'Lab Results Available',
      from: 'Dr. Emily Chen',
      to: 'Sarah Johnson',
      date: '2024-01-10',
      content: 'Your recent lab results are now available in your portal. Overall, the results look good with your diabetes well-controlled. However, your LDL cholesterol is slightly elevated. Please schedule a follow-up appointment to discuss dietary modifications.',
      type: 'lab_result',
      status: 'unread',
      priority: 'normal'
    },
    {
      id: '2',
      subject: 'Appointment Reminder',
      from: 'Appointment Center',
      to: 'Sarah Johnson',
      date: '2024-01-12',
      content: 'This is a reminder that you have an appointment scheduled with Dr. Emily Chen on January 15, 2024, at 10:00 AM. Please arrive 15 minutes early for check-in.',
      type: 'appointment',
      status: 'read',
      priority: 'normal'
    },
    {
      id: '3',
      subject: 'Prescription Refill Ready',
      from: 'City Pharmacy',
      to: 'Sarah Johnson',
      date: '2024-01-11',
      content: 'Your prescription for Lisinopril 10mg is ready for pickup. Pharmacy hours: Mon-Fri 8AM-8PM, Sat-Sun 9AM-6PM.',
      type: 'prescription',
      status: 'read',
      priority: 'low'
    }
  ];

  const availableDoctors = [
    { id: '1', name: 'Dr. Emily Chen', specialty: 'Cardiology' },
    { id: '2', name: 'Dr. Michael Smith', specialty: 'General Medicine' },
    { id: '3', name: 'Dr. Sarah Williams', specialty: 'Internal Medicine' },
    { id: '4', name: 'Dr. Robert Davis', specialty: 'Dermatology' }
  ];

  const appointmentTypes = [
    'New Patient Consultation',
    'Follow-up Appointment',
    'Annual Physical',
    'Urgent Care',
    'Telehealth Consultation',
    'Preventive Care'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': case 'paid': case 'scheduled': case 'completed': case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal': case 'pending': case 'cancelled': case 'overdue':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': case 'denied': case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing': case 'rescheduled': case 'on_hold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Enhanced Dashboard Component
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              Welcome back, {patientData.name}!
            </h2>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              Here's your health summary for today
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Heart className="w-3 h-3 mr-1" />
              Health Score: 85/100
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CalendarIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
          <div className="text-sm text-blue-600/70">Upcoming Appointments</div>
          <div className="text-xs text-muted-foreground mt-1">
            Next: {upcomingAppointments[0]?.date ? new Date(upcomingAppointments[0].date).toLocaleDateString() : 'None'}
          </div>
        </Card>
        
        <Card className="p-4 text-center border-green-200 bg-green-50 dark:bg-green-900/20">
          <TestTube className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{labResults.length}</div>
          <div className="text-sm text-green-600/70">Recent Lab Results</div>
          <div className="text-xs text-muted-foreground mt-1">
            {labResults.filter(r => r.status === 'abnormal').length} flagged
          </div>
        </Card>
        
        <Card className="p-4 text-center border-purple-200 bg-purple-50 dark:bg-purple-900/20">
          <Pill className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{medications.filter(m => m.status === 'active').length}</div>
          <div className="text-sm text-purple-600/70">Active Medications</div>
          <div className="text-xs text-muted-foreground mt-1">
            {medications.filter(m => m.refillsRemaining <= 1).length} need refills
          </div>
        </Card>
        
        <Card className="p-4 text-center border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            ${bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.patientResponsibility, 0).toFixed(0)}
          </div>
          <div className="text-sm text-orange-600/70">Outstanding Balance</div>
          <div className="text-xs text-muted-foreground mt-1">
            {bills.filter(b => b.status === 'pending').length} pending bills
          </div>
        </Card>
      </div>

      {/* Health Goals Progress */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Health Goals Progress
            </h3>
            <Button variant="outline" size="sm" onClick={() => setHealthGoalsDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Goal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {healthGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{goal.title}</h4>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {goal.currentValue} {goal.unit}</span>
                    <span>Target: {goal.target} {goal.unit}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {goal.progress}% complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lab results received</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment confirmed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Prescription refilled</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Health goal updated</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-600" />
              Health Alerts & Reminders
            </h3>
            <div className="space-y-3">
              {labResults.filter(r => r.flagged).length > 0 && (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    You have {labResults.filter(r => r.flagged).length} lab result(s) that need attention.
                  </AlertDescription>
                </Alert>
              )}
              
              {medications.filter(m => m.refillsRemaining <= 1).length > 0 && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    {medications.filter(m => m.refillsRemaining <= 1).length} medication(s) need refills soon.
                  </AlertDescription>
                </Alert>
              )}

              {upcomingAppointments.filter(a => new Date(a.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length > 0 && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CalendarIcon className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    You have appointments coming up this week.
                  </AlertDescription>
                </Alert>
              )}

              {messages.filter(m => m.status === 'unread').length > 0 && (
                <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <AlertDescription className="text-purple-800 dark:text-purple-200">
                    You have {messages.filter(m => m.status === 'unread').length} unread message(s) from your care team.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => setAppointmentDialog(true)}>
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <span className="text-sm">Book Appointment</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={() => setMessageDialog(true)}>
              <MessageSquare className="w-6 h-6 text-green-600" />
              <span className="text-sm">Message Doctor</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Pill className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Request Refill</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="w-6 h-6 text-orange-600" />
              <span className="text-sm">Download Records</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const RequestAppointmentForm = () => {
    const [formData, setFormData] = useState({
      doctor: '',
      appointmentType: '',
      preferredDate: '',
      preferredTime: '',
      reason: '',
      urgency: 'routine'
    });

    const handleSubmit = () => {
      console.log('Appointment request:', formData);
      setAppointmentDialog(false);
      // Reset form
      setFormData({
        doctor: '', appointmentType: '', preferredDate: '', preferredTime: '',
        reason: '', urgency: 'routine'
      });
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor</label>
            <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {availableDoctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Appointment Type</label>
            <Select value={formData.appointmentType} onValueChange={(value) => setFormData({ ...formData, appointmentType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Date</label>
            <Input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Time</label>
            <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Urgency</label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent (within 1 week)</SelectItem>
                <SelectItem value="emergency">Emergency (within 24 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reason for Visit</label>
          <Textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Please describe the reason for your appointment"
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Request Appointment
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Patient Portal
            </h1>
            <p className="text-muted-foreground">Manage your health information and care</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {messages.filter(m => m.status === 'unread').length}
                </Badge>
              )}
            </Button>
            
            <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Message to Healthcare Provider</DialogTitle>
                  <DialogDescription>
                    Send a secure message to your healthcare provider. You will receive a response within 1-2 business days.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chen">Dr. Emily Chen - Cardiology</SelectItem>
                      <SelectItem value="smith">Dr. Michael Smith - General Medicine</SelectItem>
                      <SelectItem value="rodriguez">Dr. Lisa Rodriguez - Endocrinology</SelectItem>
                      <SelectItem value="nurse">Nursing Team</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="appointment">Appointment Request</SelectItem>
                      <SelectItem value="prescription">Prescription Refill</SelectItem>
                      <SelectItem value="lab">Lab Results Question</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Your message..." rows={4} />
                  <div className="flex gap-2">
                    <Button className="flex-1">Send Message</Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={appointmentDialog} onOpenChange={setAppointmentDialog}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{t('dashboard.requestNewAppointment')}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to request a new appointment. We will contact you within 24 hours to confirm your preferred time slot.
                  </DialogDescription>
                </DialogHeader>
                <RequestAppointmentForm />
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="labs">Lab Results</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard */}
          <TabsContent value="dashboard" className="space-y-4">
            {renderDashboard()}
          </TabsContent>

          {/* Appointments */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="grid gap-4">
              <Alert>
                <CalendarIcon className="h-4 w-4" />
                <AlertDescription>
                  You have 2 upcoming appointments. Please arrive 15 minutes early for check-in.
                </AlertDescription>
              </Alert>

              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{appointment.type}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4" />
                            <span>{appointment.doctor}</span>
                          </div>
                          <div className="text-muted-foreground">{appointment.department}</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-2" />
                        Join Telehealth
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medical Records */}
          <TabsContent value="records" className="space-y-4">
            <div className="grid gap-4">
              {recentRecords.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{record.diagnosis}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()} - {record.doctor}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm">
                      <strong>Notes:</strong> {record.notes}
                    </div>

                    {record.prescriptions.length > 0 && (
                      <div>
                        <strong className="text-sm">Prescriptions:</strong>
                        <ul className="text-sm list-disc list-inside ml-2 space-y-1">
                          {record.prescriptions.map((prescription, index) => (
                            <li key={index}>{prescription}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.followUp && (
                      <div className="text-sm">
                        <strong>Follow-up:</strong> {record.followUp}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lab Results */}
          <TabsContent value="labs" className="space-y-4">
            <div className="grid gap-4">
              {labResults.map((result) => (
                <Card key={result.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{result.testName}</h3>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div><strong>Result:</strong> {result.result}</div>
                        <div><strong>Normal Range:</strong> {result.normalRange}</div>
                        <div><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</div>
                        <div><strong>Ordered by:</strong> {result.orderedBy}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medications */}
          <TabsContent value="medications" className="space-y-4">
            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Pill className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Lisinopril 10mg</h3>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div><strong>Dosage:</strong> Once daily</div>
                      <div><strong>Prescribed by:</strong> Dr. Emily Chen</div>
                      <div><strong>Start Date:</strong> January 1, 2024</div>
                      <div><strong>Refills Remaining:</strong> 2</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Pill className="w-4 h-4 mr-2" />
                      Request Refill
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask Question
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Pill className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Metformin 500mg</h3>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div><strong>Dosage:</strong> Twice daily with meals</div>
                      <div><strong>Prescribed by:</strong> Dr. Emily Chen</div>
                      <div><strong>Start Date:</strong> December 15, 2023</div>
                      <div><strong>Refills Remaining:</strong> 5</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Pill className="w-4 h-4 mr-2" />
                      Request Refill
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask Question
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-4">
            <div className="grid gap-4">
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  You have an outstanding balance of $250.00. Click below to make a payment.
                </AlertDescription>
              </Alert>

              {bills.map((bill) => (
                <Card key={bill.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{bill.description}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Date: {new Date(bill.date).toLocaleDateString()}</span>
                        <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-medium">${bill.amount.toFixed(2)}</div>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        {bill.status === 'pending' && (
                          <Button size="sm">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Personal Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{patientData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <span>{new Date(patientData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{patientData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{patientData.email}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Information
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Insurance Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span>{patientData.insuranceProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Policy Number:</span>
                    <span>{patientData.policyNumber}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Insurance
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Emergency Contact</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{patientData.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{patientData.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Relationship:</span>
                    <span>{patientData.emergencyContact.relationship}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Contact
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Privacy & Security</h3>
                <div className="space-y-3">
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}