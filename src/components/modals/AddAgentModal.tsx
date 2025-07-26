import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { agentService } from '../../services';
import { Agent } from '../../types/agent';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentAdded: (agent: Agent) => void;
}

interface AgentFormData {
  name: string;
  email: string;
  phone: string;
  pollingUnitId: string;
  lga: string;
  ward: string;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onAgentAdded }) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    email: '',
    phone: '',
    pollingUnitId: '',
    lga: '',
    ward: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Create agent data
      const agentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pollingUnitId: formData.pollingUnitId || undefined,
        status: 'pending' as const,
        isOnline: false,
        isVerified: false,
      };

      const newAgent = await agentService.createAgent(agentData);
      onAgentAdded(newAgent);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      pollingUnitId: '',
      lga: '',
      ward: '',
    });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Add New Agent' size='lg'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='text-sm text-red-700'>{error}</div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Full Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              placeholder="Enter agent's full name"
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email Address *
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              placeholder='agent@example.com'
            />
          </div>

          <div>
            <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
              Phone Number *
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              placeholder='+234 xxx xxx xxxx'
            />
          </div>

          <div>
            <label htmlFor='lga' className='block text-sm font-medium text-gray-700'>
              Local Government Area
            </label>
            <input
              type='text'
              id='lga'
              name='lga'
              value={formData.lga}
              onChange={handleInputChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              placeholder='Enter LGA'
            />
          </div>

          <div>
            <label htmlFor='ward' className='block text-sm font-medium text-gray-700'>
              Ward
            </label>
            <input
              type='text'
              id='ward'
              name='ward'
              value={formData.ward}
              onChange={handleInputChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              placeholder='Enter ward'
            />
          </div>

          <div>
            <label htmlFor='pollingUnitId' className='block text-sm font-medium text-gray-700'>
              Polling Unit ID
            </label>
            <input
              type='text'
              id='pollingUnitId'
              name='pollingUnitId'
              value={formData.pollingUnitId}
              onChange={handleInputChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              placeholder='Enter polling unit ID (optional)'
            />
          </div>
        </div>

        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating...' : 'Create Agent'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAgentModal;
