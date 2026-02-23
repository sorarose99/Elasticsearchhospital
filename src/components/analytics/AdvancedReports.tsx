import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DatePickerWithRange } from '../ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AdvancedReportsProps {
  language: 'en' | 'ar';
}

const translations = {
  en: {
    title: 'Advanced Analytics & Reports',
    overview: 'Overview',
    financial: 'Financial',
    clinical: 'Clinical',
    operational: 'Operational',
    patientStats: 'Patient Statistics',
    revenueAnalysis: 'Revenue Analysis',
    departmentPerformance: 'Department Performance',
    appointmentTrends: 'Appointment Trends',
    labUtilization: 'Lab Utilization',
    radiologyWorkload: 'Radiology Workload',
    medicationDispensing: 'Medication Dispensing',
    exportReport: 'Export Report',
    refreshData: 'Refresh Data',
    filterData: 'Filter Data',
    dateRange: 'Date Range',
    totalPatients: 'Total Patients',
    activePatients: 'Active Patients',
    newPatients: 'New Patients',
    totalRevenue: 'Total Revenue',
    avgRevenue: 'Avg Revenue per Patient',
    totalAppointments: 'Total Appointments',
    completedTests: 'Completed Tests',
    prescriptionsDispensed: 'Prescriptions Dispensed',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    last3Months: 'Last 3 Months',
    thisYear: 'This Year',
    byDepartment: 'By Department',
    byMonth: 'By Month',
    byTestType: 'By Test Type',
    byMedication: 'By Medication',
  },
  ar: {
    title: 'التحليلات والتقارير المتقدمة',
    overview: 'نظرة عامة',
    financial: 'مالي',
    clinical: 'سريري',
    operational: 'تشغيلي',
    patientStats: 'إحصائيات المرضى',
    revenueAnalysis: 'تحليل الإيرادات',
    departmentPerformance: 'أداء الأقسام',
    appointmentTrends: 'اتجاهات المواعيد',
    labUtilization: 'استخدام المختبر',
    radiologyWorkload: 'عبء عمل الأشعة',
    medicationDispensing: 'صرف الأدوية',
    exportReport: 'تصدير التقرير',
    refreshData: 'تحديث البيانات',
    filterData: 'تصفية البيانات',
    dateRange: 'النطاق الزمني',
    totalPatients: 'إجمالي المرضى',
    activePatients: 'المرضى النشطون',
    newPatients: 'المرضى الجدد',
    totalRevenue: 'إجمالي الإيرادات',
    avgRevenue: 'متوسط الإيراد لكل مريض',
    totalAppointments: 'إجمالي المواعيد',
    completedTests: 'الفحوصات المكتملة',
    prescriptionsDispensed: 'الوصفات المصروفة',
    last7Days: 'آخر 7 أيام',
    last30Days: 'آخر 30 يوم',
    last3Months: 'آخر 3 أشهر',
    thisYear: 'هذا العام',
    byDepartment: 'حسب القسم',
    byMonth: 'حسب الشهر',
    byTestType: 'حسب نوع الفحص',
    byMedication: 'حسب الدواء',
  }
};

// Mock data for charts
const patientStatsData = [
  { month: 'Jan', newPatients: 120, totalVisits: 450, revenue: 25000 },
  { month: 'Feb', newPatients: 135, totalVisits: 520, revenue: 28000 },
  { month: 'Mar', newPatients: 145, totalVisits: 580, revenue: 32000 },
  { month: 'Apr', newPatients: 160, totalVisits: 620, revenue: 35000 },
  { month: 'May', newPatients: 175, totalVisits: 680, revenue: 38000 },
  { month: 'Jun', newPatients: 190, totalVisits: 750, revenue: 42000 },
];

const departmentData = [
  { name: 'Cardiology', patients: 185, revenue: 45000, satisfaction: 4.8 },
  { name: 'Orthopedics', patients: 156, revenue: 38000, satisfaction: 4.6 },
  { name: 'Pediatrics', patients: 134, revenue: 28000, satisfaction: 4.9 },
  { name: 'General Medicine', patients: 298, revenue: 52000, satisfaction: 4.5 },
  { name: 'Dermatology', patients: 89, revenue: 22000, satisfaction: 4.7 },
];

