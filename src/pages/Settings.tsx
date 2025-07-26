import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  GlobeIcon,
  DeviceMobileIcon,
  MailIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/outline';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setTheme } from '../store/slices/uiSlice';
import { classNames } from '../utils/helpers';

// Type assertions for Heroicons
const SettingsIcon = CogIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const NotificationIcon = BellIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const SecurityIcon = ShieldCheckIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ProfileIcon = UserIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const LanguageIcon = GlobeIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const MobileIcon = DeviceMobileIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const EmailIcon = MailIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const PasswordIcon = KeyIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const ShowIcon = EyeIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
const HideIcon = EyeOffIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reportAlerts: true,
    systemUpdates: true,
    securityAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: NotificationIcon },
    { id: 'security', name: 'Security', icon: SecurityIcon },
    { id: 'profile', name: 'Profile', icon: ProfileIcon },
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // Show error message
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Show success message
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Settings - eReporter</title>
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='md:flex md:items-center md:justify-between'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate'>
              Settings
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className='lg:grid lg:grid-cols-12 lg:gap-x-5'>
          {/* Sidebar */}
          <aside className='py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3'>
            <nav className='space-y-1'>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={classNames(
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'border-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
                      'group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left',
                    )}
                  >
                    <Icon
                      className={classNames(
                        activeTab === tab.id
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                      )}
                    />
                    <span className='truncate'>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className='space-y-6 sm:px-6 lg:px-0 lg:col-span-9'>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className='space-y-6'>
                <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
                  <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      General Preferences
                    </h3>
                  </div>
                  <div className='p-6 space-y-6'>
                    {/* Theme Selection */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                        Theme
                      </label>
                      <div className='grid grid-cols-2 gap-3'>
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={classNames(
                            'relative rounded-lg border p-4 flex cursor-pointer focus:outline-none',
                            theme === 'light'
                              ? 'border-primary-500 ring-2 ring-primary-500'
                              : 'border-gray-300 dark:border-gray-600',
                          )}
                        >
                          <div className='flex items-center'>
                            <div className='text-sm'>
                              <div className='font-medium text-gray-900 dark:text-gray-100'>
                                Light
                              </div>
                              <div className='text-gray-500 dark:text-gray-400'>Default theme</div>
                            </div>
                          </div>
                          {theme === 'light' && (
                            <div className='absolute -inset-px rounded-lg border-2 border-primary-500 pointer-events-none' />
                          )}
                        </button>
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={classNames(
                            'relative rounded-lg border p-4 flex cursor-pointer focus:outline-none',
                            theme === 'dark'
                              ? 'border-primary-500 ring-2 ring-primary-500'
                              : 'border-gray-300 dark:border-gray-600',
                          )}
                        >
                          <div className='flex items-center'>
                            <div className='text-sm'>
                              <div className='font-medium text-gray-900 dark:text-gray-100'>
                                Dark
                              </div>
                              <div className='text-gray-500 dark:text-gray-400'>Dark theme</div>
                            </div>
                          </div>
                          {theme === 'dark' && (
                            <div className='absolute -inset-px rounded-lg border-2 border-primary-500 pointer-events-none' />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Language
                      </label>
                      <select
                        value={generalSettings.language}
                        onChange={e =>
                          setGeneralSettings({ ...generalSettings, language: e.target.value })
                        }
                        className='form-input'
                      >
                        <option value='en'>English</option>
                        <option value='fr'>French</option>
                        <option value='ha'>Hausa</option>
                        <option value='ig'>Igbo</option>
                        <option value='yo'>Yoruba</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Timezone
                      </label>
                      <select
                        value={generalSettings.timezone}
                        onChange={e =>
                          setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                        }
                        className='form-input'
                      >
                        <option value='Africa/Lagos'>Africa/Lagos (WAT)</option>
                        <option value='UTC'>UTC</option>
                        <option value='America/New_York'>America/New_York (EST)</option>
                      </select>
                    </div>

                    {/* Date Format */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Date Format
                      </label>
                      <select
                        value={generalSettings.dateFormat}
                        onChange={e =>
                          setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })
                        }
                        className='form-input'
                      >
                        <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                        <option value='MM/DD/YYYY'>MM/DD/YYYY</option>
                        <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div className='flex justify-end'>
                      <button
                        onClick={() => handleSaveSettings('general')}
                        disabled={loading}
                        className='btn btn-primary btn-md'
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className='space-y-6'>
                <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
                  <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      Notification Preferences
                    </h3>
                  </div>
                  <div className='p-6 space-y-6'>
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className='flex items-center justify-between'>
                        <div>
                          <h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'smsNotifications' && 'Receive notifications via SMS'}
                            {key === 'pushNotifications' && 'Receive push notifications'}
                            {key === 'reportAlerts' && 'Get alerts for new reports'}
                            {key === 'systemUpdates' && 'Get notified about system updates'}
                            {key === 'securityAlerts' && 'Get security-related alerts'}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setNotificationSettings({ ...notificationSettings, [key]: !value })
                          }
                          className={classNames(
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                            value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                          )}
                        >
                          <span
                            className={classNames(
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                              value ? 'translate-x-5' : 'translate-x-0',
                            )}
                          />
                        </button>
                      </div>
                    ))}

                    <div className='flex justify-end'>
                      <button
                        onClick={() => handleSaveSettings('notifications')}
                        disabled={loading}
                        className='btn btn-primary btn-md'
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className='space-y-6'>
                <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
                  <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      Security Settings
                    </h3>
                  </div>
                  <div className='p-6 space-y-6'>
                    {/* Two-Factor Authentication */}
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                          Two-Factor Authentication
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: !securitySettings.twoFactorAuth,
                          })
                        }
                        className={classNames(
                          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                          securitySettings.twoFactorAuth
                            ? 'bg-primary-600'
                            : 'bg-gray-200 dark:bg-gray-700',
                        )}
                      >
                        <span
                          className={classNames(
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                            securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0',
                          )}
                        />
                      </button>
                    </div>

                    {/* Session Timeout */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Session Timeout (minutes)
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={e =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: parseInt(e.target.value),
                          })
                        }
                        className='form-input'
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={480}>8 hours</option>
                      </select>
                    </div>

                    <div className='flex justify-end'>
                      <button
                        onClick={() => handleSaveSettings('security')}
                        disabled={loading}
                        className='btn btn-primary btn-md'
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
                  <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      Change Password
                    </h3>
                  </div>
                  <form onSubmit={handlePasswordChange} className='p-6 space-y-6'>
                    <div>
                      <label className='form-label'>Current Password</label>
                      <div className='relative'>
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={e =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          className='form-input pr-10'
                          required
                        />
                        <button
                          type='button'
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        >
                          {showCurrentPassword ? (
                            <HideIcon className='h-4 w-4 text-gray-400' />
                          ) : (
                            <ShowIcon className='h-4 w-4 text-gray-400' />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className='form-label'>New Password</label>
                      <div className='relative'>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={e =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          className='form-input pr-10'
                          required
                        />
                        <button
                          type='button'
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        >
                          {showNewPassword ? (
                            <HideIcon className='h-4 w-4 text-gray-400' />
                          ) : (
                            <ShowIcon className='h-4 w-4 text-gray-400' />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className='form-label'>Confirm New Password</label>
                      <div className='relative'>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={e =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          className='form-input pr-10'
                          required
                        />
                        <button
                          type='button'
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        >
                          {showConfirmPassword ? (
                            <HideIcon className='h-4 w-4 text-gray-400' />
                          ) : (
                            <ShowIcon className='h-4 w-4 text-gray-400' />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <button type='submit' disabled={loading} className='btn btn-primary btn-md'>
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className='space-y-6'>
                <div className='bg-white dark:bg-gray-800 shadow rounded-lg'>
                  <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                      Profile Information
                    </h3>
                  </div>
                  <div className='p-6 space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='form-label'>Full Name</label>
                        <input type='text' defaultValue={user?.name || ''} className='form-input' />
                      </div>
                      <div>
                        <label className='form-label'>Email</label>
                        <input
                          type='email'
                          defaultValue={user?.email || ''}
                          className='form-input'
                        />
                      </div>
                      <div>
                        <label className='form-label'>Phone Number</label>
                        <input type='tel' defaultValue={user?.phone || ''} className='form-input' />
                      </div>
                      <div>
                        <label className='form-label'>Role</label>
                        <input
                          type='text'
                          defaultValue={user?.role || ''}
                          className='form-input'
                          disabled
                        />
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <button
                        onClick={() => handleSaveSettings('profile')}
                        disabled={loading}
                        className='btn btn-primary btn-md'
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
