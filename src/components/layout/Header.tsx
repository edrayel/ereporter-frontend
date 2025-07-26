import { Menu, Transition } from '@headlessui/react';
import {
  MenuAlt3Icon as MenuIcon,
  BellIcon,
  UserIcon,
  CogIcon,
  LogoutIcon as ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/outline';
import React, { Fragment } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleSidebar, toggleSidebarCollapsed, toggleTheme } from '../../store/slices/uiSlice';
import { classNames, getInitials } from '../../utils/helpers';

// Type assertions for Heroicons compatibility with TypeScript
const MenuIconComponent = MenuIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const NotificationIcon = BellIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ProfileIcon = UserIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const SettingsIcon = CogIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const LogoutIcon = ArrowRightOnRectangleIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const LightIcon = SunIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const DarkIcon = MoonIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Header component - Top navigation bar
 * Provides menu toggle, notifications, user menu, and theme toggle
 */
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const userNavigation = [
    { name: 'Your Profile', href: '/app/profile', icon: 'UserIcon' },
    { name: 'Settings', href: '/app/settings', icon: 'CogIcon' },
  ];

  return (
    <div className='relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700'>
      {/* Mobile menu button */}
      <button
        type='button'
        className='flex items-center px-4 border-r border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden'
        onClick={onMenuClick}
      >
        <span className='sr-only'>Open sidebar</span>
        <MenuIconComponent className='h-6 w-6' aria-hidden='true' />
      </button>

      {/* Desktop sidebar toggle */}
      <button
        type='button'
        className='hidden md:flex md:items-center px-4 border-r border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
        onClick={() => dispatch(toggleSidebarCollapsed())}
      >
        <span className='sr-only'>Toggle sidebar</span>
        <MenuIconComponent className='h-6 w-6' aria-hidden='true' />
      </button>

      <div className='flex-1 px-4 flex justify-between'>
        <div className='flex-1 flex'>{/* Search could go here */}</div>

        <div className='ml-4 flex items-center md:ml-6 space-x-4'>
          {/* Theme toggle */}
          <button
            type='button'
            className='bg-white dark:bg-gray-700 p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            onClick={handleThemeToggle}
          >
            <span className='sr-only'>Toggle theme</span>
            {theme === 'dark' ? (
              <LightIcon className='h-6 w-6' aria-hidden='true' />
            ) : (
              <DarkIcon className='h-6 w-6' aria-hidden='true' />
            )}
          </button>

          {/* Notifications */}
          <button
            type='button'
            className='bg-white dark:bg-gray-700 p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative'
            onClick={() => navigate('/app/notifications')}
          >
            <span className='sr-only'>View notifications</span>
            <NotificationIcon className='h-6 w-6' aria-hidden='true' />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <Menu as='div' className='ml-3 relative'>
            <div>
              <Menu.Button className='max-w-xs bg-white dark:bg-gray-700 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                <span className='sr-only'>Open user menu</span>
                <div className='h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center'>
                  <span className='text-primary-600 font-medium text-sm'>
                    {getInitials(user?.name)}
                  </span>
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none'>
                {/* User info */}
                <div className='px-4 py-2 border-b border-gray-100 dark:border-gray-700'>
                  <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                    {user?.name}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
                  <p className='text-xs text-gray-400 dark:text-gray-500 capitalize'>
                    {user?.role}
                  </p>
                </div>

                {/* Navigation items */}
                {userNavigation.map(item => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <button
                        onClick={() => navigate(item.href)}
                        className={classNames(
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                        )}
                      >
                        {item.name === 'Your Profile' && (
                          <ProfileIcon className='mr-3 h-4 w-4' aria-hidden='true' />
                        )}
                        {item.name === 'Settings' && (
                          <SettingsIcon className='mr-3 h-4 w-4' aria-hidden='true' />
                        )}
                        {item.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}

                {/* Logout */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                      )}
                    >
                      <LogoutIcon className='mr-3 h-4 w-4' aria-hidden='true' />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
