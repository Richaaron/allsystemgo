import React, { useState, useEffect } from 'react';
import './ResultsManagement.css';

// Mock student data (in real app, this would come from API)
const mockStudents = [
  {
    id: 1,
    admissionNumber: 'FVS/2024/0001',
    firstName: 'Ahmed',
    lastName: 'Bello',
    class: 'JSS 2',
    stream: '',
    assignedSubjects: [
      'English Language', 'Mathematics', 'Basic Science', 'Social Studies',
      'Civic Education', 'Computer Studies', 'Physical Education'
    ],
    status: 'active'
  },
  {
    id: 2,
    admissionNumber: 'FVS/2024/0002',
    firstName: 'Chinyere',
    lastName: 'Okonkwo',
    class: 'JSS 1',
    stream: '',
    assignedSubjects: [
      'English Language', 'Mathematics', 'Basic Science', 'Basic Technology',
      'Social Studies', 'Civic Education', 'Creative Arts', 'Home Economics'
    ],
    status: 'active'
  },
  {
    id: 3,
    admissionNumber: 'FVS/2024/0003',
    firstName: 'Tunde',
    lastName: 'Johnson',
    class: 'SSS 1',
    stream: 'Science',
    assignedSubjects: [
      'English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry',
      'Economics', 'ICT', 'Civic Education', 'Geography', 'Agricultural Science'
    ],
    status: 'active'
  },
  {
    id: 4,
    admissionNumber: 'FVS/2024/0004',
    firstName: 'Grace',
    lastName: 'Okonkwo',
    class: 'SSS 2',
    stream: 'Arts',
    assignedSubjects: [
      'English Language', 'Mathematics', 'Biology', 'Government', 'Literature in English',
      'Economics', 'History', 'Civic Education', 'Marketing', 'Geography'
    ],
    status: 'active'
  },
  {
    id: 5,
    admissionNumber: 'FVS/2024/0005',
    firstName: 'David',
    lastName: 'Adeyemi',
    class: 'SSS 3',
    stream: 'Commercial',
    assignedSubjects: [
      'English Language', 'Mathematics', 'Account', 'Commerce', 'Economics',
      'Business Studies', 'ICT', 'Civic Education', 'Marketing', 'Agricultural Science'
    ],
    status: 'active'
  },
  {
    id: 6,
    admissionNumber: 'FVS/2024/0006',
    firstName: 'Funke',
    lastName: 'Adebayo',
    class: 'Primary 5',
    stream: '',
    assignedSubjects: [
      'English Language', 'Mathematics', 'Basic Science', 'Social Studies',
      'Civic Education', 'Computer Studies', 'Physical Education', 'Creative Arts'
    ],
    status: 'active'
  }
];

