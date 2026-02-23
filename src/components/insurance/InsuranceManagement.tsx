import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, FileText, DollarSign, Clock, Search,
  CheckCircle, XCircle, AlertTriangle, Calculator, TrendingUp,
  Building, User, Calendar, Phone, Mail, Eye, Edit,
  Plus, Filter, Download, Upload, Send, ArrowRight,
  MapPin, CreditCard, Users, Activity, Printer,
  BarChart3, PieChart, FileCheck, ClipboardList,
  Settings, RefreshCw, History, CheckSquare,
  AlertCircle, Info, Star, ThumbsUp, ThumbsDown,
  FileUp, FileDown, FileX, FilePlus, Archive,
  Copy, ExternalLink, MessageSquare, Bell,
  Calendar as CalendarIcon, Zap, Target
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface InsuranceProvider {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  coveragePercentage: number;
  contractStartDate: string;
  contractEndDate: string;
  status: 'active' | 'inactive' | 'suspended';
  patientCount: number;
}

interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  insuranceProvider: string;
  policyNumber: string;
  serviceDate: string;
  services: Array<{
    code: string;
    description: string;
    amount: number;
    covered: boolean;
  }>;
  totalAmount: number;
  approvedAmount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submissionDate: string;
  responseDate?: string;
  rejectionReason?: string;
  notes?: string;
}

interface PatientInsurance {
  id: string;
  patientId: string;
  patientName: string;
  policyNumber: string;
  provider: string;
  coverageType: 'full' | 'partial' | 'emergency_only';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  deductible: number;
  maxCoverage: number;
  usedCoverage: number;
}

interface Preauthorization {
  id: string;
  patientId: string;
  patientName: string;
  provider: string;
  requestedService: string;
  estimatedCost: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalNumber?: string;
  validUntil?: string;
  notes?: string;
}

