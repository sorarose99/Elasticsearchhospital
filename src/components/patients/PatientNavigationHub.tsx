import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Calendar,
  Activity,
  Pill,
  TestTube,
  Heart,
  ClipboardList,
  History,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';

// Import sub-components
import PatientManagement from './PatientManagement';
import NewPatientRegistration from './NewPatientRegistration';
import MedicalRecordsView from './MedicalRecordsView';
import PatientAppointments from './PatientAppointments';
import PatientVitals from './PatientVitals';
import PatientPrescriptions from './PatientPrescriptions';
import PatientLabResults from './PatientLabResults';
import PatientHistory from './PatientHistory';

type NavigationScreen = 
  | 'hub'
  | 'list'
  | 'registration'
  | 'medical-records'
  | 'appointments'
  | 'vitals'
  | 'prescriptions'
  | 'lab-results'
  | 'history';

interface PatientNavigationHubProps {
  isDemoMode?: boolean;
}

export default function PatientNavigationHub({ isDemoMode = false }: PatientNavigationHubProps) {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('hub');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const navigateTo = (screen: NavigationScreen, patientId?: string) => {
    setCurrentScreen(screen);
    if (patientId) {
      setSelectedPatientId(patientId);
    }
  };

  const goBack = () => {
    setCurrentScreen('hub');
    setSelectedPatientId(null);
  };

  // Hub Screen - Main Navigation
  if (currentScreen === 'hub') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Patient Management</h1>
          <p className="text-muted-foreground">
            Comprehensive patient care and record management
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">45</div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">28</div>
              <p className="text-xs text-muted-foreground">Currently in facility</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('list')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge>Active</Badge>
              </div>
              <CardTitle className="mt-4">Patient List</CardTitle>
              <CardDescription>
                View and manage all registered patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View All Patients
              </Button>
            </CardContent>
          </Card>

          {/* New Registration */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('registration')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
              <CardTitle className="mt-4">New Registration</CardTitle>
              <CardDescription>
                Register a new patient with complete details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Register Patient
              </Button>
            </CardContent>
          </Card>

          {/* Medical Records */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('medical-records')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline">Records</Badge>
              </div>
              <CardTitle className="mt-4">Medical Records</CardTitle>
              <CardDescription>
                Access patient medical history and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Records
              </Button>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('appointments')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <Badge>156 Today</Badge>
              </div>
              <CardTitle className="mt-4">Appointments</CardTitle>
              <CardDescription>
                Manage patient appointments and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Vitals & Monitoring */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('vitals')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
                <Badge variant="destructive">Live</Badge>
              </div>
              <CardTitle className="mt-4">Vitals & Monitoring</CardTitle>
              <CardDescription>
                Track patient vital signs and health metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Vitals
              </Button>
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('prescriptions')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <Pill className="w-6 h-6 text-teal-600" />
                </div>
                <Badge>Active</Badge>
              </div>
              <CardTitle className="mt-4">Prescriptions</CardTitle>
              <CardDescription>
                Manage patient medications and prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Prescriptions
              </Button>
            </CardContent>
          </Card>

          {/* Lab Results */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('lab-results')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-yellow-600" />
                </div>
                <Badge variant="secondary">Results</Badge>
              </div>
              <CardTitle className="mt-4">Lab Results</CardTitle>
              <CardDescription>
                View and manage laboratory test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Results
              </Button>
            </CardContent>
          </Card>

          {/* Patient History */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('history')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <History className="w-6 h-6 text-indigo-600" />
                </div>
                <Badge variant="outline">Timeline</Badge>
              </div>
              <CardTitle className="mt-4">Patient History</CardTitle>
              <CardDescription>
                Complete timeline of patient interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <Badge>Tracked</Badge>
              </div>
              <CardTitle className="mt-4">Medical Conditions</CardTitle>
              <CardDescription>
                Track chronic conditions and diagnoses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Conditions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render appropriate screen based on navigation
  return (
    <div>
      {/* Back Button */}
      <div className="p-6 pb-0">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hub
        </Button>
      </div>

      {/* Screen Content */}
      {currentScreen === 'list' && <PatientManagement isDemoMode={isDemoMode} />}
      {currentScreen === 'registration' && <NewPatientRegistration onComplete={goBack} />}
      {currentScreen === 'medical-records' && <MedicalRecordsView patientId={selectedPatientId} />}
      {currentScreen === 'appointments' && <PatientAppointments patientId={selectedPatientId} />}
      {currentScreen === 'vitals' && <PatientVitals patientId={selectedPatientId} />}
      {currentScreen === 'prescriptions' && <PatientPrescriptions patientId={selectedPatientId} />}
      {currentScreen === 'lab-results' && <PatientLabResults patientId={selectedPatientId} />}
      {currentScreen === 'history' && <PatientHistory patientId={selectedPatientId} />}
    </div>
  );
}
