import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  FlaskConical, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  LogOut,
  Languages,
  Activity,
  Wifi
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supabase } from '../../utils/supabase/client';
import { projectId } from '../../utils/supabase/info';
import HL7Integration from '../lab/HL7Integration';
import { translations, mockLabOrders } from '../lab/constants';
import { filterLabOrders, calculateLabStats } from '../lab/helpers';
import { LabOrderCard, CompletedTestCard, StatCard } from '../lab/components';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';
import { toast } from 'sonner';
import { useAgentWrapper } from '../agent/withElasticsearchAgent';
import AgentInsightCard from '../agent/AgentInsightCard';
import AgentSmartBadge from '../agent/AgentSmartBadge';
import AgentQuickActions from '../agent/AgentQuickActions';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface LabDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  isDemoMode?: boolean;
}

export default function LabDashboard({ user, onLogout, language, onLanguageChange, isDemoMode = false }: LabDashboardProps) {
  const [labOrders, setLabOrders] = useState(mockLabOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [testResults, setTestResults] = useState({
    value: '',
    unit: '',
    normalRange: '',
    interpretation: '',
    notes: '',
    status: 'normal'
  });

  const { t } = useLanguage();
  const { navigateTo } = useNavigation();
  
  // Elasticsearch Agent Integration
  const { AgentComponents, updateContext } = useAgentWrapper('laboratory', language);

  useEffect(() => {
    if (!isDemoMode) {
      fetchLabOrders();
    }
  }, [isDemoMode]);

  const fetchLabOrders = async () => {
    try {
      setLoading(true);
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/lab-orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLabOrders(data.labOrders || []);
      }
    } catch (error) {
      console.error('Error fetching lab orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultsSubmission = async () => {
    try {
      if (isDemoMode) {
        setLabOrders(labOrders.map((order: any) => 
          order.id === selectedOrder.id 
            ? { ...order, status: 'completed', results: testResults, completedAt: new Date().toISOString() }
            : order
        ));
        setShowResultsDialog(false);
        setSelectedOrder(null);
        resetTestResults();
        toast.success(t.resultsUpdated);
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/lab-orders/${selectedOrder.id}/results`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ results: testResults })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLabOrders(labOrders.map((order: any) => 
          order.id === selectedOrder.id ? data.labOrder : order
        ));
        setShowResultsDialog(false);
        setSelectedOrder(null);
        resetTestResults();
        toast.success(t.resultsUpdated);
      }
    } catch (error) {
      console.error('Error updating results:', error);
      toast.error(t.error);
    }
  };

  const resetTestResults = () => {
    setTestResults({
      value: '',
      unit: '',
      normalRange: '',
      interpretation: '',
      notes: '',
      status: 'normal'
    });
  };

  const handleEnterResults = (order: any) => {
    setSelectedOrder(order);
    setShowResultsDialog(true);
  };

  const filteredOrders = filterLabOrders(labOrders, searchTerm);
  const { pendingOrders, completedOrders, todayOrders, criticalResults } = calculateLabStats(labOrders);

  // Generate AI Quick Actions for Lab Dashboard
  const quickActions = [
    ...(criticalResults.length > 0 ? [{
      id: 'review-critical',
      label: t('reviewCritical') || 'Review Critical Results',
      icon: AlertTriangle,
      onClick: () => toast.info('Reviewing critical results...'),
      badge: String(criticalResults.length),
      urgent: true
    }] : []),
    ...(pendingOrders.length > 5 ? [{
      id: 'prioritize-tests',
      label: t('prioritizeTests') || 'Prioritize Tests',
      icon: Clock,
      onClick: () => toast.info('Prioritizing pending tests...'),
      badge: String(pendingOrders.length),
      urgent: false
    }] : []),
    {
      id: 'quality-check',
      label: t('qualityCheck') || 'Run Quality Check',
      icon: CheckCircle,
      onClick: () => toast.info('Running quality control...'),
      urgent: false
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">Lab Technician: {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Demo Mode
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-6">
        {/* AI Quick Actions */}
        <AgentQuickActions 
          actions={quickActions}
          title={t('aiRecommendations') || 'AI Recommendations'}
        />

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {criticalResults.length > 0 && (
            <AgentInsightCard
              type="warning"
              title={t('criticalResults') || 'Critical Results'}
              description={`${criticalResults.length} ${t('criticalTestsNeedReview') || 'critical tests need immediate review'}`}
              priority="high"
              action={{
                label: t('reviewNow') || 'Review Now',
                onClick: () => toast.info('Opening critical results...')
              }}
              compact={true}
            />
          )}
          
          <AgentInsightCard
            type="insight"
            title={t('testTrends') || 'Test Volume Trends'}
            description={t('testVolumeUp') || 'Test volume up 15% this week'}
            priority="medium"
            metrics={[
              {
                label: t('thisWeek') || 'This Week',
                value: '+15%',
                trend: 'up'
              }
            ]}
            compact={true}
          />
          
          <AgentInsightCard
            type="recommendation"
            title={t('efficiency') || 'Efficiency Tip'}
            description={t('batchSimilarTests') || 'Batch similar tests to reduce turnaround time by 20%'}
            priority="low"
            action={{
              label: t('learnMore') || 'Learn More',
              onClick: () => toast.info('Opening efficiency guide...')
            }}
            compact={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={t.todayTests}
            value={todayOrders.length}
            icon={TestTube}
            color="bg-blue-500"
          />
          <StatCard
            title={t.pendingResults}
            value={pendingOrders.length}
            icon={Clock}
            color="bg-orange-500"
          />
          <StatCard
            title={t.completedToday}
            value={completedOrders.length}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title={t.criticalResults}
            value={criticalResults.length}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">
              <Clock className="w-4 h-4 mr-2" />
              {t.pendingTests}
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle className="w-4 h-4 mr-2" />
              {t.completedTests}
            </TabsTrigger>
            <TabsTrigger value="results">
              <FileText className="w-4 h-4 mr-2" />
              {t.testResults}
            </TabsTrigger>
            <TabsTrigger value="quality">
              <FlaskConical className="w-4 h-4 mr-2" />
              {t.qualityControl}
            </TabsTrigger>
            <TabsTrigger value="hl7">
              <Wifi className="w-4 h-4 mr-2" />
              {t.hl7Integration}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.pendingTests}</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t.searchTests}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map((order: any, index) => (
                      <LabOrderCard 
                        key={index} 
                        order={order} 
                        t={t}
                        onEnterResults={handleEnterResults}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noTests}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.completedTests}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedOrders.length > 0 ? (
                    completedOrders.map((order: any, index) => (
                      <CompletedTestCard key={index} order={order} t={t} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No completed tests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>{t.testResults}</CardTitle>
                <CardDescription>View and manage test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('laboratory', 'results')}
                    className="mx-auto"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('lab.results')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    View and manage laboratory test results
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle>{t.qualityControl}</CardTitle>
                <CardDescription>Quality control and calibration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('quality')}
                    className="mx-auto"
                  >
                    <FlaskConical className="w-4 h-4 mr-2" />
                    {t('lab.qualityControl')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Quality control and assurance management
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hl7">
            <HL7Integration language={language} />
          </TabsContent>
        </Tabs>

        {/* Results Entry Dialog */}
        <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.enterResults}</DialogTitle>
              <DialogDescription>
                Enter test results for {selectedOrder?.patientName} - {selectedOrder?.testType}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.result}</Label>
                  <Input
                    value={testResults.value}
                    onChange={(e) => setTestResults({...testResults, value: e.target.value})}
                    placeholder="Enter result value"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.unit}</Label>
                  <Input
                    value={testResults.unit}
                    onChange={(e) => setTestResults({...testResults, unit: e.target.value})}
                    placeholder="mg/dL, mmol/L, etc."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t.referenceRange}</Label>
                <Input
                  value={testResults.normalRange}
                  onChange={(e) => setTestResults({...testResults, normalRange: e.target.value})}
                  placeholder="e.g., 70-100 mg/dL"
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t.status}</Label>
                <Select 
                  value={testResults.status} 
                  onValueChange={(value) => setTestResults({...testResults, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">{t.normal}</SelectItem>
                    <SelectItem value="abnormal">{t.abnormal}</SelectItem>
                    <SelectItem value="critical">{t.critical}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t.interpretation}</Label>
                <Textarea
                  value={testResults.interpretation}
                  onChange={(e) => setTestResults({...testResults, interpretation: e.target.value})}
                  placeholder="Clinical interpretation of results"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t.notes}</Label>
                <Textarea
                  value={testResults.notes}
                  onChange={(e) => setTestResults({...testResults, notes: e.target.value})}
                  placeholder="Additional notes or observations"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleResultsSubmission}>
                {t.saveResults}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Elasticsearch Agent Integration */}
      <AgentComponents />
    </div>
  );
}