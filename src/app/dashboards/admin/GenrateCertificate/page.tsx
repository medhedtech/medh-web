"use client";
import React, { useState, useEffect } from 'react';
import { FaUpload, FaEye, FaDownload, FaQrcode, FaUser, FaBook, FaCalendar, FaSignature } from 'react-icons/fa';
import { apiUrls, apiBaseUrl } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { showToast } from "@/utils/toastManager";
import { Loader } from "lucide-react";

const AdminGenerateCertificate = () => {
  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    instructorName: "",
    instructorSignature: null,
    completionDate: new Date(),
    certificateType: "demo certificate",
  });

  // UI state
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [demoEnrollment, setDemoEnrollment] = useState(null);

  // API hooks
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Instructor options
  const instructorOptions = [
    { value: "Addya Pandey", label: "Addya Pandey" },
    { value: "Varisha Jalil", label: "Varisha Jalil" }
  ];

  // Certificate type options
  const certificateTypeOptions = [
    { value: "demo certificate", label: "Demo Certificate" },
    { value: "enrollment certificate", label: "Enrollment Certificate" }
  ];

  // Program coordinator (fixed)
  const programCoordinator = "Neeraj Narain";

  // Signature URLs (you can replace these with actual signature images)
  const signatureUrls = {
    "Addya Pandey": "/images/signatures/addya-pandey-signature.png",
    "Varisha Jalil": "/images/signatures/varisha-jalil-signature.png",
    "Neeraj Narain": "/images/signatures/neeraj-narain-signature.png"
  };

  // Fetch courses and students on component mount
  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses from:", apiUrls.courses.getAllCourses);
      
      const response = await getQuery({
        url: apiUrls.courses.getAllCourses,
        requireAuth: false, // Public route, no auth needed
        onSuccess: (data) => {
                    console.log("Courses API success:", data);
        },
        onFail: (error) => {
          console.error("Failed to fetch courses:", error);
          setCourses([]);
        },
      });

      console.log("Courses response:", response);

      if (response?.data) {
        const coursesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [];
        
        console.log("Courses data:", coursesData);
        
        const formattedCourses = coursesData.map((course) => ({
          id: course._id,
          title: course.course_title,
          category: course.course_category,
          type: course.course_type || "legacy"
        }));
        
        console.log("Formatted courses:", formattedCourses);
        setCourses(formattedCourses);
      } else {
        console.log("No courses data found");
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const fetchStudents = async () => {
    try {
      await getQuery({
        url: apiUrls.user.getAllStudents,
        onSuccess: (data) => {
          if (data.success && data.data && Array.isArray(data.data)) {
            const formattedStudents = data.data.map((student) => ({
              id: student._id,
              name: student.full_name,
              email: student.email,
              studentId: student.student_id,
              phone: student.phone_number
            }));
            setStudents(formattedStudents);
          } else {
            setStudents([]);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch students:", error);
          setStudents([]);
        },
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update selected course when dropdown changes
    if (field === 'courseId') {
      const course = courses.find(c => c.id === value);
      setSelectedCourse(course);
    }

    // Update selected student when dropdown changes
    if (field === 'studentId') {
      const student = students.find(s => s.id === value);
      setSelectedStudent(student);
    }
  };

  // Handle file uploads
  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

    // Create demo enrollment
  const createDemoEnrollment = async () => {
    if (!formData.studentId || !formData.courseId) {
      showToast.error("Please select a student and course");
      return;
    }

    if (!selectedStudent) {
      showToast.error("Selected student not found");
      return;
    }

    setLoading(true);
    try {
      const enrollmentData = {
        studentName: selectedStudent.name,
        studentEmail: selectedStudent.email,
        courseTitle: selectedCourse?.title || "Demo Course",
        courseDuration: "30 days",
        finalScore: 85,
        completionDate: formData.completionDate.toISOString()
      };

             await postQuery({
         url: `${apiBaseUrl}/certificates/demo-enrollment`,
         postData: enrollmentData,
        onSuccess: (data) => {
          setDemoEnrollment(data.data);
          showToast.success("Demo enrollment created successfully!");
        },
        onFail: (error) => {
          console.error("Failed to create demo enrollment:", error);
          showToast.error(error.message || "Failed to create demo enrollment");
        },
      });
    } catch (error) {
      console.error("Error creating demo enrollment:", error);
      showToast.error("Error creating demo enrollment");
    } finally {
      setLoading(false);
    }
  };

  // Generate certificate preview
  const generatePreview = async () => {
    if (!formData.studentId || !formData.courseId || !formData.instructorName || !formData.completionDate || !formData.certificateType) {
      showToast.error("Please fill in all required fields before generating preview");
      return;
    }

    if (!selectedStudent) {
      showToast.error("Selected student not found");
      return;
    }

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    if (!selectedCourse) {
      showToast.error("Selected course not found");
      return;
    }

    // Create demo enrollment first if not exists
    if (!demoEnrollment) {
      await createDemoEnrollment();
      return;
    }

    // Generate certificate ID
    const certificateId = `CERT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const enrollmentId = `MEDH-CERT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Get signature URLs
    const instructorSignatureUrl = formData.instructorSignature ? await fileToBase64(formData.instructorSignature) : signatureUrls[formData.instructorName];
    const coordinatorSignatureUrl = signatureUrls[programCoordinator];

    // Create preview data
    const previewData = {
      studentName: selectedStudent.name,
      studentEmail: selectedStudent.email,
      courseName: selectedCourse.title,
      courseCategory: selectedCourse.category,
      instructorName: formData.instructorName,
      programCoordinator: programCoordinator,
      completionDate: formData.completionDate,
      certificateType: formData.certificateType,
      certificateId: certificateId,
      enrollmentId: enrollmentId,
      instructorSignature: instructorSignatureUrl,
      coordinatorSignature: coordinatorSignatureUrl,
      qrCode: null // Will be generated by backend
    };

    setCertificatePreview(previewData);
    setPreviewMode(true);
  };

  // Generate final certificate
  const generateCertificate = async () => {
    if (!certificatePreview || !demoEnrollment) {
      showToast.error("Please generate a preview first");
      return;
    }

    setLoading(true);
    try {
      // Use the demo certificate endpoint
      const payload = {
        student_id: demoEnrollment.student.id,
        course_id: formData.courseId,
        enrollment_id: demoEnrollment.enrollment.id,
        course_name: certificatePreview.courseName,
        full_name: selectedStudent.name,
        instructor_name: formData.instructorName,
        date: formData.completionDate.toISOString(),
        instructor_signature: certificatePreview.instructorSignature,
        coordinator_signature: certificatePreview.coordinatorSignature,
      };

             await postQuery({
         url: `${apiBaseUrl}/certificates/demo`,
         postData: payload,
        onSuccess: (data) => {
          showToast.success("Certificate generated successfully!");
          
          // Download the certificate PDF
          if (data.data?.certificate?.certificateUrl) {
            const link = document.createElement('a');
            link.href = data.data.certificate.certificateUrl;
            link.download = `MEDH-Certificate-${selectedStudent.name}-${certificatePreview.courseName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          
          setPreviewMode(false);
          setCertificatePreview(null);
          setDemoEnrollment(null);
                     setFormData({
             studentId: "",
             courseId: "",
             instructorName: "",
             instructorSignature: null,
             completionDate: new Date(),
             certificateType: "demo certificate",
           });
           setSelectedCourse(null);
           setSelectedStudent(null);
        },
        onFail: (error) => {
          console.error("Failed to generate certificate:", error);
          showToast.error("Failed to generate certificate. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      showToast.error("Error generating certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Generate Certificate
        </h1>

        {!previewMode ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Student Selection */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   <FaUser className="inline mr-2" />
                   Select Student *
                 </label>
                 <select
                   value={formData.studentId}
                   onChange={(e) => handleInputChange('studentId', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                 >
                   <option value="">Choose a student...</option>
                   {students.map((student) => (
                     <option key={student.id} value={student.id}>
                       {student.name} ({student.email}) - {student.studentId}
                     </option>
                   ))}
                 </select>
                 {selectedStudent && (
                   <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                     <p className="text-sm text-blue-800 dark:text-blue-200">
                       Selected: {selectedStudent.name} - {selectedStudent.email}
                     </p>
                   </div>
                 )}
               </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaBook className="inline mr-2" />
                  Select Course *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleInputChange('courseId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.category})
                    </option>
                  ))}
                </select>
                {selectedCourse && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900 rounded">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Selected: {selectedCourse.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Instructor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  Select Instructor *
                </label>
                <select
                  value={formData.instructorName}
                  onChange={(e) => handleInputChange('instructorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                >
                  <option value="">Choose an instructor...</option>
                  {instructorOptions.map((instructor) => (
                    <option key={instructor.value} value={instructor.value}>
                      {instructor.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Certificate Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaBook className="inline mr-2" />
                  Certificate Type *
                </label>
                <select
                  value={formData.certificateType}
                  onChange={(e) => handleInputChange('certificateType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                >
                  {certificateTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Completion Date *
                </label>
                <input
                  type="date"
                  value={formData.completionDate.toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('completionDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
              </div>

              {/* Instructor Signature Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaSignature className="inline mr-2" />
                  Instructor Signature (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('instructorSignature', e.target.files[0])}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  />
                  {formData.instructorSignature && (
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      ✓ Uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  If not uploaded, will use default signature for selected instructor
                </p>
              </div>
            </div>

            {/* Program Coordinator Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Program Coordinator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Name:</strong> {programCoordinator}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Signature:</strong> Will be automatically added from signature library
              </p>
            </div>

            {/* Demo Enrollment Status */}
            {demoEnrollment && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ Demo Enrollment Created
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  <strong>Student ID:</strong> {demoEnrollment.student.id}
                </p>
                <p className="text-green-800 dark:text-green-200">
                  <strong>Enrollment ID:</strong> {demoEnrollment.enrollment.id}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              {!demoEnrollment && (
                               <button
                 onClick={createDemoEnrollment}
                 disabled={loading || !formData.studentId || !formData.courseId}
                 className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
               >
                 {loading ? <Loader className="animate-spin mr-2" size={20} /> : <FaUser className="mr-2" />}
                 Create Demo Enrollment
               </button>
             )}
             <button
               onClick={generatePreview}
               disabled={loading || !formData.studentId || !formData.courseId || !formData.instructorName || !formData.certificateType || !demoEnrollment}
               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
             >
                <FaEye className="mr-2" />
                Generate Preview
              </button>
            </div>
          </div>
        ) : (
          /* Certificate Preview */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Certificate Preview
              </h2>
              <button
                onClick={() => setPreviewMode(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                ← Back to Form
              </button>
            </div>

            {certificatePreview ? (
              <div className="space-y-6">
                {/* Certificate Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Name:</label>
                      <p className="text-gray-900 dark:text-white">{certificatePreview.studentName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Email:</label>
                      <p className="text-gray-900 dark:text-white">{certificatePreview.studentEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Course:</label>
                      <p className="text-gray-900 dark:text-white">{certificatePreview.courseName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Category:</label>
                      <p className="text-gray-900 dark:text-white">{certificatePreview.courseCategory}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Instructor:</label>
                      <p className="text-gray-900 dark:text-white">{certificatePreview.instructorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Program Coordinator:</label>
                      <p className="text-gray-900 dark:text-white">{certificatePreview.programCoordinator}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Date:</label>
                      <p className="text-gray-900 dark:text-white">
                        {certificatePreview.completionDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificate ID:</label>
                      <p className="text-sm font-mono text-gray-900 dark:text-white">{certificatePreview.certificateId}</p>
                    </div>
                  </div>
                </div>

                {/* File Attachments */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {certificatePreview.instructorSignature && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                        ✓ Instructor Signature
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      ✓ Program Coordinator Signature
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      ✓ QR Code (Auto-generated)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back to Form
                  </button>
                  <button
                    onClick={generateCertificate}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaDownload className="mr-2" />
                        Generate Certificate
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Preview Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Fill in the form and click "Generate Preview" to see the certificate preview.
                </p>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Form
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGenerateCertificate;
