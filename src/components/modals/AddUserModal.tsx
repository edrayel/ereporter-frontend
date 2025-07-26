import React, { useState } from 'react';
import {
  UserIcon,
  MailIcon,
  KeyIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: any) => void;
}

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'agent' | 'legal';
  password: string;
  confirmPassword: string;
  sendWelcomeEmail: boolean;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'agent',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'active' as const,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      onUserAdded(newUser);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'agent',
      password: '',
      confirmPassword: '',
      sendWelcomeEmail: true,
    });
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Add New User' size='lg'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='flex'>
              <ExclamationCircleIcon className='h-5 w-5 text-red-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <p className='mt-1 text-sm text-red-700'>{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
              <UserIcon className='h-4 w-4 inline mr-1' />
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Enter full name'
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
              <MailIcon className='h-4 w-4 inline mr-1' />
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Enter email address'
            />
          </div>
        </div>

        <div>
          <label htmlFor='role' className='block text-sm font-medium text-gray-700 mb-1'>
            <ShieldCheckIcon className='h-4 w-4 inline mr-1' />
            User Role
          </label>
          <select
            id='role'
            name='role'
            value={formData.role}
            onChange={handleInputChange}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
          >
            <option value='agent'>Agent</option>
            <option value='coordinator'>Coordinator</option>
            <option value='legal'>Legal Officer</option>
            <option value='admin'>Administrator</option>
          </select>
          <p className='mt-1 text-sm text-gray-500'>{getRoleDescription(formData.role)}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              <KeyIcon className='h-4 w-4 inline mr-1' />
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Enter password'
            />
            <p className='mt-1 text-xs text-gray-500'>Minimum 8 characters required</p>
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              <KeyIcon className='h-4 w-4 inline mr-1' />
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Confirm password'
            />
          </div>
        </div>

        <div className='flex items-center'>
          <input
            type='checkbox'
            id='sendWelcomeEmail'
            name='sendWelcomeEmail'
            checked={formData.sendWelcomeEmail}
            onChange={handleInputChange}
            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
          />
          <label htmlFor='sendWelcomeEmail' className='ml-2 block text-sm text-gray-900'>
            Send welcome email with login instructions
          </label>
        </div>

        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
