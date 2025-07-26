import React, { useState } from 'react';
import {
  ExclamationCircleIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';

interface Report {
  id: string;
  title: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  status: string;
  reportedBy: string;
  reportedAt: string;
}

interface InvestigateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onReportUpdated: (updatedReport: any) => void;
}

interface InvestigationData {
  status: string;
  assignedTo: string;
  priority: string;
  notes: string;
  estimatedResolution: string;
  actions: string[];
}

const InvestigateReportModal: React.FC<InvestigateReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onReportUpdated,
}) => {
  const [investigationData, setInvestigationData] = useState<InvestigationData>({
    status: 'investigating',
    assignedTo: '',
    priority: 'medium',
    notes: '',
    estimatedResolution: '',
    actions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvestigationData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActionChange = (action: string, checked: boolean) => {
    setInvestigationData(prev => ({
      ...prev,
      actions: checked
        ? [...prev.actions, action]
        : prev.actions.filter(a => a !== action),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedReport = {
        ...report,
        status: investigationData.status,
        assignedTo: investigationData.assignedTo,
        priority: investigationData.priority,
        investigationNotes: investigationData.notes,
        estimatedResolution: investigationData.estimatedResolution,
        actions: investigationData.actions,
        lastUpdated: new Date().toISOString(),
      };

      onReportUpdated(updatedReport);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update investigation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInvestigationData({
      status: 'investigating',
      assignedTo: '',
      priority: 'medium',
      notes: '',
      estimatedResolution: '',
      actions: [],
    });
    setError(null);
    onClose();
  };

  if (!report) return null;

  const availableActions = [
    'Contact reporter for additional information',
    'Visit location for on-site investigation',
    'Interview witnesses',
    'Collect physical evidence',
    'Review security footage',
    'Coordinate with local authorities',
    'Escalate to higher authority',
    'Request technical support',
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Investigate Report" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Report Summary</h4>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">Title:</span> {report.title}</p>
            <p className="text-sm"><span className="font-medium">Category:</span> {report.category}</p>
            <p className="text-sm"><span className="font-medium">Severity:</span> {report.severity}</p>
            <p className="text-sm"><span className="font-medium">Location:</span> {report.location}</p>
            <p className="text-sm"><span className="font-medium">Reported by:</span> {report.reportedBy}</p>
          </div>
        </div>

        {/* Investigation Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Investigation Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                Investigation Status
              </label>
              <select
                id="status"
                name="status"
                value={investigationData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="investigating">Investigating</option>
                <option value="pending">Pending</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="h-4 w-4 inline mr-1" />
                Assign To
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={investigationData.assignedTo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select investigator</option>
                <option value="John Smith">John Smith - Senior Investigator</option>
                <option value="Sarah Johnson">Sarah Johnson - Field Investigator</option>
                <option value="Michael Brown">Michael Brown - Technical Specialist</option>
                <option value="Emily Davis">Emily Davis - Security Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                <ExclamationCircleIcon className="h-4 w-4 inline mr-1" />
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={investigationData.priority}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="estimatedResolution" className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Estimated Resolution
              </label>
              <input
                type="date"
                id="estimatedResolution"
                name="estimatedResolution"
                value={investigationData.estimatedResolution}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              <DocumentTextIcon className="h-4 w-4 inline mr-1" />
              Investigation Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={investigationData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter investigation notes, findings, and observations..."
            />
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Required Actions
          </h4>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Select the actions that need to be taken for this investigation:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableActions.map((action, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`action-${index}`}
                    checked={investigationData.actions.includes(action)}
                    onChange={(e) => handleActionChange(action, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`action-${index}`} className="ml-2 block text-sm text-gray-900">
                    {action}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Start Investigation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InvestigateReportModal;