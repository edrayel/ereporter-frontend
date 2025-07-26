import { config } from './environment';

/**
 * Service configuration for API endpoints and settings
 */
export const serviceConfig = {
  // Base API configuration
  api: {
    baseURL: config.apiUrl,
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
  },

  // Authentication service endpoints
  auth: {
    login: '/v1/auth/login',
    register: '/v1/auth/register',
    logout: '/v1/auth/logout',
    refresh: '/v1/auth/refresh',
    profile: '/v1/auth/profile',
    changePassword: '/v1/auth/change-password',
    forgotPassword: '/v1/auth/forgot-password',
    resetPassword: '/v1/auth/reset-password',
    verifyEmail: '/v1/auth/verify-email',
  },

  // Agent service endpoints
  agents: {
    base: '/v1/agents',
    byId: (id: string) => `/v1/agents/${id}`,
    location: (id: string) => `/v1/agents/${id}/location`,
    assign: (id: string) => `/v1/agents/${id}/assign`,
    activate: (id: string) => `/v1/agents/${id}/activate`,
    deactivate: (id: string) => `/v1/agents/${id}/deactivate`,
    stats: '/v1/agents/stats',
    search: '/v1/agents/search',
    export: '/v1/agents/export',
  },

  // Polling unit service endpoints
  pollingUnits: {
    base: '/v1/polling-units',
    byId: (id: string) => `/v1/polling-units/${id}`,
    assignAgent: (id: string) => `/v1/polling-units/${id}/assign-agent`,
    removeAgent: (id: string, agentId: string) => `/v1/polling-units/${id}/agents/${agentId}`,
    activate: (id: string) => `/v1/polling-units/${id}/activate`,
    deactivate: (id: string) => `/v1/polling-units/${id}/deactivate`,
    stats: '/v1/polling-units/stats',
    search: '/v1/polling-units/search',
    export: '/v1/polling-units/export',
  },

  // Report service endpoints
  reports: {
    base: '/v1/reports',
    byId: (id: string) => `/v1/reports/${id}`,
    verify: (id: string) => `/v1/reports/${id}/verify`,
    reject: (id: string) => `/v1/reports/${id}/reject`,
    stats: '/v1/reports/stats',
    search: '/v1/reports/search',
    export: '/v1/reports/export',
    bulk: '/v1/reports/bulk',
  },

  // Dashboard service endpoints
  dashboard: {
    overview: '/v1/dashboard/overview',
    stats: '/v1/dashboard/stats',
    activities: '/v1/dashboard/activities',
    alerts: '/v1/dashboard/alerts',
    metrics: '/v1/dashboard/metrics',
    export: '/v1/dashboard/export',
  },

  // Notification service endpoints
  notifications: {
    base: '/v1/notifications',
    byId: (id: string) => `/v1/notifications/${id}`,
    markRead: (id: string) => `/v1/notifications/${id}/read`,
    markAllRead: '/v1/notifications/mark-all-read',
    stats: '/v1/notifications/stats',
    preferences: '/v1/notifications/preferences',
    bulk: '/v1/notifications/bulk',
    subscribe: '/v1/notifications/subscribe',
  },

  // Audit service endpoints
  audit: {
    base: '/v1/audit',
    byId: (id: string) => `/v1/audit/${id}`,
    stats: '/v1/audit/stats',
    search: '/v1/audit/search',
    export: '/v1/audit/export',
  },

  // Election results endpoints
  results: {
    base: '/v1/results',
    byId: (id: string) => `/v1/results/${id}`,
    verify: (id: string) => `/v1/results/${id}/verify`,
    stats: '/v1/results/stats',
    export: '/v1/results/export',
  },

  // File upload endpoints
  uploads: {
    base: '/v1/uploads',
    images: '/v1/uploads/images',
    documents: '/v1/uploads/documents',
    bulk: '/v1/uploads/bulk',
  },

  // WebSocket endpoints
  websocket: {
    base: config.wsUrl || config.apiUrl.replace('http', 'ws'),
    notifications: '/ws/notifications',
    dashboard: '/ws/dashboard',
    agents: '/ws/agents',
    reports: '/ws/reports',
  },
};

/**
 * Service-specific configuration options
 */
export const serviceOptions = {
  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Cache settings
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Maximum number of cached items
  },

  // Retry settings
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
  },

  // Real-time updates
  realtime: {
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
  },

  // File upload settings
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
    chunkSize: 1024 * 1024, // 1MB chunks for large files
  },

  // Search settings
  search: {
    minQueryLength: 2,
    debounceDelay: 300,
    maxResults: 50,
  },

  // Export settings
  export: {
    maxRecords: 10000,
    formats: ['csv', 'xlsx', 'pdf'],
    defaultFormat: 'csv',
  },
};

/**
 * HTTP status codes for error handling
 */
export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Error messages for common scenarios
 */
export const errorMessages = {
  network: 'Network error. Please check your connection and try again.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access denied. You do not have permission to access this resource.',
  notFound: 'The requested resource was not found.',
  conflict: 'A conflict occurred. The resource may have been modified by another user.',
  validation: 'Please check your input and try again.',
  server: 'An internal server error occurred. Please try again later.',
  timeout: 'The request timed out. Please try again.',
  unknown: 'An unexpected error occurred. Please try again.',
};

/**
 * Success messages for common operations
 */
export const successMessages = {
  created: 'Successfully created.',
  updated: 'Successfully updated.',
  deleted: 'Successfully deleted.',
  saved: 'Successfully saved.',
  sent: 'Successfully sent.',
  verified: 'Successfully verified.',
  activated: 'Successfully activated.',
  deactivated: 'Successfully deactivated.',
  exported: 'Successfully exported.',
  imported: 'Successfully imported.',
};

export default serviceConfig;
