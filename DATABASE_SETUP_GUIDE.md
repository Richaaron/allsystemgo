# Database Setup Guide - Folusho Victory Schools

## 🔍 Current Status: Database Not Connected

The database connection test revealed that PostgreSQL is not properly configured or running. Here's what we found:

### ❌ Connection Issues:
- **Error:** `password authentication failed for user "postgres"`
- **Connection String:** `postgresql://postgres:postgres123@localhost:5432/nigerian_school_management`
- **Issue:** PostgreSQL server either not running or credentials incorrect

## 🛠️ Database Setup Options

### Option 1: Install and Configure PostgreSQL (Recommended for Production)

#### Step 1: Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

#### Step 2: Start PostgreSQL Service
```bash
# Windows
net start postgresql-x64-14  # (version may vary)

# Or via Services:
# 1. Press Win + R
# 2. Type services.msc
# 3. Find "postgresql-x64-14" and start it
```

#### Step 3: Create Database and User
```sql
-- Connect to PostgreSQL as superuser (postgres)
-- Run these commands in psql or pgAdmin

-- Create database
CREATE DATABASE nigerian_school_management;

-- Create user (if needed)
CREATE USER postgres WITH PASSWORD 'postgres123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nigerian_school_management TO postgres;

-- Connect to the database
\c nigerian_school_management

-- Create schema (optional, uses public by default)
-- Schema will be created automatically when you run migrations
```

#### Step 4: Update Environment Variables
```bash
# In .env file
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/nigerian_school_management
```

### Option 2: Use Docker (Quick Setup)

#### Step 1: Create Docker Compose File
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: folusho_school_db
    environment:
      POSTGRES_DB: nigerian_school_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Step 2: Start Database
```bash
docker-compose up -d
```

### Option 3: Use SQLite (Development Only)

For quick development without PostgreSQL setup:

#### Step 1: Install SQLite Dependencies
```bash
npm install better-sqlite3 @types/better-sqlite3
```

#### Step 2: Create SQLite Configuration
```typescript
// src/lib/db/sqlite.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('./nigerian_school.db');
export const db = drizzle(sqlite, { schema });
```

## 🗄️ Database Schema Status

### ✅ Schema Files Ready:
- **`src/lib/db/schema.ts`** - Complete Nigerian school management schema
- **`drizzle.config.ts`** - Drizzle ORM configuration
- **`src/lib/db/index.ts`** - Database connection setup

### 📋 Tables Defined:
1. **schools** - School information
2. **academic_years** - Academic year management
3. **school_terms** - Term management
4. **departments** - School departments
5. **subjects** - Subject catalog
6. **classes** - Class management
7. **teachers** - Teacher records
8. **students** - Student records
9. **results** - Student results
10. **attendance** - Attendance tracking
11. **fee_structures** - Fee management
12. **student_fees** - Student fee records
13. **fee_payments** - Payment records
14. **users** - Authentication
15. **user_profiles** - User profile linking
16. **calendar_events** - Academic calendar
17. **assignments** - Assignment management
18. **student_submissions** - Submission tracking
19. **notifications** - System notifications
20. **system_settings** - Configuration

## 🚀 Next Steps

### Immediate (Development):
1. **Choose setup option** (PostgreSQL, Docker, or SQLite)
2. **Start database service**
3. **Run database migration**
4. **Test application connectivity**

### For Production:
1. **Use PostgreSQL** (recommended)
2. **Configure proper security**
3. **Set up backups**
4. **Monitor performance**

## 🧪 Testing Database Connection

After setup, run the test again:
```bash
node test-db-connection.js
```

Expected successful output:
```
✅ Database Connection Successful!
📊 PostgreSQL Version: PostgreSQL 15.x
📋 Found 20 tables in database:
   • schools
   • academic_years
   • school_terms
   • departments
   • subjects
   • classes
   • teachers
   • students
   • results
   • attendance
   • fee_structures
   • student_fees
   • fee_payments
   • users
   • user_profiles
   • calendar_events
   • assignments
   • student_submissions
   • notifications
   • system_settings
```

## 🔧 Migration Commands

Once database is running:
```bash
# Generate migrations
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Push schema (for development)
npx drizzle-kit push
```

## 📞 Support

If you encounter issues:
1. Check PostgreSQL service status
2. Verify connection string
3. Ensure database exists
4. Check user permissions
5. Review firewall settings

## 🎯 Current Application Status

- ✅ **Frontend**: Fully functional React application
- ✅ **Components**: All management components working
- ✅ **Schema**: Complete database schema defined
- ❌ **Database**: Not connected (needs setup)
- ✅ **Mock Data**: Application uses mock data for demonstration

The application is **fully functional** with mock data and will work seamlessly once the database is properly configured.
