import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import {
  Notification,
  CreateNotificationRequest,
  NotificationFilters,
  NotificationStats,
  BulkNotificationRequest,
  NotificationPreferences,
} from '../types/notification';
import { mockDataService } from './mockDataService';

class NotificationService {
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
   * Retrieves notifications with optional filtering
   * @param filters - Optional filters for notifications
   * @returns Promise resolving to notifications array
   */
  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    logger.info('Fetching notifications', { filters, mode: config.mode });

    if (shouldUseMockData()) {
      const notifications = mockDataService.getNotifications();
      let filteredNotifications = notifications;

      if (filters) {
        if (filters.type) {
          filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
        }
        if (filters.isRead !== undefined) {
          filteredNotifications = filteredNotifications.filter(n => n.isRead === filters.isRead);
        }
        if (filters.startDate) {
          const fromDate = new Date(filters.startDate);
          filteredNotifications = filteredNotifications.filter(
            n => new Date(n.createdAt) >= fromDate,
          );
        }
        if (filters.endDate) {
          const toDate = new Date(filters.endDate);
          filteredNotifications = filteredNotifications.filter(
            n => new Date(n.createdAt) <= toDate,
          );
        }
      }

      // Apply pagination
      const page = 1;
      const limit = 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

      logger.info('Mock notifications fetched', { count: paginatedNotifications.length });
      return paginatedNotifications;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get(`/v1/notifications?${params.toString()}`);
    logger.info('Notifications fetched', { count: response.data.length });
    return response.data;
  }

  /**
   * Retrieves a specific notification by ID
   * @param id - Notification ID
   * @returns Promise resolving to notification
   */
  async getNotificationById(id: string): Promise<Notification> {
    logger.info('Fetching notification by ID', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const notifications = mockDataService.getNotifications();
      const notification = notifications.find(n => n.id === id);

      if (!notification) {
        throw new Error(`Notification with ID ${id} not found`);
      }

      logger.info('Mock notification fetched by ID');
      return notification;
    }

    const response = await this.api.get(`/v1/notifications/${id}`);
    logger.info('Notification fetched by ID');
    return response.data;
  }

  /**
   * Creates a new notification
   * @param notificationData - Notification creation data
   * @returns Promise resolving to created notification
   */
  async createNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    logger.info('Creating notification', { type: notificationData.type, mode: config.mode });

    if (shouldUseMockData()) {
      const newNotification: Notification = {
        id: `notification_${Date.now()}`,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        isRead: false,
        userId: notificationData.userId,
        data: notificationData.data,
        createdAt: new Date().toISOString(),
      };

      logger.info('Mock notification created', { id: newNotification.id });
      return newNotification;
    }

