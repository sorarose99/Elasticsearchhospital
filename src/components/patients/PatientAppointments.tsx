import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Search, Users, User, Building, Edit, Trash2 } from 'lucide-react';

interface PatientAppointmentsProps {
  patientId: string | null;
}

export default function PatientAppointments({ patientId }: PatientAppointmentsProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAppointments();
  }, [patientId, filterStatus]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with Firebase call
      const mockAppointments = [
        {
          id: '1',
          patientName: 'John Doe',
          patientId: 'P001',
          doctorName: 'Dr. Sarah Smith',
          department: 'Cardiology',
          date: '2024-03-15',
          time: '10:00 AM',
          status: 'scheduled',
          type: 'Follow-up',
          notes: 'Regular checkup'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          patientId: 'P002',
          doctorName: 'Dr. Michael Johnson',
          department: 'Orthopedics',
          date: '2024-03-16',
          time: '2:30 PM',
          status: 'confirmed',
          type: 'Consultation',
          notes: 'Knee pain assessment'
        },
        {
          id: '3',
          patientName: 'Robert Brown',
          patientId: 'P003',
          doctorName: 'Dr. Emily Davis',
          department: 'Neurology',
          date: '2024-03-14',
          time: '9:00 AM',
          status: 'completed',
          type: 'Initial Visit',
          notes: 'Headache evaluation'
        }
      ];

      // Filter by patient if patientId is provided
      const filtered = patientId
        ? mockAppointments.filter(apt => apt.patientId === patientId)
        : mockAppointments;

      setAppointments(filtered);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      scheduled: { variant: 'secondary', label: 'Scheduled' },
      confirmed: { variant: 'default', label: 'Confirmed' },
      completed: { variant: 'outline', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' }
    };
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Appointments</h2>
          <p className="text-muted-foreground">
            {patientId ? `Appointments for patient ${patientId}` : 'All patient appointments'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'scheduled').length}
            </div>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, or department..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('scheduled')}
              >
                Scheduled
              </Button>
              <Button
                variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('confirmed')}
              >
                Confirmed
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No appointments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                      {getStatusBadge(appointment.status)}
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Patient ID: {appointment.patientId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.doctorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{appointment.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
