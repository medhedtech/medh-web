import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const CertificateGenerator = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    selectedStudent: '',
    selectedInstructor: '',
    completionDate: '',
    selectedCourse: '',
    certificateType: 'Demo Certificate',
    instructorSignature: null,
  });

  // Selected data for display
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [selectedCourseData, setSelectedCourseData] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchInstructors();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/v1/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response.data.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('/api/v1/instructors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setInstructors(response.data.data.instructors || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      // Fallback to hardcoded instructors if API fails
      setInstructors([
        { _id: '1', full_name: 'Addya Pandey' },
        { _id: '2', full_name: 'Neeraj Narain' },
      ]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/v1/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to hardcoded courses if API fails
      setCourses([
        { _id: '1', title: 'Personality Development', description: 'Personality Development' },
        { _id: '2', title: 'AI and Data Science', description: 'AI and Data Science' },
      ]);
    }
  };

  const handleStudentChange = (studentId) => {
    setFormData(prev => ({ ...prev, selectedStudent: studentId }));
    const student = students.find(s => s._id === studentId);
    setSelectedStudentData(student);
  };

  const handleCourseChange = (courseId) => {
    setFormData(prev => ({ ...prev, selectedCourse: courseId }));
    const course = courses.find(c => c._id === courseId);
    setSelectedCourseData(course);
  };

  const handleGenerateCertificate = async () => {
    if (!formData.selectedStudent || !formData.selectedCourse || !formData.completionDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const certificateData = {
        studentId: formData.selectedStudent,
        courseId: formData.selectedCourse,
        instructorId: formData.selectedInstructor,
        completionDate: formData.completionDate,
        certificateType: formData.certificateType,
        issuedDate: new Date().toISOString().split('T')[0],
        studentName: selectedStudentData?.full_name || '',
        courseName: selectedCourseData?.title || '',
        instructorName: instructors.find(i => i._id === formData.selectedInstructor)?.full_name || '',
        enrollmentId: selectedStudentData?.student_id || `MED-${Date.now()}`,
        certificateId: `CERT-${Date.now()}`,
        qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const response = await axios.post('/api/v1/certificates/generate', certificateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess('Certificate generated successfully!');
      
      // Auto-download the certificate
      setTimeout(() => {
        handleDownloadCertificate(response.data.data.certificateId);
      }, 1000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await axios.get(`/api/v1/certificates/${certificateId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const link = document.createElement('a');
      link.href = response.data.data.downloadUrl;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError('Failed to download certificate');
    }
  };

  const handlePreviewCertificate = () => {
    if (!formData.selectedStudent || !formData.selectedCourse) {
      setError('Please select student and course first');
      return;
    }
    
    // Show preview with current data
    setSuccess('Preview feature will be implemented soon!');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Generate Certificate
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Select Student */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Student*</InputLabel>
              <Select
                value={formData.selectedStudent}
                onChange={(e) => handleStudentChange(e.target.value)}
                label="Select Student*"
              >
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.full_name} ({student.email}) - {student.student_id || 'MED-' + student._id.slice(-6)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedStudentData && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  Selected: {selectedStudentData.full_name} - {selectedStudentData.email}
                </Typography>
              </Box>
            )}

            {/* Select Instructor */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Instructor*</InputLabel>
              <Select
                value={formData.selectedInstructor}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedInstructor: e.target.value }))}
                label="Select Instructor*"
              >
                {instructors.map((instructor) => (
                  <MenuItem key={instructor._id} value={instructor._id}>
                    {instructor.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Completion Date */}
            <TextField
              fullWidth
              label="Completion Date*"
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Select Course */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Course*</InputLabel>
              <Select
                value={formData.selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
                label="Select Course*"
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.title} ({course.description || course.title})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCourseData && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                  Selected: {selectedCourseData.title}
                </Typography>
              </Box>
            )}

            {/* Certificate Type */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Certificate Type</InputLabel>
              <Select
                value={formData.certificateType}
                onChange={(e) => setFormData(prev => ({ ...prev, certificateType: e.target.value }))}
                label="Certificate Type"
              >
                <MenuItem value="Demo Certificate">Demo Certificate</MenuItem>
                <MenuItem value="Blended Certificate">Blended Certificate</MenuItem>
                <MenuItem value="Live Interaction Certificate">Live Interaction Certificate</MenuItem>
              </Select>
            </FormControl>

            {/* Instructor Signature */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Instructor Signature (Optional)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="signature-file"
                type="file"
                onChange={(e) => setFormData(prev => ({ ...prev, instructorSignature: e.target.files[0] }))}
              />
              <label htmlFor="signature-file">
                <Button variant="outlined" component="span" fullWidth>
                  {formData.instructorSignature ? formData.instructorSignature.name : 'Choose File'}
                </Button>
              </label>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                If not uploaded, will use default signature for selected instructor
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Program Coordinator Section */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Program Coordinator
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2"><strong>Name:</strong> Neeraj Narain</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2"><strong>Signature:</strong> Will be automatically added from signature library</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<ViewIcon />}
            onClick={handlePreviewCertificate}
            disabled={loading}
          >
            Generate Preview
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <PersonIcon />}
            onClick={handleGenerateCertificate}
            disabled={loading || !formData.selectedStudent || !formData.selectedCourse || !formData.completionDate}
            sx={{ 
              bgcolor: 'orange.main', 
              '&:hover': { bgcolor: 'orange.dark' },
              color: 'white'
            }}
          >
            {loading ? 'Generating...' : 'Create Demo Enrollment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CertificateGenerator;
