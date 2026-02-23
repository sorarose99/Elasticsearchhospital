import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Users, 
  TrendingUp,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Receipt,
  Building,
  Calculator,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DatePickerWithRange } from '../ui/date-picker';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../../services/LanguageService';
import firebaseService from '../../services/FirebaseService';

interface BillingManagementProps {
  userRole: string;
}

// Mock data
const mockDashboardData = {
  totalRevenue: 245890,
  pendingPayments: 45620,
  completedPayments: 200270,
  insuranceClaims: 32,
  monthlyGrowth: 12.5,
  paymentMethodsData: [
    { method: 'Cash', amount: 45000, percentage: 30 },
    { method: 'Credit Card', amount: 67500, percentage: 45 },
    { method: 'Insurance', amount: 30000, percentage: 20 },
    { method: 'Bank Transfer', amount: 7500, percentage: 5 },
  ]
};

const mockInvoices = [
  {
    id: 'INV-001',
    patientId: 'P001',
    patientName: 'أحمد محمد',
    invoiceDate: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 1500,
    status: 'paid',
    items: [
      { description: 'فحص طبي شامل', quantity: 1, unitPrice: 500, total: 500 },
      { description: 'تحاليل مختبرية', quantity: 3, unitPrice: 200, total: 600 },
      { description: 'أشعة مقطعية', quantity: 1, unitPrice: 400, total: 400 }
    ],
    subtotal: 1500,
    tax: 0,
    discount: 0,
    total: 1500
  },
  {
    id: 'INV-002',
    patientId: 'P002',
    patientName: 'فاطمة علي',
    invoiceDate: '2024-01-16',
    dueDate: '2024-02-16',
    amount: 2200,
    status: 'pending',
    items: [
      { description: 'عملية جراحية بسيطة', quantity: 1, unitPrice: 2000, total: 2000 },
      { description: 'متابعة طبية', quantity: 1, unitPrice: 200, total: 200 }
    ],
    subtotal: 2200,
    tax: 0,
    discount: 0,
    total: 2200
  },
  {
    id: 'INV-003',
    patientId: 'P003',
    patientName: 'محمد حسن',
    invoiceDate: '2024-01-10',
    dueDate: '2024-02-10',
    amount: 800,
    status: 'overdue',
    items: [
      { description: 'استشارة طبية', quantity: 2, unitPrice: 300, total: 600 },
      { description: 'وصفة طبية', quantity: 1, unitPrice: 200, total: 200 }
    ],
    subtotal: 800,
    tax: 0,
    discount: 0,
    total: 800
  }
];

const mockPayments = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-001',
    patientName: 'أحمد محمد',
    amount: 1500,
    method: 'creditCard',
    date: '2024-01-20',
    status: 'completed'
  },
  {
    id: 'PAY-002',
    invoiceId: 'INV-004',
    patientName: 'سارة أحمد',
    amount: 750,
    method: 'cash',
    date: '2024-01-19',
    status: 'completed'
  }
];

const mockInsuranceClaims = [
  {
    id: 'CLM-001',
    claimNumber: 'CL2024001',
    patientName: 'أحمد محمد',
    provider: 'شركة التأمين الطبي الأولى',
    claimAmount: 2500,
    approvedAmount: 2200,
    status: 'approved',
    submissionDate: '2024-01-10',
    approvalDate: '2024-01-15'
  },
  {
    id: 'CLM-002',
    claimNumber: 'CL2024002',
    patientName: 'فاطمة علي',
    provider: 'شركة الصحة للتأمين',
    claimAmount: 1800,
    approvedAmount: 0,
    status: 'submitted',
    submissionDate: '2024-01-18',
    approvalDate: null
  }
];

