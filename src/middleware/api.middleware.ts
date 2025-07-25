import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Configuration options for API middleware
 * TODO: Reimplement with Next.js 13+ middleware
 */
export interface IApiMiddlewareOptions {
  rateLimit?: {
    windowMs?: number;
    max?: number;
    message?: string;
  };
  cors?: {
    origin?: string | string[];
    methods?: string[];
    credentials?: boolean;
  };
  helmet?: {
    contentSecurityPolicy?: boolean;
    crossOriginEmbedderPolicy?: boolean;
  };
  logging?: {
    enabled?: boolean;
    format?: string;
  };
}

/**
 * Default configuration options
 */
const defaultOptions: IApiMiddlewareOptions = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'Too many requests, please try again later.'
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' ? ['https://medh.co', 'https://www.medh.co'] : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  },
  helmet: {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false
  },
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    format: 'dev'
  }
};

/**
 * Simple API handler wrapper without next-connect
 * TODO: Replace with Next.js 13+ middleware pattern
 */
export const createApiHandler = (options: IApiMiddlewareOptions = {}) => {
  const config = { ...defaultOptions, ...options };
  
  return {
    // Placeholder for future middleware implementation
    use: (middleware: any) => {
      console.warn('Middleware not implemented - next-connect replacement needed');
    },
    get: (handler: (req: NextApiRequest, res: NextApiResponse) => void) => handler,
    post: (handler: (req: NextApiRequest, res: NextApiResponse) => void) => handler,
    put: (handler: (req: NextApiRequest, res: NextApiResponse) => void) => handler,
    delete: (handler: (req: NextApiRequest, res: NextApiResponse) => void) => handler,
  };
};

/**
 * Export default handler for backward compatibility
 */
export default createApiHandler; 