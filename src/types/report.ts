import { Agent, PollingUnit } from './agent';

export interface Report {
  id: string;
  agentId: string;
  agent?: Agent;
  pollingUnitId: string;
  pollingUnit?: PollingUnit;
  category: ReportCategory;
  severity: ReportSeverity;
  title: string;
  description: string;
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: ReportStatus;
  attachments?: ReportAttachment[];
  createdAt: string;
  updatedAt: string;
  // Additional properties for modal compatibility
  location: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
}

export type ReportCategory = 'violence' | 'logistics' | 'suppression' | 'technical';
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface ReportAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  filename: string;
  size: number;
  mimeType?: string;
}

export interface CreateReportRequest {
  category: ReportCategory;
  severity: ReportSeverity;
  title: string;
  description: string;
  agentId: string;
  pollingUnitId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  attachments?: File[];
}

export interface ReportFilters {
  category?: ReportCategory;
  severity?: ReportSeverity;
  status?: ReportStatus;
  agentId?: string;
  pollingUnitId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  state?: string;
  lga?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportStats {
  totalReports: number;
  pendingReports: number;
  criticalReports: number;
  reportsByCategory: Record<ReportCategory, number>;
  reportsBySeverity: Record<ReportSeverity, number>;
}
