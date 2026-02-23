// Export all report components for easy importing
export { default as ReportsMain } from './ReportsMain';
export { default as FinancialReportsDashboard } from './FinancialReportsDashboard';
export { default as RevenueReport } from './RevenueReport';
export { default as ExpensesReport } from './ExpensesReport';
export { default as ProfitabilityReport } from './ProfitabilityReport';
export { default as InsuranceReport } from './InsuranceReport';
export { default as PatientsReport } from './PatientsReport';
export { default as MonthlyReport } from './MonthlyReport';

// Type definitions for reports
export type ReportType = 
  | 'dashboard'
  | 'revenue' 
  | 'expenses' 
  | 'profitability' 
  | 'insurance' 
  | 'patients' 
  | 'monthly';

export interface ReportComponentProps {
  onGoBack: () => void;
}

export interface ReportsDashboardProps {
  onNavigateToReport: (reportType: ReportType) => void;
}