import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Progress } from '../ui/progress';
import LabTestOrderModal from './LabTestOrderModal';
import SampleLabelPrinter from './SampleLabelPrinter';
import LabBillingIntegration from './LabBillingIntegration';
import LabNotificationSystem from './LabNotificationSystem';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Beaker, 
  Microscope, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Printer,
  Download,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  Target,
  Zap,
  RefreshCw,
  Eye,
  Upload,
  Receipt,
  Bell,
  QrCode
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import firebaseService from '../../services/FirebaseService';
import { getInitials } from '../../utils/stringHelpers';
import { toast } from 'sonner';

interface LabTest {
  id: string;
  code: string;
  name: string;
  category: string;
  specimen: 'blood' | 'urine' | 'stool' | 'sputum' | 'tissue' | 'other';
  processingTime: number; // in hours
  normalRange: {
    min?: number;
    max?: number;
    unit: string;
    text?: string;
  };
  price: number;
  preparation?: string;
  description?: string;
}

interface LabOrder {
  id: string;
  patientId: string;
  doctorId: string;
  orderDate: string;
  tests: OrderedTest[];
  priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  collectionDate?: string;
  collectedBy?: string;
  processingDate?: string;
  processedBy?: string;
  approvedDate?: string;
  approvedBy?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    phone: string;
    avatar?: string;
    medicalNumber: string;
    email?: string;
    insuranceId?: string;
    insuranceProvider?: string;
    dateOfBirth: string;
  };
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    email?: string;
    phone?: string;
  };
}

interface OrderedTest {
  testId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  collectedAt?: string;
  result?: {
    value: string | number;
    unit: string;
    isNormal: boolean;
    flag: 'normal' | 'low' | 'high' | 'critical';
    comments?: string;
  };
  test?: LabTest;
}

interface LaboratoryManagementProps {
  // No props needed - always uses Firebase
}

