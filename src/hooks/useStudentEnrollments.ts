import { useState, useEffect } from 'react';
import EnrollmentAPI, { IEnrollment } from '@/apis/enrollment';

interface UseStudentEnrollmentsProps {
  studentId: string;
  initialData?: IEnrollment[];
}

interface UseStudentEnrollmentsResult {
  enrollments: IEnrollment[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useStudentEnrollments = ({ 
  studentId, 
  initialData = [] 
}: UseStudentEnrollmentsProps): UseStudentEnrollmentsResult => {
  const [enrollments, setEnrollments] = useState<IEnrollment[]>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData.length);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EnrollmentAPI.getStudentEnrollments(studentId);
      setEnrollments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch enrollments'));
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchEnrollments();
    }
  }, [studentId]);

  return {
    enrollments,
    loading,
    error,
    refetch: fetchEnrollments
  };
};

export default useStudentEnrollments; 