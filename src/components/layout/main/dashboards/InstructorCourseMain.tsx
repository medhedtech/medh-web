"use client";

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useGetQuery } from '@/hooks/getQuery.hook';
import { apiUrls } from '@/apis';
import { showToast } from '@/utils/toastManager';
import PublishContent from "../../../shared/dashboards/PublishContent";
import PendingContent from "../../../shared/dashboards/PendingContent";
import DraftContent from "../../../shared/dashboards/DraftContent";
import TabButtonSecondary from "../../../shared/buttons/TabButtonSecondary";
import TabContentWrapper from "../../../shared/wrappers/TabContentWrapper";
import useTab from "@/hooks/useTab";

interface Course {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_description: string;
  course_image: string;
  course_category: string;
  course_subcategory?: string;
  course_fee: number;
  course_duration: number;
  status: 'Draft' | 'Published' | 'Pending' | 'Archived';
  assigned_instructor?: {
    _id: string;
    full_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  no_of_Sessions?: number;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  language?: string;
  course_grade?: string;
  class_type?: string;
}

interface InstructorCoursesResponse {
  message: string;
  courses: Course[];
}

const InstructorCourseMain = () => {
  const { currentIdx, handleTabClick } = useTab();
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const { 
    getQuery: fetchInstructorCourses,
    data: coursesData,
    loading: coursesLoading,
    error: coursesError
  } = useGetQuery<InstructorCoursesResponse>();

  // Fetch instructor courses on component mount
  useEffect(() => {
    const loadInstructorCourses = async () => {
      if (!isAuthenticated || !user?._id) {
        setLoadingCourses(false);
        return;
      }

      try {
        setLoadingCourses(true);
        const response = await fetchInstructorCourses({
          url: apiUrls.Instructor.getInstructorCourses(user._id),
          requireAuth: true,
          showToast: false,
          onFail: (error) => {
            console.error('Failed to fetch instructor courses:', error);
            showToast.error('Failed to load your courses. Please try again.');
          }
        });

        if (response?.courses) {
          setCourses(response.courses);
        }
      } catch (error) {
        console.error('Error fetching instructor courses:', error);
        showToast.error('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    };

    loadInstructorCourses();
  }, [user?._id, isAuthenticated, fetchInstructorCourses]);

  // Update courses when API data changes
  useEffect(() => {
    if (coursesData?.courses) {
      setCourses(coursesData.courses);
    }
  }, [coursesData]);

  // Filter courses by status
  const publishedCourses = courses.filter(course => course.status === 'Published');
  const pendingCourses = courses.filter(course => course.status === 'Pending');
  const draftCourses = courses.filter(course => course.status === 'Draft');

  const tabbuttons = [
    {
      name: "PUBLISHED",
      content: <PublishContent courses={publishedCourses} loading={loadingCourses} />,
      count: publishedCourses.length
    },
    {
      name: "PENDING",
      content: <PendingContent courses={pendingCourses} loading={loadingCourses} />,
      count: pendingCourses.length
    },
    {
      name: "DRAFT",
      content: <DraftContent courses={draftCourses} loading={loadingCourses} />,
      count: draftCourses.length
    },
  ];

  // Show loading state if not authenticated or still loading
  if (!isAuthenticated) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-grayColor dark:text-grayColor-dark">
            Please log in to view your courses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Courses
        </h2>
        <p className="text-sm text-grayColor dark:text-grayColor-dark mt-2">
          Manage and track your teaching courses
        </p>
      </div>

      {coursesError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load courses. Please refresh the page to try again.
          </p>
        </div>
      )}

      <div>
        <div className="flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
          {tabbuttons?.map(({ name, count }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={`${name} (${count})`}
              idx={idx}
              currentIdx={currentIdx}
              handleTabClick={handleTabClick}
              button={"small"}
            />
          ))}
        </div>

        <div>
          {tabbuttons?.map(({ content }, idx) => (
            <TabContentWrapper
              key={idx}
              isShow={idx === currentIdx ? true : false}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:-mx-15px">
                {content}
              </div>
            </TabContentWrapper>
          ))}
        </div>

        {!loadingCourses && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-blackColor dark:text-blackColor-dark mb-2">
              No Courses Yet
            </h3>
            <p className="text-grayColor dark:text-grayColor-dark mb-6">
              You haven't been assigned any courses yet. Contact your administrator to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourseMain;
