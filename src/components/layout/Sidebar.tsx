import { Dialog, Transition } from '@headlessui/react';
import {
  XIcon as XMarkIcon,
  HomeIcon,
  UsersIcon,
  LocationMarkerIcon as MapPinIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
} from '@heroicons/react/outline';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import { classNames } from '../../utils/helpers';

// Type assertions for Heroicons compatibility
const CloseIcon = XMarkIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const DashboardIcon = HomeIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const AgentsIcon = UsersIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const PollingIcon = MapPinIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ReportsIcon = DocumentTextIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ResultsIcon = ChartBarIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const AdminIcon = CogIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ProfileIcon = UserIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}

/**
 * Sidebar component - Navigation sidebar for the application
 * Provides navigation links and user role-based menu items
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose, collapsed }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: 'HomeIcon',
      current: location.pathname === '/app/dashboard',
    },
    {
      name: 'Agents',
      href: '/app/agents',
      icon: 'UsersIcon',
      current: location.pathname.startsWith('/app/agents'),
    },
    {
      name: 'Polling Units',
      href: '/app/polling-units',
      icon: 'MapPinIcon',
      current: location.pathname.startsWith('/app/polling-units'),
    },
    {
      name: 'Reports',
      href: '/app/reports',
      icon: 'DocumentTextIcon',
      current: location.pathname.startsWith('/app/reports'),
    },
    {
      name: 'Results',
      href: '/app/results',
      icon: 'ChartBarIcon',
      current: location.pathname.startsWith('/app/results'),
    },
  ];

  // Add admin-only navigation items
  if (user?.role === 'admin') {
    navigation.push({
      name: 'Admin',
      href: '/app/admin',
      icon: 'CogIcon',
      current: location.pathname.startsWith('/app/admin'),
    });
  }

  navigation.push({
    name: 'Profile',
    href: '/app/profile',
    icon: 'UserIcon',
    current: location.pathname.startsWith('/app/profile'),
  });

  const SidebarContent = () => (
    <div className='flex flex-col h-full'>
      {/* Logo */}
      <div className='flex items-center h-16 flex-shrink-0 px-4 bg-primary-600'>
        <div className='flex items-center'>
          <div className='h-8 w-8 bg-white rounded-full flex items-center justify-center'>
            <span className='text-primary-600 font-bold text-lg'>E</span>
          </div>
          {!collapsed && <span className='ml-2 text-white font-semibold text-lg'>eReporter</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-2 pt-4 bg-white dark:bg-gray-800 space-y-1'>
        {navigation.map(item => (
          <Link
            key={item.name}
            to={item.href}
            className={classNames(
              item.current
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
            )}
            onClick={() => onClose()}
          >
            {item.name === 'Dashboard' && (
              <DashboardIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {item.name === 'Agents' && (
              <AgentsIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {item.name === 'Polling Units' && (
              <PollingIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {item.name === 'Reports' && (
              <ReportsIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {item.name === 'Results' && (
              <ResultsIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {item.name === 'Admin' && (
              <AdminIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {item.name === 'Profile' && (
              <ProfileIcon
                className={classNames(
                  item.current
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                  'mr-3 flex-shrink-0 h-6 w-6',
                )}
                aria-hidden='true'
              />
            )}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* User info */}
      {!collapsed && (
        <div className='flex-shrink-0 flex border-t border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-800'>
          <div className='flex items-center'>
            <div className='h-9 w-9 bg-primary-100 rounded-full flex items-center justify-center'>
              <span className='text-primary-600 font-medium text-sm'>
                {user?.name
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{user?.name}</p>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400 capitalize'>
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-40 md:hidden' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75' />
          </Transition.Child>

          <div className='fixed inset-0 flex z-40'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-0 right-0 -mr-12 pt-2'>
                    <button
                      type='button'
                      className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                      onClick={onClose}
                    >
                      <span className='sr-only'>Close sidebar</span>
                      <CloseIcon className='h-6 w-6 text-white' aria-hidden='true' />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
            <div className='flex-shrink-0 w-14'>
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div
        className={`hidden md:flex md:flex-shrink-0 ${collapsed ? 'md:w-16' : 'md:w-64'} transition-all duration-300`}
      >
        <div className='flex flex-col w-full'>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
