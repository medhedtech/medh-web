// Authentication types for MEDH API
import { User } from './common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password?: string;
  role?: string[];
  account_type?: 'free' | 'premium' | 'enterprise';
  terms_accepted?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refresh_token?: string;
    session_id: string;
    expires_in: string;
  };
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface OAuthProvider {
  provider: 'google' | 'facebook' | 'github' | 'linkedin' | 'microsoft' | 'apple';
  access_token: string;
  id_token?: string;
}

export interface MFASetupRequest {
  method: 'totp' | 'sms';
  phone_number?: string;
}

export interface MFAVerifyRequest {
  code: string;
  backup_code?: string;
}

export interface MFASetupResponse {
  success: boolean;
  message: string;
  data: {
    qr_code?: string;
    secret_key?: string;
    backup_codes?: string[];
    phone_number?: string;
  };
}

export interface SessionInfo {
  session_id: string;
  device_info: string;
  ip_address: string;
  location?: string;
  created_at: string;
  last_active: string;
  is_current: boolean;
}

export interface AccountLockInfo {
  is_locked: boolean;
  lock_reason?: string;
  locked_until?: string;
  failed_attempts: number;
  max_attempts: number;
}

// Backwards compatibility with existing interfaces
export interface IAuthResponse extends AuthResponse {}

export interface ILoginRequest extends LoginRequest {}

export interface IRegisterRequest extends RegisterRequest {}