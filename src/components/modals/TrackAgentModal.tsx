import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Agent } from '../../types/agent';
import {
  LocationMarkerIcon as MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

interface TrackAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

interface LocationUpdate {
  id: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'en_route' | 'arrived' | 'departed';
  notes?: string;
}

const TrackAgentModal: React.FC<TrackAgentModalProps> = ({ isOpen, onClose, agent }) => {
  const [locationUpdates, setLocationUpdates] = useState<LocationUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && agent) {
      // Simulate fetching location updates
      setLoading(true);
      setTimeout(() => {
        const mockUpdates: LocationUpdate[] = [
          {
            id: '1',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            location: {
              lat: 6.5244,
              lng: 3.3792,
              address: 'Lagos Island, Lagos State',
            },
            status: 'departed',
            notes: 'Left headquarters',
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            location: {
              lat: 6.5355,
              lng: 3.3087,
              address: 'Victoria Island, Lagos State',
            },
            status: 'en_route',
            notes: 'En route to polling unit',
          },
          {
            id: '3',
            timestamp: new Date().toISOString(),
            location: {
              lat: 6.4281,
              lng: 3.4219,
              address: agent.pollingUnit?.name || 'Assigned Polling Unit',
            },
            status: 'arrived',
            notes: 'Arrived at polling unit',
          },
        ];
        setLocationUpdates(mockUpdates);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, agent]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'arrived':
        return <CheckCircleIcon className='h-5 w-5 text-green-500' />;
      case 'en_route':
        return <ClockIcon className='h-5 w-5 text-yellow-500' />;
      case 'departed':
        return <ExclamationCircleIcon className='h-5 w-5 text-blue-500' />;
      default:
        return <MapPinIcon className='h-5 w-5 text-gray-500' />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'Arrived';
      case 'en_route':
        return 'En Route';
      case 'departed':
        return 'Departed';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Track ${agent.name}`} size='lg'>
      <div className='space-y-6'>
        {/* Agent Info */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='flex items-center space-x-3'>
            <div className='flex-shrink-0'>
              <div className='h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center'>
                <span className='text-sm font-medium text-primary-700'>{agent.name.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-medium text-gray-900'>{agent.name}</h3>
              <p className='text-sm text-gray-500'>
                Assigned to: {agent.pollingUnit?.name || 'No assignment'}
              </p>
            </div>
          </div>
        </div>

        {/* Location Updates */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-4'>Location Updates</h4>
          {loading ? (
            <div className='flex justify-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
            </div>
          ) : (
            <div className='flow-root'>
              <ul className='-mb-8'>
                {locationUpdates.map((update, index) => (
                  <li key={update.id}>
                    <div className='relative pb-8'>
                      {index !== locationUpdates.length - 1 && (
                        <span
                          className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200'
                          aria-hidden='true'
                        />
                      )}
                      <div className='relative flex space-x-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white ring-8 ring-white'>
                          {getStatusIcon(update.status)}
                        </div>
                        <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                          <div>
                            <p className='text-sm text-gray-900'>
                              <span className='font-medium'>{getStatusText(update.status)}</span>
                              {' at '}
                              <span className='text-gray-600'>{update.location.address}</span>
                            </p>
                            {update.notes && (
                              <p className='mt-1 text-sm text-gray-500'>{update.notes}</p>
                            )}
                          </div>
                          <div className='whitespace-nowrap text-right text-sm text-gray-500'>
                            <time dateTime={update.timestamp}>{formatTime(update.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Current Status */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <MapPinIcon className='h-5 w-5 text-blue-500 mr-2' />
            <div>
              <p className='text-sm font-medium text-blue-900'>
                Current Status:{' '}
                {getStatusText(locationUpdates[locationUpdates.length - 1]?.status || 'unknown')}
              </p>
              <p className='text-sm text-blue-700'>
                Last updated:{' '}
                {locationUpdates[locationUpdates.length - 1]
                  ? formatTime(locationUpdates[locationUpdates.length - 1].timestamp)
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-end space-x-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Close
          </button>
          <button
            type='button'
            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Refresh Location
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TrackAgentModal;
