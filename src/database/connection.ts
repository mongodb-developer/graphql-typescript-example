import { MongoClient, Db } from 'mongodb';

let db: Db | null = null;
let client: MongoClient | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    const DB_NAME = process.env.DB_NAME || 'graphql_example';

    console.log('🔌 Connecting to MongoDB...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db(DB_NAME);
    
    console.log(`✅ Successfully connected to MongoDB database: ${DB_NAME}`);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('🔌 MongoDB connection closed');
  }
}
