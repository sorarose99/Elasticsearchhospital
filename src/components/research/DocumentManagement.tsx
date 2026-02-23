import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText,
  Folder,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface DocumentManagementProps {
  studies: any[];
  isDemoMode?: boolean;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ studies, isDemoMode }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const documents = [
    {
      id: 'doc-001',
      name: 'Study Protocol v3.2',
      type: 'protocol',
      studyId: 'study-001',
      version: '3.2',
      status: 'approved',
      size: '2.4 MB',
      uploadDate: '2024-01-10',
      uploadedBy: 'Dr. Ahmed Hassan',
      category: 'Essential Documents',
      description: 'Main study protocol document',
      approvedBy: 'IRB Committee',
      expiryDate: '2025-01-10'
    },
    {
      id: 'doc-002',
      name: 'Informed Consent Form',
      type: 'consent',
      studyId: 'study-001',
      version: '2.1',
      status: 'approved',
      size: '856 KB',
      uploadDate: '2024-01-08',
      uploadedBy: 'Dr. Sara Mohamed',
      category: 'Consent Forms',
      description: 'Patient informed consent document',
      approvedBy: 'IRB Committee',
      expiryDate: '2025-01-08'
    },
    {
      id: 'doc-003',
      name: 'Case Report Form Template',
      type: 'crf',
      studyId: 'study-001',
      version: '1.5',
      status: 'draft',
      size: '1.2 MB',
      uploadDate: '2024-12-20',
      uploadedBy: 'Research Coordinator',
      category: 'Data Collection',
      description: 'Template for case report forms'
    },
    {
      id: 'doc-004',
      name: 'Investigator Brochure',
      type: 'brochure',
      studyId: 'study-001',
      version: '4.0',
      status: 'approved',
      size: '5.8 MB',
      uploadDate: '2023-12-01',
      uploadedBy: 'Sponsor',
      category: 'Reference Documents',
      description: 'Comprehensive investigator information',
      approvedBy: 'Medical Monitor'
    }
  ];

  const documentCategories = [
    'Essential Documents',
    'Consent Forms',
    'Data Collection',
    'Reference Documents',
    'Regulatory Submissions',
    'Reports',
    'Communications',
    'Safety Documents'
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      archived: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'protocol':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'consent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'crf':
        return <Edit className="h-4 w-4 text-purple-600" />;
      case 'brochure':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const renderLibraryView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              {t('research.documentLibrary')}
            </CardTitle>
            <CardDescription>
              {t('research.manageAllStudyDocuments')}
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t('research.uploadDocument')}
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('research.searchDocuments')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('research.documentType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('research.allTypes')}</SelectItem>
              <SelectItem value="protocol">{t('research.protocols')}</SelectItem>
              <SelectItem value="consent">{t('research.consentForms')}</SelectItem>
              <SelectItem value="crf">{t('research.casereportForms')}</SelectItem>
              <SelectItem value="brochure">{t('research.brochures')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('research.documentName')}</TableHead>
              <TableHead>{t('research.type')}</TableHead>
              <TableHead>{t('research.study')}</TableHead>
              <TableHead>{t('research.version')}</TableHead>
              <TableHead>{t('research.status')}</TableHead>
              <TableHead>{t('research.uploadDate')}</TableHead>
              <TableHead>{t('research.size')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => {
              const study = studies.find(s => s.id === doc.studyId);
              const isExpiring = doc.expiryDate && 
                new Date(doc.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              
              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getTypeIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {t(`research.${doc.type}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{study?.title?.substring(0, 20)}...</p>
                      <p className="text-xs text-muted-foreground">{study?.phase}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">v{doc.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(doc.status)}>
                        {t(`research.${doc.status}`)}
                      </Badge>
                      {isExpiring && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(doc.uploadDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">{doc.uploadedBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>{doc.size}</TableCell>
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

  const renderCategoriesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documentCategories.map((category) => {
        const categoryDocs = documents.filter(doc => doc.category === category);
        const approvedDocs = categoryDocs.filter(doc => doc.status === 'approved').length;
        const draftDocs = categoryDocs.filter(doc => doc.status === 'draft').length;
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Folder className="h-5 w-5" />
                {category}
              </CardTitle>
              <CardDescription>
                {categoryDocs.length} {t('research.documents')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{approvedDocs}</p>
                    <p className="text-muted-foreground">{t('research.approved')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-yellow-600">{draftDocs}</p>
                    <p className="text-muted-foreground">{t('research.draft')}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {categoryDocs.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{doc.name}</span>
                      <Badge className={getStatusBadge(doc.status)} variant="outline">
                        {t(`research.${doc.status}`)}
                      </Badge>
                    </div>
                  ))}
                  {categoryDocs.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{categoryDocs.length - 3} more documents
                    </p>
                  )}
                </div>
                
                <Button size="sm" className="w-full">
                  {t('research.viewAll')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderVersionsView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('research.documentVersions')}
        </CardTitle>
        <CardDescription>
          {t('research.trackDocumentVersionHistory')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Protocol versions example */}
          <div>
            <h3 className="font-medium mb-3">Study Protocol - Cardiac Drug Trial</h3>
            <div className="space-y-3">
              {[
                { version: '3.2', date: '2024-01-10', status: 'approved', changes: 'Safety monitoring updates' },
                { version: '3.1', date: '2023-11-15', status: 'archived', changes: 'Inclusion criteria modification' },
                { version: '3.0', date: '2023-08-01', status: 'archived', changes: 'Initial approved version' },
                { version: '2.5', date: '2023-06-15', status: 'archived', changes: 'Pre-approval revision' }
              ].map((version, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">v{version.version}</Badge>
                    <div>
                      <p className="font-medium">{version.changes}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(version.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(version.status)}>
                      {t(`research.${version.status}`)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            {t('research.library')}
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('research.categories')}
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('research.versions')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          {renderLibraryView()}
        </TabsContent>

        <TabsContent value="categories">
          {renderCategoriesView()}
        </TabsContent>

        <TabsContent value="versions">
          {renderVersionsView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;