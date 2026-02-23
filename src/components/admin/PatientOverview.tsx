import React, { useState } from 'react';
import { Users, Search, Plus, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface PatientOverviewProps {
  language: 'en' | 'ar';
}

const translations = {
  en: {
    title: 'Patient Overview',
    searchPatients: 'Search patients...',
    addPatient: 'Add Patient',
    totalPatients: 'Total Patients',
    activePatients: 'Active Patients',
    newThisMonth: 'New This Month',
    patientList: 'Patient List',
    name: 'Name',
    id: 'ID',
    phone: 'Phone',
    lastVisit: 'Last Visit',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    view: 'View',
    edit: 'Edit',
  },
  ar: {
    title: 'نظرة عامة على المرضى',
    searchPatients: 'البحث عن المرضى...',
    addPatient: 'إضافة مريض',
    totalPatients: 'إجمالي المرضى',
    activePatients: 'المرضى النشطون',
    newThisMonth: 'جديد هذا الشهر',
    patientList: 'قائمة المرضى',
    name: 'الاسم',
    id: 'الرقم التعريفي',
    phone: 'الهاتف',
    lastVisit: 'آخر زيارة',
    status: 'الحالة',
    actions: 'الإجراءات',
    active: 'نشط',
    inactive: 'غير نشط',
    view: 'عرض',
    edit: 'تعديل',
  }
};

const mockPatients = [
  { id: 'PAT001', name: 'Ahmed Hassan', phone: '+1234567890', lastVisit: '2024-12-01', status: 'active' },
  { id: 'PAT002', name: 'Fatima Ali', phone: '+1234567891', lastVisit: '2024-11-28', status: 'active' },
  { id: 'PAT003', name: 'Mohamed Salah', phone: '+1234567892', lastVisit: '2024-11-25', status: 'inactive' },
];

export default function PatientOverview({ language }: PatientOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState(mockPatients);

  const t = translations[language];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const StatCard = ({ title, value, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${color}`}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t.totalPatients}
          value={patients.length}
          color="bg-blue-500"
        />
        <StatCard
          title={t.activePatients}
          value={patients.filter(p => p.status === 'active').length}
          color="bg-green-500"
        />
        <StatCard
          title={t.newThisMonth}
          value="12"
          color="bg-purple-500"
        />
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.patientList}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t.searchPatients}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.addPatient}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.id}</p>
                    <p className="text-sm text-gray-500">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t.lastVisit}</p>
                    <p className="text-sm font-medium">{patient.lastVisit}</p>
                  </div>
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                    {patient.status === 'active' ? t.active : t.inactive}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}