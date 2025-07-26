import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import { mockDataService } from './mockDataService';

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  onlineAgents: number;
  totalPollingUnits: number;
  activePollingUnits: number;
  totalReports: number;
  pendingReports: number;
  criticalReports: number;
  totalResults: number;
  verifiedResults: number;
  pendingResults: number;
}

export interface RecentActivity {
  id: string;
  type:
    | 'agent_login'
    | 'report_submitted'
    | 'result_uploaded'
    | 'agent_approved'
    | 'incident_resolved';
  title: string;
  description: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

class DashboardService {
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
   * Retrieves comprehensive dashboard overview data
   * @returns Promise resolving to dashboard overview
   */
  async getDashboardOverview(): Promise<DashboardOverview> {
    logger.info('Fetching dashboard overview', { mode: config.mode });

    if (shouldUseMockData()) {
      const [stats, recentActivities, alerts] = await Promise.all([
        this.getDashboardStats(),
        this.getRecentActivities(),
        this.getAlerts(),
      ]);

      const overview: DashboardOverview = {
        stats,
        recentActivities,
        alerts,
      };

      logger.info('Mock dashboard overview fetched');
      return overview;
    }

    const response = await this.api.get('/v1/dashboard/overview');
    logger.info('Dashboard overview fetched');
    return response.data;
  }

  /**
   * Retrieves dashboard statistics
   * @returns Promise resolving to dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    logger.info('Fetching dashboard stats', { mode: config.mode });

    if (shouldUseMockData()) {
      const agents = mockDataService.getAgents();
      const pollingUnits = mockDataService.getPollingUnits();
      const reports = mockDataService.getReports();
      const results = mockDataService.getResults();

      const stats: DashboardStats = {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        onlineAgents: agents.filter(a => a.isOnline).length,
        totalPollingUnits: pollingUnits.length,
        activePollingUnits: pollingUnits.filter(pu => pu.isActive).length,
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        criticalReports: reports.filter(r => r.severity === 'critical').length,
        totalResults: results.length,
        verifiedResults: results.filter((r: any) => r.isVerified).length,
        pendingResults: results.filter((r: any) => !r.isVerified).length,
      };

      logger.info('Mock dashboard stats fetched', stats);
      return stats;
    }

    const response = await this.api.get('/v1/dashboard/stats');
    logger.info('Dashboard stats fetched');
    return response.data;
  }

  /**
   * Retrieves recent activities
   * @param limit - Maximum number of activities to retrieve
   * @returns Promise resolving to recent activities
   */
  async getRecentActivities(limit = 10): Promise<RecentActivity[]> {
    logger.info('Fetching recent activities', { limit, mode: config.mode });

    if (shouldUseMockData()) {
      const activities: RecentActivity[] = [
        {
          id: 'activity_1',
          type: 'agent_login',
          title: 'Agent Login',
          description: 'John Doe logged in from Polling Unit 001',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          agentId: 'agent_001',
          agentName: 'John Doe',
        },
        {
          id: 'activity_2',
          type: 'report_submitted',
          title: 'Incident Report',
          description: 'Violence reported at Polling Unit 003',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          agentId: 'agent_003',
          agentName: 'Jane Smith',
          severity: 'high',
        },
        {
          id: 'activity_3',
          type: 'result_uploaded',
          title: 'Results Uploaded',
          description: 'Election results uploaded for Ward 5',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          agentId: 'agent_005',
          agentName: 'Mike Johnson',
        },
        {
          id: 'activity_4',
          type: 'agent_approved',
          title: 'Agent Approved',
          description: 'New agent Sarah Wilson has been approved',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          agentId: 'agent_007',
          agentName: 'Sarah Wilson',
        },
        {
          id: 'activity_5',
          type: 'incident_resolved',
          title: 'Incident Resolved',
          description: 'Technical issue at Polling Unit 012 resolved',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          severity: 'medium',
        },
      ];

      const limitedActivities = activities.slice(0, limit);
      logger.info('Mock recent activities fetched', { count: limitedActivities.length });
      return limitedActivities;
    }

    const response = await this.api.get(`/v1/dashboard/activities?limit=${limit}`);
    logger.info('Recent activities fetched', { count: response.data.length });
    return response.data;
  }

