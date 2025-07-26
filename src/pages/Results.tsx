import {
  ChartBarIcon,
  UploadIcon as DocumentArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationIcon as ExclamationTriangleIcon,
  SearchIcon as MagnifyingGlassIcon,
  FilterIcon as FunnelIcon,
  PlusIcon,
  EyeIcon,
  LocationMarkerIcon as MapPinIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  PhotographIcon as PhotoIcon,
  DownloadIcon as ArrowDownTrayIcon,
  ChartPieIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { resultService } from '../services';
import { ElectionResult, ResultFilters } from '../types/result';
import { classNames } from '../utils/helpers';
import ResultDetailsModal from '../components/modals/ResultDetailsModal';
import UploadResultModal from '../components/modals/UploadResultModal';
import VerifyResultModal from '../components/modals/VerifyResultModal';

/**
 * Results component - Comprehensive election results management page
 * Features result upload, verification, and analytics
 */
const Results: React.FC = () => {
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<ElectionResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pollingUnitFilter, setPollingUnitFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [resultToVerify, setResultToVerify] = useState<ElectionResult | null>(null);

  // Fetch results on component mount
  useEffect(() => {
    fetchResults();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const filters: ResultFilters = {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        pollingUnitId: pollingUnitFilter || undefined,
      };
      const data = await resultService.getResults(filters);
      setResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, pollingUnitFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success-600 bg-success-100';
      case 'pending':
        return 'text-warning-600 bg-warning-100';
      case 'rejected':
        return 'text-error-600 bg-error-100';
      case 'draft':
        return 'text-secondary-600 bg-secondary-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className='h-4 w-4' />;
      case 'pending':
        return <ClockIcon className='h-4 w-4' />;
      case 'rejected':
        return <XCircleIcon className='h-4 w-4' />;
      case 'draft':
        return <DocumentTextIcon className='h-4 w-4' />;
      default:
        return <ExclamationTriangleIcon className='h-4 w-4' />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotalVotes = (result: ElectionResult) => {
    return (
      result.voteData.candidates?.reduce((total, candidate) => total + candidate.votes, 0) || 0
    );
  };

  const handleExportResults = () => {
    try {
      const csvContent = generateCSVContent(results);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `election_results_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting results:', error);
      setError('Failed to export results');
    }
  };

  const generateCSVContent = (results: ElectionResult[]) => {
    const headers = [
      'Polling Unit',
      'LGA',
      'State',
      'Status',
      'Agent',
      'Total Votes',
      'Valid Votes',
      'Invalid Votes',
      'Submitted Date',
      'Verified',
      'Verified By',
      'Verified Date'
    ];

    const rows = results.map(result => [
      result.pollingUnit?.name || 'Unknown',
      result.pollingUnit?.lga || 'Unknown',
      result.pollingUnit?.state || 'Unknown',
      result.isVerified ? 'Verified' : 'Pending',
      result.agent?.name || 'Unknown',
      calculateTotalVotes(result),
      result.voteData.validVotes,
      result.voteData.invalidVotes,
      formatDate(result.createdAt),
      result.isVerified ? 'Yes' : 'No',
      result.verifiedBy || '',
      result.verifiedAt ? formatDate(result.verifiedAt) : ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleViewDetails = (result: ElectionResult) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const handleVerifyResult = (result: ElectionResult) => {
    setResultToVerify(result);
    setShowVerifyModal(true);
  };

  const handleResultVerified = (updatedResult: ElectionResult) => {
    setResults(prevResults => 
      prevResults.map(result => 
        result.id === updatedResult.id ? updatedResult : result
      )
    );
  };

  const handleResultUploaded = (newResult: ElectionResult) => {
    setResults(prevResults => [newResult, ...prevResults]);
  };

  const ResultCard = ({ result }: { result: ElectionResult }) => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-2 mb-2'>
            <div className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100'>
              <span className='flex-shrink-0'>
                {getStatusIcon(result.isVerified ? 'verified' : 'pending')}
              </span>
              <span className='ml-1 capitalize'>{result.isVerified ? 'verified' : 'pending'}</span>
            </div>
            {result.isVerified && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-success-600 bg-success-100'>
                <CheckCircleIcon className='h-3 w-3 mr-1' />
                Verified
              </span>
            )}
          </div>

          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {result.pollingUnit?.name || 'Unknown Polling Unit'}
          </h3>

          <div className='space-y-2'>
            <div className='flex items-center text-sm text-gray-500'>
              <MapPinIcon className='h-4 w-4 mr-2' />
              <span>
                {result.pollingUnit?.lga} LGA, {result.pollingUnit?.state} State
              </span>
            </div>

            {result.agent && (
              <div className='flex items-center text-sm text-gray-500'>
                <UserIcon className='h-4 w-4 mr-2' />
                <span>Reported by: {result.agent.name}</span>
              </div>
            )}

            <div className='flex items-center text-sm text-gray-500'>
              <CalendarIcon className='h-4 w-4 mr-2' />
              <span>Submitted: {formatDate(result.createdAt)}</span>
            </div>

            <div className='flex items-center text-sm text-gray-500'>
              <ChartBarIcon className='h-4 w-4 mr-2' />
              <span>Total Votes: {calculateTotalVotes(result).toLocaleString()}</span>
            </div>
          </div>

          {result.voteData.candidates && result.voteData.candidates.length > 0 && (
            <div className='mt-4'>
              <h4 className='text-sm font-medium text-gray-900 mb-2'>Vote Breakdown:</h4>
              <div className='space-y-1'>
                {result.voteData.candidates.slice(0, 3).map((candidate, index) => (
                  <div key={index} className='flex justify-between text-sm'>
                    <span className='text-gray-600'>
                      {candidate.name} ({candidate.party})
                    </span>
                    <span className='font-medium'>{candidate.votes.toLocaleString()}</span>
                  </div>
                ))}
                {result.voteData.candidates.length > 3 && (
                  <div className='text-xs text-gray-500'>
                    +{result.voteData.candidates.length - 3} more candidates
                  </div>
                )}
              </div>
            </div>
          )}

          {result.formImageUrl && (
            <div className='mt-3 flex items-center space-x-2'>
              <PhotoIcon className='h-4 w-4 text-gray-400' />
              <span className='text-xs text-gray-500'>Form image attached</span>
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 flex space-x-2'>
        <button
          onClick={() => handleViewDetails(result)}
          className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <EyeIcon className='h-4 w-4 mr-1' />
          View Details
        </button>
        {!result.isVerified && (
          <button 
            onClick={() => handleVerifyResult(result)}
            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Verify
          </button>
        )}
      </div>
    </div>
  );

  const ResultListItem = ({ result }: { result: ElectionResult }) => (
    <tr className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>
          {result.pollingUnit?.name || 'Unknown'}
        </div>
        <div className='text-sm text-gray-500'>
          {result.pollingUnit?.lga || 'Unknown'} LGA, {result.pollingUnit?.state || 'Unknown'} State
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={classNames(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            result.isVerified
              ? 'text-success-600 bg-success-100'
              : 'text-warning-600 bg-warning-100',
          )}
        >
          {result.isVerified ? (
            <CheckCircleIcon className='h-4 w-4 mr-1' />
          ) : (
            <ClockIcon className='h-4 w-4 mr-1' />
          )}
          {result.isVerified ? 'Verified' : 'Pending'}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {result.agent?.name || 'Unknown'}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {calculateTotalVotes(result).toLocaleString()}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {formatDate(result.createdAt)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        {result.isVerified ? (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-success-600 bg-success-100'>
            <CheckCircleIcon className='h-3 w-3 mr-1' />
            Verified
          </span>
        ) : (
          <span className='text-xs text-gray-500'>Pending</span>
        )}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={() => handleViewDetails(result)}
          className='text-primary-600 hover:text-primary-900 mr-3'
        >
          View
        </button>
        {!result.isVerified && (
          <button 
            onClick={() => handleVerifyResult(result)}
            className='text-primary-600 hover:text-primary-900'
          >
            Verify
          </button>
        )}
      </td>
    </tr>
  );

  if (loading && results.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Results - eReporter</title>
        <meta name='description' content='View and manage election results' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <ChartBarIcon className='h-8 w-8 text-primary-600' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Results</h1>
              <p className='text-sm text-gray-600'>View and manage election results</p>
            </div>
          </div>
          <div className='flex space-x-3'>
            <button 
              onClick={handleExportResults}
              className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              <ArrowDownTrayIcon className='h-4 w-4 mr-2' />
              Export
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              <DocumentArrowUpIcon className='h-4 w-4 mr-2' />
              Upload Results
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <CheckCircleIcon className='h-6 w-6 text-success-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Verified Results</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {results.filter(r => r.isVerified).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <ClockIcon className='h-6 w-6 text-warning-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Pending Review</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {results.filter(r => !r.isVerified).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <ChartPieIcon className='h-6 w-6 text-primary-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Total Votes</dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {results
                        .reduce((total, result) => total + calculateTotalVotes(result), 0)
                        .toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <MapPinIcon className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>Polling Units</dt>
                    <dd className='text-lg font-medium text-gray-900'>{results.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
            <div className='flex-1 min-w-0 mr-4'>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                  placeholder='Search polling units...'
                />
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
              >
                <option value=''>All Status</option>
                <option value='verified'>Verified</option>
                <option value='pending'>Pending</option>
              </select>

              <div className='flex rounded-md shadow-sm'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={classNames(
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                  )}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={classNames(
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                  )}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='bg-error-50 border border-error-200 rounded-md p-4'>
            <div className='flex'>
              <ExclamationTriangleIcon className='h-5 w-5 text-error-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-error-800'>Error</h3>
                <p className='text-sm text-error-700 mt-1'>
                  {typeof error === 'string'
                    ? error
                    : (error as any)?.message || 'An unexpected error occurred'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {viewMode === 'grid' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {results.map(result => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        ) : (
          <div className='bg-white shadow overflow-hidden sm:rounded-md'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Polling Unit
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Agent
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total Votes
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Submitted
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Verification
                  </th>
                  <th className='relative px-6 py-3'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {results.map(result => (
                  <ResultListItem key={result.id} result={result} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && (
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-center py-12'>
              <ChartBarIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No results found</h3>
              <p className='mt-1 text-sm text-gray-500'>
                {searchTerm || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No election results have been uploaded yet.'}
              </p>
              <div className='mt-6'>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                >
                  <DocumentArrowUpIcon className='h-4 w-4 mr-2' />
                  Upload First Result
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ResultDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedResult(null);
        }}
        result={selectedResult}
      />

      <UploadResultModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onResultUploaded={handleResultUploaded}
      />

      <VerifyResultModal
        isOpen={showVerifyModal}
        onClose={() => {
          setShowVerifyModal(false);
          setResultToVerify(null);
        }}
        result={resultToVerify}
        onResultVerified={handleResultVerified}
      />
    </>
  );
};

export default Results;