const ResultsManagement = () => {
  const [results, setResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    term: '',
    academicYear: '',
    subjects: [],
    totalScore: 0,
    averageScore: 0,
    classPosition: 0,
    grade: '',
    remarks: '',
    status: 'draft'
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available classes
  const classes = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  // Available terms
  const terms = ['First Term', 'Second Term', 'Third Term'];

  // Academic years
  const academicYears = ['2024/2025', '2023/2024', '2022/2023'];

  // Available subjects
  const subjects = [
    'English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry',
    'Geography', 'History', 'Economics', 'Government', 'Literature',
    'Agricultural Science', 'Computer Studies', 'Physical Education',
    'Basic Science', 'Basic Technology', 'Social Studies', 'Civic Education',
    'Creative Arts', 'Home Economics', 'Business Studies'
  ];

  // Grade system - Simplified (removing A or B as school doesn't use them)
  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 45) return 'E';
    return 'F';
  };

  // Load sample data on mount
  useEffect(() => {
    const sampleResults = [
      {
        id: 1,
        studentId: 'FVS/2024/0001',
        studentName: 'Ahmed Bello',
        class: 'JSS 2A',
        term: 'Second Term',
        academicYear: '2024/2025',
        subjects: [
          { name: 'English Language', firstCA: 20, secondCA: 20, exam: 45, total: 85, grade: 'A' },
          { name: 'Mathematics', firstCA: 18, secondCA: 20, exam: 40, total: 78, grade: 'B' },
          { name: 'Basic Science', firstCA: 22, secondCA: 23, exam: 47, total: 92, grade: 'A' },
          { name: 'Social Studies', firstCA: 21, secondCA: 22, exam: 45, total: 88, grade: 'A' },
          { name: 'Civic Education', firstCA: 23, secondCA: 22, exam: 45, total: 90, grade: 'A' }
        ],
        totalScore: 433,
        averageScore: 86.6,
        classPosition: 3,
        grade: 'A',
        remarks: 'Excellent performance. Keep up the good work!',
        status: 'published'
      },
      {
        id: 2,
        studentId: 'FVS/2024/0002',
        studentName: 'Chinyere Okonkwo',
        class: 'JSS 1A',
        term: 'Second Term',
        academicYear: '2024/2025',
        subjects: [
          { name: 'English Language', firstCA: 24, secondCA: 23, exam: 48, total: 95, grade: 'A' },
          { name: 'Mathematics', firstCA: 22, secondCA: 21, exam: 45, total: 88, grade: 'A' },
          { name: 'Basic Science', firstCA: 20, secondCA: 22, exam: 40, total: 82, grade: 'B' },
          { name: 'Social Studies', firstCA: 23, secondCA: 22, exam: 45, total: 90, grade: 'A' },
          { name: 'Civic Education', firstCA: 22, secondCA: 20, exam: 45, total: 87, grade: 'A' }
        ],
        totalScore: 442,
        averageScore: 88.4,
        classPosition: 1,
        grade: 'A',
        remarks: 'Outstanding performance. Congratulations!',
        status: 'published'
      },
      {
        id: 3,
        studentId: 'FVS/2024/0003',
        studentName: 'Tunde Johnson',
        class: 'SSS 1A',
        term: 'Second Term',
        academicYear: '2024/2025',
        subjects: [
          { name: 'English Language', firstCA: 20, secondCA: 22, exam: 40, total: 82, grade: 'B' },
          { name: 'Mathematics', firstCA: 18, secondCA: 17, exam: 40, total: 75, grade: 'B' },
          { name: 'Physics', firstCA: 19, secondCA: 19, exam: 40, total: 78, grade: 'B' },
          { name: 'Chemistry', firstCA: 20, secondCA: 20, exam: 40, total: 80, grade: 'B' },
          { name: 'Biology', firstCA: 21, secondCA: 22, exam: 42, total: 85, grade: 'A' }
        ],
        totalScore: 400,
        averageScore: 80.0,
        classPosition: 5,
        grade: 'B',
        remarks: 'Good performance. Room for improvement in Mathematics.',
        status: 'draft'
      }
    ];
    setResults(sampleResults);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle student selection
    if (name === 'studentId' && value) {
      const studentId = parseInt(value);
      if (!isNaN(studentId)) {
        const student = mockStudents.find(s => s.id === studentId);
        if (student) {
          setSelectedStudent(student);
          
          // Auto-populate subjects from student's assigned subjects
          const studentSubjects = student.assignedSubjects.map(subject => ({
            name: subject,
            firstCA: 0,
            secondCA: 0,
            exam: 0,
            total: 0,
            grade: 'F'
          }));
          
          // Calculate total and average
          const totalScore = studentSubjects.reduce((sum, subject) => sum + subject.total, 0);
          const averageScore = studentSubjects.length > 0 ? totalScore / studentSubjects.length : 0;
          
          setFormData(prev => ({
            ...prev,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            class: student.class,
            subjects: studentSubjects,
            totalScore,
            averageScore,
            grade: getGrade(Math.round(averageScore))
          }));
        }
      }
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectScoreChange = (subjectName, component, value) => {
    setFormData(prev => {
      const updatedSubjects = prev.subjects.map(subject => {
        if (subject.name === subjectName) {
          const updatedSubject = { ...subject, [component]: parseInt(value) || 0 };
          // Calculate total (1st CA + 2nd CA + Exam)
          updatedSubject.total = updatedSubject.firstCA + updatedSubject.secondCA + updatedSubject.exam;
          // Calculate grade based on total
          updatedSubject.grade = getGrade(updatedSubject.total);
          return updatedSubject;
        }
        return subject;
      });
      
      // Calculate overall total and average
      const totalScore = updatedSubjects.reduce((sum, subject) => sum + subject.total, 0);
      const averageScore = updatedSubjects.length > 0 ? totalScore / updatedSubjects.length : 0;
      
      return {
        ...prev,
        subjects: updatedSubjects,
        totalScore,
        averageScore,
        grade: getGrade(Math.round(averageScore))
      };
    });
  };

  const removeSubject = (subjectName) => {
    setFormData(prev => {
      const updatedSubjects = prev.subjects.filter(subject => subject.name !== subjectName);
      const totalScore = updatedSubjects.reduce((sum, subject) => sum + subject.score, 0);
      const averageScore = updatedSubjects.length > 0 ? totalScore / updatedSubjects.length : 0;
      
      return {
        ...prev,
        subjects: updatedSubjects,
        totalScore,
        averageScore,
        grade: getGrade(Math.round(averageScore))
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) newErrors.studentId = 'Student selection is required';
    if (!formData.term) newErrors.term = 'Term is required';
    if (!formData.academicYear) newErrors.academicYear = 'Academic year is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingResult) {
        // Update existing result
        setResults(prev => prev.map(result => 
          result.id === editingResult.id 
            ? { ...formData, id: editingResult.id }
            : result
        ));
      } else {
        // Add new result
        const newResult = {
          ...formData,
          id: Date.now(),
          studentId: `FVS/2024/${String(results.length + 1).padStart(4, '0')}`
        };
        setResults(prev => [...prev, newResult]);
      }
      
      // Reset form
      setFormData({
        studentId: '',
        studentName: '',
        class: '',
        term: '',
        academicYear: '',
        subjects: [],
        totalScore: 0,
        averageScore: 0,
        classPosition: 0,
        grade: '',
        remarks: '',
        status: 'draft'
      });
      setEditingResult(null);
      setShowAddForm(false);
      setErrors({});
      
    } catch (error) {
      console.error('Result creation error:', error);
      alert('Result creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setFormData(result);
    setShowAddForm(true);
  };

  const handleDelete = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      setResults(prev => prev.filter(result => result.id !== resultId));
    }
  };

  const handlePublish = async (resultId) => {
    setResults(prev => prev.map(result => 
      result.id === resultId 
        ? { ...result, status: 'published' }
        : result
    ));
  };

  const handleCancel = () => {
    setFormData({
      studentId: '',
      studentName: '',
      class: '',
      term: '',
      academicYear: '',
      subjects: [],
      totalScore: 0,
      averageScore: 0,
      classPosition: 0,
      grade: '',
      remarks: '',
      status: 'draft'
    });
    setEditingResult(null);
    setShowAddForm(false);
    setErrors({});
  };

  const getGradeColor = (grade) => {
    if (grade === 'A') return '#22c55e';  // Excellent - Green
    if (grade === 'B') return '#3b82f6';  // Good - Blue
    if (grade === 'C') return '#fbbf24';  // Average - Yellow
    if (grade === 'D') return '#fb923c';  // Below Average - Orange
    if (grade === 'E') return '#f97316';  // Poor - Dark Orange
    return '#ef4444';  // Fail - Red
  };

  const filteredResults = results.filter(result => 
    result.studentName.toLowerCase().includes('') || 
    result.class.toLowerCase().includes('') ||
    result.term.toLowerCase().includes('')
  );

  return (
    <div className="results-management">
      <div className="management-header">
        <h2>Results Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add New Result
        </button>
      </div>

      <div className="results-table">
        <div className="table-header">
          <h3>All Results ({filteredResults.length})</h3>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search results..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Term</th>
                <th>Academic Year</th>
                <th>Average Score</th>
                <th>Grade</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(result => (
                <tr key={result.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-name">{result.studentName}</div>
                      <div className="student-id">{result.studentId}</div>
                    </div>
                  </td>
                  <td>{result.class}</td>
                  <td>{result.term}</td>
                  <td>{result.academicYear}</td>
                  <td>
                    <div className="score-display">
                      <span className="average-score">{result.averageScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="grade-badge" 
                      style={{ backgroundColor: getGradeColor(result.grade) }}
                    >
                      {result.grade}
                    </span>
                  </td>
                  <td>
                    <div className="position-display">
                      {result.classPosition > 0 ? `#${result.classPosition}` : '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${result.status}`}>
                      {result.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(result)}
                        className="btn-edit"
                        title="Edit Result"
                      >
                        ✏️
                      </button>
                      {result.status === 'draft' && (
                        <button 
                          onClick={() => handlePublish(result.id)}
                          className="btn-publish"
                          title="Publish Result"
                        >
                          📤
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(result.id)}
                        className="btn-delete"
                        title="Delete Result"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingResult ? 'Edit Result' : 'Add New Result'}</h3>
              <button onClick={handleCancel} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit} className="result-form">
              <div className="form-grid">
                <div className="form-section">
                  <h4>Student Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Select Student *</label>
                      <select
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className={errors.studentId ? 'error' : ''}
                      >
                        <option value="">Select a Student</option>
                        {mockStudents.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.admissionNumber} - {student.firstName} {student.lastName} ({student.class})
                          </option>
                        ))}
                      </select>
                      {errors.studentId && <span className="error-message">{errors.studentId}</span>}
                    </div>

                    <div className="form-group">
                      <label>Class</label>
                      <input
                        type="text"
                        name="class"
                        value={formData.class}
                        readOnly
                        className="readonly-input"
                        placeholder="Auto-populated from student"
                      />
                      <small className="auto-generated-hint">📚 Auto-populated from student selection</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Term *</label>
                      <select
                        name="term"
                        value={formData.term}
                        onChange={handleInputChange}
                        className={errors.term ? 'error' : ''}
                      >
                        <option value="">Select Term</option>
                        {terms.map(term => (
                          <option key={term} value={term}>{term}</option>
                        ))}
                      </select>
                      {errors.term && <span className="error-message">{errors.term}</span>}
                    </div>

                    <div className="form-group">
                      <label>Academic Year *</label>
                      <select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                        className={errors.academicYear ? 'error' : ''}
                      >
                        <option value="">Select Year</option>
                        {academicYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.academicYear && <span className="error-message">{errors.academicYear}</span>}
                    </div>
                  </div>

                  {selectedStudent && (
                    <div className="student-info-display">
                      <h5>Selected Student Details</h5>
                      <div className="student-details">
                        <div className="detail-item">
                          <label>Name:</label>
                          <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                        </div>
                        <div className="detail-item">
                          <label>Admission No:</label>
                          <span>{selectedStudent.admissionNumber}</span>
                        </div>
                        <div className="detail-item">
                          <label>Class:</label>
                          <span>{selectedStudent.class}</span>
                        </div>
                        {selectedStudent.stream && (
                          <div className="detail-item">
                            <label>Stream:</label>
                            <span>{selectedStudent.stream}</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <label>Registered Subjects:</label>
                          <span>{selectedStudent.assignedSubjects.length} subjects</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h4>Subject Scores</h4>
                  
                  <div className="subjects-header">
                    <h5>Registered Subjects ({formData.subjects.length})</h5>
                    {selectedStudent && (
                      <small className="auto-generated-hint">📚 Auto-populated from student registration</small>
                    )}
                  </div>

                  {!selectedStudent ? (
                    <div className="no-student-selected">
                      <p>Please select a student to view their registered subjects</p>
                    </div>
                  ) : (
                    <>
                      {errors.subjects && <span className="error-message">{errors.subjects}</span>}

                      <div className="subjects-grid">
                        {formData.subjects.map((subject, index) => (
                          <div key={index} className="subject-item">
                            <div className="subject-header">
                              <span className="subject-name">{subject.name}</span>
                              <button 
                                type="button" 
                                onClick={() => removeSubject(subject.name)}
                                className="btn-remove-subject"
                                title="Remove subject"
                              >
                                ×
                              </button>
                            </div>
                            <div className="score-components">
                              <div className="score-input-group">
                                <label>1st CA (20)</label>
                                <input
                                  type="number"
                                  value={subject.firstCA}
                                  onChange={(e) => handleSubjectScoreChange(subject.name, 'firstCA', e.target.value)}
                                  min="0"
                                  max="20"
                                  className="score-input ca-input"
                                  placeholder="0-20"
                                />
                              </div>
                              <div className="score-input-group">
                                <label>2nd CA (20)</label>
                                <input
                                  type="number"
                                  value={subject.secondCA}
                                  onChange={(e) => handleSubjectScoreChange(subject.name, 'secondCA', e.target.value)}
                                  min="0"
                                  max="20"
                                  className="score-input ca-input"
                                  placeholder="0-20"
                                />
                              </div>
                              <div className="score-input-group">
                                <label>Exam (60)</label>
                                <input
                                  type="number"
                                  value={subject.exam}
                                  onChange={(e) => handleSubjectScoreChange(subject.name, 'exam', e.target.value)}
                                  min="0"
                                  max="60"
                                  className="score-input exam-input"
                                  placeholder="0-60"
                                />
                              </div>
                            </div>
                            <div className="subject-total">
                              <div className="total-display">
                                <label>Total:</label>
                                <span className="total-score">{subject.total}/100</span>
                              </div>
                              <div className="grade-display">
                                <label>Grade:</label>
                                <span className="grade-badge" style={{ backgroundColor: getGradeColor(subject.grade) }}>
                                  {subject.grade}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {formData.subjects.length > 0 && (
                    <div className="result-summary">
                      <div className="summary-item">
                        <label>Total Score:</label>
                        <span>{formData.totalScore}</span>
                      </div>
                      <div className="summary-item">
                        <label>Average Score:</label>
                        <span>{formData.averageScore.toFixed(1)}</span>
                      </div>
                      <div className="summary-item">
                        <label>Grade:</label>
                        <span 
                          className="grade-badge" 
                          style={{ backgroundColor: getGradeColor(formData.grade) }}
                        >
                          {formData.grade}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h4>Additional Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Class Position</label>
                      <input
                        type="number"
                        name="classPosition"
                        value={formData.classPosition}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Position in class"
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Remarks</label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Teacher's remarks about the student's performance"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : (editingResult ? 'Update Result' : 'Add Result')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsManagement;
