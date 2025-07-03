/**
 * Simple encryption utilities for browser storage
 * Note: This is for basic data protection, not cryptographically secure
 */

/**
 * Simple XOR-based encryption for browser storage
 * @param text Text to encrypt
 * @param key Encryption key
 * @returns Encrypted base64 string or null if failed
 */
export function encrypt(text: string, key: string): string | null {
  try {
    if (!text || !key) return null;
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    
    // Encode to base64 for safe storage
    return btoa(result);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

/**
 * Simple XOR-based decryption for browser storage
 * @param encryptedText Base64 encrypted text
 * @param key Encryption key
 * @returns Decrypted text or null if failed
 */
export function decrypt(encryptedText: string, key: string): string | null {
  try {
    if (!encryptedText || !key) return null;
    
    // Decode from base64
    const encrypted = atob(encryptedText);
    
    let result = '';
    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Generate a simple hash for data integrity
 * @param data Data to hash
 * @returns Simple hash string
 */
export function simpleHash(data: string): string {
  let hash = 0;
  if (data.length === 0) return hash.toString();
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Verify data integrity using simple hash
 * @param data Original data
 * @param expectedHash Expected hash
 * @returns True if data is valid
 */
export function verifyHash(data: string, expectedHash: string): boolean {
  return simpleHash(data) === expectedHash;
}