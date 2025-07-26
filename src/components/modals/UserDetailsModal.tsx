import React from 'react';
import {
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  DesktopComputerIcon,
  LocationMarkerIcon as MapPinIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'agent' | 'legal';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100';
      case 'coordinator':
        return 'text-blue-600 bg-blue-100';
      case 'agent':
        return 'text-green-600 bg-green-100';
      case 'legal':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className='h-5 w-5 text-green-500' />;
      case 'inactive':
        return <XCircleIcon className='h-5 w-5 text-gray-500' />;
      case 'suspended':
        return <ExclamationCircleIcon className='h-5 w-5 text-red-500' />;
      default:
        return null;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access and user management capabilities';
      case 'coordinator':
        return 'Manages polling units and oversees field agents';
      case 'agent':
        return 'Submits reports and manages assigned polling units';
      case 'legal':
        return 'Reviews reports and handles legal compliance matters';
      default:
        return '';
    }
  };

  const getAccountAge = () => {
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const getLastLoginStatus = () => {
    const lastLogin = new Date(user.lastLogin);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return { text: 'Recently active', color: 'text-green-600' };
    } else if (diffHours < 168) {
      // 7 days
      return { text: 'Active this week', color: 'text-yellow-600' };
    } else {
      return { text: 'Inactive', color: 'text-red-600' };
    }
  };

  const lastLoginStatus = getLastLoginStatus();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='User Details' size='lg'>
      <div className='space-y-6'>
        {/* User Header */}
        <div className='flex items-center space-x-4 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg'>
          <div className='flex-shrink-0'>
            <div className='h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center'>
              <UserIcon className='h-8 w-8 text-white' />
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-semibold text-gray-900'>{user.name}</h3>
            <p className='text-gray-600'>{user.email}</p>
            <div className='flex items-center space-x-3 mt-2'>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
              >
                <ShieldCheckIcon className='h-3 w-3 mr-1' />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
              >
                {getStatusIcon(user.status)}
                <span className='ml-1 capitalize'>{user.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* User Information Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Basic Information */}
          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <UserIcon className='h-5 w-5 mr-2 text-primary-600' />
              Basic Information
            </h4>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-500'>User ID:</span>
                <span className='text-sm text-gray-900 font-mono'>{user.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-500'>Full Name:</span>
                <span className='text-sm text-gray-900'>{user.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-500'>Email:</span>
                <span className='text-sm text-gray-900'>{user.email}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-500'>Role:</span>
                <span className='text-sm text-gray-900 capitalize'>{user.role}</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <CheckCircleIcon className='h-5 w-5 mr-2 text-primary-600' />
              Account Status
            </h4>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-500'>Status:</span>
                <div className='flex items-center'>
                  {getStatusIcon(user.status)}
                  <span className='ml-2 text-sm text-gray-900 capitalize'>{user.status}</span>
                </div>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-500'>Account Age:</span>
                <span className='text-sm text-gray-900'>{getAccountAge()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-500'>Activity:</span>
                <span className={`text-sm font-medium ${lastLoginStatus.color}`}>
                  {lastLoginStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Description */}
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
          <h4 className='text-lg font-medium text-gray-900 mb-2 flex items-center'>
            <ShieldCheckIcon className='h-5 w-5 mr-2 text-primary-600' />
            Role & Permissions
          </h4>
          <p className='text-sm text-gray-700'>{getRoleDescription(user.role)}</p>
        </div>

        {/* Activity Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <CalendarIcon className='h-5 w-5 mr-2 text-primary-600' />
              Account Created
            </h4>
            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>{formatDate(user.createdAt)}</p>
              <p className='text-xs text-gray-500'>Account age: {getAccountAge()}</p>
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <ClockIcon className='h-5 w-5 mr-2 text-primary-600' />
              Last Login
            </h4>
            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>{formatDate(user.lastLogin)}</p>
              <p className={`text-xs font-medium ${lastLoginStatus.color}`}>
                {lastLoginStatus.text}
              </p>
            </div>
          </div>
        </div>

        {/* Mock Additional Information */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
            <DesktopComputerIcon className='h-5 w-5 mr-2 text-blue-600' />
            System Information
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='font-medium text-gray-700'>Assigned Polling Units:</span>
              <span className='ml-2 text-gray-600'>
                {user.role === 'agent'
                  ? '3 units'
                  : user.role === 'coordinator'
                    ? '15 units'
                    : 'All units'}
              </span>
            </div>
            <div>
              <span className='font-medium text-gray-700'>Reports Submitted:</span>
              <span className='ml-2 text-gray-600'>
                {user.role === 'agent'
                  ? '12 reports'
                  : user.role === 'coordinator'
                    ? '45 reports'
                    : 'N/A'}
              </span>
            </div>
            <div>
              <span className='font-medium text-gray-700'>Last IP Address:</span>
              <span className='ml-2 text-gray-600 font-mono'>192.168.1.100</span>
            </div>
            <div>
              <span className='font-medium text-gray-700'>Login Sessions:</span>
              <span className='ml-2 text-gray-600'>127 total</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
