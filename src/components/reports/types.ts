// Print Service Types and Interfaces
export interface PrintOptions {
  format: 'pdf' | 'excel' | 'word' | 'image' | 'html';
  layout: 'portrait' | 'landscape';
  size: 'a4' | 'a3' | 'letter' | 'legal' | 'custom';
  quality: 'draft' | 'normal' | 'high' | 'print-ready';
  includeCharts: boolean;
  includeData: boolean;
  includeHeader: boolean;
  includeFooter: boolean;
  includeLogo: boolean;
  includeDate: boolean;
  includeSignature: boolean;
  watermark: 'none' | 'draft' | 'confidential' | 'original';
  colorMode: 'color' | 'grayscale' | 'blackwhite';
  margin: 'narrow' | 'normal' | 'wide' | 'custom';
  fontSize: 'small' | 'normal' | 'large';
  pageNumbers: boolean;
  compression: 'none' | 'low' | 'medium' | 'high';
}

export interface PrintJobStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  filename: string;
  format: string;
  size: string;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  error?: string;
}

export interface ReportType {
  id: string;
  title: string;
  description: string;
  component: string;
  icon: React.ReactNode;
  color: string;
  size: string;
  lastGenerated?: Date;
  formats: ('pdf' | 'excel' | 'word' | 'image')[];
  estimatedTime: number; // seconds
  complexity: 'simple' | 'medium' | 'complex';
  category: 'financial' | 'operational' | 'clinical' | 'administrative';
}

export interface PrintJob {
  id: string;
  reportType: string;
  reportTitle: string;
  format: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: Date;
  endTime?: Date;
  fileSize?: string;
  downloadUrl?: string;
  error?: string;
}