import { ExclamationIcon, RefreshIcon } from '@heroicons/react/outline';
import React from 'react';
import { FallbackProps } from 'react-error-boundary';

// Type assertions for Heroicons compatibility
const ExclamationTriangleIcon = ExclamationIcon as React.ComponentType<
  React.SVGProps<SVGSVGElement>
>;
const ArrowPathIcon = RefreshIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <ExclamationTriangleIcon className='mx-auto h-16 w-16 text-red-500' />
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>Something went wrong</h2>
          <p className='mt-2 text-sm text-gray-600'>
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <h3 className='text-sm font-medium text-red-800 mb-2'>Error Details:</h3>
          <pre className='text-xs text-red-700 whitespace-pre-wrap break-words'>
            {(() => {
              if (error?.message) {
                return error.message;
              }
              if (error && typeof error === 'object') {
                try {
                  return error.toString();
                } catch {
                  return 'An unexpected error occurred';
                }
              }
              return error || 'An unexpected error occurred';
            })()}
          </pre>
        </div>

        <div className='flex flex-col space-y-3'>
          <button
            onClick={resetErrorBoundary}
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <ArrowPathIcon className='h-4 w-4 mr-2' />
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className='group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Go to Homepage
          </button>
        </div>

        <div className='text-center'>
          <p className='text-xs text-gray-500'>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
