import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle, Upload } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";

interface BonusModulesProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

interface BonusModule {
  title: string;
  description: string;
  resources: {
    title: string;
    type: string;
    url: string;
    description: string;
  }[];
}

const RESOURCE_TYPES = ['pdf', 'video', 'link', 'other'];

const BonusModules: React.FC<BonusModulesProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [modules, setModules] = React.useState<BonusModule[]>([
    {
      title: '',
      description: '',
      resources: []
    }
  ]);

  const { postQuery } = usePostQuery();

  // Update form data whenever modules change
  React.useEffect(() => {
    setValue('bonus_modules', modules);
  }, [modules, setValue]);

  const handleFileUpload = async (file: File, moduleIndex: number, resourceIndex: number) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          const fileType = file.type.includes('pdf') ? 'pdf' : 'video';
          const postData = { base64String: base64, fileType };
          await postQuery({
            url: apiUrls?.upload?.[fileType === 'pdf' ? 'uploadPdf' : 'uploadVideo'],
            postData,
            onSuccess: (data) => {
              const updatedModules = [...modules];
              updatedModules[moduleIndex].resources[resourceIndex] = {
                ...updatedModules[moduleIndex].resources[resourceIndex],
                url: data?.data
              };
              setModules(updatedModules);
            },
            onError: (error) => {
              showToast.error('File upload failed. Please try again.');
            },
          });
        }
      };
    } catch (error) {
      showToast.error('Failed to upload file');
    }
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        description: '',
        resources: []
      }
    ]);
  };

  const removeModule = (index: number) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  const updateModule = (
    index: number,
    field: keyof Omit<BonusModule, 'resources'>,
    value: string
  ) => {
    const updatedModules = [...modules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value
    };
    setModules(updatedModules);
  };

  const addResource = (moduleIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].resources.push({
      title: '',
      type: '',
      url: '',
      description: ''
    });
    setModules(updatedModules);
  };

  const removeResource = (moduleIndex: number, resourceIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].resources = updatedModules[moduleIndex].resources.filter(
      (_, i) => i !== resourceIndex
    );
    setModules(updatedModules);
  };

  const updateResource = (
    moduleIndex: number,
    resourceIndex: number,
    field: keyof BonusModule['resources'][0],
    value: string
  ) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].resources[resourceIndex] = {
      ...updatedModules[moduleIndex].resources[resourceIndex],
      [field]: value
    };
    setModules(updatedModules);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Bonus Modules & Final Evaluation</h2>
      <p className="text-sm text-gray-600">
        Add bonus content and materials that complement the main course curriculum.
      </p>

      <div className="space-y-6">
        {modules.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Title</label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    placeholder="e.g., Advanced Techniques"
                  />
                  {errors.bonus_modules?.[moduleIndex]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bonus_modules[moduleIndex].title?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={module.description}
                    onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    placeholder="Describe what students will learn in this bonus module..."
                  />
                  {errors.bonus_modules?.[moduleIndex]?.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bonus_modules[moduleIndex].description?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">Resources</h4>
                    <button
                      type="button"
                      onClick={() => addResource(moduleIndex)}
                      className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                    >
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Add Resource
                    </button>
                  </div>

                  {module.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className="bg-gray-50 rounded-lg p-4 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Resource Title
                          </label>
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) =>
                              updateResource(moduleIndex, resourceIndex, 'title', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                            placeholder="e.g., Bonus Tutorial"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type</label>
                          <select
                            value={resource.type}
                            onChange={(e) =>
                              updateResource(moduleIndex, resourceIndex, 'type', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                          >
                            <option value="">Select type</option>
                            {RESOURCE_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={resource.description}
                          onChange={(e) =>
                            updateResource(moduleIndex, resourceIndex, 'description', e.target.value)
                          }
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                          placeholder="Brief description of the resource..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">File</label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="file"
                            accept={resource.type === 'pdf' ? '.pdf' : resource.type === 'video' ? 'video/*' : undefined}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, moduleIndex, resourceIndex);
                              }
                            }}
                            className="hidden"
                            id={`resource-upload-${moduleIndex}-${resourceIndex}`}
                          />
                          <label
                            htmlFor={`resource-upload-${moduleIndex}-${resourceIndex}`}
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            Upload File
                          </label>
                          {resource.url && (
                            <span className="ml-4 text-sm text-gray-500">File uploaded successfully</span>
                          )}
                        </div>
                      </div>

                      {module.resources.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResource(moduleIndex, resourceIndex)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove Resource
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {modules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeModule(moduleIndex)}
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
        onClick={addModule}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Bonus Module
      </button>

      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Final Evaluation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Final Quizzes</label>
            <select
              multiple
              {...register('final_quizzes')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
            >
              <option value="quiz1">Quiz 1</option>
              <option value="quiz2">Quiz 2</option>
              {/* Add more quiz options */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Final Assessments</label>
            <select
              multiple
              {...register('final_assessments')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
            >
              <option value="assessment1">Assessment 1</option>
              <option value="assessment2">Assessment 2</option>
              {/* Add more assessment options */}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Certification</label>
          <select
            {...register('certification')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
          >
            <option value="">Select certification</option>
            <option value="basic">Basic Certificate</option>
            <option value="advanced">Advanced Certificate</option>
            <option value="expert">Expert Certificate</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BonusModules; 