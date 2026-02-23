import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Package,
  ShoppingCart,
  AlertTriangle,
  Search,
  Plus,
  LogOut,
  Languages,
  DollarSign,
  TrendingDown,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { translations, mockInventory, mockPrescriptions } from '../pharmacy/constants';
import { filterPrescriptions, filterInventory } from '../pharmacy/helpers';
import { PrescriptionCard, InventoryCard, StatCard } from '../pharmacy/components';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface PharmacyDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

export default function PharmacyDashboard({ user, onLogout, language, onLanguageChange }: PharmacyDashboardProps) {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [inventory, setInventory] = useState(mockInventory);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [showDispenseDialog, setShowDispenseDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [stockUpdate, setStockUpdate] = useState({ quantity: '', notes: '' });

  const { t } = useLanguage();
  const { navigateTo } = useNavigation();

  const handleDispense = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowDispenseDialog(true);
  };

  const handleStockUpdate = (item: any) => {
    setSelectedInventoryItem(item);
    setShowStockDialog(true);
  };

  const confirmDispense = () => {
    if (selectedPrescription) {
      setPrescriptions(prescriptions.map(p => 
        p.id === selectedPrescription.id ? { ...p, status: 'dispensed' } : p
      ));
      setShowDispenseDialog(false);
      setSelectedPrescription(null);
      toast.success(t.medicationDispensed);
    }
  };

  const confirmStockUpdate = () => {
    if (selectedInventoryItem && stockUpdate.quantity) {
      setInventory(inventory.map(item => 
        item.id === selectedInventoryItem.id 
          ? { ...item, currentStock: item.currentStock + parseInt(stockUpdate.quantity) }
          : item
      ));
      setShowStockDialog(false);
      setSelectedInventoryItem(null);
      setStockUpdate({ quantity: '', notes: '' });
      toast.success(t.stockUpdated);
    }
  };

  const filteredPrescriptions = filterPrescriptions(prescriptions, searchTerm);
  const filteredInventory = filterInventory(inventory, inventorySearchTerm);

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minimumStock);
  const expiringItems = inventory.filter(item => {
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });
  const todayDispensed = prescriptions.filter(p => p.status === 'dispensed').length;

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
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">Pharmacist: {user.name}</p>
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
            title={t.pendingPrescriptions}
            value={pendingPrescriptions.length}
            icon={Pill}
            color="bg-blue-500"
          />
          <StatCard
            title={t.lowStock}
            value={lowStockItems.length}
            icon={AlertTriangle}
            color="bg-orange-500"
          />
          <StatCard
            title={t.expiringItems}
            value={expiringItems.length}
            icon={TrendingDown}
            color="bg-red-500"
          />
          <StatCard
            title={t.todayDispensed}
            value={todayDispensed}
            icon={ShoppingCart}
            color="bg-green-500"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="prescriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prescriptions">
              <Pill className="w-4 h-4 mr-2" />
              {t.prescriptions}
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="w-4 h-4 mr-2" />
              {t.inventory}
            </TabsTrigger>
            <TabsTrigger value="dispensing">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t.dispensing}
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              {t.reports}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.prescriptions}</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t.searchPrescriptions}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((prescription, index) => (
                      <PrescriptionCard 
                        key={index} 
                        prescription={prescription} 
                        t={t}
                        onDispense={handleDispense}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noPrescriptions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.inventory}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t.searchMedications}
                      value={inventorySearchTerm}
                      onChange={(e) => setInventorySearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addStock}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item, index) => (
                      <InventoryCard 
                        key={index} 
                        item={item} 
                        t={t}
                        onUpdateStock={handleStockUpdate}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noItems}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dispensing">
            <Card>
              <CardHeader>
                <CardTitle>{t.dispensing}</CardTitle>
                <CardDescription>Manage medication dispensing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('pharmacy', 'dispensing')}
                    className="mx-auto"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('pharmacy.dispensing')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Dispense medications and manage inventory
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>{t.reports}</CardTitle>
                <CardDescription>Pharmacy reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('reports', 'pharmacy')}
                    className="mx-auto"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('pharmacy.reports')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Pharmacy reports and analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dispense Dialog */}
        <Dialog open={showDispenseDialog} onOpenChange={setShowDispenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.dispense} {t.medication}</DialogTitle>
              <DialogDescription>
                Confirm dispensing medications for {selectedPrescription?.patientName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPrescription?.medications?.map((med: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage} - {med.quantity} units</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDispenseDialog(false)}>
                {t.cancel}
              </Button>
              <Button onClick={confirmDispense}>
                {t.dispenseAll}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stock Update Dialog */}
        <Dialog open={showStockDialog} onOpenChange={setShowStockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.updateStock}</DialogTitle>
              <DialogDescription>
                Update stock for {selectedInventoryItem?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.quantity}</Label>
                <Input
                  type="number"
                  value={stockUpdate.quantity}
                  onChange={(e) => setStockUpdate({...stockUpdate, quantity: e.target.value})}
                  placeholder="Enter quantity to add"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.notes}</Label>
                <Textarea
                  value={stockUpdate.notes}
                  onChange={(e) => setStockUpdate({...stockUpdate, notes: e.target.value})}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStockDialog(false)}>
                {t.cancel}
              </Button>
              <Button onClick={confirmStockUpdate}>
                {t.updateStock}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}