import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Upload,
  Eye,
  Edit
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface RegulatoryComplianceProps {
  studies: any[];
  isDemoMode?: boolean;
}

const RegulatoryCompliance: React.FC<RegulatoryComplianceProps> = ({ studies, isDemoMode }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('approvals');

  const approvals = [
    {
      id: 'irb-001',
      studyId: 'study-001',
      type: 'IRB Approval',
      authority: 'Institutional Review Board',
      status: 'approved',
      approvalNumber: 'IRB-2024-001',
      approvalDate: '2024-01-10',
      expirationDate: '2025-01-10',
      renewalRequired: false,
      documents: ['Protocol v3.2', 'Informed Consent v2.1', 'Investigator CV']
    },
    {
      id: 'fda-001',
      studyId: 'study-001',
      type: 'FDA IND',
      authority: 'Food and Drug Administration',
      status: 'approved',
      approvalNumber: 'IND-156789',
      approvalDate: '2023-12-15',
      expirationDate: '2025-12-15',
      renewalRequired: false,
      documents: ['IND Application', 'Investigator Brochure', 'CMC Data']
    },
    {
      id: 'irb-002',
      studyId: 'study-002',
      type: 'IRB Approval',
      authority: 'Institutional Review Board',
      status: 'pending',
      submissionDate: '2024-12-20',
      documents: ['Protocol v2.1', 'Informed Consent v1.0']
    }
  ];

  const inspections = [
    {
      id: 'insp-001',
      studyId: 'study-001',
      inspector: 'FDA Inspector',
      inspectionDate: '2024-06-15',
      type: 'Routine GCP Inspection',
      status: 'completed',
      findings: 2,
      outcome: 'No Action Indicated',
      correctiveActions: 1
    },
    {
      id: 'insp-002',
      studyId: 'study-002',
      inspector: 'IRB QA Team',
      inspectionDate: '2024-11-10',
      type: 'Continuing Review',
      status: 'completed',
      findings: 0,
      outcome: 'Satisfactory',
      correctiveActions: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const renderApprovalsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {t('research.regulatoryApprovals')}
            </CardTitle>
            <CardDescription>
              {t('research.trackAllRegulatoryApprovals')}
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t('research.submitApproval')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.approvalType')}</TableHead>
              <TableHead>{t('research.study')}</TableHead>
              <TableHead>{t('research.authority')}</TableHead>
              <TableHead>{t('research.status')}</TableHead>
              <TableHead>{t('research.approvalNumber')}</TableHead>
              <TableHead>{t('research.validity')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => {
              const study = studies.find(s => s.id === approval.studyId);
              const isExpiring = approval.expirationDate && 
                new Date(approval.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              
              return (
                <TableRow key={approval.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{approval.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.documents?.length} documents
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{study?.title?.substring(0, 25)}...</p>
                      <p className="text-xs text-muted-foreground">{study?.phase}</p>
                    </div>
                  </TableCell>
                  <TableCell>{approval.authority}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(approval.status)}>
                        {t(`research.${approval.status}`)}
                      </Badge>
                      {isExpiring && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {approval.approvalNumber || (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {approval.approvalDate && approval.expirationDate ? (
                      <div className="text-sm">
                        <p>{new Date(approval.approvalDate).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          - {new Date(approval.expirationDate).toLocaleDateString()}
                        </p>
                        {isExpiring && (
                          <p className="text-yellow-600 text-xs">Expires soon</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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

  const renderInspectionsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              {t('research.inspectionsAudits')}
            </CardTitle>
            <CardDescription>
              {t('research.trackInspectionsAndAudits')}
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('research.scheduleInspection')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.inspectionType')}</TableHead>
              <TableHead>{t('research.study')}</TableHead>
              <TableHead>{t('research.inspector')}</TableHead>
              <TableHead>{t('research.date')}</TableHead>
              <TableHead>{t('research.status')}</TableHead>
              <TableHead>{t('research.findings')}</TableHead>
              <TableHead>{t('research.outcome')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.map((inspection) => {
              const study = studies.find(s => s.id === inspection.studyId);
              return (
                <TableRow key={inspection.id}>
                  <TableCell>
                    <p className="font-medium">{inspection.type}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{study?.title?.substring(0, 25)}...</p>
                      <p className="text-xs text-muted-foreground">{study?.phase}</p>
                    </div>
                  </TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    {new Date(inspection.inspectionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(inspection.status)}>
                      {t(`research.${inspection.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {inspection.findings > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span>{inspection.findings}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{inspection.outcome}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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

  const renderComplianceView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.complianceOverview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">96%</p>
              <p className="text-sm text-muted-foreground">{t('research.overallCompliance')}</p>
            </div>
            <Progress value={96} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="text-lg font-bold">12</p>
                <p className="text-muted-foreground">{t('research.activeApprovals')}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">2</p>
                <p className="text-muted-foreground">{t('research.expiringWithin30Days')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.upcomingDeadlines')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">IRB Renewal Due</p>
                <p className="text-xs text-muted-foreground">Study CARD-001 - Due in 15 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Annual Report</p>
                <p className="text-xs text-muted-foreground">FDA IND - Due in 45 days</p>
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
              <span>IRB approval received</span>
              <span className="text-muted-foreground text-xs ml-auto">2 days ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Protocol amendment submitted</span>
              <span className="text-muted-foreground text-xs ml-auto">1 week ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <span>Inspection scheduled</span>
              <span className="text-muted-foreground text-xs ml-auto">2 weeks ago</span>
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
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {t('research.approvals')}
          </TabsTrigger>
          <TabsTrigger value="inspections" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            {t('research.inspections')}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {t('research.compliance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          {renderApprovalsView()}
        </TabsContent>

        <TabsContent value="inspections">
          {renderInspectionsView()}
        </TabsContent>

        <TabsContent value="compliance">
          {renderComplianceView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegulatoryCompliance;