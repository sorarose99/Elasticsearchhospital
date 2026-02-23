import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useMenuCustomization } from '../../services/MenuCustomizationService';

interface MenuTranslationRepairProps {
  language: 'en' | 'ar';
}

export const MenuTranslationRepair: React.FC<MenuTranslationRepairProps> = ({ language }) => {
  const { repairMenuTranslations, resetToDefault } = useMenuCustomization();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleRepair = () => {
    try {
      repairMenuTranslations();
      setStatus('success');
      setMessage(language === 'ar' 
        ? 'تم إصلاح ترجمات القائمة بنجاح. يرجى تحديث الصفحة لرؤية التغييرات.'
        : 'Menu translations repaired successfully. Please refresh the page to see changes.'
      );
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(language === 'ar' 
        ? 'فشل إصلاح الترجمات. يرجى المحاولة مرة أخرى.'
        : 'Failed to repair translations. Please try again.'
      );
    }
  };

  const handleReset = () => {
    try {
      resetToDefault();
      setStatus('success');
      setMessage(language === 'ar' 
        ? 'تم إعادة تعيين القائمة إلى الإعدادات الافتراضية بنجاح. يرجى تحديث الصفحة.'
        : 'Menu reset to default settings successfully. Please refresh the page.'
      );
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(language === 'ar' 
        ? 'فشلت إعادة التعيين. يرجى المحاولة مرة أخرى.'
        : 'Reset failed. Please try again.'
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          {language === 'ar' ? 'إصلاح ترجمات القائمة' : 'Menu Translation Repair'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'إذا كانت القائمة تعرض لغة واحدة فقط أو تفتقد الترجمات، استخدم هذه الأدوات لإصلاحها.'
            : 'If your menu is showing only one language or missing translations, use these tools to fix it.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status !== 'idle' && (
          <Alert variant={status === 'success' ? 'default' : 'destructive'}>
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Button 
              onClick={handleRepair}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إصلاح الترجمات' : 'Repair Translations'}
            </Button>
            <div className="flex-1 text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'يحافظ على تخصيصاتك ويضيف الترجمات المفقودة فقط'
                : 'Keeps your customizations and adds missing translations only'
              }
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إعادة تعيين إلى الافتراضي' : 'Reset to Default'}
            </Button>
            <div className="flex-1 text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'يعيد تعيين القائمة بالكامل إلى الإعدادات الافتراضية (يحذف التخصيصات)'
                : 'Resets entire menu to default settings (removes customizations)'
              }
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {language === 'ar' 
              ? 'ملاحظة: بعد استخدام أي من هذه الأدوات، يرجى تحديث الصفحة (F5) لرؤية التغييرات.'
              : 'Note: After using either tool, please refresh the page (F5) to see the changes.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
