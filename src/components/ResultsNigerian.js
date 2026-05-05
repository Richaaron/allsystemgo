import React, { useState, useEffect } from 'react';

const ResultsNigerian = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [term, setTerm] = useState('Second Term');
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({});
  const [resultSettings, setResultSettings] = useState({
    principalName: '',
    proprietressName: '',
    resultHeader: 'FOLUSHO VICTORY SCHOOLS',
    resultFooter: 'Approved by the Ministry of Education'
  });
  const [printingResultId, setPrintingResultId] = useState(null);

  // Sample students with their registered subjects
  const sampleStudents = [
    {
      id: 1,
      admissionNumber: 'FVS/2024/0001',
      firstName: 'Ahmed',
      lastName: 'Bello',
      studentClass: 'JSS 2',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Basic Science', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Social Studies', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Civic Education', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    },
    {
      id: 2,
      admissionNumber: 'FVS/2024/0002',
      firstName: 'Chinyere',
      lastName: 'Okonkwo',
      studentClass: 'JSS 2',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Basic Science', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Basic Technology', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Business Studies', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    },
    {
      id: 3,
      admissionNumber: 'FVS/2024/0003',
      firstName: 'Tunde',
      lastName: 'Johnson',
      studentClass: 'SSS 1',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Physics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Chemistry', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Biology', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    },
    {
      id: 4,
      admissionNumber: 'FVS/2024/0004',
      firstName: 'Fatima',
      lastName: 'Mohammed',
      studentClass: 'SSS 1',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Physics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Chemistry', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Geography', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    }
  ];

  // Sample existing results
  const sampleResults = [
    {
      id: 1,
      studentId: 1,
      studentName: 'Ahmed Bello',
      studentClass: 'JSS 2',
      term: 'Second Term',
      subjects: [
        { name: 'English Language', ca1: 18, ca2: 19, exam: 48, total: 85, grade: 'A' },
        { name: 'Mathematics', ca1: 16, ca2: 17, exam: 45, total: 78, grade: 'B' },
        { name: 'Basic Science', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A' }
      ],
      overallTotal: 248,
      overallAverage: 82.7,
      overallGrade: 'A',
      status: 'published'
    }
  ];

  useEffect(() => {
    setStudents(sampleStudents);
    setResults(sampleResults);
    
    // Load result settings from API or localStorage
    loadResultSettings();
  }, []);

  const loadResultSettings = async () => {
    try {
      // Try localStorage first
      const savedSettings = localStorage.getItem('resultSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setResultSettings({
            principalName: parsed.principalName || '',
            proprietressName: parsed.proprietressName || '',
            resultHeader: parsed.resultHeader || 'FOLUSHO VICTORY SCHOOLS',
            resultFooter: parsed.resultFooter || 'Approved by the Ministry of Education'
          });
          console.log('✓ Loaded result settings from localStorage');
          return;
        } catch (e) {
          console.debug('Stored settings are invalid, using defaults');
        }
      }

      // Try API endpoint with proper error handling
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://oscuovpwpzjqtaczsems.supabase.co';
      const functionsUrl = `${supabaseUrl}/functions/v1`;
      
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${functionsUrl}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          console.debug('Settings API returned error, using defaults');
          return;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.debug('Settings API did not return JSON');
          return;
        }

        const data = await response.json();
        
        setResultSettings({
          principalName: data.principal_name || '',
          proprietressName: data.proprietress_name || '',
          resultHeader: data.result_header || 'FOLUSHO VICTORY SCHOOLS',
          resultFooter: data.result_footer || 'Approved by the Ministry of Education'
        });
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          console.debug('Settings API request timeout');
        } else {
          console.debug('Could not fetch settings from API');
        }
      }
    } catch (error) {
      console.debug('Error in loadResultSettings:', error.message);
      // Keep defaults if everything fails
    }
  };

  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 45) return 'E';
    return 'F';
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#22c55e';
      case 'B': return '#3b82f6';
      case 'C': return '#fbbf24';
      case 'D': return '#fb923c';
      case 'E': return '#f97316';
      default: return '#ef4444';
    }
  };

  // Initialize form data when student is selected
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const initialFormData = {};
    
    student.registeredSubjects.forEach(subject => {
      initialFormData[subject.name] = {
        ca1: '',
        ca2: '',
        exam: '',
        total: 0,
        grade: 'F'
      };
    });
    
    setFormData(initialFormData);
    setShowForm(true);
  };

  // Convert number to ordinal format (1st, 2nd, 3rd, etc.)
  const getPositionOrdinal = (position) => {
    if (position === 1) return '1st';
    if (position === 2) return '2nd';
    if (position === 3) return '3rd';
    return `${position}th`;
  };

  // Calculate position based on class and term performance
  const calculatePosition = (newResult, allResults) => {
    // Get all results for same class and term (including the new one)
    const classResults = [
      ...allResults.filter(
        r => r.studentClass === newResult.studentClass && r.term === newResult.term
      ),
      newResult
    ];

    // Sort by overall average (highest first)
    const sorted = [...classResults].sort((a, b) => 
      b.overallAverage - a.overallAverage
    );

    // Find position of current student
    const position = sorted.findIndex(r => r.studentId === newResult.studentId) + 1;
    const totalStudents = sorted.length;

    return { position, totalStudents, positionText: getPositionOrdinal(position) };
  };

  // Calculate all positions for a class (for display)
  const getPositionsForClass = (studentClass, termValue) => {
    const classResults = results.filter(
      r => r.studentClass === studentClass && r.term === termValue
    );

    // Sort by overall average (highest first)
    const sorted = [...classResults].sort((a, b) => 
      b.overallAverage - a.overallAverage
    );

    // Add position to each result
    return sorted.map((result, index) => ({
      ...result,
      position: index + 1,
      positionText: getPositionOrdinal(index + 1),
      totalStudents: sorted.length
    }));
  };

  // Calculate total and grade for a subject
  const calculateSubjectScore = (subjectName, ca1, ca2, exam) => {
    const total = (parseInt(ca1) || 0) + (parseInt(ca2) || 0) + (parseInt(exam) || 0);
    const grade = getGrade(total);
    return { total, grade };
  };

  // Handle score input changes
  const handleScoreChange = (subjectName, fieldType, value) => {
    const numValue = Math.min(parseInt(value) || 0, fieldType === 'exam' ? 60 : 20);
    if (numValue < 0) return;

    setFormData(prev => {
      const updatedData = { ...prev };
      if (!updatedData[subjectName]) {
        updatedData[subjectName] = { ca1: '', ca2: '', exam: '', total: 0, grade: 'F' };
      }
      
      updatedData[subjectName] = {
        ...updatedData[subjectName],
        [fieldType]: numValue
      };

      // Calculate total and grade
      const { total, grade } = calculateSubjectScore(
        subjectName,
        updatedData[subjectName].ca1,
        updatedData[subjectName].ca2,
        updatedData[subjectName].exam
      );
      
      updatedData[subjectName].total = total;
      updatedData[subjectName].grade = grade;

      return updatedData;
    });
  };

  // Calculate overall scores
  const calculateOverallScores = () => {
    if (!selectedStudent) return { total: 0, average: 0, grade: 'F' };
    
    const subjects = Object.values(formData);
    if (subjects.length === 0) return { total: 0, average: 0, grade: 'F' };
    
    const totalScore = subjects.reduce((sum, subject) => sum + (subject.total || 0), 0);
    const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
    const grade = getGrade(Math.round(averageScore));
    
    return { total: totalScore, average: averageScore, grade };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedStudent) return;

    const overallScores = calculateOverallScores();
    const subjectResults = selectedStudent.registeredSubjects.map(subject => ({
      name: subject.name,
      ca1: formData[subject.name]?.ca1 || 0,
      ca2: formData[subject.name]?.ca2 || 0,
      exam: formData[subject.name]?.exam || 0,
      total: formData[subject.name]?.total || 0,
      grade: formData[subject.name]?.grade || 'F'
    }));

    const newResult = {
      id: results.length + 1,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      studentClass: selectedStudent.studentClass,
      term: term,
      subjects: subjectResults,
      overallTotal: overallScores.total,
      overallAverage: overallScores.average,
      overallGrade: overallScores.grade,
      status: 'draft'
    };

    // Calculate position for this student
    const { position, totalStudents, positionText } = calculatePosition(newResult, results);
    newResult.position = position;
    newResult.totalStudents = totalStudents;
    newResult.positionText = positionText;

    const updatedResults = [...results, newResult];
    
    // Recalculate positions for all students in this class/term
    const classResults = updatedResults.filter(
      r => r.studentClass === selectedStudent.studentClass && r.term === term
    );
    
    classResults.forEach((result, index) => {
      const sorted = [...classResults].sort((a, b) => b.overallAverage - a.overallAverage);
      const posIndex = sorted.findIndex(r => r.id === result.id);
      result.position = posIndex + 1;
      result.totalStudents = sorted.length;
      result.positionText = getPositionOrdinal(posIndex + 1);
    });

    setResults(updatedResults);
    setShowForm(false);
    setSelectedStudent(null);
    setFormData({});
  };

  // Filter results based on user role
  const getFilteredResults = () => {
    if (!user || user.role === 'admin') {
      return results;
    }

    switch (user.role) {
      case 'Form Teacher':
        return results.filter(result => result.studentClass === 'JSS 2');
      case 'Subject Teacher':
        return results.filter(result => {
          return result.subjects.some(subject => 
            ['Mathematics', 'Physics'].includes(subject.name)
          );
        });
      case 'Dual Role':
        return results.filter(result => 
          result.studentClass === 'SSS 1' || 
          result.subjects.some(subject => 
            ['Mathematics', 'Physics', 'Chemistry'].includes(subject.name)
          )
        );
      default:
        return [];
    }
  };

  const filteredResults = getFilteredResults();
  const overallScores = calculateOverallScores();

  // Render print view for a result
  const renderPrintView = (result) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'white',
        color: '#1f2937',
        padding: '40px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setPrintingResultId(null)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          ✕
        </button>

        {/* Print Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #1f2937', paddingBottom: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>
            {resultSettings.resultHeader}
          </h2>
          <p style={{ margin: '5px 0', fontSize: '14px', fontStyle: 'italic' }}>
            Academic Result Slip
          </p>
        </div>

        {/* Student Information */}
        <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Student Name:</strong> {result.studentName}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Class:</strong> {result.studentClass}
            </p>
          </div>
          <div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Term:</strong> {result.term}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
          <div style={{ textAlign: 'center', backgroundColor: '#fef3c7', padding: '15px', borderRadius: '6px' }}>
            <p style={{ margin: '5px 0', fontSize: '12px', color: '#92400e' }}>
              <strong>Class Position</strong>
            </p>
            <p style={{ margin: '5px 0', fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>
              {(() => {
                const classResults = results.filter(
                  r => r.studentClass === result.studentClass && r.term === result.term
                );
                const sorted = [...classResults].sort((a, b) => b.overallAverage - a.overallAverage);
                const position = sorted.findIndex(r => r.id === result.id) + 1;
                return `${getPositionOrdinal(position)}`;
              })()}
            </p>
            <p style={{ margin: '5px 0', fontSize: '12px', color: '#92400e' }}>
              out of {(() => {
                const classResults = results.filter(
                  r => r.studentClass === result.studentClass && r.term === result.term
                );
                return classResults.length;
              })()}
            </p>
          </div>
        </div>

        {/* Results Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #1f2937' }}>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Subject</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>CA1</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>CA2</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Exam</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Total</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((subject, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px', textAlign: 'left' }}>{subject.name}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{subject.ca1}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{subject.ca2}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{subject.exam}</td>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{subject.total}</td>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#ef4444' }}>
                  {subject.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Overall Summary */}
        <div style={{ 
          background: '#f3f4f6', 
          padding: '15px', 
          borderRadius: '6px', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                <strong>Overall Average:</strong>
              </p>
              <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                {result.overallAverage.toFixed(2)}
              </p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                <strong>Overall Grade:</strong>
              </p>
              <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                {result.overallGrade}
              </p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                <strong>Class Position:</strong>
              </p>
              <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>
                {(() => {
                  const classResults = results.filter(
                    r => r.studentClass === result.studentClass && r.term === result.term
                  );
                  const sorted = [...classResults].sort((a, b) => b.overallAverage - a.overallAverage);
                  const position = sorted.findIndex(r => r.id === result.id) + 1;
                  return `${getPositionOrdinal(position)} of ${sorted.length}`;
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Principal Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '2px dashed #1f2937',
              borderRadius: '8px',
              padding: '30px 20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
              position: 'relative',
              marginBottom: '15px'
            }}>
              {/* Signature Line */}
              <div style={{
                borderTop: '3px solid #1f2937',
                width: '140px',
                margin: '0 auto 15px',
                paddingTop: '10px'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  letterSpacing: '2px',
                  fontFamily: 'Brush Script MT, cursive, serif',
                  lineHeight: '1.2'
                }}>
                  {resultSettings.principalName ? resultSettings.principalName.split(' ')[0] : 'Signature'}
                </div>
              </div>
              
              {/* Title and Name */}
              <p style={{ margin: '8px 0 4px 0', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
                {resultSettings.principalName || 'Principal Name'}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Principal
              </p>
              
              {/* Date */}
              <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
                Date: _________________
              </p>
            </div>
          </div>

          {/* Proprietress Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '2px dashed #1f2937',
              borderRadius: '8px',
              padding: '30px 20px',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(168, 85, 247, 0.05))',
              position: 'relative',
              marginBottom: '15px'
            }}>
              {/* Signature Line */}
              <div style={{
                borderTop: '3px solid #1f2937',
                width: '140px',
                margin: '0 auto 15px',
                paddingTop: '10px'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  letterSpacing: '2px',
                  fontFamily: 'Brush Script MT, cursive, serif',
                  lineHeight: '1.2'
                }}>
                  {resultSettings.proprietressName ? resultSettings.proprietressName.split(' ')[0] : 'Signature'}
                </div>
              </div>
              
              {/* Title and Name */}
              <p style={{ margin: '8px 0 4px 0', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
                {resultSettings.proprietressName || 'Proprietress Name'}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Proprietress
              </p>
              
              {/* Date */}
              <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>
                Date: _________________
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '2px solid #1f2937',
          fontSize: '12px',
          color: '#666'
        }}>
          <p style={{ margin: '5px 0' }}>{resultSettings.resultFooter}</p>
        </div>

        {/* Print Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '14px'
            }}
          >
            🖨️ Print
          </button>
          <button
            onClick={() => setPrintingResultId(null)}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem', marginBottom: '5px' }}>Results Management</h2>
          {user && user.role !== 'admin' && (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {user.role} Access - {filteredResults.length} results visible
            </p>
          )}
        </div>
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          style={{
            background: 'rgba(51, 65, 85, 0.5)',
            border: '2px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            color: '#f1f5f9',
            padding: '10px',
            fontSize: '1rem'
          }}
        >
          <option value="First Term">First Term</option>
          <option value="Second Term">Second Term</option>
          <option value="Third Term">Third Term</option>
        </select>
      </div>

      {/* Student Selection */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>Select Student for Result Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {students.map(student => (
            <div
              key={student.id}
              onClick={() => handleStudentSelect(student)}
              style={{
                background: 'rgba(51, 65, 85, 0.5)',
                border: '2px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                e.target.style.background = 'rgba(51, 65, 85, 0.5)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ color: '#f1f5f9', fontWeight: '600' }}>
                  {student.firstName} {student.lastName}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {student.admissionNumber}
                </span>
              </div>
              <div style={{ color: '#60a5fa', fontSize: '0.9rem', marginBottom: '5px' }}>
                {student.studentClass}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                {student.registeredSubjects.length} subjects
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Entry Form */}
      {showForm && selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>
                  Enter Results - {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>
                  {selectedStudent.studentClass} • {selectedStudent.admissionNumber} • {term}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setSelectedStudent(null);
                  setFormData({});
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#f1f5f9', marginBottom: '15px' }}>Subject Scores</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#e2e8f0' }}>Subject</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>1st CA (20)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>2nd CA (20)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>Exam (60)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>Total</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.registeredSubjects.map(subject => {
                        const subjectData = formData[subject.name] || {};
                        return (
                          <tr key={subject.name} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                            <td style={{ padding: '10px', color: '#e2e8f0', fontWeight: '500' }}>
                              {subject.name}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={subjectData.ca1 || ''}
                                onChange={(e) => handleScoreChange(subject.name, 'ca1', e.target.value)}
                                style={{
                                  width: '60px',
                                  padding: '5px',
                                  background: 'rgba(51, 65, 85, 0.5)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '4px',
                                  color: '#f1f5f9',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={subjectData.ca2 || ''}
                                onChange={(e) => handleScoreChange(subject.name, 'ca2', e.target.value)}
                                style={{
                                  width: '60px',
                                  padding: '5px',
                                  background: 'rgba(51, 65, 85, 0.5)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '4px',
                                  color: '#f1f5f9',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="60"
                                value={subjectData.exam || ''}
                                onChange={(e) => handleScoreChange(subject.name, 'exam', e.target.value)}
                                style={{
                                  width: '60px',
                                  padding: '5px',
                                  background: 'rgba(51, 65, 85, 0.5)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '4px',
                                  color: '#f1f5f9',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0', fontWeight: '600' }}>
                              {subjectData.total || 0}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                color: 'white',
                                backgroundColor: getGradeColor(subjectData.grade || 'F')
                              }}>
                                {subjectData.grade || 'F'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Summary */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#60a5fa', marginBottom: '10px' }}>Overall Summary</h4>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Total Score: </span>
                    <span style={{ color: '#f1f5f9', fontWeight: '600' }}>{overallScores.total}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Average: </span>
                    <span style={{ color: '#f1f5f9', fontWeight: '600' }}>
                      {overallScores.average.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Grade: </span>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: getGradeColor(overallScores.grade)
                    }}>
                      {overallScores.grade}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedStudent(null);
                    setFormData({});
                  }}
                  style={{
                    background: 'rgba(148, 163, 184, 0.3)',
                    color: '#e2e8f0',
                    border: '2px solid rgba(148, 163, 184, 0.3)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Save Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Results Table */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Saved Results ({filteredResults.length})
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
              <th style={{ padding: '12px', textAlign: 'center', color: '#e2e8f0' }}>Position</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Class</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Term</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Average</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Grade</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, idx) => {
              // Recalculate position dynamically for display
              const classResults = results.filter(
                r => r.studentClass === result.studentClass && r.term === result.term
              );
              const sorted = [...classResults].sort((a, b) => b.overallAverage - a.overallAverage);
              const position = sorted.findIndex(r => r.id === result.id) + 1;
              const positionText = getPositionOrdinal(position);

              return (
                <tr key={result.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#60a5fa', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    🏆 {positionText}
                  </td>
                  <td style={{ padding: '12px', color: '#e2e8f0' }}>{result.studentName}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{result.studentClass}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{result.term}</td>
                  <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: '600' }}>
                    {result.overallAverage.toFixed(1)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: getGradeColor(result.overallGrade)
                    }}>
                      {result.overallGrade}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: result.status === 'published' ? '#22c55e' : '#94a3b8',
                      backgroundColor: result.status === 'published' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                      border: `1px solid ${result.status === 'published' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
                    }}>
                      {result.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => setPrintingResultId(result.id)}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      📄 Print
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>No results available. Select a student above to enter results.</p>
          </div>
        )}
      </div>

      {/* Print View Modal */}
      {printingResultId && (
        renderPrintView(filteredResults.find(r => r.id === printingResultId))
      )}
    </div>
  );
};

export default ResultsNigerian;
