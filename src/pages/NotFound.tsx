import { ExclamationIcon, HomeIcon } from '@heroicons/react/outline';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

/**
 * NotFound component - 404 error page
 * Displays when user navigates to a non-existent route
 */
const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - eReporter</title>
        <meta name='description' content="The page you're looking for doesn't exist" />
      </Helmet>

      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 text-center'>
          <div>
            <ExclamationIcon className='mx-auto h-16 w-16 text-gray-400' />
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>Page not found</h2>
            <p className='mt-2 text-sm text-gray-600'>
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>

          <div className='mt-8'>
            <Link
              to='/app/dashboard'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              <HomeIcon className='mr-2 h-4 w-4' />
              Go back home
            </Link>
          </div>

          <div className='mt-6'>
            <p className='text-xs text-gray-500'>
              Error 404 - The requested page could not be found.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
