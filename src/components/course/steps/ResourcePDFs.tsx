import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle, Upload, FileText, AlertCircle } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { apiUrls, apiBaseUrl } from "@/apis";
import { useUpload, UploadError } from "@/hooks/useUpload";
import axios from 'axios';
import { getAuthToken, isAuthenticated } from '@/utils/auth';

interface ResourcePDFsProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

interface ResourcePDF {
  title: string;
  url: string;
  description: string;
  size_mb?: number;
  pages?: number;
  upload_date?: string;
  category?: string;
}

const PDF_CATEGORIES = [
  'Course Materials',
  'Worksheets',
  'Practice Exercises',
  'Reference Guides',
  'Case Studies',
  'Templates',
  'Additional Reading'
];

const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB in bytes

const isValidPdfUrl = (url: any): boolean => {
  if (!url || typeof url !== 'string') return false;
  const urlString = url.toLowerCase();
  return urlString.endsWith('.pdf') || 
         urlString.includes('drive.google.com') || 
         urlString.includes('amazonaws.com');
};

const validatePdfResource = (pdf: Partial<ResourcePDF>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!pdf.title?.trim()) {
    errors.push('PDF title is required');
  }

  if (!pdf.url) {
    errors.push('PDF URL is required');
  } else if (!isValidPdfUrl(pdf.url)) {
    errors.push('Invalid PDF URL. It must end with .pdf or be from a supported provider.');
  }

  if (typeof pdf.size_mb === 'number') {
    if (pdf.size_mb < 0) {
      errors.push('PDF size cannot be negative');
    }
    if (pdf.size_mb > 50) {
      errors.push('PDF size cannot exceed 50MB');
    }
  }

  if (typeof pdf.pages === 'number' && pdf.pages < 1) {
    errors.push('PDF must have at least 1 page');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const ResourcePDFs: React.FC<ResourcePDFsProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [showContent, setShowContent] = React.useState(false);
  const [pdfs, setPdfs] = React.useState<ResourcePDF[]>([]);
  const [uploadingIndex, setUploadingIndex] = React.useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [validationErrors, setValidationErrors] = React.useState<{ [key: number]: string[] }>({});
  
  // Initialize useUpload hook with PDF-specific options
  const { 
    uploadFile, 
    isUploading, 
    progress, 
    error: uploadError,
    validateFile 
  } = useUpload({
    maxFileSize: MAX_PDF_SIZE,
    allowedMimeTypes: {
      'application/pdf': '.pdf'
    },
    showToast: false,
    debug: true,
    formConfig: {
      useFormData: true,
      fieldName: 'file',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }
  });

  // Update form data whenever PDFs change
  React.useEffect(() => {
    // Validate all PDFs before updating form
    const newValidationErrors: { [key: number]: string[] } = {};
    let hasErrors = false;

    pdfs.forEach((pdf, index) => {
      const { isValid, errors } = validatePdfResource(pdf);
      if (!isValid) {
        newValidationErrors[index] = errors;
        hasErrors = true;
      }
    });

    setValidationErrors(newValidationErrors);

    // Only update form if all PDFs are valid
    if (!hasErrors) {
      setValue('resource_pdfs', pdfs);
    }
  }, [pdfs, setValue]);

  const handleFileUpload = async (file: File, index: number) => {
    try {
      // Check authentication first
      if (!isAuthenticated()) {
        toast.error('Your session has expired. Please login again.');
        return;
      }

      // Get auth token
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      setUploadingIndex(index);
      setUploadProgress(0);

      // Additional file validation
      if (!file || !(file instanceof File)) {
        throw new UploadError('Invalid file object', 'INVALID_FILE');
      }

      // Validate file size and type
      if (file.size > MAX_PDF_SIZE) {
        throw new UploadError(`File size must be less than ${MAX_PDF_SIZE / (1024 * 1024)}MB`, 'FILE_TOO_LARGE');
      }

      if (file.type !== 'application/pdf') {
        throw new UploadError('Only PDF files are allowed', 'INVALID_FILE_TYPE');
      }

      try {
        // Convert file to base64 with proper data URL prefix
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Keep the complete data URL format
            resolve(result); // This will include the "data:application/pdf;base64," prefix
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        // Send the base64 string to the server
        const axiosResponse = await axios.post(
          `${apiBaseUrl}${apiUrls.upload.uploadBase64}`,
          {
            base64String,
            fileType: 'document',
            fileName: file.name,
            fileSize: file.size,
            mimeType: 'application/pdf'
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              setUploadProgress(progress);
            }
          }
        );

        // Log response for debugging
        console.log('Upload response:', axiosResponse.data);

        if (!axiosResponse.data.success) {
          throw new Error(axiosResponse.data.message || 'Upload failed');
        }

        // Extract URL from response with proper type checking
        const responseData = axiosResponse.data?.data;
        const pdfUrl = typeof responseData === 'string' ? responseData : responseData?.url;

        if (!pdfUrl) {
          throw new UploadError('No URL received from server', 'INVALID_RESPONSE');
        }
        
        if (!isValidPdfUrl(pdfUrl)) {
          console.error('Invalid PDF URL received:', pdfUrl);
          throw new UploadError('Invalid PDF URL format from server', 'INVALID_RESPONSE');
        }

        // Update PDFs state with new file info
        const updatedPdfs = [...pdfs];
        updatedPdfs[index] = {
          ...updatedPdfs[index],
          url: pdfUrl,
          size_mb: Math.round((file.size / 1024 / 1024) * 100) / 100,
          upload_date: new Date().toISOString()
        };

        // Validate the updated PDF
        const validation = validatePdfResource(updatedPdfs[index]);
        if (validation.isValid) {
          setPdfs(updatedPdfs);
          showToast.success('PDF uploaded successfully');
        } else {
          throw new UploadError(validation.errors.join(', '), 'VALIDATION_ERROR');
        }
      } catch (axiosError) {
        console.error('Error uploading PDF:', axiosError);
        console.error('Error details:', {
          response: axiosError.response?.data,
          request: axiosError.request,
          message: axiosError.message
        });
        
        // Handle different types of errors
        let errorMessage = 'Failed to upload PDF. Please try again.';
        
        if (axios.isAxiosError(axiosError)) {
          switch (axiosError.response?.status) {
            case 401:
              errorMessage = 'Your session has expired. Please login again.';
              break;
            case 403:
              errorMessage = 'You do not have permission to upload files.';
              break;
            case 413:
              errorMessage = 'File size too large. Please choose a smaller file.';
              break;
            case 400:
              errorMessage = axiosError.response.data?.message || 'Invalid request format';
              break;
            case 415:
              errorMessage = 'Invalid file type. Please upload a PDF file.';
              break;
            default:
              errorMessage = axiosError.response?.data?.message || errorMessage;
          }
        } else if (axiosError.request) {
          // Request made but no response
          errorMessage = 'Network error. Please check your connection.';
        } else {
          // Error before making request (like auth error)
          errorMessage = axiosError.message || errorMessage;
        }

        toast.error(errorMessage);

        // If authentication error, you might want to trigger a logout or redirect
        if (axiosError.response?.status === 401 || errorMessage.includes('session has expired')) {
          // Trigger logout or redirect to login
          console.error('Authentication failed, user should be redirected to login');
        }

        throw new UploadError(errorMessage);
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      
      if (error instanceof UploadError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload PDF. Please try again.');
      }
    } finally {
      setUploadingIndex(null);
      setUploadProgress(0);
    }
  };

  const addPDF = () => {
    if (!showContent) {
      setShowContent(true);
    }
    setPdfs([
      ...pdfs,
      {
        title: '',
        description: '',
        url: '',
        category: '',
        size_mb: undefined,
        pages: undefined,
        upload_date: undefined
      }
    ]);
  };

  const removePDF = (index: number) => {
    const updatedPdfs = pdfs.filter((_, i) => i !== index);
    setPdfs(updatedPdfs);
    
    // Clear validation errors for removed PDF
    const newValidationErrors = { ...validationErrors };
    delete newValidationErrors[index];
    setValidationErrors(newValidationErrors);

    if (updatedPdfs.length === 0) {
      setShowContent(false);
    }
  };

  const updatePDF = (
    index: number,
    field: keyof Pick<ResourcePDF, 'title' | 'description' | 'url' | 'category'>,
    value: string
  ) => {
    const updatedPdfs = [...pdfs];
    updatedPdfs[index] = {
      ...updatedPdfs[index],
      [field]: value
    };

    // Validate the updated PDF
    const validation = validatePdfResource(updatedPdfs[index]);
    const newValidationErrors = { ...validationErrors };
    
    if (!validation.isValid) {
      newValidationErrors[index] = validation.errors;
    } else {
      delete newValidationErrors[index];
    }
    
    setValidationErrors(newValidationErrors);
    setPdfs(updatedPdfs);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Resources</h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload PDF resources and documents to support your course content.
          </p>
        </div>
        <button
          type="button"
          onClick={addPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Resource
        </button>
      </div>

      {showContent && pdfs.length > 0 && (
        <div className="space-y-6">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resource Title</label>
                        <input
                          type="text"
                          value={pdf.title}
                          onChange={(e) => updatePDF(index, 'title', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                          placeholder="e.g., Course Workbook"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={pdf.category}
                          onChange={(e) => updatePDF(index, 'category', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                        >
                          <option value="">Select category</option>
                          {PDF_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={pdf.description}
                        onChange={(e) => updatePDF(index, 'description', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                        placeholder="Brief description of the resource..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">PDF File</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, index);
                            }
                          }}
                          className="hidden"
                          id={`pdf-upload-${index}`}
                          disabled={uploadingIndex === index}
                        />
                        <label
                          htmlFor={`pdf-upload-${index}`}
                          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen ${
                            uploadingIndex === index ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploadingIndex === index ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2" />
                              Uploading ({uploadProgress}%)
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-5 w-5" />
                              Upload PDF
                            </>
                          )}
                        </label>
                        {pdf.url && (
                          <div className="ml-4 flex items-center text-sm text-gray-500">
                            <FileText className="mr-2 h-5 w-5" />
                            <span>
                              File uploaded
                              {pdf.size_mb && ` (${pdf.size_mb} MB)`}
                            </span>
                          </div>
                        )}
                      </div>
                      {uploadError && uploadingIndex === index && (
                        <div className="mt-2 flex items-start text-sm text-red-600">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          <p>{uploadError.message}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePDF(index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                    disabled={uploadingIndex === index}
                  >
                    <MinusCircle size={20} />
                  </button>
                </div>
              </div>

              {/* Display validation errors */}
              {validationErrors[index]?.length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  {validationErrors[index].map((error, errorIndex) => (
                    <div key={errorIndex} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showContent && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900">Resource Guidelines</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Upload PDFs that complement your course content</li>
            <li>Maximum file size: {MAX_PDF_SIZE / (1024 * 1024)}MB</li>
            <li>Ensure files are properly formatted and accessible</li>
            <li>Include clear descriptions for each resource</li>
            <li>Organize resources by appropriate categories</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResourcePDFs; 