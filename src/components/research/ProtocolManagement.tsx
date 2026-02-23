import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BookOpen,
  FileText,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  History,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface ProtocolManagementProps {
  studies: any[];
  isDemoMode?: boolean;
}

const ProtocolManagement: React.FC<ProtocolManagementProps> = ({ studies, isDemoMode }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('protocols');

  const protocols = [
    {
      id: 'protocol-001',
      studyId: 'study-001',
      title: 'Cardiac Drug Safety and Efficacy Protocol',
      version: '3.2',
      status: 'approved',
      approvalDate: '2024-01-10',
      effectiveDate: '2024-01-15',
      author: 'Dr. Ahmed Hassan',
      reviewer: 'IRB Committee',
      amendments: 2,
      lastModified: '2024-12-15'
    },
    {
      id: 'protocol-002',
      studyId: 'study-002',
      title: 'Diabetes App Clinical Trial Protocol',
      version: '2.1',
      status: 'under_review',
      submittedDate: '2024-12-20',
      author: 'Dr. Sara Mohamed',
      reviewer: 'Dr. Omar Ali',
      amendments: 1,
      lastModified: '2024-12-20'
    }
  ];

  const amendments = [
    {
      id: 'amend-001',
      protocolId: 'protocol-001',
      amendmentNumber: 1,
      title: 'Inclusion Criteria Modification',
      description: 'Modified age range from 18-65 to 18-70 years',
      status: 'approved',
      submittedDate: '2024-06-15',
      approvedDate: '2024-06-22',
      author: 'Dr. Ahmed Hassan'
    },
    {
      id: 'amend-002',
      protocolId: 'protocol-001',
      amendmentNumber: 2,
      title: 'Safety Monitoring Update',
      description: 'Added additional safety assessments',
      status: 'approved',
      submittedDate: '2024-11-10',
      approvedDate: '2024-11-18',
      author: 'Dr. Ahmed Hassan'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const renderProtocolsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t('research.studyProtocols')}
            </CardTitle>
            <CardDescription>
              {t('research.manageProtocolsAndAmendments')}
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('research.newProtocol')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.protocolTitle')}</TableHead>
              <TableHead>{t('research.study')}</TableHead>
              <TableHead>{t('research.version')}</TableHead>
              <TableHead>{t('research.status')}</TableHead>
              <TableHead>{t('research.author')}</TableHead>
              <TableHead>{t('research.amendments')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols.map((protocol) => (
              <TableRow key={protocol.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{protocol.title}</p>
                    <p className="text-sm text-muted-foreground">ID: {protocol.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {studies.find(s => s.id === protocol.studyId)?.title?.substring(0, 30)}...
                </TableCell>
                <TableCell>
                  <Badge variant="outline">v{protocol.version}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(protocol.status)}>
                    {t(`research.${protocol.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>{protocol.author}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{protocol.amendments}</span>
                    {protocol.amendments > 0 && (
                      <History className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderAmendmentsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('research.protocolAmendments')}
            </CardTitle>
            <CardDescription>
              {t('research.trackProtocolChanges')}
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('research.newAmendment')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.amendmentTitle')}</TableHead>
              <TableHead>{t('research.protocol')}</TableHead>
              <TableHead>{t('research.number')}</TableHead>
              <TableHead>{t('research.status')}</TableHead>
              <TableHead>{t('research.submittedDate')}</TableHead>
              <TableHead>{t('research.author')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amendments.map((amendment) => {
              const protocol = protocols.find(p => p.id === amendment.protocolId);
              return (
                <TableRow key={amendment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{amendment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {amendment.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{protocol?.title?.substring(0, 25)}...</p>
                      <p className="text-xs text-muted-foreground">v{protocol?.version}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">#{amendment.amendmentNumber}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(amendment.status)}>
                      {t(`research.${amendment.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(amendment.submittedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{amendment.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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

  const renderTemplatesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          name: 'Phase I Protocol Template',
          description: 'Standard template for Phase I clinical trials',
          downloads: 45,
          lastUpdated: '2024-11-15'
        },
        {
          name: 'Observational Study Template',
          description: 'Template for observational and registry studies',
          downloads: 23,
          lastUpdated: '2024-10-22'
        },
        {
          name: 'Device Study Template',
          description: 'Medical device clinical trial protocol template',
          downloads: 18,
          lastUpdated: '2024-09-30'
        }
      ].map((template, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{t('research.downloads')}: {template.downloads}</span>
                <span>{t('research.updated')}: {new Date(template.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t('research.download')}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="protocols" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('research.protocols')}
          </TabsTrigger>
          <TabsTrigger value="amendments" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t('research.amendments')}
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('research.templates')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="protocols">
          {renderProtocolsView()}
        </TabsContent>

        <TabsContent value="amendments">
          {renderAmendmentsView()}
        </TabsContent>

        <TabsContent value="templates">
          {renderTemplatesView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProtocolManagement;