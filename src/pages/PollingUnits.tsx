import {
  LocationMarkerIcon as MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SearchIcon as MagnifyingGlassIcon,
  FilterIcon as FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MapIcon,
  ChartBarIcon,
  ExclamationIcon as ExclamationTriangleIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { pollingUnitService } from '../services';
import { PollingUnit, PollingUnitFilters } from '../types/pollingUnit';
import { classNames } from '../utils/helpers';
import AddPollingUnitModal from '../components/modals/AddPollingUnitModal';
import PollingUnitDetailsModal from '../components/modals/PollingUnitDetailsModal';
import EditPollingUnitModal from '../components/modals/EditPollingUnitModal';
import TrackPollingUnitModal from '../components/modals/TrackPollingUnitModal';

/**
 * PollingUnits component - Comprehensive polling units management page
 * Displays polling units with location tracking, agent assignment, and monitoring
 */
const PollingUnits: React.FC = () => {
  const [pollingUnits, setPollingUnits] = useState<PollingUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [lgaFilter, setLgaFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUnit, setSelectedUnit] = useState<PollingUnit | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  useEffect(() => {
    loadPollingUnits();
  }, [stateFilter, lgaFilter, statusFilter]);

  const loadPollingUnits = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: PollingUnitFilters = {};
      if (stateFilter) filters.state = stateFilter;
      if (lgaFilter) filters.lga = lgaFilter;
      if (statusFilter === 'active') filters.isActive = true;
      if (statusFilter === 'inactive') filters.isActive = false;

      const data = await pollingUnitService.getPollingUnits(filters);
      setPollingUnits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load polling units');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (unit: PollingUnit) => {
    setSelectedUnit(unit);
    setShowDetailsModal(true);
  };

  const handleEditUnit = (unit: PollingUnit) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const handleTrackUnit = (unit: PollingUnit) => {
    setSelectedUnit(unit);
    setShowTrackModal(true);
  };

  const handlePollingUnitAdded = (newUnit: PollingUnit) => {
    setPollingUnits(prev => [...prev, newUnit]);
    setShowCreateModal(false);
  };

  const handlePollingUnitUpdated = (updatedUnit: PollingUnit) => {
    setPollingUnits(prev => prev.map(unit => (unit.id === updatedUnit.id ? updatedUnit : unit)));
    setShowEditModal(false);
  };

  const filteredUnits = pollingUnits.filter(unit => {
    const matchesSearch =
      searchTerm === '' ||
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.lga.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-success-600 bg-success-100' : 'text-error-600 bg-error-100';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircleIcon className='h-4 w-4' /> : <XCircleIcon className='h-4 w-4' />;
  };

  const PollingUnitCard = ({ unit }: { unit: PollingUnit }) => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <MapPinIcon className='h-6 w-6 text-primary-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg font-medium text-gray-900 truncate'>{unit.name}</h3>
            <p className='text-sm text-gray-500'>Code: {unit.code}</p>
            <p className='text-sm text-gray-500'>
              {unit.lga}, {unit.state}
            </p>
          </div>
        </div>
        <div className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100'>
          <span className='flex-shrink-0'>{getStatusIcon(unit.isActive)}</span>
          <span className='ml-1'>{unit.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className='mt-4'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-gray-500'>Registered Voters:</span>
            <span className='ml-1 font-medium'>{unit.registeredVoters.toLocaleString()}</span>
          </div>
          <div>
            <span className='text-gray-500'>Coordinates:</span>
            <span className='ml-1 font-medium'>
              {unit.coordinates.latitude.toFixed(4)}, {unit.coordinates.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {unit.address && (
          <div className='mt-3'>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>Address:</span> {unit.address}
            </p>
          </div>
        )}
      </div>

      <div className='mt-6 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <UsersIcon className='h-4 w-4 text-gray-400' />
          <span className='text-sm text-gray-500'>
            {Math.floor(Math.random() * 5)} agents assigned
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => handleViewDetails(unit)}
            className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <EyeIcon className='h-4 w-4 mr-1' />
            View
          </button>
          <button
            onClick={() => handleTrackUnit(unit)}
            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <MapIcon className='h-4 w-4 mr-1' />
            Track
          </button>
        </div>
      </div>
    </div>
  );

  const PollingUnitListItem = ({ unit }: { unit: PollingUnit }) => (
    <tr className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <MapPinIcon className='h-5 w-5 text-primary-600 mr-3' />
          <div>
            <div className='text-sm font-medium text-gray-900'>{unit.name}</div>
            <div className='text-sm text-gray-500'>Code: {unit.code}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {unit.lga}, {unit.state}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {unit.registeredVoters.toLocaleString()}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100'>
          <span className='flex-shrink-0'>{getStatusIcon(unit.isActive)}</span>
          <span className='ml-1'>{unit.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {Math.floor(Math.random() * 5)} agents
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => handleViewDetails(unit)}
            className='text-primary-600 hover:text-primary-900'
          >
            View
          </button>
          <button
            onClick={() => handleEditUnit(unit)}
            className='text-primary-600 hover:text-primary-900'
          >
            Edit
          </button>
          <button
            onClick={() => handleTrackUnit(unit)}
            className='text-primary-600 hover:text-primary-900'
          >
            Track
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading polling units...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Polling Units - eReporter</title>
        <meta name='description' content='Monitor polling units and their status' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <MapPinIcon className='h-8 w-8 text-primary-600' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Polling Units</h1>
              <p className='text-sm text-gray-600'>Monitor polling units and their status</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <PlusIcon className='h-4 w-4 mr-2' />
            Add Polling Unit
          </button>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <MapPinIcon className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Total Units</dt>
                    <dd className='text-lg font-medium text-gray-900'>{pollingUnits.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <CheckCircleIcon className='h-6 w-6 text-success-500' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Active Units</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {pollingUnits.filter(u => u.isActive).length}
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
                  <UsersIcon className='h-6 w-6 text-primary-500' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Assigned Agents</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {pollingUnits.length * 2} {/* Mock calculation */}
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
                  <ChartBarIcon className='h-6 w-6 text-warning-500' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Total Voters</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {pollingUnits
                        .reduce((sum, unit) => sum + unit.registeredVoters, 0)
                        .toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-1'>
                Search
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  id='search'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                  placeholder='Search units...'
                />
              </div>
            </div>

            <div>
              <label htmlFor='state' className='block text-sm font-medium text-gray-700 mb-1'>
                State
              </label>
              <select
                id='state'
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
              >
                <option value=''>All States</option>
                <option value='Lagos'>Lagos</option>
                <option value='Abuja'>Abuja</option>
                <option value='Kano'>Kano</option>
                <option value='Rivers'>Rivers</option>
              </select>
            </div>

            <div>
              <label htmlFor='lga' className='block text-sm font-medium text-gray-700 mb-1'>
                LGA
              </label>
              <select
                id='lga'
                value={lgaFilter}
                onChange={e => setLgaFilter(e.target.value)}
                className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
              >
                <option value=''>All LGAs</option>
                <option value='Ikeja'>Ikeja</option>
                <option value='Victoria Island'>Victoria Island</option>
                <option value='Surulere'>Surulere</option>
              </select>
            </div>

            <div>
              <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-1'>
                Status
              </label>
              <select
                id='status'
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
              >
                <option value=''>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-500'>
                Showing {filteredUnits.length} of {pollingUnits.length} polling units
              </span>
            </div>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={classNames(
                  'p-2 rounded-md',
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-gray-500',
                )}
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={classNames(
                  'p-2 rounded-md',
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-gray-500',
                )}
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='flex'>
              <ExclamationTriangleIcon className='h-5 w-5 text-red-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error loading polling units</h3>
                <p className='mt-1 text-sm text-red-700'>
                  {typeof error === 'string'
                    ? error
                    : (error as any)?.message || 'An unexpected error occurred'}
                </p>
                <button
                  onClick={loadPollingUnits}
                  className='mt-2 text-sm text-red-600 hover:text-red-500 underline'
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Polling Units Display */}
        {viewMode === 'grid' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredUnits.map(unit => (
              <PollingUnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        ) : (
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Polling Unit
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Location
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Registered Voters
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Agents
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredUnits.map(unit => (
                  <PollingUnitListItem key={unit.id} unit={unit} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredUnits.length === 0 && !loading && !error && (
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-center py-12'>
              <MapPinIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No polling units found</h3>
              <p className='mt-1 text-sm text-gray-500'>
                {searchTerm || stateFilter || lgaFilter || statusFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first polling unit.'}
              </p>
              {!searchTerm && !stateFilter && !lgaFilter && !statusFilter && (
                <div className='mt-6'>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  >
                    <PlusIcon className='h-4 w-4 mr-2' />
                    Add Polling Unit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPollingUnitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPollingUnitAdded={handlePollingUnitAdded}
      />

      <PollingUnitDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        pollingUnit={selectedUnit}
      />

      <EditPollingUnitModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        pollingUnit={selectedUnit}
        onPollingUnitUpdated={handlePollingUnitUpdated}
      />

      <TrackPollingUnitModal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        pollingUnit={selectedUnit}
      />
    </>
  );
};

export default PollingUnits;
