import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, FormState, Controller, Control } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import Select from '@/components/shared/Select';
import Input from '@/components/shared/Input';
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';
import { useUpload } from '@/hooks/useUpload';
import { toast } from 'react-toastify';
import { Loader, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseOverviewProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: FormState<ICourseFormData>;
  categories: { id: string; name: string }[];
  onImageUpload: (file: File) => Promise<void>;
  courseImage: string | null;
  control: Control<ICourseFormData>;
}

interface Instructor {
  id: string;
  _id?: string;
  name: string;
  full_name?: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email?: string;
}

interface CourseImage {
  url: string;
  key?: string;
  bucket?: string;
}

const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
const classTypes = [
  "Live Courses",
  "Blended Courses",
  "Free Courses",
  "Self-paced"
];
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
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [courseImageData, setCourseImageData] = useState<CourseImage | null>(
    courseImage ? { url: courseImage } : null
  );
  const { getQuery } = useGetQuery();
  const { uploadFile, uploadBase64, isUploading } = useUpload({
    onSuccess: (response) => {
      try {
        let cleanData: CourseImage;
        
        if (typeof response.data === 'string') {
          const dataString: string = response.data;
          cleanData = {
            url: dataString,
            key: dataString.split('/').pop() || ''
          };
        } else if (response.data && typeof response.data === 'object') {
          cleanData = {
            url: typeof response.data.url === 'string' 
              ? response.data.url.replace(/^"|"$/g, '') 
              : response.data.url || '',
            key: typeof response.data.key === 'string'
              ? response.data.key.replace(/^"|"$/g, '')
              : response.data.key || '',
            bucket: typeof response.data.bucket === 'string'
              ? response.data.bucket.replace(/^"|"$/g, '')
              : response.data.bucket
          };
        } else {
          throw new Error('Invalid response format');
        }

        setCourseImageData(cleanData);
        setValue('course_image', cleanData.url);
        setUploadError(null);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Error processing upload response:', error, response);
        setUploadError('Failed to process uploaded image');
        toast.error('Error processing uploaded image. Please try again.');
      }
    },
    onError: (error) => {
      setUploadError(error.message || 'Failed to upload image');
      toast.error('Failed to upload image: ' + error.message);
    },
    showToast: false // We'll handle toasts manually
  });

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoadingInstructors(true);
      try {
        const response = await getQuery({
          url: apiUrls.Instructor.getAllInstructors,
          onSuccess: () => {},
          onFail: (error) => {
            console.error("Error fetching instructors:", error);
            toast.error('Failed to load instructors. Please try again.');
          }
        });
        
        console.log("Instructors API response:", JSON.stringify(response, null, 2));
        
        let instructorsData: Instructor[] = [];
        
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
            id: instructor._id || instructor.id, // Prioritize _id for MongoDB ObjectId
            name: instructor.full_name || 
                  `${instructor.firstName || instructor.first_name || ''} ${instructor.lastName || instructor.last_name || ''}`.trim() || 
                  instructor.name || 
                  instructor.email || 
                  'Unnamed Instructor'
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const requiredWidth = 1200;
    const requiredHeight = 630;
    const maxSizeInMB = 5;

    if (file) {
      try {
        // Check file size first
        if (file.size > maxSizeInMB * 1024 * 1024) {
          throw new Error(`File size must be less than ${maxSizeInMB}MB`);
        }

        // Create a compressed version of the image
        const compressedFile = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = requiredWidth;
              canvas.height = requiredHeight;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to create canvas context'));
                return;
              }
              ctx.drawImage(img, 0, 0, requiredWidth, requiredHeight);
              resolve(canvas.toDataURL('image/jpeg', 0.75)); // Compress to JPEG with 75% quality
            };
            img.onerror = () => reject(new Error('Failed to load image for compression'));
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
        });

        // Extract base64 string and upload
        const base64String = compressedFile.split(',')[1];
        
        setUploadError(null);
        toast.info('Uploading image...', { autoClose: false, toastId: 'uploading-image' });
        
        await uploadBase64(base64String, "image");
        toast.dismiss('uploading-image');
        
        // Call the parent's onImageUpload function as well
        await onImageUpload(file);
        
      } catch (error) {
        toast.dismiss('uploading-image');
        console.error('Error uploading image:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
        setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      }
    }
  };

  const categoryOptions = Array.isArray(categories) && categories.length > 0 
    ? categories
        .filter(cat => cat && typeof cat === 'object' && cat.name)
        .map(cat => ({ value: cat.name, label: cat.name }))
    : [{ value: '', label: 'No categories available' }];
    
  const instructorOptions = Array.isArray(instructors) && instructors.length > 0
    ? instructors
        .filter(instructor => instructor && instructor.id && instructor.name)
        .map(instructor => ({ value: instructor.id, label: instructor.name }))
    : [{ value: '', label: isLoadingInstructors ? 'Loading instructors...' : 'No instructors available' }];
    
  const classTypeOptions = classTypes.map(type => ({ value: type, label: type }));
  const levelOptions = courseLevels.map(level => ({ value: level, label: level }));
  const gradeOptions = courseGrades.map(grade => ({ value: grade, label: grade }));
  const languageOptions = languages.map(lang => ({ value: lang, label: lang }));
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Course Overview & General Info</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Course Category */}
        <div className="md:col-span-2">
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
                value={categoryOptions.find(option => option.value === field.value)}
                placeholder="Select a category"
              />
            )}
          />
        </div>

        {/* Course Title and Subtitle */}
        <Input
          label="Course Title"
          {...register('course_title')}
          error={errors.course_title?.message}
          required
          placeholder="Enter course title"
        />

        <Input
          label="Course Subtitle"
          {...register('course_subtitle')}
          error={errors.course_subtitle?.message}
          placeholder="Enter course subtitle (optional)"
        />

        {/* Course Subcategory */}
        <Input
          label="Course Subcategory"
          {...register('course_subcategory')}
          error={errors.course_subcategory?.message}
          placeholder="Enter subcategory (optional)"
        />

        {/* Class Type */}
        <Controller
          name="class_type"
          control={control}
          render={({ field }) => (
            <Select
              label="Class Type"
              options={classTypeOptions}
              error={errors.class_type?.message}
              required
              onChange={option => field.onChange(option?.value || '')}
              value={classTypeOptions.find(option => option.value === field.value)}
              placeholder="Select class type"
            />
          )}
        />

        {/* Course Level & Grade */}
        <Controller
          name="course_level"
          control={control}
          render={({ field }) => (
            <Select
              label="Course Level"
              options={levelOptions}
              error={errors.course_level?.message}
              onChange={option => field.onChange(option?.value || '')}
              value={levelOptions.find(option => option.value === field.value)}
              placeholder="Select course level"
            />
          )}
        />

        <Controller
          name="course_grade"
          control={control}
          render={({ field }) => (
            <Select
              label="Course Grade"
              options={gradeOptions}
              error={errors.course_grade?.message}
              onChange={option => field.onChange(option?.value || '')}
              value={gradeOptions.find(option => option.value === field.value)}
              placeholder="Select course grade"
            />
          )}
        />

        {/* Language Settings */}
        <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                label="Primary Language"
                options={languageOptions}
                error={errors.language?.message}
                onChange={option => field.onChange(option?.value || '')}
                value={languageOptions.find(option => option.value === field.value)}
                placeholder="Select primary language"
              />
            )}
          />

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
                placeholder="Select subtitle languages (optional)"
              />
            )}
          />
        </div>

        {/* Course Image - Updated to match AddBlogs.tsx style */}
        <div className="md:col-span-2">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Course Image <span className="text-red-400">*</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">(1200x630 pixels recommended for social sharing)</span>
          </p>
          <div className="relative group">
            <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 text-center transition-all group-hover:border-primary-400/50 bg-white/5 dark:bg-white/5">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              {courseImageData ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md h-48 mb-4">
                    <img 
                      src={courseImageData.url} 
                      alt="Course preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4 group-hover:text-primary-400 transition-colors" />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary-400 transition-colors">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Supports: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
          {(errors.course_image?.message || uploadError) && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-2 block"
            >
              {errors.course_image?.message || uploadError}
            </motion.span>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 p-4">
                <Loader className="w-8 h-8 text-primary-500 dark:text-primary-400 animate-spin" />
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Uploading image...</p>
              </div>
            </div>
          )}
        </div>

        {/* Assigned Instructor */}
        <div className="md:col-span-2">
          <Controller
            name="assigned_instructor"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Select
                  label="Assigned Instructor"
                  options={instructorOptions}
                  error={errors.assigned_instructor?.message}
                  onChange={option => {
                    // Store the MongoDB ObjectId
                    field.onChange(option?.value || null);
                  }}
                  value={instructorOptions.find(option => option.value === field.value)}
                  placeholder="Select instructor"
                  isDisabled={isLoadingInstructors}
                  required
                />
                
                {isLoadingInstructors && (
                  <div className="absolute right-3 top-10">
                    <Loader className="w-4 h-4 text-primary-500 dark:text-primary-400 animate-spin" />
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseOverview; 