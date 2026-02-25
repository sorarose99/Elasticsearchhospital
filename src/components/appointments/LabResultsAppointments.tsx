import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  TestTube, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function LabResultsAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const labResults = [
    {
      id: '1',
      appointmentId: 'APT001',
      patientName: 'John Doe',
      patientId: 'P001',
      testName: 'Complete Blood Count (CBC)',
      testType: 'Hematology',
      orderedBy: 'Dr. Sarah Smith',
      appointmentDate: '2024-03-15',
      appointmentTime: '10:00 AM',
      resultDate: '2024-03-16',
      status: 'completed',
      priority: 'routine',
      results: [
        { parameter: 'WBC', value: '7.5', unit: 'K/uL', range: '4.5-11.0', status: 'normal' },
        { parameter: 'RBC', value: '4.8', unit: 'M/uL', range: '4.5-5.9', status: 'normal' },
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal' }
      ]
    },
    {
      id: '2',
      appointmentId: 'APT002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      testName: 'Lipid Panel',
      testType: 'Chemistry',
      orderedBy: 'Dr. Michael Johnson',
      appointmentDate: '2024-03-14',
      appointmentTime: '2:30 PM',
      resultDate: '2024-03-15',
      status: 'completed',
      priority: 'routine',
      results: [
        { parameter: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high' },
        { parameter: 'LDL', value: '135', unit: 'mg/dL', range: '<100', status: 'high' },
        { parameter: 'HDL', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' }
      ]
    },
    {
      id: '3',
      appointmentId: 'APT003',
      patientName: 'Robert Brown',
      patientId: 'P003',
      testName: 'Thyroid Function Test',
      testType: 'Endocrinology',
      orderedBy: 'Dr. Emily Davis',
      appointmentDate: '2024-03-16',
      appointmentTime: '11:00 AM',
      resultDate: null,
      status: 'pending',
      priority: 'urgent',
      results: []
    },
    {
      id: '4',
      appointmentId: 'APT004',
      patientName: 'Sarah Johnson',
      patientId: 'P004',
      testName: 'Urinalysis',
      testType: 'Clinical Pathology',
      orderedBy: 'Dr. Ahmad Al-Ali',
      appointmentDate: '2024-03-13',
      appointmentTime: '9:00 AM',
      resultDate: '2024-03-14',
      status: 'completed',
      priority: 'routine',
      results: [
        { parameter: 'Color', value: 'Yellow', unit: '', range: 'Yellow', status: 'normal' },
        { parameter: 'pH', value: '6.0', unit: '', range: '4.5-8.0', status: 'normal' },
        { parameter: 'Protein', value: 'Negative', unit: '', range: 'Negative', status: 'normal' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>;
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>;
      case 'abnormal':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Abnormal
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultStatus = (status: string) => {
    switch (status) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'low':
        return <Badge variant="destructive" className="text-xs">Low</Badge>;
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Normal</Badge>;
    }
  };

  const filteredResults = labResults.filter(result => {
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.appointmentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lab Results - Appointments</h2>
          <p className="text-muted-foreground">
            View lab results linked to appointments
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {labResults.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {labResults.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {labResults.filter(r => r.results.some(res => res.status !== 'normal')).length}
            </div>
            <p className="text-sm text-muted-foreground">Abnormal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{labResults.length}</div>
            <p className="text-sm text-muted-foreground">Total Tests</p>
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
                  placeholder="Search by patient, test name, or appointment ID..."
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
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <TestTube className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No lab results found</p>
            </CardContent>
          </Card>
        ) : (
          filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <TestTube className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{result.testName}</h3>
                        {getStatusBadge(result.status)}
                        {result.priority === 'urgent' && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{result.testType}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Patient:</span>
                      <span className="font-medium">{result.patientName}</span>
                      <Badge variant="outline" className="text-xs">{result.patientId}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Appointment:</span>
                      <span className="font-medium">{result.appointmentId}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Appointment Date:</span>
                      <span className="font-medium">{result.appointmentDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{result.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                {result.results.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Test Results</h4>
                    <div className="space-y-2">
                      {result.results.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.parameter}</p>
                            <p className="text-sm text-muted-foreground">Reference: {item.range}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">{item.value} {item.unit}</p>
                            </div>
                            {getResultStatus(item.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Status */}
                {result.status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-600">
                      Results pending - estimated completion in 24-48 hours
                    </p>
                  </div>
                )}

                {/* Ordered By */}
                <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                  Ordered by: <span className="font-medium">{result.orderedBy}</span>
                  {result.resultDate && (
                    <span className="ml-4">
                      Result Date: <span className="font-medium">{result.resultDate}</span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
