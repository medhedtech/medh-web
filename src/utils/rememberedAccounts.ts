/**
 * Remembered Accounts Manager
 * Handles storage and management of multiple remembered user accounts
 */

import { encrypt, decrypt } from './encryption';

export interface RememberedAccount {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  lastLogin: number; // timestamp
  createdAt: number; // timestamp
  role?: string;
  quickLoginKey?: string; // Change from refreshToken to quickLoginKey
  // Note: We don't store passwords directly for security
  // Instead, we'll use a secure token-based approach
}

export interface RememberedAccountsData {
  accounts: RememberedAccount[];
  lastUsed: string | null; // email of last used account
  version: number; // for data migration
}

export class RememberedAccountsManager {
  private static readonly STORAGE_KEY = 'medh_remembered_accounts';
  private static readonly MAX_ACCOUNTS = 5;
  private static readonly ENCRYPTION_KEY = 'medh_remember_key_2024';
  private static readonly DATA_VERSION = 1;
  private static readonly AUTO_PASSWORD_THRESHOLD = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

  /**
   * Get all remembered accounts
   */
  static getRememberedAccounts(): RememberedAccount[] {
    try {
      const data = this.getRawData();
      return data.accounts || [];
    } catch (error) {
      console.error('Error getting remembered accounts:', error);
      return [];
    }
  }

  /**
   * Add or update a remembered account
   */
  static addRememberedAccount(account: Omit<RememberedAccount, 'id' | 'createdAt' | 'lastLogin'>): boolean {
    try {
      const data = this.getRawData();
      const now = Date.now();
      
      // Check if account already exists
      const existingIndex = data.accounts.findIndex(acc => acc.email === account.email);
      
      if (existingIndex >= 0) {
        // Update existing account
        data.accounts[existingIndex] = {
          ...data.accounts[existingIndex],
          ...account,
          lastLogin: now
        };
      } else {
        // Add new account
        const newAccount: RememberedAccount = {
          id: this.generateAccountId(),
          ...account,
          createdAt: now,
          lastLogin: now
        };
        
        data.accounts.push(newAccount);
        
        // Remove oldest account if we exceed max limit
        if (data.accounts.length > this.MAX_ACCOUNTS) {
          data.accounts.sort((a, b) => b.lastLogin - a.lastLogin);
          data.accounts = data.accounts.slice(0, this.MAX_ACCOUNTS);
        }
      }
      
      // Set as last used
      data.lastUsed = account.email;
      
      return this.saveData(data);
    } catch (error) {
      console.error('Error adding remembered account:', error);
      return false;
    }
  }

  /**
   * Remove a remembered account
   */
  static removeRememberedAccount(email: string): boolean {
    try {
      const data = this.getRawData();
      const originalLength = data.accounts.length;
      
      data.accounts = data.accounts.filter(acc => acc.email !== email);
      
      // Clear last used if it was the removed account
      if (data.lastUsed === email) {
        data.lastUsed = data.accounts.length > 0 ? data.accounts[0].email : null;
      }
      
      const wasRemoved = data.accounts.length !== originalLength;
      
      if (wasRemoved) {
        this.saveData(data);
      }
      
      return wasRemoved;
    } catch (error) {
      console.error('Error removing remembered account:', error);
      return false;
    }
  }

  /**
   * Get the last used account
   */
  static getLastUsedAccount(): RememberedAccount | null {
    try {
      const data = this.getRawData();
      if (!data.lastUsed) return null;
      
      return data.accounts.find(acc => acc.email === data.lastUsed) || null;
    } catch (error) {
      console.error('Error getting last used account:', error);
      return null;
    }
  }

  /**
   * Set the last used account
   */
  static setLastUsedAccount(email: string): boolean {
    try {
      const data = this.getRawData();
      const account = data.accounts.find(acc => acc.email === email);
      
      if (account) {
        data.lastUsed = email;
        account.lastLogin = Date.now();
        return this.saveData(data);
      }
      
      return false;
    } catch (error) {
      console.error('Error setting last used account:', error);
      return false;
    }
  }

  /**
   * Check if an account needs password entry (after 3 days)
   */
  static needsPasswordEntry(email: string): boolean {
    try {
      const data = this.getRawData();
      const account = data.accounts.find(acc => acc.email === email);
      
      if (!account) return true;
      
      // If an account has a refresh token, it means we can attempt a passwordless login.
      // The password will only be explicitly needed if the refresh token flow fails.
      if (account.quickLoginKey) {
        return false; // No password needed if a refresh token is present
      }

      const now = Date.now();
      const daysSinceLastLogin = now - account.lastLogin;
      
      return daysSinceLastLogin > this.AUTO_PASSWORD_THRESHOLD;
    } catch (error) {
      console.error('Error checking password requirement:', error);
      return true;
    }
  }

  /**
   * Get accounts that can be used for quick login (within 3 days)
   */
  static getQuickLoginAccounts(): RememberedAccount[] {
    try {
      const accounts = this.getRememberedAccounts();
      return accounts.filter(account => !this.needsPasswordEntry(account.email));
    } catch (error) {
      console.error('Error getting quick login accounts:', error);
      return [];
    }
  }

