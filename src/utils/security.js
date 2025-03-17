import { createHash, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { securityConfig } from '@/config/security';

const scryptAsync = promisify(scrypt);

// Password hashing
export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
};

// Password verification
export const verifyPassword = async (password, hash) => {
  const [salt, key] = hash.split(':');
  const derivedKey = await scryptAsync(password, salt, 64);
  return key === derivedKey.toString('hex');
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (password.length < securityConfig.passwordPolicy.minLength) {
    errors.push(`Password must be at least ${securityConfig.passwordPolicy.minLength} characters long`);
  }
  
  if (securityConfig.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (securityConfig.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (securityConfig.passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (securityConfig.passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate secure random token
export const generateSecureToken = (length = 32) => {
  return randomBytes(length).toString('hex');
};

// Sanitize file name
export const sanitizeFileName = (fileName) => {
  // Remove any path components
  const name = fileName.replace(/^.*[\\\/]/, '');
  
  // Remove any non-alphanumeric characters except dots and dashes
  const sanitized = name.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Ensure the file has a safe extension
  const ext = sanitized.split('.').pop().toLowerCase();
  const safeExts = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
  
  if (!safeExts.includes(ext)) {
    throw new Error('Invalid file extension');
  }
  
  return sanitized;
};

// Generate CSRF token
export const generateCsrfToken = () => {
  return randomBytes(32).toString('hex');
};

// Validate CSRF token
export const validateCsrfToken = (token, storedToken) => {
  if (!token || !storedToken) {
    return false;
  }
  return token === storedToken;
};

// Generate API key
export const generateApiKey = () => {
  return `medh_${randomBytes(32).toString('base64').replace(/[+/=]/g, '')}`;
};

// Hash API key
export const hashApiKey = (apiKey) => {
  return createHash('sha256')
    .update(apiKey + process.env.API_KEY_SALT)
    .digest('hex');
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Generate secure random password
export const generateSecurePassword = () => {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  
  // Ensure at least one of each required character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*()'[Math.floor(Math.random() * 10)];
  
  // Fill the rest with random characters
  while (password.length < length) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

// Sanitize HTML content
export const sanitizeHtml = (html) => {
  // Remove potentially dangerous tags and attributes
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
};

// Rate limiting helper
export class RateLimiter {
  constructor(windowMs = 60000, max = 100) {
    this.windowMs = windowMs;
    this.max = max;
    this.requests = new Map();
  }

  tryRequest(ip) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old requests
    for (const [key, time] of this.requests) {
      if (time < windowStart) {
        this.requests.delete(key);
      }
    }
    
    // Count requests in current window
    const requestCount = Array.from(this.requests.values())
      .filter(time => time > windowStart)
      .length;
    
    if (requestCount >= this.max) {
      return false;
    }
    
    this.requests.set(now, ip);
    return true;
  }
}; 