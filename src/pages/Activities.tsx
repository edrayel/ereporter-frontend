import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LoginIcon,
  LogoutIcon,
  CheckCircleIcon,
  ExclamationIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { classNames } from '../utils/helpers';

// Type assertions for Heroicons
const ActivityIcon = ClockIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const UserActivityIcon = UserIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ReportIcon = DocumentTextIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ResultIcon = ChartBarIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const LoginActivityIcon = LoginIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const LogoutActivityIcon = LogoutIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const SuccessIcon = CheckCircleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const WarningIcon = ExclamationIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const SearchActivityIcon = SearchIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const FilterActivityIcon = FilterIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ExportIcon = DownloadIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Activity {
  id: string;
  type:
    | 'login'
    | 'logout'
    | 'report_submitted'
    | 'result_uploaded'
    | 'agent_approved'
    | 'incident_resolved'
    | 'system_update'
    | 'user_created'
    | 'settings_changed';
  title: string;
  description: string;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: {
    pollingUnit?: string;
    reportId?: string;
    resultId?: string;
    ipAddress?: string;
    location?: string;
  };
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock activities data
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'result_uploaded',
      title: 'Election Results Uploaded',
      description: 'Results for Polling Unit PU001 uploaded successfully',
      user: { name: 'John Doe', role: 'Agent' },
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      metadata: { pollingUnit: 'PU001', resultId: 'RES001' },
    },
    {
      id: '2',
      type: 'login',
      title: 'User Login',
      description: 'User logged into the system',
      user: { name: 'Jane Smith', role: 'Supervisor' },
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      metadata: { ipAddress: '192.168.1.100', location: 'Lagos, Nigeria' },
    },
    {
      id: '3',
      type: 'report_submitted',
      title: 'Incident Report Submitted',
      description: 'New incident report submitted for review',
      user: { name: 'Mike Johnson', role: 'Agent' },
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      metadata: { reportId: 'RPT001', pollingUnit: 'PU002' },
    },
    {
      id: '4',
      type: 'agent_approved',
      title: 'Agent Approved',
      description: 'New agent application approved',
      user: { name: 'Admin User', role: 'Admin' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
    {
      id: '5',
      type: 'incident_resolved',
      title: 'Incident Resolved',
      description: 'Security incident at PU003 has been resolved',
      user: { name: 'Security Team', role: 'Security' },
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      metadata: { pollingUnit: 'PU003' },
    },
    {
      id: '6',
      type: 'system_update',
      title: 'System Update',
      description: 'System configuration updated',
      user: { name: 'System', role: 'System' },
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    },
    {
      id: '7',
      type: 'user_created',
      title: 'New User Created',
      description: 'New user account created for Sarah Wilson',
      user: { name: 'Admin User', role: 'Admin' },
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    },
    {
      id: '8',
      type: 'logout',
      title: 'User Logout',
      description: 'User logged out of the system',
      user: { name: 'Bob Brown', role: 'Agent' },
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
      metadata: { ipAddress: '192.168.1.105' },
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LoginActivityIcon className='h-5 w-5 text-success-600' />;
      case 'logout':
        return <LogoutActivityIcon className='h-5 w-5 text-gray-600' />;
      case 'report_submitted':
        return <ReportIcon className='h-5 w-5 text-warning-600' />;
      case 'result_uploaded':
        return <ResultIcon className='h-5 w-5 text-primary-600' />;
      case 'agent_approved':
        return <SuccessIcon className='h-5 w-5 text-success-600' />;
      case 'incident_resolved':
        return <SuccessIcon className='h-5 w-5 text-success-600' />;
      case 'system_update':
        return <WarningIcon className='h-5 w-5 text-warning-600' />;
      case 'user_created':
        return <UserActivityIcon className='h-5 w-5 text-primary-600' />;
      case 'settings_changed':
        return <WarningIcon className='h-5 w-5 text-warning-600' />;
      default:
        return <ActivityIcon className='h-5 w-5 text-gray-600' />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'login':
      case 'agent_approved':
      case 'incident_resolved':
        return 'bg-success-100';
      case 'logout':
        return 'bg-gray-100';
      case 'report_submitted':
      case 'system_update':
      case 'settings_changed':
        return 'bg-warning-100';
      case 'result_uploaded':
      case 'user_created':
        return 'bg-primary-100';
      default:
        return 'bg-gray-100';
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

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-error-100 text-error-800';
      case 'supervisor':
        return 'bg-warning-100 text-warning-800';
      case 'agent':
        return 'bg-primary-100 text-primary-800';
      case 'security':
        return 'bg-secondary-100 text-secondary-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || activity.type === typeFilter;

    // Date filtering logic would go here
    const matchesDate = true; // Simplified for now

    return matchesSearch && matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'login', label: 'User Logins' },
    { value: 'logout', label: 'User Logouts' },
    { value: 'report_submitted', label: 'Reports Submitted' },
    { value: 'result_uploaded', label: 'Results Uploaded' },
    { value: 'agent_approved', label: 'Agent Approvals' },
    { value: 'incident_resolved', label: 'Incidents Resolved' },
    { value: 'system_update', label: 'System Updates' },
    { value: 'user_created', label: 'User Creation' },
  ];

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting activities...');
  };

  return (
    <>
      <Helmet>
        <title>Activities - eReporter</title>
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='md:flex md:items-center md:justify-between'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate'>
              Activity Log
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Track all system activities and user actions
            </p>
          </div>
          <div className='mt-4 flex md:mt-0 md:ml-4'>
            <button
              onClick={handleExport}
              className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              <ExportIcon className='h-4 w-4 mr-2' />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <ActivityIcon className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Total Activities
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      {activities.length}
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
                  <LoginActivityIcon className='h-6 w-6 text-success-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      User Logins
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      {activities.filter(a => a.type === 'login').length}
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
                  <ReportIcon className='h-6 w-6 text-warning-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Reports Submitted
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      {activities.filter(a => a.type === 'report_submitted').length}
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
                  <ResultIcon className='h-6 w-6 text-primary-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Results Uploaded
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      {activities.filter(a => a.type === 'result_uploaded').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Search */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Search Activities
              </label>
              <div className='relative'>
                <SearchActivityIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder='Search by title, description, or user...'
                  className='form-input pl-10'
                />
              </div>
            </div>

            {/* Activity Type Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Activity Type
              </label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className='form-input'
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className='form-input'
              >
                <option value='today'>Today</option>
                <option value='yesterday'>Yesterday</option>
                <option value='week'>This Week</option>
                <option value='month'>This Month</option>
                <option value='all'>All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
          <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
              Recent Activities ({filteredActivities.length})
            </h3>
          </div>

          {loading ? (
            <div className='p-6 text-center'>
              <div className='spinner mx-auto'></div>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>Loading activities...</p>
            </div>
          ) : paginatedActivities.length === 0 ? (
            <div className='p-6 text-center'>
              <ActivityIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
                No activities found
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              {paginatedActivities.map(activity => (
                <div
                  key={activity.id}
                  className='p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <div className='flex items-start space-x-3'>
                    <div
                      className={classNames(
                        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                        getActivityBgColor(activity.type),
                      )}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            {activity.title}
                          </h4>
                          <span
                            className={classNames(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              getRoleColor(activity.user.role),
                            )}
                          >
                            {activity.user.role}
                          </span>
                        </div>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                        {activity.description}
                      </p>
                      <div className='mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                        <span>By: {activity.user.name}</span>
                        {activity.metadata?.pollingUnit && (
                          <span>Polling Unit: {activity.metadata.pollingUnit}</span>
                        )}
                        {activity.metadata?.ipAddress && (
                          <span>IP: {activity.metadata.ipAddress}</span>
                        )}
                        {activity.metadata?.location && (
                          <span>Location: {activity.metadata.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-700 dark:text-gray-300'>
                  Showing {startIndex + 1} to{' '}
                  {Math.min(startIndex + itemsPerPage, filteredActivities.length)} of{' '}
                  {filteredActivities.length} activities
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700'
                  >
                    Previous
                  </button>
                  <span className='px-3 py-1 text-sm text-gray-700 dark:text-gray-300'>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700'
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Activities;
