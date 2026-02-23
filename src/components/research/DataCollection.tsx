import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { 
  Database,
  FileText,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Save,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface DataCollectionProps {
  studies: any[];
  participants: any[];
  isDemoMode?: boolean;
}

const DataCollection: React.FC<DataCollectionProps> = ({ studies, participants, isDemoMode }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('forms');

  // Demo data collection forms
  const dataForms = [
    {
      id: 'form-001',
      name: 'Baseline Assessment',
      studyId: 'study-001',
      version: '1.2',
      status: 'active',
      completedEntries: 156,
      totalEntries: 200,
      lastModified: '2024-12-20'
    },
    {
      id: 'form-002', 
      name: 'Monthly Follow-up',
      studyId: 'study-001',
      version: '1.0',
      status: 'active',
      completedEntries: 89,
      totalEntries: 156,
      lastModified: '2024-12-25'
    },
    {
      id: 'form-003',
      name: 'Adverse Event Report',
      studyId: 'study-002',
      version: '2.1',
      status: 'active',
      completedEntries: 3,
      totalEntries: 120,
      lastModified: '2024-12-22'
    }
  ];

  const renderFormsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('research.dataCollectionForms')}
            </CardTitle>
            <CardDescription>
              {t('research.manageFormsAndDataEntry')}
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('research.createForm')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.formName')}</TableHead>
              <TableHead>{t('research.study')}</TableHead>
              <TableHead>{t('research.version')}</TableHead>
              <TableHead>{t('research.completionRate')}</TableHead>
              <TableHead>{t('research.lastModified')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataForms.map((form) => {
              const completionRate = (form.completedEntries / form.totalEntries) * 100;
              return (
                <TableRow key={form.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{form.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {form.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {studies.find(s => s.id === form.studyId)?.title?.substring(0, 30)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">v{form.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={completionRate} className="w-20 h-2" />
                      <span className="text-sm">{form.completedEntries}/{form.totalEntries}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(form.lastModified).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderDataEntryView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('research.dataEntryForm')}</CardTitle>
            <CardDescription>{t('research.baselineAssessmentForm')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('research.participantId')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('research.selectParticipant')} />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.slice(0, 5).map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.participantId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('research.visitDate')}</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">{t('research.vitalSigns')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{t('research.bloodPressure')} (mmHg)</Label>
                  <div className="flex gap-2">
                    <Input placeholder="120" />
                    <span className="self-center">/</span>
                    <Input placeholder="80" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('research.heartRate')} (bpm)</Label>
                  <Input placeholder="72" />
                </div>
                <div className="space-y-2">
                  <Label>{t('research.temperature')} (°C)</Label>
                  <Input placeholder="36.5" />
                </div>
                <div className="space-y-2">
                  <Label>{t('research.weight')} (kg)</Label>
                  <Input placeholder="70" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">{t('research.symptoms')}</h3>
              <div className="space-y-3">
                {['Chest Pain', 'Shortness of Breath', 'Fatigue', 'Dizziness'].map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Checkbox />
                      {symptom}
                    </Label>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('research.notes')}</Label>
              <Textarea 
                placeholder={t('research.enterAdditionalNotes')}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                {t('common.save')} & {t('research.continue')}
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('research.saveAndFinalize')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.formProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('research.completion')}</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('research.demographics')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('research.medicalHistory')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span>{t('research.vitalSigns')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{t('research.labResults')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.dataValidation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">{t('research.valueOutOfRange')}</p>
                  <p className="text-muted-foreground">Blood pressure seems high</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">{t('research.dataValid')}</p>
                  <p className="text-muted-foreground">All required fields completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.dataCompleteness')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataForms.map((form) => {
              const completionRate = (form.completedEntries / form.totalEntries) * 100;
              return (
                <div key={form.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{form.name}</span>
                    <span>{completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.dataQuality')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">95.2%</p>
              <p className="text-sm text-muted-foreground">{t('research.dataAccuracy')}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('research.missingValues')}</span>
                <span className="text-red-600">2.1%</span>
              </div>
              <div className="flex justify-between">
                <span>{t('research.outOfRange')}</span>
                <span className="text-yellow-600">1.8%</span>
              </div>
              <div className="flex justify-between">
                <span>{t('research.duplicates')}</span>
                <span className="text-orange-600">0.9%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Form completed by Dr. Ahmed</span>
              <span className="text-muted-foreground text-xs">2h ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Data exported for analysis</span>
              <span className="text-muted-foreground text-xs">4h ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <span>Validation error resolved</span>
              <span className="text-muted-foreground text-xs">6h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('research.forms')}
          </TabsTrigger>
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {t('research.dataEntry')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('research.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          {renderFormsView()}
        </TabsContent>

        <TabsContent value="entry">
          {renderDataEntryView()}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAnalyticsView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataCollection;