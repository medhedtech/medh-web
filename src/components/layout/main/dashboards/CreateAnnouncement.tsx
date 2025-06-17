"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Save, 
  Send, 
  X, 
  Plus, 
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Eye,
  Globe
} from 'lucide-react';
import {
  createAnnouncement,
  IAnnouncementCreateInput,
  TAnnouncementType,
  TAnnouncementPriority,
  TAnnouncementStatus,
  TTargetAudience,
  validateAnnouncementData
} from '@/apis/announcements';
import { toast } from 'sonner';

const CreateAnnouncement: React.FC = () => {
  const [formData, setFormData] = useState<IAnnouncementCreateInput>({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    status: 'draft',
    targetAudience: ['all'],
    isSticky: false,
    tags: [],
    metadata: {
      sendNotification: false,
      emailNotification: false,
      pushNotification: false
    }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [preview, setPreview] = useState<boolean>(false);

  // Handle form field changes
  const handleChange = (field: keyof IAnnouncementCreateInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle metadata changes
  const handleMetadataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Handle target audience changes
  const handleAudienceChange = (audience: TTargetAudience) => {
    const currentAudiences = formData.targetAudience || [];
    
    if (audience === 'all') {
      setFormData(prev => ({ ...prev, targetAudience: ['all'] }));
    } else {
      const filteredAudiences = currentAudiences.filter(a => a !== 'all');
      if (filteredAudiences.includes(audience)) {
        const newAudiences = filteredAudiences.filter(a => a !== audience);
        setFormData(prev => ({ 
          ...prev, 
          targetAudience: newAudiences.length === 0 ? ['all'] : newAudiences 
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          targetAudience: [...filteredAudiences, audience] 
        }));
      }
    }
  };

  // Handle tag management
  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const validation = validateAnnouncementData(formData);
    
    if (!validation.isValid) {
      const newErrors: {[key: string]: string} = {};
      validation.errors.forEach(error => {
        const field = error.toLowerCase().includes('title') ? 'title' : 
                     error.toLowerCase().includes('content') ? 'content' : 'general';
        newErrors[field] = error;
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  // Handle form submission
  const handleSubmit = async (status: TAnnouncementStatus = 'draft') => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = { ...formData, status };
      const response = await createAnnouncement(submitData);
      
      if (response.status === 'success') {
        showToast.success(`Announcement ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
        
        // Reset form or redirect
        if (status === 'published') {
          window.location.href = '/dashboards/admin/announcements';
        } else {
          // Reset form for new announcement
          setFormData({
            title: '',
            content: '',
            type: 'general',
            priority: 'medium',
            status: 'draft',
            targetAudience: ['all'],
            isSticky: false,
            tags: [],
            metadata: {
              sendNotification: false,
              emailNotification: false,
              pushNotification: false
            }
          });
        }
      } else {
        throw new Error(response.error || 'Failed to create announcement');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Audience options
  const audienceOptions: { value: TTargetAudience; label: string; description: string }[] = [
    { value: 'all', label: 'Everyone', description: 'All users in the system' },
    { value: 'students', label: 'Students', description: 'All enrolled students' },
    { value: 'instructors', label: 'Instructors', description: 'All course instructors' },
    { value: 'admins', label: 'Admins', description: 'Administrative staff' },
    { value: 'corporate', label: 'Corporate', description: 'Corporate clients' },
    { value: 'parents', label: 'Parents', description: 'Student parents/guardians' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Announcement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and publish announcements for your platform users
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {preview ? 'Edit' : 'Preview'}
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboards/admin/announcements'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {preview ? (
        /* Preview Mode */
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
          
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                formData.type === 'course' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                formData.type === 'system' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                formData.type === 'event' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {formData.title || 'Announcement Title'}
                  </h4>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    formData.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {formData.priority}
                  </span>
                  
                  {formData.isSticky && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Sticky
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {formData.content || 'Announcement content will appear here...'}
                </p>
                
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            
            <button
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      ) : (
        /* Form Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter announcement title..."
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Enter announcement content..."
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical ${
                      errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value as TAnnouncementType)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="general">General</option>
                      <option value="course">Course</option>
                      <option value="system">System</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="feature">Feature</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange('priority', e.target.value as TAnnouncementPriority)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Target Audience
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {audienceOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.targetAudience?.includes(option.value)}
                      onChange={() => handleAudienceChange(option.value)}
                      className="mt-1 w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Settings
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isSticky}
                    onChange={(e) => handleChange('isSticky', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Sticky Announcement
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Pin to top of announcements
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notifications
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.metadata?.sendNotification}
                    onChange={(e) => handleMetadataChange('sendNotification', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Send Notification
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Notify users when published
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.metadata?.emailNotification}
                    onChange={(e) => handleMetadataChange('emailNotification', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Notification
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Send email to target audience
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.metadata?.pushNotification}
                    onChange={(e) => handleMetadataChange('pushNotification', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Push Notification
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Send push notification
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>
                
                <button
                  onClick={() => handleSubmit('published')}
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAnnouncement; 