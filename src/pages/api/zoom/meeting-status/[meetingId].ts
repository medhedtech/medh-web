import type { NextApiRequest, NextApiResponse } from 'next';
import { ZoomMeetingStatus } from '@/types/zoom';

const ZOOM_API_KEY = process.env.NEXT_PUBLIC_ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

type ResponseData = {
  status: ZoomMeetingStatus;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'not_started', error: 'Method not allowed' });
  }

  try {
    const { meetingId } = req.query;

    if (!meetingId || Array.isArray(meetingId)) {
      return res.status(400).json({ status: 'not_started', error: 'Invalid meeting ID' });
    }

    if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
      return res.status(500).json({ status: 'not_started', error: 'Missing Zoom credentials' });
    }

    // Generate JWT token for Zoom API
    const token = generateZoomJWT();

    // Fetch meeting status from Zoom API
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Zoom API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map Zoom status to our status type
    let status: ZoomMeetingStatus = 'not_started';
    if (data.status === 'started') {
      status = 'in_progress';
    } else if (data.status === 'ended') {
      status = 'ended';
    }

    res.status(200).json({ status });
  } catch (error) {
    console.error('Error fetching meeting status:', error);
    res.status(500).json({ status: 'not_started', error: 'Failed to fetch meeting status' });
  }
}

function generateZoomJWT(): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    iss: ZOOM_API_KEY,
    exp: new Date().getTime() + 60 * 60 * 1000, // Token expires in 1 hour
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const signature = require('crypto')
    .createHmac('sha256', ZOOM_API_SECRET!)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
} 