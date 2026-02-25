import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  User, 
  Calendar, 
  FileText, 
  Pill, 
  TestTube,
  CreditCard,
  MessageSquare,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Activity
} from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
}

interface Prescription {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'active' | 'completed';
}

export default function PatientPortal() {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'prescriptions' | 'billing'>('overview');

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setLoading(true);

      // Mock patient data
      const mockPatient: PatientData = {
        id: 'P001',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 234 567 8900',
        dateOfBirth: '1985-06-15',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts']
      };

      const mockAppointments: Appointment[] = [
        {
          id: 'A001',
          date: '2026-02-28',
          time: '10:00 AM',
          doctor: 'Dr. Sarah Smith',
          department: 'Cardiology',
          status: 'upcoming'
        },
        {
          id: 'A002',
          date: '2026-02-20',
          time: '2:00 PM',
          doctor: 'Dr. Michael Johnson',
          department: 'General Medicine',
          status: 'completed'
        }
      ];

      const mockRecords: MedicalRecord[] = [
        {
          id: 'R001',
          date: '2026-02-20',
          type: 'Consultation',
          doctor: 'Dr. Michael Johnson',
          diagnosis: 'Annual checkup - All normal'
        },
        {
          id: 'R002',
          date: '2026-01-15',
          type: 'Lab Test',
          doctor: 'Dr. Sarah Smith',
          diagnosis: 'Blood work - Normal ranges'
        }
      ];

      const mockPrescriptions: Prescription[] = [
        {
          id: 'RX001',
          date: '2026-02-20',
          medication: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          status: 'active'
        },
        {
          id: 'RX002',
          date: '2026-01-15',
          medication: 'Vitamin D3',
          dosage: '1000 IU',
          frequency: 'Once daily',
          duration: '90 days',
          status: 'active'
        }
      ];

      setPatientData(mockPatient);
      setAppointments(mockAppointments);
      setRecords(mockRecords);
      setPrescriptions(mockPrescriptions);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Portal</h1>
          <p className="text-muted-foreground">Welcome back, {patientData?.name}</p>
        </div>
        
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'upcoming').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {prescriptions.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {records[0]?.date ? new Date(records[0].date).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
        >
          <Activity className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'appointments' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Appointments
        </Button>
        <Button
          variant={activeTab === 'records' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('records')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Medical Records
        </Button>
        <Button
          variant={activeTab === 'prescriptions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('prescriptions')}
        >
          <Pill className="w-4 h-4 mr-2" />
          Prescriptions
        </Button>
        <Button
          variant={activeTab === 'billing' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Billing
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Patient ID</label>
                <p className="font-medium">{patientData?.id}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{patientData?.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium">{patientData?.phone}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Date of Birth</label>
                <p className="font-medium">
                  {patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Blood Type</label>
                <p className="font-medium">{patientData?.bloodType}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Allergies</label>
                <div className="flex gap-2 mt-1">
                  {patientData?.allergies && patientData.allergies.length > 0 ? (
                    patientData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.filter(a => a.status === 'upcoming').map((appointment) => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{appointment.doctor}</h4>
                      <Badge>{appointment.department}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Reschedule</Button>
                      <Button size="sm" variant="outline">Cancel</Button>
                    </div>
                  </div>
                ))}
                {appointments.filter(a => a.status === 'upcoming').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Active Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptions.filter(p => p.status === 'active').map((prescription) => (
                  <div key={prescription.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{prescription.medication}</h4>
                      <Badge variant="outline">{prescription.dosage}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Frequency: {prescription.frequency}</p>
                      <p>Duration: {prescription.duration}</p>
                      <p>Prescribed: {new Date(prescription.date).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3">
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.slice(0, 3).map((record) => (
                  <div key={record.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{record.type}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{record.doctor}</p>
                    <p className="text-sm">{record.diagnosis}</p>
                    <Button size="sm" variant="outline" className="mt-3">
                      <Eye className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'appointments' && (
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>View and manage your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{appointment.doctor}</h4>
                        <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{appointment.department}</span>
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    {appointment.status === 'upcoming' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other tabs would be similar */}
    </div>
  );
}
