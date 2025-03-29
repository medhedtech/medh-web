import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const ZOOM_SDK_KEY = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET;

type ResponseData = {
  signature?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { meetingNumber, role } = req.body;

    if (!meetingNumber || role === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!ZOOM_SDK_KEY || !ZOOM_SDK_SECRET) {
      return res.status(500).json({ error: 'Missing Zoom credentials' });
    }

    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(ZOOM_SDK_KEY + meetingNumber + timestamp + role).toString('base64');
    const hash = crypto.createHmac('sha256', ZOOM_SDK_SECRET).update(msg).digest('base64');
    const signature = Buffer.from(`${ZOOM_SDK_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

    res.status(200).json({ signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
} 