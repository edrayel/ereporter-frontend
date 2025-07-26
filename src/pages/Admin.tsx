import {
  CogIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationIcon as ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SearchIcon as MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserAddIcon as UserPlusIcon,
  KeyIcon,
  BellIcon,
  ServerIcon,
  DatabaseIcon as CircleStackIcon,
  CloudIcon,
  CalendarIcon,
  UserIcon,
  DesktopComputerIcon as ComputerDesktopIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { classNames } from '../utils/helpers';
import AddUserModal from '../components/modals/AddUserModal';
import EditUserModal from '../components/modals/EditUserModal';
import UserDetailsModal from '../components/modals/UserDetailsModal';

// Mock data types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'agent' | 'legal';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

interface SystemMetrics {
  totalUsers: number;
  activeAgents: number;
  totalPollingUnits: number;
  systemUptime: string;
  storageUsed: string;
  apiRequests: number;
}

/**
 * Admin component - Comprehensive system administration page
 * Features user management, system settings, audit logs, and monitoring
 */
const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'audit'>(
    'overview',
  );
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showSystemResetConfirm, setShowSystemResetConfirm] = useState(false);
  const [showBackupConfirm, setShowBackupConfirm] = useState(false);
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      // Mock users
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@ereporter.ng',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@ereporter.ng',
          role: 'coordinator',
          status: 'active',
          lastLogin: '2024-01-15T09:15:00Z',
          createdAt: '2024-01-02T00:00:00Z',
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@ereporter.ng',
          role: 'agent',
          status: 'inactive',
          lastLogin: '2024-01-14T16:45:00Z',
          createdAt: '2024-01-03T00:00:00Z',
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@ereporter.ng',
          role: 'legal',
          status: 'active',
          lastLogin: '2024-01-15T08:20:00Z',
          createdAt: '2024-01-04T00:00:00Z',
        },
      ];

      // Mock audit logs
      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          action: 'User Login',
          user: 'john.doe@ereporter.ng',
          resource: 'Authentication',
          timestamp: '2024-01-15T10:30:00Z',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success',
        },
        {
          id: '2',
          action: 'Create Polling Unit',
          user: 'jane.smith@ereporter.ng',
          resource: 'Polling Unit PU001',
          timestamp: '2024-01-15T09:45:00Z',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'success',
        },
        {
          id: '3',
          action: 'Failed Login Attempt',
          user: 'unknown@example.com',
          resource: 'Authentication',
          timestamp: '2024-01-15T09:30:00Z',
          ipAddress: '203.0.113.1',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
          status: 'failed',
        },
      ];

      // Mock metrics
      const mockMetrics: SystemMetrics = {
        totalUsers: 1247,
        activeAgents: 892,
        totalPollingUnits: 8856,
        systemUptime: '15 days, 6 hours',
        storageUsed: '2.4 GB / 10 GB',
        apiRequests: 45678,
      };

      setUsers(mockUsers);
      setAuditLogs(mockAuditLogs);
      setMetrics(mockMetrics);
      setLoading(false);
    };

    generateMockData();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900';
      case 'coordinator':
        return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900';
      case 'agent':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900';
      case 'legal':
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900';
      case 'inactive':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
      case 'suspended':
        return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900';
      case 'failed':
        return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900';
      case 'warning':
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handler functions for modals
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleUserAdded = (newUser: any) => {
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, user]);
    setShowAddUserModal(false);
  };

  const handleUserUpdated = (updatedUser: any) => {
    setUsers(prev =>
      prev.map(user => (user.id === selectedUser?.id ? { ...user, ...updatedUser } : user)),
    );
    setShowEditUserModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleExportLogs = () => {
    try {
      const csvContent = generateAuditLogsCSV(auditLogs);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const generateAuditLogsCSV = (logs: AuditLog[]) => {
    const headers = [
      'Action',
      'User',
      'Resource',
      'Status',
      'Timestamp',
      'IP Address',
      'User Agent',
    ];
    const rows = logs.map(log => [
      log.action,
      log.user,
      log.resource,
      log.status,
      formatDate(log.timestamp),
      log.ipAddress,
      log.userAgent,
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleSendAlert = () => {
    // Simulate sending system alert
    alert('System alert sent to all administrators!');
  };

  const handleBackupDatabase = () => {
    setShowBackupConfirm(true);
  };

  const confirmBackupDatabase = () => {
    // Simulate database backup
    setShowBackupConfirm(false);
    alert('Database backup initiated successfully!');
  };

  const handleClearCache = () => {
    setShowClearCacheConfirm(true);
  };

  const confirmClearCache = () => {
    // Simulate cache clearing
    setShowClearCacheConfirm(false);
    alert('System cache cleared successfully!');
  };

  const handleSystemReset = () => {
    setShowSystemResetConfirm(true);
  };

  const confirmSystemReset = () => {
    // Simulate system reset
    setShowSystemResetConfirm(false);
    alert('System reset initiated. Please wait...');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin - eReporter</title>
        <meta name='description' content='System administration and configuration' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <CogIcon className='h-8 w-8 text-primary-600' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Administration</h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                System administration and configuration
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'overview', name: 'Overview', icon: 'ChartBarIcon' },
              { id: 'users', name: 'User Management', icon: 'UsersIcon' },
              { id: 'settings', name: 'System Settings', icon: 'CogIcon' },
              { id: 'audit', name: 'Audit Logs', icon: 'DocumentTextIcon' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={classNames(
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                )}
              >
                {tab.icon === 'ChartBarIcon' ? <ChartBarIcon className='h-4 w-4' /> : null}
                {tab.icon === 'UsersIcon' ? <UsersIcon className='h-4 w-4' /> : null}
                {tab.icon === 'CogIcon' ? <CogIcon className='h-4 w-4' /> : null}
                {tab.icon === 'DocumentTextIcon' ? <DocumentTextIcon className='h-4 w-4' /> : null}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* System Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <UsersIcon className='h-6 w-6 text-primary-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                          Total Users
                        </dt>
                        <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                          {metrics?.totalUsers}
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
                      <CheckCircleIcon className='h-6 w-6 text-success-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                          Active Agents
                        </dt>
                        <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                          {metrics?.activeAgents}
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
                      <ServerIcon className='h-6 w-6 text-secondary-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                          System Uptime
                        </dt>
                        <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                          {metrics?.systemUptime}
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
                      <CircleStackIcon className='h-6 w-6 text-warning-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                          Storage Used
                        </dt>
                        <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                          {metrics?.storageUsed}
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
                      <CloudIcon className='h-6 w-6 text-gray-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                          API Requests
                        </dt>
                        <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                          {metrics?.apiRequests.toLocaleString()}
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
                      <ComputerDesktopIcon className='h-6 w-6 text-primary-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                          Polling Units
                        </dt>
                        <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                          {metrics?.totalPollingUnits}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Quick Actions
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className='flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <UserPlusIcon className='h-8 w-8 text-primary-600 dark:text-primary-400 mb-2' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Add User
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className='flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <CogIcon className='h-8 w-8 text-warning-600 dark:text-warning-400 mb-2' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    System Settings
                  </span>
                </button>
                <button
                  onClick={handleExportLogs}
                  className='flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <DocumentTextIcon className='h-8 w-8 text-secondary-600 dark:text-secondary-400 mb-2' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Export Logs
                  </span>
                </button>
                <button
                  onClick={handleSendAlert}
                  className='flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <BellIcon className='h-8 w-8 text-success-600 dark:text-success-400 mb-2' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Send Alert
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className='space-y-6'>
            {/* Search and Filters */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
                    <input
                      type='text'
                      placeholder='Search users...'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                    />
                  </div>
                </div>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                >
                  <option value=''>All Roles</option>
                  <option value='admin'>Admin</option>
                  <option value='coordinator'>Coordinator</option>
                  <option value='agent'>Agent</option>
                  <option value='legal'>Legal</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                >
                  <option value=''>All Status</option>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                  <option value='suspended'>Suspended</option>
                </select>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2'
                >
                  <UserPlusIcon className='h-4 w-4' />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        User
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Role
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Last Login
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              <div className='h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center'>
                                <UserIcon className='h-5 w-5 text-primary-600 dark:text-primary-400' />
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                {user.name}
                              </div>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={classNames(
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getRoleColor(user.role),
                            )}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={classNames(
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getStatusColor(user.status),
                            )}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => handleViewUser(user)}
                              className='text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300'
                            >
                              <EyeIcon className='h-4 w-4' />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                            >
                              <PencilIcon className='h-4 w-4' />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className='text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300'
                            >
                              <TrashIcon className='h-4 w-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'settings' && (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* General Settings */}
              <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  General Settings
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      System Name
                    </label>
                    <input
                      type='text'
                      defaultValue='eReporter System'
                      className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Time Zone
                    </label>
                    <select className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'>
                      <option>Africa/Lagos</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Session Timeout (minutes)
                    </label>
                    <input
                      type='number'
                      defaultValue='30'
                      className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Security Settings
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Two-Factor Authentication
                      </label>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Require 2FA for all admin users
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Password Complexity
                      </label>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Enforce strong password requirements
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      defaultChecked
                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Max Login Attempts
                    </label>
                    <input
                      type='number'
                      defaultValue='5'
                      className='mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Notification Settings
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Email Notifications
                      </label>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Send system alerts via email
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      defaultChecked
                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        SMS Notifications
                      </label>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Send critical alerts via SMS
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                    />
                  </div>
                </div>
              </div>

              {/* System Maintenance */}
              <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  System Maintenance
                </h3>
                <div className='space-y-4'>
                  <button
                    onClick={handleBackupDatabase}
                    className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                  >
                    <CircleStackIcon className='h-4 w-4 mr-2' />
                    Backup Database
                  </button>
                  <button
                    onClick={handleClearCache}
                    className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                  >
                    <ServerIcon className='h-4 w-4 mr-2' />
                    Clear Cache
                  </button>
                  <button
                    onClick={handleSystemReset}
                    className='w-full flex items-center justify-center px-4 py-2 border border-error-300 rounded-md shadow-sm text-sm font-medium text-error-700 bg-white hover:bg-error-50'
                  >
                    <ExclamationTriangleIcon className='h-4 w-4 mr-2' />
                    System Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className='space-y-6'>
            {/* Audit Logs Table */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Audit Logs</h3>
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Action
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        User
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Resource
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Timestamp
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                    {auditLogs.map(log => (
                      <tr key={log.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                          {log.action}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {log.user}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {log.resource}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={classNames(
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getAuditStatusColor(log.status),
                            )}
                          >
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {formatDate(log.timestamp)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleUserAdded}
      />

      <EditUserModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => {
          setShowUserDetailsModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Confirmation Dialogs */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3 text-center'>
              <ExclamationTriangleIcon className='mx-auto h-12 w-12 text-red-600' />
              <h3 className='text-lg font-medium text-gray-900 mt-2'>Delete User</h3>
              <div className='mt-2 px-7 py-3'>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete {userToDelete?.name}? This action cannot be
                  undone.
                </p>
              </div>
              <div className='flex justify-center space-x-3 mt-4'>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className='px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBackupConfirm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3 text-center'>
              <CircleStackIcon className='mx-auto h-12 w-12 text-blue-600' />
              <h3 className='text-lg font-medium text-gray-900 mt-2'>Backup Database</h3>
              <div className='mt-2 px-7 py-3'>
                <p className='text-sm text-gray-500'>
                  This will create a full backup of the database. The process may take several
                  minutes.
                </p>
              </div>
              <div className='flex justify-center space-x-3 mt-4'>
                <button
                  onClick={() => setShowBackupConfirm(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBackupDatabase}
                  className='px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700'
                >
                  Start Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClearCacheConfirm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3 text-center'>
              <ServerIcon className='mx-auto h-12 w-12 text-yellow-600' />
              <h3 className='text-lg font-medium text-gray-900 mt-2'>Clear Cache</h3>
              <div className='mt-2 px-7 py-3'>
                <p className='text-sm text-gray-500'>
                  This will clear all system cache. Users may experience slower performance
                  temporarily.
                </p>
              </div>
              <div className='flex justify-center space-x-3 mt-4'>
                <button
                  onClick={() => setShowClearCacheConfirm(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearCache}
                  className='px-4 py-2 bg-yellow-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-yellow-700'
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSystemResetConfirm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3 text-center'>
              <ExclamationTriangleIcon className='mx-auto h-12 w-12 text-red-600' />
              <h3 className='text-lg font-medium text-gray-900 mt-2'>System Reset</h3>
              <div className='mt-2 px-7 py-3'>
                <p className='text-sm text-gray-500'>
                  <strong>WARNING:</strong> This will reset the entire system to factory defaults.
                  All data will be lost. This action cannot be undone.
                </p>
              </div>
              <div className='flex justify-center space-x-3 mt-4'>
                <button
                  onClick={() => setShowSystemResetConfirm(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSystemReset}
                  className='px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700'
                >
                  Reset System
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
