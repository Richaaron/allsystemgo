// Setup Render PostgreSQL Database
// Run this script to create tables on your Render PostgreSQL

const postgres = require('postgres');

async function setupDatabase() {
  console.log('🗄️ Setting up Render PostgreSQL Database...\n');
  
  // Your Render PostgreSQL connection
  const connectionString = 'postgresql://folusho_user:RSYFnJ2gZvb63cvDuxKniwXXjKQ4TSi7@dpg-d7rtvpa8qa3s73dp0io0-a.oregon-postgres.render.com/folusho_victory_schools';
  
  try {
    const client = postgres(connectionString);
    
    console.log('🔗 Connected to Render PostgreSQL');
    
    // Create tables
    console.log('📋 Creating tables...');
    
    // Schools table
    await client`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address_street VARCHAR(255) NOT NULL,
        address_city VARCHAR(100) NOT NULL,
        address_state VARCHAR(50) NOT NULL,
        phone VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Academic years table
    await client`
      CREATE TABLE IF NOT EXISTS academic_years (
        id SERIAL PRIMARY KEY,
        year VARCHAR(20) NOT NULL UNIQUE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // School terms table
    await client`
      CREATE TABLE IF NOT EXISTS school_terms (
        id SERIAL PRIMARY KEY,
        academic_year_id INTEGER REFERENCES academic_years(id),
        term VARCHAR(20) NOT NULL,
        name VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Departments table
    await client`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id),
        name VARCHAR(255) NOT NULL,
        code VARCHAR(20) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Subjects table
    await client`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id),
        department_id INTEGER REFERENCES departments(id),
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        credits INTEGER DEFAULT 1,
        pass_mark INTEGER DEFAULT 40,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Classes table
    await client`
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id),
        name VARCHAR(50) NOT NULL,
        level VARCHAR(20) NOT NULL,
        arm VARCHAR(5) NOT NULL,
        capacity INTEGER DEFAULT 30,
        current_enrollment INTEGER DEFAULT 0,
        room VARCHAR(50),
        academic_year_id INTEGER REFERENCES academic_years(id),
        term_id INTEGER REFERENCES school_terms(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Teachers table
    await client`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id),
        staff_id VARCHAR(20) NOT NULL UNIQUE,
        title VARCHAR(10),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        date_of_birth DATE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address TEXT,
        qualification VARCHAR(255),
        specialization JSONB,
        subjects_teaching JSONB,
        classes_assigned JSONB,
        department_id INTEGER REFERENCES departments(id),
        position VARCHAR(100),
        employment_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Students table
    await client`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id),
        admission_number VARCHAR(50) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        state_of_origin VARCHAR(50) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        parent_guardian_name VARCHAR(255) NOT NULL,
        parent_guardian_relationship VARCHAR(50) NOT NULL,
        parent_guardian_phone VARCHAR(50) NOT NULL,
        class_id INTEGER REFERENCES classes(id),
        admission_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Results table
    await client`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        class_id INTEGER REFERENCES classes(id),
        term_id INTEGER REFERENCES school_terms(id),
        academic_year_id INTEGER REFERENCES academic_years(id),
        subjects JSONB NOT NULL,
        summary JSONB NOT NULL,
        comments JSONB,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Users table for authentication
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log('✅ Tables created successfully!');
    
    // Insert initial data
    console.log('📊 Inserting initial data...');
    
    // Insert school
    await client`
      INSERT INTO schools (name, email, address_street, address_city, address_state, phone)
      VALUES ('Folusho Victory Schools', 'info@folushovictory.sch.ng', '123 Education Road', 'Kaduna', 'Kaduna', '+234-800-000-0000')
      ON CONFLICT (email) DO NOTHING
    `;
    
    // Insert academic year
    await client`
      INSERT INTO academic_years (year, start_date, end_date)
      VALUES ('2024/2025', '2024-09-01', '2025-07-31')
      ON CONFLICT (year) DO NOTHING
    `;
    
    // Insert school terms
    await client`
      INSERT INTO school_terms (academic_year_id, term, name, start_date, end_date)
      VALUES (1, 'First', 'First Term', '2024-09-01', '2024-12-15'),
             (1, 'Second', 'Second Term', '2025-01-06', '2025-03-28'),
             (1, 'Third', 'Third Term', '2025-04-14', '2025-07-31')
      ON CONFLICT DO NOTHING
    `;
    
    // Insert admin user
    await client`
      INSERT INTO users (school_id, email, password, role)
      VALUES (1, 'admin@folushovictory.com', 'admin123', 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    
    console.log('✅ Initial data inserted successfully!');
    
    // Verify setup
    const tables = await client`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n📋 Created tables:');
    tables.forEach(table => {
      console.log(`   • ${table.table_name}`);
    });
    
    const users = await client`SELECT COUNT(*) as count FROM users`;
    console.log(`\n👥 Users created: ${users[0].count}`);
    
    await client.end();
    
    console.log('\n🎉 Render PostgreSQL setup complete!');
    console.log('🚀 Your database is ready for production use!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupDatabase();
