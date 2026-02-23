import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  CreditCard,
  Receipt,
  Building,
  Target,
  Download,
  Printer,
  Share,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface FinancialReportsProps {
  userRole: string;
}

export default function FinancialReports({ userRole }: FinancialReportsProps) {
  const { language, t, isRTL } = useLanguage();
  const [reportPeriod, setReportPeriod] = useState('quarterly');
  const [reportType, setReportType] = useState('profit-loss');

  // Financial summary metrics
  const financialSummary = useMemo(() => [
    {
      id: 'total_revenue',
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: '$2,847,320',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'total_expenses',
      title: language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses',
      value: '$1,925,140',
      change: '+12.5%',
      trend: 'up',
      icon: Receipt,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'net_profit',
      title: language === 'ar' ? 'صافي الربح' : 'Net Profit',
      value: '$922,180',
      change: '+28.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'profit_margin',
      title: language === 'ar' ? 'هامش الربح' : 'Profit Margin',
      value: '32.4%',
      change: '+5.3%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ], [language]);

  // Monthly financial data
  const monthlyFinancials = useMemo(() => [
    { 
      month: language === 'ar' ? 'يناير' : 'Jan', 
      revenue: 425000, 
      expenses: 295000, 
      profit: 130000,
      margin: 30.6 
    },
    { 
      month: language === 'ar' ? 'فبراير' : 'Feb', 
      revenue: 460000, 
      expenses: 315000, 
      profit: 145000,
      margin: 31.5 
    },
    { 
      month: language === 'ar' ? 'مارس' : 'Mar', 
      revenue: 485000, 
      expenses: 325000, 
      profit: 160000,
      margin: 33.0 
    },
    { 
      month: language === 'ar' ? 'أبريل' : 'Apr', 
      revenue: 470000, 
      expenses: 318000, 
      profit: 152000,
      margin: 32.3 
    },
    { 
      month: language === 'ar' ? 'مايو' : 'May', 
      revenue: 520000, 
      expenses: 348000, 
      profit: 172000,
      margin: 33.1 
    },
    { 
      month: language === 'ar' ? 'يونيو' : 'Jun', 
      revenue: 487320, 
      expenses: 324140, 
      profit: 163180,
      margin: 33.5 
    }
  ], [language]);

  // Revenue by source
  const revenueBySource = useMemo(() => [
    { 
      source: language === 'ar' ? 'خدمات المرضى الخارجيين' : 'Outpatient Services', 
      amount: 1285000, 
      percentage: 45.1,
      change: '+15.3%'
    },
    { 
      source: language === 'ar' ? 'خدمات المرضى الداخليين' : 'Inpatient Services', 
      amount: 952000, 
      percentage: 33.4,
      change: '+12.8%'
    },
    { 
      source: language === 'ar' ? 'الجراحة' : 'Surgery', 
      amount: 420000, 
      percentage: 14.7,
      change: '+28.5%'
    },
    { 
      source: language === 'ar' ? 'الطوارئ' : 'Emergency Services', 
      amount: 125320, 
      percentage: 4.4,
      change: '+8.2%'
    },
    { 
      source: language === 'ar' ? 'خدمات أخرى' : 'Other Services', 
      amount: 65000, 
      percentage: 2.3,
      change: '+5.1%'
    }
  ], [language]);

  // Expenses breakdown
  const expenseBreakdown = useMemo(() => [
    { 
      category: language === 'ar' ? 'رواتب ومزايا' : 'Salaries & Benefits', 
      amount: 980000, 
      percentage: 50.9,
      budget: 1000000,
      variance: -2.0
    },
    { 
      category: language === 'ar' ? 'المستلزمات الطبية' : 'Medical Supplies', 
      amount: 385000, 
      percentage: 20.0,
      budget: 400000,
      variance: -3.8
    },
    { 
      category: language === 'ar' ? 'المعدات والصيانة' : 'Equipment & Maintenance', 
      amount: 245000, 
      percentage: 12.7,
      budget: 250000,
      variance: -2.0
    },
    { 
      category: language === 'ar' ? 'الخدمات العامة' : 'Utilities', 
      amount: 155140, 
      percentage: 8.1,
      budget: 150000,
      variance: +3.4
    },
    { 
      category: language === 'ar' ? 'إدارية وأخرى' : 'Administrative & Others', 
      amount: 160000, 
      percentage: 8.3,
      budget: 180000,
      variance: -11.1
    }
  ], [language]);

  // Department financial performance
  const departmentFinancials = useMemo(() => [
    {
      department: language === 'ar' ? 'الجراحة' : 'Surgery',
      revenue: 520000,
      expenses: 285000,
      profit: 235000,
      margin: 45.2,
      patients: 156
    },
    {
      department: language === 'ar' ? 'القلب والأوعية' : 'Cardiology',
      revenue: 485000,
      expenses: 275000,
      profit: 210000,
      margin: 43.3,
      patients: 132
    },
    {
      department: language === 'ar' ? 'الأعصاب' : 'Neurology',
      revenue: 385000,
      expenses: 225000,
      profit: 160000,
      margin: 41.6,
      patients: 98
    },
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      revenue: 325000,
      expenses: 285000,
      profit: 40000,
      margin: 12.3,
      patients: 425
    },
    {
      department: language === 'ar' ? 'العظام' : 'Orthopedics',
      revenue: 445000,
      expenses: 248000,
      profit: 197000,
      margin: 44.3,
      patients: 145
    }
  ], [language]);

  // Payment methods distribution
  const paymentMethods = useMemo(() => [
    { method: language === 'ar' ? 'تأمين صحي' : 'Insurance', amount: 1425000, percentage: 50.1 },
    { method: language === 'ar' ? 'دفع مباشر' : 'Direct Pay', amount: 852000, percentage: 29.9 },
    { method: language === 'ar' ? 'حكومي' : 'Government', amount: 425000, percentage: 14.9 },
    { method: language === 'ar' ? 'أخرى' : 'Others', amount: 145320, percentage: 5.1 }
  ], []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const exportFinancialReport = () => {
    console.log('Exporting financial report...');
  };

  const printFinancialReport = () => {
    window.print();
  };

  const shareFinancialReport = () => {
    console.log('Sharing financial report...');
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit-loss">
                {language === 'ar' ? 'الأرباح والخسائر' : 'Profit & Loss'}
              </SelectItem>
              <SelectItem value="cash-flow">
                {language === 'ar' ? 'التدفق النقدي' : 'Cash Flow'}
              </SelectItem>
              <SelectItem value="balance-sheet">
                {language === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet'}
              </SelectItem>
              <SelectItem value="budget-variance">
                {language === 'ar' ? 'انحراف الميزانية' : 'Budget Variance'}
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">
                {language === 'ar' ? 'شهري' : 'Monthly'}
              </SelectItem>
              <SelectItem value="quarterly">
                {language === 'ar' ? 'ربع سنوي' : 'Quarterly'}
              </SelectItem>
              <SelectItem value="annual">
                {language === 'ar' ? 'سنوي' : 'Annual'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportFinancialReport} className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button variant="outline" size="sm" onClick={printFinancialReport} className="gap-2">
            <Printer className="h-4 w-4" />
            {language === 'ar' ? 'طباعة' : 'Print'}
          </Button>
          <Button variant="outline" size="sm" onClick={shareFinancialReport} className="gap-2">
            <Share className="h-4 w-4" />
            {language === 'ar' ? 'مشاركة' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialSummary.map((metric) => (
          <Card key={metric.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{metric.title}</h3>
              <div className="text-2xl font-semibold text-foreground">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Profit Trends */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'اتجاهات الإيرادات والأرباح' : 'Revenue & Profit Trends'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={monthlyFinancials}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#8884d8" 
                name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
              />
              <Bar 
                dataKey="expenses" 
                fill="#ff7300" 
                name={language === 'ar' ? 'المصروفات' : 'Expenses'}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#82ca9d" 
                strokeWidth={3}
                name={language === 'ar' ? 'الربح' : 'Profit'}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Sources & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الإيرادات حسب المصدر' : 'Revenue by Source'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              {revenueBySource.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{source.source}</p>
                      <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${source.amount.toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {source.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'توزيع طرق الدفع' : 'Payment Methods Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, percentage }) => `${method}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'تفصيل المصروفات' : 'Expense Breakdown'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseBreakdown.map((expense, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{expense.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {expense.percentage}% {language === 'ar' ? 'من إجمالي المصروفات' : 'of total expenses'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${expense.amount.toLocaleString()}
                    </p>
                    <Badge 
                      variant={expense.variance < 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {expense.variance > 0 ? '+' : ''}{expense.variance}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'ar' ? 'الميزانية' : 'Budget'}: ${expense.budget.toLocaleString()}</span>
                    <span>{expense.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${expense.variance < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Financial Performance */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'الأداء المالي للأقسام' : 'Department Financial Performance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2">
                    {language === 'ar' ? 'القسم' : 'Department'}
                  </th>
                  <th className="text-right p-2">
                    {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                  </th>
                  <th className="text-right p-2">
                    {language === 'ar' ? 'المصروفات' : 'Expenses'}
                  </th>
                  <th className="text-right p-2">
                    {language === 'ar' ? 'الربح' : 'Profit'}
                  </th>
                  <th className="text-right p-2">
                    {language === 'ar' ? 'هامش الربح' : 'Margin'}
                  </th>
                  <th className="text-right p-2">
                    {language === 'ar' ? 'المرضى' : 'Patients'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentFinancials.map((dept, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-2 font-medium">{dept.department}</td>
                    <td className="p-2 text-right">${dept.revenue.toLocaleString()}</td>
                    <td className="p-2 text-right">${dept.expenses.toLocaleString()}</td>
                    <td className="p-2 text-right text-green-600 font-semibold">
                      ${dept.profit.toLocaleString()}
                    </td>
                    <td className="p-2 text-right">
                      <Badge variant="outline">{dept.margin}%</Badge>
                    </td>
                    <td className="p-2 text-right">{dept.patients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Report */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'ملخص التقرير المالي' : 'Financial Report Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-muted-foreground">
            {language === 'ar' ? (
              <div className="space-y-3">
                <p>
                  يُظهر التقرير المالي أداءً استثنائياً للمستشفى خلال الفترة المحددة، حيث حققت الإيرادات نمواً قوياً بنسبة 18.2%
                  لتصل إلى 2.8 مليون دولار، مدفوعة بنمو خدمات المرضى الخارجيين والجراحة.
                </p>
                <p>
                  ارتفع صافي الربح بنسبة مذهلة 28.7% ليصل إلى 922,180 دولار، مما يعكس تحسناً في الكفاءة التشغيلية وإدارة التكاليف.
                  هامش الربح الحالي 32.4% يضع المستشفى في موقع مالي قوي مقارنة بمعايير الصناعة.
                </p>
                <p>
                  تُظهر أقسام الجراحة والقلب أفضل أداء مالي بهوامش ربح تتجاوز 40%، بينما يحتاج قسم الطوارئ إلى مراجعة هيكل التكلفة
                  لتحسين الربحية. يُنصح بتعزيز الاستثمار في الخدمات عالية القيمة والحد من الهدر في المصروفات الإدارية.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  The financial report demonstrates exceptional hospital performance during the specified period, with revenue achieving
                  strong growth of 18.2% reaching $2.8 million, driven by outpatient services and surgery growth.
                </p>
                <p>
                  Net profit increased by an impressive 28.7% to $922,180, reflecting improved operational efficiency and cost management.
                  The current profit margin of 32.4% positions the hospital in a strong financial position compared to industry benchmarks.
                </p>
                <p>
                  Surgery and Cardiology departments show the best financial performance with profit margins exceeding 40%, while
                  Emergency needs cost structure review to improve profitability. Investment in high-value services and reducing
                  administrative waste is recommended.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}