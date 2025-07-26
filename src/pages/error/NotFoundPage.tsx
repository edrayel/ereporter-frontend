import { ExclamationIcon as ExclamationTriangleIcon } from '@heroicons/react/outline';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | eReporter</title>
        <meta name='description' content='The page you are looking for could not be found.' />
      </Helmet>

      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100'>
            <ExclamationTriangleIcon className='h-12 w-12 text-red-600' />
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            404 - Page Not Found
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            The page you are looking for could not be found.
          </p>
          <div className='mt-6 text-center'>
            <Link
              to='/app/dashboard'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
