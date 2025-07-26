import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (user: User) => void;
}

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'agent' | 'legal';
  status: 'active' | 'inactive' | 'suspended';
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'agent',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: User = {
        ...user,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };

      onUserUpdated(updatedUser);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access and user management';
      case 'coordinator':
        return 'Manage polling units and oversee agents';
      case 'agent':
        return 'Submit reports and manage assigned polling units';
      case 'legal':
        return 'Review reports and handle legal matters';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircleIcon className="h-4 w-4 text-gray-500" />;
      case 'suspended':
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit User" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-2">User Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">User ID:</span>
              <span className="ml-2 text-gray-600">{user.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Login:</span>
              <span className="ml-2 text-gray-600">
                {new Date(user.lastLogin).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Current Status:</span>
              <span className="ml-2 flex items-center">
                {getStatusIcon(user.status)}
                <span className="ml-1 capitalize">{user.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="h-4 w-4 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <MailIcon className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            <ShieldCheckIcon className="h-4 w-4 inline mr-1" />
            User Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="agent">Agent</option>
            <option value="coordinator">Coordinator</option>
            <option value="legal">Legal Officer</option>
            <option value="admin">Administrator</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {getRoleDescription(formData.role)}
          </p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Account Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <div className="mt-2 text-sm text-gray-600">
            <div className="space-y-1">
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span><strong>Active:</strong> User can log in and access the system</span>
              </div>
              <div className="flex items-center">
                <XCircleIcon className="h-4 w-4 text-gray-500 mr-2" />
                <span><strong>Inactive:</strong> User account is disabled temporarily</span>
              </div>
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                <span><strong>Suspended:</strong> User account is blocked due to violations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;