import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { pollingUnitService } from '../../services';
import { PollingUnit } from '../../types/pollingUnit';

interface AddPollingUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPollingUnitAdded: (pollingUnit: PollingUnit) => void;
}

interface FormData {
  name: string;
  code: string;
  state: string;
  lga: string;
  ward: string;
  address: string;
  latitude: string;
  longitude: string;
  registeredVoters: string;
}

const AddPollingUnitModal: React.FC<AddPollingUnitModalProps> = ({
  isOpen,
  onClose,
  onPollingUnitAdded,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    state: '',
    lga: '',
    ward: '',
    address: '',
    latitude: '',
    longitude: '',
    registeredVoters: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const pollingUnitData = {
        name: formData.name,
        code: formData.code,
        state: formData.state,
        lga: formData.lga,
        ward: formData.ward,
        address: formData.address,
        coordinates: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
        registeredVoters: parseInt(formData.registeredVoters),
        isActive: true,
      };

      const newPollingUnit = await pollingUnitService.createPollingUnit(pollingUnitData);
      onPollingUnitAdded(newPollingUnit);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        state: '',
        lga: '',
        ward: '',
        address: '',
        latitude: '',
        longitude: '',
        registeredVoters: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create polling unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Polling Unit" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Polling Unit Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter polling unit name"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Polling Unit Code *
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter polling unit code"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select State</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Kano">Kano</option>
              <option value="Rivers">Rivers</option>
              <option value="Ogun">Ogun</option>
              <option value="Kaduna">Kaduna</option>
            </select>
          </div>

          <div>
            <label htmlFor="lga" className="block text-sm font-medium text-gray-700 mb-1">
              Local Government Area *
            </label>
            <select
              id="lga"
              name="lga"
              value={formData.lga}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select LGA</option>
              <option value="Ikeja">Ikeja</option>
              <option value="Victoria Island">Victoria Island</option>
              <option value="Surulere">Surulere</option>
              <option value="Alimosho">Alimosho</option>
            </select>
          </div>

          <div>
            <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
              Ward *
            </label>
            <input
              type="text"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter ward"
            />
          </div>

          <div>
            <label htmlFor="registeredVoters" className="block text-sm font-medium text-gray-700 mb-1">
              Registered Voters *
            </label>
            <input
              type="number"
              id="registeredVoters"
              name="registeredVoters"
              value={formData.registeredVoters}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter number of registered voters"
            />
          </div>

          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude *
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              required
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter latitude"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude *
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              required
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter longitude"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter polling unit address"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Polling Unit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPollingUnitModal;