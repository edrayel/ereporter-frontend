import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config, logger } from '../config/environment';
import { serviceOptions, httpStatus, errorMessages } from '../config/services';

/**
 * Common service utilities and helpers
 */

/**
 * Creates a standardized API client with common configuration
 */
export function createApiClient(baseURL?: string) {
  const client = axios.create({
    baseURL: baseURL || config.apiUrl,
    timeout: serviceOptions.retry.maxDelay,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for authentication
  client.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      logger.error('Request interceptor error', error);
      return Promise.reject(error);
    },
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    response => response,
    error => {
      logger.error('API Error', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
      });
      return Promise.reject(error);
    },
  );

  return client;
}

/**
 * Retry mechanism for failed requests
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxAttempts: number = serviceOptions.retry.maxAttempts,
  baseDelay: number = serviceOptions.retry.baseDelay,
): Promise<T> {
  let lastError: Error = new Error('Request failed after all attempts');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        break;
      }

      // Don't retry on certain error types
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (
          status &&
          [httpStatus.UNAUTHORIZED, httpStatus.FORBIDDEN, httpStatus.NOT_FOUND].includes(status)
        ) {
          break;
        }
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(serviceOptions.retry.backoffFactor, attempt - 1),
        serviceOptions.retry.maxDelay,
      );

      logger.warn(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Builds query parameters from filters object
 */
export function buildQueryParams(filters: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  return params;
}

/**
 * Handles API errors and returns user-friendly messages
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case httpStatus.BAD_REQUEST:
        return message || errorMessages.validation;
      case httpStatus.UNAUTHORIZED:
        return errorMessages.unauthorized;
      case httpStatus.FORBIDDEN:
        return errorMessages.forbidden;
      case httpStatus.NOT_FOUND:
        return errorMessages.notFound;
      case httpStatus.CONFLICT:
        return errorMessages.conflict;
      case httpStatus.UNPROCESSABLE_ENTITY:
        return message || errorMessages.validation;
      case httpStatus.TOO_MANY_REQUESTS:
        return 'Too many requests. Please try again later.';
      case httpStatus.INTERNAL_SERVER_ERROR:
      case httpStatus.BAD_GATEWAY:
      case httpStatus.SERVICE_UNAVAILABLE:
      case httpStatus.GATEWAY_TIMEOUT:
        return errorMessages.server;
      default:
        return message || errorMessages.unknown;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Network Error') || error.message.includes('timeout')) {
      return errorMessages.network;
    }
    return error.message;
  }

  return errorMessages.unknown;
}

/**
 * Validates file upload constraints
 */
export function validateFileUpload(
  file: File,
  type: 'image' | 'document' = 'image',
): string | null {
  const { maxFileSize, allowedImageTypes, allowedDocumentTypes } = serviceOptions.upload;

  // Check file size
  if (file.size > maxFileSize) {
    return `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`;
  }

  // Check file type
  const allowedTypes = type === 'image' ? allowedImageTypes : allowedDocumentTypes;
  if (!allowedTypes.includes(file.type)) {
    return `File type ${file.type} is not allowed`;
  }

  return null;
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = serviceOptions.search.debounceDelay,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Creates a cache with TTL support
 */
export class ServiceCache<T> {
  private cache = new Map<string, { data: T; expires: number }>();
  private defaultTTL: number;
  private maxSize: number;

  constructor(
    defaultTTL: number = serviceOptions.cache.defaultTTL,
    maxSize: number = serviceOptions.cache.maxSize,
  ) {
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl?: number): void {
    // Remove expired entries and enforce max size
    this.cleanup();

    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expires });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Formats date for API requests
 */
export function formatDateForApi(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
}

/**
 * Parses API date response
 */
export function parseDateFromApi(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Generates a unique request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Logs service operations for debugging
 */
export function logServiceOperation(
  service: string,
  operation: string,
  data?: any,
  duration?: number,
): void {
  logger.info(`${service}.${operation}`, {
    service,
    operation,
    data,
    duration,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Creates a service method wrapper with common functionality
 */
export function createServiceMethod<T extends any[], R>(
  serviceName: string,
  methodName: string,
  implementation: (...args: T) => Promise<R>,
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    const requestId = generateRequestId();

    try {
      logger.debug(`${serviceName}.${methodName} started`, { requestId, args });

      const result = await implementation(...args);

      const duration = Date.now() - startTime;
      logServiceOperation(serviceName, methodName, { success: true }, duration);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = handleApiError(error);

      logger.error(`${serviceName}.${methodName} failed`, {
        requestId,
        error: errorMessage,
        duration,
      });

      logServiceOperation(
        serviceName,
        methodName,
        { success: false, error: errorMessage },
        duration,
      );

      throw new Error(errorMessage);
    }
  };
}

export default {
  createApiClient,
  retryRequest,
  buildQueryParams,
  handleApiError,
  validateFileUpload,
  formatFileSize,
  debounce,
  throttle,
  ServiceCache,
  formatDateForApi,
  parseDateFromApi,
  generateRequestId,
  logServiceOperation,
  createServiceMethod,
};
