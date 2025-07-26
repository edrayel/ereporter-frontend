import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import {
  AuditLog,
  AuditLogFilters,
  AuditLogStats,
  CreateAuditLogRequest,
  AuditAction,
  AuditResource,
} from '../types/audit';
import { mockDataService } from './mockDataService';

class AuditService {
  private api = axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
  });

  constructor() {
    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        logger.error('API Error', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  /**
   * Retrieves audit logs with optional filtering
   * @param filters - Optional filters for audit logs
   * @returns Promise resolving to audit logs array
   */
  async getAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
    logger.info('Fetching audit logs', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const auditLogs = mockDataService.getAuditLogs();
      let filteredLogs = auditLogs;

      if (filters) {
        if (filters.userId) {
          filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        }
        if (filters.action) {
          filteredLogs = filteredLogs.filter(log => log.action === filters.action);
        }
        if (filters.resource) {
          filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
        }
        if (filters.resourceId) {
          filteredLogs = filteredLogs.filter(log => log.resourceId === filters.resourceId);
        }
        if (filters.startDate) {
          const fromDate = new Date(filters.startDate);
          filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
        }
        if (filters.endDate) {
          const toDate = new Date(filters.endDate);
          filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
        }
        if (filters.ipAddress) {
          filteredLogs = filteredLogs.filter(log => log.ipAddress === filters.ipAddress);
        }
      }

      // Apply pagination
      const page = 1;
      const limit = 50;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

      logger.info('Mock audit logs fetched', { count: paginatedLogs.length });
      return paginatedLogs;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/audit-logs?${params.toString()}`);
    logger.info('Audit logs fetched', { count: response.data.length });
    return response.data;
  }

  /**
   * Retrieves a specific audit log by ID
   * @param id - Audit log ID
   * @returns Promise resolving to audit log
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    logger.info('Fetching audit log by ID', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const auditLogs = mockDataService.getAuditLogs();
      const auditLog = auditLogs.find(log => log.id === id);

      if (!auditLog) {
        throw new Error(`Audit log with ID ${id} not found`);
      }

      logger.info('Mock audit log fetched by ID');
      return auditLog;
    }

    const response = await this.api.get(`/v1/audit-logs/${id}`);
    logger.info('Audit log fetched by ID');
    return response.data;
  }

  /**
   * Creates a new audit log entry
   * @param auditData - Audit log creation data
   * @returns Promise resolving to created audit log
   */
  async createAuditLog(auditData: CreateAuditLogRequest): Promise<AuditLog> {
    logger.info('Creating audit log', {
      action: auditData.action,
      resource: auditData.resource,
      mode: config.mode,
    });

    if (shouldUseMockData()) {
      const newAuditLog: AuditLog = {
        id: `audit_${Date.now()}`,
        userId: auditData.userId,
        action: auditData.action,
        resource: auditData.resource,
        resourceId: auditData.resourceId,
        details: auditData.details,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        timestamp: new Date().toISOString(),
      };

      logger.info('Mock audit log created', { id: newAuditLog.id });
      return newAuditLog;
    }

    const response = await this.api.post('/v1/audit-logs', auditData);
    logger.info('Audit log created', { id: response.data.id });
    return response.data;
  }

  /**
   * Retrieves audit log statistics
   * @param filters - Optional filters for statistics
   * @returns Promise resolving to audit log statistics
   */
  async getAuditLogStats(filters?: Partial<AuditLogFilters>): Promise<AuditLogStats> {
    logger.info('Fetching audit log stats', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const auditLogs = mockDataService.getAuditLogs();
      let filteredLogs = auditLogs;

      // Apply filters if provided
      if (filters) {
        if (filters.startDate) {
          const fromDate = new Date(filters.startDate);
          filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
        }
        if (filters.endDate) {
          const toDate = new Date(filters.endDate);
          filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
        }
        if (filters.userId) {
          filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        }
      }

      const stats: AuditLogStats = {
        totalLogs: filteredLogs.length,
        logsByAction: {
          create: filteredLogs.filter(log => log.action === 'create').length,
          read: filteredLogs.filter(log => log.action === 'read').length,
          update: filteredLogs.filter(log => log.action === 'update').length,
          delete: filteredLogs.filter(log => log.action === 'delete').length,
          login: filteredLogs.filter(log => log.action === 'login').length,
          logout: filteredLogs.filter(log => log.action === 'logout').length,
          approve: filteredLogs.filter(log => log.action === 'approve').length,
          reject: filteredLogs.filter(log => log.action === 'reject').length,
          submit: filteredLogs.filter(log => log.action === 'submit').length,
          verify: filteredLogs.filter(log => log.action === 'verify').length,
        },
        logsByResource: {
          user: filteredLogs.filter(log => log.resource === 'user').length,
          agent: filteredLogs.filter(log => log.resource === 'agent').length,
          report: filteredLogs.filter(log => log.resource === 'report').length,
          result: filteredLogs.filter(log => log.resource === 'result').length,
          polling_unit: filteredLogs.filter(log => log.resource === 'polling_unit').length,
          notification: filteredLogs.filter(log => log.resource === 'notification').length,
          system: filteredLogs.filter(log => log.resource === 'system').length,
        },
        logsByUser: filteredLogs.reduce(
          (acc, log) => {
            acc[log.userId] = (acc[log.userId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        recentActivity: filteredLogs
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10),
      };

      logger.info('Mock audit log stats fetched', {
        totalLogs: stats.totalLogs,
        uniqueUsers: Object.keys(stats.logsByUser).length,
      });
      return stats;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/audit-logs/stats?${params.toString()}`);
    logger.info('Audit log stats fetched');
    return response.data;
  }

  /**
   * Exports audit logs to CSV format
   * @param filters - Optional filters for export
   * @returns Promise resolving to CSV data
   */
  async exportAuditLogs(filters?: AuditLogFilters): Promise<string> {
    logger.info('Exporting audit logs', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const auditLogs = await this.getAuditLogs(filters);

      // Generate CSV headers
      const headers = [
        'ID',
        'User ID',
        'Action',
        'Resource',
        'Resource ID',
        'IP Address',
        'User Agent',
        'Timestamp',
        'Details',
      ];

      // Generate CSV rows
      const rows = auditLogs.map(log => [
        log.id,
        log.userId,
        log.action,
        log.resource,
        log.resourceId || '',
        log.ipAddress,
        log.userAgent,
        log.timestamp,
        JSON.stringify(log.details),
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      logger.info('Mock audit logs exported', { count: auditLogs.length });
      return csvContent;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/audit-logs/export?${params.toString()}`, {
      responseType: 'text',
    });

    logger.info('Audit logs exported');
    return response.data;
  }

  /**
   * Searches audit logs by text query
   * @param query - Search query
   * @param filters - Optional additional filters
   * @returns Promise resolving to matching audit logs
   */
  async searchAuditLogs(query: string, filters?: AuditLogFilters): Promise<AuditLog[]> {
    logger.info('Searching audit logs', { query, filters, mode: config.mode });

    if (shouldUseMockData()) {
      const auditLogs = await this.getAuditLogs(filters);

      const searchResults = auditLogs.filter(log => {
        const searchableText = [
          log.action,
          log.resource,
          log.resourceId,
          log.userId,
          log.ipAddress,
          JSON.stringify(log.details),
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query.toLowerCase());
      });

      logger.info('Mock audit logs searched', {
        query,
        totalResults: searchResults.length,
      });
      return searchResults;
    }

    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/audit-logs/search?${params.toString()}`);
    logger.info('Audit logs searched', {
      query,
      totalResults: response.data.length,
    });
    return response.data;
  }

  /**
   * Automatically logs user actions for audit trail
   * @param action - The action being performed
   * @param resource - The resource being acted upon
   * @param resourceId - Optional resource ID
   * @param details - Optional additional details
   */
  async logUserAction(
    action: AuditAction,
    resource: AuditResource,
    resourceId?: string,
    details?: Record<string, any>,
  ): Promise<void> {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const ipAddress = await this.getCurrentUserIP();
      const userAgent = navigator.userAgent;

      await this.createAuditLog({
        userId,
        action,
        resource,
        resourceId: resourceId || 'unknown',
        details: {
          description: `${action} performed on ${resource}`,
          metadata: details,
        },
        ipAddress,
        userAgent,
      });

      logger.debug('User action logged', { action, resource, resourceId });
    } catch (error) {
      logger.error('Failed to log user action', error);
      // Don't throw error to avoid disrupting user workflow
    }
  }

  /**
   * Gets the current user's IP address
   * @returns Promise resolving to IP address
   */
  private async getCurrentUserIP(): Promise<string> {
    if (shouldUseMockData()) {
      return '127.0.0.1';
    }

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      logger.warn('Failed to get user IP address', error);
      return 'unknown';
    }
  }
}

export const auditService = new AuditService();
export default auditService;
