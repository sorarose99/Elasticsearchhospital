import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  FileImage,
  FilePlus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MedicalRecordsViewProps {
  patientId: string | null;
}

export default function MedicalRecordsView({ patientId }: MedicalRecordsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock medical records data
  const records = [
    {
      id: '1',
      type: 'Consultation',
      title: 'Annual Physical Examination',
      date: '2026-02-20',
      doctor: 'Dr. Sarah Smith',
      category: 'consultation',
      status: 'completed',
      summary: 'Routine annual checkup. All vitals normal. Patient in good health.',
      attachments: 2
    },
    {
      id: '2',
      type: 'Lab Report',
      title: 'Complete Blood Count (CBC)',
      date: '2026-02-18',
      doctor: 'Dr. Michael Johnson',
      category: 'lab',
      status: 'completed',
      summary: 'All blood work within normal ranges.',
      attachments: 1
    },
    {
      id: '3',
      type: 'Imaging',
      title: 'Chest X-Ray',
      date: '2026-02-15',
      doctor: 'Dr. Emily Brown',
      category: 'imaging',
      status: 'completed',
      summary: 'No abnormalities detected. Clear lung fields.',
      attachments: 3
    },
    {
      id: '4',
      type: 'Prescription',
      title: 'Medication Renewal',
      date: '2026-02-10',
      doctor: 'Dr. Sarah Smith',
      category: 'prescription',
      status: 'active',
      summary: 'Renewed prescriptions for hypertension management.',
      attachments: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consultation': return <Stethoscope className="w-4 h-4" />;
      case 'lab': return <FileText className="w-4 h-4" />;
      case 'imaging': return <FileImage className="w-4 h-4" />;
      case 'prescription': return <FilePlus className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">
            Complete medical history and documentation
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.filter(r => r.category === 'consultation').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.filter(r => r.category === 'lab').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Imaging Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.filter(r => r.category === 'imaging').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="consultation">Consultations</TabsTrigger>
          <TabsTrigger value="lab">Lab Reports</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {getCategoryIcon(record.category)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{record.title}</h3>
                        <Badge variant={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {record.doctor}
                          </span>
                        </div>
                        <p className="mt-2">{record.summary}</p>
                        {record.attachments > 0 && (
                          <p className="text-xs">
                            {record.attachments} attachment{record.attachments > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would be similar, filtered by category */}
      </Tabs>
    </div>
  );
}
