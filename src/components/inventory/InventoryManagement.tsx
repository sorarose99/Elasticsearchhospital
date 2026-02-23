import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, AlertTriangle, TrendingUp, BarChart3,
  Plus, Search, Download, Upload, Filter, Edit,
  Truck, Box, Warehouse, Clock, DollarSign,
  Eye, Trash2, ArrowUpDown, ArrowDownUp,
  ShoppingCart, Users, FileText, Settings,
  RotateCcw, CheckCircle, XCircle, Calendar,
  MapPin, Phone, Mail, Star, Building,
  QrCode, Scan, FileSpreadsheet, Printer,
  Bell, AlertCircle, TrendingDown, Activity,
  ChevronRight, ChevronDown, MoreHorizontal,
  Copy, Send, Archive, RefreshCw, Zap
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { inventoryTranslations } from './translations';

interface InventoryItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  barcode?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  expiryDate?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  reason: string;
  date: string;
  user: string;
  reference?: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  itemsSupplied: number;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered';
  orderDate: string;
  expectedDelivery: string;
}

export default function InventoryManagement() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extended translations
  const translate = (key: string) => {
    return inventoryTranslations[isRTL ? 'ar' : 'en'][key] || key;
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      // Enhanced sample data with more items
      const sampleInventory = [
        {
          id: '1',
          name: 'قفازات طبية',
          nameEn: 'Medical Gloves',
          category: 'medical_supplies',
          barcode: '1234567890',
          currentStock: 500,
          minimumStock: 100,
          maximumStock: 1000,
          unitPrice: 0.5,
          supplier: 'مؤسسة الإمدادات الطبية',
          location: 'المستودع A - الرف 1',
          lastRestocked: '2024-01-15',
          expiryDate: '2025-01-15',
          status: 'in_stock' as const
        },
        {
          id: '2',
          name: 'أقنعة جراحية',
          nameEn: 'Surgical Masks',
          category: 'medical_supplies',
          barcode: '1234567891',
          currentStock: 50,
          minimumStock: 100,
          maximumStock: 500,
          unitPrice: 0.3,
          supplier: 'مؤسسة الإمدادات الطبية',
          location: 'المستودع A - الرف 2',
          lastRestocked: '2024-01-10',
          expiryDate: '2025-01-10',
          status: 'low_stock' as const
        },
        {
          id: '3',
          name: 'محاقن معقمة',
          nameEn: 'Sterile Syringes',
          category: 'medical_supplies',
          barcode: '1234567892',
          currentStock: 0,
          minimumStock: 50,
          maximumStock: 200,
          unitPrice: 1.2,
          supplier: 'شركة المعدات الطبية',
          location: 'المستودع B - الرف 1',
          lastRestocked: '2023-12-01',
          expiryDate: '2025-12-01',
          status: 'out_of_stock' as const
        },
        {
          id: '4',
          name: 'ضمادات لاصقة',
          nameEn: 'Adhesive Bandages',
          category: 'medical_supplies',
          barcode: '1234567893',
          currentStock: 200,
          minimumStock: 50,
          maximumStock: 300,
          unitPrice: 0.8,
          supplier: 'مؤسسة الإمدادات الطبية',
          location: 'المستودع A - الرف 3',
          lastRestocked: '2024-01-20',
          expiryDate: '2024-06-01',
          status: 'expired' as const
        },
        {
          id: '5',
          name: 'أوراق طابعة',
          nameEn: 'Printer Paper',
          category: 'office_supplies',
          barcode: '1234567894',
          currentStock: 150,
          minimumStock: 20,
          maximumStock: 200,
          unitPrice: 5.0,
          supplier: 'مكتبة المستقبل',
          location: 'المخزن الإداري - الرف 1',
          lastRestocked: '2024-01-18',
          status: 'in_stock' as const
        }
      ];
      setInventory(sampleInventory);

      const sampleMovements = [
        {
          id: '1',
          itemId: '1',
          itemName: 'قفازات طبية',
          type: 'out' as const,
          quantity: 50,
          reason: 'استخدام قسم الطوارئ',
          date: '2024-01-20',
          user: 'أحمد محمد',
          reference: 'REQ-001'
        },
        {
          id: '2',
          itemId: '2',
          itemName: 'أقنعة جراحية',
          type: 'in' as const,
          quantity: 100,
          reason: 'توريد جديد',
          date: '2024-01-19',
          user: 'فاطمة علي',
          reference: 'PO-001'
        },
        {
          id: '3',
          itemId: '1',
          itemName: 'قفازات طبية',
          type: 'transfer' as const,
          quantity: 25,
          reason: 'نقل بين المخازن',
          date: '2024-01-18',
          user: 'محمد حسن',
          reference: 'TR-001'
        }
      ];
      setStockMovements(sampleMovements);

      const sampleSuppliers = [
        {
          id: '1',
          name: 'مؤسسة الإمدادات الطبية',
          contact: 'محمد أحمد',
          email: 'contact@medical-supplies.com',
          phone: '+966501234567',
          address: 'الرياض، المملكة العربية السعودية',
          rating: 4.5,
          itemsSupplied: 25
        },
        {
          id: '2',
          name: 'شركة المعدات الطبية',
          contact: 'سارة محمد',
          email: 'info@medequip.sa',
          phone: '+966502345678',
          address: 'جدة، المملكة العربية السعودية',
          rating: 4.2,
          itemsSupplied: 18
        },
        {
          id: '3',
          name: 'مكتبة المستقبل',
          contact: 'خالد علي',
          email: 'sales@future-office.com',
          phone: '+966503456789',
          address: 'الدمام، المملكة العربية السعودية',
          rating: 4.0,
          itemsSupplied: 12
        }
      ];
      setSuppliers(sampleSuppliers);

      const sampleOrders = [
        {
          id: 'PO-001',
          supplier: 'مؤسسة الإمدادات الطبية',
          items: [
            { itemId: '1', itemName: 'قفازات طبية', quantity: 500, unitPrice: 0.5 },
            { itemId: '2', itemName: 'أقنعة جراحية', quantity: 300, unitPrice: 0.3 }
          ],
          totalAmount: 340,
          status: 'sent' as const,
          orderDate: '2024-01-18',
          expectedDelivery: '2024-01-25'
        },
        {
          id: 'PO-002',
          supplier: 'شركة المعدات الطبية',
          items: [
            { itemId: '3', itemName: 'محاقن معقمة', quantity: 200, unitPrice: 1.2 }
          ],
          totalAmount: 240,
          status: 'confirmed' as const,
          orderDate: '2024-01-20',
          expectedDelivery: '2024-01-27'
        },
        {
          id: 'PO-003',
          supplier: 'مكتبة المستقبل',
          items: [
            { itemId: '5', itemName: 'أوراق طابعة', quantity: 100, unitPrice: 5.0 }
          ],
          totalAmount: 500,
          status: 'delivered' as const,
          orderDate: '2024-01-15',
          expectedDelivery: '2024-01-22'
        }
      ];
      setPurchaseOrders(sampleOrders);
    } catch (err) {
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'out_of_stock';
    if (item.currentStock <= item.minimumStock) return 'low_stock';
    return 'in_stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'in_stock': translate('inventory.inStock'),
      'low_stock': translate('inventory.lowStock'),
      'out_of_stock': translate('inventory.outOfStock'),
      'expired': translate('inventory.expired'),
      'near_expiry': translate('inventory.nearExpiry')
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  // Filter and sort functions
  const getFilteredInventory = () => {
    let filtered = inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.barcode?.includes(searchTerm);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof InventoryItem];
      let bValue = b[sortField as keyof InventoryItem];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  // Handle item operations
  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemDialog(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm(translate('inventory.confirmDelete'))) {
      setInventory(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    if (editingItem) {
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...itemData } : item
      ));
    } else {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: itemData.name || '',
        nameEn: itemData.nameEn || '',
        category: itemData.category || 'medical_supplies',
        currentStock: itemData.currentStock || 0,
        minimumStock: itemData.minimumStock || 0,
        maximumStock: itemData.maximumStock || 0,
        unitPrice: itemData.unitPrice || 0,
        supplier: itemData.supplier || '',
        location: itemData.location || '',
        lastRestocked: new Date().toISOString().split('T')[0],
        status: getStockStatus({
          currentStock: itemData.currentStock || 0,
          minimumStock: itemData.minimumStock || 0
        } as InventoryItem),
        ...itemData
      };
      setInventory(prev => [...prev, newItem]);
    }
    setShowItemDialog(false);
    setEditingItem(null);
  };

  // Statistics calculations
  const getInventoryStats = () => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
    const pendingOrdersCount = purchaseOrders.filter(order => order.status === 'sent' || order.status === 'confirmed').length;
    
    return {
      totalItems,
      lowStockItems,
      totalValue,
      pendingOrdersCount
    };
  };

  const stats = getInventoryStats();

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card-animate"
        >
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{translate('inventory.totalItems')}</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalItems}</p>
                  <p className="text-xs text-success mt-1">+12% {translate('inventory.thisMonth')}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card-animate"
        >
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{translate('inventory.lowStock')}</p>
                  <p className="text-3xl font-bold text-warning">{stats.lowStockItems}</p>
                  <p className="text-xs text-warning mt-1">{translate('inventory.itemsNeedRestock')}</p>
                </div>
                <div className="bg-warning/10 p-3 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card-animate"
        >
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{translate('inventory.inventoryValue')}</p>
                  <p className="text-3xl font-bold text-success">
                    {stats.totalValue.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                  </p>
                  <p className="text-xs text-success mt-1">+8.5% {translate('inventory.thisMonth')}</p>
                </div>
                <div className="bg-success/10 p-3 rounded-xl">
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card-animate"
        >
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{translate('inventory.pendingOrders')}</p>
                  <p className="text-3xl font-bold text-info">{stats.pendingOrdersCount}</p>
                  <p className="text-xs text-info mt-1">{translate('inventory.purchaseOrders')}</p>
                </div>
                <div className="bg-info/10 p-3 rounded-xl">
                  <Truck className="h-8 w-8 text-info" />
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
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {translate('inventory.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => setShowItemDialog(true)}
                className="flex flex-col items-center gap-2 h-20 hover-scale"
                variant="outline"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs">{translate('inventory.addItem')}</span>
              </Button>
              <Button 
                onClick={() => setShowOrderDialog(true)}
                className="flex flex-col items-center gap-2 h-20 hover-scale"
                variant="outline"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">{translate('inventory.newPurchaseOrder')}</span>
              </Button>
              <Button 
                onClick={() => setShowMovementDialog(true)}
                className="flex flex-col items-center gap-2 h-20 hover-scale"
                variant="outline"
              >
                <ArrowUpDown className="h-6 w-6" />
                <span className="text-xs">{translate('inventory.addMovement')}</span>
              </Button>
              <Button 
                className="flex flex-col items-center gap-2 h-20 hover-scale"
                variant="outline"
              >
                <FileSpreadsheet className="h-6 w-6" />
                <span className="text-xs">{translate('inventory.generateReport')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Low Stock & Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <CardTitle>{translate('inventory.lowStockItems')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').slice(0, 5).map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-xl hover-lift"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{isRTL ? item.name : item.nameEn}</p>
                        <p className="text-sm text-muted-foreground">
                          {translate('inventory.available')}: {item.currentStock} | 
                          {translate('inventory.minimumStock')}: {item.minimumStock}
                        </p>
                        <div className="mt-2">
                          <Progress 
                            value={(item.currentStock / item.minimumStock) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" className="hover-scale">
                          {translate('inventory.requestSupply')}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                    <p>All items have sufficient stock levels</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>{translate('inventory.recentMovements')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {stockMovements.slice(0, 5).map((movement, index) => (
                    <motion.div 
                      key={movement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-xl hover-lift"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          movement.type === 'in' ? 'bg-success/10 text-success' :
                          movement.type === 'out' ? 'bg-destructive/10 text-destructive' :
                          'bg-info/10 text-info'
                        }`}>
                          {movement.type === 'in' ? <ArrowDownUp className="h-4 w-4" /> :
                           movement.type === 'out' ? <ArrowUpDown className="h-4 w-4" /> :
                           <RefreshCw className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{movement.itemName}</p>
                          <p className="text-sm text-muted-foreground">
                            {movement.type === 'in' ? translate('inventory.stockIn') : 
                             movement.type === 'out' ? translate('inventory.stockOut') : 
                             translate('inventory.stockTransfer')} {movement.quantity} - {movement.reason}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {movement.date}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{movement.user}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="border-warning/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              <CardTitle>Inventory Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Low Stock Alert</span>
                </div>
                <p className="text-2xl font-bold text-warning">{stats.lowStockItems}</p>
                <p className="text-xs text-muted-foreground">Items need restocking</p>
              </div>
              
              <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Expiry Alert</span>
                </div>
                <p className="text-2xl font-bold text-destructive">3</p>
                <p className="text-xs text-muted-foreground">Items expiring soon</p>
              </div>
              
              <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium">Slow Moving</span>
                </div>
                <p className="text-2xl font-bold text-info">7</p>
                <p className="text-xs text-muted-foreground">Items with low turnover</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderInventory = () => {
    const filteredInventory = getFilteredInventory();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Filters and Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={translate('inventory.searchInventory')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={translate('inventory.allCategories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{translate('inventory.allCategories')}</SelectItem>
                    <SelectItem value="medical_supplies">{translate('inventory.medicalSupplies')}</SelectItem>
                    <SelectItem value="office_supplies">{translate('inventory.officeSupplies')}</SelectItem>
                    <SelectItem value="equipment">{translate('inventory.equipment')}</SelectItem>
                    <SelectItem value="medications">{translate('inventory.medications')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in_stock">{translate('inventory.inStock')}</SelectItem>
                    <SelectItem value="low_stock">{translate('inventory.lowStock')}</SelectItem>
                    <SelectItem value="out_of_stock">{translate('inventory.outOfStock')}</SelectItem>
                    <SelectItem value="expired">{translate('inventory.expired')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  {translate('inventory.export')}
                </Button>
                <Button 
                  onClick={() => setShowItemDialog(true)}
                  className="hover-scale"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {translate('inventory.addItem')}
                </Button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredInventory.length} of {inventory.length} items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Items */}
        <Card>
          <CardContent className="p-6">
            {viewMode === 'list' ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredInventory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border rounded-xl p-6 hover-lift bg-card"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{isRTL ? item.name : item.nameEn}</h4>
                              <p className="text-sm text-muted-foreground">{item.barcode}</p>
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusText(item.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">{translate('inventory.available')}</p>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-lg">{item.currentStock}</p>
                                <Progress 
                                  value={(item.currentStock / item.maximumStock) * 100} 
                                  className="h-2 flex-1"
                                />
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">{translate('inventory.minimumStock')}</p>
                              <p className="font-medium">{item.minimumStock}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">{translate('inventory.unitPrice')}</p>
                              <p className="font-medium">{item.unitPrice.toFixed(2)} {isRTL ? 'ريال' : 'SAR'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">{translate('inventory.supplier')}</p>
                              <p className="font-medium truncate">{item.supplier}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">{translate('inventory.lastRestocked')}</p>
                              <p className="font-medium">{item.lastRestocked}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </span>
                            {item.expiryDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Expires: {item.expiryDate}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-6">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditItem(item)}
                            className="hover-scale"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {translate('inventory.edit')}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => setShowMovementDialog(true)}
                            className="hover-scale"
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {translate('inventory.stockMovement')}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredInventory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border rounded-xl p-6 hover-lift bg-card"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{isRTL ? item.name : item.nameEn}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.category}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Stock:</span>
                          <span className="font-medium">{item.currentStock}</span>
                        </div>
                        <Progress value={(item.currentStock / item.maximumStock) * 100} className="h-2" />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Price:</span>
                          <span className="font-medium">{item.unitPrice.toFixed(2)} SAR</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditItem(item)}
                          className="flex-1 hover-scale"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setShowMovementDialog(true)}
                          className="flex-1 hover-scale"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {filteredInventory.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No items found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderSuppliers = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Suppliers Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{translate('inventory.supplierManagement')}</h2>
                <p className="text-sm text-muted-foreground">Manage your suppliers and vendor relationships</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowSupplierDialog(true)}
              className="hover-scale"
            >
              <Plus className="h-4 w-4 mr-2" />
              {translate('inventory.addSupplier')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {suppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <Building className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground">{supplier.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{supplier.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.email}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{translate('inventory.itemsSupplied')}</p>
                        <p className="font-semibold text-lg">{supplier.itemsSupplied}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">{translate('inventory.address')}</p>
                    <p className="text-sm">{supplier.address}</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover-scale"
                      onClick={() => {
                        setEditingSupplier(supplier);
                        setShowSupplierDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {translate('inventory.supplierDetails')}
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 hover-scale"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {translate('inventory.requestQuote')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Supplier Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {translate('inventory.supplierPerformance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{supplier.name}</h4>
                  <Badge variant="outline">{supplier.rating}/5</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items Supplied:</span>
                    <span className="font-medium">{supplier.itemsSupplied}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance:</span>
                    <span className="font-medium text-success">Excellent</span>
                  </div>
                  <Progress value={supplier.rating * 20} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPurchaseOrders = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Orders Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{translate('inventory.purchaseOrderManagement')}</h2>
                <p className="text-sm text-muted-foreground">Track and manage all purchase orders</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowOrderDialog(true)}
              className="hover-scale"
            >
              <Plus className="h-4 w-4 mr-2" />
              {translate('inventory.newPurchaseOrder')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{purchaseOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {purchaseOrders.filter(o => o.status === 'sent' || o.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">
                  {purchaseOrders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()} SAR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {purchaseOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-xl p-6 hover-lift"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {translate('inventory.orderNumber')} #{order.id}
                          </h3>
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            order.status === 'sent' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }>
                            {order.status === 'delivered' ? translate('inventory.delivered') :
                             order.status === 'confirmed' ? translate('inventory.confirmed') :
                             order.status === 'sent' ? translate('inventory.sent') : translate('inventory.draft')}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {translate('inventory.supplier')}: {order.supplier}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {translate('inventory.orderDate')}: {order.orderDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="mb-3">
                        <p className="text-2xl font-bold text-primary">
                          {order.totalAmount.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {translate('inventory.expectedDelivery')}: {order.expectedDelivery}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="hover-scale"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {translate('inventory.viewOrder')}
                        </Button>
                        <Button 
                          size="sm"
                          className="hover-scale"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {translate('inventory.editOrder')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium">{translate('inventory.items')}</p>
                      <Badge variant="outline">{order.items.length} items</Badge>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <motion.div 
                          key={itemIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                          className="flex justify-between items-center text-sm bg-background p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-1 rounded">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{item.itemName}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {item.quantity} × {item.unitPrice.toFixed(2)} = {(item.quantity * item.unitPrice).toFixed(2)} {isRTL ? 'ريال' : 'SAR'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {translate('inventory.cancelOrder')}
                      </Button>
                      {order.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-success hover:text-success hover:bg-success/10"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {translate('inventory.receiveOrder')}
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Order created on {order.orderDate}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Add more sections
  const renderStockMovements = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{translate('inventory.stockMovementHistory')}</CardTitle>
                <p className="text-sm text-muted-foreground">Track all stock movements and transactions</p>
              </div>
            </div>
            <Button onClick={() => setShowMovementDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {translate('inventory.addMovement')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {stockMovements.map((movement, index) => (
                <motion.div
                  key={movement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-xl p-4 hover-lift"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        movement.type === 'in' ? 'bg-success/10 text-success' :
                        movement.type === 'out' ? 'bg-destructive/10 text-destructive' :
                        'bg-info/10 text-info'
                      }`}>
                        {movement.type === 'in' ? <ArrowDownUp className="h-6 w-6" /> :
                         movement.type === 'out' ? <ArrowUpDown className="h-6 w-6" /> :
                         <RefreshCw className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{movement.itemName}</h3>
                        <p className="text-sm text-muted-foreground">{movement.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {movement.user} • {movement.date} • {movement.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        movement.type === 'in' ? 'text-success' :
                        movement.type === 'out' ? 'text-destructive' :
                        'text-info'
                      }`}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '↔'}{movement.quantity}
                      </p>
                      <Badge variant="outline">
                        {movement.type === 'in' ? translate('inventory.stockIn') :
                         movement.type === 'out' ? translate('inventory.stockOut') :
                         translate('inventory.stockTransfer')}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAnalytics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{translate('inventory.inventoryAnalytics')}</CardTitle>
              <p className="text-sm text-muted-foreground">Comprehensive inventory insights and trends</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Inventory Turnover</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">4.2x</p>
              <p className="text-sm text-blue-600/70">+15% from last month</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Stock Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-green-600">98.5%</p>
              <p className="text-sm text-green-600/70">Above target</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Avg. Days on Hand</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">45</p>
              <p className="text-sm text-purple-600/70">Optimal range</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Cost Savings</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">12.3%</p>
              <p className="text-sm text-orange-600/70">This quarter</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Level Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Chart visualization would be implemented here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <p>Pie chart would be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted/20 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {translate('inventory.inventoryManagement')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {translate('inventory.comprehensiveInventorySystem')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="hover-scale">
              <QrCode className="h-4 w-4 mr-2" />
              {translate('inventory.scanBarcode')}
            </Button>
            <Button className="hover-scale bg-gradient-to-r from-primary to-primary/80">
              <Upload className="h-4 w-4 mr-2" />
              {translate('inventory.importData')}
            </Button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-12 bg-muted/50 rounded-xl p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">{translate('inventory.dashboard')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">{translate('inventory.inventory')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="suppliers"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">{translate('inventory.suppliers')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">{translate('inventory.purchaseOrders')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="movements"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">{translate('inventory.stockMovements')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">{translate('inventory.analytics')}</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <TabsContent value="dashboard" className="mt-0">
                  {renderDashboard()}
                </TabsContent>

                <TabsContent value="inventory" className="mt-0">
                  {renderInventory()}
                </TabsContent>

                <TabsContent value="suppliers" className="mt-0">
                  {renderSuppliers()}
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                  {renderPurchaseOrders()}
                </TabsContent>

                <TabsContent value="movements" className="mt-0">
                  {renderStockMovements()}
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  {renderAnalytics()}
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>

        {/* Dialogs and Modals would be added here */}
        {/* Item Dialog */}
        <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? translate('inventory.editItemDetails') : translate('inventory.addNewItem')}
              </DialogTitle>
              <DialogDescription>
                Fill out the item information below
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label>{translate('inventory.itemName')}</Label>
                  <Input placeholder="Enter item name" />
                </div>
                <div>
                  <Label>{translate('inventory.itemNameEn')}</Label>
                  <Input placeholder="Enter English name" />
                </div>
                <div>
                  <Label>{translate('inventory.category')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical_supplies">Medical Supplies</SelectItem>
                      <SelectItem value="office_supplies">Office Supplies</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{translate('inventory.barcode')}</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter or scan barcode" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>{translate('inventory.currentStock')}</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>{translate('inventory.minimumStock')}</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>{translate('inventory.maximumStock')}</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>{translate('inventory.unitPrice')}</Label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                {translate('inventory.cancel')}
              </Button>
              <Button onClick={() => handleSaveItem({})}>
                {translate('inventory.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-card p-8 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-4">
                <div className="animate-spin">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">{translate('inventory.loading')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setError(null)}
                className="ml-2 hover:bg-destructive-foreground/10"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}