import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { getClinicalResearchTranslations } from '../../services/LanguageServiceExtended';
import { ResponsiveContainer, LineChart, BarChart, PieChart, AreaChart, Line, Bar, Pie, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ResearchAnalyticsProps {
  studies?: any[];
  participants?: any[];
  isDemoMode?: boolean;
}

const ResearchAnalytics: React.FC<ResearchAnalyticsProps> = ({ studies, participants, isDemoMode }) => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('enrollment');

  // Demo analytics data
  const enrollmentData = [
    { month: 'Jan', target: 50, actual: 45, cumulative: 45 },
    { month: 'Feb', target: 50, actual: 52, cumulative: 97 },
    { month: 'Mar', target: 50, actual: 48, cumulative: 145 },
    { month: 'Apr', target: 50, actual: 55, cumulative: 200 },
    { month: 'May', target: 50, actual: 47, cumulative: 247 },
    { month: 'Jun', target: 50, actual: 53, cumulative: 300 },
    { month: 'Jul', target: 50, actual: 49, cumulative: 349 },
    { month: 'Aug', target: 50, actual: 58, cumulative: 407 },
    { month: 'Sep', target: 50, actual: 51, cumulative: 458 },
    { month: 'Oct', target: 50, actual: 46, cumulative: 504 },
    { month: 'Nov', target: 50, actual: 54, cumulative: 558 },
    { month: 'Dec', target: 50, actual: 42, cumulative: 600 }
  ];

  const studyProgressData = [
    { study: 'CARD-001', planned: 200, enrolled: 156, completed: 89, percentage: 78 },
    { study: 'DIAB-002', planned: 120, enrolled: 120, completed: 112, percentage: 100 },
    { study: 'ONCO-003', planned: 80, enrolled: 45, completed: 12, percentage: 56 },
    { study: 'RESP-004', planned: 150, enrolled: 134, completed: 98, percentage: 89 }
  ];

  const protocolDeviations = [
    { month: 'Jan', count: 3, resolved: 3 },
    { month: 'Feb', count: 5, resolved: 4 },
    { month: 'Mar', count: 2, resolved: 2 },
    { month: 'Apr', count: 4, resolved: 4 },
    { month: 'May', count: 6, resolved: 5 },
    { month: 'Jun', count: 3, resolved: 3 },
    { month: 'Jul', count: 7, resolved: 6 },
    { month: 'Aug', count: 4, resolved: 4 },
    { month: 'Sep', count: 2, resolved: 2 },
    { month: 'Oct', count: 5, resolved: 5 },
    { month: 'Nov', count: 3, resolved: 3 },
    { month: 'Dec', count: 2, resolved: 1 }
  ];

  const visitComplianceData = [
    { study: 'CARD-001', compliance: 95.2, visits: 468, missed: 24 },
    { study: 'DIAB-002', compliance: 98.1, visits: 360, missed: 7 },
    { study: 'ONCO-003', compliance: 87.5, visits: 180, missed: 25 },
    { study: 'RESP-004', compliance: 92.8, visits: 402, missed: 31 }
  ];

  const timelineData = [
    { milestone: 'First Patient In', planned: '2024-01-15', actual: '2024-01-15', status: 'completed' },
    { milestone: '50% Enrollment', planned: '2024-06-01', actual: '2024-05-28', status: 'completed' },
    { milestone: 'Last Patient In', planned: '2024-12-31', actual: null, status: 'upcoming' },
    { milestone: 'Database Lock', planned: '2025-03-31', actual: null, status: 'upcoming' },
    { milestone: 'Final Report', planned: '2025-06-30', actual: null, status: 'upcoming' }
  ];

  const colors = ['#1e40af', '#16a34a', '#ea580c', '#8b5cf6', '#dc2626'];

  const renderEnrollmentView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('research.enrollmentTrend')}</CardTitle>
            <CardDescription>{t('research.monthlyEnrollmentVsTarget')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="target" fill="#cbd5e1" name={t('research.target')} />
                  <Bar dataKey="actual" fill="#3b82f6" name={t('research.actual')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('research.cumulativeEnrollment')}</CardTitle>
            <CardDescription>{t('research.totalEnrollmentOverTime')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#16a34a" 
                    fill="#16a34a" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('research.studyProgress')}</CardTitle>
          <CardDescription>{t('research.enrollmentProgressByStudy')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {studyProgressData.map((study, index) => (
              <div key={study.study} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{study.study}</h3>
                    <p className="text-sm text-muted-foreground">
                      {study.enrolled}/{study.planned} enrolled ({study.percentage}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{study.completed} completed</p>
                    <p className="text-xs text-muted-foreground">
                      {((study.completed / study.enrolled) * 100).toFixed(1)}% completion rate
                    </p>
                  </div>
                </div>
                <Progress value={study.percentage} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('research.visitCompliance')}</CardTitle>
            <CardDescription>{t('research.visitComplianceByStudy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitComplianceData.map((study, index) => (
                <div key={study.study} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{study.study}</span>
                    <span className="text-sm text-muted-foreground">
                      {study.compliance}% ({study.visits - study.missed}/{study.visits})
                    </span>
                  </div>
                  <Progress value={study.compliance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('research.protocolDeviations')}</CardTitle>
            <CardDescription>{t('research.monthlyDeviationTrend')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={protocolDeviations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ea580c" 
                    strokeWidth={2}
                    name={t('research.reported')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    name={t('research.resolved')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('research.complianceMetrics')}</CardTitle>
          <CardDescription>{t('research.keyComplianceIndicators')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">94.2%</p>
              <p className="text-sm text-muted-foreground">{t('research.overallCompliance')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-muted-foreground">{t('research.activeDeviations')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">3.2</p>
              <p className="text-sm text-muted-foreground">{t('research.avgResolutionDays')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">98.5%</p>
              <p className="text-sm text-muted-foreground">{t('research.dataCompleteness')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTimelineView = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('research.studyTimeline')}</CardTitle>
        <CardDescription>{t('research.keyMilestonesAndDeadlines')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineData.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-600' :
                  milestone.status === 'upcoming' ? 'bg-blue-600' : 'bg-gray-400'
                }`} />
                {index < timelineData.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{milestone.milestone}</h3>
                  <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                    {t(`research.${milestone.status}`)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{t('research.planned')}:</span> {new Date(milestone.planned).toLocaleDateString()}
                  </div>
                  {milestone.actual && (
                    <div>
                      <span className="font-medium">{t('research.actual')}:</span> {new Date(milestone.actual).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {milestone.status === 'completed' && milestone.actual && (
                  <div className="mt-1">
                    {new Date(milestone.actual) <= new Date(milestone.planned) ? (
                      <Badge className="bg-green-100 text-green-800">
                        {t('research.onTime')}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {t('research.delayed')}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderPerformanceView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.enrollmentRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">8.5</p>
              <p className="text-sm text-muted-foreground">{t('research.patientsPerMonth')}</p>
              <div className="mt-4">
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">85% of target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.retentionRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">94.7%</p>
              <p className="text-sm text-muted-foreground">{t('research.participantRetention')}</p>
              <div className="mt-4">
                <Progress value={94.7} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Above industry average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.dataQuality')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">97.8%</p>
              <p className="text-sm text-muted-foreground">{t('research.dataAccuracy')}</p>
              <div className="mt-4">
                <Progress value={97.8} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Excellent quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('research.sitePerformance')}</CardTitle>
            <CardDescription>{t('research.performanceByStudySite')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { site: 'Main Hospital', enrollment: 156, target: 200, efficiency: 78 },
                { site: 'Satellite Clinic A', enrollment: 89, target: 100, efficiency: 89 },
                { site: 'Satellite Clinic B', enrollment: 67, target: 80, efficiency: 84 }
              ].map((site, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{site.site}</span>
                    <span className="text-sm text-muted-foreground">
                      {site.enrollment}/{site.target} ({site.efficiency}%)
                    </span>
                  </div>
                  <Progress value={site.efficiency} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('research.recruitmentSources')}</CardTitle>
            <CardDescription>{t('research.enrollmentBySource')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Referrals', value: 45, color: '#3b82f6' },
                      { name: 'Advertisement', value: 25, color: '#16a34a' },
                      { name: 'Database', value: 20, color: '#ea580c' },
                      { name: 'Other', value: 10, color: '#8b5cf6' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Referrals', value: 45, color: '#3b82f6' },
                      { name: 'Advertisement', value: 25, color: '#16a34a' },
                      { name: 'Database', value: 20, color: '#ea580c' },
                      { name: 'Other', value: 10, color: '#8b5cf6' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('research.researchAnalytics')}</h2>
          <p className="text-muted-foreground">{t('research.comprehensiveAnalyticsAndInsights')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('research.exportAnalytics')}
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="enrollment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('research.enrollment')}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('research.compliance')}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('research.timeline')}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('research.performance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment">
          {renderEnrollmentView()}
        </TabsContent>

        <TabsContent value="compliance">
          {renderComplianceView()}
        </TabsContent>

        <TabsContent value="timeline">
          {renderTimelineView()}
        </TabsContent>

        <TabsContent value="performance">
          {renderPerformanceView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResearchAnalytics;