import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Custom ErrorBoundary component to catch React errors
 * Provides a fallback UI when errors occur
 */
class CustomErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging purposes
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
          <div className='max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h1 className='text-2xl font-bold text-gray-800 mb-2'>Something went wrong</h1>
            <p className='text-gray-600 mb-4'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CustomErrorBoundary;
