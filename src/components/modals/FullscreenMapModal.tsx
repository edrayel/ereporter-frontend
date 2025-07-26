import React, { Fragment, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XIcon,
  ChatIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  LocationMarkerIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  FilterIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveResult {
  id: string;
  pollingUnit: string;
  location: string;
  leadingCandidate: string;
  totalVotes: number;
  status: 'verified' | 'pending' | 'disputed';
  timestamp: string;
  latitude: number;
  longitude: number;
}

interface LiveActivity {
  id: string;
  type: 'agent_checkin' | 'result_upload' | 'incident_report' | 'status_update';
  message: string;
  timestamp: string;
  agentId: string;
  location?: string;
  severity?: 'low' | 'medium' | 'high';
  isAnonymized: boolean;
}

interface FullscreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: LiveResult[];
}

// Component to handle map resize when modal opens
const MapResizeHandler: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    // Small delay to ensure modal transition is complete
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [map]);
  
  return null;
};

const FullscreenMapModal: React.FC<FullscreenMapModalProps> = ({
  isOpen,
  onClose,
  results,
}) => {
  const [showChat, setShowChat] = useState(true);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [onlineAgents, setOnlineAgents] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const mapRef = useRef<any>(null);

  // Generate mock live activities
  const generateMockActivity = (): LiveActivity => {
    const types: LiveActivity['type'][] = ['agent_checkin', 'result_upload', 'incident_report', 'status_update'];
    const locations = ['Lagos Island', 'Victoria Island', 'Ikeja', 'Surulere', 'Yaba', 'Ikoyi', 'Lekki'];
    const severities: LiveActivity['severity'][] = ['low', 'medium', 'high'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const agentId = `AGT${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    let message = '';
    let severity: LiveActivity['severity'] = 'low';
    
    switch (type) {
      case 'agent_checkin':
        message = `Agent checked in at ${location}`;
        break;
      case 'result_upload':
        message = `Results uploaded from PU${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
        break;
      case 'incident_report':
        severity = severities[Math.floor(Math.random() * severities.length)];
        message = `${severity?.toUpperCase() || 'UNKNOWN'} incident reported in ${location}`;
        break;
      case 'status_update':
        message = `Agent status updated in ${location}`;
        break;
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
      agentId,
      location,
      severity,
      isAnonymized: true,
    };
  };

  // Initialize with some mock activities
  useEffect(() => {
    if (isOpen) {
      const initialActivities = Array.from({ length: 15 }, () => {
        const activity = generateMockActivity();
        // Make timestamps spread over the last hour
        const randomMinutes = Math.floor(Math.random() * 60);
        activity.timestamp = new Date(Date.now() - randomMinutes * 60 * 1000).toISOString();
        return activity;
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setLiveActivities(initialActivities);
      setOnlineAgents(Math.floor(Math.random() * 50) + 20);
      setTotalActivities(initialActivities.length);
    }
  }, [isOpen]);

  // Auto-refresh activities with optimized interval
  useEffect(() => {
    if (!isOpen || !isAutoRefresh) return;
    
    const interval = setInterval(() => {
      // Add new activity occasionally (reduced frequency)
      if (Math.random() < 0.2) {
        const newActivity = generateMockActivity();
        setLiveActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50
        setTotalActivities(prev => prev + 1);
      }
      
      // Update online agents count less frequently
      if (Math.random() < 0.5) {
        setOnlineAgents(prev => {
          const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
          return Math.max(10, Math.min(100, prev + change));
        });
      }
    }, 5000); // Every 5 seconds instead of 3
    
    return () => clearInterval(interval);
  }, [isOpen, isAutoRefresh]);

  // Handle map resize when showChat state changes
  useEffect(() => {
    if (isOpen && mapRef.current) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showChat, isOpen]);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10B981'; // green
      case 'pending':
        return '#F59E0B'; // yellow
      case 'disputed':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getActivityIcon = (type: LiveActivity['type']) => {
    switch (type) {
      case 'agent_checkin':
        return <UserIcon className="h-4 w-4" />;
      case 'result_upload':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'incident_report':
        return <ExclamationCircleIcon className="h-4 w-4" />;
      case 'status_update':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <LocationMarkerIcon className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: LiveActivity['type'], severity?: string) => {
    if (type === 'incident_report' && severity) {
      switch (severity) {
        case 'high': return 'text-red-600 bg-red-50';
        case 'medium': return 'text-yellow-600 bg-yellow-50';
        default: return 'text-blue-600 bg-blue-50';
      }
    }
    
    switch (type) {
      case 'agent_checkin': return 'text-green-600 bg-green-50';
      case 'result_upload': return 'text-blue-600 bg-blue-50';
      case 'status_update': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Memoize filtered activities to prevent unnecessary re-calculations
  const filteredActivities = useMemo(() => {
    if (activityFilter === 'all') return liveActivities;
    return liveActivities.filter(activity => activity.type === activityFilter);
  }, [liveActivities, activityFilter]);

  // Memoize time formatting function
  const formatTimeAgo = useCallback((timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  // Memoize map markers to prevent unnecessary re-renders
  const mapMarkers = useMemo(() => {
    return results.map((result) => (
      <CircleMarker
        key={result.id}
        center={[result.latitude, result.longitude]}
        radius={8}
        fillColor={getMarkerColor(result.status)}
        color="white"
        weight={2}
        opacity={1}
        fillOpacity={0.8}
      >
        <Popup>
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 mb-2">
              {result.pollingUnit}
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Location:</span> {result.location}
              </p>
              <p>
                <span className="font-medium">Leading:</span> {result.leadingCandidate}
              </p>
              <p>
                <span className="font-medium">Total Votes:</span>{' '}
                {result.totalVotes.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : result.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.status}
                </span>
              </p>
              <p className="text-gray-500">
                <span className="font-medium">Updated:</span> {formatTimeAgo(result.timestamp)}
              </p>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    ));
  }, [results, formatTimeAgo]);

  // Memoize activity list items to prevent unnecessary re-renders
  const activityListItems = useMemo(() => {
    return filteredActivities.map((activity) => (
      <div
        key={activity.id}
        className={`p-3 rounded-lg border ${getActivityColor(activity.type, activity.severity)}`}
      >
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.message}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                Agent {activity.agentId}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
            {activity.location && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {activity.location}
              </p>
            )}
          </div>
        </div>
      </div>
    ));
  }, [filteredActivities, formatTimeAgo]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex h-full w-full transform bg-white transition-all">
                {/* Map Section */}
                <div className={`relative ${showChat ? 'w-3/4' : 'w-full'} h-full`}>
                  {/* Map Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Live Election Map
                        </h2>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>{onlineAgents} agents online</span>
                          </div>
                          <span>•</span>
                          <span>{results.length} polling units</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowChat(!showChat)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {showChat ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span>{showChat ? 'Hide' : 'Show'} Live Feed</span>
                        </button>
                        <button
                          onClick={onClose}
                          className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
                        >
                          <XIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="h-full pt-20">
                    {isOpen && (
                      <MapContainer
                        center={[6.5244, 3.3792]} // Lagos coordinates
                        zoom={10}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                        key="fullscreen-map" // Prevent unnecessary re-initialization
                        ref={mapRef}
                        whenReady={(map: any) => {
                          mapRef.current = map.target;
                        }}
                      >
                        <MapResizeHandler />
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {mapMarkers}
                      </MapContainer>
                    )}
                  </div>

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Status Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Verified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Pending</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-700">Disputed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                {showChat && (
                  <div className="w-1/4 h-full bg-gray-50 border-l border-gray-200 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 bg-white border-b border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                          <ChatIcon className="h-5 w-5 mr-2" />
                          Live Activity
                        </h3>
                        <button
                          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                          className={`p-1 rounded-md ${
                            isAutoRefresh
                              ? 'text-green-600 bg-green-100'
                              : 'text-gray-400 bg-gray-100'
                          }`}
                        >
                          <RefreshIcon className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>{totalActivities} total activities</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                      </div>

                      {/* Activity Filter */}
                      <select
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="all">All Activities</option>
                        <option value="agent_checkin">Agent Check-ins</option>
                        <option value="result_upload">Result Uploads</option>
                        <option value="incident_report">Incident Reports</option>
                        <option value="status_update">Status Updates</option>
                      </select>
                    </div>

                    {/* Activity List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {activityListItems}
                    </div>

                    {/* Privacy Notice */}
                    <div className="p-4 bg-blue-50 border-t border-blue-200">
                      <div className="flex items-start space-x-2">
                        <ExclamationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-900">Privacy Protected</p>
                          <p className="text-xs text-blue-700 mt-1">
                            All personal information is anonymized for public viewing. Agent IDs are randomized.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FullscreenMapModal;