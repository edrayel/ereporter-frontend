import {
  UsersIcon,
  LocationMarkerIcon as MapPinIcon,
  WifiIcon as SignalIcon,
  ClockIcon,
  ExclamationIcon as ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon as MagnifyingGlassIcon,
  FilterIcon as FunnelIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { agentService } from '../services';
import { Agent, AgentFilters, AgentStatus } from '../types/agent';
import { classNames } from '../utils/helpers';
import AddAgentModal from '../components/modals/AddAgentModal';
import AgentDetailsModal from '../components/modals/AgentDetailsModal';
import TrackAgentModal from '../components/modals/TrackAgentModal';

/**
 * Agents component - Comprehensive agents management page
 * Features real-time tracking, location monitoring, and agent management
 */
const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | ''>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const filters: AgentFilters = {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      };
      const data = await agentService.getAgents(filters);
      setAgents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when search term or status filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAgents();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success-600 bg-success-100';
      case 'inactive':
        return 'text-warning-600 bg-warning-100';
      case 'offline':
        return 'text-error-600 bg-error-100';
      case 'pending':
        return 'text-secondary-600 bg-secondary-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Modal handlers
  const handleAddAgent = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleTrackAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowTrackModal(true);
  };

  const handleAgentAdded = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
    setShowAddModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className='h-4 w-4' />;
      case 'inactive':
        return <ClockIcon className='h-4 w-4' />;
      case 'offline':
        return <XCircleIcon className='h-4 w-4' />;
      case 'pending':
        return <ExclamationTriangleIcon className='h-4 w-4' />;
      default:
        return <SignalIcon className='h-4 w-4' />;
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow w-full'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center space-x-3 min-w-0 flex-1'>
          <div className='h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <span className='text-primary-600 font-semibold text-lg'>
              {agent.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className='text-lg font-medium text-gray-900 truncate'>{agent.name}</h3>
            <p className='text-sm text-gray-500 truncate'>{agent.email}</p>
            <p className='text-sm text-gray-500 truncate'>{agent.phone}</p>
          </div>
        </div>
        <div className='flex flex-col items-end space-y-2 flex-shrink-0 ml-4'>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 whitespace-nowrap'>
            <span className='flex-shrink-0'>{getStatusIcon(agent.status)}</span>
            <span className='ml-1 capitalize'>{agent.status}</span>
          </span>
          {agent.isOnline && (
            <div className='flex items-center text-xs text-success-600 whitespace-nowrap'>
              <div className='h-2 w-2 bg-success-500 rounded-full mr-1 animate-pulse'></div>
              Online
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 space-y-2'>
        {agent.pollingUnit && (
          <div className='flex items-center text-sm text-gray-600'>
            <MapPinIcon className='h-4 w-4 mr-2 flex-shrink-0' />
            <span className='truncate'>
              {agent.pollingUnit.name} - {agent.pollingUnit.lga}
            </span>
          </div>
        )}
        <div className='flex items-center text-sm text-gray-600'>
          <ClockIcon className='h-4 w-4 mr-2 flex-shrink-0' />
          <span className='truncate'>Last seen: {formatLastSeen(agent.lastSeen)}</span>
        </div>
      </div>

      <div className='mt-4 flex space-x-2'>
        <button
          onClick={() => handleViewDetails(agent)}
          className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <EyeIcon className='h-4 w-4 mr-1' />
          View Details
        </button>
        {agent.status === 'active' && (
          <button
            onClick={() => handleTrackAgent(agent)}
            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap'
          >
            <MapPinIcon className='h-4 w-4 mr-1' />
            Track
          </button>
        )}
      </div>
    </div>
  );

  const AgentListItem = ({ agent }: { agent: Agent }) => (
    <tr className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center'>
            <span className='text-primary-600 font-medium text-sm'>
              {agent.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>{agent.name}</div>
            <div className='text-sm text-gray-500'>{agent.email}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100'>
          <span className='flex-shrink-0'>{getStatusIcon(agent.status)}</span>
          <span className='ml-1 capitalize'>{agent.status}</span>
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {agent.pollingUnit?.name || 'Not assigned'}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {formatLastSeen(agent.lastSeen)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {agent.isOnline ? (
          <div className='flex items-center text-success-600'>
            <div className='h-2 w-2 bg-success-500 rounded-full mr-1 animate-pulse'></div>
            Online
          </div>
        ) : (
          'Offline'
        )}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={() => handleViewDetails(agent)}
          className='text-primary-600 hover:text-primary-900 mr-3'
        >
          View
        </button>
        {agent.status === 'active' && (
          <button
            onClick={() => handleTrackAgent(agent)}
            className='text-primary-600 hover:text-primary-900'
          >
            Track
          </button>
        )}
      </td>
    </tr>
  );

  if (loading && agents.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agents - eReporter</title>
        <meta name='description' content='Manage field agents and their assignments' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <UsersIcon className='h-8 w-8 text-primary-600' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Agents</h1>
              <p className='text-sm text-gray-600'>Manage field agents and their assignments</p>
            </div>
          </div>
          <button
            onClick={handleAddAgent}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <PlusIcon className='h-4 w-4 mr-2' />
            Add Agent
          </button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <CheckCircleIcon className='h-6 w-6 text-success-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Active Agents</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {agents.filter(a => a.status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <SignalIcon className='h-6 w-6 text-primary-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Online Now</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {agents.filter(a => a.isOnline).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <ExclamationTriangleIcon className='h-6 w-6 text-warning-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Pending</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {agents.filter(a => a.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <UsersIcon className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Total Agents</dt>
                    <dd className='text-lg font-medium text-gray-900'>{agents.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
            <div className='flex-1 min-w-0'>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                  placeholder='Search agents...'
                />
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as AgentStatus | '')}
                className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
              >
                <option value=''>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='suspended'>Suspended</option>
                <option value='pending'>Pending</option>
              </select>

              <div className='flex rounded-md shadow-sm'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={classNames(
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                  )}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={classNames(
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                  )}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='bg-error-50 border border-error-200 rounded-md p-4'>
            <div className='flex'>
              <ExclamationTriangleIcon className='h-5 w-5 text-error-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-error-800'>Error</h3>
                <p className='text-sm text-error-700 mt-1'>
                  {typeof error === 'string'
                    ? error
                    : (error as any)?.message || 'An unexpected error occurred'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Agents Display */}
        {viewMode === 'grid' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className='bg-white shadow overflow-hidden sm:rounded-md'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Agent
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Polling Unit
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Last Seen
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Online Status
                  </th>
                  <th className='relative px-6 py-3'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {agents.map(agent => (
                  <AgentListItem key={agent.id} agent={agent} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {agents.length === 0 && !loading && (
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-center py-12'>
              <UsersIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No agents found</h3>
              <p className='mt-1 text-sm text-gray-500'>
                {searchTerm || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first agent.'}
              </p>
              <div className='mt-6'>
                <button
                  onClick={handleAddAgent}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                >
                  <PlusIcon className='h-4 w-4 mr-2' />
                  Add Agent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddAgentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAgentAdded={handleAgentAdded}
          />
        )}

        {showDetailsModal && selectedAgent && (
          <AgentDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedAgent(null);
            }}
            agent={selectedAgent}
          />
        )}

        {showTrackModal && selectedAgent && (
          <TrackAgentModal
            isOpen={showTrackModal}
            onClose={() => {
              setShowTrackModal(false);
              setSelectedAgent(null);
            }}
            agent={selectedAgent}
          />
        )}
      </div>
    </>
  );
};

export default Agents;
