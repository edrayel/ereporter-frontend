export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  notificationsByType: Record<NotificationType, number>;
}

export interface BulkNotificationRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: NotificationType[];
}
