import { ZoomMeetingDetails, ZoomSignatureResponse, ZoomError } from '@/types/zoom';
import CryptoJS from 'crypto-js';

const ZOOM_API_BASE_URL = process.env.NEXT_PUBLIC_ZOOM_API_BASE_URL || 'https://api.zoom.us/v2';
const ZOOM_API_KEY = process.env.NEXT_PUBLIC_ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.NEXT_PUBLIC_ZOOM_API_SECRET;

if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
  throw new Error('Zoom API credentials are not configured');
}

export const generateSignature = (
  meetingNumber: string,
  role: number,
  timestamp: number
): string => {
  const msg = Buffer.from(ZOOM_API_KEY + meetingNumber + timestamp + role).toString('base64');
  const hash = CryptoJS.HmacSHA256(msg, ZOOM_API_SECRET).toString(CryptoJS.enc.Base64);
  const signature = Buffer.from(ZOOM_API_KEY + '.' + meetingNumber + '.' + timestamp + '.' + role + '.' + hash).toString('base64');

  return signature;
};

export const initializeZoomMeeting = async (
  details: ZoomMeetingDetails
): Promise<ZoomSignatureResponse> => {
  const timestamp = Math.floor(Date.now() / 1000) - 30000; // 30 seconds before current time
  const signature = generateSignature(details.meetingNumber, details.role, timestamp);

  return {
    userName: details.userName,
    userEmail: details.userEmail,
    signature,
    apiKey: ZOOM_API_KEY,
  };
};

export const validateZoomConfig = (config: ZoomSignatureResponse): boolean => {
  return !!(
    config.meetingNumber &&
    config.userName &&
    config.userEmail &&
    config.role &&
    config.signature &&
    config.apiKey
  );
};

export const validateMeetingDetails = (details: ZoomMeetingDetails): void => {
  if (!details.meetingNumber) {
    throw new Error('Meeting number is required');
  }
  if (!details.userName) {
    throw new Error('User name is required');
  }
  if (!details.userEmail) {
    throw new Error('User email is required');
  }
  if (details.role !== 0 && details.role !== 1) {
    throw new Error('Invalid role. Must be 0 (attendee) or 1 (host)');
  }
};

export function getDefaultMeetingDetails(): ZoomMeetingDetails {
  return {
    meetingNumber: '',
    userName: '',
    userEmail: '',
    password: '',
    role: 0,
  };
} 