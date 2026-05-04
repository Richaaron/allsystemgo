# Manual Database Setup Instructions

## 🎯 Current Status
- ✅ PostgreSQL is installed and running (postgresql-x64-18)
- ✅ PostgreSQL found at: `C:\Program Files\PostgreSQL\18\bin\psql.exe`
- ❌ Database not yet configured for the application

## 📋 Manual Setup Steps

### Step 1: Open pgAdmin or psql
You have two options:

#### Option A: Use pgAdmin (Recommended)
1. Open pgAdmin from your Start Menu
2. Connect to PostgreSQL server:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: (leave blank or enter your current password)

#### Option B: Use Command Line
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory:
   ```cmd
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```
3. Connect to PostgreSQL:
   ```cmd
   psql -U postgres
   ```

### Step 2: Create Database
Run this SQL command in pgAdmin Query Tool or psql:

```sql
CREATE DATABASE nigerian_school_management;
```

### Step 3: Set/Update Password
Run this SQL command to set the password:

```sql
ALTER USER postgres WITH PASSWORD 'postgres123';
```

### Step 4: Grant Privileges
Run this SQL command:

```sql
GRANT ALL PRIVILEGES ON DATABASE nigerian_school_management TO postgres;
```

### Step 5: Test Connection
Run this SQL command to test:

```sql
\c nigerian_school_management
SELECT version();
```

You should see PostgreSQL version information.

### Step 6: Exit psql (if using command line)
```sql
\q
```

## 🧪 Verify Setup

After completing the steps above, run the test:

```bash
node test-db-connection.js
```

Expected output:
```
✅ Database Connection Successful!
📊 PostgreSQL Version: PostgreSQL 15.x
📋 Found 0 tables in database:
```

## 🚀 Run Database Migrations

Once connection is successful, create the tables:

```bash
npx drizzle-kit push
```

This will create all 20 tables for the school management system.

## 🎉 Final Verification

After migrations, test again:

```bash
node test-db-connection.js
```

Expected output:
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

## 🔧 Troubleshooting

### If you get "password authentication failed":
1. Your postgres user has a different password
2. Use pgAdmin to reset the password
3. Or update the .env file with your actual password

### If psql command not found:
1. Use the full path: `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`
2. Or add PostgreSQL bin to your system PATH

### If database already exists:
1. The CREATE DATABASE command will show "already exists" - that's fine
2. Continue with the password setup

## 📞 Next Steps

After database setup:
1. ✅ Test connection with `node test-db-connection.js`
2. ✅ Run migrations with `npx drizzle-kit push`
3. ✅ Start application with `npm start`
4. ✅ The application will now use real database instead of mock data

## 🎯 Application Connection String

The application will connect using:
```
postgresql://postgres:postgres123@localhost:5432/nigerian_school_management
```

If you used a different password, update the `.env` file:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nigerian_school_management
```

---

**💡 Tip:** If you prefer, I can help you create a Docker setup for PostgreSQL if the manual setup proves difficult.
