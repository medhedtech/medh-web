import { useState, useEffect, useCallback, useMemo } from "react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { IGroupedEnrolledStudent } from "@/types/student.types";
import { formatDate } from "./useStudentManagement";

/**
 * Interface for an extended enrolled student with course enrollments
 */
interface IExtendedEnrolledStudent {
  student: {
    _id: string;
    email: string;
    full_name?: string;
    role: string[];
  };
  enrollments: Array<{
    _id: string;
    student_id: {
      _id: string;
      email: string;
      role: string[];
    };
    course_id: {
      _id: string;
      course_title: string;
      priceDisplay: string;
      id: string;
    };
    enrollment_type: string;
    batch_size: number;
    payment_status: string;
    enrollment_date: string;
    expiry_date: string;
    is_self_paced: boolean;
    status: string;
    is_completed: boolean;
    completed_on: string | null;
    is_certified: boolean;
    completed_lessons: any[];
    completed_assignments: any[];
    completed_quizzes: any[];
    progress: number;
    learning_path: string;
    last_accessed: string;
    notes: any[];
    bookmarks: any[];
    assignment_submissions: any[];
    quiz_submissions: any[];
    createdAt: string;
    updatedAt: string;
    remainingTime: number | null;
    id: string;
  }>;
}

/**
 * Custom hook for managing enrolled students
 * Handles fetching, filtering, and pagination of enrolled student data
 */
const useEnrolledStudents = () => {
  const { getQuery } = useGetQuery<any>();
  
  // State for enrolled students
  const [enrolledStudents, setEnrolledStudents] = useState<IExtendedEnrolledStudent[]>([]);
  const [enrolledStudentSearchQuery, setEnrolledStudentSearchQuery] = useState<string>("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Pagination info from API
  const [paginationInfo, setPaginationInfo] = useState({
    totalDocs: 0,
    limit: 10,
    totalPages: 0,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null as number | null,
    nextPage: null as number | null
  });

  // Toggle expanded row
  const toggleExpand = (rowId: string): void => {
    setExpandedRowId((prevExpandedRowId) =>
      prevExpandedRowId === rowId ? null : rowId
    );
  };

  // Pagination handlers
  const handlePageChange = (newPage: number): void => {
    setPagination(prev => ({ ...prev, page: newPage }));
    setPaginationInfo(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number): void => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    setPaginationInfo(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Fetch enrolled students with pagination
  const fetchEnrolledStudents = useCallback(async () => {
    try {
      setLoading(true);
      await getQuery({
        url: apiUrls?.enrolledCourses?.getAllStudentsWithEnrolledCourses({
          page: pagination.page,
          limit: pagination.limit
        }),
        onSuccess: (data) => {
          // Handle the new data structure
          if (data?.success && data?.data?.students) {
            const enrolledStudents = data.data.students as IExtendedEnrolledStudent[];
            setEnrolledStudents(enrolledStudents);
            
            // Update pagination with the new structure
            if (data.data.pagination) {
              setPaginationInfo(data.data.pagination);
              setPagination(prev => ({
                ...prev,
                total: data.data.pagination.totalDocs || 0
              }));
            }
          } else {
            setEnrolledStudents([]);
          }
        },
        onFail: () => setEnrolledStudents([]),
      });
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    } finally {
      setLoading(false);
    }
  }, [getQuery, pagination.page, pagination.limit]);

  // Fetch enrolled students on mount and when pagination changes
  useEffect(() => {
    fetchEnrolledStudents();
  }, [fetchEnrolledStudents]);

  // Step 1: To group the course and the enrolled students
  const groupEnrolledStudentsByCourse = useMemo(() => {
    return (Array.isArray(enrolledStudents) ? enrolledStudents : []).reduce<Record<string, any>>(
      (acc, entry) => {
        // Handle the new data structure
        const student = entry?.student || {};
        const enrollments = entry?.enrollments || [];
        const studentId = student?._id;
  
        if (!acc[studentId]) {
          acc[studentId] = {
            ...student,
            courses: [],
            enrollment_date: enrollments.length > 0 ? formatDate(enrollments[0].enrollment_date) : "N/A",
          };
        }
  
        // Add all courses from enrollments
        enrollments.forEach((enrollment: any) => {
          if (enrollment.course_id && enrollment.course_id.course_title) {
            acc[studentId].courses.push(enrollment.course_id.course_title);
          }
        });
  
        return acc;
      },
      {}
    );
  }, [enrolledStudents]);
  
  // Step 2: Filter the grouped data based on the search query
  const filteredGroupedEnrolledStudents: IGroupedEnrolledStudent[] = useMemo(() => {
    return Object.values(groupEnrolledStudentsByCourse)
      .filter((student: any) => {
        const studentMatches =
          student?.full_name
            ?.toLowerCase()
            .includes(enrolledStudentSearchQuery.toLowerCase()) ||
          student?.email
            ?.toLowerCase()
            .includes(enrolledStudentSearchQuery.toLowerCase()) ||
          student?.courses?.some((course: string) =>
            course
              .toLowerCase()
              .includes(enrolledStudentSearchQuery.toLowerCase())
          );

        return studentMatches;
      })
      .map((student: any, index: number) => ({
        no: index + 1,
        full_name: student?.full_name || "N/A",
        email: student?.email || "N/A",
        courses: student?.courses.join(", ") || "No Courses",
        enrollment_date: student?.enrollment_date || "N/A",
        _id: student?._id,
      }));
  }, [groupEnrolledStudentsByCourse, enrolledStudentSearchQuery]);

  return {
    enrolledStudents,
    enrolledStudentSearchQuery,
    setEnrolledStudentSearchQuery,
    expandedRowId,
    toggleExpand,
    pagination,
    paginationInfo,
    handlePageChange,
    handleLimitChange,
    loading,
    filteredGroupedEnrolledStudents,
    fetchEnrolledStudents,
  };
};

export default useEnrolledStudents; 