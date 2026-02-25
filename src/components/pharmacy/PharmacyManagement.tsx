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
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Pill, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
  Calendar,
  User,
  Printer,
  FileText,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import firebaseService from '../../services/FirebaseService';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  manufacturer: string;
  category: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops';
  strength: string;
  unit: string;
  barcode?: string;
  activeIngredient: string;
  description?: string;
  sideEffects?: string[];
  contraindications?: string[];
  interactions?: string[];
}

interface InventoryItem {
  id: string;
  medicationId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  dateReceived: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'near-expiry';
  medication?: Medication;
}

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  medications: PrescribedMedication[];
  status: 'pending' | 'partially-filled' | 'filled' | 'cancelled';
  notes?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: string;
  };
  doctor?: {
    id: string;
    name: string;
    specialization: string;
  };
}

interface PrescribedMedication {
  medicationId: string;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  filled: boolean;
  filledDate?: string;
  filledBy?: string;
  medication?: Medication;
}

interface PharmacyManagementProps {
  // No props needed - always uses Firebase
}

const PharmacyManagement: React.FC<PharmacyManagementProps> = () => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();

  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Demo data
  const demoMedications: Medication[] = useMemo(() => [
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      manufacturer: 'PharmaCorp',
      category: 'Pain Relief',
      form: 'tablet',
      strength: '500',
      unit: 'mg',
      barcode: '1234567890123',
      activeIngredient: 'Paracetamol',
      description: 'Pain and fever relief medication',
      sideEffects: ['Nausea', 'Dizziness'],
      contraindications: ['Liver disease'],
      interactions: ['Warfarin']
    },
    {
      id: '2',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      manufacturer: 'AntibioLab',
      category: 'Antibiotics',
      form: 'capsule',
      strength: '250',
      unit: 'mg',
      barcode: '2345678901234',
      activeIngredient: 'Amoxicillin trihydrate',
      description: 'Broad-spectrum antibiotic',
      sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
      contraindications: ['Penicillin allergy'],
      interactions: ['Methotrexate']
    },
    {
      id: '3',
      name: 'إيبوبروفين',
      genericName: 'Ibuprofen',
      manufacturer: 'مختبرات العربية',
      category: 'مسكنات',
      form: 'tablet',
      strength: '400',
      unit: 'mg',
      barcode: '3456789012345',
      activeIngredient: 'إيبوبروفين',
      description: 'مضاد للالتهابات ومسكن للألم',
      sideEffects: ['ألم المعدة', 'دوخة'],
      contraindications: ['قرحة المعدة'],
      interactions: ['الوارفارين']
    }
  ], []);

  const demoInventory: InventoryItem[] = useMemo(() => [
    {
      id: '1',
      medicationId: '1',
      batchNumber: 'BATCH001',
      expiryDate: '2025-12-31',
      quantity: 500,
      reorderLevel: 100,
      unitPrice: 0.50,
      sellingPrice: 1.00,
      supplier: 'MediSupply Co.',
      location: 'Shelf A1',
      dateReceived: '2024-01-15',
      status: 'in-stock',
      medication: demoMedications[0]
    },
    {
      id: '2',
      medicationId: '2',
      batchNumber: 'BATCH002',
      expiryDate: '2024-06-30',
      quantity: 50,
      reorderLevel: 100,
      unitPrice: 2.00,
      sellingPrice: 4.00,
      supplier: 'PharmaDist Ltd.',
      location: 'Shelf B2',
      dateReceived: '2024-01-10',
      status: 'low-stock',
      medication: demoMedications[1]
    },
    {
      id: '3',
      medicationId: '3',
      batchNumber: 'BATCH003',
      expiryDate: '2024-03-15',
      quantity: 200,
      reorderLevel: 50,
      unitPrice: 1.50,
      sellingPrice: 3.00,
      supplier: 'عربي فارم',
      location: 'رف ج3',
      dateReceived: '2024-01-05',
      status: 'near-expiry',
      medication: demoMedications[2]
    }
  ], [demoMedications]);

  const demoPrescriptions: Prescription[] = useMemo(() => [
    {
      id: '1',
      patientId: 'patient1',
      doctorId: 'doctor1',
      prescriptionDate: '2024-01-20',
      status: 'pending',
      medications: [
        {
          medicationId: '1',
          quantity: 30,
          dosage: '500mg',
          frequency: 'مرتين يومياً',
          duration: '7 أيام',
          instructions: 'تناول مع الطعام',
          filled: false,
          medication: demoMedications[0]
        },
        {
          medicationId: '2',
          quantity: 21,
          dosage: '250mg',
          frequency: 'ثلاث مرات يومياً',
          duration: '7 أيام',
          instructions: 'تناول على معدة فارغة',
          filled: false,
          medication: demoMedications[1]
        }
      ],
      patient: {
        id: 'patient1',
        firstName: 'أحمد',
        lastName: 'محمد',
        phone: '+966501234567'
      },
      doctor: {
        id: 'doctor1',
        name: 'د. سارة أحمد',
        specialization: 'طب عام'
      }
    },
    {
      id: '2',
      patientId: 'patient2',
      doctorId: 'doctor2',
      prescriptionDate: '2024-01-19',
      status: 'filled',
      medications: [
        {
          medicationId: '3',
          quantity: 20,
          dosage: '400mg',
          frequency: 'عند الحاجة',
          duration: 'حسب الحاجة',
          instructions: 'لا تتجاوز 3 أقراص يومياً',
          filled: true,
          filledDate: '2024-01-19',
          filledBy: 'الصيدلي أحمد',
          medication: demoMedications[2]
        }
      ],
      patient: {
        id: 'patient2',
        firstName: 'فاطمة',
        lastName: 'علي',
        phone: '+966501234568'
      },
      doctor: {
        id: 'doctor2',
        name: 'د. محمد حسن',
        specialization: 'طب الأطفال'
      }
    }
  ], [demoMedications]);

  useEffect(() => {
    // Always load from Firebase
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribeInventory = firebaseService.subscribeToCollection('inventory', (updatedInventory) => {
      setInventory(updatedInventory);
    });
    
    const unsubscribePrescriptions = firebaseService.subscribeToCollection('prescriptions', (updatedPrescriptions) => {
      setPrescriptions(updatedPrescriptions);
    });
    
    return () => {
      unsubscribeInventory();
      unsubscribePrescriptions();
    };
  }, [demoMedications, demoInventory, demoPrescriptions]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load inventory, prescriptions, and medications from Firebase
      const [inventoryData, prescriptionsData] = await Promise.all([
        firebaseService.getInventory(),
        firebaseService.getPrescriptions()
      ]);
      
      // Use demo medications for now (can be replaced with Firebase later)
      setMedications(demoMedications);
      
      // Enrich inventory with medication data
      const enrichedInventory = inventoryData.map((item: any) => ({
        ...item,
        medication: demoMedications.find((m: any) => m.id === item.medicationId)
      }));
      
      // Enrich prescriptions with medication data
      const enrichedPrescriptions = prescriptionsData.map((prescription: any) => ({
        ...prescription,
        medications: prescription.medications?.map((med: any) => ({
          ...med,
          medication: demoMedications.find((m: any) => m.id === med.medicationId)
        }))
      }));
      
      setInventory(enrichedInventory);
      setPrescriptions(enrichedPrescriptions);
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [demoMedications, language]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'low-stock': return 'text-yellow-600 bg-yellow-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'near-expiry': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <CheckCircle className="h-4 w-4" />;
      case 'low-stock': return <TrendingDown className="h-4 w-4" />;
      case 'out-of-stock': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      case 'near-expiry': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getPrescriptionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'partially-filled': return 'text-blue-600 bg-blue-50';
      case 'filled': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateStockPercentage = (current: number, reorder: number) => {
    const max = reorder * 3; // Assume max stock is 3x reorder level
    return Math.min((current / max) * 100, 100);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.medication?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medication?.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.medication?.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, selectedCategory, selectedStatus]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription => {
      const matchesSearch = searchTerm === '' ||
        prescription.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || prescription.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [prescriptions, searchTerm, selectedStatus]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(medications.map(med => med.category))];
    return uniqueCategories;
  }, [medications]);

  const inventoryStats = useMemo(() => {
    const total = inventory.length;
    const inStock = inventory.filter(item => item.status === 'in-stock').length;
    const lowStock = inventory.filter(item => item.status === 'low-stock').length;
    const outOfStock = inventory.filter(item => item.status === 'out-of-stock').length;
    const expired = inventory.filter(item => item.status === 'expired').length;
    const nearExpiry = inventory.filter(item => item.status === 'near-expiry').length;
    
    return { total, inStock, lowStock, outOfStock, expired, nearExpiry };
  }, [inventory]);

  const prescriptionStats = useMemo(() => {
    const total = prescriptions.length;
    const pending = prescriptions.filter(p => p.status === 'pending').length;
    const filled = prescriptions.filter(p => p.status === 'filled').length;
    const partiallyFilled = prescriptions.filter(p => p.status === 'partially-filled').length;
    
    return { total, pending, filled, partiallyFilled };
  }, [prescriptions]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('pharmacy.title')}</h1>
          <p className="text-muted-foreground">
            {t('pharmacy.overview')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('pharmacy.reports')}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('pharmacy.addMedication')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('pharmacy.addMedication')}</DialogTitle>
                <DialogDescription>
                  {t('pharmacy.addMedicationDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Add medication form would go here */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button>{t('common.save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('pharmacy.totalItems')}</p>
                <p className="text-2xl font-semibold">{inventoryStats.total}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('pharmacy.lowStock')}</p>
                <p className="text-2xl font-semibold text-yellow-600">{inventoryStats.lowStock}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('pharmacy.nearExpiry')}</p>
                <p className="text-2xl font-semibold text-orange-600">{inventoryStats.nearExpiry}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('pharmacy.pendingPrescriptions')}</p>
                <p className="text-2xl font-semibold text-blue-600">{prescriptionStats.pending}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">{t('pharmacy.inventory')}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t('pharmacy.prescriptions')}</TabsTrigger>
          <TabsTrigger value="reports">{t('pharmacy.reports')}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('pharmacy.searchMedications')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={t('pharmacy.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('common.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="in-stock">{t('pharmacy.inStock')}</SelectItem>
                    <SelectItem value="low-stock">{t('pharmacy.lowStock')}</SelectItem>
                    <SelectItem value="out-of-stock">{t('pharmacy.outOfStock')}</SelectItem>
                    <SelectItem value="near-expiry">{t('pharmacy.nearExpiry')}</SelectItem>
                    <SelectItem value="expired">{t('pharmacy.expired')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory List */}
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t('common.loading')}</p>
                </CardContent>
              </Card>
            ) : filteredInventory.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('pharmacy.noMedications')}</h3>
                  <p className="text-muted-foreground">{t('pharmacy.noMedicationsDescription')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredInventory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{item.medication?.name}</h3>
                            <Badge variant="outline">{item.medication?.form}</Badge>
                            <Badge 
                              className={`flex items-center gap-1 ${getStatusColor(item.status)}`}
                            >
                              {getStatusIcon(item.status)}
                              {t(`pharmacy.${item.status}`)}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>{t('pharmacy.genericName')}:</strong> {item.medication?.genericName || t('common.notSpecified')}</p>
                            <p><strong>{t('pharmacy.strength')}:</strong> {item.medication?.strength} {item.medication?.unit}</p>
                            <p><strong>{t('pharmacy.manufacturer')}:</strong> {item.medication?.manufacturer}</p>
                            <p><strong>{t('pharmacy.category')}:</strong> {item.medication?.category}</p>
                            <p><strong>{t('pharmacy.batchNumber')}:</strong> {item.batchNumber}</p>
                            <p><strong>{t('pharmacy.expiryDate')}:</strong> {formatDate(item.expiryDate)}</p>
                            <p><strong>{t('pharmacy.supplier')}:</strong> {item.supplier}</p>
                            <p><strong>{t('pharmacy.location')}:</strong> {item.location}</p>
                          </div>
                          
                          {/* Stock Level Progress */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>{t('pharmacy.stockLevel')}</span>
                              <span>{item.quantity} / {item.reorderLevel * 3}</span>
                            </div>
                            <Progress 
                              value={calculateStockPercentage(item.quantity, item.reorderLevel)} 
                              className="h-2"
                            />
                            {item.quantity <= item.reorderLevel && (
                              <p className="text-xs text-yellow-600 mt-1">
                                {t('pharmacy.belowReorderLevel')}
                              </p>
                            )}
                          </div>
                          
                          {/* Pricing */}
                          <div className="mt-3 flex items-center gap-4 text-sm">
                            <span><strong>{t('pharmacy.unitPrice')}:</strong> ${(item.unitPrice || 0).toFixed(2)}</span>
                            <span><strong>{t('pharmacy.sellingPrice')}:</strong> ${(item.sellingPrice || 0).toFixed(2)}</span>
                            <span><strong>{t('pharmacy.totalValue')}:</strong> ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                        >
                          {t('common.view')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('pharmacy.searchPrescriptions')}
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
                    <SelectItem value="pending">{t('pharmacy.pending')}</SelectItem>
                    <SelectItem value="partially-filled">{t('pharmacy.partiallyFilled')}</SelectItem>
                    <SelectItem value="filled">{t('pharmacy.filled')}</SelectItem>
                    <SelectItem value="cancelled">{t('pharmacy.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions List */}
          <div className="grid gap-4">
            {filteredPrescriptions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('pharmacy.noPrescriptions')}</h3>
                  <p className="text-muted-foreground">{t('pharmacy.noPrescriptionsDescription')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={prescription.patient?.avatar} />
                          <AvatarFallback>
                            {prescription.patient?.firstName.charAt(0)}
                            {prescription.patient?.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">
                              {prescription.patient?.firstName} {prescription.patient?.lastName}
                            </h3>
                            <Badge 
                              className={`flex items-center gap-1 ${getPrescriptionStatusColor(prescription.status)}`}
                            >
                              {t(`pharmacy.${prescription.status}`)}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>{t('appointments.doctor')}:</strong> {prescription.doctor?.name}</p>
                            <p><strong>{t('pharmacy.prescriptionDate')}:</strong> {formatDate(prescription.prescriptionDate)}</p>
                            <p><strong>{t('common.phone')}:</strong> {prescription.patient?.phone}</p>
                          </div>
                          
                          {/* Medications */}
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-2">{t('pharmacy.medications')}:</h4>
                            <div className="space-y-2">
                              {prescription.medications.map((med, index) => (
                                <div key={index} className="bg-muted p-3 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium">{med.medication?.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {med.dosage} - {med.frequency} - {med.duration}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {t('pharmacy.quantity')}: {med.quantity}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {med.instructions}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {med.filled ? (
                                        <Badge variant="outline" className="text-green-600">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          {t('pharmacy.filled')}
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-yellow-600">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {t('pharmacy.pending')}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          {t('common.view')}
                        </Button>
                        {prescription.status === 'pending' && (
                          <Button
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {t('pharmacy.dispense')}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pharmacy.reports')}</CardTitle>
              <CardDescription>{t('pharmacy.reportsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <BarChart3 className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">{t('pharmacy.inventoryReport')}</p>
                    <p className="text-sm text-muted-foreground">{t('pharmacy.inventoryReportDesc')}</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <TrendingUp className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">{t('pharmacy.salesReport')}</p>
                    <p className="text-sm text-muted-foreground">{t('pharmacy.salesReportDesc')}</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <AlertTriangle className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">{t('pharmacy.expiryReport')}</p>
                    <p className="text-sm text-muted-foreground">{t('pharmacy.expiryReportDesc')}</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Details Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem && !isEditDialogOpen} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Pill className="h-5 w-5" />
                {selectedItem.medication?.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Medication details would go here */}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Prescription Details Dialog */}
      {selectedPrescription && (
        <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                {t('pharmacy.prescriptionDetails')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Prescription details would go here */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PharmacyManagement;