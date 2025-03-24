import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (file: File) => Promise<void>;
  currentFile: string | null;
  error?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onFileSelect,
  currentFile,
  error,
  required
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { [accept]: [] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        await onFileSelect(acceptedFiles[0]);
      }
    }
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={`border-2 rounded-lg p-4 transition-all duration-300 relative 
          ${currentFile ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-gray-400"}
          ${error ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {currentFile ? (
            <div className="relative">
              <img
                src={currentFile}
                alt="Preview"
                className="mx-auto h-32 w-auto rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null as any);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <span className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                  Upload a file
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {accept.split(',').map(type => type.replace('/*', '')).join(', ')} files only
              </p>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default FileUpload; 