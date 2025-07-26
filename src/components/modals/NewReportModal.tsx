import React, { useState } from 'react';
import {
  ExclamationCircleIcon,
  DocumentTextIcon,
  LocationMarkerIcon as MapPinIcon,
  CameraIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: any) => void;
}

interface ReportFormData {
  title: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  pollingUnit: string;
  attachments: File[];
}

const NewReportModal: React.FC<NewReportModalProps> = ({ isOpen, onClose, onReportCreated }) => {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    category: '',
    severity: '',
    description: '',
    location: '',
    pollingUnit: '',
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: files,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReport = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        severity: formData.severity,
        description: formData.description,
        location: formData.location,
        pollingUnit: formData.pollingUnit,
        status: 'pending',
        reportedBy: 'Current User',
        reportedAt: new Date().toISOString(),
        attachments: formData.attachments.length,
      };

      onReportCreated(newReport);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      category: '',
      severity: '',
      description: '',
      location: '',
      pollingUnit: '',
      attachments: [],
    });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Create New Report' size='lg'>
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
            Report Details
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
                <DocumentTextIcon className='h-4 w-4 inline mr-1' />
                Report Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
                placeholder='Enter report title'
              />
            </div>

            <div>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
                Category
              </label>
              <select
                id='category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              >
                <option value=''>Select category</option>
                <option value='security'>Security</option>
                <option value='technical'>Technical</option>
                <option value='procedural'>Procedural</option>
                <option value='violence'>Violence</option>
                <option value='irregularity'>Irregularity</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='severity' className='block text-sm font-medium text-gray-700 mb-1'>
                <ExclamationCircleIcon className='h-4 w-4 inline mr-1' />
                Severity Level
              </label>
              <select
                id='severity'
                name='severity'
                value={formData.severity}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              >
                <option value=''>Select severity</option>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
                <option value='critical'>Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor='pollingUnit' className='block text-sm font-medium text-gray-700 mb-1'>
                <MapPinIcon className='h-4 w-4 inline mr-1' />
                Polling Unit
              </label>
              <select
                id='pollingUnit'
                name='pollingUnit'
                value={formData.pollingUnit}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              >
                <option value=''>Select polling unit</option>
                <option value='PU001'>PU001 - Ikeja Primary School</option>
                <option value='PU002'>PU002 - Victoria Island Hall</option>
                <option value='PU003'>PU003 - Surulere Community Center</option>
                <option value='PU004'>PU004 - Lekki Phase 1 School</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>
              <MapPinIcon className='h-4 w-4 inline mr-1' />
              Specific Location
            </label>
            <input
              type='text'
              id='location'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Enter specific location details'
            />
          </div>

          <div>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
              <DocumentTextIcon className='h-4 w-4 inline mr-1' />
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
              placeholder='Provide detailed description of the incident'
            />
          </div>
        </div>

        {/* Attachments */}
        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
            Attachments
          </h4>

          <div>
            <label htmlFor='attachments' className='block text-sm font-medium text-gray-700 mb-1'>
              <CameraIcon className='h-4 w-4 inline mr-1' />
              Upload Files (Photos, Videos, Documents)
            </label>
            <input
              type='file'
              id='attachments'
              name='attachments'
              onChange={handleFileChange}
              multiple
              accept='image/*,video/*,.pdf,.doc,.docx'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'
            />
            <p className='mt-1 text-sm text-gray-500'>
              You can upload multiple files. Supported formats: Images, Videos, PDF, Word documents
            </p>
            {formData.attachments.length > 0 && (
              <div className='mt-2'>
                <p className='text-sm text-gray-600'>
                  {formData.attachments.length} file(s) selected:
                </p>
                <ul className='mt-1 text-sm text-gray-500'>
                  {formData.attachments.map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
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
            {loading ? 'Creating...' : 'Create Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewReportModal;
