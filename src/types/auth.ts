export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role: 'admin' | 'supervisor' | 'agent' | 'coordinator' | 'legal' | 'leadership';
  status?: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
  isActive?: boolean;
  profile?: {
    avatar?: string;
    bio?: string;
    location?: {
      state: string;
      lga: string;
      ward?: string;
    };
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneNumber?: string;
  role?: 'agent' | 'supervisor';
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  token: string;
  code: string;
}
