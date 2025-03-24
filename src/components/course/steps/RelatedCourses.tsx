import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

interface RelatedCoursesProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  rating?: number;
}

interface RelatedCourse {
  course_id: string;
  relationship_type: 'prerequisite' | 'complementary' | 'advanced' | 'series';
  description: string;
}

const RELATIONSHIP_TYPES = [
  { value: 'prerequisite', label: 'Prerequisite Course' },
  { value: 'complementary', label: 'Complementary Course' },
  { value: 'advanced', label: 'Advanced Course' },
  { value: 'series', label: 'Part of Series' }
];

const RelatedCourses: React.FC<RelatedCoursesProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = React.useState<RelatedCourse[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const { getQuery } = useGetQuery();

  // Update form data whenever selected courses change
  React.useEffect(() => {
    setValue('related_courses', selectedCourses);
  }, [selectedCourses, setValue]);

  const searchCourses = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      await getQuery({
        url: `${apiUrls?.course?.search}?query=${encodeURIComponent(query)}`,
        onSuccess: (data) => {
          setSearchResults(data?.data || []);
        },
        onError: (error) => {
          toast.error('Failed to search courses');
          setSearchResults([]);
        },
      });
    } catch (error) {
      toast.error('Failed to search courses');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchCourses(query);
  };

  const addCourse = (course: Course) => {
    if (selectedCourses.some((c) => c.course_id === course.id)) {
      toast.warning('This course is already added');
      return;
    }

    setSelectedCourses([
      ...selectedCourses,
      {
        course_id: course.id,
        relationship_type: 'complementary',
        description: ''
      }
    ]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCourse = (index: number) => {
    const updatedCourses = selectedCourses.filter((_, i) => i !== index);
    setSelectedCourses(updatedCourses);
  };

  const updateCourse = (
    index: number,
    field: keyof RelatedCourse,
    value: string
  ) => {
    const updatedCourses = [...selectedCourses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value
    };
    setSelectedCourses(updatedCourses);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Related Courses</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add prerequisite courses and related content to help students understand the learning path.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Search Courses</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
              placeholder="Search by course title..."
            />
          </div>

          {isSearching && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              <div className="p-4 text-sm text-gray-500">Searching...</div>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              <ul className="max-h-60 overflow-auto py-1">
                {searchResults.map((course) => (
                  <li
                    key={course.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addCourse(course)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-gray-500">
                          by {course.instructor} • {course.category}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.level}
                        {course.rating && ` • ${course.rating}★`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedCourses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Relationship Type
                    </label>
                    <select
                      value={course.relationship_type}
                      onChange={(e) =>
                        updateCourse(index, 'relationship_type', e.target.value as RelatedCourse['relationship_type'])
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    >
                      {RELATIONSHIP_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.related_courses?.[index]?.relationship_type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.related_courses[index].relationship_type?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Relationship Description
                    </label>
                    <textarea
                      value={course.description}
                      onChange={(e) => updateCourse(index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="Explain how this course relates to the current one..."
                    />
                    {errors.related_courses?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.related_courses[index].description?.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCourse(index)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <MinusCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900">Course Relationship Guidelines</h3>
        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Add prerequisite courses that students should complete first</li>
          <li>Include complementary courses that enhance the learning experience</li>
          <li>Link to advanced courses for students who want to learn more</li>
          <li>Connect courses that are part of a series or learning path</li>
          <li>Provide clear descriptions of how courses relate to each other</li>
        </ul>
      </div>
    </div>
  );
};

export default RelatedCourses; 