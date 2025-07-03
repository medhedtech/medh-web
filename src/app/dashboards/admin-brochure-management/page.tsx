"use client";

import React, { useState, useEffect } from 'react';
import { brochureAPI, IBrochure, IBrochuresResponse, IBrochureResponse } from '@/apis/broucher';
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

  const cardClasses = buildAdvancedComponent.glassCard({ variant: 'primary', hover: false });
  const buttonClasses = buildComponent.button('primary', 'md');
  const inputClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

  useEffect(() => {
    fetchBrochures();
  }, []);

  const fetchBrochures = async () => {
    try {
      setLoading(true);
      const response: IApiResponse<IBrochuresResponse> = await brochureAPI.getAllBrochures();
      if (response.data?.data?.brochures) {
        setBrochures(response.data.data.brochures);
      } else {
        setError(response.message ?? 'Failed to fetch brochures');
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch brochures');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateBrochure = async () => {
    try {
      if (currentBrochure) {
        // Update existing brochure
        const response: IApiResponse<IBrochureResponse> = await brochureAPI.updateBrochure(currentBrochure._id, form);
        if (response.data?.data?.brochure) {
          setBrochures(brochures.map(b => b._id === currentBrochure._id ? response.data.data.brochure : b));
        } else {
          setError(response.message ?? 'Failed to update brochure');
        }
      } else {
        // Create new brochure
        const response: IApiResponse<IBrochureResponse> = await brochureAPI.createBrochure(form);
        if (response.data?.data?.brochure) {
          setBrochures([...brochures, response.data.data.brochure]);
        } else {
          setError(response.message ?? 'Failed to create brochure');
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message ?? 'Failed to save brochure');
    }
  };

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

  if (loading) return <div className="text-center py-10">Loading brochures...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Brochure Management</h1>

      <div className="flex justify-end mb-4">
        <button onClick={openCreateModal} className={buttonClasses}>
          <MdAdd className="inline-block mr-2" /> Add New Brochure
        </button>
      </div>

      <div className={`${cardClasses} p-6`}>
        {brochures.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No brochures found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Associated Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {brochures.map((brochure) => (
                  <tr key={brochure._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {brochure.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {brochure.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {brochure.courseName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(brochure)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3"
                        title="Edit"
                      >
                        <MdEdit className="inline-block" size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteBrochure(brochure._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600 mr-3"
                        title="Delete"
                      >
                        <MdDelete className="inline-block" size={20} />
                      </button>
                      <button
                        onClick={() => handleDownloadBrochure(brochure.courseId || 'default')}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600"
                        title="Download"
                      >
                        <MdDownload className="inline-block" size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-8 border shadow-lg rounded-md bg-white dark:bg-gray-800 w-96">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
              {currentBrochure ? 'Edit Brochure' : 'Add New Brochure'}
            </h3>
            <div className="mt-2">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className={inputClasses}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  className={inputClasses}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  File URL
                </label>
                <input
                  type="text"
                  id="fileUrl"
                  className={inputClasses}
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course ID (Optional)
                </label>
                <input
                  type="text"
                  id="courseId"
                  className={inputClasses}
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className={`${buttonClasses} sm:col-start-2`}
                onClick={handleCreateOrUpdateBrochure}
              >
                {currentBrochure ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrochureManagementPage;
