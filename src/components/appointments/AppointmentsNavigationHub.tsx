import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  CalendarDays,
  Clock,
  Users,
  Plus,
  TestTube,
  FileText,
  BarChart3,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Timer,
  Stethoscope
} from 'lucide-react';

// Import sub-components
import TodaysAppointments from './TodaysAppointments';
import WaitingList from './WaitingList';
import Schedule from './Schedule';
import AppointmentScheduler from './AppointmentScheduler';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentReports from './AppointmentReports';
import LabResultsAppointments from './LabResultsAppointments';

type NavigationScreen = 
  | 'hub'
  | 'today'
  | 'waiting'
  | 'schedule'
  | 'all'
  | 'calendar'
  | 'reports'
  | 'lab-results';

interface AppointmentsNavigationHubProps {
  isDemoMode?: boolean;
}

export default function AppointmentsNavigationHub({ isDemoMode = false }: AppointmentsNavigationHubProps) {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('hub');

  const navigateTo = (screen: NavigationScreen) => {
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setCurrentScreen('hub');
  };

  // Hub Screen - Main Navigation
  if (currentScreen === 'hub') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Appointments Management</h1>
          <p className="text-muted-foreground">
            Comprehensive appointment scheduling and management system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-muted-foreground">75% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Waiting List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">6</div>
              <p className="text-xs text-muted-foreground">Avg wait: 15 min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Scheduled appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('today')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>
                <Badge>24 Today</Badge>
              </div>
              <CardTitle className="mt-4">Today's Appointments</CardTitle>
              <CardDescription>
                View and manage all appointments scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Today
              </Button>
            </CardContent>
          </Card>

          {/* Waiting List */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('waiting')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="secondary">6 Waiting</Badge>
              </div>
              <CardTitle className="mt-4">Waiting List</CardTitle>
              <CardDescription>
                Manage patient queue and waiting times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Queue
              </Button>
            </CardContent>
          </Card>

          {/* Schedule New */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('schedule')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
              <CardTitle className="mt-4">Schedule Appointment</CardTitle>
              <CardDescription>
                Book a new appointment for a patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Schedule Now
              </Button>
            </CardContent>
          </Card>

          {/* All Appointments */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('all')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline">All</Badge>
              </div>
              <CardTitle className="mt-4">All Appointments</CardTitle>
              <CardDescription>
                Search and manage all appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('calendar')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <Badge>Calendar</Badge>
              </div>
              <CardTitle className="mt-4">Calendar View</CardTitle>
              <CardDescription>
                Visual calendar with appointment timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Open Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Lab Results */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('lab-results')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-teal-600" />
                </div>
                <Badge variant="secondary">Results</Badge>
              </div>
              <CardTitle className="mt-4">Lab Results</CardTitle>
              <CardDescription>
                View lab results linked to appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Results
              </Button>
            </CardContent>
          </Card>

          {/* Reports & Analytics */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigateTo('reports')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-pink-600" />
                </div>
                <Badge variant="outline">Analytics</Badge>
              </div>
              <CardTitle className="mt-4">Reports & Analytics</CardTitle>
              <CardDescription>
                View appointment statistics and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <Badge>Quick</Badge>
              </div>
              <CardTitle className="mt-4">Quick Actions</CardTitle>
              <CardDescription>
                Common appointment tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Cancel Appointment
              </Button>
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Timer className="w-4 h-4 mr-2" />
                Reschedule
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
      {currentScreen === 'today' && <TodaysAppointments isDemoMode={isDemoMode} />}
      {currentScreen === 'waiting' && <WaitingList isDemoMode={isDemoMode} />}
      {currentScreen === 'schedule' && <Schedule isDemoMode={isDemoMode} />}
      {currentScreen === 'all' && <AppointmentScheduler isDemoMode={isDemoMode} />}
      {currentScreen === 'calendar' && <AppointmentCalendar />}
      {currentScreen === 'reports' && <AppointmentReports />}
      {currentScreen === 'lab-results' && <LabResultsAppointments />}
    </div>
  );
}
