import { ShieldCheckIcon as ShieldExclamationIcon } from '@heroicons/react/outline';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>401 - Unauthorized | eReporter</title>
        <meta name='description' content='You are not authorized to access this page.' />
      </Helmet>

      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-yellow-100'>
            <ShieldExclamationIcon className='h-12 w-12 text-yellow-600' />
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            401 - Unauthorized
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            You are not authorized to access this page.
          </p>
          <div className='mt-6 text-center space-x-4'>
            <Link
              to='/app/dashboard'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Go to Dashboard
            </Link>
            <Link
              to='/login'
              className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
