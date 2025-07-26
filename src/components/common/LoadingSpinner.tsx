import React from 'react';

/**
 * LoadingSpinner component - Simple loading indicator
 * Used during app initialization and data loading states
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='flex flex-col items-center space-y-4'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <p className='text-gray-600 text-sm'>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