const labUtilizationData = [
  { testType: 'Blood Chemistry', count: 450, percentage: 35 },
  { testType: 'Hematology', count: 320, percentage: 25 },
  { testType: 'Microbiology', count: 180, percentage: 14 },
  { testType: 'Immunology', count: 150, percentage: 12 },
  { testType: 'Coagulation', count: 120, percentage: 9 },
  { testType: 'Other', count: 65, percentage: 5 },
];

const radiologyData = [
  { month: 'Jan', xray: 85, ct: 45, mri: 25, ultrasound: 65 },
  { month: 'Feb', xray: 92, ct: 52, mri: 28, ultrasound: 71 },
  { month: 'Mar', xray: 98, ct: 58, mri: 32, ultrasound: 78 },
  { month: 'Apr', xray: 105, ct: 65, mri: 35, ultrasound: 85 },
  { month: 'May', xray: 112, ct: 71, mri: 38, ultrasound: 92 },
  { month: 'Jun', xray: 118, ct: 78, mri: 42, ultrasound: 98 },
];

const pharmacyData = [
  { medication: 'Paracetamol', dispensed: 450, category: 'Analgesic' },
  { medication: 'Amoxicillin', dispensed: 320, category: 'Antibiotic' },
  { medication: 'Metformin', dispensed: 280, category: 'Antidiabetic' },
  { medication: 'Lisinopril', dispensed: 245, category: 'ACE Inhibitor' },
  { medication: 'Omeprazole', dispensed: 210, category: 'PPI' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdvancedReports({ language }: AdvancedReportsProps) {
  const [dateRange, setDateRange] = useState('last30Days');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const t = translations[language];

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% from last period
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7Days">{t.last7Days}</SelectItem>
              <SelectItem value="last30Days">{t.last30Days}</SelectItem>
              <SelectItem value="last3Months">{t.last3Months}</SelectItem>
              <SelectItem value="thisYear">{t.thisYear}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {t.filterData}
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.refreshData}
          </Button>
          
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t.exportReport}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="financial">{t.financial}</TabsTrigger>
          <TabsTrigger value="clinical">{t.clinical}</TabsTrigger>
          <TabsTrigger value="operational">{t.operational}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title={t.totalPatients}
              value="2,847"
              change={12.5}
              icon={Users}
              color="bg-blue-500"
            />
            <MetricCard
              title={t.totalRevenue}
              value="$245,890"
              change={8.2}
              icon={DollarSign}
              color="bg-green-500"
            />
            <MetricCard
              title={t.totalAppointments}
              value="1,234"
              change={-2.1}
              icon={Calendar}
              color="bg-purple-500"
            />
            <MetricCard
              title={t.completedTests}
              value="3,456"
              change={15.7}
              icon={Activity}
              color="bg-orange-500"
            />
          </div>

          {/* Patient Statistics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t.patientStats}</CardTitle>
              <CardDescription>Monthly trends in patient registrations and visits</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={patientStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="newPatients" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="totalVisits" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Revenue Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{t.revenueAnalysis}</CardTitle>
              <CardDescription>Monthly revenue trends and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>{t.departmentPerformance}</CardTitle>
              <CardDescription>Revenue and patient volume by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="patients" fill="#8884d8" name="Patients" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical" className="space-y-6">
          {/* Lab Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.labUtilization}</CardTitle>
                <CardDescription>Distribution of lab tests by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={labUtilizationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {labUtilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.radiologyWorkload}</CardTitle>
                <CardDescription>Monthly imaging studies by modality</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={radiologyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="xray" stackId="a" fill="#8884d8" name="X-Ray" />
                    <Bar dataKey="ct" stackId="a" fill="#82ca9d" name="CT" />
                    <Bar dataKey="mri" stackId="a" fill="#ffc658" name="MRI" />
                    <Bar dataKey="ultrasound" stackId="a" fill="#ff7300" name="Ultrasound" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Medication Dispensing */}
          <Card>
            <CardHeader>
              <CardTitle>{t.medicationDispensing}</CardTitle>
              <CardDescription>Top dispensed medications this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pharmacyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="medication" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="dispensed" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          {/* Appointment Trends */}
          <Card>
            <CardHeader>
              <CardTitle>{t.appointmentTrends}</CardTitle>
              <CardDescription>Daily appointment volume and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalVisits" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Wait Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">15 min</div>
                <p className="text-sm text-green-600">-2 min from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.7/5</div>
                <p className="text-sm text-green-600">+0.2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>No-Show Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.5%</div>
                <p className="text-sm text-red-600">+1.2% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}