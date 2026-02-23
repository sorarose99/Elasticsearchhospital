import { Badge } from '../ui/badge';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export const getStatusBadge = (status: string, t: any) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t.pending}</Badge>;
    case 'dispensed':
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />{t.dispensed}</Badge>;
    case 'partially_dispensed':
      return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />{t.partiallyDispensed}</Badge>;
    case 'cancelled':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t.cancelled}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getStockStatus = (currentStock: number, minimumStock: number, t: any) => {
  if (currentStock === 0) {
    return <Badge variant="destructive">{t.outOfStock}</Badge>;
  } else if (currentStock <= minimumStock) {
    return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />{t.lowStockAlert}</Badge>;
  } else {
    return <Badge variant="default">{t.inStock}</Badge>;
  }
};

export const getExpiryStatus = (expiryDate: string, t: any) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) {
    return <Badge variant="destructive">{t.expiryAlert}</Badge>;
  }
  return null;
};

export const calculateDaysUntilExpiry = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const filterPrescriptions = (prescriptions: any[], searchTerm: string) => {
  return prescriptions.filter((prescription: any) =>
    prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medications?.some((med: any) => 
      med.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

export const filterInventory = (inventory: any[], searchTerm: string) => {
  return inventory.filter((item: any) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};