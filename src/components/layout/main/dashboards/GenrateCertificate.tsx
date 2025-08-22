"use client";
import React, { useEffect, useState } from "react";
import { FaFilter, FaSort, FaSearch, FaCalendarAlt, FaUpload, FaEye, FaDownload, FaQrcode } from "react-icons/fa";
import { FiUsers, FiUser, FiBook, FiCalendar, FiType, FiImage } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { apiUrls, apiBaseUrl } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { showToast } from "@/utils/toastManager";
import { Loader } from "lucide-react";

const CertificatePage = () => {
  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    instructorName: "",
    instructorSignature: null,
    completionDate: null,
    certificateType: "",
    qrCode: null,
  });

  // UI state
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // API hooks
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  // Instructor options
  const instructorOptions = [
    { value: "Addya Pandey", label: "Addya Pandey" },
    { value: "varisha jalil", label: "varisha jalil" }
  ];

  // Certificate type options
  const certificateTypeOptions = [
    { value: "demo certificate", label: "Demo Certificate" },
    { value: "enrollment certificate", label: "Enrollment Certificate" }
  ];

  // Fetch students and courses on component mount
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      await getQuery({
        url: `${apiBaseUrl}${apiUrls.Students.getAllStudents}?limit=1000&page=1`,
        onSuccess: (data) => {
          if (data.success && data.data && data.data.items) {
            const formattedStudents = data.data.items.map((student) => ({
              id: student._id,
              name: student.full_name,
              email: student.email,
              profileImage: student.user_image?.url || "/images/default-avatar.png"
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
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      await getQuery({
        url: apiUrls.courses.getAllCourses,
        onSuccess: (data) => {
          if (data.success && data.data && Array.isArray(data.data)) {
            const formattedCourses = data.data.map((course) => ({
              id: course._id,
              title: course.course_title,
              category: course.course_category,
              type: course.course_type || course._source || "legacy"
            }));
            setCourses(formattedCourses);
          } else {
            setCourses([]);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch courses:", error);
          setCourses([]);
        },
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file uploads
  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  // Generate certificate preview
  const generatePreview = () => {
    if (!formData.studentId || !formData.courseId || !formData.instructorName || !formData.completionDate || !formData.certificateType) {
      showToast.error("Please fill in all required fields before generating preview");
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (!selectedStudent) {
      showToast.error("Selected student not found");
      return;
    }

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    if (!selectedCourse) {
      showToast.error("Selected course not found");
      return;
    }

    const previewData = {
      studentName: selectedStudent.name,
      studentEmail: selectedStudent.email,
      courseName: selectedCourse.title,
      courseCategory: selectedCourse.category,
      instructorName: formData.instructorName,
      completionDate: formData.completionDate,
      certificateType: formData.certificateType,
      programCoordinator: "Neeraj Narain",
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      instructorSignature: formData.instructorSignature,
      qrCode: formData.qrCode
    };

    setCertificatePreview(previewData);
    setPreviewMode(true);
  };

  // Generate final certificate
  const generateCertificate = async () => {
    if (!certificatePreview) {
      showToast.error("Please generate a preview first");
      return;
    }

    setLoading(true);
    try {
      // Prepare the data payload
      const payload = {
        student_id: formData.studentId,
        course_id: formData.courseId,
        student_name: certificatePreview.studentName,
        course_name: certificatePreview.courseName,
        completion_date: formData.completionDate.toISOString(),
        instructor_name: formData.instructorName,
        certificate_type: formData.certificateType,
        program_coordinator: "Neeraj Narain",
        certificate_id: certificatePreview.certificateId,
        instructor_signature: formData.instructorSignature ? await fileToBase64(formData.instructorSignature) : null,
        qr_code: formData.qrCode ? await fileToBase64(formData.qrCode) : null
      };

      await postQuery({
        url: apiUrls.certificate.addCertificate,
        postData: payload,
        onSuccess: (data) => {
          showToast.success("Certificate generated successfully!");
          setPreviewMode(false);
          setCertificatePreview(null);
          setFormData({
            studentId: "",
            courseId: "",
            instructorName: "",
            instructorSignature: null,
            completionDate: null,
            certificateType: "",
            qrCode: null,
          });
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

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter courses based on search
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-darkblack min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Certificate Generation
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewMode(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !previewMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Generate Form
                </button>
                <button
                  onClick={() => setPreviewMode(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    previewMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Preview Mode
                </button>
              </div>
            </div>
          </div>
        </div>

        {!previewMode ? (
          /* Certificate Generation Form */
          <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generate New Certificate
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Fill in the details below to generate a certificate
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiUser className="inline mr-2" />
                  Student *
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a student</option>
                  {filteredStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiBook className="inline mr-2" />
                  Course *
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleInputChange("courseId", e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a course</option>
                  {filteredCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiUser className="inline mr-2" />
                  Instructor Name *
                </label>
                <select
                  value={formData.instructorName}
                  onChange={(e) => handleInputChange("instructorName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an instructor</option>
                  {instructorOptions.map((instructor) => (
                    <option key={instructor.value} value={instructor.value}>
                      {instructor.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor Signature Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiImage className="inline mr-2" />
                  Instructor Signature
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("instructorSignature", e.target.files[0])}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.instructorSignature && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      ✓ {formData.instructorSignature.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Program Coordinator (Fixed) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiUser className="inline mr-2" />
                  Program Coordinator
                </label>
                <input
                  type="text"
                  value="Neeraj Narain"
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Signature will be automatically added from S3
                </p>
              </div>

              {/* QR Code Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaQrcode className="inline mr-2" />
                  QR Code for Certificate ID
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("qrCode", e.target.files[0])}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.qrCode && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      ✓ {formData.qrCode.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Completion Date *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    selected={formData.completionDate}
                    onChange={(date) => handleInputChange("completionDate", date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select completion date"
                  />
                </div>
              </div>

              {/* Certificate Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiType className="inline mr-2" />
                  Certificate Type *
                </label>
                <select
                  value={formData.certificateType}
                  onChange={(e) => handleInputChange("certificateType", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select certificate type</option>
                  {certificateTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setFormData({
                      studentId: "",
                      courseId: "",
                      instructorName: "",
                      instructorSignature: null,
                      completionDate: null,
                      certificateType: "",
                      qrCode: null,
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear Form
                </button>
                <button
                  onClick={generatePreview}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader className="animate-spin h-4 w-4" /> : "Generate Preview"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Certificate Preview */
          <div className="bg-white dark:bg-inherit dark:text-whitegrey3 dark:border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Certificate Preview
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Review the certificate details before generating
              </p>
            </div>

            <div className="p-6">
              {certificatePreview ? (
                <div className="space-y-6">
                  {/* Certificate Preview Card */}
                  <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {certificatePreview.certificateType.toUpperCase()}
                      </h3>
                      <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Name:</label>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{certificatePreview.studentName}</p>
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
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments:</h4>
                      <div className="flex flex-wrap gap-2">
                        {certificatePreview.instructorSignature && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                            ✓ Instructor Signature
                          </span>
                        )}
                        {certificatePreview.qrCode && (
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                            ✓ QR Code
                          </span>
                        )}
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                          ✓ Program Coordinator Signature (S3)
                        </span>
                      </div>
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
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader className="animate-spin h-4 w-4" /> : "Generate Certificate"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;
