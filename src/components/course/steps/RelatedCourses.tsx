import React, { useCallback, useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData, IRelatedCourse } from '@/types/course.types';
import { PlusCircle, MinusCircle, Search, ChevronDown, X } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { apiUrls, apiBaseUrl } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { getAllCoursesWithLimits } from '@/apis/course/course';

interface Course {
  _id: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  rating?: number;
}

interface RelatedCoursesProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

type RelatedCourse = IRelatedCourse;

const RELATIONSHIP_TYPES = [
  { value: 'prerequisite', label: 'Prerequisite Course' },
  { value: 'complementary', label: 'Complementary Course' },
  { value: 'advanced', label: 'Advanced Course' },
  { value: 'series', label: 'Part of Series' }
];

interface CourseResponse {
  courses: Course[];
}

interface GetQueryParams {
  url: string;
  onSuccess: (response: APIResponse) => void;
  onError: () => void;
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<RelatedCourse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { getQuery } = useGetQuery();

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      setIsSearching(true);
      try {
        const url = getAllCoursesWithLimits({
          page: 1,
          limit: 100,
          status: 'Published',
          sort_by: 'rating',
          sort_order: 'desc'
        });

        const response = await getQuery({
          url: url,
          onSuccess: () => {},
          onError: () => {
            toast.error('Failed to fetch courses');
            setAllCourses([]);
            setSearchResults([]);
          }
        });

        if (response?.courses) {
          setAllCourses(response.courses);
          setSearchResults(response.courses);
        } else {
          setAllCourses([]);
          setSearchResults([]);
        }
      } catch (error) {
        toast.error('Failed to fetch courses');
        setAllCourses([]);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchAllCourses();
  }, [getQuery]);

  // Fetch search results with filters
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(allCourses);
      return;
    }

    setIsSearching(true);
    try {
      const url = getAllCoursesWithLimits({
        page: 1,
        limit: 10,
        search: query.trim(),
        status: 'Published',
        sort_by: 'rating',
        sort_order: 'desc'
      });

      const response = await getQuery({
        url: url,
        onSuccess: () => {},
        onError: () => {
          toast.error('Failed to fetch search results');
          setSearchResults([]);
        }
      });

      if (response?.courses) {
        setSearchResults(response.courses);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [getQuery, allCourses]);

  // Handle search input changes with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults(allCourses);
      } else {
        fetchSearchResults(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSearchResults, allCourses]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('course-search-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(true);
  };

  // Update form data whenever selected courses change
  React.useEffect(() => {
    setValue('related_courses', selectedCourses);
  }, [selectedCourses, setValue]);

  const addCourse = (course: Course) => {
    if (selectedCourses.some((c) => c.course_id === course._id)) {
      toast.warning('This course is already added');
      return;
    }

    setSelectedCourses([
      ...selectedCourses,
      {
        course_id: course._id,
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
        <div className="relative" id="course-search-dropdown">
          <label className="block text-sm font-medium text-gray-700">Search Courses</label>
          <div className="mt-1 relative">
            <div className="relative w-full">
              <div
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-text"
                onClick={() => setIsOpen(true)}
              >
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-1 outline-none border-none p-0 focus:ring-0 text-sm"
                    placeholder="Search by course title, category, or instructor..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {isOpen ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                {isSearching && (
                  <div className="p-4 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-customGreen"></div>
                      <span>Loading courses...</span>
                    </div>
                  </div>
                )}

                {!isSearching && (searchResults.length > 0 || (!searchQuery && allCourses.length > 0)) && (
                  <ul className="max-h-60 overflow-auto py-1">
                    {(searchQuery ? searchResults : allCourses).map((course) => (
                      <li
                        key={course._id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => {
                          addCourse(course);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">
                              by {course.instructor} • {course.category}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {course.level}
                            </span>
                            {course.rating && (
                              <span className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1">{course.rating}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No courses found matching "{searchQuery}"
                  </div>
                )}

                {!isSearching && !searchQuery && allCourses.length === 0 && (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No courses available
                  </div>
                )}
              </div>
            )}
          </div>
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