export default function InsuranceManagement() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main'); // main, provider-details, claim-details, add-provider, add-claim
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [patientInsurance, setPatientInsurance] = useState<PatientInsurance[]>([]);
  const [preauthorizations, setPreauthorizations] = useState<Preauthorization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: '',
    nameEn: '',
    code: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    coveragePercentage: 80,
    contractStartDate: '',
    contractEndDate: '',
    status: 'active'
  });
  const [newClaim, setNewClaim] = useState({
    patientName: '',
    insuranceProvider: '',
    policyNumber: '',
    serviceDate: '',
    totalAmount: 0,
    services: []
  });

  useEffect(() => {
    loadInsuranceData();
  }, []);

  const loadInsuranceData = async () => {
    setIsLoading(true);
    // Enhanced sample data
    setProviders([
      {
        id: '1',
        name: 'شركة التأمين الوطنية',
        nameEn: 'National Insurance Company',
        code: 'NIC',
        contactPerson: 'محمد أحمد',
        phone: '+966501234567',
        email: 'contact@nic.com.sa',
        address: 'الرياض، المملكة العربية السعودية',
        coveragePercentage: 80,
        contractStartDate: '2024-01-01',
        contractEndDate: '2024-12-31',
        status: 'active',
        patientCount: 150
      },
      {
        id: '2',
        name: 'شركة بوبا العربية',
        nameEn: 'Bupa Arabia',
        code: 'BUPA',
        contactPerson: 'سارة محمد',
        phone: '+966502345678',
        email: 'contact@bupa.com.sa',
        address: 'جدة، المملكة العربية السعودية',
        coveragePercentage: 90,
        contractStartDate: '2024-01-01',
        contractEndDate: '2025-12-31',
        status: 'active',
        patientCount: 200
      },
      {
        id: '3',
        name: 'شركة التعاونية للتأمين',
        nameEn: 'Tawuniya Insurance',
        code: 'TAWU',
        contactPerson: 'أحمد سالم',
        phone: '+966503456789',
        email: 'info@tawuniya.com.sa',
        address: 'الدمام، المملكة العربية السعودية',
        coveragePercentage: 85,
        contractStartDate: '2024-01-01',
        contractEndDate: '2024-12-31',
        status: 'active',
        patientCount: 125
      },
      {
        id: '4',
        name: 'شركة الأهلي للتأمين',
        nameEn: 'AlAhli Insurance',
        code: 'ALAH',
        contactPerson: 'فاطمة علي',
        phone: '+966504567890',
        email: 'contact@alahli-ins.com.sa',
        address: 'مكة المكرمة، المملكة العربية السعودية',
        coveragePercentage: 75,
        contractStartDate: '2024-01-01',
        contractEndDate: '2024-06-30',
        status: 'suspended',
        patientCount: 80
      }
    ]);

    setClaims([
      {
        id: '1',
        claimNumber: 'CLM-2024-001',
        patientId: 'P001',
        patientName: 'أحمد محمد',
        insuranceProvider: 'شركة التأمين الوطنية',
        policyNumber: 'NIC-123456',
        serviceDate: '2024-01-18',
        services: [
          { code: 'CON001', description: 'استشارة طبية', amount: 200, covered: true },
          { code: 'LAB001', description: 'تحليل دم شامل', amount: 150, covered: true }
        ],
        totalAmount: 350,
        approvedAmount: 280,
        status: 'approved',
        submissionDate: '2024-01-19',
        responseDate: '2024-01-20'
      },
      {
        id: '2',
        claimNumber: 'CLM-2024-002',
        patientId: 'P002',
        patientName: 'فاطمة أحمد',
        insuranceProvider: 'شركة بوبا العربية',
        policyNumber: 'BUPA-789012',
        serviceDate: '2024-01-19',
        services: [
          { code: 'RAD001', description: 'أشعة سينية', amount: 300, covered: true }
        ],
        totalAmount: 300,
        approvedAmount: 0,
        status: 'under_review',
        submissionDate: '2024-01-20'
      },
      {
        id: '3',
        claimNumber: 'CLM-2024-003',
        patientId: 'P003',
        patientName: 'محمد سالم',
        insuranceProvider: 'شركة التعاونية للتأمين',
        policyNumber: 'TAWU-345678',
        serviceDate: '2024-01-20',
        services: [
          { code: 'SUR001', description: 'عملية جراحية بسيطة', amount: 5000, covered: true },
          { code: 'MED001', description: 'أدوية', amount: 500, covered: true }
        ],
        totalAmount: 5500,
        approvedAmount: 4675,
        status: 'paid',
        submissionDate: '2024-01-21',
        responseDate: '2024-01-22'
      },
      {
        id: '4',
        claimNumber: 'CLM-2024-004',
        patientId: 'P004',
        patientName: 'عائشة خالد',
        insuranceProvider: 'شركة بوبا العربية',
        policyNumber: 'BUPA-901234',
        serviceDate: '2024-01-21',
        services: [
          { code: 'EMG001', description: 'خدمة طوارئ', amount: 800, covered: false }
        ],
        totalAmount: 800,
        approvedAmount: 0,
        status: 'rejected',
        submissionDate: '2024-01-22',
        responseDate: '2024-01-23',
        rejectionReason: 'خدمة غير مغطاة بالبوليصة'
      },
      {
        id: '5',
        claimNumber: 'CLM-2024-005',
        patientId: 'P005',
        patientName: 'سعد العتيبي',
        insuranceProvider: 'شركة التأمين الوطنية',
        policyNumber: 'NIC-567890',
        serviceDate: '2024-01-22',
        services: [
          { code: 'DEN001', description: 'علاج أسنان', amount: 1200, covered: true }
        ],
        totalAmount: 1200,
        approvedAmount: 0,
        status: 'submitted',
        submissionDate: '2024-01-23'
      }
    ]);

    setPatientInsurance([
      {
        id: '1',
        patientId: 'P001',
        patientName: 'أحمد محمد',
        policyNumber: 'NIC-123456',
        provider: 'شركة التأمين الوطنية',
        coverageType: 'full',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        deductible: 100,
        maxCoverage: 50000,
        usedCoverage: 2500
      },
      {
        id: '2',
        patientId: 'P002',
        patientName: 'فاطمة أحمد',
        policyNumber: 'BUPA-789012',
        provider: 'شركة بوبا العربية',
        coverageType: 'full',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        deductible: 200,
        maxCoverage: 100000,
        usedCoverage: 15000
      },
      {
        id: '3',
        patientId: 'P003',
        patientName: 'محمد سالم',
        policyNumber: 'TAWU-345678',
        provider: 'شركة التعاونية للتأمين',
        coverageType: 'partial',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        deductible: 150,
        maxCoverage: 75000,
        usedCoverage: 22000
      },
      {
        id: '4',
        patientId: 'P006',
        patientName: 'نورا الحارثي',
        policyNumber: 'NIC-678901',
        provider: 'شركة التأمين الوطنية',
        coverageType: 'emergency_only',
        startDate: '2023-12-01',
        endDate: '2023-11-30',
        status: 'expired',
        deductible: 300,
        maxCoverage: 25000,
        usedCoverage: 5000
      }
    ]);

    setPreauthorizations([
      {
        id: '1',
        patientId: 'P001',
        patientName: 'أحمد محمد',
        provider: 'شركة التأمين الوطنية',
        requestedService: 'عملية جراحية - استئصال الزائدة',
        estimatedCost: 15000,
        requestDate: '2024-01-20',
        status: 'pending'
      },
      {
        id: '2',
        patientId: 'P002',
        patientName: 'فاطمة أحمد',
        provider: 'شركة بوبا العربية',
        requestedService: 'أشعة مقطعية مع الصبغة',
        estimatedCost: 2500,
        requestDate: '2024-01-21',
        status: 'approved',
        approvalNumber: 'APP-2024-001',
        validUntil: '2024-02-21'
      },
      {
        id: '3',
        patientId: 'P005',
        patientName: 'سعد العتيبي',
        provider: 'شركة التأمين الوطنية',
        requestedService: 'علاج طبيعي - 20 جلسة',
        estimatedCost: 4000,
        requestDate: '2024-01-22',
        status: 'rejected',
        notes: 'يحتاج إلى تقرير طبي مفصل'
      }
    ]);
    
    setIsLoading(false);
  };

  // Navigation functions
  const handleViewProviderDetails = (provider: InsuranceProvider) => {
    setSelectedItem(provider);
    setCurrentView('provider-details');
  };

  const handleViewClaimDetails = (claim: InsuranceClaim) => {
    setSelectedItem(claim);
    setCurrentView('claim-details');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedItem(null);
  };

  const handleAddProvider = () => {
    setShowAddDialog(true);
    setCurrentView('add-provider');
  };

  const handleAddClaim = () => {
    setShowAddDialog(true);
    setCurrentView('add-claim');
  };

  const handleSaveProvider = () => {
    const provider = {
      ...newProvider,
      id: Date.now().toString(),
      patientCount: 0
    };
    setProviders(prev => [...prev, provider]);
    setShowAddDialog(false);
    setCurrentView('main');
    setNewProvider({
      name: '',
      nameEn: '',
      code: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      coveragePercentage: 80,
      contractStartDate: '',
      contractEndDate: '',
      status: 'active'
    });
  };

  const filterData = (data: any[], type: string) => {
    let filtered = data;
    
    if (searchTerm) {
      filtered = filtered.filter(item => {
        if (type === 'providers') {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.code.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (type === 'claims') {
          return item.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (type === 'patients') {
          return item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    return filtered;
  };

  const getStatusColor = (status: string, type: string = 'general') => {
    if (type === 'claim') {
      switch (status) {
        case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'approved': return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
        case 'paid': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-200';
        case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
        case 'expired': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'approved': return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getStatusText = (status: string, type: string = 'general') => {
    if (type === 'claim') {
      switch (status) {
        case 'submitted': return 'مقدمة';
        case 'under_review': return 'قيد المراجعة';
        case 'approved': return 'موافق عليها';
        case 'rejected': return 'مرفوضة';
        case 'paid': return 'مدفوعة';
        default: return status;
      }
    } else {
      switch (status) {
        case 'active': return 'نشط';
        case 'inactive': return 'غير نشط';
        case 'suspended': return 'معلق';
        case 'expired': return 'منتهية الصلاحية';
        case 'cancelled': return 'ملغية';
        case 'pending': return 'معلقة';
        case 'approved': return 'موافق عليها';
        case 'rejected': return 'مرفوضة';
        default: return status;
      }
    }
  };

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">شركات التأمين</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{providers.length}</p>
                  <p className="text-xs text-blue-500 dark:text-blue-400">
                    {providers.filter(p => p.status === 'active').length} نشطة
                  </p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">المطالبات المعلقة</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">
                    {claims.filter(c => c.status === 'under_review' || c.status === 'submitted').length}
                  </p>
                  <p className="text-xs text-yellow-500 dark:text-yellow-400">تحتاج مراجعة</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-300">المطالبات المدفوعة</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-200">
                    {claims.filter(c => c.status === 'paid').length}
                  </p>
                  <p className="text-xs text-green-500 dark:text-green-400">مكتملة</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300">إجمالي المبلغ المعلق</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                    {claims
                      .filter(c => c.status === 'under_review' || c.status === 'submitted')
                      .reduce((sum, claim) => sum + claim.totalAmount, 0)
                      .toLocaleString()} ريال
                  </p>
                  <p className="text-xs text-purple-500 dark:text-purple-400">في الانتظار</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              الإجراءات السريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex-col gap-2 hover:shadow-lg transition-all duration-200"
                onClick={() => handleAddProvider()}
              >
                <Building className="h-6 w-6" />
                <span>إضافة شركة تأمين</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:shadow-lg transition-all duration-200"
                onClick={() => handleAddClaim()}
              >
                <FileText className="h-6 w-6" />
                <span>مطالبة جديدة</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:shadow-lg transition-all duration-200"
              >
                <Upload className="h-6 w-6" />
                <span>رفع المستندات</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:shadow-lg transition-all duration-200"
              >
                <Download className="h-6 w-6" />
                <span>تصدير التقارير</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  المطالبات الحديثة
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('claims')}
                  className="text-primary hover:bg-primary/10"
                >
                  عرض الكل <ArrowRight className="h-4 w-4 mr-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {claims.slice(0, 5).map((claim, index) => (
                  <motion.div 
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => handleViewClaimDetails(claim)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{claim.claimNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {claim.patientName} - {claim.totalAmount.toLocaleString()} ريال
                      </p>
                      <p className="text-xs text-muted-foreground">{claim.serviceDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(claim.status, 'claim')}>
                        {getStatusText(claim.status, 'claim')}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  طلبات الموافقة المسبقة
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary hover:bg-primary/10"
                >
                  عرض الكل <ArrowRight className="h-4 w-4 mr-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {preauthorizations.slice(0, 5).map((preauth, index) => (
                  <motion.div 
                    key={preauth.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: -4 }}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{preauth.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {preauth.requestedService}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {preauth.estimatedCost.toLocaleString()} ريال - {preauth.requestDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(preauth.status)}>
                        {getStatusText(preauth.status)}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderProviders = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              شركات التأمين
            </CardTitle>
            <Button onClick={handleAddProvider}>
              <Building className="h-4 w-4 mr-2" />
              إضافة شركة تأمين
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filterData(providers, 'providers').map((provider, index) => (
              <motion.div 
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-blue-50 dark:from-card dark:to-blue-950"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-medium">{provider.name}</h4>
                      <Badge className={getStatusColor(provider.status)}>
                        {getStatusText(provider.status)}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {provider.code}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{provider.nameEn}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="hover:bg-blue-50">
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleViewProviderDetails(provider)}
                      className="hover:shadow-md transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                    <p className="text-muted-foreground mb-1 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      جهة الاتصال
                    </p>
                    <p className="font-medium">{provider.contactPerson}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{provider.phone}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                    <p className="text-muted-foreground mb-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      نسبة التغطية
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={provider.coveragePercentage} className="flex-1" />
                      <span className="font-bold text-green-600">{provider.coveragePercentage}%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                    <p className="text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      عدد المرضى
                    </p>
                    <p className="font-bold text-blue-600">{provider.patientCount} مريض</p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                    <p className="text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      انتهاء العقد
                    </p>
                    <p className="font-medium">{provider.contractEndDate}</p>
                    {new Date(provider.contractEndDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                      <p className="text-xs text-warning flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        ينتهي قريباً
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderProviderDetails = () => {
    if (!selectedItem) return null;
    
    const provider = selectedItem as InsuranceProvider;
    const providerClaims = claims.filter(c => c.insuranceProvider === provider.name);
    const providerPatients = patientInsurance.filter(p => p.provider === provider.name);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToMain}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى القائمة
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              تعديل الشركة
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              طباعة التقرير
            </Button>
          </div>
        </div>

        {/* Provider Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{provider.name}</h2>
                <p className="text-lg text-muted-foreground">{provider.nameEn}</p>
              </div>
              <Badge className={getStatusColor(provider.status)} size="lg">
                {getStatusText(provider.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  معلومات الاتصال
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">جهة الاتصال:</span>
                    <span>{provider.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">الهاتف:</span>
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">البريد الإلكتروني:</span>
                    <span>{provider.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="font-medium">العنوان:</span>
                    <span>{provider.address}</span>
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  تفاصيل العقد
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">كود الشركة:</span>
                    <Badge variant="outline">{provider.code}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">تاريخ البداية:</span>
                    <span>{provider.contractStartDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">تاريخ الانتهاء:</span>
                    <span>{provider.contractEndDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">نسبة التغطية:</span>
                    <span className="font-bold text-green-600">{provider.coveragePercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  الإحصائيات
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 dark:text-blue-300">عدد المرضى</span>
                      <span className="font-bold text-blue-700 dark:text-blue-200">{provider.patientCount}</span>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 dark:text-green-300">المطالبات المدفوعة</span>
                      <span className="font-bold text-green-700 dark:text-green-200">
                        {providerClaims.filter(c => c.status === 'paid').length}
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-600 dark:text-yellow-300">المطالبات المعلقة</span>
                      <span className="font-bold text-yellow-700 dark:text-yellow-200">
                        {providerClaims.filter(c => c.status === 'under_review' || c.status === 'submitted').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims and Patients Tabs */}
        <Tabs defaultValue="claims">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claims">
              المطالبات ({providerClaims.length})
            </TabsTrigger>
            <TabsTrigger value="patients">
              المرضى المؤمنين ({providerPatients.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="claims" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {providerClaims.map((claim, index) => (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => handleViewClaimDetails(claim)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{claim.claimNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {claim.patientName} - {claim.totalAmount.toLocaleString()} ريال
                          </p>
                        </div>
                        <Badge className={getStatusColor(claim.status, 'claim')}>
                          {getStatusText(claim.status, 'claim')}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {providerPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border rounded-lg p-3 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{patient.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.policyNumber} - {patient.coverageType === 'full' ? 'تغطية شاملة' : 
                             patient.coverageType === 'partial' ? 'تغطية جزئية' : 'طوارئ فقط'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(patient.status)}>
                          {getStatusText(patient.status)}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  };

  const renderClaimDetails = () => {
    if (!selectedItem) return null;
    
    const claim = selectedItem as InsuranceClaim;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToMain}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى المطالبات
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              تعديل المطالبة
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              طباعة المطالبة
            </Button>
          </div>
        </div>

        {/* Claim Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{claim.claimNumber}</h2>
                <p className="text-lg text-muted-foreground">{claim.patientName}</p>
              </div>
              <Badge className={getStatusColor(claim.status, 'claim')} size="lg">
                {getStatusText(claim.status, 'claim')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Patient & Insurance Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  معلومات المريض والتأمين
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">المريض:</span>
                    <span>{claim.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">شركة التأمين:</span>
                    <span>{claim.insuranceProvider}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">رقم البوليصة:</span>
                    <span>{claim.policyNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">تاريخ الخدمة:</span>
                    <span>{claim.serviceDate}</span>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  المعلومات المالية
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 dark:text-blue-300">المبلغ الإجمالي</span>
                      <span className="font-bold text-blue-700 dark:text-blue-200">
                        {claim.totalAmount.toLocaleString()} ريال
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 dark:text-green-300">الموافق عليه</span>
                      <span className="font-bold text-green-700 dark:text-green-200">
                        {claim.approvedAmount.toLocaleString()} ريال
                      </span>
                    </div>
                  </div>
                  {claim.totalAmount > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">نسبة الموافقة</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          {((claim.approvedAmount / claim.totalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  التوقيت
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">تاريخ التقديم</p>
                      <p className="text-xs text-muted-foreground">{claim.submissionDate}</p>
                    </div>
                  </div>
                  {claim.responseDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">ت��ريخ الرد</p>
                        <p className="text-xs text-muted-foreground">{claim.responseDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              تفاصيل الخدمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claim.services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className={`flex justify-between items-center p-4 rounded-lg border ${
                    service.covered 
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {service.covered ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">{service.description}</p>
                      <p className="text-sm text-muted-foreground">كود الخدمة: {service.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{service.amount.toLocaleString()} ريال</p>
                    <p className={`text-sm ${service.covered ? 'text-success' : 'text-destructive'}`}>
                      {service.covered ? 'مغطاة' : 'غير مغطاة'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes and Rejection Reason */}
        {(claim.notes || claim.rejectionReason) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                الملاحظات والتفاصيل
              </CardTitle>
            </CardHeader>
            <CardContent>
              {claim.rejectionReason && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>سبب الرفض:</strong> {claim.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}
              {claim.notes && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm"><strong>ملاحظات:</strong> {claim.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    );
  };

  const renderClaims = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              المطالبات التأمينية
            </CardTitle>
            <Button onClick={handleAddClaim}>
              <FileText className="h-4 w-4 mr-2" />
              مطالبة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filterData(claims, 'claims').map((claim, index) => (
              <motion.div 
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-green-50 dark:from-card dark:to-green-950"
                onClick={() => handleViewClaimDetails(claim)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{claim.claimNumber}</h4>
                      <Badge className={getStatusColor(claim.status, 'claim')}>
                        {getStatusText(claim.status, 'claim')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white/60 dark:bg-card/60 p-2 rounded">
                        <p className="text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          المريض
                        </p>
                        <p className="font-medium">{claim.patientName}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-card/60 p-2 rounded">
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          شركة التأمين
                        </p>
                        <p className="font-medium">{claim.insuranceProvider}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-card/60 p-2 rounded">
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          تاريخ الخدمة
                        </p>
                        <p className="font-medium">{claim.serviceDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">المبلغ الإجمالي</p>
                    <p className="text-lg font-bold text-blue-600">{claim.totalAmount.toLocaleString()} ريال</p>
                    <p className="text-sm text-success">الموافق عليه: {claim.approvedAmount.toLocaleString()} ريال</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <ClipboardList className="h-4 w-4" />
                    الخدمات ({claim.services.length}):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {claim.services.slice(0, 2).map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                        <span>{service.description} ({service.code})</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.amount.toLocaleString()} ريال</span>
                          {service.covered ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    ))}
                    {claim.services.length > 2 && (
                      <div className="text-sm text-muted-foreground text-center md:col-span-2">
                        +{claim.services.length - 2} خدمة أخرى...
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPatientInsurance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              تأمين المرضى
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              ربط تأمين جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filterData(patientInsurance, 'patients').map((insurance, index) => (
              <motion.div 
                key={insurance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="border rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-purple-50 dark:from-card dark:to-purple-950"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium text-lg">{insurance.patientName}</h4>
                      <Badge className={getStatusColor(insurance.status)} size="lg">
                        {getStatusText(insurance.status)}
                      </Badge>
                      {insurance.status === 'expired' && (
                        <Badge variant="destructive" className="animate-pulse">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          منتهية الصلاحية
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                        <p className="text-muted-foreground mb-1 flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          رقم البوليصة
                        </p>
                        <p className="font-bold text-blue-600">{insurance.policyNumber}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                        <p className="text-muted-foreground mb-1 flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          شركة التأمين
                        </p>
                        <p className="font-medium">{insurance.provider}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-card/60 p-3 rounded-lg">
                        <p className="text-muted-foreground mb-1 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          نوع التغطية
                        </p>
                        <p className="font-medium">
                          {insurance.coverageType === 'full' ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              تغطية شاملة
                            </span>
                          ) : insurance.coverageType === 'partial' ? (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              تغطية جزئية
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              طوارئ فقط
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      تفاصيل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Coverage Usage */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        التغطية المستخدمة
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {((insurance.usedCoverage / insurance.maxCoverage) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(insurance.usedCoverage / insurance.maxCoverage) * 100} 
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>مستخدم: {insurance.usedCoverage.toLocaleString()} ريال</span>
                      <span>المتبقي: {(insurance.maxCoverage - insurance.usedCoverage).toLocaleString()} ريال</span>
                    </div>
                  </div>
                  
                  {/* Deductible */}
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-1 flex items-center gap-1">
                      <Calculator className="h-3 w-3" />
                      الخصم الذاتي
                    </p>
                    <p className="font-bold text-yellow-700 dark:text-yellow-200">{insurance.deductible.toLocaleString()} ريال</p>
                  </div>
                  
                  {/* Expiry Date */}
                  <div className={`p-3 rounded-lg ${
                    new Date(insurance.endDate) < new Date() 
                      ? 'bg-red-50 dark:bg-red-950' 
                      : new Date(insurance.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? 'bg-orange-50 dark:bg-orange-950'
                      : 'bg-green-50 dark:bg-green-950'
                  }`}>
                    <p className={`text-sm mb-1 flex items-center gap-1 ${
                      new Date(insurance.endDate) < new Date()
                        ? 'text-red-600 dark:text-red-300'
                        : new Date(insurance.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? 'text-orange-600 dark:text-orange-300'
                        : 'text-green-600 dark:text-green-300'
                    }`}>
                      <Calendar className="h-3 w-3" />
                      تاريخ الانتهاء
                    </p>
                    <p className={`font-bold ${
                      new Date(insurance.endDate) < new Date()
                        ? 'text-red-700 dark:text-red-200'
                        : new Date(insurance.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? 'text-orange-700 dark:text-orange-200'
                        : 'text-green-700 dark:text-green-200'
                    }`}>
                      {insurance.endDate}
                    </p>
                    {new Date(insurance.endDate) < new Date() ? (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        منتهية الصلاحية
                      </p>
                    ) : new Date(insurance.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                      <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        تنتهي قريباً
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                    <FileText className="h-4 w-4 mr-1" />
                    عرض المطالبات
                  </Button>
                  <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50">
                    <Plus className="h-4 w-4 mr-1" />
                    مطالبة جديدة
                  </Button>
                  <Button size="sm" variant="ghost" className="text-purple-600 hover:bg-purple-50">
                    <History className="h-4 w-4 mr-1" />
                    السجل الطبي
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAddProviderDialog = () => (
    <Dialog open={showAddDialog && currentView === 'add-provider'} onOpenChange={setShowAddDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            إضافة شركة تأمين جديدة
          </DialogTitle>
          <DialogDescription>
            املأ المعلومات التالية لإضافة شركة تأمين جديدة إلى النظام
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">اسم الشركة (عربي) *</Label>
              <Input
                id="name"
                value={newProvider.name}
                onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                placeholder="مثال: شركة التأمين الوطنية"
              />
            </div>
            <div>
              <Label htmlFor="nameEn">اسم الشركة (إنجليزي) *</Label>
              <Input
                id="nameEn"
                value={newProvider.nameEn}
                onChange={(e) => setNewProvider({...newProvider, nameEn: e.target.value})}
                placeholder="Example: National Insurance Company"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">كود الشركة *</Label>
              <Input
                id="code"
                value={newProvider.code}
                onChange={(e) => setNewProvider({...newProvider, code: e.target.value.toUpperCase()})}
                placeholder="مثال: NIC"
              />
            </div>
            <div>
              <Label htmlFor="coveragePercentage">نسبة التغطية (%)</Label>
              <Input
                id="coveragePercentage"
                type="number"
                min="0"
                max="100"
                value={newProvider.coveragePercentage}
                onChange={(e) => setNewProvider({...newProvider, coveragePercentage: Number(e.target.value)})}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              معلومات جهة الاتصال
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">اسم جهة الاتصال *</Label>
                <Input
                  id="contactPerson"
                  value={newProvider.contactPerson}
                  onChange={(e) => setNewProvider({...newProvider, contactPerson: e.target.value})}
                  placeholder="مثال: محمد أحمد"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                  placeholder="مثال: +966501234567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newProvider.email}
                onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                placeholder="مثال: contact@company.com.sa"
              />
            </div>
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Textarea
                id="address"
                value={newProvider.address}
                onChange={(e) => setNewProvider({...newProvider, address: e.target.value})}
                placeholder="العنوان الكامل للشركة"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              تفاصيل العقد
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractStartDate">تاريخ بداية العقد</Label>
                <Input
                  id="contractStartDate"
                  type="date"
                  value={newProvider.contractStartDate}
                  onChange={(e) => setNewProvider({...newProvider, contractStartDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contractEndDate">تاريخ انتهاء العقد</Label>
                <Input
                  id="contractEndDate"
                  type="date"
                  value={newProvider.contractEndDate}
                  onChange={(e) => setNewProvider({...newProvider, contractEndDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">حالة الشركة</Label>
              <Select value={newProvider.status} onValueChange={(value) => setNewProvider({...newProvider, status: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="inactive">غير نشطة</SelectItem>
                  <SelectItem value="suspended">معلقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setShowAddDialog(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSaveProvider} disabled={!newProvider.name || !newProvider.code}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة الشركة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {currentView === 'main' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="bg-primary/10 p-2 rounded-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Shield className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">إدارة التأمين</h1>
                <p className="text-muted-foreground">نظام متكامل لإدارة شركات التأمين والمطالبات</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في السجلات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
              <TabsTrigger value="providers">شركات التأمين</TabsTrigger>
              <TabsTrigger value="claims">المطالبات</TabsTrigger>
              <TabsTrigger value="patients">تأمين المرضى</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {renderDashboard()}
            </TabsContent>

            <TabsContent value="providers" className="space-y-6">
              {renderProviders()}
            </TabsContent>

            <TabsContent value="claims" className="space-y-6">
              {renderClaims()}
            </TabsContent>

            <TabsContent value="patients" className="space-y-6">
              {renderPatientInsurance()}
            </TabsContent>
          </Tabs>
        </>
      )}

      {currentView === 'provider-details' && renderProviderDetails()}
      {currentView === 'claim-details' && renderClaimDetails()}

      {renderAddProviderDialog()}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-card p-6 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>جارٍ التحديث...</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}