import React from 'react';
import { PlusCircle, Trash2, Upload, File } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const AssignmentBuilder = ({ assignment, onChange }) => {
  const handleResourceUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newResources = await Promise.all(files.map(async (file) => {
      return {
        id: `resource_${uuidv4()}`,
        title: file.name,
        fileUrl: URL.createObjectURL(file),
        filename: file.name,
        mimeType: file.type,
        size: file.size
      };
    }));

    onChange({
      ...assignment,
      resources: [...(assignment.resources || []), ...newResources]
    });
  };

  const handleRemoveResource = (resourceId) => {
    onChange({
      ...assignment,
      resources: assignment.resources.filter(resource => resource.id !== resourceId)
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <input
            type="text"
            value={assignment.title}
            onChange={(e) => onChange({ ...assignment, title: e.target.value })}
            className="text-xl font-semibold w-full mb-2"
            placeholder="Assignment Title"
          />
          <textarea
            value={assignment.description}
            onChange={(e) => onChange({ ...assignment, description: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="Assignment Description"
            rows="3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            value={assignment.maxScore}
            onChange={(e) => onChange({ ...assignment, maxScore: parseInt(e.target.value) })}
            className="w-24 text-center p-2 border rounded-md"
            placeholder="Max Score"
          />
          <input
            type="datetime-local"
            value={assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => onChange({ ...assignment, dueDate: e.target.value })}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Instructions</h3>
        <textarea
          value={assignment.instructions}
          onChange={(e) => onChange({ ...assignment, instructions: e.target.value })}
          className="w-full p-2 border rounded-md"
          placeholder="Detailed instructions for the assignment..."
          rows="6"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Resources</h3>
          <label className="flex items-center gap-2 text-customGreen hover:text-green-700 cursor-pointer">
            <PlusCircle className="w-5 h-5" />
            <span>Add Resource</span>
            <input
              type="file"
              multiple
              onChange={handleResourceUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2">
          {assignment.resources?.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(resource.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveResource(resource.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentBuilder; 