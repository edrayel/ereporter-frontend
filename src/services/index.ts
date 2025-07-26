// Service exports for easy importing
export { default as authService } from './authService';
export { default as reportService } from './reportService';
export { default as dashboardService } from './dashboardService';
export { default as notificationService } from './notificationService';
export { default as auditService } from './auditService';
export { default as pollingUnitService } from './pollingUnitService';
export { default as agentService } from './agentService';
export { default as resultService } from './resultService';
export { default as mockDataService } from './mockDataService';

// Export types for service responses
export type { LoginCredentials, AuthResponse, RegisterData, User } from '../types/auth';

export type { Report, ReportStats, ReportFilters, CreateReportRequest } from '../types/report';

export type { Agent, AgentStats, AgentFilters, AgentLocation } from '../types/agent';

export type { PollingUnit, PollingUnitStats, PollingUnitFilters } from '../types/pollingUnit';

export type { Notification, NotificationStats, NotificationFilters } from '../types/notification';

export type { AuditLog, AuditLogStats, AuditLogFilters } from '../types/audit';

export type {
  ElectionResult,
  ResultFilters,
  CreateResultRequest,
  ResultStats,
  ResultSummary,
} from '../types/result';
