import React from 'react';
import {
  LocationMarkerIcon as MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { PollingUnit } from '../../types/pollingUnit';

interface PollingUnitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollingUnit: PollingUnit | null;
}

const PollingUnitDetailsModal: React.FC<PollingUnitDetailsModalProps> = ({
  isOpen,
  onClose,
  pollingUnit,
}) => {
  if (!pollingUnit) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Polling Unit Details" size="lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{pollingUnit.name}</h3>
                <p className="text-sm text-gray-600">Code: {pollingUnit.code}</p>
                <p className="text-sm text-gray-600">
                  {pollingUnit.lga}, {pollingUnit.state}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  pollingUnit.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {pollingUnit.isActive ? (
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                ) : (
                  <XCircleIcon className="h-4 w-4 mr-1" />
                )}
                {pollingUnit.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Polling Unit Code</p>
                  <p className="text-sm text-gray-900">{pollingUnit.code}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <OfficeBuildingIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">LGA</p>
                  <p className="text-sm text-gray-900">{pollingUnit.lga}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Registered Voters</p>
                  <p className="text-sm text-gray-900">{pollingUnit.registeredVoters.toLocaleString()}</p>
                </div>
              </div>

              {pollingUnit.createdAt && (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(pollingUnit.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Location Details
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Coordinates</p>
                  <p className="text-sm text-gray-900">
                    {pollingUnit.coordinates.latitude.toFixed(6)}, {pollingUnit.coordinates.longitude.toFixed(6)}
                  </p>
                </div>
              </div>

              {pollingUnit.address && (
                <div className="flex items-start space-x-3">
                  <OfficeBuildingIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-sm text-gray-900">{pollingUnit.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent Assignment */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Agent Assignment
          </h4>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <UsersIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {Math.floor(Math.random() * 5) + 1} agents assigned
                </p>
                <p className="text-sm text-blue-700">
                  Last activity: {Math.floor(Math.random() * 60)} minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Recent Activity
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Agent check-in completed</p>
                <p className="text-xs text-gray-500">{Math.floor(Math.random() * 30)} minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Polling unit status updated</p>
                <p className="text-xs text-gray-500">{Math.floor(Math.random() * 120)} minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Edit Polling Unit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PollingUnitDetailsModal;