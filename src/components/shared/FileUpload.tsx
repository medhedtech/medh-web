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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={`border-2 rounded-lg p-4 transition-all duration-300 relative 
          ${currentFile 
            ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20" 
            : "border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${error ? "border-red-500 dark:border-red-400" : ""}
          ${isDragActive ? "bg-blue-50 dark:bg-blue-900/10" : ""}
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
                className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l5-5m0 0l-5-5m5 5H28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                <span className="relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-semibold text-primary-600 dark:text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400 focus-within:ring-offset-2 hover:text-primary-500 dark:hover:text-primary-300">
                  Upload a file
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {accept.split(',').map(type => type.replace('/*', '')).join(', ')} files only
              </p>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
    </div>
  );
};

export default FileUpload; 