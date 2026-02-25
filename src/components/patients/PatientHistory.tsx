import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  History, 
  Calendar, 
  User, 
  FileText, 
  Activity, 
  Pill, 
  TestTube, 
  Stethoscope,
  Building,
  Clock
} from 'lucide-react';

interface PatientHistoryProps {
  patientId: string | null;
}

interface TimelineEvent {
  id: string;
  type: 'appointment' | 'prescription' | 'lab' | 'vitals' | 'admission' | 'discharge' | 'procedure';
  date: string;
  time: string;
  title: string;
  description: string;
  provider: string;
  department?: string;
  status?: string;
  details?: any;
}

export default function PatientHistory({ patientId }: PatientHistoryProps) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadPatientHistory();
  }, [patientId, filterType]);

  const loadPatientHistory = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with Firebase call
      const mockTimeline: TimelineEvent[] = [
        {
          id: '1',
          type: 'appointment',
          date: '2024-03-15',
          time: '10:00 AM',
          title: 'Cardiology Follow-up',
          description: 'Regular checkup for blood pressure management',
          provider: 'Dr. Sarah Smith',
          department: 'Cardiology',
          status: 'completed'
        },
        {
          id: '2',
          type: 'prescription',
          date: '2024-03-15',
          time: '10:30 AM',
          title: 'Lisinopril Prescribed',
          description: '10mg once daily for 30 days',
          provider: 'Dr. Sarah Smith',
          department: 'Cardiology',
          status: 'active'
        },
        {
          id: '3',
          type: 'lab',
          date: '2024-03-14',
          time: '2:00 PM',
          title: 'Complete Blood Count',
          description: 'Routine blood work - All results normal',
          provider: 'Lab Technician Mike',
          department: 'Laboratory',
          status: 'completed'
        },
        {
          id: '4',
          type: 'vitals',
          date: '2024-03-14',
          time: '9:30 AM',
          title: 'Vital Signs Recorded',
          description: 'BP: 120/80, HR: 72, Temp: 98.6°F',
          provider: 'Nurse Sarah',
          department: 'General',
          status: 'recorded'
        },
        {
          id: '5',
          type: 'admission',
          date: '2024-03-10',
          time: '8:00 AM',
          title: 'Hospital Admission',
          description: 'Admitted for chest pain evaluation',
          provider: 'Dr. Michael Johnson',
          department: 'Emergency',
          status: 'completed'
        },
        {
          id: '6',
          type: 'procedure',
          date: '2024-03-11',
          time: '11:00 AM',
          title: 'ECG Performed',
          description: 'Electrocardiogram - Normal sinus rhythm',
          provider: 'Dr. Emily Davis',
          department: 'Cardiology',
          status: 'completed'
        },
        {
          id: '7',
          type: 'discharge',
          date: '2024-03-12',
          time: '3:00 PM',
          title: 'Hospital Discharge',
          description: 'Discharged in stable condition with follow-up instructions',
          provider: 'Dr. Michael Johnson',
          department: 'Cardiology',
          status: 'completed'
        }
      ];

      setTimeline(mockTimeline);
    } catch (error) {
      console.error('Error loading patient history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, any> = {
      appointment: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' },
      prescription: { icon: Pill, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' },
      lab: { icon: TestTube, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' },
      vitals: { icon: Activity, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900' },
      admission: { icon: Building, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' },
      discharge: { icon: Building, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900' },
      procedure: { icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900' }
    };
    return icons[type] || icons.appointment;
  };

  const getEventBadge = (type: string) => {
    const labels: Record<string, string> = {
      appointment: 'Appointment',
      prescription: 'Prescription',
      lab: 'Lab Test',
      vitals: 'Vitals',
      admission: 'Admission',
      discharge: 'Discharge',
      procedure: 'Procedure'
    };
    return labels[type] || type;
  };

  const filteredTimeline = filterType === 'all' 
    ? timeline 
    : timeline.filter(event => event.type === filterType);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading patient history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient History Timeline</h2>
          <p className="text-muted-foreground">
            {patientId ? `Complete medical history for patient ${patientId}` : 'All patient interactions'}
          </p>
        </div>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {timeline.filter(e => e.type === 'appointment').length}
            </div>
            <p className="text-xs text-muted-foreground">Appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {timeline.filter(e => e.type === 'prescription').length}
            </div>
            <p className="text-xs text-muted-foreground">Prescriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {timeline.filter(e => e.type === 'lab').length}
            </div>
            <p className="text-xs text-muted-foreground">Lab Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {timeline.filter(e => e.type === 'vitals').length}
            </div>
            <p className="text-xs text-muted-foreground">Vitals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {timeline.filter(e => e.type === 'admission').length}
            </div>
            <p className="text-xs text-muted-foreground">Admissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-teal-600">
              {timeline.filter(e => e.type === 'discharge').length}
            </div>
            <p className="text-xs text-muted-foreground">Discharges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {timeline.filter(e => e.type === 'procedure').length}
            </div>
            <p className="text-xs text-muted-foreground">Procedures</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              All Events
            </Button>
            <Button
              variant={filterType === 'appointment' ? 'default' : 'outline'}
              onClick={() => setFilterType('appointment')}
            >
              Appointments
            </Button>
            <Button
              variant={filterType === 'prescription' ? 'default' : 'outline'}
              onClick={() => setFilterType('prescription')}
            >
              Prescriptions
            </Button>
            <Button
              variant={filterType === 'lab' ? 'default' : 'outline'}
              onClick={() => setFilterType('lab')}
            >
              Lab Tests
            </Button>
            <Button
              variant={filterType === 'vitals' ? 'default' : 'outline'}
              onClick={() => setFilterType('vitals')}
            >
              Vitals
            </Button>
            <Button
              variant={filterType === 'procedure' ? 'default' : 'outline'}
              onClick={() => setFilterType('procedure')}
            >
              Procedures
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredTimeline.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No history events found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            {/* Timeline Events */}
            <div className="space-y-6">
              {filteredTimeline.map((event, index) => {
                const iconConfig = getEventIcon(event.type);
                const Icon = iconConfig.icon;

                return (
                  <div key={event.id} className="relative pl-20">
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 w-16 h-16 ${iconConfig.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${iconConfig.color}`} />
                    </div>

                    {/* Event Card */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{event.title}</h3>
                              <Badge variant="outline">{getEventBadge(event.type)}</Badge>
                              {event.status && (
                                <Badge variant="secondary">{event.status}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{event.provider}</span>
                          </div>
                          {event.department && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span>{event.department}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
