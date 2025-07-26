import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import { Report, ReportFilters, ReportStats, CreateReportRequest } from '../types/report';
import { mockDataService } from './mockDataService';

class ReportService {
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
   * Retrieves reports based on optional filters
   * @param filters - Optional filtering criteria for reports
   * @returns Promise resolving to array of reports
   */
  async getReports(filters?: ReportFilters): Promise<Report[]> {
    logger.info('Fetching reports', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const reports = mockDataService.getReports();
      let filteredReports = reports;

      if (filters) {
        if (filters.category) {
          filteredReports = filteredReports.filter(report => report.category === filters.category);
        }
        if (filters.severity) {
          filteredReports = filteredReports.filter(report => report.severity === filters.severity);
        }
        if (filters.status) {
          filteredReports = filteredReports.filter(report => report.status === filters.status);
        }
        if (filters.agentId) {
          filteredReports = filteredReports.filter(report => report.agentId === filters.agentId);
        }
        if (filters.pollingUnitId) {
          filteredReports = filteredReports.filter(
            report => report.pollingUnitId === filters.pollingUnitId,
          );
        }
        if (filters.dateFrom) {
          filteredReports = filteredReports.filter(
            report => new Date(report.createdAt) >= new Date(filters.dateFrom!),
          );
        }
        if (filters.dateTo) {
          filteredReports = filteredReports.filter(
            report => new Date(report.createdAt) <= new Date(filters.dateTo!),
          );
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredReports = filteredReports.filter(
            report =>
              report.title.toLowerCase().includes(searchLower) ||
              report.description.toLowerCase().includes(searchLower),
          );
        }
      }

      // Apply pagination
      if (filters?.page && filters?.limit) {
        const startIndex = (filters.page - 1) * filters.limit;
        filteredReports = filteredReports.slice(startIndex, startIndex + filters.limit);
      }

      logger.info('Mock reports fetched', { count: filteredReports.length });
      return filteredReports;
    }

    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.agentId) params.append('agentId', filters.agentId);
    if (filters?.pollingUnitId) params.append('pollingUnitId', filters.pollingUnitId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await this.api.get(`/v1/reports?${params.toString()}`);
    logger.info('Reports fetched', { count: response.data.length });
    return response.data;
  }

  /**
   * Retrieves a specific report by ID
   * @param id - Report ID
   * @returns Promise resolving to the report
   */
  async getReport(id: string): Promise<Report> {
    logger.info('Fetching report', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const reports = mockDataService.getReports();
      const report = reports.find(r => r.id === id);

      if (!report) {
        throw new Error('Report not found');
      }

      logger.info('Mock report fetched', { reportId: id });
      return report;
    }

    const response = await this.api.get(`/v1/reports/${id}`);
    logger.info('Report fetched', { reportId: id });
    return response.data;
  }

  /**
   * Creates a new report
   * @param reportData - Report creation data
   * @returns Promise resolving to the created report
   */
  async createReport(reportData: CreateReportRequest): Promise<Report> {
    logger.info('Creating report', { category: reportData.category, mode: config.mode });

    if (shouldUseMockData()) {
      const newReport: Report = {
        id: `report_${Date.now()}`,
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        severity: reportData.severity,
        status: 'pending',
        agentId: reportData.agentId,
        pollingUnitId: reportData.pollingUnitId,
        coordinates: reportData.coordinates || { latitude: 0, longitude: 0 },
        timestamp: new Date().toISOString(),
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Additional properties for modal compatibility
        location: 'Location not specified',
        reportedBy: 'System User',
        reportedAt: new Date().toISOString(),
      };

      logger.info('Mock report created', { reportId: newReport.id });
      return newReport;
    }

    const response = await this.api.post('/v1/reports', reportData);
    logger.info('Report created', { reportId: response.data.id });
    return response.data;
  }

