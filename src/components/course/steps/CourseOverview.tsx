import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import FileUpload from '@/components/shared/FileUpload';
import Select from '@/components/shared/Select';
import Input from '@/components/shared/Input';

interface CourseOverviewProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: FormState<ICourseFormData>;
  categories: { id: string; name: string }[];
  onImageUpload: (file: File) => Promise<void>;
  courseImage: string | null;
}

const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
const courseTags = ['Live', 'Pre-Recorded', 'Hybrid', 'Free'];

const CourseOverview: React.FC<CourseOverviewProps> = ({
  register,
  setValue,
  formState: { errors },
  categories,
  onImageUpload,
  courseImage
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Overview & General Info</h2>
      
      {/* Course Category */}
      <Select
        label="Course Category"
        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
        {...register('course_category')}
        error={errors.course_category?.message}
        required
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
      <Select
        label="Course Tag"
        options={courseTags.map(tag => ({ value: tag, label: tag }))}
        {...register('course_tag')}
        error={errors.course_tag?.message}
        required
      />

      {/* Course Level */}
      <Select
        label="Course Level"
        options={courseLevels.map(level => ({ value: level, label: level }))}
        {...register('course_level')}
        error={errors.course_level?.message}
        required
      />

      {/* Language */}
      <Select
        label="Language"
        options={languages.map(lang => ({ value: lang, label: lang }))}
        {...register('language')}
        error={errors.language?.message}
        required
      />

      {/* Subtitle Languages */}
      <Select
        label="Subtitle Languages"
        options={languages.map(lang => ({ value: lang, label: lang }))}
        isMulti
        {...register('subtitle_languages')}
        error={errors.subtitle_languages?.message}
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
      <Input
        label="Assigned Instructor"
        {...register('assigned_instructor')}
        error={errors.assigned_instructor?.message}
        required
      />
    </div>
  );
};

export default CourseOverview; 