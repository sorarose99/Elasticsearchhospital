import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { 
  CreditCard, 
  Receipt,
  DollarSign,
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Shield,
  Percent,
  Plus,
  Minus,
  Eye,
  Download,
  Send
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
    medicalNumber: string;
    insuranceId?: string;
    insuranceProvider?: string;
  };
  tests: Array<{
    testId: string;
    test?: {
      id: string;
      code: string;
      name: string;
      price: number;
    };
  }>;
  priority: 'routine' | 'urgent' | 'stat';
  orderDate: string;
  status: string;
}

interface BillingItem {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number;
  totalPrice: number;
}

interface PaymentMethod {
  id: string;
  type: 'cash' | 'card' | 'insurance' | 'bank_transfer';
  name: string;
  enabled: boolean;
}

interface InsuranceClaim {
  policyNumber: string;
  provider: string;
  coveragePercentage: number;
  maxCoverage: number;
  deductible: number;
  preAuthorization?: string;
}

interface LabBillingIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder | null;
  onGenerateInvoice?: (invoiceData: any) => void;
  onProcessPayment?: (paymentData: any) => void;
}

const LabBillingIntegration: React.FC<LabBillingIntegrationProps> = ({
  isOpen,
  onClose,
  order,
  onGenerateInvoice,
  onProcessPayment
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [insuranceClaim, setInsuranceClaim] = useState<InsuranceClaim | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [taxRate, setTaxRate] = useState<number>(15); // 15% VAT
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [currentStep, setCurrentStep] = useState<'billing' | 'payment' | 'confirmation'>('billing');

  const paymentMethods: PaymentMethod[] = [
    { id: 'cash', type: 'cash', name: t('billing.cash'), enabled: true },
    { id: 'card', type: 'card', name: t('billing.creditCard'), enabled: true },
    { id: 'insurance', type: 'insurance', name: t('billing.insurance'), enabled: true },
    { id: 'bank_transfer', type: 'bank_transfer', name: t('billing.bankTransfer'), enabled: true }
  ];

  // Initialize billing items from order
  useEffect(() => {
    if (order && order.tests) {
      const items: BillingItem[] = order.tests.map((test, index) => ({
        id: `item-${index}`,
        testId: test.testId,
        testName: test.test?.name || 'Unknown Test',
        testCode: test.test?.code || 'N/A',
        unitPrice: test.test?.price || 0,
        quantity: 1,
        discount: 0,
        discountType: 'percentage',
        taxRate: taxRate,
        totalPrice: test.test?.price || 0
      }));
      setBillingItems(items);
    }
  }, [order, taxRate]);

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = billingItems.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const itemDiscount = item.discountType === 'percentage' 
        ? itemTotal * (item.discount / 100)
        : item.discount;
      return sum + (itemTotal - itemDiscount);
    }, 0);

    const globalDiscount = discountType === 'percentage' 
      ? subtotal * (discountAmount / 100)
      : discountAmount;

    const afterDiscount = subtotal - globalDiscount;
    const taxAmount = afterDiscount * (taxRate / 100);
    const total = afterDiscount + taxAmount;

    let insuranceCoverage = 0;
    let patientResponsibility = total;

    if (insuranceClaim && selectedPaymentMethod === 'insurance') {
      const maxCoverable = Math.min(total - insuranceClaim.deductible, insuranceClaim.maxCoverage);
      insuranceCoverage = Math.max(0, maxCoverable * (insuranceClaim.coveragePercentage / 100));
      patientResponsibility = total - insuranceCoverage;
    }

    return {
      subtotal,
      globalDiscount,
      taxAmount,
      total,
      insuranceCoverage,
      patientResponsibility
    };
  }, [billingItems, discountAmount, discountType, taxRate, insuranceClaim, selectedPaymentMethod]);

  // Update billing item
  const updateBillingItem = (id: string, field: keyof BillingItem, value: any) => {
    setBillingItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalculate total price
        const itemTotal = updated.unitPrice * updated.quantity;
        const itemDiscount = updated.discountType === 'percentage' 
          ? itemTotal * (updated.discount / 100)
          : updated.discount;
        updated.totalPrice = itemTotal - itemDiscount;
        
        return updated;
      }
      return item;
    }));
  };

  // Handle insurance setup
  const setupInsurance = () => {
    if (!order?.patient?.insuranceId) return;

    setInsuranceClaim({
      policyNumber: order.patient.insuranceId,
      provider: order.patient.insuranceProvider || 'Default Insurance',
      coveragePercentage: 80,
      maxCoverage: 10000,
      deductible: 100,
      preAuthorization: ''
    });
  };

  // Generate invoice
  const handleGenerateInvoice = () => {
    if (!order) return;

    const invoiceData = {
      invoiceNumber: `INV-${order.id}-${Date.now()}`,
      orderNumber: order.id,
      patient: order.patient,
      items: billingItems,
      subtotal: calculations.subtotal,
      discount: calculations.globalDiscount,
      taxAmount: calculations.taxAmount,
      total: calculations.total,
      insuranceCoverage: calculations.insuranceCoverage,
      patientResponsibility: calculations.patientResponsibility,
      paymentMethod: selectedPaymentMethod,
      notes: notes,
      dateIssued: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'pending',
      facility: 'MediCore Hospital'
    };

    if (onGenerateInvoice) {
      onGenerateInvoice(invoiceData);
    }

    setCurrentStep('payment');
  };

  // Process payment
  const handleProcessPayment = async () => {
    if (!order) return;

    setIsProcessing(true);
    try {
      const paymentData = {
        orderId: order.id,
        invoiceNumber: `INV-${order.id}-${Date.now()}`,
        amount: calculations.patientResponsibility,
        paymentMethod: selectedPaymentMethod,
        paidAmount: paymentAmount,
        remainingBalance: calculations.patientResponsibility - paymentAmount,
        insuranceClaim: insuranceClaim,
        transactionId: `TXN-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: paymentAmount >= calculations.patientResponsibility ? 'paid' : 'partial'
      };

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onProcessPayment) {
        onProcessPayment(paymentData);
      }

      setCurrentStep('confirmation');
      console.log('Payment processed:', paymentData);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t('billing.labBilling')} - {order.id}
          </DialogTitle>
          <DialogDescription>
            {t('billing.labBillingDescription')} - {order.patient?.firstName} {order.patient?.lastName}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          {['billing', 'payment', 'confirmation'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep === step
                    ? 'bg-primary text-primary-foreground'
                    : index < ['billing', 'payment', 'confirmation'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < ['billing', 'payment', 'confirmation'].indexOf(currentStep) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-16 h-1 mx-2 rounded ${
                    index < ['billing', 'payment', 'confirmation'].indexOf(currentStep) ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Billing Step */}
          {currentStep === 'billing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Billing Items */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('billing.billingItems')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {billingItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{item.testName}</h4>
                              <p className="text-sm text-muted-foreground">{item.testCode}</p>
                            </div>
                            <Badge variant="outline">
                              {item.unitPrice} {t('common.currency')}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">{t('billing.quantity')}</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateBillingItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{t('billing.discount')}</Label>
                              <div className="flex gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={item.discount}
                                  onChange={(e) => updateBillingItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                  className="h-8"
                                />
                                <Select
                                  value={item.discountType}
                                  onValueChange={(value: 'percentage' | 'fixed') => 
                                    updateBillingItem(item.id, 'discountType', value)}
                                >
                                  <SelectTrigger className="w-16 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="percentage">%</SelectItem>
                                    <SelectItem value="fixed">{t('common.currency')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-medium">
                              {t('billing.total')}: {item.totalPrice.toFixed(2)} {t('common.currency')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Global Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('billing.additionalCharges')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{t('billing.globalDiscount')}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                        <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">{t('common.currency')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>{t('billing.taxRate')} (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>{t('billing.notes')}</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t('billing.notesPlaceholder')}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary & Insurance */}
              <div className="space-y-4">
                {/* Patient Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('billing.patientInformation')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>{t('patients.name')}:</strong> {order.patient?.firstName} {order.patient?.lastName}</p>
                      <p><strong>{t('patients.medicalNumber')}:</strong> {order.patient?.medicalNumber}</p>
                      {order.patient?.insuranceId && (
                        <p><strong>{t('billing.insuranceId')}:</strong> {order.patient.insuranceId}</p>
                      )}
                      {order.patient?.insuranceProvider && (
                        <p><strong>{t('billing.insuranceProvider')}:</strong> {order.patient.insuranceProvider}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance Setup */}
                {order.patient?.insuranceId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {t('billing.insuranceClaim')}
                        </span>
                        {!insuranceClaim && (
                          <Button size="sm" onClick={setupInsurance}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {insuranceClaim ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">{t('billing.coveragePercentage')}</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={insuranceClaim.coveragePercentage}
                              onChange={(e) => setInsuranceClaim(prev => prev ? 
                                {...prev, coveragePercentage: parseFloat(e.target.value) || 0} : null)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('billing.deductible')}</Label>
                            <Input
                              type="number"
                              min="0"
                              value={insuranceClaim.deductible}
                              onChange={(e) => setInsuranceClaim(prev => prev ? 
                                {...prev, deductible: parseFloat(e.target.value) || 0} : null)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('billing.preAuthorization')}</Label>
                            <Input
                              value={insuranceClaim.preAuthorization || ''}
                              onChange={(e) => setInsuranceClaim(prev => prev ? 
                                {...prev, preAuthorization: e.target.value} : null)}
                              className="h-8"
                              placeholder={t('billing.preAuthPlaceholder')}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t('billing.setupInsurancePrompt')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Billing Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      {t('billing.billingSummary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('billing.subtotal')}:</span>
                        <span>{calculations.subtotal.toFixed(2)} {t('common.currency')}</span>
                      </div>
                      {calculations.globalDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t('billing.discount')}:</span>
                          <span>-{calculations.globalDiscount.toFixed(2)} {t('common.currency')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{t('billing.tax')} ({taxRate}%):</span>
                        <span>{calculations.taxAmount.toFixed(2)} {t('common.currency')}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>{t('billing.total')}:</span>
                        <span>{calculations.total.toFixed(2)} {t('common.currency')}</span>
                      </div>
                      {calculations.insuranceCoverage > 0 && (
                        <>
                          <div className="flex justify-between text-blue-600">
                            <span>{t('billing.insuranceCoverage')}:</span>
                            <span>-{calculations.insuranceCoverage.toFixed(2)} {t('common.currency')}</span>
                          </div>
                          <div className="flex justify-between font-bold text-primary">
                            <span>{t('billing.patientResponsibility')}:</span>
                            <span>{calculations.patientResponsibility.toFixed(2)} {t('common.currency')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('billing.paymentMethod')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.filter(method => method.enabled).map(method => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                            {selectedPaymentMethod === method.id && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{method.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label>{t('billing.paymentAmount')}</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      placeholder={calculations.patientResponsibility.toFixed(2)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('billing.amountDue')}: {calculations.patientResponsibility.toFixed(2)} {t('common.currency')}
                    </p>
                  </div>

                  {selectedPaymentMethod === 'card' && (
                    <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                      <h4 className="font-medium text-sm">{t('billing.cardDetails')}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">{t('billing.cardNumber')}</Label>
                          <Input placeholder="**** **** **** ****" className="h-8" />
                        </div>
                        <div>
                          <Label className="text-xs">{t('billing.expiryDate')}</Label>
                          <Input placeholder="MM/YY" className="h-8" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('billing.paymentSummary')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t('billing.totalAmount')}:</span>
                      <span className="font-medium">{calculations.total.toFixed(2)} {t('common.currency')}</span>
                    </div>
                    {calculations.insuranceCoverage > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>{t('billing.insuranceCoverage')}:</span>
                        <span>-{calculations.insuranceCoverage.toFixed(2)} {t('common.currency')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>{t('billing.amountDue')}:</span>
                      <span>{calculations.patientResponsibility.toFixed(2)} {t('common.currency')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('billing.payingAmount')}:</span>
                      <span className="text-green-600">{paymentAmount.toFixed(2)} {t('common.currency')}</span>
                    </div>
                    {paymentAmount < calculations.patientResponsibility && (
                      <div className="flex justify-between text-orange-600">
                        <span>{t('billing.remainingBalance')}:</span>
                        <span>{(calculations.patientResponsibility - paymentAmount).toFixed(2)} {t('common.currency')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('billing.paymentProcessed')}</h3>
                <p className="text-muted-foreground">{t('billing.paymentSuccessMessage')}</p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('billing.transactionId')}:</span>
                      <span className="font-mono">TXN-{Date.now()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('billing.amountPaid')}:</span>
                      <span>{paymentAmount.toFixed(2)} {t('common.currency')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('billing.paymentMethod')}:</span>
                      <span>{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {currentStep === 'billing' && (
            <>
              <Button variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleGenerateInvoice}>
                <FileText className="h-4 w-4 mr-2" />
                {t('billing.generateInvoice')}
              </Button>
            </>
          )}

          {currentStep === 'payment' && (
            <>
              <Button variant="outline" onClick={() => setCurrentStep('billing')}>
                {t('common.back')}
              </Button>
              <Button 
                onClick={handleProcessPayment}
                disabled={isProcessing || paymentAmount <= 0}
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    {t('billing.processing')}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('billing.processPayment')}
                  </>
                )}
              </Button>
            </>
          )}

          {currentStep === 'confirmation' && (
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('billing.downloadReceipt')}
              </Button>
              <Button onClick={onClose}>
                {t('common.close')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LabBillingIntegration;