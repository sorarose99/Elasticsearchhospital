import React from 'react';
import { 
  Pill, 
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getStatusBadge, getStockStatus, getExpiryStatus, calculateDaysUntilExpiry } from './helpers';

interface PrescriptionCardProps {
  prescription: any;
  t: any;
  onDispense: (prescription: any) => void;
}

export const PrescriptionCard = ({ prescription, t, onDispense }: PrescriptionCardProps) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">{prescription.patientName}</h3>
            <p className="text-sm text-gray-600">{prescription.doctorName}</p>
            <p className="text-sm text-gray-500">
              {prescription.medications?.length} medications | {prescription.prescribedDate}
            </p>
            {prescription.priority === 'urgent' && (
              <Badge variant="destructive" className="mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(prescription.status, t)}
          {prescription.status === 'pending' && (
            <Button size="sm" onClick={() => onDispense(prescription)}>
              {t.dispense}
            </Button>
          )}
          <Button size="sm" variant="outline">
            {t.viewDetails}
          </Button>
        </div>
      </div>
      
      {prescription.medications && prescription.medications.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="space-y-2">
            {prescription.medications.slice(0, 2).map((med: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium">{med.name}</span>
                <span className="text-gray-600">{med.quantity} units</span>
              </div>
            ))}
            {prescription.medications.length > 2 && (
              <p className="text-sm text-gray-500">
                +{prescription.medications.length - 2} more medications
              </p>
            )}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

interface InventoryCardProps {
  item: any;
  t: any;
  onUpdateStock: (item: any) => void;
}

export const InventoryCard = ({ item, t, onUpdateStock }: InventoryCardProps) => {
  const daysUntilExpiry = calculateDaysUntilExpiry(item.expiryDate);
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="text-sm text-gray-500">
                Batch: {item.batchNumber} | {item.supplier}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">
                  Stock: {item.currentStock} / {item.minimumStock}
                </span>
                {daysUntilExpiry <= 30 && (
                  <span className="text-sm text-orange-600">
                    Expires in {daysUntilExpiry} {t.days}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStockStatus(item.currentStock, item.minimumStock, t)}
            {getExpiryStatus(item.expiryDate, t)}
            <Button size="sm" variant="outline" onClick={() => onUpdateStock(item)}>
              {t.updateStock}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-sm">
            <span className="text-gray-600">{t.costPrice}: </span>
            <span className="font-medium">${item.costPrice}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">{t.sellingPrice}: </span>
            <span className="font-medium">${item.sellingPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
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