const LaboratoryManagement: React.FC<LaboratoryManagementProps> = () => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();
  
  // Always use Firebase mode (not demo mode)
  const isDemoMode = false;

  const [activeTab, setActiveTab] = useState('orders');
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{ order: LabOrder; test: OrderedTest } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // New feature modals
  const [isLabelPrinterOpen, setIsLabelPrinterOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<LabOrder | null>(null);

  // Demo data
  const demoLabTests: LabTest[] = useMemo(() => [
    {
      id: '1',
      code: 'CBC',
      name: 'Complete Blood Count',
      category: 'Hematology',
      specimen: 'blood',
      processingTime: 2,
      normalRange: {
        text: 'See individual components',
        unit: 'various'
      },
      price: 150,
      preparation: 'No special preparation required',
      description: 'Complete blood count with differential'
    },
    {
      id: '2',
      code: 'FBS',
      name: 'Fasting Blood Sugar',
      category: 'Biochemistry',
      specimen: 'blood',
      processingTime: 1,
      normalRange: {
        min: 70,
        max: 100,
        unit: 'mg/dL'
      },
      price: 50,
      preparation: 'Fasting for 8-12 hours required',
      description: 'Glucose level in fasting state'
    },
    {
      id: '3',
      code: 'UA',
      name: 'تحليل البول الكامل',
      category: 'Clinical Pathology',
      specimen: 'urine',
      processingTime: 1,
      normalRange: {
        text: 'See individual components',
        unit: 'various'
      },
      price: 75,
      preparation: 'Clean catch midstream urine',
      description: 'Complete urinalysis with microscopy'
    },
    {
      id: '4',
      code: 'TSH',
      name: 'Thyroid Stimulating Hormone',
      category: 'Endocrinology',
      specimen: 'blood',
      processingTime: 4,
      normalRange: {
        min: 0.4,
        max: 4.0,
        unit: 'mIU/L'
      },
      price: 200,
      preparation: 'No special preparation required',
      description: 'TSH level for thyroid function assessment'
    },
    {
      id: '5',
      code: 'LIPID',
      name: 'Lipid Profile',
      category: 'Biochemistry',
      specimen: 'blood',
      processingTime: 2,
      normalRange: {
        text: 'See individual components',
        unit: 'mg/dL'
      },
      price: 120,
      preparation: 'Fasting for 12 hours required',
      description: 'Complete lipid panel including cholesterol'
    },
    {
      id: '6',
      code: 'HBA1C',
      name: 'Hemoglobin A1C',
      category: 'Biochemistry',
      specimen: 'blood',
      processingTime: 2,
      normalRange: {
        min: 4.0,
        max: 5.6,
        unit: '%'
      },
      price: 80,
      preparation: 'No special preparation required',
      description: 'Average blood glucose over 2-3 months'
    }
  ], []);

  const demoLabOrders: LabOrder[] = useMemo(() => [
    {
      id: 'LAB-001',
      patientId: 'patient1',
      doctorId: 'doctor1',
      orderDate: '2024-01-20',
      priority: 'routine',
      status: 'pending',
      tests: [
        {
          testId: '1',
          status: 'pending',
          test: demoLabTests[0]
        },
        {
          testId: '2',
          status: 'pending',
          test: demoLabTests[1]
        }
      ],
      notes: 'Routine checkup tests',
      patient: {
        id: 'patient1',
        firstName: 'أحمد',
        lastName: 'محمد',
        age: 45,
        gender: 'male',
        phone: '+966501234567',
        medicalNumber: 'MED-001',
        email: 'ahmed@example.com',
        dateOfBirth: '1978-05-15'
      },
      doctor: {
        id: 'doctor1',
        name: 'د. سارة أحمد',
        specialization: 'طب عام',
        email: 'dr.sara@example.com',
        phone: '+966501234568'
      }
    },
    {
      id: 'LAB-002',
      patientId: 'patient2',
      doctorId: 'doctor2',
      orderDate: '2024-01-20',
      priority: 'urgent',
      status: 'in-progress',
      tests: [
        {
          testId: '3',
          status: 'completed',
          collectedAt: '2024-01-20T10:00:00Z',
          result: {
            value: 'Normal',
            unit: '',
            isNormal: true,
            flag: 'normal',
            comments: 'No abnormal findings'
          },
          test: demoLabTests[2]
        }
      ],
      collectionDate: '2024-01-20',
      collectedBy: 'فني المختبر أحمد',
      patient: {
        id: 'patient2',
        firstName: 'فاطمة',
        lastName: 'علي',
        age: 32,
        gender: 'female',
        phone: '+966501234568',
        medicalNumber: 'MED-002',
        email: 'fatima@example.com',
        insuranceId: 'INS-123456',
        insuranceProvider: 'تأمين الراجحي',
        dateOfBirth: '1991-08-22'
      },
      doctor: {
        id: 'doctor2',
        name: 'د. محمد حسن',
        specialization: 'النساء والولادة',
        email: 'dr.mohamed@example.com',
        phone: '+966501234570'
      }
    },
    {
      id: 'LAB-003',
      patientId: 'patient3',
      doctorId: 'doctor1',
      orderDate: '2024-01-19',
      priority: 'stat',
      status: 'completed',
      tests: [
        {
          testId: '4',
          status: 'completed',
          collectedAt: '2024-01-19T14:00:00Z',
          result: {
            value: 12.5,
            unit: 'mIU/L',
            isNormal: false,
            flag: 'high',
            comments: 'Elevated TSH suggests hypothyroidism'
          },
          test: demoLabTests[3]
        }
      ],
      collectionDate: '2024-01-19',
      collectedBy: 'فني المختبر سارة',
      processingDate: '2024-01-19',
      processedBy: 'أخصائي المختبر محمد',
      approvedDate: '2024-01-19',
      approvedBy: 'د. أحمد الطبيب',
      patient: {
        id: 'patient3',
        firstName: 'علي',
        lastName: 'أحمد',
        age: 38,
        gender: 'male',
        phone: '+966501234569',
        medicalNumber: 'MED-003',
        email: 'ali@example.com',
        dateOfBirth: '1985-12-03'
      },
      doctor: {
        id: 'doctor1',
        name: 'د. سارة أحمد',
        specialization: 'طب عام',
        email: 'dr.sara@example.com',
        phone: '+966501234568'
      }
    }
  ], [demoLabTests]);

  useEffect(() => {
    // Always load from Firebase
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribeOrders = firebaseService.subscribeToCollection('labOrders', (updatedOrders) => {
      setLabOrders(updatedOrders);
    });
    
    return () => {
      unsubscribeOrders();
    };
  }, [demoLabTests, demoLabOrders]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load lab orders from Firebase
      const ordersData = await firebaseService.getLabOrders();
      
      // Use demo lab tests for now (can be replaced with Firebase later)
      setLabTests(demoLabTests);
      
      // Enrich orders with test data
      const enrichedOrders = ordersData.map((order: any) => ({
        ...order,
        tests: order.tests?.map((test: any) => ({
          ...test,
          test: demoLabTests.find((t: any) => t.id === test.testId)
        }))
      }));
      
      setLabOrders(enrichedOrders);
    } catch (error) {
      console.error('Error loading laboratory data:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [demoLabTests, language]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'routine': return 'text-green-600 bg-green-50';
      case 'urgent': return 'text-orange-600 bg-orange-50';
      case 'stat': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getResultFlagColor = (flag: string) => {
    switch (flag) {
      case 'normal': return 'text-green-600';
      case 'low': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const filteredOrders = useMemo(() => {
    return labOrders.filter(order => {
      const matchesSearch = searchTerm === '' || 
        order.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || order.priority === selectedPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [labOrders, searchTerm, selectedStatus, selectedPriority]);

  const filteredTests = useMemo(() => {
    return labTests.filter(test => {
      const matchesSearch = searchTerm === '' ||
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [labTests, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(labTests.map(test => test.category))];
    return uniqueCategories;
  }, [labTests]);

  const labStats = useMemo(() => {
    const total = labOrders.length;
    const pending = labOrders.filter(order => order.status === 'pending').length;
    const inProgress = labOrders.filter(order => order.status === 'in-progress').length;
    const completed = labOrders.filter(order => order.status === 'completed').length;
    const stat = labOrders.filter(order => order.priority === 'stat').length;
    const urgent = labOrders.filter(order => order.priority === 'urgent').length;
    
    // Count critical results
    const critical = labOrders.filter(order => 
      order.tests.some(test => test.result?.flag === 'critical')
    ).length;
    
    return { total, pending, inProgress, completed, stat, urgent, critical };
  }, [labOrders]);

  // Handle new order submission
  const handleOrderSubmit = useCallback(async (orderData: any) => {
    try {
      // Create new order object
      const newOrderData = {
        patientId: orderData.patient.id,
        doctorId: orderData.doctor.id,
        orderDate: orderData.orderDate.split('T')[0],
        priority: orderData.priority,
        status: 'pending',
        tests: orderData.tests.map((test: any) => ({
          testId: test.testId,
          status: 'pending'
        })),
        notes: orderData.clinicalNotes,
        collectionDate: orderData.collectionDate,
        patient: orderData.patient,
        doctor: orderData.doctor
      };

      // Create in Firebase
      await firebaseService.createLabOrder(newOrderData);
      
      // Success toast is automatic from FirebaseService
    } catch (error) {
      console.error('Error creating lab order:', error);
      toast.error(language === 'ar' ? 'خطأ في إنشاء الطلب' : 'Error creating order');
    }
  }, [language]);

  // Handle label printing
  const handlePrintLabels = (order: LabOrder) => {
    setSelectedOrderForAction(order);
    setIsLabelPrinterOpen(true);
  };

  // Handle billing
  const handleBilling = (order: LabOrder) => {
    setSelectedOrderForAction(order);
    setIsBillingOpen(true);
  };

  // Handle notifications
  const handleNotificationSent = (notificationData: any) => {
    console.log('Notification sent:', notificationData);
  };

  // Handle billing completion
  const handleBillingComplete = (billingData: any) => {
    console.log('Billing completed:', billingData);
    setIsBillingOpen(false);
  };

  // Handle label printing completion
  const handleLabelPrintComplete = (printData: any) => {
    console.log('Labels printed:', printData);
    setIsLabelPrinterOpen(false);
  };

  // Generate sample results for notification system
  const labResults = labOrders
    .filter(order => order.status === 'completed')
    .flatMap(order => 
      order.tests.map(test => ({
        id: `result-${order.id}-${test.testId}`,
        orderId: order.id,
        testId: test.testId,
        testName: test.test?.name || '',
        testCode: test.test?.code || '',
        patient: order.patient!,
        doctor: order.doctor!,
        result: test.result!,
        status: 'completed' as const,
        completedAt: test.collectedAt || new Date().toISOString(),
        reportedBy: order.processedBy || 'Lab Tech',
        priority: order.priority
      }))
    );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('lab.title')}</h1>
          <p className="text-muted-foreground">
            {t('lab.overview')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('lab.reports')}
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsOrderModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t('lab.orderTest')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-blue-600">{labStats.total}</div>
            <div className="text-sm text-muted-foreground">{t('lab.totalOrders')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-yellow-600">{labStats.pending}</div>
            <div className="text-sm text-muted-foreground">{t('lab.pending')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-blue-600">{labStats.inProgress}</div>
            <div className="text-sm text-muted-foreground">{t('lab.inProgress')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-green-600">{labStats.completed}</div>
            <div className="text-sm text-muted-foreground">{t('lab.completed')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-red-600">{labStats.stat}</div>
            <div className="text-sm text-muted-foreground">{t('lab.stat')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-orange-600">{labStats.urgent}</div>
            <div className="text-sm text-muted-foreground">{t('lab.urgent')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-red-600">{labStats.critical}</div>
            <div className="text-sm text-muted-foreground">{t('lab.critical')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders">{t('lab.orders')}</TabsTrigger>
          <TabsTrigger value="tests">{t('lab.tests')}</TabsTrigger>
          <TabsTrigger value="results">{t('lab.results')}</TabsTrigger>
          <TabsTrigger value="billing">{t('lab.billing')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('lab.notifications')}</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('lab.searchOrders')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('common.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="pending">{t('lab.pending')}</SelectItem>
                    <SelectItem value="in-progress">{t('lab.inProgress')}</SelectItem>
                    <SelectItem value="completed">{t('lab.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('lab.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('lab.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allPriorities')}</SelectItem>
                    <SelectItem value="routine">{t('lab.routine')}</SelectItem>
                    <SelectItem value="urgent">{t('lab.urgent')}</SelectItem>
                    <SelectItem value="stat">{t('lab.stat')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t('common.loading')}</p>
                </CardContent>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('lab.noOrders')}</h3>
                  <p className="text-muted-foreground">{t('lab.noOrdersDescription')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={order.patient?.avatar} />
                          <AvatarFallback>
                            {getInitials(order.patient?.firstName, order.patient?.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">
                              {order.patient?.firstName} {order.patient?.lastName}
                            </h3>
                            <Badge 
                              className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              {t(`lab.${order.status}`)}
                            </Badge>
                            <Badge 
                              className={`${getPriorityColor(order.priority)}`}
                            >
                              {t(`lab.${order.priority}`)}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>{t('lab.orderId')}:</strong> {order.id}</p>
                            <p><strong>{t('appointments.doctor')}:</strong> {order.doctor?.name}</p>
                            <p><strong>{t('lab.orderDate')}:</strong> {formatDate(order.orderDate)}</p>
                            <p><strong>{t('patients.age')}:</strong> {order.patient?.age} {t('patients.years')} • {t(`patients.${order.patient?.gender}`)}</p>
                            {order.collectionDate && (
                              <p><strong>{t('lab.collectionDate')}:</strong> {formatDate(order.collectionDate)}</p>
                            )}
                          </div>
                          
                          {/* Tests */}
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-2">{t('lab.tests')} ({order.tests.length}):</h4>
                            <div className="space-y-2">
                              {order.tests.map((test, index) => (
                                <div key={index} className="bg-muted p-3 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium">{test.test?.name} ({test.test?.code})</p>
                                      <p className="text-sm text-muted-foreground">
                                        {test.test?.specimen} • {test.test?.processingTime}h
                                      </p>
                                      {test.result && (
                                        <div className="mt-2">
                                          <p className={`text-sm font-medium ${getResultFlagColor(test.result.flag)}`}>
                                            {t('lab.result')}: {test.result.value} {test.result.unit}
                                            {test.result.flag !== 'normal' && (
                                              <Badge variant="outline" className={`ml-2 ${getResultFlagColor(test.result.flag)}`}>
                                                {t(`lab.${test.result.flag}`)}
                                              </Badge>
                                            )}
                                          </p>
                                          {test.result.comments && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {test.result.comments}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant="outline"
                                        className={`${getStatusColor(test.status)}`}
                                      >
                                        {getStatusIcon(test.status)}
                                        {t(`lab.${test.status}`)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintLabels(order)}
                          className="flex items-center gap-2"
                        >
                          <QrCode className="h-4 w-4" />
                          {t('lab.printLabels')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBilling(order)}
                          className="flex items-center gap-2"
                        >
                          <Receipt className="h-4 w-4" />
                          {t('lab.billing')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {/* Test Management Content */}
          <Card>
            <CardHeader>
              <CardTitle>{t('lab.availableTests')}</CardTitle>
              <CardDescription>{t('lab.manageLabTests')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTests.map((test) => (
                  <Card key={test.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{test.name}</h3>
                          <p className="text-sm text-muted-foreground">{test.code}</p>
                        </div>
                        <Badge variant="outline">{test.category}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>{t('lab.specimen')}:</strong> {test.specimen}</p>
                        <p><strong>{t('lab.processingTime')}:</strong> {test.processingTime}h</p>
                        <p><strong>{t('lab.price')}:</strong> {test.price} {t('common.currency')}</p>
                        {test.preparation && (
                          <p><strong>{t('lab.preparation')}:</strong> {test.preparation}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {/* Results Management Content */}
          <Card>
            <CardHeader>
              <CardTitle>{t('lab.results')}</CardTitle>
              <CardDescription>{t('lab.viewAndManageResults')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labOrders
                  .filter(order => order.tests.some(test => test.result))
                  .map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">
                            {order.patient?.firstName} {order.patient?.lastName} - {order.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.doctor?.name} • {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(order.priority)}>
                          {t(`lab.${order.priority}`)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {order.tests
                          .filter(test => test.result)
                          .map((test, index) => (
                            <div key={index} className="bg-muted p-3 rounded">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">{test.test?.name}</p>
                                  <p className={`text-sm ${getResultFlagColor(test.result!.flag)}`}>
                                    {test.result!.value} {test.result!.unit}
                                  </p>
                                  {test.result!.comments && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {test.result!.comments}
                                    </p>
                                  )}
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={getResultFlagColor(test.result!.flag)}
                                >
                                  {t(`lab.${test.result!.flag}`)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          {/* Billing Management Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                {t('lab.billingManagement')}
              </CardTitle>
              <CardDescription>{t('lab.manageBillingAndPayments')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {labOrders
                  .filter(order => order.status !== 'cancelled')
                  .map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {order.patient?.firstName} {order.patient?.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('lab.orderId')}: {order.id} • {order.tests.length} {t('lab.tests')}
                          </p>
                          <p className="text-sm">
                            <strong>{t('lab.total')}:</strong> {order.tests.reduce((sum, test) => sum + (test.test?.price || 0), 0)} {t('common.currency')}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBilling(order)}
                          >
                            <Receipt className="h-4 w-4 mr-2" />
                            {t('lab.processPayment')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <LabNotificationSystem
            results={labResults}
            onSendNotification={handleNotificationSent}
            isDemoMode={isDemoMode}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LabTestOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
        availableTests={labTests}
      />

      <SampleLabelPrinter
        isOpen={isLabelPrinterOpen}
        onClose={() => setIsLabelPrinterOpen(false)}
        order={selectedOrderForAction}
        onPrint={handleLabelPrintComplete}
      />

      <LabBillingIntegration
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        order={selectedOrderForAction}
        onGenerateInvoice={handleBillingComplete}
        onProcessPayment={handleBillingComplete}
      />
    </div>
  );
};

export default LaboratoryManagement;