    const response = await this.api.post('/v1/notifications', notificationData);
    logger.info('Notification created', { id: response.data.id });
    return response.data;
  }

  /**
   * Marks a notification as read
   * @param id - Notification ID
   * @returns Promise resolving to updated notification
   */
  async markAsRead(id: string): Promise<Notification> {
    logger.info('Marking notification as read', { id, mode: config.mode });

    if (shouldUseMockData()) {
      const notifications = mockDataService.getNotifications();
      const notification = notifications.find(n => n.id === id);

      if (!notification) {
        throw new Error(`Notification with ID ${id} not found`);
      }

      const updatedNotification = {
        ...notification,
        isRead: true,
      };

      logger.info('Mock notification marked as read');
      return updatedNotification;
    }

    const response = await this.api.patch(`/v1/notifications/${id}/read`);
    logger.info('Notification marked as read');
    return response.data;
  }

  /**
   * Marks multiple notifications as read
   * @param ids - Array of notification IDs
   * @returns Promise resolving to updated notifications
   */
  async markMultipleAsRead(ids: string[]): Promise<Notification[]> {
    logger.info('Marking multiple notifications as read', { count: ids.length, mode: config.mode });

    if (shouldUseMockData()) {
      const notifications = mockDataService.getNotifications();
      const updatedNotifications = notifications
        .filter(n => ids.includes(n.id))
        .map(n => ({
          ...n,
          isRead: true,
        }));

      logger.info('Mock notifications marked as read', { count: updatedNotifications.length });
      return updatedNotifications;
    }

    const response = await this.api.patch('/v1/notifications/bulk-read', { ids });
    logger.info('Multiple notifications marked as read');
    return response.data;
  }

  /**
   * Deletes a notification
   * @param id - Notification ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteNotification(id: string): Promise<void> {
    logger.info('Deleting notification', { id, mode: config.mode });

    if (shouldUseMockData()) {
      logger.info('Mock notification deleted');
      return;
    }

    await this.api.delete(`/v1/notifications/${id}`);
    logger.info('Notification deleted');
  }

  /**
   * Sends bulk notifications
   * @param bulkRequest - Bulk notification request data
   * @returns Promise resolving to created notifications
   */
  async sendBulkNotifications(bulkRequest: BulkNotificationRequest): Promise<Notification[]> {
    logger.info('Sending bulk notifications', {
      recipientCount: bulkRequest.userIds.length,
      type: bulkRequest.type,
      mode: config.mode,
    });

    if (shouldUseMockData()) {
      const notifications: Notification[] = bulkRequest.userIds.map(userId => ({
        id: `notification_${Date.now()}_${userId}`,
        type: bulkRequest.type,
        title: bulkRequest.title,
        message: bulkRequest.message,
        isRead: false,
        userId,
        data: bulkRequest.data,
        createdAt: new Date().toISOString(),
      }));

      logger.info('Mock bulk notifications sent', { count: notifications.length });
      return notifications;
    }

    const response = await this.api.post('/v1/notifications/bulk', bulkRequest);
    logger.info('Bulk notifications sent', { count: response.data.length });
    return response.data;
  }

  /**
   * Retrieves notification statistics
   * @returns Promise resolving to notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    logger.info('Fetching notification stats', { mode: config.mode });

    if (shouldUseMockData()) {
      const notifications = mockDataService.getNotifications();

      const stats: NotificationStats = {
        totalNotifications: notifications.length,
        unreadNotifications: notifications.filter(n => !n.isRead).length,
        notificationsByType: {
          info: notifications.filter(n => n.type === 'info').length,
          warning: notifications.filter(n => n.type === 'warning').length,
          error: notifications.filter(n => n.type === 'error').length,
          success: notifications.filter(n => n.type === 'success').length,
        },
      };

      logger.info('Mock notification stats fetched', stats);
      return stats;
    }

    const response = await this.api.get('/v1/notifications/stats');
    logger.info('Notification stats fetched');
    return response.data;
  }

  /**
   * Retrieves user notification preferences
   * @param userId - User ID
   * @returns Promise resolving to notification preferences
   */
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    logger.info('Fetching notification preferences', { userId, mode: config.mode });

    if (shouldUseMockData()) {
      const preferences: NotificationPreferences = {
        userId,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notificationTypes: ['info', 'warning', 'error'],
      };

      logger.info('Mock notification preferences fetched');
      return preferences;
    }

    const response = await this.api.get(`/v1/users/${userId}/notification-preferences`);
    logger.info('Notification preferences fetched');
    return response.data;
  }

  /**
   * Updates user notification preferences
   * @param userId - User ID
   * @param preferences - Updated preferences
   * @returns Promise resolving to updated preferences
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    logger.info('Updating notification preferences', { userId, mode: config.mode });

    if (shouldUseMockData()) {
      const currentPreferences = await this.getNotificationPreferences(userId);
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences,
        userId, // Ensure userId is preserved
      };

      logger.info('Mock notification preferences updated');
      return updatedPreferences;
    }

    const response = await this.api.patch(
      `/v1/users/${userId}/notification-preferences`,
      preferences,
    );
    logger.info('Notification preferences updated');
    return response.data;
  }

  /**
   * Subscribes to real-time notifications (WebSocket)
   * @param userId - User ID
   * @param onNotification - Callback for new notifications
   * @returns Cleanup function
   */
  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void,
  ): () => void {
    logger.info('Subscribing to real-time notifications', { userId, mode: config.mode });

    if (shouldUseMockData()) {
      // Simulate real-time notifications in proto mode
      const interval = setInterval(() => {
        const mockNotification: Notification = {
          id: `notification_${Date.now()}`,
          type: 'info',
          title: 'Mock Notification',
          message: 'This is a simulated real-time notification',
          isRead: false,
          userId,
          createdAt: new Date().toISOString(),
        };

        onNotification(mockNotification);
      }, 30000); // Send a mock notification every 30 seconds

      return () => {
        clearInterval(interval);
        logger.info('Unsubscribed from mock notifications');
      };
    }

    // In dev/prod mode, establish WebSocket connection
    const wsUrl = config.apiUrl.replace('http', 'ws') + `/v1/notifications/subscribe/${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = event => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        logger.error('Failed to parse notification message', error);
      }
    };

    ws.onerror = error => {
      logger.error('WebSocket error', error);
    };

    return () => {
      ws.close();
      logger.info('WebSocket connection closed');
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
