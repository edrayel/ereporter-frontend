import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import CustomErrorBoundary from './components/common/CustomErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { store, persistor } from './store';
import { initializeTheme } from './utils/theme';
import './index.css';

// Initialize theme before app renders
initializeTheme();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <CustomErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <App />
                <Toaster
                  position='top-right'
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </BrowserRouter>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </CustomErrorBoundary>
  </React.StrictMode>,
);
