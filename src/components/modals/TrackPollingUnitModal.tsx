import React, { useState, useEffect } from 'react';
import {
  LocationMarkerIcon as MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  RefreshIcon,
  EyeIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { PollingUnit } from '../../types/pollingUnit';

interface TrackPollingUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollingUnit: PollingUnit | null;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'check-in' | 'status-update' | 'report' | 'alert';
  message: string;
  agent?: string;
  status: 'success' | 'warning' | 'error';
}

interface LiveStats {
  agentsOnSite: number;
  lastActivity: string;
  voterTurnout: number;
  incidentReports: number;
  systemStatus: 'online' | 'offline' | 'maintenance';
}

const TrackPollingUnitModal: React.FC<TrackPollingUnitModalProps> = ({
  isOpen,
  onClose,
  pollingUnit,
}) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    agentsOnSite: 0,
    lastActivity: '',
    voterTurnout: 0,
    incidentReports: 0,
    systemStatus: 'online',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (pollingUnit && isOpen) {
      generateMockData();
      const interval = setInterval(generateMockData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [pollingUnit, isOpen]);

  const generateMockData = () => {
    // Generate mock activity logs
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        type: 'check-in',
        message: 'Agent checked in successfully',
        agent: 'Agent Smith',
        status: 'success',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        type: 'status-update',
        message: 'Polling unit status updated to active',
        status: 'success',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        type: 'report',
        message: 'Voter turnout report submitted',
        agent: 'Agent Johnson',
        status: 'success',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        type: 'alert',
        message: 'Minor equipment issue reported',
        agent: 'Agent Brown',
        status: 'warning',
      },
    ];

    // Generate mock live stats
    const mockStats: LiveStats = {
      agentsOnSite: Math.floor(Math.random() * 5) + 1,
      lastActivity: new Date(Date.now() - Math.random() * 10 * 60000).toISOString(),
      voterTurnout: Math.floor(Math.random() * 80) + 10,
      incidentReports: Math.floor(Math.random() * 3),
      systemStatus: Math.random() > 0.1 ? 'online' : 'maintenance',
    };

    setActivityLogs(mockLogs);
    setLiveStats(mockStats);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    generateMockData();
    setIsRefreshing(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'check-in':
        return <UsersIcon className='h-4 w-4' />;
      case 'status-update':
        return <RefreshIcon className='h-4 w-4' />;
      case 'report':
        return <EyeIcon className='h-4 w-4' />;
      case 'alert':
        return <ExclamationCircleIcon className='h-4 w-4' />;
      default:
        return <ClockIcon className='h-4 w-4' />;
    }
  };

  const getStatusColor = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSystemStatusColor = (status: LiveStats['systemStatus']) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!pollingUnit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Track Polling Unit' size='xl'>
      <div className='space-y-6'>
        {/* Header Info */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start space-x-3'>
              <div className='flex-shrink-0'>
                <MapPinIcon className='h-8 w-8 text-primary-600' />
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>{pollingUnit.name}</h3>
                <p className='text-sm text-gray-600'>Code: {pollingUnit.code}</p>
                <p className='text-sm text-gray-600'>
                  {pollingUnit.lga}, {pollingUnit.state}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className='flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50'
            >
              <RefreshIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Live Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-blue-50 rounded-lg p-4'>
            <div className='flex items-center space-x-3'>
              <UsersIcon className='h-6 w-6 text-blue-600' />
              <div>
                <p className='text-sm font-medium text-blue-900'>Agents On-Site</p>
                <p className='text-2xl font-bold text-blue-600'>{liveStats.agentsOnSite}</p>
              </div>
            </div>
          </div>

          <div className='bg-green-50 rounded-lg p-4'>
            <div className='flex items-center space-x-3'>
              <CheckCircleIcon className='h-6 w-6 text-green-600' />
              <div>
                <p className='text-sm font-medium text-green-900'>Voter Turnout</p>
                <p className='text-2xl font-bold text-green-600'>{liveStats.voterTurnout}%</p>
              </div>
            </div>
          </div>

          <div className='bg-yellow-50 rounded-lg p-4'>
            <div className='flex items-center space-x-3'>
              <ExclamationCircleIcon className='h-6 w-6 text-yellow-600' />
              <div>
                <p className='text-sm font-medium text-yellow-900'>Incidents</p>
                <p className='text-2xl font-bold text-yellow-600'>{liveStats.incidentReports}</p>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 rounded-lg p-4'>
            <div className='flex items-center space-x-3'>
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center ${getSystemStatusColor(liveStats.systemStatus)}`}
              >
                <div className='h-3 w-3 rounded-full bg-current'></div>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>System Status</p>
                <p className='text-sm font-semibold capitalize text-gray-600'>
                  {liveStats.systemStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-lg font-medium text-gray-900'>Recent Activity</h4>
            <p className='text-sm text-gray-500'>
              Last updated: {formatTime(liveStats.lastActivity)}
            </p>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg'>
            <div className='max-h-64 overflow-y-auto'>
              {activityLogs.map((log, index) => (
                <div
                  key={log.id}
                  className={`flex items-start space-x-3 p-4 ${index !== activityLogs.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className={`flex-shrink-0 p-2 rounded-full ${getStatusColor(log.status)}`}>
                    {getActivityIcon(log.type)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900'>{log.message}</p>
                    <div className='flex items-center space-x-2 mt-1'>
                      <p className='text-xs text-gray-500'>{formatTime(log.timestamp)}</p>
                      {log.agent && (
                        <>
                          <span className='text-xs text-gray-300'>•</span>
                          <p className='text-xs text-gray-500'>{log.agent}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Map Placeholder */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900'>Location</h4>
          <div className='bg-gray-100 rounded-lg p-8 text-center'>
            <MapPinIcon className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600'>Interactive map would be displayed here</p>
            <p className='text-sm text-gray-500 mt-2'>
              Coordinates: {pollingUnit.coordinates.latitude.toFixed(6)},{' '}
              {pollingUnit.coordinates.longitude.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Close
          </button>
          <button className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
            View Full Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TrackPollingUnitModal;