  /**
   * Retrieves system alerts
   * @param includeRead - Whether to include read alerts
   * @returns Promise resolving to alerts
   */
  async getAlerts(includeRead = false): Promise<Alert[]> {
    logger.info('Fetching alerts', { includeRead, mode: config.mode });

    if (shouldUseMockData()) {
      const alerts: Alert[] = [
        {
          id: 'alert_1',
          type: 'warning',
          title: 'Low Agent Coverage',
          message: 'Ward 3 has only 60% agent coverage',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          actionUrl: '/agents?ward=3',
        },
        {
          id: 'alert_2',
          type: 'error',
          title: 'Critical Incident',
          message: 'Violence reported at multiple polling units',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          actionUrl: '/reports?severity=critical',
        },
        {
          id: 'alert_3',
          type: 'info',
          title: 'System Maintenance',
          message: 'Scheduled maintenance tonight at 2 AM',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
      ];

      const filteredAlerts = includeRead ? alerts : alerts.filter(a => !a.isRead);
      logger.info('Mock alerts fetched', { count: filteredAlerts.length });
      return filteredAlerts;
    }

    const params = new URLSearchParams();
    if (includeRead) params.append('includeRead', 'true');

    const response = await this.api.get(`/v1/dashboard/alerts?${params.toString()}`);
    logger.info('Alerts fetched', { count: response.data.length });
    return response.data;
  }

  /**
   * Marks an alert as read
   * @param alertId - Alert ID
   * @returns Promise resolving when alert is marked as read
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    logger.info('Marking alert as read', { alertId, mode: config.mode });

    if (shouldUseMockData()) {
      logger.info('Mock alert marked as read', { alertId });
      return;
    }

    await this.api.patch(`/v1/dashboard/alerts/${alertId}/read`);
    logger.info('Alert marked as read', { alertId });
  }

  /**
   * Retrieves real-time dashboard metrics
   * @returns Promise resolving to real-time metrics
   */
  async getRealTimeMetrics(): Promise<any> {
    logger.info('Fetching real-time metrics', { mode: config.mode });

    if (shouldUseMockData()) {
      const metrics = {
        onlineAgents: Math.floor(Math.random() * 50) + 100,
        activeReports: Math.floor(Math.random() * 20) + 5,
        systemLoad: Math.random() * 100,
        lastUpdated: new Date().toISOString(),
      };

      logger.info('Mock real-time metrics fetched', metrics);
      return metrics;
    }

    const response = await this.api.get('/v1/dashboard/metrics/realtime');
    logger.info('Real-time metrics fetched');
    return response.data;
  }

  /**
   * Exports dashboard data
   * @param format - Export format (csv, xlsx, pdf)
   * @param dateRange - Date range for export
   * @returns Promise resolving to export URL or blob
   */
  async exportDashboardData(
    format: 'csv' | 'xlsx' | 'pdf',
    dateRange?: { from: string; to: string },
  ): Promise<string> {
    logger.info('Exporting dashboard data', { format, dateRange, mode: config.mode });

    if (shouldUseMockData()) {
      const mockExportUrl = `https://example.com/exports/dashboard_${Date.now()}.${format}`;
      logger.info('Mock dashboard data exported', { url: mockExportUrl });
      return mockExportUrl;
    }

    const params = new URLSearchParams();
    params.append('format', format);
    if (dateRange) {
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
    }

    const response = await this.api.post(`/v1/dashboard/export?${params.toString()}`);
    logger.info('Dashboard data exported', { url: response.data.url });
    return response.data.url;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
