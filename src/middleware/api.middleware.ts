import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { NextHandler } from 'next-connect/dist/types/types';

/**
 * Configuration options for API middleware
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
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
  };
  security?: {
    contentSecurityPolicy?: boolean;
    dnsPrefetchControl?: boolean;
    frameguard?: boolean;
    hidePoweredBy?: boolean;
    hsts?: boolean;
    ieNoOpen?: boolean;
    noSniff?: boolean;
    xssFilter?: boolean;
  };
  logging?: boolean;
}

/**
 * Default middleware configuration
 */
const defaultOptions: IApiMiddlewareOptions = {
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many requests, please try again later.'
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length'],
    credentials: true
  },
  security: {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: process.env.NODE_ENV === 'production',
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true
  },
  logging: process.env.NODE_ENV !== 'production'
};

/**
 * Authentication middleware function
 */
export const authenticate = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  try {
    const authHeader = req.headers.authorization;
    
    // No auth header - pass to next middleware (which may reject if auth is required)
    if (!authHeader) {
      req.user = null;
      return next();
    }
    
    // Check for Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Invalid authentication format. Use Bearer token.'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    // In a real implementation, you'd verify the JWT or session token
    // For example, with jsonwebtoken library:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    // Placeholder for token verification
    if (token === 'invalid_token') {
      return res.status(401).json({
        error: 'Invalid or expired token.'
      });
    }
    
    // Set a placeholder user for now - replace with actual decoded info
    req.user = { id: 'user_id', role: 'user' };
    
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Authentication failed.'
    });
  }
};

/**
 * Creates a next-connect handler with middleware
 * @param options - Configuration options
 * @returns Next.js API handler with middleware
 */
export const createApiHandler = (options: IApiMiddlewareOptions = {}) => {
  const config = { ...defaultOptions, ...options };
  
  // Create rate limiter middleware
  const limiter = rateLimit({
    windowMs: config.rateLimit?.windowMs || 60 * 1000,
    max: config.rateLimit?.max || 60,
    message: config.rateLimit?.message || 'Too many requests'
  });
  
  // Build handler with error handling
  const handler = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
      console.error('API Route Error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
  });
  
  // Apply security middleware
  if (config.security) {
    handler.use(helmet({
      contentSecurityPolicy: config.security.contentSecurityPolicy === undefined ? 
        defaultOptions.security?.contentSecurityPolicy : 
        config.security.contentSecurityPolicy,
      dnsPrefetchControl: config.security.dnsPrefetchControl,
      frameguard: config.security.frameguard,
      hidePoweredBy: config.security.hidePoweredBy,
      hsts: config.security.hsts,
      ieNoOpen: config.security.ieNoOpen,
      noSniff: config.security.noSniff,
      xssFilter: config.security.xssFilter
    }));
  }
  
  // Apply CORS middleware
  if (config.cors) {
    handler.use(cors({
      origin: config.cors.origin,
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
      exposedHeaders: config.cors.exposedHeaders,
      credentials: config.cors.credentials
    }));
  }
  
  // Apply rate limiting middleware
  handler.use(limiter);
  
  // Apply logging middleware in development
  if (config.logging) {
    handler.use(morgan('dev'));
  }
  
  // Add request timestamp
  handler.use((req, res, next) => {
    req.timestamp = new Date();
    next();
  });
  
  return handler;
};

// Extend the NextApiRequest type to include user and timestamp
declare module 'next' {
  interface NextApiRequest {
    user?: any;
    timestamp?: Date;
  }
} 