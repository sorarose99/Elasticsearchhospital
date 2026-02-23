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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Upload,
  Bell
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { getClinicalResearchTranslations } from '../../services/LanguageServiceExtended';

interface AdverseEventsProps {
  studies: any[];
  participants: any[];
  isDemoMode?: boolean;
}

const AdverseEvents: React.FC<AdverseEventsProps> = ({ studies, participants, isDemoMode }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('events');
  const [showReportDialog, setShowReportDialog] = useState(false);

  const adverseEvents = [
    {
      id: 'ae-001',
      studyId: 'study-001',
      participantId: 'CARD-001-067',
      eventTerm: 'Chest Pain',
      severity: 'moderate',
      seriousness: 'non_serious',
      relationship: 'possible',
      status: 'ongoing',
      onsetDate: '2024-12-20',
      reportDate: '2024-12-21',
      reporter: 'Dr. Ahmed Hassan',
      description: 'Patient reported chest pain during follow-up visit',
      actions: 'Medication dosage reduced, monitoring increased',
      followUpRequired: true
    },
    {
      id: 'ae-002',
      studyId: 'study-001',
      participantId: 'CARD-001-045',
      eventTerm: 'Mild Headache',
      severity: 'mild',
      seriousness: 'non_serious',
      relationship: 'unrelated',
      status: 'resolved',
      onsetDate: '2024-12-15',
      reportDate: '2024-12-15',
      resolutionDate: '2024-12-18',
      reporter: 'Dr. Sara Mohamed',
      description: 'Mild headache reported by participant',
      actions: 'No action taken, resolved spontaneously',
      followUpRequired: false
    },
    {
      id: 'ae-003',
      studyId: 'study-002',
      participantId: 'DIAB-002-023',
      eventTerm: 'Hypoglycemia',
      severity: 'severe',
      seriousness: 'serious',
      relationship: 'related',
      status: 'resolved',
      onsetDate: '2024-11-28',
      reportDate: '2024-11-28',
      resolutionDate: '2024-11-30',
      reporter: 'Dr. Omar Ali',
      description: 'Severe hypoglycemic episode requiring medical intervention',
      actions: 'Emergency treatment provided, protocol deviation reported',
      followUpRequired: true,
      expeditedReporting: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      ongoing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      fatal: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      mild: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      severe: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[severity as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getRelationshipBadge = (relationship: string) => {
    const styles = {
      unrelated: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      unlikely: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      possible: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      probable: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      related: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[relationship as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const renderEventsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t('research.adverseEvents')}
            </CardTitle>
            <CardDescription>
              {t('research.trackAndManageAdverseEvents')}
            </CardDescription>
          </div>
          <Button onClick={() => setShowReportDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('research.reportAE')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.eventTerm')}</TableHead>
              <TableHead>{t('research.participant')}</TableHead>
              <TableHead>{t('research.study')}</TableHead>
              <TableHead>{t('research.severity')}</TableHead>
              <TableHead>{t('research.relationship')}</TableHead>
              <TableHead>{t('research.status')}</TableHead>
              <TableHead>{t('research.onsetDate')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adverseEvents.map((event) => {
              const study = studies.find(s => s.id === event.studyId);
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{event.eventTerm}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {event.seriousness === 'serious' && (
                          <Badge variant="destructive" className="text-xs">
                            {t('research.serious')}
                          </Badge>
                        )}
                        {event.expeditedReporting && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            {t('research.expedited')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{event.participantId}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{study?.title?.substring(0, 20)}...</p>
                      <p className="text-xs text-muted-foreground">{study?.phase}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityBadge(event.severity)}>
                      {t(`research.${event.severity}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRelationshipBadge(event.relationship)}>
                      {t(`research.${event.relationship}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(event.status)}>
                      {t(`research.${event.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(event.onsetDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {event.followUpRequired && (
                        <Button variant="ghost" size="sm">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </Button>
                      )}
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

  const renderAnalyticsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.aeBySeverity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['mild', 'moderate', 'severe'].map((severity) => {
              const count = adverseEvents.filter(ae => ae.severity === severity).length;
              const percentage = (count / adverseEvents.length) * 100;
              return (
                <div key={severity} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{t(`research.${severity}`)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded">
                      <div 
                        className={`h-2 rounded ${
                          severity === 'mild' ? 'bg-green-500' :
                          severity === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.aeByRelationship')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['unrelated', 'possible', 'probable', 'related'].map((relationship) => {
              const count = adverseEvents.filter(ae => ae.relationship === relationship).length;
              const percentage = (count / adverseEvents.length) * 100;
              return (
                <div key={relationship} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{t(`research.${relationship}`)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded">
                      <div 
                        className="h-2 rounded bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.reportingTimeline')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-muted-foreground">{t('research.timelyReporting')}</p>
            </div>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>{t('research.within24Hours')}</span>
                <span className="text-green-600">95%</span>
              </div>
              <div className="flex justify-between">
                <span>{t('research.within7Days')}</span>
                <span className="text-yellow-600">3%</span>
              </div>
              <div className="flex justify-between">
                <span>{t('research.delayed')}</span>
                <span className="text-red-600">2%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFollowUpView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('research.followUpRequired')}
        </CardTitle>
        <CardDescription>
          {t('research.adverseEventsRequiringFollowUp')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {adverseEvents.filter(ae => ae.followUpRequired).map((event) => (
            <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{event.eventTerm}</h3>
                  <Badge className={getSeverityBadge(event.severity)}>
                    {t(`research.${event.severity}`)}
                  </Badge>
                  {event.seriousness === 'serious' && (
                    <Badge variant="destructive">{t('research.serious')}</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{t('research.participant')}:</span> {event.participantId}
                  </div>
                  <div>
                    <span className="font-medium">{t('research.onsetDate')}:</span> {new Date(event.onsetDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">{t('research.reporter')}:</span> {event.reporter}
                  </div>
                  <div>
                    <span className="font-medium">{t('research.status')}:</span> {t(`research.${event.status}`)}
                  </div>
                </div>
                <p className="text-sm mt-2">{event.description}</p>
                {event.actions && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">{t('research.actionsTaken')}:</span>
                    <p className="text-sm text-muted-foreground">{event.actions}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm">
                  {t('research.updateFollowUp')}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t('research.events')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('research.analytics')}
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('research.followUp')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          {renderEventsView()}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAnalyticsView()}
        </TabsContent>

        <TabsContent value="followup">
          {renderFollowUpView()}
        </TabsContent>
      </Tabs>

      {/* Report AE Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('research.reportAdverseEvent')}</DialogTitle>
            <DialogDescription>
              {t('research.completeAEReportForm')}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t('research.basicInfo')}</TabsTrigger>
              <TabsTrigger value="details">{t('research.eventDetails')}</TabsTrigger>
              <TabsTrigger value="assessment">{t('research.assessment')}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('research.study')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectStudy')} />
                    </SelectTrigger>
                    <SelectContent>
                      {studies.map(study => (
                        <SelectItem key={study.id} value={study.id}>
                          {study.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('research.participant')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectParticipant')} />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.slice(0, 5).map(participant => (
                        <SelectItem key={participant.id} value={participant.id}>
                          {participant.participantId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('research.eventTerm')}</Label>
                  <Input placeholder={t('research.enterEventTerm')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('research.onsetDate')}</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('research.eventDescription')}</Label>
                <Textarea 
                  placeholder={t('research.describeEvent')}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t('research.severity')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">{t('research.mild')}</SelectItem>
                      <SelectItem value="moderate">{t('research.moderate')}</SelectItem>
                      <SelectItem value="severe">{t('research.severe')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('research.seriousness')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non_serious">{t('research.nonSerious')}</SelectItem>
                      <SelectItem value="serious">{t('research.serious')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('research.outcome')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">{t('research.ongoing')}</SelectItem>
                      <SelectItem value="resolved">{t('research.resolved')}</SelectItem>
                      <SelectItem value="resolving">{t('research.resolving')}</SelectItem>
                      <SelectItem value="sequelae">{t('research.sequelae')}</SelectItem>
                      <SelectItem value="fatal">{t('research.fatal')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('research.actionsTaken')}</Label>
                <Textarea 
                  placeholder={t('research.describeActionsTaken')}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <div className="space-y-2">
                <Label>{t('research.relationshipToStudyDrug')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unrelated">{t('research.unrelated')}</SelectItem>
                    <SelectItem value="unlikely">{t('research.unlikely')}</SelectItem>
                    <SelectItem value="possible">{t('research.possible')}</SelectItem>
                    <SelectItem value="probable">{t('research.probable')}</SelectItem>
                    <SelectItem value="related">{t('research.related')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('research.expectedness')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expected">{t('research.expected')}</SelectItem>
                    <SelectItem value="unexpected">{t('research.unexpected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('research.reporterAssessment')}</Label>
                <Textarea 
                  placeholder={t('research.provideAssessment')}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button>
              {t('research.submitReport')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdverseEvents;