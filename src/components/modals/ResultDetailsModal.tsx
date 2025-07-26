import React from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  LocationMarkerIcon as MapPinIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotographIcon as PhotoIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { ElectionResult } from '../../types/result';

interface ResultDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ElectionResult | null;
}

const ResultDetailsModal: React.FC<ResultDetailsModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!result) return null;

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

  const calculateTotalVotes = () => {
    return (
      result.voteData.candidates?.reduce((total, candidate) => total + candidate.votes, 0) || 0
    );
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified
      ? 'text-success-600 bg-success-100'
      : 'text-warning-600 bg-warning-100';
  };

  const getStatusIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircleIcon className='h-4 w-4' />
    ) : (
      <ClockIcon className='h-4 w-4' />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Result Details" size="xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {result.pollingUnit?.name || 'Unknown Polling Unit'}
                </h3>
                <p className="text-sm text-gray-600">Result ID: {result.id}</p>
                <p className="text-sm text-gray-600">
                  {result.pollingUnit?.lga} LGA, {result.pollingUnit?.state} State
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.isVerified)}`}>
                {getStatusIcon(result.isVerified)}
                <span className="ml-1">{result.isVerified ? 'Verified' : 'Pending Verification'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Result Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">
                    {result.pollingUnit?.lga} LGA, {result.pollingUnit?.state} State
                  </p>
                </div>
              </div>

              {result.agent && (
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reported By</p>
                    <p className="text-sm text-gray-900">{result.agent.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted</p>
                  <p className="text-sm text-gray-900">{formatDate(result.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Votes</p>
                  <p className="text-sm text-gray-900">{calculateTotalVotes().toLocaleString()}</p>
                </div>
              </div>

              {result.formImageUrl && (
                <div className="flex items-center space-x-3">
                  <PhotoIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Form Image</p>
                    <p className="text-sm text-gray-900">Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Vote Breakdown
            </h4>
            
            {result.voteData.candidates && result.voteData.candidates.length > 0 ? (
              <div className="space-y-3">
                {result.voteData.candidates.map((candidate, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-xs text-gray-500">{candidate.party}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{candidate.votes.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {calculateTotalVotes() > 0 ? ((candidate.votes / calculateTotalVotes()) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <ExclamationCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No candidate data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {result.voteData.totalVotes && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Voting Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{result.voteData.totalVotes}</p>
                <p className="text-sm text-gray-600">Total Votes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{result.voteData.validVotes || 0}</p>
                <p className="text-sm text-gray-600">Valid Votes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{result.voteData.invalidVotes || 0}</p>
                <p className="text-sm text-gray-600">Invalid Votes</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Image */}
        {result.formImageUrl && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Result Form
            </h4>
            <div className="bg-gray-100 rounded-lg p-4">
              <img
                src={result.formImageUrl}
                alt="Result Form"
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
          {!result.isVerified && (
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Verify Result
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ResultDetailsModal;