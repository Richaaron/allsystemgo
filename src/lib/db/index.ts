// FOLUSHO VICTORY SCHOOLS - Database Connection
// Drizzle ORM setup for PostgreSQL

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create PostgreSQL client
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/nigerian_school_management';

// Configure postgres client for production
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for easy access
export * from './schema';

// Export database instance
export default db;
