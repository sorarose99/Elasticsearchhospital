import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pill, Plus, Search, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface PatientPrescriptionsProps {
  patientId: string | null;
}

export default function PatientPrescriptions({ patientId }: PatientPrescriptionsProps) {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPrescriptions();
  }, [patientId, filterStatus]);

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with Firebase call
      const mockPrescriptions = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'John Doe',
          medicationName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          prescribedBy: 'Dr. Sarah Smith',
          prescribedDate: '2024-03-15',
          startDate: '2024-03-15',
          endDate: '2024-04-14',
          status: 'active',
          refillsRemaining: 2,
          instructions: 'Take with food in the morning',
          purpose: 'Blood pressure management'
        },
        {
          id: '2',
          patientId: 'P001',
          patientName: 'John Doe',
          medicationName: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '90 days',
          prescribedBy: 'Dr. Michael Johnson',
          prescribedDate: '2024-02-01',
          startDate: '2024-02-01',
          endDate: '2024-05-01',
          status: 'active',
          refillsRemaining: 1,
          instructions: 'Take with meals',
          purpose: 'Diabetes management'
        },
        {
          id: '3',
          patientId: 'P002',
          patientName: 'Jane Smith',
          medicationName: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          prescribedBy: 'Dr. Emily Davis',
          prescribedDate: '2024-03-10',
          startDate: '2024-03-10',
          endDate: '2024-03-17',
          status: 'completed',
          refillsRemaining: 0,
          instructions: 'Complete full course',
          purpose: 'Bacterial infection'
        }
      ];

      const filtered = patientId 
        ? mockPrescriptions.filter(p => p.patientId === patientId)
        : mockPrescriptions;

      setPrescriptions(filtered);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: 'default', label: 'Active', icon: CheckCircle },
      completed: { variant: 'outline', label: 'Completed', icon: CheckCircle },
      discontinued: { variant: 'destructive', label: 'Discontinued', icon: AlertCircle },
      pending: { variant: 'secondary', label: 'Pending', icon: AlertCircle }
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesStatus = filterStatus === 'all' || rx.status === filterStatus;
    const matchesSearch = rx.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Prescriptions</h2>
          <p className="text-muted-foreground">
            {patientId ? `Prescriptions for patient ${patientId}` : 'All patient prescriptions'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {prescriptions.filter(p => p.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {prescriptions.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {prescriptions.filter(p => p.refillsRemaining > 0).length}
            </div>
            <p className="text-sm text-muted-foreground">Refills Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{prescriptions.length}</div>
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
                  placeholder="Search by medication, patient, or doctor..."
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
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Active
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

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No prescriptions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{prescription.medicationName}</h3>
                        {getStatusBadge(prescription.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{prescription.purpose}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold">{prescription.dosage}</span>
                        <span className="text-muted-foreground">{prescription.frequency}</span>
                        <span className="text-muted-foreground">{prescription.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {prescription.refillsRemaining} refills left
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Patient:</span>
                      <span className="font-medium">{prescription.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Prescribed by:</span>
                      <span className="font-medium">{prescription.prescribedBy}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Start:</span>
                      <span className="font-medium">{prescription.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">End:</span>
                      <span className="font-medium">{prescription.endDate}</span>
                    </div>
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm">
                      <strong>Instructions:</strong> {prescription.instructions}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Request Refill</Button>
                  <Button variant="outline" size="sm">Print</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
