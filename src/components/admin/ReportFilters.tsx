import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { 
  CalendarIcon,
  Filter,
  X,
  RotateCcw,
  Save,
  Clock,
  Users,
  Building2,
  Tag,
  FileText
} from 'lucide-react';
import { ReportFilter } from '../../services/ReportService';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { format } from 'date-fns';

interface ReportFiltersProps {
  filters: ReportFilter;
  onFiltersChange: (filters: ReportFilter) => void;
  reportType: 'system' | 'patient' | 'financial' | 'staff' | 'operational';
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSaveTemplate?: (template: any) => void;
  className?: string;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFiltersChange,
  reportType,
  onApplyFilters,
  onResetFilters,
  onSaveTemplate,
  className = ''
}) => {
  const { t, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState<'from' | 'to'>('from');
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  // Quick date range options
  const quickRanges = [
    { label: t('reports.today'), days: 0 },
    { label: t('reports.yesterday'), days: 1, offset: 1 },
    { label: t('reports.last7Days'), days: 7 },
    { label: t('reports.last30Days'), days: 30 },
    { label: t('reports.last90Days'), days: 90 },
    { label: t('reports.thisMonth'), type: 'month' },
    { label: t('reports.lastMonth'), type: 'lastMonth' },
    { label: t('reports.thisYear'), type: 'year' },
    { label: t('reports.custom'), type: 'custom' }
  ];

  // Department options based on report type
  const getDepartmentOptions = () => {
    const commonDepts = [
      { value: 'all', label: t('common.allDepartments') },
      { value: 'medicine', label: t('departments.medicine') },
      { value: 'surgery', label: t('departments.surgery') },
      { value: 'emergency', label: t('departments.emergency') },
      { value: 'pediatrics', label: t('departments.pediatrics') },
      { value: 'cardiology', label: t('departments.cardiology') },
      { value: 'neurology', label: t('departments.neurology') },
      { value: 'orthopedics', label: t('departments.orthopedics') },
      { value: 'radiology', label: t('departments.radiology') },
      { value: 'laboratory', label: t('departments.laboratory') },
      { value: 'pharmacy', label: t('departments.pharmacy') },
      { value: 'nursing', label: t('departments.nursing') },
      { value: 'administration', label: t('departments.administration') }
    ];

    return commonDepts;
  };

  // Category options based on report type
  const getCategoryOptions = () => {
    switch (reportType) {
      case 'system':
        return [
          { value: 'all', label: t('reports.allCategories') },
          { value: 'performance', label: t('reports.performance') },
          { value: 'security', label: t('reports.security') },
          { value: 'usage', label: t('reports.usage') },
          { value: 'errors', label: t('reports.errors') },
          { value: 'maintenance', label: t('reports.maintenance') }
        ];
      case 'patient':
        return [
          { value: 'all', label: t('reports.allCategories') },
          { value: 'demographics', label: t('reports.demographics') },
          { value: 'visits', label: t('reports.visits') },
          { value: 'conditions', label: t('reports.conditions') },
          { value: 'outcomes', label: t('reports.outcomes') },
          { value: 'satisfaction', label: t('reports.satisfaction') }
        ];
      case 'financial':
        return [
          { value: 'all', label: t('reports.allCategories') },
          { value: 'revenue', label: t('reports.revenue') },
          { value: 'expenses', label: t('reports.expenses') },
          { value: 'billing', label: t('reports.billing') },
          { value: 'insurance', label: t('reports.insurance') },
          { value: 'collections', label: t('reports.collections') }
        ];
      case 'staff':
        return [
          { value: 'all', label: t('reports.allCategories') },
          { value: 'performance', label: t('reports.performance') },
          { value: 'attendance', label: t('reports.attendance') },
          { value: 'productivity', label: t('reports.productivity') },
          { value: 'training', label: t('reports.training') },
          { value: 'satisfaction', label: t('reports.satisfaction') }
        ];
      case 'operational':
        return [
          { value: 'all', label: t('reports.allCategories') },
          { value: 'efficiency', label: t('reports.efficiency') },
          { value: 'quality', label: t('reports.quality') },
          { value: 'safety', label: t('reports.safety') },
          { value: 'capacity', label: t('reports.capacity') },
          { value: 'workflow', label: t('reports.workflow') }
        ];
      default:
        return [{ value: 'all', label: t('reports.allCategories') }];
    }
  };

  // Status options based on report type
  const getStatusOptions = () => {
    const commonStatuses = [
      { value: 'all', label: t('common.allStatuses') },
      { value: 'active', label: t('common.active') },
      { value: 'inactive', label: t('common.inactive') },
      { value: 'pending', label: t('common.pending') },
      { value: 'completed', label: t('common.completed') },
      { value: 'cancelled', label: t('common.cancelled') }
    ];

    return commonStatuses;
  };

  // Handle quick date range selection
  const handleQuickRange = (range: any) => {
    const now = new Date();
    let fromDate: Date;
    let toDate: Date = now;

    switch (range.type) {
      case 'month':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        toDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'year':
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        return; // Don't change dates for custom
      default:
        if (range.offset) {
          fromDate = new Date(now.getTime() - (range.days + range.offset) * 24 * 60 * 60 * 1000);
          toDate = new Date(now.getTime() - range.offset * 24 * 60 * 60 * 1000);
        } else {
          fromDate = new Date(now.getTime() - range.days * 24 * 60 * 60 * 1000);
        }
    }

    const updatedFilters = {
      ...filters,
      dateRange: {
        from: fromDate.toISOString(),
        to: toDate.toISOString()
      }
    };

    onFiltersChange(updatedFilters);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const updatedFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [selectedDateType]: date.toISOString()
      }
    };

    onFiltersChange(updatedFilters);
    setIsCalendarOpen(false);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ReportFilter, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    onFiltersChange(updatedFilters);
  };

  // Handle custom filter change
  const handleCustomFilterChange = (key: string, value: any) => {
    const updatedFilters = {
      ...filters,
      customFilters: {
        ...filters.customFilters,
        [key]: value
      }
    };
    onFiltersChange(updatedFilters);
  };

  // Save filter template
  const handleSaveTemplate = () => {
    if (!templateName.trim() || !onSaveTemplate) return;

    const template = {
      id: `template-${Date.now()}`,
      name: templateName,
      type: reportType,
      filters,
      createdAt: new Date().toISOString()
    };

    onSaveTemplate(template);
    setTemplateName('');
    setShowSaveTemplate(false);
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'dd/MM/yyyy');
    } catch {
      return '';
    }
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.department && filters.department !== 'all') count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.priority && filters.priority !== 'all') count++;
    if (filters.customFilters) {
      count += Object.values(filters.customFilters).filter(v => v && v !== 'all').length;
    }
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('reports.filters')}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {t('reports.filtersDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('common.reset')}
            </Button>
            
            {onSaveTemplate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {t('reports.saveTemplate')}
              </Button>
            )}
          </div>
        </div>

        {/* Save Template Form */}
        {showSaveTemplate && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
            <Input
              placeholder={t('reports.templateName')}
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleSaveTemplate}
              disabled={!templateName.trim()}
            >
              {t('common.save')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSaveTemplate(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Date Range Filter */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {t('reports.dateRange')}
          </Label>
          
          {/* Quick Range Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {quickRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickRange(range)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                {t('reports.fromDate')}
              </Label>
              <Popover open={isCalendarOpen && selectedDateType === 'from'} onOpenChange={(open) => {
                setIsCalendarOpen(open);
                if (open) setSelectedDateType('from');
              }}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(filters.dateRange.from) || t('reports.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(filters.dateRange.from)}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                {t('reports.toDate')}
              </Label>
              <Popover open={isCalendarOpen && selectedDateType === 'to'} onOpenChange={(open) => {
                setIsCalendarOpen(open);
                if (open) setSelectedDateType('to');
              }}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(filters.dateRange.to) || t('reports.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(filters.dateRange.to)}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Standard Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Department Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t('reports.department')}
            </Label>
            <Select
              value={filters.department || 'all'}
              onValueChange={(value) => handleFilterChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getDepartmentOptions().map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {t('reports.category')}
            </Label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('common.status')}
            </Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions().map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('reports.priority')}
            </Label>
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allPriorities')}</SelectItem>
                <SelectItem value="low">{t('common.low')}</SelectItem>
                <SelectItem value="normal">{t('common.normal')}</SelectItem>
                <SelectItem value="high">{t('common.high')}</SelectItem>
                <SelectItem value="critical">{t('common.critical')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Type Specific Filters */}
        {reportType === 'financial' && (
          <div className="space-y-3">
            <Label className="font-medium">{t('reports.financialFilters')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">{t('reports.paymentMethod')}</Label>
                <Select
                  value={filters.customFilters?.paymentMethod || 'all'}
                  onValueChange={(value) => handleCustomFilterChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reports.allMethods')}</SelectItem>
                    <SelectItem value="cash">{t('billing.cash')}</SelectItem>
                    <SelectItem value="card">{t('billing.creditCard')}</SelectItem>
                    <SelectItem value="insurance">{t('billing.insurance')}</SelectItem>
                    <SelectItem value="bank">{t('billing.bankTransfer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">{t('reports.revenueSource')}</Label>
                <Select
                  value={filters.customFilters?.revenueSource || 'all'}
                  onValueChange={(value) => handleCustomFilterChange('revenueSource', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reports.allSources')}</SelectItem>
                    <SelectItem value="consultations">{t('reports.consultations')}</SelectItem>
                    <SelectItem value="procedures">{t('reports.procedures')}</SelectItem>
                    <SelectItem value="pharmacy">{t('reports.pharmacy')}</SelectItem>
                    <SelectItem value="laboratory">{t('reports.laboratory')}</SelectItem>
                    <SelectItem value="radiology">{t('reports.radiology')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">{t('reports.amountRange')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t('reports.min')}
                    value={filters.customFilters?.minAmount || ''}
                    onChange={(e) => handleCustomFilterChange('minAmount', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={t('reports.max')}
                    value={filters.customFilters?.maxAmount || ''}
                    onChange={(e) => handleCustomFilterChange('maxAmount', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Report Specific Filters */}
        {reportType === 'staff' && (
          <div className="space-y-3">
            <Label className="font-medium">{t('reports.staffFilters')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">{t('reports.employeeType')}</Label>
                <Select
                  value={filters.customFilters?.employeeType || 'all'}
                  onValueChange={(value) => handleCustomFilterChange('employeeType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reports.allEmployees')}</SelectItem>
                    <SelectItem value="fulltime">{t('reports.fullTime')}</SelectItem>
                    <SelectItem value="parttime">{t('reports.partTime')}</SelectItem>
                    <SelectItem value="contract">{t('reports.contract')}</SelectItem>
                    <SelectItem value="consultant">{t('reports.consultant')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">{t('reports.experience')}</Label>
                <Select
                  value={filters.customFilters?.experience || 'all'}
                  onValueChange={(value) => handleCustomFilterChange('experience', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reports.allLevels')}</SelectItem>
                    <SelectItem value="junior">{t('reports.junior')} {'(<2 '}{t('reports.years')}{')'}</SelectItem>
                    <SelectItem value="mid">{t('reports.midLevel')} {'(2-5 '}{t('reports.years')}{')'}</SelectItem>
                    <SelectItem value="senior">{t('reports.senior')} {'(5-10 '}{t('reports.years')}{')'}</SelectItem>
                    <SelectItem value="expert">{t('reports.expert')} {'(>10 '}{t('reports.years')}{')'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">{t('reports.shift')}</Label>
                <Select
                  value={filters.customFilters?.shift || 'all'}
                  onValueChange={(value) => handleCustomFilterChange('shift', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reports.allShifts')}</SelectItem>
                    <SelectItem value="morning">{t('reports.morningShift')}</SelectItem>
                    <SelectItem value="afternoon">{t('reports.afternoonShift')}</SelectItem>
                    <SelectItem value="night">{t('reports.nightShift')}</SelectItem>
                    <SelectItem value="rotating">{t('reports.rotatingShift')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Apply Filters Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={onApplyFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('reports.applyFilters')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;