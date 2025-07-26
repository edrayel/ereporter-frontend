import React from 'react';
import {
  ExclamationCircleIcon,
  DocumentTextIcon,
  LocationMarkerIcon as MapPinIcon,
  UserIcon,
  ClockIcon,
  PaperClipIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationIcon as ExclamationTriangleIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';

interface Report {
  id: string;
  title: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  pollingUnit?: string;
  status: string;
  reportedBy: string;
  reportedAt: string;
  attachments: number;
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
}

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, report }) => {
  if (!report) return null;

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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircleIcon className='h-4 w-4' />;
      case 'investigating':
        return <ExclamationCircleIcon className='h-4 w-4' />;
      case 'pending':
        return <ClockIcon className='h-4 w-4' />;
      case 'escalated':
        return <ExclamationTriangleIcon className='h-4 w-4' />;
      default:
        return <ClockIcon className='h-4 w-4' />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Report Details' size='xl'>
      <div className='space-y-6'>
        {/* Header Info */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start space-x-3'>
              <div className='flex-shrink-0'>
                <DocumentTextIcon className='h-8 w-8 text-primary-600' />
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-900'>{report.title}</h3>
                <p className='text-sm text-gray-600'>Report ID: {report.id}</p>
                <p className='text-sm text-gray-600'>Category: {report.category}</p>
              </div>
            </div>
            <div className='flex flex-col items-end space-y-2'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(report.severity)}`}
              >
                {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} Severity
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}
              >
                {getStatusIcon(report.status)}
                <span className='ml-1'>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Report Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
              Report Information
            </h4>

            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <UserIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>Reported By</p>
                  <p className='text-sm text-gray-900'>{report.reportedBy}</p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <ClockIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>Reported At</p>
                  <p className='text-sm text-gray-900'>{formatDate(report.reportedAt)}</p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <MapPinIcon className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-700'>Location</p>
                  <p className='text-sm text-gray-900'>{report.location}</p>
                </div>
              </div>

              {report.pollingUnit && (
                <div className='flex items-center space-x-3'>
                  <MapPinIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Polling Unit</p>
                    <p className='text-sm text-gray-900'>{report.pollingUnit}</p>
                  </div>
                </div>
              )}

              {report.attachments > 0 && (
                <div className='flex items-center space-x-3'>
                  <PaperClipIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Attachments</p>
                    <p className='text-sm text-gray-900'>{report.attachments} file(s)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
              Investigation Details
            </h4>

            <div className='space-y-3'>
              {report.assignedTo && (
                <div className='flex items-center space-x-3'>
                  <UserIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Assigned To</p>
                    <p className='text-sm text-gray-900'>{report.assignedTo}</p>
                  </div>
                </div>
              )}

              {report.resolvedAt && (
                <div className='flex items-center space-x-3'>
                  <ClockIcon className='h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Resolved At</p>
                    <p className='text-sm text-gray-900'>{formatDate(report.resolvedAt)}</p>
                  </div>
                </div>
              )}

              <div className='bg-blue-50 rounded-lg p-4'>
                <div className='flex items-center space-x-3'>
                  <ExclamationCircleIcon className='h-6 w-6 text-blue-600' />
                  <div>
                    <p className='text-sm font-medium text-blue-900'>Investigation Status</p>
                    <p className='text-sm text-blue-700'>
                      {report.status === 'resolved' ? 'Case closed' : 'Under investigation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
            Description
          </h4>

          <div className='bg-gray-50 rounded-lg p-4'>
            <p className='text-sm text-gray-900 whitespace-pre-wrap'>{report.description}</p>
          </div>
        </div>

        {/* Resolution */}
        {report.resolution && (
          <div className='space-y-4'>
            <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
              Resolution
            </h4>

            <div className='bg-green-50 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <CheckCircleIcon className='h-6 w-6 text-green-600 mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-green-900'>Case Resolved</p>
                  <p className='text-sm text-green-700 mt-1 whitespace-pre-wrap'>
                    {report.resolution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
            Timeline
          </h4>

          <div className='space-y-3'>
            <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
              <div className='flex-shrink-0'>
                <div className='h-2 w-2 bg-blue-400 rounded-full'></div>
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-900'>Report submitted</p>
                <p className='text-xs text-gray-500'>{formatDate(report.reportedAt)}</p>
              </div>
            </div>

            {report.assignedTo && (
              <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                <div className='flex-shrink-0'>
                  <div className='h-2 w-2 bg-yellow-400 rounded-full'></div>
                </div>
                <div className='flex-1'>
                  <p className='text-sm text-gray-900'>Assigned to investigator</p>
                  <p className='text-xs text-gray-500'>Assigned to {report.assignedTo}</p>
                </div>
              </div>
            )}

            {report.resolvedAt && (
              <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                <div className='flex-shrink-0'>
                  <div className='h-2 w-2 bg-green-400 rounded-full'></div>
                </div>
                <div className='flex-1'>
                  <p className='text-sm text-gray-900'>Case resolved</p>
                  <p className='text-xs text-gray-500'>{formatDate(report.resolvedAt)}</p>
                </div>
              </div>
            )}
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
          {report.status !== 'resolved' && (
            <>
              <button className='px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'>
                Assign Investigator
              </button>
              <button className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                Update Status
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetailsModal;
