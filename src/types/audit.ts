export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: {
    description: string;
    metadata?: Record<string, any>;
  };
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
}

export interface AuditLogStats {
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByResource: Record<string, number>;
  logsByUser: Record<string, number>;
  recentActivity: AuditLog[];
}

export interface CreateAuditLogRequest {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  details: {
    description: string;
    metadata?: Record<string, any>;
  };
}

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'agent.create'
  | 'agent.update'
  | 'agent.verify'
  | 'report.create'
  | 'report.update'
  | 'report.resolve'
  | 'result.upload'
  | 'result.verify'
  | 'location.update'
  | 'notification.send'
  | 'backup.create'
  | 'system.config';

export type AuditResource =
  | 'user'
  | 'agent'
  | 'report'
  | 'result'
  | 'location'
  | 'notification'
  | 'polling_unit'
  | 'backup'
  | 'system';
