import { MongoClient } from 'mongodb';

// Use MONGODB_URI as primary, but support legacy MONGO_URI env as fallback
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

/**
 * Instead of throwing during the build phase (when env vars might not yet be
 * injected), we create a placeholder rejected promise if no URI is provided.
 * This prevents Next.js from crashing at build-time while still surfacing a
 * clear error at runtime if a connection is attempted without a proper URI.
 */
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Produce a rejected promise that will be caught by the route handler.
  clientPromise = Promise.reject(
    new Error('No MongoDB connection string found. Set MONGODB_URI in your environment.')
  );
} else {
  const options = {};

  declare global {
    // allow global `mongoClientPromise` for dev caching
    // eslint-disable-next-line no-var
    var mongoClientPromise: Promise<MongoClient> | undefined;
  }

  let client: MongoClient;

  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable to preserve client across hot reloads
    if (!global.mongoClientPromise) {
      client = new MongoClient(uri, options);
      global.mongoClientPromise = client.connect();
    }
    clientPromise = global.mongoClientPromise;
  } else {
    // In production, it's fine to create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise; 