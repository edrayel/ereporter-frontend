import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../../store';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Layout component - Main application layout wrapper
 * Provides sidebar navigation, header, and content area for authenticated users
 */
const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  return (
    <div className='h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />

      {/* Main content */}
      <div className='flex flex-col w-0 flex-1 overflow-hidden'>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className='flex-1 relative overflow-y-auto focus:outline-none'>
          <div className='py-6'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