  /**
   * Updates an existing report
   * @param id - Report ID
   * @param reportData - Updated report data
   * @returns Promise resolving to the updated report
   */
  async updateReport(id: string, reportData: Partial<Report>): Promise<Report> {
    logger.info('Updating report', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const reports = mockDataService.getReports();
      const reportIndex = reports.findIndex(r => r.id === id);

      if (reportIndex === -1) {
        throw new Error('Report not found');
      }

      const updatedReport = {
        ...reports[reportIndex],
        ...reportData,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Mock report updated', { reportId: id });
      return updatedReport;
    }

    const response = await this.api.put(`/v1/reports/${id}`, reportData);
    logger.info('Report updated', { reportId: id });
    return response.data;
  }

  /**
   * Deletes a report
   * @param id - Report ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteReport(id: string): Promise<void> {
    logger.info('Deleting report', { id, mode: config.mode });

    if (shouldUseMockData()) {
      logger.info('Mock report deleted', { reportId: id });
      return;
    }

    await this.api.delete(`/v1/reports/${id}`);
    logger.info('Report deleted', { reportId: id });
  }

  /**
   * Retrieves report statistics
   * @returns Promise resolving to report statistics
   */
  async getReportStats(): Promise<ReportStats> {
    logger.info('Fetching report stats', { mode: config.mode });

    if (shouldUseMockData()) {
      const reports = mockDataService.getReports();
      const stats: ReportStats = {
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        criticalReports: reports.filter(r => r.severity === 'critical').length,
        reportsByCategory: {
          violence: reports.filter(r => r.category === 'violence').length,
          logistics: reports.filter(r => r.category === 'logistics').length,
          suppression: reports.filter(r => r.category === 'suppression').length,
          technical: reports.filter(r => r.category === 'technical').length,
        },
        reportsBySeverity: {
          low: reports.filter(r => r.severity === 'low').length,
          medium: reports.filter(r => r.severity === 'medium').length,
          high: reports.filter(r => r.severity === 'high').length,
          critical: reports.filter(r => r.severity === 'critical').length,
        },
      };

      logger.info('Mock report stats fetched', stats);
      return stats;
    }

    const response = await this.api.get('/v1/reports/stats');
    logger.info('Report stats fetched', response.data);
    return response.data;
  }

  /**
   * Updates report status
   * @param id - Report ID
   * @param status - New status
   * @param notes - Optional status change notes
   * @returns Promise resolving to the updated report
   */
  async updateReportStatus(id: string, status: string, notes?: string): Promise<Report> {
    logger.info('Updating report status', { id, status, mode: config.mode });

    if (shouldUseMockData()) {
      const reports = mockDataService.getReports();
      const report = reports.find(r => r.id === id);

      if (!report) {
        throw new Error('Report not found');
      }

      const updatedReport = {
        ...report,
        status: status as any,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Mock report status updated', { reportId: id, status });
      return updatedReport;
    }

    const response = await this.api.patch(`/v1/reports/${id}/status`, { status, notes });
    logger.info('Report status updated', { reportId: id, status });
    return response.data;
  }

  /**
   * Uploads attachment for a report
   * @param reportId - Report ID
   * @param file - File to upload
   * @param type - Attachment type
   * @returns Promise resolving to the uploaded attachment info
   */
  async uploadAttachment(reportId: string, file: File, type: string): Promise<any> {
    logger.info('Uploading report attachment', { reportId, type, mode: config.mode });

    if (shouldUseMockData()) {
      const mockAttachment = {
        id: `attachment_${Date.now()}`,
        reportId,
        type,
        filename: file.name,
        size: file.size,
        url: `https://example.com/attachments/${file.name}`,
        uploadedAt: new Date().toISOString(),
      };

      logger.info('Mock attachment uploaded', { attachmentId: mockAttachment.id });
      return mockAttachment;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post(`/v1/reports/${reportId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    logger.info('Attachment uploaded', { reportId, attachmentId: response.data.id });
    return response.data;
  }
}

export const reportService = new ReportService();
export default reportService;
