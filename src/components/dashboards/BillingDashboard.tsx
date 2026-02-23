import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp,
  Users,
  Calendar,
  Search,
  Plus,
  Download,
  LogOut,
  Languages,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface BillingDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

const translations = {
  en: {
    title: 'Billing Dashboard',
    overview: 'Financial Overview',
    invoices: 'Invoices',
    insurance: 'Insurance Claims',
    reports: 'Financial Reports',
    todayRevenue: "Today's Revenue",
    pendingPayments: 'Pending Payments',
    insuranceClaims: 'Insurance Claims',
    totalInvoices: 'Total Invoices',
    createInvoice: 'Create Invoice',
    searchInvoices: 'Search invoices...',
    patientName: 'Patient Name',
    invoiceNumber: 'Invoice Number',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    paymentMethod: 'Payment Method',
    services: 'Services',
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    cash: 'Cash',
    card: 'Card',
    insurance: 'Insurance',
    viewDetails: 'View Details',
    markAsPaid: 'Mark as Paid',
    sendReminder: 'Send Reminder',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noInvoices: 'No invoices found',
    totalRevenue: 'Total Revenue',
    avgTransactionValue: 'Avg Transaction Value',
    paymentRate: 'Payment Rate',
  },
  ar: {
    title: 'لوحة تحكم الفواتير',
    overview: 'نظرة مالية عامة',
    invoices: 'الفواتير',
    insurance: 'مطالبات التأمين',
    reports: 'التقارير المالية',
    todayRevenue: 'إيرادات اليوم',
    pendingPayments: 'مدفوعات معلقة',
    insuranceClaims: 'مطالبات التأمين',
    totalInvoices: 'إجمالي الفواتير',
    createInvoice: 'إنشاء فاتورة',
    searchInvoices: 'البحث عن الفواتير...',
    patientName: 'اسم المريض',
    invoiceNumber: 'رقم الفاتورة',
    amount: 'المبلغ',
    status: 'الحالة',
    date: 'التاريخ',
    paymentMethod: 'طريقة الدفع',
    services: 'الخدمات',
    paid: 'مدفوع',
    pending: 'معلق',
    overdue: 'متأخر',
    cash: 'نقدي',
    card: 'بطاقة',
    insurance: 'تأمين',
    viewDetails: 'عرض التفاصيل',
    markAsPaid: 'تمييز كمدفوع',
    sendReminder: 'إرسال تذكير',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    noInvoices: 'لم يتم العثور على فواتير',
    totalRevenue: 'إجمالي الإيرادات',
    avgTransactionValue: 'متوسط قيمة المعاملة',
    paymentRate: 'معدل الدفع',
  }
};

// Mock billing data
const mockInvoices = [
  {
    id: 'INV-001',
    patientName: 'Ahmed Hassan',
    amount: 250.00,
    status: 'paid',
    date: '2024-12-01',
    paymentMethod: 'cash',
    services: ['Consultation', 'Blood Test'],
    insuranceProvider: null
  },
  {
    id: 'INV-002',
    patientName: 'Fatima Ali',
    amount: 450.00,
    status: 'pending',
    date: '2024-12-01',
    paymentMethod: 'insurance',
    services: ['Consultation', 'X-Ray', 'Medication'],
    insuranceProvider: 'Health Plus'
  },
  {
    id: 'INV-003',
    patientName: 'Mohamed Salah',
    amount: 180.00,
    status: 'overdue',
    date: '2024-11-28',
    paymentMethod: 'card',
    services: ['Follow-up Visit'],
    insuranceProvider: null
  }
];

export default function BillingDashboard({ user, onLogout, language, onLanguageChange }: BillingDashboardProps) {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { t } = useLanguage();
  const { navigateTo } = useNavigation();

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.services?.some((service: string) => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const todayRevenue = invoices
    .filter(inv => inv.date === new Date().toISOString().split('T')[0] && inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingPayments = invoices.filter(inv => inv.status === 'pending').length;
  const insuranceClaims = invoices.filter(inv => inv.paymentMethod === 'insurance').length;
  const totalInvoices = invoices.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />{t.paid}</Badge>;
      case 'pending':
        return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />{t.pending}</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />{t.overdue}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">Billing Manager: {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={t.todayRevenue}
            value={`$${todayRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title={t.pendingPayments}
            value={pendingPayments}
            icon={AlertTriangle}
            color="bg-orange-500"
          />
          <StatCard
            title={t.insuranceClaims}
            value={insuranceClaims}
            icon={CreditCard}
            color="bg-blue-500"
          />
          <StatCard
            title={t.totalInvoices}
            value={totalInvoices}
            icon={FileText}
            color="bg-purple-500"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.overview}
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="w-4 h-4 mr-2" />
              {t.invoices}
            </TabsTrigger>
            <TabsTrigger value="insurance">
              <CreditCard className="w-4 h-4 mr-2" />
              {t.insurance}
            </TabsTrigger>
            <TabsTrigger value="reports">
              <DollarSign className="w-4 h-4 mr-2" />
              {t.reports}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{invoice.patientName}</p>
                          <p className="text-sm text-gray-600">{invoice.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${invoice.amount}</p>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Cash Payments</span>
                      <span className="font-medium">
                        {invoices.filter(inv => inv.paymentMethod === 'cash').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Card Payments</span>
                      <span className="font-medium">
                        {invoices.filter(inv => inv.paymentMethod === 'card').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Insurance Claims</span>
                      <span className="font-medium">
                        {invoices.filter(inv => inv.paymentMethod === 'insurance').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.invoices}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t.searchInvoices}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.createInvoice}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{invoice.patientName}</h3>
                            <p className="text-sm text-gray-600">{invoice.id}</p>
                            <p className="text-sm text-gray-500">
                              {invoice.services.join(', ')} | {invoice.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">${invoice.amount}</p>
                            <p className="text-sm text-gray-600">{invoice.paymentMethod}</p>
                          </div>
                          {getStatusBadge(invoice.status)}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              {t.viewDetails}
                            </Button>
                            {invoice.status === 'pending' && (
                              <Button size="sm">
                                {t.markAsPaid}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noInvoices}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>{t.insurance}</CardTitle>
                <CardDescription>Manage insurance claims and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('insurance')}
                    className="mx-auto"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('billing.insuranceClaims')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Process and manage insurance claims
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>{t.reports}</CardTitle>
                <CardDescription>Financial reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('reports', 'financial')}
                    className="mx-auto"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('billing.financialReports')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    View comprehensive financial reports and analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}