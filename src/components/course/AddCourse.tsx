import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICourseFormData } from '@/types/course.types';
import StepProgress from '../shared/StepProgress';
import CourseOverview from './steps/CourseOverview';
import { showToast } from '@/utils/toastManager';

const formSteps = [
  {
    title: 'Overview',
    description: 'Basic course information',
    hash: 'overview'
  },
  {
    title: 'Description',
    description: 'Course details and objectives',
    hash: 'description'
  },
  {
    title: 'Schedule',
    description: 'Duration and sessions',
    hash: 'schedule'
  },
  {
    title: 'Pricing',
    description: 'Course pricing and brochures',
    hash: 'pricing'
  },
  {
    title: 'Curriculum',
    description: 'Course structure',
    hash: 'curriculum'
  },
  {
    title: 'Resources',
    description: 'Additional materials',
    hash: 'resources'
  },
  {
    title: 'FAQs',
    description: 'Common questions',
    hash: 'faqs'
  },
  {
    title: 'Tools',
    description: 'Required technologies',
    hash: 'tools'
  },
  {
    title: 'Bonus',
    description: 'Extra modules',
    hash: 'bonus'
  },
  {
    title: 'Related',
    description: 'Related courses',
    hash: 'related'
  }
];

const schema = yup.object().shape({
  course_category: yup.string().required('Course category is required'),
  course_subcategory: yup.string().required('Course subcategory is required'),
  course_title: yup.string().required('Course title is required'),
  course_subtitle: yup.string().required('Course subtitle is required'),
  course_tag: yup.string(),
  course_level: yup.string().required('Course level is required'),
  language: yup.string().required('Language is required'),
  subtitle_languages: yup.array().of(yup.string()),
  course_image: yup.string().required('Course image is required'),
  assigned_instructor: yup.string().nullable().required('Assigned instructor is required'),
  class_type: yup.string().required('Class type is required'),
  course_grade: yup.string().required('Course grade is required')
}) as yup.ObjectSchema<ICourseFormData>;

const AddCourse: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseImage, setCourseImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState,
    watch
  } = useForm<ICourseFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      assigned_instructor: null,
      course_category: '',
      course_subcategory: '',
      course_title: '',
      course_subtitle: '',
      course_tag: '',
      course_level: '',
      language: '',
      subtitle_languages: [],
      course_image: '',
      class_type: '',
      course_grade: '',
      course_description: {
        program_overview: '',
        benefits: '',
        learning_objectives: [],
        course_requirements: [],
        target_audience: []
      },
      course_fee: 0,
      prices: [],
      brochures: [],
      status: 'Draft',
      isFree: false,
      specifications: null,
      resource_pdfs: [],
      curriculum: [],
      faqs: [],
      tools_technologies: [],
      bonus_modules: [],
      efforts_per_Week: '',
      is_Certification: 'no',
      is_Assignments: 'no',
      is_Projects: 'no',
      is_Quizes: 'no',
      related_courses: [],
      min_hours_per_week: 0,
      max_hours_per_week: 0,
      category_type: '',
      no_of_Sessions: 0,
      course_duration: '',
      session_duration: '',
      final_evaluation: {
        final_quizzes: [],
        final_assessments: [],
        certification: null,
        final_faqs: []
      },
      meta: {
        ratings: {
          average: 0,
          count: 0
        },
        views: 0,
        enrollments: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  });

  const handleImageUpload = async (file: File) => {
    try {
      // Implement your image upload logic here
      // For now, we'll just create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setCourseImage(previewUrl);
      setValue('course_image', previewUrl);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const onSubmit = async (data: ICourseFormData) => {
    try {
      console.log('Form data:', data);
      // Implement your form submission logic here
      showToast.success('Course created successfully!');
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CourseOverview
            register={register}
            setValue={setValue}
            formState={formState}
            categories={[]} // Add your categories here
            onImageUpload={handleImageUpload}
            courseImage={courseImage}
            control={control}
          />
        );
      // Add more cases for other steps
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepProgress
          currentStep={currentStep}
          totalSteps={formSteps.length}
          steps={formSteps}
        />

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              {currentStep < formSteps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 bg-customGreen text-white rounded-md text-sm font-medium hover:bg-green-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-customGreen text-white rounded-md text-sm font-medium hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse; 