import axios from 'axios';
import { config, logger, shouldUseMockData } from '../config/environment';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  User,
  PasswordResetRequest,
  PasswordReset,
  ChangePassword,
  TwoFactorSetup,
  TwoFactorVerification,
} from '../types/auth';
import { mockDataService } from './mockDataService';

const API_BASE_URL = config.apiUrl;

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('token', response.token);
              if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
              }

              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    logger.info('Attempting login', { email: credentials.email, mode: config.mode });

    if (shouldUseMockData()) {
      // Mock login for proto mode
      const users = mockDataService.getUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // In proto mode, accept any password for demo purposes
      const mockToken = `mock_token_${user.id}_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_${user.id}_${Date.now()}`;

      logger.info('Mock login successful', { userId: user.id });

      return {
        token: mockToken,
        refreshToken: mockRefreshToken,
        user,
        expiresIn: 3600,
      };
    }

    const response = await this.api.post('/v1/auth/login', credentials);
    logger.info('Login successful', { userId: response.data.user?.id });
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    logger.info('Attempting registration', { email: userData.email, mode: config.mode });

    if (shouldUseMockData()) {
      // Mock registration for proto mode
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
        role: 'agent', // Default role for new registrations
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const mockToken = `mock_token_${newUser.id}_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_${newUser.id}_${Date.now()}`;

      logger.info('Mock registration successful', { userId: newUser.id });

      return {
        token: mockToken,
        refreshToken: mockRefreshToken,
        user: newUser,
        expiresIn: 3600,
      };
    }

    const response = await this.api.post('/v1/auth/register', userData);
    logger.info('Registration successful', { userId: response.data.user?.id });
    return response.data;
  }

  async logout(token: string): Promise<void> {
    logger.info('Logging out', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock logout for proto mode
      logger.info('Mock logout successful');
      return;
    }

    await this.api.post(
      '/v1/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    logger.info('Logout successful');
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    logger.debug('Refreshing token', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock token refresh for proto mode
      if (!refreshToken.startsWith('mock_refresh_')) {
        throw new Error('Invalid refresh token');
      }

      const userId = refreshToken.split('_')[2];
      const newToken = `mock_token_${userId}_${Date.now()}`;
      const newRefreshToken = `mock_refresh_${userId}_${Date.now()}`;

      logger.debug('Mock token refresh successful', { userId });

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      };
    }

    const response = await this.api.post('/v1/auth/refresh', {
      refreshToken,
    });
    logger.debug('Token refresh successful');
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    if (shouldUseMockData()) {
      // Extract user ID from mock token
      const token = localStorage.getItem('token');
      if (!token || !token.startsWith('mock_token_')) {
        throw new Error('Invalid token');
      }

      const userId = token.split('_')[2];
      const users = mockDataService.getUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      logger.debug('Retrieved current user from mock data', { userId: user.id });
      return user;
    }

    const response = await this.api.get('/v1/auth/me');
    logger.debug('Retrieved current user', { userId: response.data.id });
    return response.data;
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    logger.info('Requesting password reset', { email: data.email, mode: config.mode });

    if (shouldUseMockData()) {
      // Mock password reset request for proto mode
      const users = mockDataService.getUsers();
      const user = users.find(u => u.email === data.email);

      if (!user) {
        // Don't reveal if email exists in proto mode
        logger.info('Mock password reset request processed');
        return;
      }

      logger.info('Mock password reset request successful', { userId: user.id });
      return;
    }

    await this.api.post('/v1/auth/forgot-password', data);
    logger.info('Password reset request successful');
  }

  async resetPassword(data: PasswordReset): Promise<void> {
    logger.info('Resetting password', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock password reset for proto mode
      logger.info('Mock password reset successful');
      return;
    }

    await this.api.post('/v1/auth/reset-password', data);
    logger.info('Password reset successful');
  }

  async changePassword(data: ChangePassword): Promise<void> {
    logger.info('Changing password', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock password change for proto mode
      logger.info('Mock password change successful');
      return;
    }

    await this.api.post('/v1/auth/change-password', data);
    logger.info('Password change successful');
  }

  async setup2FA(): Promise<TwoFactorSetup> {
    logger.info('Setting up 2FA', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock 2FA setup for proto mode
      const mockSetup: TwoFactorSetup = {
        secret: 'MOCK2FASECRET123456789',
        qrCode:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        backupCodes: ['BACKUP001', 'BACKUP002', 'BACKUP003', 'BACKUP004', 'BACKUP005'],
      };

      logger.info('Mock 2FA setup successful');
      return mockSetup;
    }

    const response = await this.api.post('/v1/auth/2fa/setup');
    logger.info('2FA setup successful');
    return response.data;
  }

  async verify2FA(data: TwoFactorVerification): Promise<void> {
    logger.info('Verifying 2FA', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock 2FA verification for proto mode
      // Accept any 6-digit code for demo purposes
      if (!/^\d{6}$/.test(data.token)) {
        throw new Error('Invalid 2FA token format');
      }

      logger.info('Mock 2FA verification successful');
      return;
    }

    await this.api.post('/v1/auth/2fa/verify', data);
    logger.info('2FA verification successful');
  }

  async disable2FA(code: string): Promise<void> {
    logger.info('Disabling 2FA', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock 2FA disable for proto mode
      logger.info('Mock 2FA disable successful');
      return;
    }

    await this.api.post('/v1/auth/2fa/disable', { code });
    logger.info('2FA disable successful');
  }

  async verifyEmail(token: string): Promise<void> {
    logger.info('Verifying email', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock email verification for proto mode
      logger.info('Mock email verification successful');
      return;
    }

    await this.api.post('/v1/auth/verify-email', { token });
    logger.info('Email verification successful');
  }

  async resendVerificationEmail(): Promise<void> {
    logger.info('Resending verification email', { mode: config.mode });

    if (shouldUseMockData()) {
      // Mock resend verification email for proto mode
      logger.info('Mock verification email resent successfully');
      return;
    }

    await this.api.post('/v1/auth/resend-verification');
    logger.info('Verification email resent successfully');
  }
}

export const authService = new AuthService();
export default authService;
