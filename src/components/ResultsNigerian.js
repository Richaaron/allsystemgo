import React, { useState, useEffect } from 'react';
import { emailNotificationService } from '../services/emailNotificationService';
import { supabaseService } from '../services/supabaseService';

const ResultsNigerian = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [term, setTerm] = useState('Second Term');
  const [academicSession, setAcademicSession] = useState('2023/2024');
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({});
  const [resultSettings, setResultSettings] = useState({
    principalName: '',
    proprietressName: '',
    resultHeader: 'FOLUSHO VICTORY SCHOOLS',
    resultFooter: 'Approved by the Ministry of Education',
    schoolAddress: '',
    schoolPhone: '',
    schoolEmail: ''
  });
  const [printingResultId, setPrintingResultId] = useState(null);
  const [activeView, setActiveView] = useState(user?.role === 'subject_teacher' ? 'subject' : 'class');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [subjectScores, setSubjectScores] = useState({});
  const [selectedResultIds, setSelectedResultIds] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadLiveStudentsAndResults();
    // Load result settings from API or localStorage
    loadResultSettings();
  }, [term, academicSession]);

  const loadLiveStudentsAndResults = async () => {
    try {
      // Fetch live data from Supabase (no auto-seeding)
      const fetchedStudents = await supabaseService.getStudents();
      const fetchedResults = await supabaseService.getStudentResults(term, academicSession);
      setStudents(fetchedStudents);
      setResults(fetchedResults);
    } catch (e) {
      console.error('Failed to load students and results:', e);
    }
  };

  const loadResultSettings = async () => {
    try {
      // Always fetch fresh settings from Supabase database
      const data = await supabaseService.getSettings(1);
      
      if (data) {
        setResultSettings({
          principalName: data.principal_name || '',
          proprietressName: data.proprietress_name || '',
          resultHeader: data.result_header || 'FOLUSHO VICTORY SCHOOLS',
          resultFooter: data.result_footer || 'Approved by the Ministry of Education',
          schoolMotto: data.school_motto || 'Excellence in Education',
          schoolAddress: data.school_address || '',
          schoolPhone: data.school_phone || '',
          schoolEmail: data.school_email || ''
        });
        console.log('✓ Loaded result settings from Supabase');
      }
    } catch (error) {
      console.debug('Could not load settings from Supabase, using defaults:', error.message);
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
  const handleSubmit = async (e) => {
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

    try {
      // Save to Supabase
      const saveResult = await supabaseService.saveStudentResult(
        selectedStudent,
        term,
        academicSession,
        subjectResults,
        overallScores.total,
        overallScores.average,
        overallScores.grade
      );

      if (saveResult.success) {
        // Reload results from database to get accurate IDs and data
        const freshResults = await supabaseService.getStudentResults(term, academicSession);
        setResults(freshResults);

        // Log the activity
        await supabaseService.logTeacherActivity(
          user?.name || user?.email || 'Admin',
          user?.role || 'admin',
          'RESULT_ENTRY',
          `Entered results for ${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.studentClass}) - ${term}`
        );

        alert(`Results saved successfully for ${selectedStudent.firstName} ${selectedStudent.lastName}!`);
      } else {
        alert('Failed to save results: ' + (saveResult.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Failed to save results. Please try again.');
    }

    setShowForm(false);
    setSelectedStudent(null);
    setFormData({});
  };

  // Filter results based on user role
  const getFilteredResults = () => {
    // All authenticated users see all results for the selected term
    // Future: filter by teacher's assigned class/subjects from their profile
    return results;
  };

  const filteredResults = getFilteredResults();
  const overallScores = calculateOverallScores();

  const handleSubjectScoreChange = (studentId, fieldType, value) => {
    const numValue = Math.min(parseInt(value) || 0, fieldType === 'exam' ? 60 : 20);
    if (numValue < 0) return;

    setSubjectScores(prev => {
      const studentScores = prev[studentId] || { ca1: '', ca2: '', exam: '', total: 0, grade: 'F' };
      const updated = { ...studentScores, [fieldType]: numValue };
      const total = (parseInt(updated.ca1) || 0) + (parseInt(updated.ca2) || 0) + (parseInt(updated.exam) || 0);
      updated.total = total;
      updated.grade = getGrade(total);
      return { ...prev, [studentId]: updated };
    });
  };

  const handleSaveSubjectScores = async () => {
    if (!selectedClass || !selectedSubject) {
      alert('Please select a class and subject first.');
      return;
    }

    let savedCount = 0;

    for (const [studentId, scores] of Object.entries(subjectScores)) {
      const student = students.find(s => s.id === parseInt(studentId));
      if (!student) continue;

      // Find existing result for this student+term in current results
      const existingResult = results.find(r => r.studentId === student.id && r.term === term);

      // Build merged subjects array
      const currentSubjects = existingResult ? [...(existingResult.subjects || [])] : [];
      const subjectIndex = currentSubjects.findIndex(s => s.name === selectedSubject);
      const subjectData = {
        name: selectedSubject,
        ca1: parseInt(scores.ca1) || 0,
        ca2: parseInt(scores.ca2) || 0,
        exam: parseInt(scores.exam) || 0,
        total: scores.total || 0,
        grade: scores.grade || 'F'
      };

      if (subjectIndex >= 0) {
        currentSubjects[subjectIndex] = subjectData;
      } else {
        currentSubjects.push(subjectData);
      }

      const overallTotal = currentSubjects.reduce((sum, subj) => sum + subj.total, 0);
      const overallAverage = currentSubjects.length > 0 ? overallTotal / currentSubjects.length : 0;
      const overallGrade = getGrade(overallAverage);

      await supabaseService.saveStudentResult(
        student,
        term,
        academicSession,
        currentSubjects,
        overallTotal,
        overallAverage,
        overallGrade
      );
      savedCount++;
    }

    // Reload fresh results from Supabase
    const freshResults = await supabaseService.getStudentResults(term, academicSession);
    setResults(freshResults);

    alert(`${selectedSubject} results for ${selectedClass} saved for ${savedCount} student(s)!`);

    await supabaseService.logTeacherActivity(
      user?.name || user?.email || 'Teacher',
      user?.role || 'Teacher',
      'RESULT_ENTRY',
      `Updated ${selectedSubject} results for ${selectedClass} — ${savedCount} student(s).`
    );

    setSubjectScores({});
  };

  const handleToggleSelectResult = (id) => {
    setSelectedResultIds(prev => 
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedResultIds.length === filteredResults.length) {
      setSelectedResultIds([]); // Deselect all
    } else {
      setSelectedResultIds(filteredResults.map(r => r.id)); // Select all
    }
  };

  const handleSendSelectedResults = async () => {
    setIsSending(true);
    let successCount = 0;
    
    for (const id of selectedResultIds) {
      const result = results.find(r => r.id === id);
      if (result) {
        // Look up the parent email from the students list using studentId
        const student = students.find(s => s.id === result.studentId);
        const parentEmail = student?.parentEmail || null;

        const res = await emailNotificationService.sendStudentResultEmail(
          result.studentName,
          parentEmail,
          result.term,
          result.overallGrade,
          result.overallAverage.toFixed(2)
        );
        if (res.success) successCount++;
      }
    }
    
    setIsSending(false);
    alert(`Successfully sent ${successCount} result(s) to parents!`);

    // Log the activity
    if (successCount > 0) {
      await supabaseService.logTeacherActivity(
        user?.name || user?.email || 'Teacher',
        user?.role || 'Teacher',
        'EMAIL_SENT',
        `Sent bulk result emails to ${successCount} parent(s) for ${term}.`
      );
    }

    setSelectedResultIds([]);
  };


  // Render print view for a result
  const renderPrintView = (result) => {
    // Calculate position
    const classResults = results.filter(r => r.studentClass === result.studentClass && r.term === result.term);
    const sorted = [...classResults].sort((a, b) => b.overallAverage - a.overallAverage);
    const position = sorted.findIndex(r => r.id === result.id) + 1;
    const positionText = getPositionOrdinal(position);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 0',
        zIndex: 9999,
        overflowY: 'auto'
      }}>
        <div className="premium-print-container" style={{
          background: 'white',
          color: '#0f172a',
          padding: '50px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '900px',
          margin: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
            
            .premium-print-container {
              position: relative;
              background-image: radial-gradient(rgba(30, 58, 138, 0.03) 2px, transparent 2px);
              background-size: 30px 30px;
            }
            .premium-print-container::before {
              content: 'FVS';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 250px;
              font-family: 'Playfair Display', serif;
              color: rgba(30, 58, 138, 0.04);
              pointer-events: none;
              z-index: 0;
            }
            .content-wrapper {
              position: relative;
              z-index: 1;
            }
            .premium-header {
              font-family: 'Playfair Display', serif;
              color: #1e3a8a;
            }
            .gold-accent {
              color: #d97706;
            }
            .premium-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            }
            .premium-table th {
              background-color: #1e3a8a;
              color: #d97706;
              font-family: 'Montserrat', sans-serif;
              font-weight: 700;
              padding: 14px 15px;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 1px;
            }
            .premium-table td {
              padding: 12px 15px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
            }
            .premium-table tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .premium-table tr:last-child td {
              border-bottom: 2px solid #1e3a8a;
            }
            @media print {
              body * { visibility: hidden; }
              .premium-print-container, .premium-print-container * {
                visibility: visible;
              }
              .premium-print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-width: 100%;
                padding: 0;
                margin: 0;
                box-shadow: none;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
            }
          `}</style>

          {/* Close Button */}
          <button
            className="no-print"
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
              fontWeight: 'bold',
              zIndex: 10
            }}
          >
            ✕
          </button>

          <div className="content-wrapper">
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'inline-block', padding: '10px 30px', borderBottom: '3px solid #d97706', marginBottom: '15px' }}>
                <h2 className="premium-header" style={{ margin: '0 0 5px 0', fontSize: '32px', fontWeight: '700', letterSpacing: '1px' }}>
                  {resultSettings.resultHeader}
                </h2>
                <p className="premium-header" style={{ margin: '0', fontSize: '16px', fontStyle: 'italic', color: '#475569' }}>
                  {resultSettings.schoolMotto || 'Excellence in Education'}
                </p>
              </div>
              <p style={{ margin: '0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '3px', color: '#1e3a8a', fontWeight: '600' }}>
                Official Academic Report
              </p>
              {(resultSettings.schoolAddress || resultSettings.schoolPhone || resultSettings.schoolEmail) && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                  {resultSettings.schoolAddress && (
                    <p style={{ margin: '2px 0' }}>📍 {resultSettings.schoolAddress}</p>
                  )}
                  {resultSettings.schoolPhone && (
                    <p style={{ margin: '2px 0' }}>📞 {resultSettings.schoolPhone}</p>
                  )}
                  {resultSettings.schoolEmail && (
                    <p style={{ margin: '2px 0' }}>✉️ {resultSettings.schoolEmail}</p>
                  )}
                </div>
              )}
            </div>

            {/* Student Info & Medallion Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '25px', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: '12px', color: 'white', boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Student Name</p>
                  <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>{result.studentName}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Academic Term</p>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>{result.term}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Class / Grade</p>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>{result.studentClass}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Report Date</p>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Medallion */}
              <div style={{ marginLeft: '30px', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#fff', border: '4px solid #d97706', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 0 4px rgba(217, 119, 6, 0.2)' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: '#1e3a8a', letterSpacing: '1px' }}>Position</span>
                  <span className="premium-header" style={{ fontSize: '32px', color: '#d97706', lineHeight: '1' }}>{positionText.replace(/[^0-9]/g, '')}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>{positionText.replace(/[0-9]/g, '')}</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Out of {classResults.length}</div>
              </div>
            </div>

            {/* Results Table */}
            <table className="premium-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderRadius: '8px 0 0 0' }}>Subject</th>
                  <th style={{ textAlign: 'center' }}>1st CA</th>
                  <th style={{ textAlign: 'center' }}>2nd CA</th>
                  <th style={{ textAlign: 'center' }}>Exam</th>
                  <th style={{ textAlign: 'center' }}>Total</th>
                  <th style={{ textAlign: 'center', borderRadius: '0 8px 0 0' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.map((subject, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600', color: '#1e3a8a' }}>{subject.name}</td>
                    <td style={{ textAlign: 'center' }}>{subject.ca1}</td>
                    <td style={{ textAlign: 'center' }}>{subject.ca2}</td>
                    <td style={{ textAlign: 'center' }}>{subject.exam}</td>
                    <td style={{ textAlign: 'center', fontWeight: '700', color: '#1e3a8a' }}>{subject.total}</td>
                    <td style={{ textAlign: 'center', fontWeight: '700', color: subject.grade === 'F' ? '#ef4444' : '#10b981' }}>
                      {subject.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Overall Summary Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '50px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Overall Average</p>
                <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#1e3a8a' }}>{result.overallAverage.toFixed(2)}%</p>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#cbd5e1' }}></div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Overall Grade</p>
                <p className="gold-accent" style={{ margin: '0', fontSize: '24px', fontWeight: '700' }}>{result.overallGrade}</p>
              </div>
            </div>

            {/* Signatures */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '60px' }}>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                {/* Official Stamp Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  left: '50%',
                  marginLeft: '-80px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '4px double rgba(220, 38, 38, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-15deg)',
                  pointerEvents: 'none',
                  zIndex: 0
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(220, 38, 38, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: 'rgba(220, 38, 38, 0.3)',
                    textAlign: 'center',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Valid<br/>Official
                  </div>
                </div>

                <div style={{ borderBottom: '1.5px solid #1e3a8a', width: '220px', margin: '0 auto 10px', position: 'relative', height: '60px' }}>
                  {/* Cursive Signature */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    width: '100%',
                    fontSize: '48px',
                    fontFamily: '"Brush Script MT", "Lucida Handwriting", "Snell Roundhand", cursive',
                    color: '#0f172a',
                    transform: 'rotate(-5deg) skewX(-15deg)',
                    textShadow: '1px 1px 0px rgba(0,0,0,0.2), 0px 0px 3px rgba(15, 23, 42, 0.3)',
                    letterSpacing: '-2px',
                    lineHeight: '1',
                    zIndex: 2,
                    whiteSpace: 'nowrap'
                  }}>
                    {resultSettings.principalName ? resultSettings.principalName.split(' ')[0] : 'Principal'}
                  </div>
                </div>
                <p style={{ margin: '0 0 3px 0', fontWeight: '800', fontSize: '15px', color: '#1e3a8a', textTransform: 'uppercase' }}>
                  {resultSettings.principalName || 'Principal Name'}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
                  Principal
                </p>
              </div>

              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ borderBottom: '1.5px solid #1e3a8a', width: '220px', margin: '0 auto 10px', position: 'relative', height: '60px' }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    width: '100%',
                    fontSize: '48px',
                    fontFamily: '"Brush Script MT", "Lucida Handwriting", "Snell Roundhand", cursive',
                    color: '#1e3a8a', /* Blue ink for proprietress */
                    transform: 'rotate(-3deg) skewX(-10deg)',
                    textShadow: '1px 1px 0px rgba(30, 58, 138, 0.2), 0px 0px 3px rgba(30, 58, 138, 0.3)',
                    letterSpacing: '-1px',
                    lineHeight: '1',
                    zIndex: 2,
                    whiteSpace: 'nowrap'
                  }}>
                    {resultSettings.proprietressName ? resultSettings.proprietressName.split(' ')[0] : 'Proprietress'}
                  </div>
                </div>
                <p style={{ margin: '0 0 3px 0', fontWeight: '800', fontSize: '15px', color: '#1e3a8a', textTransform: 'uppercase' }}>
                  {resultSettings.proprietressName || 'Proprietress Name'}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
                  Proprietress
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#94a3b8' }}>
              <p style={{ margin: '0', fontStyle: 'italic' }}>{resultSettings.resultFooter}</p>
            </div>

            {/* Print Action Buttons (Hidden on Print) */}
            <div className="no-print" style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: '#1e3a8a',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '15px',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.4)'
                }}
              >
                🖨️ Print Result Sheet
              </button>
              <button
                onClick={() => setPrintingResultId(null)}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const teacherClasses = [...new Set(students.map(s => s.studentClass))];
  
  // Use actual subjects assigned to the teacher, or all subjects if admin
  const teacherSubjects = user?.role === 'admin' 
    ? [...new Set(students.flatMap(s => s.registeredSubjects?.map(rs => rs.name) || []))]
    : user?.subjects || [];
    
  const studentsInSelectedClass = students.filter(s => s.studentClass === selectedClass);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem', marginBottom: '5px' }}>Results Management</h2>
          {user && user.role !== 'admin' && (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {user.role} Access - {filteredResults.length} results visible
            </p>
          )}
        </div>

        {(user?.role === 'dual_role' || user?.role === 'admin') && (
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(30, 41, 59, 0.8)', padding: '5px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveView('class')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeView === 'class' ? '#3b82f6' : 'transparent',
                color: activeView === 'class' ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Class Result View
            </button>
            <button
              onClick={() => setActiveView('subject')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeView === 'subject' ? '#3b82f6' : 'transparent',
                color: activeView === 'subject' ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Subject Result View
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={academicSession}
            onChange={(e) => setAcademicSession(e.target.value)}
            style={{
              background: 'rgba(51, 65, 85, 0.5)',
              border: '2px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              color: '#f1f5f9',
              padding: '10px',
              fontSize: '1rem'
            }}
          >
            <option value="2023/2024">2023/2024</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
          </select>

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
      </div>

      {activeView === 'class' ? (
        <>
          {/* Student Selection (Form Teacher View) */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#f1f5f9', margin: 0 }}>Select Student for Result Entry</h3>
              
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(51, 65, 85, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: '#fff',
                  minWidth: '150px'
                }}
              >
                <option value="">All Classes</option>
                {teacherClasses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {students.length === 0 ? (
                <div style={{ color: '#94a3b8', padding: '20px', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                  No students registered yet. Please go to the "Students" menu to register a student first.
                </div>
              ) : students.filter(s => selectedClass ? s.studentClass === selectedClass : true).length === 0 ? (
                <div style={{ color: '#94a3b8', padding: '20px', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                  No students found in {selectedClass}.
                </div>
              ) : (
                students
                  .filter(student => selectedClass ? student.studentClass === selectedClass : true)
                  .map(student => (
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
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Subject Result View (Subject Teacher / Dual Role) */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>Subject Result Entry</h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff' }}
              >
                <option value="">-- Select Class --</option>
                {teacherClasses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff' }}
              >
                <option value="">-- Select Subject --</option>
                {teacherSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {selectedClass && selectedSubject && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>1st CA (20)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>2nd CA (20)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Exam (60)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Total</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsInSelectedClass.map(student => {
                      const scores = subjectScores[student.id] || { ca1: '', ca2: '', exam: '', total: 0, grade: '-' };
                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                          <td style={{ padding: '12px' }}>{student.firstName} {student.lastName}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input type="number" max="20" min="0" value={scores.ca1} onChange={(e) => handleSubjectScoreChange(student.id, 'ca1', e.target.value)} style={{ width: '60px', padding: '5px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.3)', color: 'white', textAlign: 'center' }} />
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input type="number" max="20" min="0" value={scores.ca2} onChange={(e) => handleSubjectScoreChange(student.id, 'ca2', e.target.value)} style={{ width: '60px', padding: '5px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.3)', color: 'white', textAlign: 'center' }} />
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input type="number" max="60" min="0" value={scores.exam} onChange={(e) => handleSubjectScoreChange(student.id, 'exam', e.target.value)} style={{ width: '60px', padding: '5px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.3)', color: 'white', textAlign: 'center' }} />
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#60a5fa' }}>{scores.total}</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: getGradeColor(scores.grade) }}>{scores.grade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={handleSaveSubjectScores} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Save Subject Results
                  </button>
                </div>
              </div>
            )}
            
            {!selectedClass || !selectedSubject ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Please select a Class and Subject to enter results.</p>
            ) : studentsInSelectedClass.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No students found in the selected class.</p>
            ) : null}
          </div>
        </>
      )}

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ color: '#f1f5f9', margin: 0 }}>
            Saved Results ({filteredResults.length})
          </h3>
          {selectedResultIds.length > 0 && (
            <button
              onClick={handleSendSelectedResults}
              disabled={isSending}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: isSending ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isSending ? 'Sending...' : `📧 Send ${selectedResultIds.length} Selected Result(s)`}
            </button>
          )}
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
              <th style={{ padding: '12px', textAlign: 'center', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedResultIds.length === filteredResults.length && filteredResults.length > 0}
                  onChange={handleToggleSelectAll}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </th>
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
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedResultIds.includes(result.id)}
                      onChange={() => handleToggleSelectResult(result.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </td>
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
