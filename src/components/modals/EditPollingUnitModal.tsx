import React, { useState, useEffect } from 'react';
import {
  LocationMarkerIcon as MapPinIcon,
  UsersIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { PollingUnit, UpdatePollingUnitRequest } from '../../types/pollingUnit';
import { pollingUnitService } from '../../services/pollingUnitService';

interface EditPollingUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollingUnit: PollingUnit | null;
  onPollingUnitUpdated: (updatedPollingUnit: PollingUnit) => void;
}

const EditPollingUnitModal: React.FC<EditPollingUnitModalProps> = ({
  isOpen,
  onClose,
  pollingUnit,
  onPollingUnitUpdated,
}) => {
  const [formData, setFormData] = useState<UpdatePollingUnitRequest>({
    name: '',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    address: '',
    registeredVoters: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pollingUnit) {
      setFormData({
        name: pollingUnit.name,
        coordinates: {
          latitude: pollingUnit.coordinates.latitude,
          longitude: pollingUnit.coordinates.longitude,
        },
        address: pollingUnit.address,
        registeredVoters: pollingUnit.registeredVoters,
        isActive: pollingUnit.isActive,
      });
    }
  }, [pollingUnit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates!,
          [name]: parseFloat(value) || 0,
        },
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollingUnit) return;

    setLoading(true);
    setError(null);

    try {
      const updatedPollingUnit = await pollingUnitService.updatePollingUnit(
        pollingUnit.id,
        formData,
      );
      onPollingUnitUpdated(updatedPollingUnit);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update polling unit');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!pollingUnit) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Edit Polling Unit' size='lg'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='flex'>
              <ExclamationCircleIcon className='h-5 w-5 text-red-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <p className='mt-1 text-sm text-red-700'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
            Basic Information
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                <IdentificationIcon className='h-4 w-4 inline mr-1' />
                Polling Unit Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter polling unit name'
              />
            </div>

            <div>
              <label
                htmlFor='registeredVoters'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                <UsersIcon className='h-4 w-4 inline mr-1' />
                Registered Voters
              </label>
              <input
                type='number'
                id='registeredVoters'
                name='registeredVoters'
                value={formData.registeredVoters}
                onChange={handleInputChange}
                required
                min='0'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter number of registered voters'
              />
            </div>
          </div>

          <div>
            <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-1'>
              <OfficeBuildingIcon className='h-4 w-4 inline mr-1' />
              Address
            </label>
            <textarea
              id='address'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Enter polling unit address'
            />
          </div>
        </div>

        {/* Location Information */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
            Location Coordinates
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='latitude' className='block text-sm font-medium text-gray-700 mb-1'>
                <MapPinIcon className='h-4 w-4 inline mr-1' />
                Latitude
              </label>
              <input
                type='number'
                id='latitude'
                name='latitude'
                value={formData.coordinates?.latitude || ''}
                onChange={handleInputChange}
                required
                step='any'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter latitude'
              />
            </div>

            <div>
              <label htmlFor='longitude' className='block text-sm font-medium text-gray-700 mb-1'>
                <MapPinIcon className='h-4 w-4 inline mr-1' />
                Longitude
              </label>
              <input
                type='number'
                id='longitude'
                name='longitude'
                value={formData.coordinates?.longitude || ''}
                onChange={handleInputChange}
                required
                step='any'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter longitude'
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
            Status
          </h4>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isActive'
              name='isActive'
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
            />
            <label htmlFor='isActive' className='ml-2 block text-sm text-gray-900'>
              Active polling unit
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Updating...' : 'Update Polling Unit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPollingUnitModal;
