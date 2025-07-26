import {
  UserIcon,
  MailIcon as EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
} from '@heroicons/react/outline';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getInitials } from '../utils/helpers';

/**
 * Profile component - User profile management page
 * Displays user information and allows profile updates
 */
const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Helmet>
        <title>Profile - eReporter</title>
        <meta name='description' content='Manage your profile and account settings' />
      </Helmet>

      <div className='space-y-6'>
        <div className='flex items-center space-x-3'>
          <UserIcon className='h-8 w-8 text-primary-600' />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Profile</h1>
            <p className='text-sm text-gray-600'>Manage your profile and account settings</p>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>Personal Information</h3>
          </div>

          <div className='p-6'>
            <div className='flex items-center space-x-6 mb-6'>
              <div className='h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center'>
                <span className='text-primary-600 font-bold text-2xl'>
                  {getInitials(user?.name)}
                </span>
              </div>
              <div>
                <h4 className='text-xl font-semibold text-gray-900'>{user?.name}</h4>
                <p className='text-sm text-gray-500 capitalize'>{user?.role}</p>
                <button className='mt-2 text-sm text-primary-600 hover:text-primary-500'>
                  Change photo
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <IdentificationIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Full Name</p>
                    <p className='text-sm text-gray-600'>{user?.name}</p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <EnvelopeIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Email</p>
                    <p className='text-sm text-gray-600'>{user?.email}</p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <PhoneIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Phone</p>
                    <p className='text-sm text-gray-600'>{user?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>Role</p>
                  <p className='text-sm text-gray-600 capitalize'>{user?.role}</p>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-900'>Status</p>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Active
                  </span>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-900'>Member Since</p>
                  <p className='text-sm text-gray-600'>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-8 flex space-x-4'>
              <button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                Edit Profile
              </button>
              <button className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>Account Settings</h3>
          </div>

          <div className='p-6'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>Email Notifications</p>
                  <p className='text-sm text-gray-500'>
                    Receive email notifications for important updates
                  </p>
                </div>
                <button className='relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-primary-600'>
                  <span className='translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'></span>
                </button>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>SMS Notifications</p>
                  <p className='text-sm text-gray-500'>
                    Receive SMS notifications for urgent alerts
                  </p>
                </div>
                <button className='relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-gray-200'>
                  <span className='translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'></span>
                </button>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>Two-Factor Authentication</p>
                  <p className='text-sm text-gray-500'>
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button className='text-sm text-primary-600 hover:text-primary-500'>Enable</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
