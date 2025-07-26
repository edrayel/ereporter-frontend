import React, { useState } from 'react';
import {
  UploadIcon as DocumentArrowUpIcon,
  PhotographIcon as PhotoIcon,
  XIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import Modal from '../ui/Modal';
import { CreateResultRequest } from '../../types/result';

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultUploaded: (result: any) => void;
}

const UploadResultModal: React.FC<UploadResultModalProps> = ({
  isOpen,
  onClose,
  onResultUploaded,
}) => {
  const [formData, setFormData] = useState({
    totalVotes: '',
    validVotes: '',
    invalidVotes: '',
    candidates: [{ name: '', party: '', votes: '' }],
  });
  const [formImage, setFormImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCandidateChange = (index: number, field: string, value: string) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[index] = { ...updatedCandidates[index], [field]: value };
    setFormData(prev => ({ ...prev, candidates: updatedCandidates }));
  };

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { name: '', party: '', votes: '' }],
    }));
  };

  const removeCandidate = (index: number) => {
    if (formData.candidates.length > 1) {
      const updatedCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, candidates: updatedCandidates }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.totalVotes) {
      newErrors.totalVotes = 'Total votes is required';
    } else if (isNaN(Number(formData.totalVotes)) || Number(formData.totalVotes) < 0) {
      newErrors.totalVotes = 'Total votes must be a valid number';
    }

    if (!formData.validVotes) {
      newErrors.validVotes = 'Valid votes is required';
    } else if (isNaN(Number(formData.validVotes)) || Number(formData.validVotes) < 0) {
      newErrors.validVotes = 'Valid votes must be a valid number';
    }

    if (!formData.invalidVotes) {
      newErrors.invalidVotes = 'Invalid votes is required';
    } else if (isNaN(Number(formData.invalidVotes)) || Number(formData.invalidVotes) < 0) {
      newErrors.invalidVotes = 'Invalid votes must be a valid number';
    }

    // Validate candidates
    formData.candidates.forEach((candidate, index) => {
      if (!candidate.name) {
        newErrors[`candidate_${index}_name`] = 'Candidate name is required';
      }
      if (!candidate.party) {
        newErrors[`candidate_${index}_party`] = 'Party is required';
      }
      if (!candidate.votes) {
        newErrors[`candidate_${index}_votes`] = 'Votes is required';
      } else if (isNaN(Number(candidate.votes)) || Number(candidate.votes) < 0) {
        newErrors[`candidate_${index}_votes`] = 'Votes must be a valid number';
      }
    });

    // Check if total votes match
    const candidateVotesSum = formData.candidates.reduce(
      (sum, candidate) => sum + (Number(candidate.votes) || 0),
      0
    );
    const totalValidInvalid = (Number(formData.validVotes) || 0) + (Number(formData.invalidVotes) || 0);
    
    if (candidateVotesSum !== Number(formData.validVotes)) {
      newErrors.validation = 'Sum of candidate votes must equal valid votes';
    }

    if (totalValidInvalid !== Number(formData.totalVotes)) {
      newErrors.validation = 'Valid votes + Invalid votes must equal total votes';
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
      const resultData: CreateResultRequest = {
        voteData: {
          totalVotes: Number(formData.totalVotes),
          validVotes: Number(formData.validVotes),
          invalidVotes: Number(formData.invalidVotes),
          candidates: formData.candidates.map(candidate => ({
            name: candidate.name,
            party: candidate.party,
            votes: Number(candidate.votes),
          })),
        },
        formImage: formImage || undefined,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock result
      const newResult = {
        id: `result_${Date.now()}`,
        agentId: 'current_agent',
        pollingUnitId: 'current_unit',
        voteData: resultData.voteData,
        formImageUrl: imagePreview,
        timestamp: new Date().toISOString(),
        coordinates: { latitude: 0, longitude: 0 },
        isVerified: false,
        createdAt: new Date().toISOString(),
        pollingUnit: {
          name: 'Sample Polling Unit',
          lga: 'Sample LGA',
          state: 'Sample State',
        },
        agent: {
          name: 'Current Agent',
        },
      };

      onResultUploaded(newResult);
      handleClose();
    } catch (error) {
      console.error('Error uploading result:', error);
      setErrors({ submit: 'Failed to upload result. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      totalVotes: '',
      validVotes: '',
      invalidVotes: '',
      candidates: [{ name: '', party: '', votes: '' }],
    });
    setFormImage(null);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Election Result" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vote Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Votes *
            </label>
            <input
              type="number"
              value={formData.totalVotes}
              onChange={(e) => handleInputChange('totalVotes', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.totalVotes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter total votes"
            />
            {errors.totalVotes && (
              <p className="text-red-500 text-xs mt-1">{errors.totalVotes}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Votes *
            </label>
            <input
              type="number"
              value={formData.validVotes}
              onChange={(e) => handleInputChange('validVotes', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.validVotes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter valid votes"
            />
            {errors.validVotes && (
              <p className="text-red-500 text-xs mt-1">{errors.validVotes}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invalid Votes *
            </label>
            <input
              type="number"
              value={formData.invalidVotes}
              onChange={(e) => handleInputChange('invalidVotes', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.invalidVotes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter invalid votes"
            />
            {errors.invalidVotes && (
              <p className="text-red-500 text-xs mt-1">{errors.invalidVotes}</p>
            )}
          </div>
        </div>

        {/* Validation Error */}
        {errors.validation && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.validation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Candidate Results</h3>
            <button
              type="button"
              onClick={addCandidate}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Candidate
            </button>
          </div>

          <div className="space-y-4">
            {formData.candidates.map((candidate, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors[`candidate_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter candidate name"
                  />
                  {errors[`candidate_${index}_name`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`candidate_${index}_name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party *
                  </label>
                  <input
                    type="text"
                    value={candidate.party}
                    onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors[`candidate_${index}_party`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter party"
                  />
                  {errors[`candidate_${index}_party`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`candidate_${index}_party`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Votes *
                  </label>
                  <input
                    type="number"
                    value={candidate.votes}
                    onChange={(e) => handleCandidateChange(index, 'votes', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors[`candidate_${index}_votes`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter votes"
                  />
                  {errors[`candidate_${index}_votes`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`candidate_${index}_votes`]}</p>
                  )}
                </div>

                <div className="flex items-end">
                  {formData.candidates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Result Form Image (Optional)
          </label>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload result form image
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Form preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

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
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Upload Result
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadResultModal;