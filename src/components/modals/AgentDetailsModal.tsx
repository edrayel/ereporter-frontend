import React from 'react';
import Modal from '../ui/Modal';
import { Agent } from '../../types/agent';
import {
  LocationMarkerIcon as MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline';

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ isOpen, onClose, agent }) => {
  if (!agent) return null;

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agent Details" size="lg">
      <div className="space-y-6">
        {/* Agent Header */}
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-xl">
              {agent.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  agent.status,
                )}`}
              >
                {agent.status === 'active' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                {agent.status === 'inactive' && <ClockIcon className="h-3 w-3 mr-1" />}
                {agent.status === 'suspended' && <XCircleIcon className="h-3 w-3 mr-1" />}
                {agent.status === 'pending' && <ClockIcon className="h-3 w-3 mr-1" />}
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </span>
              {agent.isOnline && (
                <div className="flex items-center text-xs text-green-600">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Online
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <MailIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{agent.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">{agent.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Assignment</h4>
          {agent.pollingUnit ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Polling Unit</p>
                  <p className="text-sm text-gray-600">
                    {agent.pollingUnit.name} - {agent.pollingUnit.lga}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{agent.pollingUnit.address || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Registered Voters</p>
                  <p className="text-sm text-gray-600">
                    {agent.pollingUnit.registeredVoters?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No polling unit assigned</p>
          )}
        </div>

        {/* Activity Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Activity</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Seen</p>
                <p className="text-sm text-gray-600">{formatLastSeen(agent.lastSeen)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Verified</p>
                <p className="text-sm text-gray-600">{agent.isVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        {agent.qrCode && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">QR Code</h4>
            <div className="flex items-center justify-center bg-white rounded-lg p-4">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
                <p className="text-xs text-gray-500">{agent.qrCode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
          {agent.status === 'active' && (
            <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Track Location
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AgentDetailsModal;