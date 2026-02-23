import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Eye, Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../services/ThemeService';
import { useLanguage } from '../../services/LanguageService';

interface ColorTest {
  name: string;
  nameAr: string;
  background: string;
  foreground: string;
  description: string;
  descriptionAr: string;
}

const ColorContrastTest: React.FC = () => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const [contrastResults, setContrastResults] = useState<Array<ColorTest & { contrast: number; wcagLevel: string }>>([]);

  const colorTests: ColorTest[] = [
    {
      name: 'Sidebar Background',
      nameAr: 'خلفية الشريط الجانبي',
      background: 'var(--sidebar-solid)',
      foreground: 'var(--sidebar-foreground)',
      description: 'Main sidebar background with text',
      descriptionAr: 'خلفية الشريط الجانبي الرئيسي مع النص'
    },
    {
      name: 'Sidebar Accent',
      nameAr: 'تمييز الشريط الجانبي',
      background: 'var(--sidebar-accent)',
      foreground: 'var(--sidebar-accent-foreground)',
      description: 'Sidebar accent color for hover states',
      descriptionAr: 'لون التمييز للشريط الجانبي عند التمرير'
    },
    {
      name: 'Primary Button',
      nameAr: 'الزر الأساسي',
      background: 'var(--primary)',
      foreground: 'var(--primary-foreground)',
      description: 'Primary action button',
      descriptionAr: 'زر الإجراء الأساسي'
    },
    {
      name: 'Card Background',
      nameAr: 'خلفية البطاقة',
      background: 'var(--card)',
      foreground: 'var(--card-foreground)',
      description: 'Card component background',
      descriptionAr: 'خلفية مكون البطاقة'
    },
    {
      name: 'Success State',
      nameAr: 'حالة النجاح',
      background: 'var(--success)',
      foreground: 'var(--success-foreground)',
      description: 'Success indicators and messages',
      descriptionAr: 'مؤشرات ورسائل النجاح'
    },
    {
      name: 'Warning State',
      nameAr: 'حالة التحذير',
      background: 'var(--warning)',
      foreground: 'var(--warning-foreground)',
      description: 'Warning indicators and messages',
      descriptionAr: 'مؤشرات ورسائل التحذير'
    },
    {
      name: 'Error State',
      nameAr: 'حالة الخطأ',
      background: 'var(--destructive)',
      foreground: 'var(--destructive-foreground)',
      description: 'Error indicators and messages',
      descriptionAr: 'مؤشرات ورسائل الخطأ'
    }
  ];

  // Calculate contrast ratio using relative luminance
  const getLuminance = (color: string): number => {
    // Simple approximation - in a real app you'd use a proper color parser
    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue(color.replace('var(--', '').replace(')', ''))
      .trim();
    
    // For CSS custom properties, we'll use a simplified approach
    if (rgb.startsWith('#')) {
      const r = parseInt(rgb.slice(1, 3), 16) / 255;
      const g = parseInt(rgb.slice(3, 5), 16) / 255;
      const b = parseInt(rgb.slice(5, 7), 16) / 255;
      
      const sRGB = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    }
    
    // Fallback for oklch colors - simplified
    return effectiveTheme === 'dark' ? 0.1 : 0.9;
  };

  const calculateContrast = (bg: string, fg: string): number => {
    const bgLum = getLuminance(bg);
    const fgLum = getLuminance(fg);
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const getWCAGLevel = (contrast: number): string => {
    if (contrast >= 7) return 'AAA';
    if (contrast >= 4.5) return 'AA';
    if (contrast >= 3) return 'AA Large';
    return 'Fail';
  };

  const getContrastIcon = (level: string) => {
    switch (level) {
      case 'AAA':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'AA':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'AA Large':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'default';
      case 'AA':
        return 'secondary';
      case 'AA Large':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  useEffect(() => {
    const results = colorTests.map(test => {
      const contrast = calculateContrast(test.background, test.foreground);
      const wcagLevel = getWCAGLevel(contrast);
      return {
        ...test,
        contrast,
        wcagLevel
      };
    });
    setContrastResults(results);
  }, [effectiveTheme]);

  const passedTests = contrastResults.filter(r => r.wcagLevel !== 'Fail').length;
  const totalTests = contrastResults.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{language === 'ar' ? 'اختبار التباين والألوان' : 'Color Contrast Test'}</h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'تحقق من إمكانية الوصول والتباين للألوان في النظام'
              : 'Check accessibility and contrast levels for system colors'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={toggleTheme}>
            {effectiveTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {language === 'ar' ? 'تغيير المظهر' : 'Toggle Theme'}
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>{language === 'ar' ? 'نتيجة إمكانية الوصول' : 'Accessibility Score'}</span>
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? `${passedTests} من ${totalTests} اختبار نجح في معايير الوصول`
              : `${passedTests} out of ${totalTests} tests pass accessibility standards`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(passedTests / totalTests) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {Math.round((passedTests / totalTests) * 100)}% {language === 'ar' ? 'نسبة النجاح' : 'Pass Rate'}
          </div>
        </CardContent>
      </Card>

      {/* WCAG Guidelines */}
      <Alert>
        <Palette className="w-4 h-4" />
        <AlertDescription>
          {language === 'ar' ? (
            <div>
              <strong>معايير WCAG للتباين:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>AAA:</strong> 7:1 أو أعلى - ممتاز للأشخاص ذوي الإعاقة البصرية</li>
                <li>• <strong>AA:</strong> 4.5:1 أو أعلى - معيار قياسي للنص العادي</li>
                <li>• <strong>AA Large:</strong> 3:1 أو أعلى - للنصوص الكبيرة (18pt+)</li>
                <li>• <strong>فشل:</strong> أقل من 3:1 - لا يلبي معايير الوصول</li>
              </ul>
            </div>
          ) : (
            <div>
              <strong>WCAG Contrast Standards:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>AAA:</strong> 7:1 or higher - Excellent for visually impaired users</li>
                <li>• <strong>AA:</strong> 4.5:1 or higher - Standard for normal text</li>
                <li>• <strong>AA Large:</strong> 3:1 or higher - For large text (18pt+)</li>
                <li>• <strong>Fail:</strong> Below 3:1 - Does not meet accessibility standards</li>
              </ul>
            </div>
          )}
        </AlertDescription>
      </Alert>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contrastResults.map((result, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {language === 'ar' ? result.nameAr : result.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getContrastIcon(result.wcagLevel)}
                  <Badge variant={getBadgeVariant(result.wcagLevel)}>
                    {result.wcagLevel}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {language === 'ar' ? result.descriptionAr : result.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="p-4 rounded-lg border-2 border-dashed"
                  style={{
                    backgroundColor: result.background,
                    color: result.foreground,
                    borderColor: 'currentColor'
                  }}
                >
                  <p className="font-medium">
                    {language === 'ar' ? 'نموذج النص' : 'Sample Text'}
                  </p>
                  <p className="text-sm opacity-90">
                    {language === 'ar' 
                      ? 'هذا مثال على كيفية ظهور النص بهذه الألوان'
                      : 'This is how text appears with these colors'
                    }
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'نسبة التباين:' : 'Contrast Ratio:'}
                  </span>
                  <span className="font-mono">
                    {result.contrast.toFixed(2)}:1
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Theme Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'عرض المظاهر' : 'Theme Showcase'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'تحقق من كيفية ظهور المكونات في المظاهر المختلفة'
              : 'See how components appear in different themes'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="default" size="sm">
                {language === 'ar' ? 'أساسي' : 'Primary'}
              </Button>
              <Button variant="secondary" size="sm">
                {language === 'ar' ? 'ثانوي' : 'Secondary'}
              </Button>
              <Button variant="outline" size="sm">
                {language === 'ar' ? 'محدد' : 'Outline'}
              </Button>
              <Button variant="ghost" size="sm">
                {language === 'ar' ? 'شفاف' : 'Ghost'}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="default">{language === 'ar' ? 'افتراضي' : 'Default'}</Badge>
              <Badge variant="secondary">{language === 'ar' ? 'ثانوي' : 'Secondary'}</Badge>
              <Badge variant="outline">{language === 'ar' ? 'محدد' : 'Outline'}</Badge>
              <Badge variant="destructive">{language === 'ar' ? 'خطر' : 'Destructive'}</Badge>
            </div>

            <div className="space-y-2">
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  {language === 'ar' ? 'رسالة معلوماتية عادية' : 'Normal info alert message'}
                </AlertDescription>
              </Alert>
              
              <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {language === 'ar' ? 'رسالة تحذير هامة' : 'Important warning message'}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorContrastTest;