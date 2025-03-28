import { EncryptionConfig, DRMConfig } from '../components/shared/lessons/types';
import CryptoJS from 'crypto-js';

export class VideoEncryption {
  private static instance: VideoEncryption;
  private encryptionConfig?: EncryptionConfig;
  private drmConfig?: DRMConfig;

  private constructor() {}

  static getInstance(): VideoEncryption {
    if (!VideoEncryption.instance) {
      VideoEncryption.instance = new VideoEncryption();
    }
    return VideoEncryption.instance;
  }

  setEncryptionConfig(config: EncryptionConfig) {
    this.encryptionConfig = config;
  }

  setDRMConfig(config: DRMConfig) {
    this.drmConfig = config;
  }

  // Encrypt video stream chunks
  async encryptChunk(chunk: ArrayBuffer): Promise<ArrayBuffer> {
    if (!this.encryptionConfig) throw new Error('Encryption config not set');

    const wordArray = CryptoJS.lib.WordArray.create(chunk);
    const encrypted = CryptoJS.AES.encrypt(
      wordArray,
      this.encryptionConfig.key,
      {
        iv: this.encryptionConfig.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return new Uint8Array(encrypted.ciphertext.words).buffer;
  }

  // Decrypt video stream chunks
  async decryptChunk(encryptedChunk: ArrayBuffer): Promise<ArrayBuffer> {
    if (!this.encryptionConfig) throw new Error('Encryption config not set');

    const wordArray = CryptoJS.lib.WordArray.create(encryptedChunk);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: wordArray },
      this.encryptionConfig.key,
      {
        iv: this.encryptionConfig.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return new Uint8Array(decrypted.words).buffer;
  }

  // Handle DRM license requests
  async requestDRMLicense(challenge: ArrayBuffer): Promise<ArrayBuffer> {
    if (!this.drmConfig) throw new Error('DRM config not set');

    try {
      const response = await fetch(this.drmConfig.licenseUrl, {
        method: 'POST',
        body: challenge,
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        credentials: 'include' // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('License request failed');
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('DRM license request failed:', error);
      throw error;
    }
  }

  // Prevent screen recording and capture
  enableScreenProtection() {
    // Add event listeners for various screen capture prevention methods
    document.addEventListener('keydown', (e) => {
      // Prevent common screen capture shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 's' || e.key === 'c')
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // Add CSS to prevent selection
    const style = document.createElement('style');
    style.textContent = `
      .video-player-container {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  // Generate secure video URL with token
  generateSecureUrl(videoId: string, userId: string, expiresIn: number): string {
    if (!this.encryptionConfig) throw new Error('Encryption config not set');

    const timestamp = Date.now();
    const expiration = timestamp + expiresIn;
    
    // Create token payload
    const payload = {
      videoId,
      userId,
      timestamp,
      expiration
    };

    // Encrypt payload
    const token = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      this.encryptionConfig.key
    ).toString();

    // Return secure URL with token
    return `/api/video/${videoId}?token=${encodeURIComponent(token)}`;
  }

  // Validate video access token
  validateToken(token: string): boolean {
    if (!this.encryptionConfig) throw new Error('Encryption config not set');

    try {
      // Decrypt token
      const bytes = CryptoJS.AES.decrypt(token, this.encryptionConfig.key);
      const payload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // Check expiration
      if (payload.expiration < Date.now()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
} 