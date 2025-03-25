import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface CourseDescriptionProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [objectives, setObjectives] = React.useState<string[]>(['']);
  const [requirements, setRequirements] = React.useState<string[]>(['']);
  const [audience, setAudience] = React.useState<string[]>(['']);

  // Initialize arrays from watched values
  React.useEffect(() => {
    const watchedValues = watch('course_description');
    if (watchedValues) {
      if (watchedValues.learning_objectives) setObjectives(watchedValues.learning_objectives);
      if (watchedValues.course_requirements) setRequirements(watchedValues.course_requirements);
      if (watchedValues.target_audience) setAudience(watchedValues.target_audience);
    }
  }, [watch]);

  const handleArrayUpdate = (
    index: number,
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: 'learning_objectives' | 'course_requirements' | 'target_audience'
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
    setValue(`course_description.${fieldName}`, newArray.filter(item => item.trim() !== ''));
  };

  const addArrayItem = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (
    index: number,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: 'learning_objectives' | 'course_requirements' | 'target_audience'
  ) => {
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
    setValue(`course_description.${fieldName}`, newArray.filter(item => item.trim() !== ''));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Course Description</h2>
      
      {/* Program Overview */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Program Overview</span>
          <span className="text-red-500 ml-1">*</span>
          <textarea
            {...register('course_description.program_overview')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
            rows={4}
            placeholder="Provide a comprehensive overview of your course..."
          />
        </label>
        {errors.course_description?.program_overview && (
          <p className="text-red-500 text-sm">{errors.course_description.program_overview.message}</p>
        )}
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Benefits</span>
          <textarea
            {...register('course_description.benefits')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
            rows={4}
            placeholder="List the key benefits students will gain..."
          />
        </label>
        {errors.course_description?.benefits && (
          <p className="text-red-500 text-sm">{errors.course_description.benefits.message}</p>
        )}
      </div>

      {/* Learning Objectives */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Learning Objectives</span>
          <button
            type="button"
            onClick={() => addArrayItem(objectives, setObjectives)}
            className="text-customGreen hover:text-green-600 flex items-center gap-1"
          >
            <PlusCircle size={20} /> Add Objective
          </button>
        </div>
        {objectives.map((objective, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={objective}
              onChange={(e) => handleArrayUpdate(index, e.target.value, objectives, setObjectives, 'learning_objectives')}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
              placeholder="Enter a learning objective..."
            />
            {objectives.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(index, objectives, setObjectives, 'learning_objectives')}
                className="text-red-500 hover:text-red-600"
              >
                <MinusCircle size={20} />
              </button>
            )}
          </div>
        ))}
        {errors.course_description?.learning_objectives && (
          <p className="text-red-500 text-sm">{errors.course_description.learning_objectives.message}</p>
        )}
      </div>

      {/* Course Requirements */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Course Requirements</span>
          <button
            type="button"
            onClick={() => addArrayItem(requirements, setRequirements)}
            className="text-customGreen hover:text-green-600 flex items-center gap-1"
          >
            <PlusCircle size={20} /> Add Requirement
          </button>
        </div>
        {requirements.map((requirement, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={requirement}
              onChange={(e) => handleArrayUpdate(index, e.target.value, requirements, setRequirements, 'course_requirements')}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
              placeholder="Enter a course requirement..."
            />
            {requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(index, requirements, setRequirements, 'course_requirements')}
                className="text-red-500 hover:text-red-600"
              >
                <MinusCircle size={20} />
              </button>
            )}
          </div>
        ))}
        {errors.course_description?.course_requirements && (
          <p className="text-red-500 text-sm">{errors.course_description.course_requirements.message}</p>
        )}
      </div>

      {/* Target Audience */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Target Audience</span>
          <button
            type="button"
            onClick={() => addArrayItem(audience, setAudience)}
            className="text-customGreen hover:text-green-600 flex items-center gap-1"
          >
            <PlusCircle size={20} /> Add Audience
          </button>
        </div>
        {audience.map((audienceItem, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={audienceItem}
              onChange={(e) => handleArrayUpdate(index, e.target.value, audience, setAudience, 'target_audience')}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
              placeholder="Enter target audience..."
            />
            {audience.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(index, audience, setAudience, 'target_audience')}
                className="text-red-500 hover:text-red-600"
              >
                <MinusCircle size={20} />
              </button>
            )}
          </div>
        ))}
        {errors.course_description?.target_audience && (
          <p className="text-red-500 text-sm">{errors.course_description.target_audience.message}</p>
        )}
      </div>
    </div>
  );
};

export default CourseDescription; 