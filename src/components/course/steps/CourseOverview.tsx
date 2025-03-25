import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, FormState, Controller, Control } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import FileUpload from '@/components/shared/FileUpload';
import Select from '@/components/shared/Select';
import Input from '@/components/shared/Input';
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';
import { toast } from 'react-toastify';

interface CourseOverviewProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: FormState<ICourseFormData>;
  categories: { id: string; name: string }[];
  onImageUpload: (file: File) => Promise<void>;
  courseImage: string | null;
  control: Control<ICourseFormData>;
}

const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
const courseTags = ['Live', 'Blended', 'Free'];
const courseGrades = [
  'All Levels',
  'Preschool',
  'Grade 1-2',
  'Grade 3-4',
  'Grade 5-6',
  'Grade 7-8',
  'Grade 9-10',
  'Grade 11-12',
  'UG - Graduate - Professionals'
];

const CourseOverview: React.FC<CourseOverviewProps> = ({
  register,
  setValue,
  formState: { errors },
  categories,
  onImageUpload,
  courseImage,
  control
}) => {
  const [instructors, setInstructors] = useState<Array<any>>([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState<boolean>(false);
  const { getQuery } = useGetQuery();

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoadingInstructors(true);
      try {
        const response = await getQuery({
          url: apiUrls.Instructor.getAllInstructors,
          onSuccess: () => {},
          onError: () => {
            console.error("Error fetching instructors");
            toast.error('Failed to load instructors. Please try again.');
          }
        });
        
        console.log("Instructors API response:", JSON.stringify(response, null, 2));
        
        let instructorsData = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          instructorsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          instructorsData = response.data;
        } else if (response?.instructors && Array.isArray(response.instructors)) {
          instructorsData = response.instructors;
        } else if (response?.results && Array.isArray(response.results)) {
          instructorsData = response.results;
        }
        
        // Validate and normalize instructor data
        const validInstructors = instructorsData
          .filter(instructor => instructor && (instructor._id || instructor.id))
          .map(instructor => ({
            id: instructor._id || instructor.id,
            name: instructor.full_name || 
                  `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim() || 
                  instructor.name || 
                  instructor.email
          }));
          
        console.log("Processed instructors:", validInstructors);
        setInstructors(validInstructors);
        
      } catch (error) {
        console.error("Error in fetchInstructors:", error);
        toast.error('Failed to load instructors. Please check your connection.');
      } finally {
        setIsLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, [getQuery]);

  const categoryOptions = Array.isArray(categories) && categories.length > 0 
    ? categories
        .filter(cat => cat && typeof cat === 'object' && cat.id && cat.name)
        .map(cat => ({ value: cat.id, label: cat.name }))
    : [{ value: '', label: 'No categories available' }];
    
  const instructorOptions = Array.isArray(instructors) && instructors.length > 0
    ? instructors
        .filter(instructor => instructor && instructor.id && instructor.name)
        .map(instructor => ({ value: instructor.id, label: instructor.name }))
    : [{ value: '', label: isLoadingInstructors ? 'Loading instructors...' : 'No instructors available' }];
    
  const tagOptions = courseTags.map(tag => ({ value: tag, label: tag }));
  const levelOptions = courseLevels.map(level => ({ value: level, label: level }));
  const gradeOptions = courseGrades.map(grade => ({ value: grade, label: grade }));
  const languageOptions = languages.map(lang => ({ value: lang, label: lang }));
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Overview & General Info</h2>
      
      {/* Course Category */}
      <Controller
        name="course_category"
        control={control}
        render={({ field }) => (
          <Select
            label="Course Category"
            options={categoryOptions}
            error={errors.course_category?.message}
            required
            onChange={option => field.onChange(option?.value || '')}
            value={categoryOptions.find(option => option.value === field.value) || null}
          />
        )}
      />

      {/* Course Subcategory */}
      <Input
        label="Course Subcategory"
        {...register('course_subcategory')}
        error={errors.course_subcategory?.message}
        required
      />

      {/* Course Title */}
      <Input
        label="Course Title"
        {...register('course_title')}
        error={errors.course_title?.message}
        required
      />

      {/* Course Subtitle */}
      <Input
        label="Course Subtitle"
        {...register('course_subtitle')}
        error={errors.course_subtitle?.message}
        required
      />

      {/* Course Tag */}
      <Controller
        name="course_tag"
        control={control}
        render={({ field }) => (
          <Select
            label="Course Tag"
            options={tagOptions}
            error={errors.course_tag?.message}
            required
            onChange={option => field.onChange(option?.value || '')}
            value={tagOptions.find(option => option.value === field.value) || null}
          />
        )}
      />

      {/* Course Level */}
      <Controller
        name="course_grade"
        control={control}
        render={({ field }) => (
          <Select
            label="Course Grade"
            options={gradeOptions}
            error={errors.course_grade?.message}
            required
            onChange={option => field.onChange(option?.value || '')}
            value={gradeOptions.find(option => option.value === field.value) || null}
          />
        )}
      />

      {/* Language */}
      <Controller
        name="language"
        control={control}
        render={({ field }) => (
          <Select
            label="Language"
            options={languageOptions}
            error={errors.language?.message}
            required
            onChange={option => field.onChange(option?.value || '')}
            value={languageOptions.find(option => option.value === field.value) || null}
          />
        )}
      />

      {/* Subtitle Languages */}
      <Controller
        name="subtitle_languages"
        control={control}
        render={({ field }) => (
          <Select
            label="Subtitle Languages"
            options={languageOptions}
            isMulti
            error={errors.subtitle_languages?.message}
            onChange={options => field.onChange(options ? options.map(opt => opt.value) : [])}
            value={languageOptions.filter(option => 
              field.value && Array.isArray(field.value) && field.value.includes(option.value)
            )}
          />
        )}
      />

      {/* Course Image */}
      <FileUpload
        label="Course Image"
        accept="image/*"
        onFileSelect={onImageUpload}
        currentFile={courseImage}
        error={errors.course_image?.message}
        required
      />

      {/* Assigned Instructor */}
      <Controller
        name="assigned_instructor"
        control={control}
        render={({ field }) => (
          <Select
            label="Assigned Instructor"
            options={instructorOptions}
            error={errors.assigned_instructor?.message}
            required
            onChange={option => field.onChange(option?.value || '')}
            value={instructorOptions.find(option => option.value === field.value) || null}
          />
        )}
      />
    </div>
  );
};

export default CourseOverview; 