import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle, Upload, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";

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
  description: string;
  category: string;
  url: string;
  type: string;
  size?: number;
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

const ResourcePDFs: React.FC<ResourcePDFsProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [pdfs, setPdfs] = React.useState<ResourcePDF[]>([
    {
      title: '',
      description: '',
      category: '',
      url: '',
      type: 'pdf'
    }
  ]);

  const { postQuery } = usePostQuery();

  // Update form data whenever PDFs change
  React.useEffect(() => {
    setValue('resource_pdfs', pdfs);
  }, [pdfs, setValue]);

  const handleFileUpload = async (file: File, index: number) => {
    try {
      if (!file.type.includes('pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { base64String: base64, fileType: 'pdf' };
          await postQuery({
            url: apiUrls?.upload?.uploadPdf,
            postData,
            onSuccess: (data) => {
              const updatedPdfs = [...pdfs];
              updatedPdfs[index] = {
                ...updatedPdfs[index],
                url: data?.data,
                size: Math.round(file.size / 1024) // Convert to KB
              };
              setPdfs(updatedPdfs);
              toast.success('PDF uploaded successfully');
            },
            onError: (error) => {
              toast.error('Failed to upload PDF. Please try again.');
            },
          });
        }
      };
    } catch (error) {
      toast.error('Failed to upload PDF');
    }
  };

  const addPDF = () => {
    setPdfs([
      ...pdfs,
      {
        title: '',
        description: '',
        category: '',
        url: '',
        type: 'pdf'
      }
    ]);
  };

  const removePDF = (index: number) => {
    const updatedPdfs = pdfs.filter((_, i) => i !== index);
    setPdfs(updatedPdfs);
  };

  const updatePDF = (
    index: number,
    field: keyof Omit<ResourcePDF, 'type' | 'size'>,
    value: string
  ) => {
    const updatedPdfs = [...pdfs];
    updatedPdfs[index] = {
      ...updatedPdfs[index],
      [field]: value
    };
    setPdfs(updatedPdfs);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Course Resources</h2>
        <p className="mt-1 text-sm text-gray-600">
          Upload PDF resources and documents to support your course content.
        </p>
      </div>

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
                      {errors.resource_pdfs?.[index]?.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.resource_pdfs[index].title?.message}
                        </p>
                      )}
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
                      {errors.resource_pdfs?.[index]?.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.resource_pdfs[index].category?.message}
                        </p>
                      )}
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
                    {errors.resource_pdfs?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.resource_pdfs[index].description?.message}
                      </p>
                    )}
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
                      />
                      <label
                        htmlFor={`pdf-upload-${index}`}
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Upload PDF
                      </label>
                      {pdf.url && (
                        <div className="ml-4 flex items-center text-sm text-gray-500">
                          <FileText className="mr-2 h-5 w-5" />
                          <span>
                            File uploaded
                            {pdf.size && ` (${pdf.size} KB)`}
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.resource_pdfs?.[index]?.url && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.resource_pdfs[index].url?.message}
                      </p>
                    )}
                  </div>
                </div>

                {pdfs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePDF(index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <MinusCircle size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPDF}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Resource
      </button>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900">Resource Guidelines</h3>
        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Upload PDFs that complement your course content</li>
          <li>Ensure files are properly formatted and accessible</li>
          <li>Keep file sizes reasonable (preferably under 10MB)</li>
          <li>Include clear descriptions for each resource</li>
          <li>Organize resources by appropriate categories</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourcePDFs; 