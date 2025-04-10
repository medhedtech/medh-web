import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { apiBaseUrl, apiUrls } from '@/apis';

// Create a rate limiter middleware (e.g., 60 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: 'Too many requests, please try again later.'
});

// Build a next-connect handler
const handler = nextConnect<NextApiRequest, NextApiResponse>({
  // Centralized error handling
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

// Apply security and utility middlewares
handler.use(helmet());
handler.use(cors());
handler.use(limiter);
if (process.env.NODE_ENV === 'development') {
  // Log requests in development mode for easier debugging.
  handler.use(morgan('dev'));
}

// Example route: GET /api/health returns service status and available endpoints
handler.get((req, res) => {
  res.status(200).json({
    status: 'ok',
    apiBaseUrl,
    endpoints: Object.keys(apiUrls),
    timestamp: new Date().toISOString()
  });
});

// Future middleware can include authentication,
// session validation, input sanitization, etc.

export default handler; 