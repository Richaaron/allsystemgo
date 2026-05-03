// FOLUSHO VICTORY SCHOOLS - Database Seed Data
// Comprehensive Nigerian school management system seed data

import { db } from './index';
import { 
  schools, 
  academicYears, 
  schoolTerms, 
  departments, 
  subjects, 
  classes, 
  teachers, 
  students, 
  users,
  userProfiles,
  feeStructures,
  studentFees,
  systemSettings
} from './schema';
import { eq } from 'drizzle-orm';

// Nigerian Names and Data
const nigerianFirstNames = {
  male: ['Adebayo', 'Chukwuemeka', 'Ibrahim', 'Tunde', 'Emeka', 'Suleiman', 'David', 'Michael', 'James', 'John', 'Samuel', 'Daniel', 'Matthew', 'Christopher', 'Anthony', 'Paul', 'Mark', 'Luke', 'Andrew', 'Peter'],
  female: ['Chinaza', 'Amina', 'Funke', 'Adaeze', 'Ngozi', 'Chinyere', 'Blessing', 'Grace', 'Faith', 'Hope', 'Joy', 'Peace', 'Mercy', 'Patience', 'Charity', 'Victoria', 'Elizabeth', 'Mary', 'Sarah', 'Rebecca']
};

const nigerianLastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];

