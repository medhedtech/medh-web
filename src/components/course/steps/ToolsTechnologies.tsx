import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";

interface ToolsTechnologiesProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

interface Tool {
  name: string;
  category: string;
  description: string;
  logo_url: string;
}

const TOOL_CATEGORIES = [
  'programming_language',
  'framework',
  'library',
  'database',
  'cloud_service',
  'development_tool',
  'other'
];

const ToolsTechnologies: React.FC<ToolsTechnologiesProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [tools, setTools] = React.useState<Tool[]>([
    {
      name: '',
      category: '',
      description: '',
      logo_url: ''
    }
  ]);

  const { postQuery } = usePostQuery();

  // Update form data whenever tools change
  React.useEffect(() => {
    setValue('tools_technologies', tools);
  }, [tools, setValue]);

  const handleLogoUpload = async (file: File, index: number) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const postData = { base64String: base64, fileType: "image" };
          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: (data) => {
              const updatedTools = [...tools];
              updatedTools[index] = {
                ...updatedTools[index],
                logo_url: data?.data
              };
              setTools(updatedTools);
            },
            onError: (error) => {
              toast.error('Logo upload failed. Please try again.');
            },
          });
        }
      };
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const addTool = () => {
    setTools([
      ...tools,
      {
        name: '',
        category: '',
        description: '',
        logo_url: ''
      }
    ]);
  };

  const removeTool = (index: number) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    setTools(updatedTools);
  };

  const updateTool = (
    index: number,
    field: keyof Tool,
    value: string
  ) => {
    const updatedTools = [...tools];
    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value
    };
    setTools(updatedTools);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Tools & Technologies</h2>
      <p className="text-sm text-gray-600">
        Add the tools and technologies that students will learn or use in this course.
      </p>

      <div className="space-y-6">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tool Name</label>
                  <input
                    type="text"
                    value={tool.name}
                    onChange={(e) => updateTool(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    placeholder="e.g., React.js"
                  />
                  {errors.tools_technologies?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.tools_technologies[index].name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={tool.category}
                    onChange={(e) => updateTool(index, 'category', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                  >
                    <option value="">Select a category</option>
                    {TOOL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                  {errors.tools_technologies?.[index]?.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.tools_technologies[index].category?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={tool.description}
                    onChange={(e) => updateTool(index, 'description', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    placeholder="Brief description of the tool and its role in the course..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleLogoUpload(file, index);
                        }
                      }}
                      className="hidden"
                      id={`logo-upload-${index}`}
                    />
                    <label
                      htmlFor={`logo-upload-${index}`}
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Logo
                    </label>
                    {tool.logo_url && (
                      <div className="ml-4">
                        <img
                          src={tool.logo_url}
                          alt={`${tool.name} logo`}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {tools.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <MinusCircle size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTool}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Tool/Technology
      </button>
    </div>
  );
};

export default ToolsTechnologies; 