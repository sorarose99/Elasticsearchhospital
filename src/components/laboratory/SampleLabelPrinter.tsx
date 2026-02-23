import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Printer, 
  QrCode, 
  Barcode,
  Download,
  Settings,
  Copy,
  RefreshCw,
  Check,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  TestTube,
  Hash
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface LabOrder {
  id: string;
  patientId: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    medicalNumber: string;
    dateOfBirth: string;
  };
  doctor?: {
    id: string;
    name: string;
    specialization: string;
  };
  tests: Array<{
    testId: string;
    test?: {
      id: string;
      code: string;
      name: string;
      specimen: string;
    };
  }>;
  priority: 'routine' | 'urgent' | 'stat';
  orderDate: string;
  collectionDate?: string;
}

interface SampleLabelPrinterProps {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder | null;
  onPrint?: (labelData: any) => void;
}

interface LabelSettings {
  labelSize: 'small' | 'medium' | 'large';
  includeQR: boolean;
  includeBarcode: boolean;
  includePatientPhoto: boolean;
  copies: number;
  printer: string;
  orientation: 'portrait' | 'landscape';
}

const SampleLabelPrinter: React.FC<SampleLabelPrinterProps> = ({
  isOpen,
  onClose,
  order,
  onPrint
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [labelSettings, setLabelSettings] = useState<LabelSettings>({
    labelSize: 'medium',
    includeQR: true,
    includeBarcode: true,
    includePatientPhoto: false,
    copies: 1,
    printer: 'default',
    orientation: 'portrait'
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [availablePrinters] = useState([
    { id: 'default', name: 'Default Printer', type: 'thermal' },
    { id: 'label-printer-1', name: 'Zebra ZD420', type: 'label' },
    { id: 'label-printer-2', name: 'Brother QL-820NWB', type: 'label' },
    { id: 'laser-printer', name: 'HP LaserJet Pro', type: 'laser' }
  ]);

  const printRef = useRef<HTMLDivElement>(null);

  // Generate unique sample ID based on order and test
  const generateSampleId = (orderId: string, testId: string) => {
    const timestamp = Date.now().toString().slice(-6);
    return `${orderId.slice(-3)}-${testId.slice(-2)}-${timestamp}`;
  };

  // Generate QR code data
  const generateQRData = (sampleId: string, order: LabOrder, test: any) => {
    return JSON.stringify({
      sampleId,
      orderId: order.id,
      patientId: order.patientId,
      testId: test.testId,
      timestamp: new Date().toISOString(),
      facility: 'MediCore Hospital'
    });
  };

  // Handle label printing
  const handlePrint = async () => {
    if (!order) return;

    setIsPrinting(true);
    try {
      // Generate print data for each test
      const printData = order.tests.map(test => {
        const sampleId = generateSampleId(order.id, test.testId);
        const qrData = generateQRData(sampleId, order, test);
        
        return {
          sampleId,
          order,
          test,
          qrData,
          barcode: sampleId,
          settings: labelSettings,
          timestamp: new Date().toISOString()
        };
      });

      // Simulate printing process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onPrint) {
        onPrint(printData);
      }

      // For demo purposes, we'll use the browser's print functionality
      if (printRef.current) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Sample Labels - ${order.id}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                  .label { 
                    width: ${labelSettings.labelSize === 'small' ? '50mm' : labelSettings.labelSize === 'medium' ? '70mm' : '90mm'};
                    height: ${labelSettings.labelSize === 'small' ? '30mm' : labelSettings.labelSize === 'medium' ? '40mm' : '50mm'};
                    border: 1px solid #000;
                    margin: 10px;
                    padding: 5px;
                    page-break-inside: avoid;
                    display: inline-block;
                    vertical-align: top;
                  }
                  .label-header { font-weight: bold; font-size: 12px; text-align: center; }
                  .patient-info { font-size: 10px; margin: 5px 0; }
                  .test-info { font-size: 9px; margin: 3px 0; }
                  .codes { font-size: 8px; margin: 3px 0; text-align: center; }
                  .priority-urgent { color: #ff6b35; font-weight: bold; }
                  .priority-stat { color: #dc2626; font-weight: bold; }
                  @media print {
                    body { margin: 0; }
                    .label { margin: 2mm; }
                  }
                </style>
              </head>
              <body>
                ${printData.map((data, index) => `
                  <div class="label">
                    <div class="label-header">MediCore Hospital</div>
                    <div class="patient-info">
                      <strong>${order.patient?.firstName} ${order.patient?.lastName}</strong><br/>
                      ID: ${order.patient?.medicalNumber} | Age: ${order.patient?.age}<br/>
                      DOB: ${order.patient?.dateOfBirth}
                    </div>
                    <div class="test-info">
                      Test: ${data.test.test?.name} (${data.test.test?.code})<br/>
                      Specimen: ${data.test.test?.specimen}<br/>
                      <span class="priority-${order.priority}">Priority: ${order.priority.toUpperCase()}</span>
                    </div>
                    <div class="codes">
                      Sample ID: ${data.sampleId}<br/>
                      Order: ${order.id}<br/>
                      Date: ${new Date(order.collectionDate || order.orderDate).toLocaleDateString()}
                      ${labelSettings.includeBarcode ? `<br/>||||| ${data.barcode} |||||` : ''}
                      ${labelSettings.includeQR ? `<br/>[QR: ${data.sampleId}]` : ''}
                    </div>
                  </div>
                `).join('')}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }

      console.log('Labels printed successfully:', printData);
    } catch (error) {
      console.error('Printing error:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  // Update label settings
  const updateSettings = (key: keyof LabelSettings, value: any) => {
    setLabelSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen || !order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            {t('lab.printSampleLabels')}
          </DialogTitle>
          <DialogDescription>
            {t('lab.printLabelsDescription')} - {t('lab.orderId')}: {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4" />
                  {t('lab.labelSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Label Size */}
                <div>
                  <Label>{t('lab.labelSize')}</Label>
                  <Select
                    value={labelSettings.labelSize}
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      updateSettings('labelSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t('lab.sizeSmall')} (50x30mm)</SelectItem>
                      <SelectItem value="medium">{t('lab.sizeMedium')} (70x40mm)</SelectItem>
                      <SelectItem value="large">{t('lab.sizeLarge')} (90x50mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Printer Selection */}
                <div>
                  <Label>{t('lab.selectPrinter')}</Label>
                  <Select
                    value={labelSettings.printer}
                    onValueChange={(value) => updateSettings('printer', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePrinters.map(printer => (
                        <SelectItem key={printer.id} value={printer.id}>
                          {printer.name} ({printer.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Copies */}
                <div>
                  <Label>{t('lab.numberOfCopies')}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={labelSettings.copies}
                    onChange={(e) => updateSettings('copies', parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <Label>{t('lab.includeOptions')}</Label>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeQR"
                      checked={labelSettings.includeQR}
                      onChange={(e) => updateSettings('includeQR', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="includeQR" className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      {t('lab.includeQRCode')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeBarcode"
                      checked={labelSettings.includeBarcode}
                      onChange={(e) => updateSettings('includeBarcode', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="includeBarcode" className="flex items-center gap-2">
                      <Barcode className="h-4 w-4" />
                      {t('lab.includeBarcode')}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('lab.orderInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {order.patient?.firstName} {order.patient?.lastName}
                  </span>
                  <Badge variant="outline">{order.patient?.medicalNumber}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{t('lab.collectionDate')}: </span>
                  <span>{new Date(order.collectionDate || order.orderDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>{t('lab.orderId')}: {order.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span>{t('lab.priority')}: </span>
                  <Badge 
                    variant={order.priority === 'stat' ? 'destructive' : 
                           order.priority === 'urgent' ? 'default' : 'secondary'}
                  >
                    {t(`lab.${order.priority}`)}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">{t('lab.testsToLabel')} ({order.tests.length})</h4>
                  <div className="space-y-2">
                    {order.tests.map((test, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <TestTube className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{test.test?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {test.test?.code} • {t(`lab.specimen.${test.test?.specimen}`)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {generateSampleId(order.id, test.testId)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{t('lab.labelPreview')}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={printRef}
                  className="space-y-4 max-h-[400px] overflow-y-auto"
                >
                  {order.tests.map((test, index) => {
                    const sampleId = generateSampleId(order.id, test.testId);
                    return (
                      <div
                        key={index}
                        className={`border-2 border-dashed border-muted-foreground p-3 rounded
                          ${labelSettings.labelSize === 'small' ? 'w-48 h-32' : 
                            labelSettings.labelSize === 'medium' ? 'w-56 h-40' : 'w-64 h-48'}
                          text-xs bg-white text-black`}
                        style={{ 
                          fontFamily: 'monospace',
                          transform: labelSettings.orientation === 'landscape' ? 'rotate(90deg)' : 'none'
                        }}
                      >
                        {/* Header */}
                        <div className="text-center font-bold text-sm border-b pb-1 mb-2">
                          MediCore Hospital
                        </div>

                        {/* Patient Info */}
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {order.patient?.firstName} {order.patient?.lastName}
                          </div>
                          <div className="text-xs">
                            ID: {order.patient?.medicalNumber} | Age: {order.patient?.age}
                          </div>
                          <div className="text-xs">
                            DOB: {order.patient?.dateOfBirth}
                          </div>
                        </div>

                        <div className="border-t pt-1 mt-2 space-y-1">
                          {/* Test Info */}
                          <div className="font-medium text-xs">
                            {test.test?.name} ({test.test?.code})
                          </div>
                          <div className="text-xs">
                            Specimen: {t(`lab.specimen.${test.test?.specimen}`)}
                          </div>
                          <div className={`text-xs font-bold
                            ${order.priority === 'stat' ? 'text-red-600' : 
                              order.priority === 'urgent' ? 'text-orange-600' : 'text-green-600'}`}>
                            Priority: {order.priority.toUpperCase()}
                          </div>
                        </div>

                        <div className="border-t pt-1 mt-2 space-y-1">
                          {/* Sample ID */}
                          <div className="font-bold text-center">
                            Sample ID: {sampleId}
                          </div>
                          <div className="text-xs text-center">
                            Order: {order.id}
                          </div>
                          <div className="text-xs text-center">
                            {new Date(order.collectionDate || order.orderDate).toLocaleDateString()}
                          </div>

                          {/* Barcode/QR representation */}
                          <div className="text-center space-y-1">
                            {labelSettings.includeBarcode && (
                              <div className="text-xs font-mono">
                                ||||| {sampleId} |||||
                              </div>
                            )}
                            {labelSettings.includeQR && (
                              <div className="text-xs">
                                [QR: {sampleId}]
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {order.tests.length} {t('lab.labels')} × {labelSettings.copies} {t('lab.copies')} = {order.tests.length * labelSettings.copies} {t('lab.total')}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2"
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t('lab.printing')}
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4" />
                  {t('lab.printLabels')}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SampleLabelPrinter;