const nigerianStates = ['Lagos', 'Kaduna', 'Kano', 'Abuja', 'Rivers', 'Oyo', 'Kwara', 'Ogun', 'Ondo', 'Ekiti', 'Osun', 'Oyo', 'Edo', 'Delta', 'Bayelsa', 'Cross River', 'Akwa Ibom', 'Enugu', 'Anambra', 'Imo', 'Abia', 'Ebonyi', 'Benue', 'Nasarawa', 'Plateau', 'Taraba', 'Bauchi', 'Gombe', 'Yobe', 'Borno', 'Jigawa', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara', 'Niger', 'Kogi'];

// Helper functions
const getRandomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate admission number
const generateAdmissionNumber = (year: number, sequence: number) => {
  return `FVS/${year}/${sequence.toString().padStart(4, '0')}`;
};

// Generate staff ID
const generateStaffId = (sequence: number) => {
  return `STF/${sequence.toString().padStart(4, '0')}`;
};

// Seed function
export async function seedDatabase() {
  console.log('🌱 Starting database seed for FOLUSHO VICTORY SCHOOLS...');

  try {
    // 1. Create School
    console.log('📚 Creating school...');
    const [school] = await db.insert(schools).values({
      name: 'FOLUSHO VICTORY SCHOOLS',
      motto: 'Excellence in Education, Character in Service',
      vision: 'To be a leading institution in academic excellence and moral development',
      mission: 'To provide quality education that develops the total child',
      addressStreet: 'C6 Kwasau street',
      addressCity: 'Barnawa',
      addressState: 'Kaduna',
      addressLga: 'Kaduna South',
      addressPostalCode: '800001',
      phone: '+234-8063020938, +234-8138115993, +234-8138594397',
      email: 'folushovictoryschool@gmail.com',
      website: 'www.folushovictoryschools.com',
      establishmentDate: new Date('1995-09-15'),
      founder: 'Mrs. Folusho Johnson',
      firstPrincipal: 'Mr. Adebayo Williams',
      approvalNumber: 'KDS/ED/1995/042',
      ministry: 'Kaduna State Ministry of Education',
      isActive: true
    }).returning();

    // 2. Create Academic Years
    console.log('📅 Creating academic years...');
    const [currentAcademicYear] = await db.insert(academicYears).values({
      year: '2024/2025',
      startDate: new Date('2024-09-15'),
      endDate: new Date('2025-07-31'),
      isActive: true
    }).returning();

    // 3. Create School Terms
    console.log('📓 Creating school terms...');
    const [term1] = await db.insert(schoolTerms).values({
      academicYearId: currentAcademicYear.id,
      term: 'TERM_1',
      name: 'First Term',
      startDate: new Date('2024-09-15'),
      endDate: new Date('2024-12-20'),
      resumptionDate: new Date('2024-09-15'),
      vacationDate: new Date('2024-12-20'),
      examStartDate: new Date('2024-12-01'),
      examEndDate: new Date('2024-12-15'),
      resultReleaseDate: new Date('2024-12-18'),
      isActive: true
    }).returning();

    const [term2] = await db.insert(schoolTerms).values({
      academicYearId: currentAcademicYear.id,
      term: 'TERM_2',
      name: 'Second Term',
      startDate: new Date('2025-01-05'),
      endDate: new Date('2025-04-11'),
      resumptionDate: new Date('2025-01-05'),
      vacationDate: new Date('2025-04-11'),
      examStartDate: new Date('2025-03-25'),
      examEndDate: new Date('2025-04-08'),
      resultReleaseDate: new Date('2025-04-10'),
      isActive: true
    }).returning();

    const [term3] = await db.insert(schoolTerms).values({
      academicYearId: currentAcademicYear.id,
      term: 'TERM_3',
      name: 'Third Term',
      startDate: new Date('2025-04-28'),
      endDate: new Date('2025-07-31'),
      resumptionDate: new Date('2025-04-28'),
      vacationDate: new Date('2025-07-31'),
      examStartDate: new Date('2025-07-14'),
      examEndDate: new Date('2025-07-28'),
      resultReleaseDate: new Date('2025-07-30'),
      isActive: false // Will be activated when needed
    }).returning();

    // 4. Create Departments
    console.log('🏢 Creating departments...');
    const [sciencesDept] = await db.insert(departments).values({
      schoolId: school.id,
      name: 'Sciences',
      code: 'SCI',
      description: 'Mathematics, Physics, Chemistry, Biology, and Computer Science',
      establishedDate: new Date('1995-09-15'),
      isActive: true
    }).returning();

    const [artsDept] = await db.insert(departments).values({
      schoolId: school.id,
      name: 'Arts and Humanities',
      code: 'ART',
      description: 'English Language, Literature, History, Geography, and Religious Studies',
      establishedDate: new Date('1995-09-15'),
      isActive: true
    }).returning();

    const [vocationalDept] = await db.insert(departments).values({
      schoolId: school.id,
      name: 'Vocational Studies',
      code: 'VOC',
      description: 'Agricultural Science, Home Economics, Technical Drawing, and Business Studies',
      establishedDate: new Date('1995-09-15'),
      isActive: true
    }).returning();

    // 5. Create Subjects
    console.log('📖 Creating subjects...');
    const subjectData = [
      // Early Childhood Subjects
      { code: 'NUM', name: 'Number Work', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'LET', name: 'Letter Work', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'RHY', name: 'Rhymes and Songs', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'STO', name: 'Story Telling', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'CRE', name: 'Creative Play', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'PHY', name: 'Physical Development', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'SOC', name: 'Social Development', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'HEA', name: 'Health Habits', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'ART', name: 'Art and Craft', category: 'early_childhood', credits: 1, isCore: false, isOfferedInPreNursery: true, isOfferedInNursery: true, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      
      // Core Subjects
      { code: 'ENG', name: 'English Language', category: 'core', credits: 3, isCore: true, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: true, isOfferedInJSS: true, isOfferedInSSS: true, departmentId: artsDept.id },
      { code: 'MAT', name: 'Mathematics', category: 'core', credits: 3, isCore: true, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: true, isOfferedInJSS: true, isOfferedInSSS: true, departmentId: sciencesDept.id },
      { code: 'BIO', name: 'Biology', category: 'core', credits: 2, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: sciencesDept.id },
            { code: 'CIV', name: 'Civic Education', category: 'core', credits: 1, isCore: true, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      
      // JSS Core Subjects
      { code: 'NAT', name: 'National Values', category: 'core', credits: 1, isCore: true, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'BSC', name: 'Basic Science', category: 'core', credits: 2, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: sciencesDept.id },
      { code: 'BTE', name: 'Basic Technology', category: 'core', credits: 2, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: vocationalDept.id },
      
      // Nigerian Languages (SSS only)
      { code: 'YOR', name: 'Yoruba Language', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      { code: 'IGB', name: 'Igbo Language', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      
      // JSS Elective Subjects
      { code: 'BUS', name: 'Business Studies', category: 'vocational', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: vocationalDept.id },
      { code: 'HOM', name: 'Home Economics', category: 'vocational', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: vocationalDept.id },
      { code: 'PHE', name: 'Physical & Health Education', category: 'elective', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: true, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'AGR', name: 'Agricultural Science', category: 'vocational', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: vocationalDept.id },
      { code: 'FIN', name: 'Fine Arts', category: 'elective', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: true, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'REL', name: 'Religious Studies', category: 'elective', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'CMP', name: 'Computer Studies', category: 'elective', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: sciencesDept.id },
      { code: 'HAU', name: 'Hausa', category: 'elective', credits: 1, isCore: false, isOfferedInPreNursery: false, isOfferedInNursery: false, isOfferedInPrimary: true, isOfferedInJSS: true, isOfferedInSSS: false, departmentId: artsDept.id },
      
            
            
      // SSS Stream Subjects
      { code: 'PHY', name: 'Physics', category: 'core', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: sciencesDept.id },
      { code: 'CHE', name: 'Chemistry', category: 'core', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: sciencesDept.id },
      { code: 'GOV', name: 'Government', category: 'elective', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      { code: 'LIT', name: 'Literature in English', category: 'elective', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      { code: 'ACC', name: 'Account', category: 'elective', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: vocationalDept.id },
      { code: 'COM', name: 'Commerce', category: 'elective', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: vocationalDept.id },
      
      // SSS General Subjects
      { code: 'ECS', name: 'Economics', category: 'elective', credits: 2, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      { code: 'REL', name: 'Religious Studies', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: artsDept.id },
      { code: 'ICT', name: 'ICT', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: sciencesDept.id },
      { code: 'MAR', name: 'Marketing', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: false, isOfferedInNursery: false, isOfferedInPrimary: false, isOfferedInJSS: false, isOfferedInSSS: true, departmentId: vocationalDept.id },
      
      // Primary School Specific
      { code: 'BSC', name: 'Basic Science', category: 'core', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: sciencesDept.id },
      { code: 'SOC', name: 'Social Studies', category: 'core', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'CRE', name: 'Creative Arts', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'VER', name: 'Verbal Reasoning', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'QUA', name: 'Quantitative Reasoning', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: sciencesDept.id },
      { code: 'HAN', name: 'Handwriting', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id },
      { code: 'PHO', name: 'Phonics', category: 'elective', credits: 1, isCore: false, isOfferedInPrimary: true, isOfferedInJSS: false, isOfferedInSSS: false, departmentId: artsDept.id }
    ];

    const createdSubjects = await db.insert(subjects).values(
      subjectData.map(subject => ({
        ...subject,
        schoolId: school.id,
        passMark: 40,
        isActive: true
      }))
    ).returning();

    // 6. Create Classes
    console.log('🏫 Creating classes...');
    const classData = [];
    
    // Pre-Nursery Classes
    for (let grade = 1; grade <= 2; grade++) {
      for (let arm of ['A', 'B']) {
        classData.push({
          schoolId: school.id,
          name: `Pre-Nursery ${grade}${arm}`,
          level: 'Pre-Nursery',
          arm,
          capacity: 20, // Smaller capacity for early childhood
          currentEnrollment: 0,
          academicYearId: currentAcademicYear.id,
          termId: term1.id,
          room: `PN${grade}${arm}`,
          minAge: grade === 1 ? 2 : 3, // Pre-Nursery 1: 2-3 years, Pre-Nursery 2: 3-4 years
          maxAge: grade === 1 ? 3 : 4,
          isActive: true
        });
      }
    }
    
    // Nursery Classes
    for (let grade = 1; grade <= 3; grade++) {
      for (let arm of ['A', 'B', 'C']) {
        classData.push({
          schoolId: school.id,
          name: `Nursery ${grade}${arm}`,
          level: 'Nursery',
          arm,
          capacity: 25, // Slightly larger than Pre-Nursery
          currentEnrollment: 0,
          academicYearId: currentAcademicYear.id,
          termId: term1.id,
          room: `N${grade}${arm}`,
          minAge: grade + 3, // Nursery 1: 4-5 years, Nursery 2: 5-6 years, Nursery 3: 6-7 years
          maxAge: grade + 4,
          isActive: true
        });
      }
    }
    
    // Primary Classes
    for (let grade = 1; grade <= 6; grade++) {
      for (let arm of ['A', 'B', 'C']) {
        classData.push({
          schoolId: school.id,
          name: `Primary ${grade}${arm}`,
          level: 'Primary',
          arm,
          capacity: 35,
          currentEnrollment: 0,
          academicYearId: currentAcademicYear.id,
          termId: term1.id,
          room: `P${grade}${arm}`,
          minAge: grade + 6, // Primary 1: 7-8 years, up to Primary 6: 12-13 years
          maxAge: grade + 7,
          isActive: true
        });
      }
    }
    
    // Junior Secondary Classes
    for (let grade = 1; grade <= 3; grade++) {
      for (let arm of ['A', 'B', 'C', 'D']) {
        classData.push({
          schoolId: school.id,
          name: `JSS ${grade}${arm}`,
          level: 'JSS',
          arm,
          capacity: 40,
          currentEnrollment: 0,
          academicYearId: currentAcademicYear.id,
          termId: term1.id,
          room: `J${grade}${arm}`,
          isActive: true
        });
      }
    }
    
    // Senior Secondary Classes
    for (let grade = 1; grade <= 3; grade++) {
      for (let arm of ['A', 'B', 'C']) {
        classData.push({
          schoolId: school.id,
          name: `SSS ${grade}${arm}`,
          level: 'SSS',
          arm,
          capacity: 38,
          currentEnrollment: 0,
          academicYearId: currentAcademicYear.id,
          termId: term1.id,
          room: `S${grade}${arm}`,
          isActive: true
        });
      }
    }

    const createdClasses = await db.insert(classes).values(classData).returning();

    // 7. Create Teachers
    console.log('👩‍🏫 Creating teachers...');
    const teacherData = [];
    const teacherCount = 25;

    for (let i = 1; i <= teacherCount; i++) {
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const firstName = getRandomItem(nigerianFirstNames[gender]);
      const lastName = getRandomItem(nigerianLastNames);
      const department = getRandomItem([sciencesDept, artsDept, vocationalDept]);
      
      // Assign subjects based on department
      let subjectsTeaching: number[] = [];
      if (department.id === sciencesDept.id) {
        subjectsTeaching = createdSubjects
          .filter(s => s.departmentId === sciencesDept.id)
          .slice(0, 2)
          .map(s => s.id);
      } else if (department.id === artsDept.id) {
        subjectsTeaching = createdSubjects
          .filter(s => s.departmentId === artsDept.id)
          .slice(0, 2)
          .map(s => s.id);
      } else {
        subjectsTeaching = createdSubjects
          .filter(s => s.departmentId === vocationalDept.id)
          .slice(0, 2)
          .map(s => s.id);
      }

      // Assign classes
      const classesAssigned = createdClasses
        .filter(c => Math.random() > 0.7)
        .slice(0, 3)
        .map(c => c.id);

      teacherData.push({
        schoolId: school.id,
        staffId: generateStaffId(i),
        title: gender === 'male' ? getRandomItem(['Mr', 'Dr']) : getRandomItem(['Mrs', 'Miss', 'Dr']),
        firstName,
        lastName,
        gender,
        dateOfBirth: getRandomDate(new Date('1975-01-01'), new Date('1995-12-31')),
        phone: `+234-${getRandomNumber(800, 999)}${getRandomNumber(1000000, 9999999)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@folushovictoryschools.com`,
        address: `${getRandomNumber(1, 999)} ${getRandomItem(['Lagos', 'Kaduna', 'Abuja'])} Street, ${getRandomItem(nigerianStates)}`,
        qualification: getRandomItem(['B.Ed', 'B.Sc. Ed', 'M.Ed', 'Ph.D', 'NCE', 'HND']),
        specialization: [department.name],
        subjectsTeaching,
        classesAssigned,
        departmentId: department.id,
        position: i === 1 ? 'Principal' : i <= 5 ? 'Head of Department' : i <= 10 ? 'Class Teacher' : 'Subject Teacher',
        employmentDate: getRandomDate(new Date('2010-01-01'), new Date('2024-01-01')),
        salary: getRandomNumber(80000, 250000),
        bankAccountName: `${firstName} ${lastName}`,
        bankAccountNumber: `${getRandomNumber(1000000000, 9999999999)}`,
        bankName: getRandomItem(['Access Bank', 'First Bank', 'UBA', 'GTBank', 'Zenith Bank', 'Union Bank']),
        nextOfKinName: `${firstName} ${lastName}`,
        nextOfKinRelationship: getRandomItem(['Spouse', 'Parent', 'Sibling']),
        nextOfKinPhone: `+234-${getRandomNumber(800, 999)}${getRandomNumber(1000000, 9999999)}`,
        isActive: true
      });
    }

    const createdTeachers = await db.insert(teachers).values(teacherData).returning();

    // 8. Create Students
    console.log('👨‍🎓 Creating students...');
    const studentData = [];
    const studentCount = 400; // Increased to accommodate early childhood students

    for (let i = 1; i <= studentCount; i++) {
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const firstName = getRandomItem(nigerianFirstNames[gender]);
      const lastName = getRandomItem(nigerianLastNames);
      
      // Assign to appropriate class based on age (now includes 2-18 years)
      const age = getRandomNumber(2, 18);
      let classId: number;
      
      if (age <= 4) {
        // Pre-Nursery (2-4 years)
        const preNurseryClasses = createdClasses.filter(c => c.level === 'Pre-Nursery');
        classId = getRandomItem(preNurseryClasses).id;
      } else if (age <= 7) {
        // Nursery (5-7 years)
        const nurseryClasses = createdClasses.filter(c => c.level === 'Nursery');
        classId = getRandomItem(nurseryClasses).id;
      } else if (age <= 13) {
        // Primary school (8-13 years)
        const primaryClasses = createdClasses.filter(c => c.level === 'Primary');
        classId = getRandomItem(primaryClasses).id;
      } else if (age <= 16) {
        // Junior secondary (14-16 years)
        const jssClasses = createdClasses.filter(c => c.level === 'JSS');
        classId = getRandomItem(jssClasses).id;
      } else {
        // Senior secondary (17-18 years)
        const sssClasses = createdClasses.filter(c => c.level === 'SSS');
        classId = getRandomItem(sssClasses).id;
      }

      studentData.push({
        schoolId: school.id,
        admissionNumber: generateAdmissionNumber(2024, i),
        firstName,
        lastName,
        gender,
        dateOfBirth: getRandomDate(new Date('2006-01-01'), new Date('2018-12-31')),
        nationality: 'Nigerian',
        stateOfOrigin: getRandomItem(nigerianStates),
        address: `${getRandomNumber(1, 999)} ${getRandomItem(['Independence', 'Ahmadu Bello', 'Obasanjo'])} Avenue, ${getRandomItem(nigerianStates)}`,
        phone: `+234-${getRandomNumber(800, 999)}${getRandomNumber(1000000, 9999999)}`,
        parentGuardianName: `${getRandomItem(['Mr', 'Mrs', 'Dr'])} ${lastName}`,
        parentGuardianRelationship: getRandomItem(['Father', 'Mother', 'Guardian']),
        parentGuardianPhone: `+234-${getRandomNumber(800, 999)}${getRandomNumber(1000000, 9999999)}`,
        parentGuardianEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@parent.com`,
        parentGuardianOccupation: getRandomItem(['Teacher', 'Doctor', 'Engineer', 'Business Owner', 'Civil Servant']),
        classId,
        house: getRandomItem(['Blue', 'Green', 'Red', 'Yellow']),
        admissionDate: getRandomDate(new Date('2020-09-01'), new Date('2024-09-01')),
        status: 'active',
        bloodGroup: getRandomItem(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
        genotype: getRandomItem(['AA', 'AS', 'AC', 'SS']),
        isActive: true
      });
    }

    const createdStudents = await db.insert(students).values(studentData).returning();

    // 9. Create Users (for authentication)
    console.log('👤 Creating users...');
    const userData = [
      // Admin user
      {
        schoolId: school.id,
        email: 'admin@folushovictory.com',
        password: '$2b$10$example.hash.for.admin123', // This should be properly hashed
        role: 'admin',
        isActive: true
      },
      // Teacher user
      {
        schoolId: school.id,
        email: 'teacher@folushovictory.com',
        password: '$2b$10$example.hash.for.teacher123', // This should be properly hashed
        role: 'teacher',
        isActive: true
      },
      // Parent user
      {
        schoolId: school.id,
        email: 'parent@folushovictory.com',
        password: '$2b$10$example.hash.for.parent123', // This should be properly hashed
        role: 'parent',
        isActive: true
      }
    ];

    const createdUsers = await db.insert(users).values(userData).returning();

    // 10. Create User Profiles
    console.log('📋 Creating user profiles...');
    const userProfileData = [
      {
        userId: createdUsers[0].id, // Admin
        profileType: 'teacher',
        profileId: createdTeachers[0].id // Principal
      },
      {
        userId: createdUsers[1].id, // Teacher
        profileType: 'teacher',
        profileId: createdTeachers[1].id
      },
      {
        userId: createdUsers[2].id, // Parent
        profileType: 'student',
        profileId: createdStudents[0].id
      }
    ];

    await db.insert(userProfiles).values(userProfileData);

    // 11. Create Fee Structures
    console.log('💰 Creating fee structures...');
    const feeStructureData = [];
    
    // Pre-Nursery fees (lower fees for early childhood)
    const preNurseryClasses = createdClasses.filter(c => c.level === 'Pre-Nursery');
    preNurseryClasses.forEach(cls => {
      feeStructureData.push({
        schoolId: school.id,
        classId: cls.id,
        academicYearId: currentAcademicYear.id,
        termId: term1.id,
        tuition: 15000,
        development: 3000,
        materials: 2000, // Learning materials
        feeding: 5000, // School meals for young children
        pta: 2000,
        totalAmount: 27000,
        dueDate: new Date('2024-10-15'),
        isActive: true
      });
    });
    
    // Nursery fees
    const nurseryClasses = createdClasses.filter(c => c.level === 'Nursery');
    nurseryClasses.forEach(cls => {
      feeStructureData.push({
        schoolId: school.id,
        classId: cls.id,
        academicYearId: currentAcademicYear.id,
        termId: term1.id,
        tuition: 20000,
        development: 4000,
        materials: 2500,
        feeding: 4000,
        sports: 1500,
        pta: 2500,
        totalAmount: 34500,
        dueDate: new Date('2024-10-15'),
        isActive: true
      });
    });
    
    // Primary fees
    const primaryClasses = createdClasses.filter(c => c.level === 'Primary');
    primaryClasses.forEach(cls => {
      feeStructureData.push({
        schoolId: school.id,
        classId: cls.id,
        academicYearId: currentAcademicYear.id,
        termId: term1.id,
        tuition: 25000,
        development: 5000,
        sports: 2000,
        library: 1500,
        ict: 1000,
        pta: 3000,
        totalAmount: 37500,
        dueDate: new Date('2024-10-15'),
        isActive: true
      });
    });

    // JSS fees
    const jssClasses = createdClasses.filter(c => c.level === 'JSS');
    jssClasses.forEach(cls => {
      feeStructureData.push({
        schoolId: school.id,
        classId: cls.id,
        academicYearId: currentAcademicYear.id,
        termId: term1.id,
        tuition: 45000,
        development: 8000,
        sports: 3000,
        laboratory: 5000,
        library: 2000,
        ict: 2000,
        pta: 4000,
        totalAmount: 69000,
        dueDate: new Date('2024-10-15'),
        isActive: true
      });
    });

    // SSS fees
    const sssClasses = createdClasses.filter(c => c.level === 'SSS');
    sssClasses.forEach(cls => {
      feeStructureData.push({
        schoolId: school.id,
        classId: cls.id,
        academicYearId: currentAcademicYear.id,
        termId: term1.id,
        tuition: 55000,
        development: 10000,
        sports: 3000,
        laboratory: 8000,
        library: 3000,
        ict: 3000,
        excursion: 5000,
        pta: 5000,
        totalAmount: 92000,
        dueDate: new Date('2024-10-15'),
        isActive: true
      });
    });

    const createdFeeStructures = await db.insert(feeStructures).values(feeStructureData).returning();

    // 12. Create Student Fees
    console.log('📊 Creating student fees...');
    const studentFeeData = [];
    
    createdStudents.forEach((student, index) => {
      const classFeeStructure = createdFeeStructures.find(fs => fs.classId === student.classId);
      if (classFeeStructure) {
        studentFeeData.push({
          studentId: student.id,
          feeStructureId: classFeeStructure.id,
          totalAmount: classFeeStructure.totalAmount,
          amountPaid: Math.random() > 0.3 ? classFeeStructure.totalAmount : classFeeStructure.totalAmount * 0.7,
          balance: Math.random() > 0.3 ? 0 : classFeeStructure.totalAmount * 0.3,
          dueDate: classFeeStructure.dueDate,
          status: Math.random() > 0.3 ? 'paid' : 'partial'
        });
      }
    });

    await db.insert(studentFees).values(studentFeeData);

    // 13. Create System Settings
    console.log('⚙️ Creating system settings...');
    const systemSettingsData = [
      {
        schoolId: school.id,
        key: 'school_name',
        value: 'FOLUSHO VICTORY SCHOOLS',
        description: 'School name for display',
        category: 'general',
        isActive: true
      },
      {
        schoolId: school.id,
        key: 'current_academic_year',
        value: '2024/2025',
        description: 'Current academic year',
        category: 'academic',
        isActive: true
      },
      {
        schoolId: school.id,
        key: 'current_term',
        value: 'TERM_2',
        description: 'Current school term',
        category: 'academic',
        isActive: true
      },
      {
        schoolId: school.id,
        key: 'grading_scale',
        value: { 
          A: { min: 70, max: 100, points: 5.0, grade: 'Excellent' },
          B: { min: 60, max: 69, points: 4.0, grade: 'Very Good' },
          C: { min: 50, max: 59, points: 3.0, grade: 'Good' },
          D: { min: 45, max: 49, points: 2.0, grade: 'Credit' },
          E: { min: 40, max: 44, points: 1.0, grade: 'Pass' },
          F: { min: 0, max: 39, points: 0.0, grade: 'Fail' }
        },
        description: 'Nigerian 5-point grading scale',
        category: 'academic',
        isActive: true
      },
      {
        schoolId: school.id,
        key: 'currency',
        value: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
        description: 'Currency settings',
        category: 'financial',
        isActive: true
      },
      {
        schoolId: school.id,
        key: 'attendance_threshold',
        value: 75,
        description: 'Minimum attendance percentage required',
        category: 'academic',
        isActive: true
      }
    ];

    await db.insert(systemSettings).values(systemSettingsData);

    console.log('✅ Database seed completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - School: ${school.name}`);
    console.log(`   - Academic Years: 1`);
    console.log(`   - School Terms: 3`);
    console.log(`   - Departments: 3`);
    console.log(`   - Subjects: ${createdSubjects.length}`);
    console.log(`   - Classes: ${createdClasses.length}`);
    console.log(`   - Teachers: ${createdTeachers.length}`);
    console.log(`   - Students: ${createdStudents.length}`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Fee Structures: ${createdFeeStructures.length}`);
    console.log(`   - Student Fees: ${studentFeeData.length}`);
    console.log(`   - System Settings: ${systemSettingsData.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
