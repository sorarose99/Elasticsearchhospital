import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Play, Square, BarChart3 } from 'lucide-react';
import { useTheme } from '../../services/ThemeService';
import { useLanguage } from '../../services/LanguageService';

interface ColorStabilityResult {
  component: string;
  componentAr: string;
  cssProperty: string;
  expectedValue: string;
  actualValue: string;
  isStable: boolean;
  timestamp: number;
}

const ColorStabilityTest: React.FC = () => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ColorStabilityResult[]>([]);
  const [testCount, setTestCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testComponents = [
    {
      component: 'Sidebar',
      componentAr: 'الشريط الجانبي',
      selector: '[data-slot="sidebar"]',
      cssProperty: 'background-color',
      expectedLight: 'var(--sidebar-solid)',
      expectedDark: 'var(--sidebar-solid)'
    },
    {
      component: 'TopBar',
      componentAr: 'الشريط العلوي',
      selector: '[data-slot="topbar"]',
      cssProperty: 'background',
      expectedLight: 'var(--topbar)',
      expectedDark: 'var(--topbar)'
    },
    {
      component: 'Sidebar Text',
      componentAr: 'نص الشريط الجانبي',
      selector: '[data-slot="sidebar"] button',
      cssProperty: 'color',
      expectedLight: 'var(--sidebar-foreground)',
      expectedDark: 'var(--sidebar-foreground)'
    },
    {
      component: 'Navigation Item Active',
      componentAr: 'عنصر التنقل النشط',
      selector: '[data-slot="sidebar"] .navigation-item.active',
      cssProperty: 'background-color',
      expectedLight: 'var(--sidebar-accent)',
      expectedDark: 'var(--sidebar-accent)'
    },
    {
      component: 'Main Content',
      componentAr: 'المحتوى الرئيسي',
      selector: 'main',
      cssProperty: 'background-color',
      expectedLight: 'var(--background)',
      expectedDark: 'var(--background)'
    },
    {
      component: 'Card Background',
      componentAr: 'خلفية البطاقة',
      selector: '.bg-card',
      cssProperty: 'background-color',
      expectedLight: 'var(--card)',
      expectedDark: 'var(--card)'
    },
    {
      component: 'Primary Button',
      componentAr: 'الزر الأساسي',
      selector: '[data-variant="default"]',
      cssProperty: 'background-color',
      expectedLight: 'var(--primary)',
      expectedDark: 'var(--primary)'
    },
    {
      component: 'Text Foreground',
      componentAr: 'لون النص',
      selector: '.text-foreground',
      cssProperty: 'color',
      expectedLight: 'var(--foreground)',
      expectedDark: 'var(--foreground)'
    }
  ];

  const checkColorStability = async (): Promise<ColorStabilityResult[]> => {
    const results: ColorStabilityResult[] = [];
    
    for (const test of testComponents) {
      try {
        const element = document.querySelector(test.selector);
        if (!element) {
          results.push({
            component: test.component,
            componentAr: test.componentAr,
            cssProperty: test.cssProperty,
            expectedValue: effectiveTheme === 'dark' ? test.expectedDark : test.expectedLight,
            actualValue: 'Element not found',
            isStable: false,
            timestamp: Date.now()
          });
          continue;
        }

        const computedStyle = window.getComputedStyle(element);
        const actualValue = computedStyle.getPropertyValue(test.cssProperty);
        const expectedValue = effectiveTheme === 'dark' ? test.expectedDark : test.expectedLight;
        
        // Get the resolved CSS custom property value
        const resolvedExpected = getComputedStyle(document.documentElement)
          .getPropertyValue(expectedValue.replace('var(--', '').replace(')', ''))
          .trim();

        const isStable = actualValue.trim() !== '' && 
                        (actualValue === resolvedExpected || 
                         actualValue.includes(resolvedExpected) ||
                         resolvedExpected.includes(actualValue.split(' ')[0]));

        results.push({
          component: test.component,
          componentAr: test.componentAr,
          cssProperty: test.cssProperty,
          expectedValue: expectedValue,
          actualValue: actualValue || 'No value',
          isStable,
          timestamp: Date.now()
        });
      } catch (error) {
        results.push({
          component: test.component,
          componentAr: test.componentAr,
          cssProperty: test.cssProperty,
          expectedValue: effectiveTheme === 'dark' ? test.expectedDark : test.expectedLight,
          actualValue: `Error: ${error}`,
          isStable: false,
          timestamp: Date.now()
        });
      }
    }

    return results;
  };

  const runSingleTest = async () => {
    const testResults = await checkColorStability();
    setResults(testResults);
    setTestCount(prev => prev + 1);
  };

  const startContinuousTest = () => {
    setIsRunning(true);
    setProgress(0);
    
    intervalRef.current = setInterval(async () => {
      await runSingleTest();
      setProgress(prev => {
        if (prev >= 100) {
          stopTest();
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const stopTest = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stableCount = results.filter(r => r.isStable).length;
  const totalCount = results.length;
  const stabilityPercentage = totalCount > 0 ? Math.round((stableCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? 'اختبار استقرار الألوان' : 'Color Stability Test'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'مراقبة استقرار الألوان في المكونات المختلفة'
              : 'Monitor color consistency across different components'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={toggleTheme} disabled={isRunning}>
            {language === 'ar' ? 'تغيير المظهر' : 'Toggle Theme'}
          </Button>
          {!isRunning ? (
            <Button onClick={startContinuousTest}>
              <Play className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'بدء الاختبار' : 'Start Test'}
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopTest}>
              <Square className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إيقاف الاختبار' : 'Stop Test'}
            </Button>
          )}
          <Button variant="secondary" onClick={runSingleTest} disabled={isRunning}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'اختبار واحد' : 'Single Test'}
          </Button>
        </div>
      </div>

      {/* Test Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'معدل الاستقرار' : 'Stability Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {stabilityPercentage}%
            </div>
            <div className="text-sm text-muted-foreground">
              {stableCount} / {totalCount} {language === 'ar' ? 'مستقر' : 'stable'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {language === 'ar' ? 'عدد الاختبارات' : 'Test Runs'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{testCount}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'ar' ? 'مرة اختبار' : 'test runs'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {language === 'ar' ? 'المظهر الحالي' : 'Current Theme'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={effectiveTheme === 'dark' ? 'secondary' : 'default'} className="text-sm">
              {effectiveTheme === 'dark' 
                ? (language === 'ar' ? 'داكن' : 'Dark')
                : (language === 'ar' ? 'فاتح' : 'Light')
              }
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {language === 'ar' ? 'تقدم الاختبار' : 'Test Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <div className="mt-2 text-sm text-muted-foreground">
              {language === 'ar' 
                ? `جاري تشغيل الاختبارات... ${progress}%`
                : `Running tests... ${progress}%`
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {language === 'ar' ? 'نتائج الاختبار' : 'Test Results'}
          </h3>
          
          {stabilityPercentage < 100 && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {language === 'ar' 
                  ? `تم العثور على ${totalCount - stableCount} مشكلة في استقرار الألوان. يرجى مراجعة النتائج أدناه.`
                  : `Found ${totalCount - stableCount} color stability issues. Please review the results below.`
                }
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result, index) => (
              <Card key={index} className={!result.isStable ? 'border-red-200 dark:border-red-800' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {language === 'ar' ? result.componentAr : result.component}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {result.isStable ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <Badge variant={result.isStable ? 'default' : 'destructive'}>
                        {result.isStable 
                          ? (language === 'ar' ? 'مستقر' : 'Stable')
                          : (language === 'ar' ? 'غير مستقر' : 'Unstable')
                        }
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {result.cssProperty}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'القيمة المتوقعة:' : 'Expected:'}
                      </span>
                      <br />
                      <code className="text-xs bg-muted px-1 rounded">
                        {result.expectedValue}
                      </code>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'القيمة الفعلية:' : 'Actual:'}
                      </span>
                      <br />
                      <code className="text-xs bg-muted px-1 rounded">
                        {result.actualValue}
                      </code>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'وقت الاختبار:' : 'Tested at:'}{' '}
                      {new Date(result.timestamp).toLocaleTimeString(
                        language === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips and Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'نصائح للحفاظ على استقرار الألوان' : 'Color Stability Best Practices'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {language === 'ar' ? (
              <ul className="space-y-1">
                <li>• استخدم متغيرات CSS المخصصة بدلاً من القيم المباشرة</li>
                <li>• تأكد من تطبيق فئات Tailwind الصحيحة</li>
                <li>• اختبر في كلا المظهرين الفاتح والداكن</li>
                <li>• استخدم data-slot للمكونات لتطبيق الأنماط المحددة</li>
                <li>• تجنب استخدام !important إلا عند الضرورة القصوى</li>
              </ul>
            ) : (
              <ul className="space-y-1">
                <li>• Use CSS custom properties instead of hardcoded values</li>
                <li>• Ensure proper Tailwind classes are applied</li>
                <li>• Test in both light and dark themes</li>
                <li>• Use data-slot attributes for component-specific styling</li>
                <li>• Avoid !important unless absolutely necessary</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorStabilityTest;