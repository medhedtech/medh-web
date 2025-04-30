import { MongoClient } from 'mongodb';

// Ensure the MongoDB URI is provided via environment variable
if (!process.env.MONGO_URI) {
  throw new Error('Please add the MONGO_URI environment variable to your .env.local');
}

const uri = process.env.MONGO_URI;
const options = {};

declare global {
  // allow global `mongoClientPromise` for dev caching
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

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

export default clientPromise; 