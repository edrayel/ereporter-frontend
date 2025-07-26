/**
 * Environment Configuration for EReporter
 * Supports three modes: proto, dev, prod
 */

export type AppMode = 'proto' | 'dev' | 'prod';

export interface EnvironmentConfig {
  mode: AppMode;
  apiUrl: string;
  wsUrl: string;
  mapProvider: 'google' | 'leaflet';
  googleMapsApiKey?: string;
  enableMockData: boolean;
  enableWebSockets: boolean;
  enableOfflineMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  enableTwoFactor: boolean;
  maxFileUploadSize: number; // in MB
  geoFenceRadius: number; // in meters
  locationUpdateInterval: number; // in milliseconds
  features: {
    agentTracking: boolean;
    incidentReporting: boolean;
    resultUpload: boolean;
    realTimeNotifications: boolean;
    auditLogs: boolean;
    candidatePortal: boolean;
    adminPanel: boolean;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const mode = (process.env.REACT_APP_MODE as AppMode) || 'proto';

  const baseConfig = {
    mode,
    maxFileUploadSize: 10,
    geoFenceRadius: 500,
    locationUpdateInterval: 30000,
  };

  switch (mode) {
    case 'proto':
      return {
        ...baseConfig,
        apiUrl: 'http://localhost:3001/api/v1', // Mock API server
        wsUrl: 'ws://localhost:3001',
        mapProvider: 'leaflet',
        enableMockData: true,
        enableWebSockets: false, // Use polling instead
        enableOfflineMode: true,
        logLevel: 'debug',
        enableAnalytics: false,
        enableTwoFactor: false,
        features: {
          agentTracking: true,
          incidentReporting: true,
          resultUpload: true,
          realTimeNotifications: false, // Use mock notifications
          auditLogs: true,
          candidatePortal: true,
          adminPanel: true,
        },
      };

    case 'dev':
      return {
        ...baseConfig,
        apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
        wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
        mapProvider: 'google',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        enableMockData: false,
        enableWebSockets: true,
        enableOfflineMode: true,
        logLevel: 'debug',
        enableAnalytics: false,
        enableTwoFactor: true,
        features: {
          agentTracking: true,
          incidentReporting: true,
          resultUpload: true,
          realTimeNotifications: true,
          auditLogs: true,
          candidatePortal: true,
          adminPanel: true,
        },
      };

    case 'prod':
      return {
        ...baseConfig,
        apiUrl: process.env.REACT_APP_API_URL || 'https://api.ereporter.ng/api/v1',
        wsUrl: process.env.REACT_APP_WS_URL || 'wss://api.ereporter.ng',
        mapProvider: 'google',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        enableMockData: false,
        enableWebSockets: true,
        enableOfflineMode: true,
        logLevel: 'warn',
        enableAnalytics: true,
        enableTwoFactor: true,
        maxFileUploadSize: 5, // Stricter limits in production
        geoFenceRadius: 200, // Tighter geo-fencing
        locationUpdateInterval: 15000, // More frequent updates
        features: {
          agentTracking: true,
          incidentReporting: true,
          resultUpload: true,
          realTimeNotifications: true,
          auditLogs: true,
          candidatePortal: true,
          adminPanel: true,
        },
      };

    default:
      throw new Error(`Unknown app mode: ${mode}`);
  }
};

export const config = getEnvironmentConfig();

// Logger utility based on environment
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (['debug'].includes(config.logLevel)) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (['debug', 'info'].includes(config.logLevel)) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(config.logLevel)) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
};

// Environment-specific feature flags
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  return config.features[feature];
};

// Mock data flag
export const shouldUseMockData = (): boolean => {
  return config.enableMockData;
};

// Development utilities
export const isDevelopment = (): boolean => {
  return config.mode === 'dev' || config.mode === 'proto';
};

export const isProduction = (): boolean => {
  return config.mode === 'prod';
};

export const isProtoMode = (): boolean => {
  return config.mode === 'proto';
};
