import {
  UsersIcon,
  LocationMarkerIcon as MapPinIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationIcon as ExclamationTriangleIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { config, logger } from '../config/environment';
import {
  dashboardService,
  DashboardStats,
  RecentActivity,
  Alert,
} from '../services/dashboardService';
import { RootState } from '../store';

// Type assertions for Heroicons
const AgentsIcon = UsersIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const PollingIcon = MapPinIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ReportsIcon = DocumentTextIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ResultsIcon = ChartBarIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const NotificationIcon = BellIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const SuccessIcon = CheckCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ErrorIcon = XCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const InfoIcon = InformationCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const WarningIcon = ExclamationTriangleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

/**
 * Dashboard component - Main landing page after authentication
 * Displays overview statistics, recent activities, and quick actions
 */
const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();

    // Set up real-time updates if in dev or prod mode
    if (config.mode !== 'proto') {
      const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Loading dashboard data', { mode: config.mode });

      const [dashboardStats, activities, systemAlerts] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities(5),
        dashboardService.getAlerts(false),
      ]);

      setStats(dashboardStats);
      setRecentActivities(activities);
      setAlerts(systemAlerts);

      logger.info('Dashboard data loaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      logger.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Agents',
      description: 'View and manage field agents',
      icon: 'UsersIcon',
      link: '/agents',
      color: 'bg-blue-500',
    },
    {
      title: 'Polling Units',
      description: 'Monitor polling unit status',
      icon: 'MapPinIcon',
      link: '/polling-units',
      color: 'bg-green-500',
    },
    {
      title: 'Reports',
      description: 'Review incident reports',
      icon: 'DocumentTextIcon',
      link: '/reports',
      color: 'bg-yellow-500',
    },
    {
      title: 'Results',
      description: 'View election results',
      icon: 'ChartBarIcon',
      link: '/results',
      color: 'bg-purple-500',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'agent_login':
        return 'bg-blue-100';
      case 'report_submitted':
        return 'bg-red-100';
      case 'result_uploaded':
        return 'bg-green-100';
      case 'agent_approved':
        return 'bg-green-100';
      case 'incident_resolved':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_login':
        return <AgentsIcon className='h-5 w-5 text-blue-500' />;
      case 'report_submitted':
        return <WarningIcon className='h-5 w-5 text-red-500' />;
      case 'result_uploaded':
        return <ReportsIcon className='h-5 w-5 text-green-500' />;
      case 'agent_approved':
        return <SuccessIcon className='h-5 w-5 text-green-500' />;
      case 'incident_resolved':
        return <SuccessIcon className='h-5 w-5 text-green-500' />;
      default:
        return <InfoIcon className='h-5 w-5 text-gray-500' />;
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'agent_login':
        return 'text-blue-500';
      case 'report_submitted':
        return 'text-red-500';
      case 'result_uploaded':
        return 'text-green-500';
      case 'agent_approved':
        return 'text-green-500';
      case 'incident_resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <ErrorIcon className='h-12 w-12 text-red-500 mx-auto' />
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Error:{' '}
            {typeof error === 'string'
              ? error
              : (error as any)?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={loadDashboardData}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - eReporter</title>
        <meta name='description' content='Election monitoring dashboard' />
      </Helmet>

      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        {/* Header */}
        <div className='bg-white dark:bg-gray-800 shadow'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-6'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {getGreeting()}, {user?.name}!
                </h1>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                  Welcome back to your election monitoring dashboard
                  {config.mode !== 'prod' && (
                    <span className='ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full'>
                      {config.mode.toUpperCase()} MODE
                    </span>
                  )}
                </p>
              </div>
              <div className='flex items-center space-x-4'>
                <div className='relative'>
                  <NotificationIcon className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                  {(notifications.filter((n: any) => !n.read).length > 0 || alerts.length > 0) && (
                    <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                      {notifications.filter((n: any) => !n.read).length + alerts.length}
                    </span>
                  )}
                </div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  Role: <span className='font-medium capitalize'>{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <AgentsIcon className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                        Total Agents
                      </dt>
                      <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                        {stats?.totalAgents || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <PollingIcon className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                        Active Polling Units
                      </dt>
                      <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                        {stats?.activePollingUnits || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <ReportsIcon className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                        Pending Reports
                      </dt>
                      <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                        {stats?.pendingReports || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
              <div className='p-5'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <ResultsIcon className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                  </div>
                  <div className='ml-5 w-0 flex-1'>
                    <dl>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                        Completed Results
                      </dt>
                      <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                        {stats?.verifiedResults || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Quick Actions */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
              <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Quick Actions</h3>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-2 gap-4'>
                  {quickActions.map(action => (
                    <Link
                      key={action.title}
                      to={action.link}
                      className='group relative bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow'
                    >
                      <div>
                        <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                          {action.icon === 'UsersIcon' && (
                            <AgentsIcon className='h-6 w-6' aria-hidden='true' />
                          )}
                          {action.icon === 'MapPinIcon' && (
                            <PollingIcon className='h-6 w-6' aria-hidden='true' />
                          )}
                          {action.icon === 'DocumentTextIcon' && (
                            <ReportsIcon className='h-6 w-6' aria-hidden='true' />
                          )}
                          {action.icon === 'ChartBarIcon' && (
                            <ResultsIcon className='h-6 w-6' aria-hidden='true' />
                          )}
                        </span>
                      </div>
                      <div className='mt-4'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'>
                          {action.title}
                        </h3>
                        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
              <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Recent Activities
                </h3>
              </div>
              <div className='p-6'>
                {recentActivities.length === 0 ? (
                  <p className='text-gray-500 dark:text-gray-400 text-center py-4'>
                    No recent activities
                  </p>
                ) : (
                  <div className='flow-root'>
                    <ul className='-mb-8'>
                      {recentActivities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className='relative pb-8'>
                            {activityIdx !== recentActivities.length - 1 ? (
                              <span
                                className='absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600'
                                aria-hidden='true'
                              />
                            ) : null}
                            <div className='relative flex space-x-3'>
                              <div className='flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'>
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className='min-w-0 flex-1 pt-1.5 flex justify-between space-x-4'>
                                <div>
                                  <p className='text-sm text-gray-900 dark:text-white'>
                                    {activity.title}
                                  </p>
                                  <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                                    {activity.description}
                                  </p>
                                </div>
                                <div className='text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400'>
                                  {formatTimestamp(activity.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className='mt-6'>
                  <Link
                    to='/app/activities'
                    className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    View all activities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
