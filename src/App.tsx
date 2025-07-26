import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/layout/Layout';

// Public Pages
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard';

// Main Pages
import Admin from './pages/Admin';
import Agents from './pages/Agents';
import PollingUnits from './pages/PollingUnits';
import Reports from './pages/Reports';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Activities from './pages/Activities';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';
import { RootState } from './store';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Helmet>
        <title>EReporter - Election Monitoring Dashboard</title>
        <meta name='description' content='Real-time election monitoring and reporting system' />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route
          path='/'
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path='/app'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to='/app/dashboard' replace />} />
          <Route path='dashboard' element={<Dashboard />} />

          {/* Agents */}
          <Route path='agents' element={<Agents />} />

          {/* Polling Units */}
          <Route path='polling-units' element={<PollingUnits />} />

          {/* Reports */}
          <Route path='reports' element={<Reports />} />

          {/* Results */}
          <Route path='results' element={<Results />} />

          {/* Admin Routes - Only for admin users */}
          <Route
            path='admin'
            element={
              <ProtectedRoute requiredRole='admin'>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route path='profile' element={<Profile />} />

          {/* Notifications */}
          <Route path='notifications' element={<Notifications />} />

          {/* Settings */}
          <Route path='settings' element={<Settings />} />

          {/* Activities */}
          <Route path='activities' element={<Activities />} />

          {/* Error Pages */}
          <Route path='unauthorized' element={<UnauthorizedPage />} />
        </Route>

        {/* 404 Page */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
