import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  TestTube, 
  Pill,
  Heart,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

interface PatientEMRProps {
  patient: any;
  doctor: any;
  language: 'en' | 'ar';
  onBack: () => void;
}

const translations = {
  en: {
    back: 'Back to Patients',
    patientRecord: 'Patient Medical Record',
    overview: 'Overview',
    history: 'Medical History',
    prescriptions: 'Prescriptions',
    labResults: 'Lab Results',
    vitals: 'Vital Signs',
    personalInfo: 'Personal Information',
    contactInfo: 'Contact Information',
    insuranceInfo: 'Insurance Information',
    allergies: 'Allergies',
    medications: 'Current Medications',
    diagnosis: 'Current Diagnosis',
    addDiagnosis: 'Add Diagnosis',
    addPrescription: 'Add Prescription',
    orderLab: 'Order Lab Test',
    notes: 'Clinical Notes',
    addNotes: 'Add Notes',
    save: 'Save',
    noAllergies: 'No known allergies',
    noMedications: 'No current medications',
    noDiagnosis: 'No current diagnosis',
  },
  ar: {
    back: 'العودة إلى المرضى',
    patientRecord: 'السجل الطبي للمريض',
    overview: 'نظرة عامة',
    history: 'التاريخ الطبي',
    prescriptions: 'الوصفات الطبية',
    labResults: 'نتائج المختبر',
    vitals: 'العلامات الحيوية',
    personalInfo: 'المعلومات الشخصية',
    contactInfo: 'معلومات الاتصال',
    insuranceInfo: 'معلومات التأمين',
    allergies: 'الحساسية',
    medications: 'الأدوية الحالية',
    diagnosis: 'التشخيص الحالي',
    addDiagnosis: 'إضافة تشخيص',
    addPrescription: 'إضافة وصفة',
    orderLab: 'طلب فحص مختبر',
    notes: 'الملاحظات الطبية',
    addNotes: 'إضافة ملاحظات',
    save: 'حفظ',
    noAllergies: 'لا توجد حساسية معروفة',
    noMedications: 'لا توجد أدوية حالية',
    noDiagnosis: 'لا يوجد تشخيص حالي',
  }
};

export default function PatientEMR({ patient, doctor, language, onBack }: PatientEMRProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [clinicalNotes, setClinicalNotes] = useState('');

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-sm text-gray-600">ID: {patient.id} | Age: {patient.age} | {patient.gender}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <TestTube className="w-4 h-4 mr-2" />
              {t.orderLab}
            </Button>
            <Button>
              <Pill className="w-4 h-4 mr-2" />
              {t.addPrescription}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="history">{t.history}</TabsTrigger>
            <TabsTrigger value="prescriptions">{t.prescriptions}</TabsTrigger>
            <TabsTrigger value="lab">{t.labResults}</TabsTrigger>
            <TabsTrigger value="vitals">{t.vitals}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.personalInfo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="font-medium">{patient.name}</p>
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <p className="font-medium">{patient.dateOfBirth || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <p className="font-medium">{patient.gender}</p>
                      </div>
                      <div>
                        <Label>Age</Label>
                        <p className="font-medium">{patient.age}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.diagnosis}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.diagnosis ? (
                      <div className="space-y-2">
                        {patient.diagnosis.map((diag: string, index: number) => (
                          <Badge key={index} variant="outline">{diag}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">{t.noDiagnosis}</p>
                    )}
                    <Button variant="outline" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      {t.addDiagnosis}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.notes}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Enter clinical notes..."
                      rows={6}
                    />
                    <Button className="mt-4">
                      {t.save} {t.notes}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.allergies}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="space-y-2">
                        {patient.allergies.map((allergy: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>{allergy}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">{t.noAllergies}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.medications}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medications && patient.medications.length > 0 ? (
                      <div className="space-y-2">
                        {patient.medications.map((med: any, index: number) => (
                          <div key={index} className="p-2 border rounded">
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-600">{med.dosage}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">{t.noMedications}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.contactInfo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label>Phone</Label>
                        <p className="font-medium">{patient.phone}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="font-medium">{patient.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label>Address</Label>
                        <p className="font-medium">{patient.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>{t.history}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Medical history will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>{t.prescriptions}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Prescription history will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab">
            <Card>
              <CardHeader>
                <CardTitle>{t.labResults}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Lab results will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>{t.vitals}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Vital signs will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}