import React, { useState, useEffect } from 'react';
import { liveClassesAPI } from '@/apis/liveClassesAPI';

const DataTestComponent: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testDataLoading = async () => {
      try {
        setLoading(true);
        console.log('🧪 Testing data loading in component...');
        
        const [studentsRes, instructorsRes] = await Promise.allSettled([
          liveClassesAPI.getStudents(),
          liveClassesAPI.getInstructors()
        ]);

        console.log('Component API Responses:', { studentsRes, instructorsRes });

        if (studentsRes.status === 'fulfilled') {
          const studentsData = studentsRes.value.data?.data?.items || studentsRes.value.data?.items || studentsRes.value.data || [];
          console.log('🔍 Raw students response:', studentsRes.value);
          console.log('🔍 Extracted students data:', studentsData);
          setStudents(Array.isArray(studentsData) ? studentsData : []);
          console.log('✅ Students loaded:', Array.isArray(studentsData) ? studentsData.length : 0);
        }

        if (instructorsRes.status === 'fulfilled') {
          const instructorsData = instructorsRes.value.data?.data?.items || instructorsRes.value.data?.items || instructorsRes.value.data || [];
          console.log('🔍 Raw instructors response:', instructorsRes.value);
          console.log('🔍 Extracted instructors data:', instructorsData);
          setInstructors(Array.isArray(instructorsData) ? instructorsData : []);
          console.log('✅ Instructors loaded:', Array.isArray(instructorsData) ? instructorsData.length : 0);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error in test component:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    testDataLoading();
  }, []);

  if (loading) return <div>Loading test data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Data Test Results</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Students ({Array.isArray(students) ? students.length : 0})</h4>
          <div className="space-y-1">
            {Array.isArray(students) && students.length > 0 ? (
              <>
                {students.slice(0, 3).map((student, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {student.full_name} ({student.email})
                  </div>
                ))}
                {students.length > 3 && (
                  <div className="text-sm text-gray-500">... and {students.length - 3} more</div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                No students data available
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Instructors ({Array.isArray(instructors) ? instructors.length : 0})</h4>
          <div className="space-y-1">
            {Array.isArray(instructors) && instructors.length > 0 ? (
              <>
                {instructors.slice(0, 3).map((instructor, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {instructor.full_name} ({instructor.email})
                  </div>
                ))}
                {instructors.length > 3 && (
                  <div className="text-sm text-gray-500">... and {instructors.length - 3} more</div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                No instructors data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTestComponent;
