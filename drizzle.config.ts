import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env' });

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/nigerian_school_management'
  },
  verbose: true,
  strict: true
});