  /**
   * Clear all remembered accounts
   */
  static clearAllAccounts(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing all accounts:', error);
      return false;
    }
  }

  /**
   * Get account by email
   */
  static getAccountByEmail(email: string): RememberedAccount | null {
    try {
      const accounts = this.getRememberedAccounts();
      return accounts.find(acc => acc.email === email) || null;
    } catch (error) {
      console.error('Error getting account by email:', error);
      return null;
    }
  }

  /**
   * Update account avatar
   */
  static updateAccountAvatar(email: string, avatar: string): boolean {
    try {
      const data = this.getRawData();
      const account = data.accounts.find(acc => acc.email === email);
      
      if (account) {
        account.avatar = avatar;
        return this.saveData(data);
      }
      
      return false;
    } catch (error) {
      console.error('Error updating account avatar:', error);
      return false;
    }
  }

  /**
   * Get accounts sorted by last login (most recent first)
   */
  static getAccountsSortedByUsage(): RememberedAccount[] {
    try {
      const accounts = this.getRememberedAccounts();
      return accounts.sort((a, b) => b.lastLogin - a.lastLogin);
    } catch (error) {
      console.error('Error getting sorted accounts:', error);
      return [];
    }
  }

  /**
   * Check if remember me is enabled for any account
   */
  static hasRememberedAccounts(): boolean {
    try {
      const accounts = this.getRememberedAccounts();
      return accounts.length > 0;
    } catch (error) {
      console.error('Error checking remembered accounts:', error);
      return false;
    }
  }

  /**
   * Migrate data from old remember me format
   */
  static migrateFromOldFormat(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      // Check if we already have new format data
      const existingData = localStorage.getItem(this.STORAGE_KEY);
      if (existingData) return true;
      
      // Check for old format data
      const oldRememberMe = localStorage.getItem('rememberMe');
      const oldEmail = localStorage.getItem('rememberedEmail');
      
      if (oldRememberMe === 'true' && oldEmail) {
        // Get additional data from current storage
        const fullName = localStorage.getItem('fullName') || '';
        const role = localStorage.getItem('role') || '';
        
        const migratedAccount: Omit<RememberedAccount, 'id' | 'createdAt' | 'lastLogin'> = {
          email: oldEmail,
          fullName: fullName,
          role: role
        };
        
        // Add the migrated account
        const success = this.addRememberedAccount(migratedAccount);
        
        if (success) {
          // Clean up old format data
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
          console.log('Successfully migrated from old remember me format');
        }
        
        return success;
      }
      
      return true;
    } catch (error) {
      console.error('Error migrating from old format:', error);
      return false;
    }
  }

  // Private helper methods

  /**
   * Get raw data from storage
   */
  private static getRawData(): RememberedAccountsData {
    try {
      if (typeof window === 'undefined') {
        return this.getDefaultData();
      }
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.getDefaultData();
      }
      
      // Try to decrypt the data
      const decrypted = decrypt(stored, this.ENCRYPTION_KEY);
      if (!decrypted) {
        console.warn('Failed to decrypt remembered accounts data');
        return this.getDefaultData();
      }
      
      const parsed = JSON.parse(decrypted);
      
      console.log('RememberedAccountsManager: Getting raw data - parsed accounts:', parsed.accounts); // Add this log

      // Handle version migration if needed
      if (parsed.version !== this.DATA_VERSION) {
        console.log('Migrating remembered accounts data version');
        // Add migration logic here if needed in the future
      }
      
      return {
        accounts: parsed.accounts || [],
        lastUsed: parsed.lastUsed || null,
        version: this.DATA_VERSION
      };
    } catch (error) {
      console.error('Error getting raw data:', error);
      // Ensure a default, empty structure is returned on error or malformed data
      return this.getDefaultData();
    }
  }

  /**
   * Save data to storage
   */
  private static saveData(data: RememberedAccountsData): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const toStore = {
        ...data,
        version: this.DATA_VERSION
      };
      
      console.log('RememberedAccountsManager: Saving data - accounts to store:', toStore.accounts); // Add this log

      const encrypted = encrypt(JSON.stringify(toStore), this.ENCRYPTION_KEY);
      if (!encrypted) {
        console.error('Failed to encrypt remembered accounts data');
        return false;
      }
      
      localStorage.setItem(this.STORAGE_KEY, encrypted);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  /**
   * Get default data structure
   */
  private static getDefaultData(): RememberedAccountsData {
    return {
      accounts: [],
      lastUsed: null,
      version: this.DATA_VERSION
    };
  }

  /**
   * Generate unique account ID
   */
  private static generateAccountId(): string {
    return `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export utility functions for backward compatibility
export const getRememberedAccounts = () => RememberedAccountsManager.getRememberedAccounts();
export const addRememberedAccount = (account: Omit<RememberedAccount, 'id' | 'createdAt' | 'lastLogin'>) => 
  RememberedAccountsManager.addRememberedAccount(account);
export const removeRememberedAccount = (email: string) => RememberedAccountsManager.removeRememberedAccount(email);
export const getLastUsedAccount = () => RememberedAccountsManager.getLastUsedAccount();
export const needsPasswordEntry = (email: string) => RememberedAccountsManager.needsPasswordEntry(email);
export const getQuickLoginAccounts = () => RememberedAccountsManager.getQuickLoginAccounts();
export const hasRememberedAccounts = () => RememberedAccountsManager.hasRememberedAccounts();