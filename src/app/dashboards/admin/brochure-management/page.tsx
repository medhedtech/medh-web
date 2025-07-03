"use client";

import React, { useState, useEffect } from 'react';
import { brochureAPI, IBrochure, IBrochuresResponse, IBrochureResponse } from '@/apis/broucher';
import { uploadCourseBrochure, getCourseBrochures } from '@/apis/broucher';
import { IApiResponse } from '@/apis/apiClient';
import { MdAdd, MdEdit, MdDelete, MdDownload } from 'react-icons/md';
import { buildAdvancedComponent, buildComponent } from '@/utils/designSystem';

const AdminBrochureManagementPage: React.FC = () => {
  const [brochures, setBrochures] = useState<IBrochure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentBrochure, setCurrentBrochure] = useState<IBrochure | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    courseId: '',
  });

  // New state for course selection and brochure upload
  const [courses, setCourses] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [courseBrochures, setCourseBrochures] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const cardClasses = buildAdvancedComponent.glassCard({ variant: 'primary', hover: false });
  const buttonClasses = buildComponent.button('primary', 'md');
  const inputClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

  useEffect(() => {
    fetchBrochures();
  }, []);

  useEffect(() => {
    // TODO: Replace with real API call to fetch courses
    setCourses([
      { _id: 'course1', name: 'Python Bootcamp' },
      { _id: 'course2', name: 'Data Science 101' },
    ]);
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const token = localStorage.getItem('token') || '';
    setLoading(true);
    getCourseBrochures(selectedCourseId, token)
      .then((res: { data?: { brochures?: string[] } }) => {
        setCourseBrochures(res.data?.brochures || []);
        setError(null);
      })
      .catch((err: { message?: string }) => {
        setError(err.message || 'Failed to fetch brochures');
        setCourseBrochures([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCourseId]);

  const handleDeleteBrochure = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brochure?')) {
      try {
        const response: IApiResponse<{ message: string }> = await brochureAPI.deleteBrochure(id);
        if (response.message === 'Brochure deleted successfully') {
          setBrochures(brochures.filter(b => b._id !== id));
        } else {
          setError(response.message ?? 'Failed to delete brochure');
        }
      } catch (err: any) {
        setError(err.message ?? 'Failed to delete brochure');
      }
    }
  };

  const handleDownloadBrochure = async (courseId: string) => {
    try {
      const response: IApiResponse<{ message: string; downloadUrl: string }> = await brochureAPI.downloadBrochure(courseId);
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      } else {
        setError(response.message ?? 'Failed to get download URL');
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to initiate download');
    }
  };

  const openCreateModal = () => {
    setCurrentBrochure(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (brochure: IBrochure) => {
    setCurrentBrochure(brochure);
    setForm({
      title: brochure.title,
      description: brochure.description || '',
      fileUrl: brochure.fileUrl,
      courseId: brochure.courseId || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      fileUrl: '',
      courseId: '',
    });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  // Handle brochure upload
  const handleUpload = async () => {
    if (!selectedCourseId || !selectedFile) {
      setUploadError('Please select a course and a PDF file.');
      return;
    }
    if (selectedFile.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    const token = localStorage.getItem('token') || '';
    try {
      const res: { success?: boolean; message?: string } = await uploadCourseBrochure(selectedCourseId, selectedFile, token);
      if (res.success) {
        setUploadSuccess('Brochure uploaded successfully!');
        // Refresh brochure list
        const updated: { data?: { brochures?: string[] } } = await getCourseBrochures(selectedCourseId, token);
        setCourseBrochures(updated.data?.brochures || []);
        setSelectedFile(null);
      } else {
        setUploadError(res.message || 'Upload failed.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading brochures...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Course Brochure Management</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Course</label>
        <select
          className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-gray-100"
          value={selectedCourseId}
          onChange={e => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Select a course --</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.name}</option>
          ))}
        </select>
      </div>
      {selectedCourseId && (
        <div className="mb-8">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Upload Brochure (PDF only)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Selected:</span> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="mt-3 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {uploadError && <div className="mt-2 text-red-500">{uploadError}</div>}
            {uploadSuccess && <div className="mt-2 text-green-600">{uploadSuccess}</div>}
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Current Brochure(s)</h2>
            {loading ? (
              <div>Loading brochures...</div>
            ) : courseBrochures.length === 0 ? (
              <div className="text-gray-500">No brochures uploaded yet.</div>
            ) : (
              <ul className="space-y-2">
                {courseBrochures.map((url, idx) => (
                  <li key={url} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded p-3 shadow border border-gray-100 dark:border-gray-700">
                    <span className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-medium">PDF</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{url.split('/').pop()}</a>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="ml-auto px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Download</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrochureManagementPage;