export default function BillingManagement({ userRole }: BillingManagementProps) {
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  // Load data from Firebase
  useEffect(() => {
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribeInvoices = firebaseService.subscribeToCollection('invoices', (updatedInvoices) => {
      setInvoices(updatedInvoices);
      updateDashboardStats(updatedInvoices);
    });
    
    const unsubscribeClaims = firebaseService.subscribeToCollection('insuranceClaims', (updatedClaims) => {
      setClaims(updatedClaims);
    });
    
    return () => {
      unsubscribeInvoices();
      unsubscribeClaims();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invoicesData, claimsData] = await Promise.all([
        firebaseService.getInvoices(),
        firebaseService.getInsuranceClaims()
      ]);
      
      setInvoices(invoicesData);
      setClaims(claimsData);
      updateDashboardStats(invoicesData);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const updateDashboardStats = (invoicesData: any[]) => {
    const totalRevenue = invoicesData.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const pendingPayments = invoicesData
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    const completedPayments = invoicesData
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    setDashboardData(prev => ({
      ...prev,
      totalRevenue,
      pendingPayments,
      completedPayments
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: t('billing.paid') },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: t('billing.pending') },
      overdue: { color: 'bg-red-100 text-red-800', label: t('billing.overdue') },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: t('common.cancelled') },
      completed: { color: 'bg-green-100 text-green-800', label: t('billing.paid') },
      approved: { color: 'bg-green-100 text-green-800', label: t('billing.approved') },
      rejected: { color: 'bg-red-100 text-red-800', label: t('billing.rejected') },
      submitted: { color: 'bg-blue-100 text-blue-800', label: t('billing.submitted') },
      underReview: { color: 'bg-yellow-100 text-yellow-800', label: t('billing.underReview') }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      await firebaseService.createInvoice({
        ...invoiceData,
        status: 'pending'
      });
      
      setIsInvoiceDialogOpen(false);
      // Success toast is automatic from FirebaseService
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error(language === 'ar' ? 'خطأ في إنشاء الفاتورة' : 'Error creating invoice');
    }
  };

  const handleRecordPayment = async (paymentData: any) => {
    try {
      // Mark invoice as paid
      await firebaseService.markInvoiceAsPaid(paymentData.invoiceId, {
        method: paymentData.method,
        amount: paymentData.amount,
        date: new Date().toISOString()
      });
      
      setIsPaymentDialogOpen(false);
      // Success toast is automatic from FirebaseService
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error(language === 'ar' ? 'خطأ في تسجيل الدفع' : 'Error recording payment');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% من الفترة الماضية
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('billing.management')}</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsInvoiceDialogOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('billing.createInvoice')}
          </Button>
          <Button onClick={() => setIsPaymentDialogOpen(true)} variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            {t('billing.recordPayment')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">{t('billing.dashboard')}</TabsTrigger>
          <TabsTrigger value="invoices">{t('billing.invoices')}</TabsTrigger>
          <TabsTrigger value="payments">{t('billing.payments')}</TabsTrigger>
          <TabsTrigger value="insurance">{t('billing.insurance')}</TabsTrigger>
          <TabsTrigger value="reports">{t('billing.reports')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title={t('billing.totalRevenue')}
              value={`$${mockDashboardData.totalRevenue.toLocaleString()}`}
              change={mockDashboardData.monthlyGrowth}
              icon={DollarSign}
              color="bg-green-500"
            />
            <MetricCard
              title={t('billing.pendingPayments')}
              value={`$${mockDashboardData.pendingPayments.toLocaleString()}`}
              change={-5.2}
              icon={Clock}
              color="bg-yellow-500"
            />
            <MetricCard
              title={t('billing.completedPayments')}
              value={`$${mockDashboardData.completedPayments.toLocaleString()}`}
              change={15.8}
              icon={CheckCircle}
              color="bg-blue-500"
            />
            <MetricCard
              title={t('billing.insuranceClaims')}
              value={mockDashboardData.insuranceClaims}
              change={8.3}
              icon={Building}
              color="bg-purple-500"
            />
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.recentTransactions')}</CardTitle>
              <CardDescription>{t('billing.latestTransactions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${payment.amount}</p>
                      <p className="text-sm text-muted-foreground capitalize">{payment.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('common.search') + "..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="paid">{t('billing.paid')}</SelectItem>
                    <SelectItem value="pending">{t('billing.pending')}</SelectItem>
                    <SelectItem value="overdue">{t('billing.overdue')}</SelectItem>
                    <SelectItem value="cancelled">{t('common.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('common.filter')}
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('common.export')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.invoices')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('billing.invoiceNumber')}</TableHead>
                    <TableHead>{t('billing.patientName')}</TableHead>
                    <TableHead>{t('billing.invoiceDate')}</TableHead>
                    <TableHead>{t('billing.dueDate')}</TableHead>
                    <TableHead>{t('billing.amount')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>{invoice.invoiceDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>${invoice.amount}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.payments')}</CardTitle>
              <CardDescription>{t('billing.latestTransactions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('billing.paymentId')}</TableHead>
                    <TableHead>{t('billing.invoiceNumber')}</TableHead>
                    <TableHead>{t('billing.patientName')}</TableHead>
                    <TableHead>{t('billing.amount')}</TableHead>
                    <TableHead>{t('billing.paymentMethod')}</TableHead>
                    <TableHead>{t('billing.paymentDate')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>{payment.patientName}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell className="capitalize">{payment.method}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.insuranceClaims')}</CardTitle>
              <CardDescription>{t('billing.insuranceManagement')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('billing.claimNumber')}</TableHead>
                    <TableHead>{t('billing.patientName')}</TableHead>
                    <TableHead>{t('billing.insuranceProvider')}</TableHead>
                    <TableHead>{t('billing.claimAmount')}</TableHead>
                    <TableHead>{t('billing.approvedAmount')}</TableHead>
                    <TableHead>{t('billing.claimStatus')}</TableHead>
                    <TableHead>{t('billing.submissionDate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                      <TableCell>{claim.patientName}</TableCell>
                      <TableCell>{claim.provider}</TableCell>
                      <TableCell>${claim.claimAmount}</TableCell>
                      <TableCell>${claim.approvedAmount}</TableCell>
                      <TableCell>{getStatusBadge(claim.status)}</TableCell>
                      <TableCell>{claim.submissionDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.reports')}</CardTitle>
              <CardDescription>{t('billing.financialAnalytics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button className="h-24 flex-col">
                  <Receipt className="w-8 h-8 mb-2" />
                  تقرير الإيرادات
                </Button>
                <Button className="h-24 flex-col" variant="outline">
                  <Calculator className="w-8 h-8 mb-2" />
                  تقرير المصروفات
                </Button>
                <Button className="h-24 flex-col" variant="outline">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  تحليل الربحية
                </Button>
                <Button className="h-24 flex-col" variant="outline">
                  <Building className="w-8 h-8 mb-2" />
                  تقرير التأمين
                </Button>
                <Button className="h-24 flex-col" variant="outline">
                  <Users className="w-8 h-8 mb-2" />
                  تقرير المرضى
                </Button>
                <Button className="h-24 flex-col" variant="outline">
                  <Calendar className="w-8 h-8 mb-2" />
                  التقرير الشهري
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Creation Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('billing.createInvoice')}</DialogTitle>
            <DialogDescription>{t('billing.createInvoiceDescription')}</DialogDescription>
          </DialogHeader>
          <InvoiceForm 
            onSubmit={handleCreateInvoice} 
            onCancel={() => setIsInvoiceDialogOpen(false)}
            language={language}
          />
        </DialogContent>
      </Dialog>

      {/* Payment Recording Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('billing.recordPayment')}</DialogTitle>
            <DialogDescription>{t('billing.recordPaymentDescription')}</DialogDescription>
          </DialogHeader>
          <PaymentForm 
            onSubmit={handleRecordPayment} 
            onCancel={() => setIsPaymentDialogOpen(false)}
            language={language}
            invoices={invoices.filter(inv => inv.status !== 'paid')}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Invoice Form Component
function InvoiceForm({ onSubmit, onCancel, language }: any) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  const t = translations[language];

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });

    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + formData.tax - formData.discount;

    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      total
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">{t('billing.patientName')}</Label>
          <Input
            id="patientName"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="patientId">{t('billing.patientId')}</Label>
          <Input
            id="patientId"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="invoiceDate">{t('billing.invoiceDate')}</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="dueDate">{t('billing.dueDate')}</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>{t('billing.invoiceItems')}</h3>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('billing.addItem')}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('billing.itemDescription')}</TableHead>
              <TableHead>{t('billing.quantity')}</TableHead>
              <TableHead>{t('billing.unitPrice')}</TableHead>
              <TableHead>{t('billing.totalPrice')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder={t('billing.serviceDescription')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>${item.total.toFixed(2)}</TableCell>
                <TableCell>
                  {formData.items.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const updatedItems = formData.items.filter((_, i) => i !== index);
                        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
                        const total = subtotal + formData.tax - formData.discount;
                        setFormData({ ...formData, items: updatedItems, subtotal, total });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>{t('billing.subtotal')}</Label>
          <p className="text-lg font-medium">${formData.subtotal.toFixed(2)}</p>
        </div>
        <div>
          <Label htmlFor="tax">{t('billing.tax')}</Label>
          <Input
            id="tax"
            type="number"
            value={formData.tax}
            onChange={(e) => {
              const tax = parseFloat(e.target.value) || 0;
              const total = formData.subtotal + tax - formData.discount;
              setFormData({ ...formData, tax, total });
            }}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="discount">{t('billing.discount')}</Label>
          <Input
            id="discount"
            type="number"
            value={formData.discount}
            onChange={(e) => {
              const discount = parseFloat(e.target.value) || 0;
              const total = formData.subtotal + formData.tax - discount;
              setFormData({ ...formData, discount, total });
            }}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="text-right">
        <h3 className="text-xl font-bold">{t('billing.grandTotal')}: ${formData.total.toFixed(2)}</h3>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}

// Payment Form Component
function PaymentForm({ onSubmit, onCancel, language, invoices }: any) {
  const [formData, setFormData] = useState({
    invoiceId: '',
    patientName: '',
    amount: 0,
    method: 'cash',
    notes: ''
  });

  const t = translations[language];

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find((inv: any) => inv.id === invoiceId);
    if (invoice) {
      setFormData({
        ...formData,
        invoiceId,
        patientName: invoice.patientName,
        amount: invoice.amount
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="invoiceId">رقم الفاتورة</Label>
        <Select value={formData.invoiceId} onValueChange={handleInvoiceSelect}>
          <SelectTrigger>
            <SelectValue placeholder="اختر فاتورة" />
          </SelectTrigger>
          <SelectContent>
            {invoices.map((invoice: any) => (
              <SelectItem key={invoice.id} value={invoice.id}>
                {invoice.id} - {invoice.patientName} - ${invoice.amount}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="patientName">{t.patientName}</Label>
        <Input
          id="patientName"
          value={formData.patientName}
          readOnly
          className="bg-muted"
        />
      </div>

      <div>
        <Label htmlFor="amount">{t.paymentAmount}</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <Label htmlFor="method">{t.paymentMethod}</Label>
        <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">{t.cash}</SelectItem>
            <SelectItem value="creditCard">{t.creditCard}</SelectItem>
            <SelectItem value="debitCard">{t.debitCard}</SelectItem>
            <SelectItem value="bankTransfer">{t.bankTransfer}</SelectItem>
            <SelectItem value="insurance">{t.insurance}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="ملاحظات إضافية..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button type="submit">
          {t.save}
        </Button>
      </div>
    </form>
  );
}