import {
  BellIcon,
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  XCircleIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { markNotificationAsRead, removeNotification, clearNotifications } from '../store/slices/uiSlice';
import { classNames } from '../utils/helpers';

// Type assertions for Heroicons
const NotificationIcon = BellIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const SuccessIcon = CheckCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ErrorIcon = XCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const WarningIcon = ExclamationIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const InfoIcon = InformationCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const DeleteIcon = TrashIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const MarkReadIcon = CheckIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.ui);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);

  // Mock notifications for demo purposes
  const [mockNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Election Results Uploaded',
      message: 'Results for Polling Unit PU001 have been successfully uploaded.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Agent Check-in Overdue',
      message: 'Agent John Doe has not checked in for the last 2 hours.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true,
    },
    {
      id: '4',
      type: 'error',
      title: 'Upload Failed',
      message: 'Failed to upload results for Polling Unit PU005. Please try again.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      read: true,
    },
  ]);

  const allNotifications = [...notifications.map(n => ({
    ...n,
    timestamp: new Date().toISOString(),
  })), ...mockNotifications];

  const filteredNotifications = filter === 'unread' 
    ? allNotifications.filter(n => !n.read)
    : allNotifications;

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <SuccessIcon className="h-6 w-6 text-success-600" />;
      case 'error':
        return <ErrorIcon className="h-6 w-6 text-error-600" />;
      case 'warning':
        return <WarningIcon className="h-6 w-6 text-warning-600" />;
      case 'info':
        return <InfoIcon className="h-6 w-6 text-primary-600" />;
      default:
        return <NotificationIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'error':
        return 'bg-error-50 border-error-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'info':
        return 'bg-primary-50 border-primary-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id: string) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(clearNotifications());
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Notifications - eReporter</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
              Notifications
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Stay updated with the latest activities and alerts
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={handleClearAll}
              disabled={loading || allNotifications.length === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DeleteIcon className="h-4 w-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <NotificationIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Notifications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {allNotifications.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">{unreadCount}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Unread
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {unreadCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SuccessIcon className="h-6 w-6 text-success-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Read
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {allNotifications.length - unreadCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={classNames(
                filter === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              )}
            >
              All Notifications
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {allNotifications.length}
              </span>
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={classNames(
                filter === 'unread'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <NotificationIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filter === 'unread' ? 'All notifications have been read.' : 'You have no notifications yet.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={classNames(
                  'border rounded-lg p-4 transition-colors',
                  notification.read
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : getNotificationBgColor(notification.type)
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            title="Mark as read"
                          >
                            <MarkReadIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-gray-400 hover:text-error-600 dark:hover:text-error-400"
                          title="Delete notification"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {notification.message && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                    )}
                    {!notification.read && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;