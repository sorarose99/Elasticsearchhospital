import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  Crown, 
  Clock, 
  Users, 
  Database, 
  X,
  CheckCircle,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSubscriptionCheck } from '../hooks/useSubscriptionCheck';
import { paddleService } from '../services/PaddleService';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  action?: 'add_patient' | 'add_user' | 'upload_file';
  showWarnings?: boolean;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  action,
  showWarnings = true,
}) => {
  const { user } = useSupabaseAuth();
  const {
    subscription,
    isSubscriptionActive,
    isInTrial,
    isPastDue,
    daysUntilExpiry,
    limits,
    upgradeSuggestions,
    canPerformAction,
    statusDisplay,
  } = useSubscriptionCheck();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Check if action is blocked
  const actionCheck = action ? canPerformAction(action) : { allowed: true };

  const handleUpgrade = async (planId: string) => {
    if (!user?.hospitalId) return;

    try {
      setUpgrading(true);
      const checkoutData = await paddleService.createCheckout(planId, user.id, user.hospitalId);
      paddleService.redirectToCheckout(checkoutData.checkoutUrl);
    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setUpgrading(false);
    }
  };

  // Show blocking modal if action is not allowed
  if (action && !actionCheck.allowed) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              إجراء غير مسموح
            </DialogTitle>
            <DialogDescription>
              {actionCheck.reason}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {upgradeSuggestions.suggestedPlan && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">ترقية مقترحة</h4>
                <p className="text-sm text-blue-600 mb-3">
                  قم بالترقية إلى خطة أعلى للاستمرار في استخدام هذه الميزة
                </p>
                <Button 
                  onClick={() => handleUpgrade(upgradeSuggestions.suggestedPlan!)}
                  disabled={upgrading}
                  className="w-full"
                >
                  <Crown className="h-4 w-4 ml-2" />
                  ترقية الآن
                </Button>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="relative">
      {/* Subscription Status Warnings */}
      {showWarnings && (
        <AnimatePresence>
          {/* Past Due Warning */}
          {isPastDue && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>تحذير:</strong> اشتراكك متأخر السداد. يرجى تحديث طريقة الدفع لتجنب إيقاف الخدمة.
                  <Button variant="link" className="p-0 h-auto text-red-600 underline mr-2">
                    تحديث الدفع
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Trial Expiring Warning */}
          {isInTrial && daysUntilExpiry <= 7 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert className="border-orange-200 bg-orange-50">
                <Clock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  تنتهي فترتك التجريبية خلال {daysUntilExpiry} أيام. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-orange-600 underline mr-2"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    اختر خطة اشتراك
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Usage Warnings */}
          {limits.warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="space-y-1">
                    {limits.warnings.map((warning, index) => (
                      <div key={index}>• {warning}</div>
                    ))}
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-yellow-600 underline mr-2"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    ترقية الخطة
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* No Active Subscription */}
          {!isSubscriptionActive && !isInTrial && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert className="border-red-200 bg-red-50">
                <X className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  لا يوجد اشتراك نشط. بعض الميزات قد تكون محدودة أو غير متاحة.
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-red-600 underline mr-2"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    تفعيل الاشتراك
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main Content */}
      {children}

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              ترقية الاشتراك
            </DialogTitle>
            <DialogDescription>
              اختر الخطة المناسبة لاحتياجات عيادتك
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Status */}
            {subscription && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">الخطة الحالية</h4>
                    <p className="text-sm text-gray-600">
                      {subscription.plan?.name || 'غير محدد'}
                    </p>
                  </div>
                  <Badge variant={statusDisplay.variant}>
                    {statusDisplay.label}
                  </Badge>
                </div>
              </div>
            )}

            {/* Upgrade Recommendations */}
            {upgradeSuggestions.shouldUpgrade && (
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600">مشاكل يجب حلها:</h4>
                <div className="space-y-2">
                  {upgradeSuggestions.reasons.map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Upgrade Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgradeSuggestions.suggestedPlan === 'professional' && (
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Professional</CardTitle>
                    <CardDescription>الأكثر شعبية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold text-blue-600">$299/شهر</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        حتى 1000 مريض
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        حتى 15 مستخدم
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        تخزين 50GB
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleUpgrade('professional')}
                      disabled={upgrading}
                    >
                      <ArrowUp className="h-4 w-4 ml-2" />
                      ترقية الآن
                    </Button>
                  </CardContent>
                </Card>
              )}

              {upgradeSuggestions.suggestedPlan === 'enterprise' && (
                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Enterprise</CardTitle>
                    <CardDescription>للمؤسسات الكبيرة</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold text-purple-600">$599/شهر</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        مرضى غير محدودين
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        مستخدمين غير محدودين
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        تخزين 500GB
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleUpgrade('enterprise')}
                      disabled={upgrading}
                    >
                      <ArrowUp className="h-4 w-4 ml-2" />
                      ترقية الآن
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
              >
                إلغاء
              </Button>
              <Button 
                variant="link"
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Navigate to full subscription management page
                  window.location.href = '/subscription';
                }}
              >
                عرض جميع الخطط
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};