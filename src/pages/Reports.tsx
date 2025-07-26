import {
  DocumentTextIcon,
  ExclamationIcon as ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  SearchIcon as MagnifyingGlassIcon,
  FilterIcon as FunnelIcon,
  PlusIcon,
  EyeIcon,
  LocationMarkerIcon as MapPinIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  PhotographIcon as PhotoIcon,
  VideoCameraIcon,
  VolumeUpIcon as SpeakerWaveIcon,
} from '@heroicons/react/outline';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { reportService } from '../services';
import {
  Report,
  ReportFilters,
  ReportStatus,
  ReportCategory,
  ReportSeverity,
} from '../types/report';
import { classNames } from '../utils/helpers';
import NewReportModal from '../components/modals/NewReportModal';
import ReportDetailsModal from '../components/modals/ReportDetailsModal';
import InvestigateReportModal from '../components/modals/InvestigateReportModal';

/**
 * Reports component - Comprehensive incident reports management page
 * Features real-time incident tracking, filtering, and detailed views
 */
const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | ''>('');
  const [severityFilter, setSeverityFilter] = useState<ReportSeverity | ''>('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInvestigateModal, setShowInvestigateModal] = useState(false);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const filters: ReportFilters = {
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        severity: severityFilter || undefined,
        status: statusFilter || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      };
      const data = await reportService.getReports(filters);
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReports();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter, severityFilter, statusFilter, dateRange]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error-600 bg-error-100';
      case 'high':
        return 'text-warning-600 bg-warning-100';
      case 'medium':
        return 'text-secondary-600 bg-secondary-100';
      case 'low':
        return 'text-success-600 bg-success-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-success-600 bg-success-100';
      case 'reviewed':
        return 'text-warning-600 bg-warning-100';
      case 'pending':
        return 'text-secondary-600 bg-secondary-100';
      case 'dismissed':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircleIcon className='h-4 w-4' />;
      case 'reviewed':
        return <ClockIcon className='h-4 w-4' />;
      case 'pending':
        return <ExclamationTriangleIcon className='h-4 w-4' />;
      case 'dismissed':
        return <XCircleIcon className='h-4 w-4' />;
      default:
        return <DocumentTextIcon className='h-4 w-4' />;
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

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className='h-4 w-4' />;
      case 'video':
        return <VideoCameraIcon className='h-4 w-4' />;
      case 'audio':
        return <SpeakerWaveIcon className='h-4 w-4' />;
      default:
        return <DocumentTextIcon className='h-4 w-4' />;
    }
  };

  // Modal handlers
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleInvestigateReport = (report: Report) => {
    setSelectedReport(report);
    setShowInvestigateModal(true);
  };

  const handleReportCreated = (newReport: any) => {
    setReports(prev => [newReport, ...prev]);
    setShowNewReportModal(false);
  };

  const handleReportUpdated = (updatedReport: any) => {
    setReports(prev => prev.map(r => (r.id === updatedReport.id ? updatedReport : r)));
    setShowInvestigateModal(false);
  };

  // Transform Report to modal-compatible format
  const transformReportForModal = (report: Report) => {
    return {
      ...report,
      pollingUnit: report.pollingUnit?.name || report.pollingUnit?.code || undefined,
      attachments: report.attachments?.length || 0,
    };
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-2 mb-2'>
            <span
              className={classNames(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getSeverityColor(report.severity),
              )}
            >
              <span className='capitalize'>{report.severity}</span>
            </span>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100'>
              <span className='flex-shrink-0'>{getStatusIcon(report.status)}</span>
              <span className='ml-1 capitalize'>{report.status}</span>
            </span>
          </div>

          <h3 className='text-lg font-medium text-gray-900 mb-2'>{report.title}</h3>
          <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{report.description}</p>

          <div className='space-y-2'>
            <div className='flex items-center text-sm text-gray-500'>
              <TagIcon className='h-4 w-4 mr-2' />
              <span className='capitalize'>{report.category}</span>
            </div>

            {report.agent && (
              <div className='flex items-center text-sm text-gray-500'>
                <UserIcon className='h-4 w-4 mr-2' />
                <span>{report.agent.name}</span>
              </div>
            )}

            {report.pollingUnit && (
              <div className='flex items-center text-sm text-gray-500'>
                <MapPinIcon className='h-4 w-4 mr-2' />
                <span>{report.pollingUnit.name}</span>
              </div>
            )}

            <div className='flex items-center text-sm text-gray-500'>
              <CalendarIcon className='h-4 w-4 mr-2' />
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>

          {report.attachments && report.attachments.length > 0 && (
            <div className='mt-3 flex items-center space-x-2'>
              <span className='text-xs text-gray-500'>Attachments:</span>
              {report.attachments.slice(0, 3).map((attachment, index) => (
                <div key={index} className='flex items-center text-xs text-gray-400'>
                  <span className='flex-shrink-0'>{getMediaIcon(attachment.type)}</span>
                </div>
              ))}
              {report.attachments.length > 3 && (
                <span className='text-xs text-gray-400'>+{report.attachments.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 flex space-x-2'>
        <button
          onClick={() => handleViewDetails(report)}
          className='flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <EyeIcon className='h-4 w-4 mr-1' />
          View Details
        </button>
        {report.status === 'pending' && (
          <button
            onClick={() => handleInvestigateReport(report)}
            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Investigate
          </button>
        )}
      </div>
    </div>
  );

  const ReportListItem = ({ report }: { report: Report }) => (
    <tr className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>{report.title}</div>
        <div className='text-sm text-gray-500 capitalize'>{report.category}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={classNames(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getSeverityColor(report.severity),
          )}
        >
          <span className='capitalize'>{report.severity}</span>
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100'>
          <span className='flex-shrink-0'>{getStatusIcon(report.status)}</span>
          <span className='ml-1 capitalize'>{report.status}</span>
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {report.agent?.name || 'Unknown'}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {report.pollingUnit?.name || 'Not specified'}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {formatDate(report.createdAt)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={() => handleViewDetails(report)}
          className='text-primary-600 hover:text-primary-900 mr-3'
        >
          View
        </button>
        {report.status === 'pending' && (
          <button
            onClick={() => handleInvestigateReport(report)}
            className='text-primary-600 hover:text-primary-900'
          >
            Investigate
          </button>
        )}
      </td>
    </tr>
  );

  if (loading && reports.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reports - eReporter</title>
        <meta name='description' content='View and manage incident reports' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <DocumentTextIcon className='h-8 w-8 text-primary-600' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Reports</h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                View and manage incident reports
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewReportModal(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            <PlusIcon className='h-4 w-4 mr-2' />
            New Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <ExclamationTriangleIcon className='h-6 w-6 text-warning-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Pending Reports
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                      {reports.filter(r => r.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <ClockIcon className='h-6 w-6 text-secondary-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Investigating
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                      {reports.filter(r => r.status === 'reviewed').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <XCircleIcon className='h-6 w-6 text-error-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Critical
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                      {reports.filter(r => r.severity === 'critical').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <DocumentTextIcon className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                      Total Reports
                    </dt>
                    <dd className='text-lg font-medium text-gray-900 dark:text-white'>
                      {reports.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
            <div className='lg:col-span-2'>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  placeholder='Search reports...'
                />
              </div>
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as ReportCategory | '')}
              className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            >
              <option value=''>All Categories</option>
              <option value='violence'>Violence</option>
              <option value='irregularity'>Irregularity</option>
              <option value='technical'>Technical</option>
              <option value='logistics'>Logistics</option>
              <option value='other'>Other</option>
            </select>

            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as ReportSeverity | '')}
              className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            >
              <option value=''>All Severities</option>
              <option value='critical'>Critical</option>
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as ReportStatus | '')}
              className='focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            >
              <option value=''>All Status</option>
              <option value='pending'>Pending</option>
              <option value='investigating'>Investigating</option>
              <option value='resolved'>Resolved</option>
              <option value='escalated'>Escalated</option>
            </select>

            <div className='flex rounded-md shadow-sm'>
              <button
                onClick={() => setViewMode('grid')}
                className={classNames(
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600',
                  'relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                )}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={classNames(
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600',
                  'relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
                )}
              >
                List
              </button>
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

        {/* Reports Display */}
        {viewMode === 'grid' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Report
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Severity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Reporter
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Location
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='relative px-6 py-3'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {reports.map(report => (
                  <ReportListItem key={report.id} report={report} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {reports.length === 0 && !loading && (
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            <div className='text-center py-12'>
              <DocumentTextIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                No reports found
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {searchTerm || categoryFilter || severityFilter || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No incident reports have been submitted yet.'}
              </p>
              <div className='mt-6'>
                <button
                  onClick={() => setShowNewReportModal(true)}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                >
                  <PlusIcon className='h-4 w-4 mr-2' />
                  Create Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewReportModal
        isOpen={showNewReportModal}
        onClose={() => setShowNewReportModal(false)}
        onReportCreated={handleReportCreated}
      />

      <ReportDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        report={selectedReport ? transformReportForModal(selectedReport) : null}
      />

      <InvestigateReportModal
        isOpen={showInvestigateModal}
        onClose={() => setShowInvestigateModal(false)}
        report={selectedReport ? transformReportForModal(selectedReport) : null}
        onReportUpdated={handleReportUpdated}
      />
    </>
  );
};

export default Reports;
