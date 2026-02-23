import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ComprehensiveAppointmentScheduler from '../appointments/ComprehensiveAppointmentScheduler';
import { useLanguage } from '../../services/LanguageService';
import { CalendarIcon, TestTube, Languages, RefreshCcw } from 'lucide-react';

const AppointmentTest: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [testMode, setTestMode] = useState<'scheduler' | 'dashboard'>('scheduler');

  return (
    <div className="p-6 space-y-6">
      {/* Test Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TestTube className="h-6 w-6 text-blue-600" />
            Comprehensive Appointments System Test
            <Badge variant="secondary" className="ml-auto">
              Enhanced with QR & Notifications
            </Badge>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">Language:</span>
              <div className="flex gap-1">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
                <Button
                  variant={language === 'ar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('ar')}
                >
                  العربية
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Test Mode:</span>
              <div className="flex gap-1">
                <Button
                  variant={testMode === 'scheduler' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTestMode('scheduler')}
                >
                  Scheduler
                </Button>
                <Button
                  variant={testMode === 'dashboard' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTestMode('dashboard')}
                >
                  Dashboard
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="ml-auto"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset Test
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm font-medium mt-1">Multi-step Scheduling</div>
              <div className="text-xs text-muted-foreground">5 step wizard with validation</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm font-medium mt-1">QR Code Generation</div>
              <div className="text-xs text-muted-foreground">Automatic QR codes for appointments</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm font-medium mt-1">Smart Notifications</div>
              <div className="text-xs text-muted-foreground">SMS & Email to patients & doctors</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Test Features:</h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Complete appointment scheduling workflow with 5-step wizard</li>
              <li>• Bilingual support (English/Arabic) with proper RTL layout</li>
              <li>• QR code generation for appointment confirmation</li>
              <li>• Notification service with SMS/Email simulation</li>
              <li>• Enhanced animations and smooth transitions</li>
              <li>• Print, download, and share functionality</li>
              <li>• Responsive design with mobile support</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Main Test Component */}
      <div className="bg-background rounded-lg">
        <ComprehensiveAppointmentScheduler isDemoMode={true} />
      </div>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🎯 Testing Steps:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click "Schedule Appointment" button</li>
                <li>Go through the 5-step wizard</li>
                <li>Select existing patient or add new one</li>
                <li>Choose a doctor from the list</li>
                <li>Pick date and time slot</li>
                <li>Fill appointment details</li>
                <li>Confirm and complete scheduling</li>
                <li>View QR code and notifications</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔍 What to Verify:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Smooth step-by-step navigation</li>
                <li>Form validation and error handling</li>
                <li>Language switching works properly</li>
                <li>QR code generation and display</li>
                <li>Notification success messages</li>
                <li>Print/download/share buttons</li>
                <li>Responsive layout on different screens</li>
                <li>RTL layout for Arabic language</li>
              </ul>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Pro Tip:</strong> Check the browser console to see notification service logs and QR code data generation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentTest;