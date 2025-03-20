import React, { useState } from 'react';
import { PlusCircle, Trash2, File, Upload, Video, Link as LinkIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ResourceBuilder = ({ resources = [], onChange }) => {
  const [uploadType, setUploadType] = useState('pdf');

  const validatePdfUrl = (url) => {
    return /\.pdf($|\?|#)/.test(url) || 
           /\/pdf\//.test(url) || 
           /documents.*\.amazonaws\.com/.test(url) ||
           /drive\.google\.com/.test(url) ||
           /dropbox\.com/.test(url);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newResources = await Promise.all(files.map(async (file) => {
      const isVideo = file.type.startsWith('video/');
      const isPdf = file.type === 'application/pdf';
      
      // Basic resource object
      const resource = {
        id: `resource_${uuidv4()}`,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        type: isVideo ? 'video' : (isPdf ? 'pdf' : 'other'),
        url: URL.createObjectURL(file),
        description: '',
        size_mb: file.size / (1024 * 1024), // Convert to MB
        upload_date: new Date().toISOString()
      };

      // Add PDF-specific fields
      if (isPdf) {
        // In a real app, you might want to use a PDF.js to get the page count
        resource.pages = null; // This would need to be determined
      }

      return resource;
    }));

    onChange([...resources, ...newResources]);
  };

  const handleUrlResource = () => {
    const resource = {
      id: `resource_${uuidv4()}`,
      title: '',
      type: uploadType,
      url: '',
      description: '',
      size_mb: null,
      pages: null,
      upload_date: new Date().toISOString()
    };

    onChange([...resources, resource]);
  };

  const handleUpdateResource = (index, field, value) => {
    const updatedResources = [...resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value
    };

    // Validate PDF URLs
    if (field === 'url' && updatedResources[index].type === 'pdf') {
      if (!validatePdfUrl(value)) {
        alert('Invalid PDF URL. URL must end with .pdf or be from a supported cloud storage provider.');
        return;
      }
    }

    onChange(updatedResources);
  };

  const handleRemoveResource = (index) => {
    const updatedResources = resources.filter((_, i) => i !== index);
    onChange(updatedResources);
  };

  const formatFileSize = (size) => {
    if (!size) return 'Unknown size';
    return `${size.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Resources</h3>
        <div className="flex items-center gap-4">
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="pdf">PDF Document</option>
            <option value="video">Video</option>
            <option value="link">External Link</option>
          </select>
          {uploadType === 'link' ? (
            <button
              type="button"
              onClick={handleUrlResource}
              className="flex items-center gap-2 text-customGreen hover:text-green-700"
            >
              <PlusCircle className="w-5 h-5" />
              Add URL Resource
            </button>
          ) : (
            <label className="flex items-center gap-2 text-customGreen hover:text-green-700 cursor-pointer">
              <PlusCircle className="w-5 h-5" />
              <span>Upload {uploadType.toUpperCase()}</span>
              <input
                type="file"
                accept={uploadType === 'pdf' ? '.pdf' : 'video/*'}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div
            key={resource.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {resource.type === 'pdf' && <File className="w-8 h-8 text-red-500" />}
                {resource.type === 'video' && <Video className="w-8 h-8 text-blue-500" />}
                {resource.type === 'link' && <LinkIcon className="w-8 h-8 text-purple-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => handleUpdateResource(index, 'title', e.target.value)}
                      className="w-full text-lg font-medium mb-2"
                      placeholder="Resource Title"
                    />
                    <textarea
                      value={resource.description}
                      onChange={(e) => handleUpdateResource(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      placeholder="Resource Description"
                      rows="2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(index)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="url"
                    value={resource.url}
                    onChange={(e) => handleUpdateResource(index, 'url', e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="Resource URL"
                  />
                  {resource.type === 'pdf' && (
                    <div className="flex gap-4">
                      <input
                        type="number"
                        value={resource.pages || ''}
                        onChange={(e) => handleUpdateResource(index, 'pages', parseInt(e.target.value))}
                        className="w-24 p-2 border rounded-md text-sm"
                        placeholder="Pages"
                      />
                      <input
                        type="number"
                        value={resource.size_mb || ''}
                        onChange={(e) => handleUpdateResource(index, 'size_mb', parseFloat(e.target.value))}
                        className="w-24 p-2 border rounded-md text-sm"
                        placeholder="Size (MB)"
                        step="0.01"
                        min="0"
                        max="50"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  {resource.size_mb && <span className="mr-4">Size: {formatFileSize(resource.size_mb)}</span>}
                  {resource.pages && <span>Pages: {resource.pages}</span>}
                  <span className="ml-4">Added: {new Date(resource.upload_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceBuilder; 