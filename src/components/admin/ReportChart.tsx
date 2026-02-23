import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, BarChart, PieChart, AreaChart, RadarChart, Line, Bar, Pie, Area, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ChartConfig } from '../../services/ReportService';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface ReportChartProps {
  data: any[];
  config: ChartConfig;
  className?: string;
}

const ReportChart: React.FC<ReportChartProps> = ({ data, config, className = '' }) => {
  const { t, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const defaultColors = [
    '#1e40af', // Primary blue
    '#16a34a', // Success green  
    '#ea580c', // Warning orange
    '#8b5cf6', // Purple
    '#dc2626', // Destructive red
    '#06b6d4', // Cyan
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#6366f1'  // Indigo
  ];

  const colors = config.colors || defaultColors;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend component for better RTL support
  const CustomLegend = ({ payload }: any) => (
    <div className={`flex flex-wrap justify-center gap-4 mt-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (config.type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.8 0.01 240)" />
            <XAxis 
              dataKey={config.xAxis || 'x'} 
              stroke="oklch(0.6 0.01 240)"
              fontSize={12}
            />
            <YAxis 
              stroke="oklch(0.6 0.01 240)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey={config.dataKey}
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.8 0.01 240)" />
            <XAxis 
              dataKey={config.xAxis || 'x'} 
              stroke="oklch(0.6 0.01 240)"
              fontSize={12}
            />
            <YAxis 
              stroke="oklch(0.6 0.01 240)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey={config.dataKey}
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.8 0.01 240)" />
            <XAxis 
              dataKey={config.xAxis || 'x'} 
              stroke="oklch(0.6 0.01 240)"
              fontSize={12}
            />
            <YAxis 
              stroke="oklch(0.6 0.01 240)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart {...chartProps} width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey={config.dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart {...chartProps} width={400} height={400}>
            <PolarGrid stroke="oklch(0.8 0.01 240)" />
            <PolarAngleAxis 
              dataKey={config.xAxis || 'x'} 
              tick={{ fontSize: 12, fill: "oklch(0.6 0.01 240)" }}
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 10, fill: "oklch(0.6 0.01 240)" }}
            />
            <Radar
              name={config.title || 'Data'}
              dataKey={config.dataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </RadarChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {t('reports.unsupportedChartType')}
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          {config.title || t('reports.chart')}
        </CardTitle>
        {config.dataKey && (
          <CardDescription>
            {t('reports.showing')} {config.dataKey} {config.xAxis ? t('reports.by') + ' ' + config.xAxis : ''}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportChart;