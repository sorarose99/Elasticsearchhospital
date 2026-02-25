import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TestTube, Plus, Search, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PatientLabResultsProps {
  patientId: string | null;
}

export default function PatientLabResults({ patientId }: PatientLabResultsProps) {
  const [labResults, setLabResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLabResults();
  }, [patientId, filterStatus]);

  const loadLabResults = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with Firebase call
      const mockLabResults = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'John Doe',
          testName: 'Complete Blood Count (CBC)',
          testType: 'Hematology',
          orderedBy: 'Dr. Sarah Smith',
          orderedDate: '2024-03-14',
          collectedDate: '2024-03-14',
          resultDate: '2024-03-15',
          status: 'completed',
          priority: 'routine',
          results: [
            { parameter: 'WBC', value: '7.5', unit: 'K/uL', range: '4.5-11.0', status: 'normal' },
            { parameter: 'RBC', value: '4.8', unit: 'M/uL', range: '4.5-5.9', status: 'normal' },
            { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
            { parameter: 'Platelets', value: '250', unit: 'K/uL', range: '150-400', status: 'normal' }
          ]
        },
        {
          id: '2',
          patientId: 'P001',
          patientName: 'John Doe',
          testName: 'Lipid Panel',
          testType: 'Chemistry',
          orderedBy: 'Dr. Michael Johnson',
          orderedDate: '2024-03-13',
          collectedDate: '2024-03-13',
          resultDate: '2024-03-14',
          status: 'completed',
          priority: 'routine',
          results: [
            { parameter: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high' },
            { parameter: 'LDL', value: '135', unit: 'mg/dL', range: '<100', status: 'high' },
            { parameter: 'HDL', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' },
            { parameter: 'Triglycerides', value: '150', unit: 'mg/dL', range: '<150', status: 'normal' }
          ]
        },
        {
          id: '3',
          patientId: 'P002',
          patientName: 'Jane Smith',
          testName: 'Thyroid Function Test',
          testType: 'Endocrinology',
          orderedBy: 'Dr. Emily Davis',
          orderedDate: '2024-03-15',
          collectedDate: '2024-03-15',
          resultDate: null,
          status: 'pending',
          priority: 'urgent',
          results: []
        }
      ];

      const filtered = patientId 
        ? mockLabResults.filter(r => r.patientId === patientId)
        : mockLabResults;

      setLabResults(filtered);
    } catch (error) {
      console.error('Error loading lab results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { variant: 'default', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
      pending: { variant: 'secondary', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
      abnormal: { variant: 'destructive', label: 'Abnormal', icon: AlertTriangle, color: 'text-red-600' }
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

  const getResultStatus = (status: string) => {
    switch (status) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'low':
        return <Badge variant="destructive">Low</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const filteredResults = labResults.filter(result => {
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading lab results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Laboratory Results</h2>
          <p className="text-muted-foreground">
            {patientId ? `Lab results for patient ${patientId}` : 'All patient lab results'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Order Test
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
              {labResults.filter(r => r.results.some((res: any) => res.status !== 'normal')).length}
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
                  placeholder="Search by test name, patient, or type..."
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Patient: {result.patientName}</span>
                        <span>Ordered by: {result.orderedBy}</span>
                      </div>
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

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Ordered</p>
                    <p className="font-medium">{result.orderedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Collected</p>
                    <p className="font-medium">{result.collectedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Result</p>
                    <p className="font-medium">{result.resultDate || 'Pending'}</p>
                  </div>
                </div>

                {result.results.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Test Results</h4>
                    <div className="space-y-2">
                      {result.results.map((item: any, index: number) => (
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

                {result.status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-600">Results pending - estimated completion in 24-48 hours</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
