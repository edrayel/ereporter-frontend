import React, { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { ElectionResult } from '../../types/result';

interface VerifyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ElectionResult | null;
  onResultVerified: (result: ElectionResult) => void;
}

const VerifyResultModal: React.FC<VerifyResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onResultVerified,
}) => {
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject' | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!verificationAction) {
      newErrors.action = 'Please select an action (Approve or Reject)';
    }

    if (verificationAction === 'reject' && !notes.trim()) {
      newErrors.notes = 'Rejection reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedResult = {
        ...result,
        isVerified: verificationAction === 'approve',
        verifiedBy: 'Current User',
        verifiedAt: new Date().toISOString(),
        verificationNotes: notes,
      };

      onResultVerified(updatedResult);
      handleClose();
    } catch (error) {
      console.error('Error verifying result:', error);
      setErrors({ submit: 'Failed to verify result. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVerificationAction('');
    setNotes('');
    setErrors({});
    onClose();
  };

  const hasDiscrepancies = () => {
    const candidateVotesSum = calculateTotalVotes();
    const totalVotes = result.voteData.totalVotes;
    const validVotes = result.voteData.validVotes;
    const invalidVotes = result.voteData.invalidVotes;

    return candidateVotesSum !== validVotes || validVotes + invalidVotes !== totalVotes;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Verify Election Result' size='xl'>
      <div className='space-y-6'>
        {/* Result Summary */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='flex items-start space-x-3'>
            <DocumentTextIcon className='h-8 w-8 text-primary-600 flex-shrink-0' />
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {result.pollingUnit?.name || 'Unknown Polling Unit'}
              </h3>
              <p className='text-sm text-gray-600'>
                {result.pollingUnit?.lga} LGA, {result.pollingUnit?.state} State
              </p>
              <div className='mt-2 flex items-center space-x-4 text-sm text-gray-500'>
                <div className='flex items-center'>
                  <UserIcon className='h-4 w-4 mr-1' />
                  <span>Reported by: {result.agent?.name || 'Unknown'}</span>
                </div>
                <div className='flex items-center'>
                  <CalendarIcon className='h-4 w-4 mr-1' />
                  <span>Submitted: {formatDate(result.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vote Summary */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-lg font-medium text-gray-900 mb-3'>Vote Totals</h4>
            <div className='space-y-2'>
              <div className='flex justify-between py-2 border-b border-gray-200'>
                <span className='text-gray-600'>Total Votes:</span>
                <span className='font-medium'>{result.voteData.totalVotes.toLocaleString()}</span>
              </div>
              <div className='flex justify-between py-2 border-b border-gray-200'>
                <span className='text-gray-600'>Valid Votes:</span>
                <span className='font-medium'>{result.voteData.validVotes.toLocaleString()}</span>
              </div>
              <div className='flex justify-between py-2 border-b border-gray-200'>
                <span className='text-gray-600'>Invalid Votes:</span>
                <span className='font-medium'>{result.voteData.invalidVotes.toLocaleString()}</span>
              </div>
              <div className='flex justify-between py-2 font-semibold'>
                <span className='text-gray-900'>Candidate Votes Sum:</span>
                <span
                  className={
                    calculateTotalVotes() === result.voteData.validVotes
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {calculateTotalVotes().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-lg font-medium text-gray-900 mb-3'>Candidate Results</h4>
            <div className='space-y-2'>
              {result.voteData.candidates.map((candidate, index) => (
                <div key={index} className='flex justify-between py-2 border-b border-gray-200'>
                  <div>
                    <span className='font-medium text-gray-900'>{candidate.name}</span>
                    <span className='text-sm text-gray-500 ml-2'>({candidate.party})</span>
                  </div>
                  <span className='font-medium'>{candidate.votes.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Discrepancy Warning */}
        {hasDiscrepancies() && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
            <div className='flex'>
              <ExclamationCircleIcon className='h-5 w-5 text-yellow-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-yellow-800'>Data Discrepancy Detected</h3>
                <div className='mt-2 text-sm text-yellow-700'>
                  <ul className='list-disc list-inside space-y-1'>
                    {calculateTotalVotes() !== result.voteData.validVotes && (
                      <li>
                        Sum of candidate votes ({calculateTotalVotes()}) does not match valid votes
                        ({result.voteData.validVotes})
                      </li>
                    )}
                    {result.voteData.validVotes + result.voteData.invalidVotes !==
                      result.voteData.totalVotes && (
                      <li>Valid votes + Invalid votes does not equal total votes</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Image */}
        {result.formImageUrl && (
          <div>
            <h4 className='text-lg font-medium text-gray-900 mb-3'>Result Form</h4>
            <div className='bg-gray-100 rounded-lg p-4'>
              <img
                src={result.formImageUrl}
                alt='Result Form'
                className='w-full h-auto max-h-96 object-contain rounded-lg'
              />
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Verification Decision *
            </label>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='verification'
                  value='approve'
                  checked={verificationAction === 'approve'}
                  onChange={e => setVerificationAction(e.target.value as 'approve')}
                  className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                />
                <span className='ml-2 flex items-center text-sm text-gray-900'>
                  <CheckCircleIcon className='h-5 w-5 text-green-500 mr-2' />
                  Approve Result
                </span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='verification'
                  value='reject'
                  checked={verificationAction === 'reject'}
                  onChange={e => setVerificationAction(e.target.value as 'reject')}
                  className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                />
                <span className='ml-2 flex items-center text-sm text-gray-900'>
                  <XCircleIcon className='h-5 w-5 text-red-500 mr-2' />
                  Reject Result
                </span>
              </label>
            </div>
            {errors.action && <p className='text-red-500 text-xs mt-1'>{errors.action}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {verificationAction === 'reject' ? 'Rejection Reason *' : 'Notes (Optional)'}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={
                verificationAction === 'reject'
                  ? 'Please provide a reason for rejection...'
                  : 'Add any additional notes...'
              }
            />
            {errors.notes && <p className='text-red-500 text-xs mt-1'>{errors.notes}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <div className='flex'>
                <ExclamationCircleIcon className='h-5 w-5 text-red-400' />
                <div className='ml-3'>
                  <p className='text-sm text-red-800'>{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

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
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                verificationAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : verificationAction === 'reject'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              }`}
            >
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Processing...
                </>
              ) : (
                <>
                  {verificationAction === 'approve' ? (
                    <CheckCircleIcon className='h-4 w-4 mr-2' />
                  ) : verificationAction === 'reject' ? (
                    <XCircleIcon className='h-4 w-4 mr-2' />
                  ) : null}
                  {verificationAction === 'approve'
                    ? 'Approve Result'
                    : verificationAction === 'reject'
                      ? 'Reject Result'
                      : 'Submit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default VerifyResultModal;
