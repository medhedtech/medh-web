import React, { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { PlusCircle, MinusCircle, GripVertical, Clock, BookOpen, Video, FileText, HelpCircle, Link, File, Download, Calendar, Users, Upload } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import axios from 'axios';
import { apiBaseUrl, apiUrls } from '@/apis';
import { 
  ICourseFormData, 
  ICurriculumWeek, 
  ISection, 
  ILesson, 
  ILessonResource,
  IVideoLesson,
  IQuizLesson,
  IAssessmentLesson,
  IBaseLessonFields,
  LessonType,
  MaterialType
} from '@/types/course.types';
import { v4 as uuidv4 } from 'uuid';
import { useUpload } from '@/hooks/useUpload';
import FileUpload from '@/components/shared/FileUpload';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/services/uploadService';
import { getAuthToken, isAuthenticated } from '@/utils/auth';

// Keep only the ILiveClass interface since it's not in the types file
interface ILiveClass {
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number;
  meetingLink?: string;
  instructor?: string | null;  // Changed to allow null
  recordingUrl?: string;
  isRecorded: boolean;
  materials: IMaterial[];
}

interface IMaterial {
  title: string;
  type: MaterialType;
  url: string;
}

interface CourseCurriculumProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: FormState<ICourseFormData>;
  watch: any;
}

// Constants
const LESSON_TYPES = [
  { value: 'video', label: 'Video Lesson', icon: Video },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'assessment', label: 'Assignment', icon: FileText }
];

const RESOURCE_TYPES = [
  { value: 'pdf', label: 'PDF Document', icon: File },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'audio', label: 'Audio', icon: FileText },
  { value: 'link', label: 'External Link', icon: Link }
] as const;

const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF', icon: File },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'presentation', label: 'Presentation', icon: FileText },
  { value: 'code', label: 'Code', icon: FileText },
  { value: 'other', label: 'Other', icon: File }
] as const;

// Add new interfaces for video upload
interface IVideoUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface IVideoData {
  url: string;
  duration: string;
  thumbnail?: string;
  size?: number;
}

// Add new interfaces for Quiz and Assignment
interface IQuiz {
  _id: string;
  title: string;
  duration: string;
  total_questions: number;
  attempts_allowed: number;
}

interface IAssignment {
  _id: string;
  title: string;
  description: string;
  total_marks: number;
  due_date: string;
}

// Add new interface for video upload progress
interface IVideoUploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [weeks, setWeeks] = useState<ICurriculumWeek[]>([]);

  // Add state for quizzes and assignments
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [isLoading, setIsLoading] = useState({
    quizzes: false,
    assignments: false
  });
  const [loadingError, setLoadingError] = useState({
    quizzes: '',
    assignments: ''
  });
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string; parentId?: string } | null>(null);
  const [videoUploads, setVideoUploads] = useState<{ [key: string]: IVideoUploadState }>({});
  const [videoData, setVideoData] = useState<{ [key: string]: IVideoData }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: IVideoUploadProgress }>({});
  const { uploadFile, uploadMultipleFiles, isUploading } = useUpload({
    onSuccess: (response) => {
      showToast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Helper function to generate IDs
  const generateId = (prefix: string, ...indices: number[]): string => {
    return `${prefix}_${indices.join('_')}`;
  };

  // Fetch quizzes and assignments when component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }

        setIsLoading(prev => ({ ...prev, quizzes: true }));
        setLoadingError(prev => ({ ...prev, quizzes: '' }));
        
        const courseId = watch('_id');
        if (courseId) {
          const response = await axios.get(
            `${apiBaseUrl}${apiUrls.courses.getCourseQuizzes(courseId)}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          setQuizzes(response.data.data || []);
        }
      } catch (error: any) {
        console.error('Error fetching quizzes:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch quizzes. Please try again.';
        setLoadingError(prev => ({ 
          ...prev, 
          quizzes: errorMessage
        }));
        toast.error(errorMessage);
      } finally {
        setIsLoading(prev => ({ ...prev, quizzes: false }));
      }
    };

    const fetchAssignments = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }

        setIsLoading(prev => ({ ...prev, assignments: true }));
        setLoadingError(prev => ({ ...prev, assignments: '' }));
        
        const courseId = watch('_id');
        if (courseId) {
          const response = await axios.get(
            `${apiBaseUrl}${apiUrls.courses.getCourseAssignments(courseId)}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          setAssignments(response.data.data || []);
        }
      } catch (error: any) {
        console.error('Error fetching assignments:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch assignments. Please try again.';
        setLoadingError(prev => ({ 
          ...prev, 
          assignments: errorMessage
        }));
        toast.error(errorMessage);
      } finally {
        setIsLoading(prev => ({ ...prev, assignments: false }));
      }
    };

    fetchQuizzes();
    fetchAssignments();
  }, [watch]);

  useEffect(() => {
    const currentCurriculum = watch('curriculum') || [];
    if (currentCurriculum.length === 0) {
      const initialWeek = createNewWeek();
      setValue('curriculum', [initialWeek]);
      setWeeks([initialWeek]);
    } else {
      // Ensure all weeks have properly initialized sections, lessons and liveClasses arrays
      const formattedWeeks = currentCurriculum.map(week => ({
        ...week,
        sections: week.sections || [],
        lessons: week.lessons || [],
        liveClasses: week.liveClasses || []
      }));
      
      setWeeks(formattedWeeks);
      setValue('curriculum', formattedWeeks);
    }
  }, []);

  const handleAddWeek = () => {
    const newWeek = createNewWeek();
    setWeeks([...weeks, newWeek]);
  };

  const handleAddSection = (weekIndex: number) => {
    const updatedWeeks = [...weeks];
    const newSection = createNewSection();
    newSection.order = updatedWeeks[weekIndex].sections.length;
    updatedWeeks[weekIndex].sections.push(newSection);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  const handleAddLesson = (weekIndex: number, sectionIndex: number, type: 'video' | 'quiz' | 'assessment') => {
    const updatedWeeks = [...weeks];
    const newLesson = createNewLesson(type);
    const section = updatedWeeks[weekIndex].sections[sectionIndex];
    section.lessons.push(newLesson);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Enhanced drag and drop handlers
  const handleDragStart = (type: string, id: string, parentId?: string) => {
    setDraggedItem({ type, id, parentId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetType: string, targetId: string) => {
    if (!draggedItem) return;

    // Implement drag and drop logic based on type
    if (draggedItem.type === 'section' && targetType === 'week') {
      // Move section between weeks
      const newCurriculum = reorderSections(targetId);
      setWeeks(newCurriculum);
    } else if (draggedItem.type === 'lesson' && targetType === 'section') {
      // Move lesson between sections
      const newCurriculum = reorderLessons(targetId);
      setWeeks(newCurriculum);
    } else if (draggedItem.type === 'direct_lesson' && targetType === 'week') {
      // Move direct lesson between weeks
      const newCurriculum = reorderDirectLessons(targetId);
      setWeeks(newCurriculum);
    } else if (draggedItem.type === 'direct_lesson' && targetType === 'section') {
      // Move direct lesson to a section
      const newCurriculum = moveDirectLessonToSection(targetId);
      setWeeks(newCurriculum);
    } else if (draggedItem.type === 'lesson' && targetType === 'week') {
      // Move section lesson to direct lesson
      const newCurriculum = moveSectionLessonToWeek(targetId);
      setWeeks(newCurriculum);
    }

    setDraggedItem(null);
  };

  const reorderSections = (targetWeekId: string): ICurriculumWeek[] => {
    if (!draggedItem) return weeks;

    // Find source and target weeks
    const sourceWeekIndex = weeks.findIndex(week => 
      week.sections.some(section => section.id === draggedItem.id)
    );
    
    const targetWeekIndex = weeks.findIndex(week => week.id === targetWeekId);
    
    if (sourceWeekIndex === -1 || targetWeekIndex === -1) return weeks;
    
    // Find the section to move
    const sourceWeek = weeks[sourceWeekIndex];
    const sectionIndex = sourceWeek.sections.findIndex(s => s.id === draggedItem.id);
    const sectionToMove = { ...sourceWeek.sections[sectionIndex] };
    
    // Create new curriculum with the section moved
    const newCurriculum = [...weeks];
    
    // Remove from source
    newCurriculum[sourceWeekIndex] = {
      ...sourceWeek,
      sections: sourceWeek.sections.filter(s => s.id !== draggedItem.id)
    };
    
    // Add to target
    const targetWeek = { ...newCurriculum[targetWeekIndex] };
    newCurriculum[targetWeekIndex] = {
      ...targetWeek,
      sections: [...targetWeek.sections, sectionToMove]
    };
    
    // Update order in target week
    newCurriculum[targetWeekIndex].sections.forEach((section, idx) => {
      section.order = idx + 1;
    });
    
    return newCurriculum;
  };

  const reorderLessons = (targetSectionId: string): ICurriculumWeek[] => {
    if (!draggedItem) return weeks;
    
    // Find the source section and lesson
    let sourceSectionId = '';
    let sourceWeekIndex = -1;
    let sourceSectionIndex = -1;
    
    // Find the lesson to move
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      for (let s = 0; s < week.sections.length; s++) {
        const section = week.sections[s];
        const lessonIndex = section.lessons.findIndex(l => l.id === draggedItem.id);
        if (lessonIndex !== -1) {
          sourceSectionId = section.id;
          sourceWeekIndex = w;
          sourceSectionIndex = s;
          break;
        }
      }
      if (sourceWeekIndex !== -1) break;
    }
    
    if (sourceWeekIndex === -1 || sourceSectionIndex === -1) return weeks;
    
    // Find the target section
    let targetWeekIndex = -1;
    let targetSectionIndex = -1;
    
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      for (let s = 0; s < week.sections.length; s++) {
        const section = week.sections[s];
        if (section.id === targetSectionId) {
          targetWeekIndex = w;
          targetSectionIndex = s;
          break;
        }
      }
      if (targetWeekIndex !== -1) break;
    }
    
    if (targetWeekIndex === -1 || targetSectionIndex === -1) return weeks;
    
    // Check if source and target are the same
    if (sourceSectionId === targetSectionId) return weeks;
    
    // Get the lesson to move
    const sourceSection = weeks[sourceWeekIndex].sections[sourceSectionIndex];
    const lessonIndex = sourceSection.lessons.findIndex(l => l.id === draggedItem.id);
    const lessonToMove = { ...sourceSection.lessons[lessonIndex] };
    
    // Create new curriculum
    const newCurriculum = [...weeks];
    
    // Remove from source
    newCurriculum[sourceWeekIndex].sections[sourceSectionIndex] = {
      ...sourceSection,
      lessons: sourceSection.lessons.filter(l => l.id !== draggedItem.id)
    };
    
    // Add to target
    const targetSection = { ...newCurriculum[targetWeekIndex].sections[targetSectionIndex] };
    newCurriculum[targetWeekIndex].sections[targetSectionIndex] = {
      ...targetSection,
      lessons: [...targetSection.lessons, lessonToMove]
    };
    
    // Update order in both sections
    newCurriculum[sourceWeekIndex].sections[sourceSectionIndex].lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    
    newCurriculum[targetWeekIndex].sections[targetSectionIndex].lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    
    return newCurriculum;
  };

  // Add new functions for direct lesson drag and drop
  const reorderDirectLessons = (targetWeekId: string): ICurriculumWeek[] => {
    if (!draggedItem) return weeks;
    
    // Find source week
    const sourceWeekIndex = weeks.findIndex(week => 
      week.lessons && week.lessons.some(lesson => lesson.id === draggedItem.id)
    );
    
    const targetWeekIndex = weeks.findIndex(week => week.id === targetWeekId);
    
    if (sourceWeekIndex === -1 || targetWeekIndex === -1 || sourceWeekIndex === targetWeekIndex) return weeks;
    
    // Find the lesson to move
    const sourceWeek = weeks[sourceWeekIndex];
    if (!sourceWeek.lessons) return weeks;
    
    const lessonIndex = sourceWeek.lessons.findIndex(l => l.id === draggedItem.id);
    const lessonToMove = { ...sourceWeek.lessons[lessonIndex] };
    
    // Create new curriculum with the lesson moved
    const newCurriculum = [...weeks];
    
    // Remove from source
    newCurriculum[sourceWeekIndex] = {
      ...sourceWeek,
      lessons: sourceWeek.lessons.filter(l => l.id !== draggedItem.id)
    };
    
    // Add to target
    const targetWeek = { ...newCurriculum[targetWeekIndex] };
    if (!targetWeek.lessons) targetWeek.lessons = [];
    
    newCurriculum[targetWeekIndex] = {
      ...targetWeek,
      lessons: [...targetWeek.lessons, lessonToMove]
    };
    
    // Update order in both weeks
    if (newCurriculum[sourceWeekIndex].lessons) {
      newCurriculum[sourceWeekIndex].lessons.forEach((lesson, idx) => {
        lesson.order = idx + 1;
      });
    }
    
    newCurriculum[targetWeekIndex].lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    
    return newCurriculum;
  };

  const moveDirectLessonToSection = (targetSectionId: string): ICurriculumWeek[] => {
    if (!draggedItem) return weeks;
    
    // Find source week and the lesson to move
    let sourceWeekIndex = -1;
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      if (week.lessons && week.lessons.some(l => l.id === draggedItem.id)) {
        sourceWeekIndex = w;
        break;
      }
    }
    
    if (sourceWeekIndex === -1) return weeks;
    
    // Find target section
    let targetWeekIndex = -1;
    let targetSectionIndex = -1;
    
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      for (let s = 0; s < week.sections.length; s++) {
        const section = week.sections[s];
        if (section.id === targetSectionId) {
          targetWeekIndex = w;
          targetSectionIndex = s;
          break;
        }
      }
      if (targetWeekIndex !== -1) break;
    }
    
    if (targetWeekIndex === -1 || targetSectionIndex === -1) return weeks;
    
    // Get the lesson to move
    const sourceWeek = weeks[sourceWeekIndex];
    if (!sourceWeek.lessons) return weeks;
    
    const lessonIndex = sourceWeek.lessons.findIndex(l => l.id === draggedItem.id);
    const lessonToMove = { ...sourceWeek.lessons[lessonIndex] };
    
    // Create new curriculum
    const newCurriculum = [...weeks];
    
    // Remove from source
    newCurriculum[sourceWeekIndex] = {
      ...sourceWeek,
      lessons: sourceWeek.lessons.filter(l => l.id !== draggedItem.id)
    };
    
    // Add to target section
    const targetSection = newCurriculum[targetWeekIndex].sections[targetSectionIndex];
    newCurriculum[targetWeekIndex].sections[targetSectionIndex] = {
      ...targetSection,
      lessons: [...targetSection.lessons, lessonToMove]
    };
    
    // Update order in source and target
    if (newCurriculum[sourceWeekIndex].lessons) {
      newCurriculum[sourceWeekIndex].lessons.forEach((lesson, idx) => {
        lesson.order = idx + 1;
      });
    }
    
    newCurriculum[targetWeekIndex].sections[targetSectionIndex].lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    
    return newCurriculum;
  };

  const moveSectionLessonToWeek = (targetWeekId: string): ICurriculumWeek[] => {
    if (!draggedItem || !draggedItem.parentId) return weeks;
    
    // Find source section and lesson
    let sourceWeekIndex = -1;
    let sourceSectionIndex = -1;
    
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      for (let s = 0; s < week.sections.length; s++) {
        const section = week.sections[s];
        if (section.id === draggedItem.parentId) {
          sourceWeekIndex = w;
          sourceSectionIndex = s;
          break;
        }
      }
      if (sourceWeekIndex !== -1) break;
    }
    
    if (sourceWeekIndex === -1 || sourceSectionIndex === -1) return weeks;
    
    // Find target week
    const targetWeekIndex = weeks.findIndex(week => week.id === targetWeekId);
    if (targetWeekIndex === -1) return weeks;
    
    // Get the lesson to move
    const sourceSection = weeks[sourceWeekIndex].sections[sourceSectionIndex];
    const lessonIndex = sourceSection.lessons.findIndex(l => l.id === draggedItem.id);
    const lessonToMove = { ...sourceSection.lessons[lessonIndex] };
    
    // Create new curriculum
    const newCurriculum = [...weeks];
    
    // Remove from source section
    newCurriculum[sourceWeekIndex].sections[sourceSectionIndex] = {
      ...sourceSection,
      lessons: sourceSection.lessons.filter(l => l.id !== draggedItem.id)
    };
    
    // Add to target week
    const targetWeek = newCurriculum[targetWeekIndex];
    if (!targetWeek.lessons) targetWeek.lessons = [];
    
    newCurriculum[targetWeekIndex] = {
      ...targetWeek,
      lessons: [...targetWeek.lessons, lessonToMove]
    };
    
    // Update order in source and target
    newCurriculum[sourceWeekIndex].sections[sourceSectionIndex].lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    
    newCurriculum[targetWeekIndex].lessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });
    
    return newCurriculum;
  };

  // Add week
  const addWeek = () => {
    const newWeek = createNewWeek();
    setWeeks([...weeks, newWeek]);
  };

  // Remove week
  const removeWeek = (weekIndex: number) => {
    const updatedWeeks = weeks.filter((_, index) => index !== weekIndex);
    // Update IDs to maintain consistency
    updatedWeeks.forEach((week, index) => {
      week.id = generateId('week', index + 1);
      
      // Update section and lesson IDs
      week.sections.forEach((section, sIndex) => {
        section.id = generateId('section', index + 1, sIndex + 1);
        
        section.lessons.forEach((lesson, lIndex) => {
          lesson.id = generateId('lesson', index + 1, sIndex + 1, lIndex + 1);
          
          lesson.resources.forEach((resource, rIndex) => {
            resource.id = generateId('resource', index + 1, sIndex + 1, lIndex + 1, rIndex + 1);
          });
        });
      });
      
      // Update direct lesson IDs if present
      if (week.lessons) {
        week.lessons.forEach((lesson, lIndex) => {
          lesson.id = generateId('lesson_direct', index + 1, lIndex + 1);
          
          lesson.resources.forEach((resource, rIndex) => {
            resource.id = generateId('resource_direct', index + 1, lIndex + 1, rIndex + 1);
          });
        });
      }
    });
    
    setWeeks(updatedWeeks);
  };

  // Section functions
  const addSection = (weekIndex: number) => {
    const updatedWeeks = [...weeks];
    const newSectionNumber = updatedWeeks[weekIndex].sections.length + 1;
    
    updatedWeeks[weekIndex].sections.push({
      id: generateId('section', weekIndex + 1, newSectionNumber),
      title: `Section ${newSectionNumber}`,
      description: '',
      order: newSectionNumber,
      resources: [],
      lessons: []
    });
    
    setWeeks(updatedWeeks);
  };

  const removeSection = (weekIndex: number, sectionIndex: number) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].sections = updatedWeeks[weekIndex].sections.filter(
      (_, index) => index !== sectionIndex
    );
    
    // Update section orders
    updatedWeeks[weekIndex].sections.forEach((section, index) => {
      section.order = index + 1;
      section.id = generateId('section', weekIndex + 1, index + 1);
      
      // Update lesson IDs
      section.lessons.forEach((lesson, lIndex) => {
        lesson.order = lIndex + 1;
        lesson.id = generateId('lesson', weekIndex + 1, index + 1, lIndex + 1);
        
        // Update resource IDs
        lesson.resources.forEach((resource, rIndex) => {
          resource.id = generateId('resource', weekIndex + 1, index + 1, lIndex + 1, rIndex + 1);
        });
      });
    });
    
    setWeeks(updatedWeeks);
  };

  // Lesson functions
  const addLesson = (weekIndex: number, sectionIndex: number, type: 'video' | 'quiz' | 'assessment' = 'video') => {
    const updatedWeeks = [...weeks];
    const newLesson = createNewLesson(type);
    const section = updatedWeeks[weekIndex].sections[sectionIndex];
    section.lessons.push(newLesson);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  const removeLesson = (weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].sections[sectionIndex].lessons = 
      updatedWeeks[weekIndex].sections[sectionIndex].lessons.filter(
        (_, index) => index !== lessonIndex
      );
      
    // Update lesson orders
    updatedWeeks[weekIndex].sections[sectionIndex].lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
      lesson.id = generateId('lesson', weekIndex + 1, sectionIndex + 1, index + 1);
      
      // Update resource IDs
      lesson.resources.forEach((resource, rIndex) => {
        resource.id = generateId('resource', weekIndex + 1, sectionIndex + 1, index + 1, rIndex + 1);
      });
    });
    
    setWeeks(updatedWeeks);
  };

  // Resource functions
  const addResource = (weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const updatedWeeks = [...weeks];
    const lesson = updatedWeeks[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    
    const newResource: ILessonResource = {
      id: generateId('resource', weekIndex + 1, sectionIndex + 1, lessonIndex + 1, lesson.resources.length + 1),
      title: '',
      url: '',
      type: 'pdf',
      description: ''
    };
    
    lesson.resources.push(newResource);
    setWeeks(updatedWeeks);
  };

  const removeResource = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number
  ) => {
    const updatedWeeks = [...weeks];
    const lesson = updatedWeeks[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    lesson.resources = lesson.resources.filter((_, index) => index !== resourceIndex);
    
    // Update resource IDs
    lesson.resources.forEach((resource, index) => {
      resource.id = generateId('resource', weekIndex + 1, sectionIndex + 1, lessonIndex + 1, index + 1);
    });
    
    setWeeks(updatedWeeks);
  };

  // Update functions
  const updateWeek = (weekIndex: number, field: keyof ICurriculumWeek, value: string) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex] = {
      ...updatedWeeks[weekIndex],
      [field]: value
    };
    setWeeks(updatedWeeks);
  };

  const updateSection = (
    weekIndex: number,
    sectionIndex: number,
    field: keyof ISection,
    value: string
  ) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].sections[sectionIndex] = {
      ...updatedWeeks[weekIndex].sections[sectionIndex],
      [field]: value
    };
    setWeeks(updatedWeeks);
  };

  // Create a unified function to update both direct lessons and section lessons
  const updateLesson = (
    weekIndex: number,
    lessonIndex: number,
    field: keyof IBaseLessonFields | 'video_url' | 'duration' | 'quiz_id' | 'assignment_id',
    value: string | boolean | number,
    sectionIndex?: number
  ) => {
    const updatedWeeks = [...weeks];
    const week = updatedWeeks[weekIndex];
    
    let lesson;
    
    // Determine if this is a direct lesson or section lesson
    if (sectionIndex !== undefined) {
      // Section lesson
      lesson = week.sections[sectionIndex].lessons[lessonIndex];
    } else {
      // Direct lesson
      if (!week.lessons) {
        week.lessons = [];
        return;
      }
      lesson = week.lessons[lessonIndex];
    }
    
    if (!lesson) return;
    
    // Add validation for title field
    if (field === 'title' && typeof value === 'string' && !value.trim()) {
      toast.warning('Lesson title is required');
    }
    
    // Handle type-specific fields
    switch (lesson.lessonType) {
      case 'video': {
        const videoLesson = lesson as IVideoLesson;
        if (field === 'video_url' || field === 'duration') {
          // Add validation for video URL
          if (field === 'video_url' && typeof value === 'string' && !value.trim()) {
            toast.warning('Video URL is required for video lessons');
          }
          (videoLesson as any)[field] = value;
        }
        break;
      }
      case 'quiz': {
        const quizLesson = lesson as IQuizLesson;
        if (field === 'quiz_id') {
          quizLesson.quiz_id = value as string;
        }
        break;
      }
      case 'assessment': {
        const assessmentLesson = lesson as IAssessmentLesson;
        if (field === 'assignment_id') {
          assessmentLesson.assignment_id = value as string;
        }
        break;
      }
    }

    // Handle common fields
    if (field in lesson) {
      const commonField = field as keyof IBaseLessonFields;
      (lesson as any)[commonField] = value;
    }
    
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  const updateResource = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number,
    field: keyof ILessonResource,
    value: string
  ) => {
    const updatedWeeks = [...weeks];
    const lesson = updatedWeeks[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    updatedWeeks[weekIndex].sections[sectionIndex].lessons[lessonIndex] = {
      ...lesson,
      resources: lesson.resources.map((resource, index) =>
        index === resourceIndex ? { ...resource, [field]: value } : resource
      )
    };
    setWeeks(updatedWeeks);
  };

  // Add live class
  const addLiveClass = (weekIndex: number) => {
    const updatedWeeks = [...weeks];
    const newLiveClass: ILiveClass = {
      title: '',
      description: '',
      scheduledDate: new Date(),
      duration: 60,
      meetingLink: '',
      instructor: null,  // Changed from empty string to null
      recordingUrl: '',
      isRecorded: false,
      materials: []
    };
    
    updatedWeeks[weekIndex].liveClasses.push(newLiveClass);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Remove live class
  const removeLiveClass = (weekIndex: number, liveClassIndex: number) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].liveClasses = 
      updatedWeeks[weekIndex].liveClasses.filter((_, index) => index !== liveClassIndex);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Update live class
  const updateLiveClass = (
    weekIndex: number,
    liveClassIndex: number,
    field: keyof ILiveClass,
    value: any
  ) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].liveClasses[liveClassIndex] = {
      ...updatedWeeks[weekIndex].liveClasses[liveClassIndex],
      [field]: value
    };
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Add material to live class
  const addMaterial = (weekIndex: number, liveClassIndex: number) => {
    const updatedWeeks = [...weeks];
    const newMaterial: IMaterial = {
      title: '',
      url: '',
      type: 'pdf'
    };
    
    updatedWeeks[weekIndex].liveClasses[liveClassIndex].materials.push(newMaterial);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Remove material from live class
  const removeMaterial = (weekIndex: number, liveClassIndex: number, materialIndex: number) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].liveClasses[liveClassIndex].materials = 
      updatedWeeks[weekIndex].liveClasses[liveClassIndex].materials.filter(
        (_, index) => index !== materialIndex
      );
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Update material
  const updateMaterial = (
    weekIndex: number,
    liveClassIndex: number,
    materialIndex: number,
    field: keyof IMaterial,
    value: string
  ) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].liveClasses[liveClassIndex].materials[materialIndex][field] = 
      value as any;
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Add direct lesson to week
  const addDirectLesson = (weekIndex: number, type: LessonType = 'video') => {
    const updatedWeeks = [...weeks];
    const week = updatedWeeks[weekIndex];
    const newLessonNumber = (week.lessons || []).length + 1;
    
    const baseLesson = {
      id: uuidv4(),
      title: '',
      description: '',
      order: newLessonNumber,
      isPreview: false,
      meta: {},
      resources: [] as ILessonResource[],
      lessonType: type
    };

    const newLesson = (() => {
      switch (type) {
        case 'video':
          return {
            ...baseLesson,
            lessonType: 'video' as const,
            video_url: '',
            duration: ''
          };
        case 'quiz':
          return {
            ...baseLesson,
            lessonType: 'quiz' as const,
            quiz_id: ''
          };
        case 'assessment':
          return {
            ...baseLesson,
            lessonType: 'assessment' as const,
            assignment_id: ''
          };
      }
    })();

    if (!week.lessons) {
      week.lessons = [];
    }
    
    week.lessons.push(newLesson);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Remove direct lesson from week
  const removeDirectLesson = (weekIndex: number, lessonIndex: number) => {
    const updatedWeeks = [...weeks];
    const week = updatedWeeks[weekIndex];
    
    if (week.lessons) {
      week.lessons = week.lessons.filter((_, index) => index !== lessonIndex);
      
      // Update lesson orders and IDs
      week.lessons.forEach((lesson, index) => {
        lesson.order = index + 1;
        lesson.id = generateId('lesson_direct', weekIndex + 1, index + 1);
        
        // Update resource IDs
        lesson.resources.forEach((resource, rIndex) => {
          resource.id = generateId('resource_direct', weekIndex + 1, index + 1, rIndex + 1);
        });
      });
    }
    
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Update direct lesson
  const updateDirectLesson = (
    weekIndex: number,
    lessonIndex: number,
    field: keyof IBaseLessonFields | keyof IVideoLesson | keyof IQuizLesson | keyof IAssessmentLesson,
    value: string | boolean
  ) => {
    updateLesson(weekIndex, lessonIndex, field as any, value);
  };

  const createNewResource = (): ILessonResource => ({
    id: uuidv4(),
    title: '',
    url: '',
    type: 'pdf',
    description: ''
  });

  const createNewLesson = (type: LessonType): ILesson => {
    const baseLesson = {
      id: uuidv4(),
      title: '',
      description: '',
      order: 0,
      isPreview: false,
      meta: {},
      resources: [] as ILessonResource[],
      lessonType: type
    };

    switch (type) {
      case 'video':
        return {
          ...baseLesson,
          lessonType: 'video' as const,
          video_url: '',
          duration: ''
        };
      case 'quiz':
        return {
          ...baseLesson,
          lessonType: 'quiz' as const,
          quiz_id: ''
        };
      case 'assessment':
        return {
          ...baseLesson,
          lessonType: 'assessment' as const,
          assignment_id: ''
        };
    }
  };

  const createNewSection = (): ISection => ({
    id: uuidv4(),
    title: '',
    description: '',
    order: 0,
    lessons: [],
    resources: []
  });

  const createNewWeek = (): ICurriculumWeek => ({
    id: uuidv4(),
    weekNumber: weeks.length + 1,
    weekTitle: '',
    weekDescription: '',
    topics: [],
    sections: [],
    liveClasses: [],
    lessons: []
  });

  // Improved video upload handler
  const handleVideoUpload = async (
    file: File,
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number
  ) => {
    const lessonId = weeks[weekIndex].sections[sectionIndex].lessons[lessonIndex].id;

    // Check authentication first
    if (!isAuthenticated()) {
      toast.error('Your session has expired. Please login again.');
      return;
    }

    // Get auth token
    const token = getAuthToken();
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setUploadProgress(prev => ({
      ...prev,
      [lessonId]: { progress: 0, status: 'uploading' }
    }));

    try {
      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result); // This will include the data:image/jpeg;base64, prefix
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file); // This automatically adds the data:mimetype;base64, prefix
      });

      // // First verify the token is still valid
      // try {
      //   await axios.get(`${apiBaseUrl}/auth/verify`, {
      //     headers: { 'Authorization': `Bearer ${token}` }
      //   });
      // } catch (authError) {
      //   throw new Error('Authentication failed. Please login again.');
      // }

      // Upload the base64 file
      const response = await axios.post(
        `${apiBaseUrl}${apiUrls.upload.uploadBase64}`,
        {
          base64String,
          fileType: 'video'
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true, // Add this line
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 0)
            );
            setUploadProgress(prev => ({
              ...prev,
              [lessonId]: { ...prev[lessonId], progress }
            }));
          }
        }
      );

      // Log response for debugging
      console.log('Upload response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      // Update video data
      const { url, duration, thumbnail } = response.data.data;
      setVideoData(prev => ({
        ...prev,
        [lessonId]: { url, duration, thumbnail, size: file.size }
      }));

      // Update lesson with video URL and duration
      updateLesson(weekIndex, lessonIndex, 'video_url', url, sectionIndex);
      if (duration) {
        updateLesson(weekIndex, lessonIndex, 'duration', duration, sectionIndex);
      }

      setUploadProgress(prev => ({
        ...prev,
        [lessonId]: { progress: 100, status: 'complete' }
      }));

      showToast.success('Video uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading video:', error);
      console.error('Error details:', {
        response: error.response?.data,
        request: error.request,
        message: error.message
      });
      
      // Handle different types of errors
      let errorMessage = 'Failed to upload video. Please try again.';
      
      if (error.response) {
        // Server responded with error
        switch (error.response.status) {
          case 401:
            errorMessage = 'Your session has expired. Please login again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to upload files.';
            break;
          case 413:
            errorMessage = 'File size too large. Please choose a smaller file.';
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Invalid request format';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Error before making request (like auth error)
        errorMessage = error.message || errorMessage;
      }

      setUploadProgress(prev => ({
        ...prev,
        [lessonId]: {
          progress: 0,
          status: 'error',
          error: errorMessage
        }
      }));
      toast.error(errorMessage);

      // If authentication error, you might want to trigger a logout or redirect
      if (error.response?.status === 401 || error.message.includes('Authentication failed')) {
        // Trigger logout or redirect to login
        console.error('Authentication failed, user should be redirected to login');
      }
    }
  };

  // Improved video preview component
  const VideoPreview: React.FC<{
    videoUrl: string;
    thumbnail?: string;
    duration?: string;
    size?: number;
    onRemove: () => void;
  }> = ({ videoUrl, thumbnail, duration, size, onRemove }) => (
    <div className="mt-2 rounded-lg border border-gray-200 p-4">
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 mb-2">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video thumbnail"
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="bg-gray-100 rounded-lg flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
        >
          <MinusCircle size={16} />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration || 'Processing...'}</span>
        </div>
        {size && (
          <div className="flex items-center text-sm text-gray-500">
            <File className="h-4 w-4 mr-1" />
            <span>{Math.round(size / 1024 / 1024)}MB</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-customGreen hover:text-green-700 flex items-center"
        >
          <Link className="h-4 w-4 mr-1" />
          View Video
        </a>
      </div>
    </div>
  );

  // Modify the renderVideoUpload function to handle both section lessons and direct lessons
  const renderVideoUpload = (weekIndex: number, sectionIndexOrWeekIndex: number, lessonIndex: number, lesson: any, isDirectLesson: boolean = false) => {
    const lessonId = lesson.id;
    const progress = uploadProgress[lessonId];
    const videoInfo = videoData[lessonId];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Video Upload
        </label>
        
        {lesson.video_url ? (
          <VideoPreview
            videoUrl={lesson.video_url}
            thumbnail={videoInfo?.thumbnail}
            duration={lesson.duration}
            size={videoInfo?.size}
            onRemove={() => {
              if (isDirectLesson) {
                updateLesson(weekIndex, lessonIndex, 'video_url', '');
                updateLesson(weekIndex, lessonIndex, 'duration', '');
              } else {
                updateLesson(weekIndex, lessonIndex, 'video_url', '', sectionIndexOrWeekIndex);
                updateLesson(weekIndex, lessonIndex, 'duration', '', sectionIndexOrWeekIndex);
              }
              setVideoData(prev => {
                const newData = { ...prev };
                delete newData[lessonId];
                return newData;
              });
            }}
          />
        ) : (
          <FileUpload
            label=""
            accept="video/*"
            onFileSelect={async (file) => {
              if (isDirectLesson) {
                await handleDirectVideoUpload(file, weekIndex, lessonIndex);
              } else {
                await handleVideoUpload(file, weekIndex, sectionIndexOrWeekIndex, lessonIndex);
              }
            }}
            currentFile={null}
            required={false}
          />
        )}

        {progress?.status === 'uploading' && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
              <span>Uploading...</span>
              <span>{progress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-customGreen h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {progress?.status === 'error' && (
          <p className="text-red-500 text-sm mt-2">{progress.error}</p>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Or Enter Video URL <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="url"
              value={lesson.video_url || ''}
              onChange={(e) => {
                if (isDirectLesson) {
                  updateLesson(weekIndex, lessonIndex, 'video_url', e.target.value);
                } else {
                  updateLesson(weekIndex, lessonIndex, 'video_url', e.target.value, sectionIndexOrWeekIndex);
                }
              }}
              className="flex-1 rounded-md border-gray-300 focus:border-customGreen focus:ring-customGreen sm:text-sm"
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Define the renderLessonContent function to handle section and direct lessons
  const renderLessonContent = (weekIndex: number, sectionIndex: number, lessonIndex: number, lesson: any) => {
    switch (lesson.lessonType) {
      case 'video':
        return renderVideoUpload(weekIndex, sectionIndex, lessonIndex, lesson, false);
      case 'quiz':
        return (
          <QuizSelector
            value={lesson.quiz_id || ''}
            onChange={(value) =>
              updateLesson(weekIndex, lessonIndex, 'quiz_id', value, sectionIndex)
            }
          />
        );
      case 'assessment':
        return (
          <AssignmentSelector
            value={lesson.assignment_id || ''}
            onChange={(value) =>
              updateLesson(weekIndex, lessonIndex, 'assignment_id', value, sectionIndex)
            }
          />
        );
      default:
        return null;
    }
  };

  // Add new handler for direct lesson video upload
  const handleDirectVideoUpload = async (
    file: File,
    weekIndex: number,
    lessonIndex: number
  ) => {
    if (!weeks[weekIndex].lessons) return;
    const lessonId = weeks[weekIndex].lessons[lessonIndex].id;

    // Check authentication first
    if (!isAuthenticated()) {
      toast.error('Your session has expired. Please login again.');
      return;
    }

    // Get auth token
    const token = getAuthToken();
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setUploadProgress(prev => ({
      ...prev,
      [lessonId]: { progress: 0, status: 'uploading' }
    }));

    try {
      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Upload the base64 file
      const response = await axios.post(
        `${apiBaseUrl}${apiUrls.upload.uploadBase64}`,
        {
          base64String,
          fileType: 'video'
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 0)
            );
            setUploadProgress(prev => ({
              ...prev,
              [lessonId]: { ...prev[lessonId], progress }
            }));
          }
        }
      );

      // Log response for debugging
      console.log('Upload response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      // Update video data
      const { url, duration, thumbnail } = response.data.data;
      setVideoData(prev => ({
        ...prev,
        [lessonId]: { url, duration, thumbnail, size: file.size }
      }));

      // Update lesson with video URL and duration
      updateLesson(weekIndex, lessonIndex, 'video_url', url);
      if (duration) {
        updateLesson(weekIndex, lessonIndex, 'duration', duration);
      }

      setUploadProgress(prev => ({
        ...prev,
        [lessonId]: { progress: 100, status: 'complete' }
      }));

      showToast.success('Video uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading video:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to upload video. Please try again.';
      
      if (error.response) {
        // Server responded with error
        switch (error.response.status) {
          case 401:
            errorMessage = 'Your session has expired. Please login again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to upload files.';
            break;
          case 413:
            errorMessage = 'File size too large. Please choose a smaller file.';
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Invalid request format';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Error before making request (like auth error)
        errorMessage = error.message || errorMessage;
      }

      setUploadProgress(prev => ({
        ...prev,
        [lessonId]: {
          progress: 0,
          status: 'error',
          error: errorMessage
        }
      }));
      toast.error(errorMessage);
    }
  };

  // Add Quiz selection component
  const QuizSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
  }> = ({ value, onChange, disabled }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Quiz
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading.quizzes}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen disabled:bg-gray-100"
        >
          <option value="">Select a quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz._id} value={quiz._id}>
              {quiz.title} ({quiz.total_questions} questions, {quiz.duration} mins)
            </option>
          ))}
        </select>
        {isLoading.quizzes && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <div className="h-4 w-4 border-t-2 border-customGreen rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {quizzes.length === 0 && !isLoading.quizzes && (
        <p className="text-sm text-yellow-600">
          No quizzes found. Please create quizzes first.
        </p>
      )}
    </div>
  );

  // Add Assignment selection component
  const AssignmentSelector: React.FC<{
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
  }> = ({ value, onChange, disabled }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Assignment
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading.assignments}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen disabled:bg-gray-100"
        >
          <option value="">Select an assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment._id} value={assignment._id}>
              {assignment.title} ({assignment.total_marks} marks)
            </option>
          ))}
        </select>
        {isLoading.assignments && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-customGreen"></div>
          </div>
        )}
      </div>
      {loadingError.assignments && (
        <p className="text-red-500 text-sm">{loadingError.assignments}</p>
      )}
      {!isLoading.assignments && !loadingError.assignments && assignments.length === 0 && (
        <p className="text-gray-500 text-sm">
          No assignments available. Create assignments first.
        </p>
      )}
    </div>
  );

  // Modify the Topics input to use a better UI
  const handleTopicChange = (weekIndex: number, value: string) => {
    const topics = value.split(',').map(t => t.trim()).filter(Boolean);
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].topics = topics;
    setWeeks(updatedWeeks);
    setValue('curriculum', updatedWeeks);
  };

  const handleAddTopic = (weekIndex: number, topic: string) => {
    if (!topic.trim()) return;
    
    const updatedWeeks = [...weeks];
    const currentTopics = updatedWeeks[weekIndex].topics || [];
    
    // Check if topic already exists
    if (!currentTopics.includes(topic.trim())) {
      updatedWeeks[weekIndex].topics = [...currentTopics, topic.trim()];
      setWeeks(updatedWeeks);
      setValue('curriculum', updatedWeeks);
    }
  };

  const handleRemoveTopic = (weekIndex: number, topicIndex: number) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].topics = updatedWeeks[weekIndex].topics.filter(
      (_, index) => index !== topicIndex
    );
    setWeeks(updatedWeeks);
    setValue('curriculum', updatedWeeks);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
        <p className="mt-1 text-sm text-gray-600">
          Structure your course content into weeks, sections, and lessons.
        </p>
      </div>

      <div className="space-y-6">
        {weeks.map((week, weekIndex) => (
          <div
            key={week.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('week', week.id)}
          >
            <div className="space-y-6">
              {/* Week Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="cursor-move p-1 text-gray-400 hover:text-gray-600"
                      draggable
                      onDragStart={() => handleDragStart('week', week.id)}
                    >
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Week {weekIndex + 1} Title
                      </label>
                      <input
                        type="text"
                        value={week.weekTitle}
                        onChange={(e) => updateWeek(weekIndex, 'weekTitle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                        placeholder="e.g., Introduction to React"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Week Description
                    </label>
                    <textarea
                      value={week.weekDescription || ''}
                      onChange={(e) => updateWeek(weekIndex, 'weekDescription', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="Brief overview of the week's content"
                    />
                  </div>
                  
                  {/* Improved Week Topics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Topics
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(week.topics || []).map((topic, topicIndex) => (
                        <div 
                          key={`${week.id}-topic-${topicIndex}`}
                          className="bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full flex items-center"
                        >
                          <span>{topic}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(weekIndex, topicIndex)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <MinusCircle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id={`week-${weekIndex}-topic`}
                        placeholder="Add a topic and press Enter"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleAddTopic(weekIndex, input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-customGreen hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
                        onClick={() => {
                          const input = document.getElementById(`week-${weekIndex}-topic`) as HTMLInputElement;
                          if (input) {
                            handleAddTopic(weekIndex, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Add topics one by one or separate with commas</p>
                  </div>
                </div>
                {weeks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWeek(weekIndex)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <MinusCircle size={20} />
                  </button>
                )}
              </div>

              {/* Improved Direct Lessons Section */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Direct Lessons</h4>
                  <div className="flex flex-wrap gap-2">
                    {LESSON_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => addDirectLesson(weekIndex, type.value as any)}
                        className="inline-flex items-center text-sm text-customGreen hover:text-green-700 bg-green-50 px-2 py-1 rounded"
                      >
                        <type.icon className="mr-1 h-4 w-4" />
                        Add {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(!week.lessons || week.lessons.length === 0) && (
                  <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">No direct lessons added to this week yet.</p>
                    <p className="text-sm text-gray-500 mt-1">Click one of the buttons above to add a lesson.</p>
                  </div>
                )}

                {week.lessons && week.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-4"
                    draggable
                    onDragStart={() => handleDragStart('direct_lesson', lesson.id)}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="cursor-move p-1 text-gray-400 hover:text-gray-600">
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                                {LESSON_TYPES.find(t => t.value === lesson.lessonType)?.label || 'Lesson'}
                              </div>
                              <div className="text-xs text-gray-500">#{lesson.order}</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Lesson Title
                            </label>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(
                                  weekIndex,
                                  lessonIndex,
                                  'title',
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              placeholder="e.g., Introduction to Components"
                            />
                          </div>

                          {lesson.lessonType === 'video' && (
                            <div>
                              {renderVideoUpload(weekIndex, weekIndex, lessonIndex, lesson, true)}
                            </div>
                          )}

                          {lesson.lessonType === 'quiz' && (
                            <QuizSelector
                              value={lesson.quiz_id || ''}
                              onChange={(value) =>
                                updateLesson(
                                  weekIndex,
                                  lessonIndex,
                                  'quiz_id',
                                  value
                                )
                              }
                            />
                          )}

                          {lesson.lessonType === 'assessment' && (
                            <AssignmentSelector
                              value={lesson.assignment_id || ''}
                              onChange={(value) =>
                                updateLesson(
                                  weekIndex,
                                  lessonIndex,
                                  'assignment_id',
                                  value
                                )
                              }
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            value={lesson.description || ''}
                            onChange={(e) =>
                              updateLesson(
                                weekIndex,
                                lessonIndex,
                                'description',
                                e.target.value
                              )
                            }
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                            placeholder="Detailed description of the lesson"
                          />
                        </div>

                        {/* Add resources for direct lessons */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">
                              Additional Resources
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedWeeks = [...weeks];
                                const week = updatedWeeks[weekIndex];
                                if (!week.lessons) week.lessons = [];
                                
                                const lesson = week.lessons[lessonIndex];
                                const newResource: ILessonResource = {
                                  id: generateId('resource_direct', weekIndex + 1, lessonIndex + 1, lesson.resources.length + 1),
                                  title: '',
                                  url: '',
                                  type: 'pdf',
                                  description: ''
                                };
                                
                                lesson.resources.push(newResource);
                                setWeeks(updatedWeeks);
                              }}
                              className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                            >
                              <PlusCircle className="mr-1 h-4 w-4" />
                              Add Resource
                            </button>
                          </div>

                          {lesson.resources.map((resource, resourceIndex) => (
                            <div
                              key={resource.id}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                            >
                              <input
                                type="text"
                                value={resource.title}
                                onChange={(e) => {
                                  const updatedWeeks = [...weeks];
                                  if (!updatedWeeks[weekIndex].lessons) return;
                                  
                                  const resources = updatedWeeks[weekIndex].lessons[lessonIndex].resources;
                                  resources[resourceIndex] = {
                                    ...resources[resourceIndex],
                                    title: e.target.value
                                  };
                                  
                                  setWeeks(updatedWeeks);
                                }}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                placeholder="Resource Title"
                              />
                              <select
                                value={resource.type}
                                onChange={(e) => {
                                  const updatedWeeks = [...weeks];
                                  if (!updatedWeeks[weekIndex].lessons) return;
                                  
                                  const resources = updatedWeeks[weekIndex].lessons[lessonIndex].resources;
                                  resources[resourceIndex] = {
                                    ...resources[resourceIndex],
                                    type: e.target.value as any
                                  };
                                  
                                  setWeeks(updatedWeeks);
                                }}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              >
                                {RESOURCE_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="url"
                                  value={resource.url}
                                  onChange={(e) => {
                                    const updatedWeeks = [...weeks];
                                    if (!updatedWeeks[weekIndex].lessons) return;
                                    
                                    const resources = updatedWeeks[weekIndex].lessons[lessonIndex].resources;
                                    resources[resourceIndex] = {
                                      ...resources[resourceIndex],
                                      url: e.target.value
                                    };
                                    
                                    setWeeks(updatedWeeks);
                                  }}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                  placeholder="Resource URL"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedWeeks = [...weeks];
                                    if (!updatedWeeks[weekIndex].lessons) return;
                                    
                                    const lesson = updatedWeeks[weekIndex].lessons[lessonIndex];
                                    lesson.resources = lesson.resources.filter((_, i) => i !== resourceIndex);
                                    
                                    setWeeks(updatedWeeks);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MinusCircle size={20} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Preview toggle for direct lessons */}
                        <div className="flex items-center space-x-2 mt-4">
                          <input
                            type="checkbox"
                            checked={lesson.isPreview}
                            onChange={(e) =>
                              updateLesson(
                                weekIndex,
                                lessonIndex,
                                'isPreview',
                                e.target.checked
                              )
                            }
                            className="focus:ring-customGreen h-4 w-4 text-customGreen border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`direct-lesson-preview-${weekIndex}-${lessonIndex}`}
                            className="text-sm text-gray-700"
                          >
                            Make this lesson available as a preview
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeDirectLesson(weekIndex, lessonIndex)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Classes Section */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Live Classes</h4>
                  <button
                    type="button"
                    onClick={() => addLiveClass(weekIndex)}
                    className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Live Class
                  </button>
                </div>

                {(week.liveClasses ?? []).map((liveClass, liveClassIndex) => (
                  <div key={`${week.id}-live-${liveClassIndex}`} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              value={liveClass.title}
                              onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'title', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              placeholder="Live Class Title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                            <input
                              type="datetime-local"
                              value={liveClass.scheduledDate instanceof Date 
                                ? liveClass.scheduledDate.toISOString().slice(0, 16)
                                : new Date(liveClass.scheduledDate).toISOString().slice(0, 16)}
                              onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'scheduledDate', new Date(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                            <input
                              type="number"
                              value={liveClass.duration}
                              onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'duration', parseInt(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              min="15"
                              step="15"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
                            <input
                              type="url"
                              value={liveClass.meetingLink}
                              onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'meetingLink', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={liveClass.description}
                            onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'description', e.target.value)}
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                            placeholder="Live class description"
                          />
                        </div>

                        {/* Recording Section */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={liveClass.isRecorded}
                              onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'isRecorded', e.target.checked)}
                              className="rounded border-gray-300 text-customGreen focus:ring-customGreen"
                            />
                            <span className="text-sm text-gray-700">Class is recorded</span>
                          </div>

                          {liveClass.isRecorded && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Recording URL</label>
                              <input
                                type="url"
                                value={liveClass.recordingUrl}
                                onChange={(e) => updateLiveClass(weekIndex, liveClassIndex, 'recordingUrl', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                placeholder="Recording URL"
                              />
                            </div>
                          )}
                        </div>

                        {/* Materials Section */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Class Materials</label>
                            <button
                              type="button"
                              onClick={() => addMaterial(weekIndex, liveClassIndex)}
                              className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                            >
                              <PlusCircle className="mr-1 h-4 w-4" />
                              Add Material
                            </button>
                          </div>

                          {liveClass.materials.map((material, materialIndex) => (
                            <div
                              key={`${week.id}-live-${liveClassIndex}-material-${materialIndex}`}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                            >
                              <input
                                type="text"
                                value={material.title}
                                onChange={(e) => updateMaterial(weekIndex, liveClassIndex, materialIndex, 'title', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                placeholder="Material Title"
                              />
                              <select
                                value={material.type}
                                onChange={(e) => updateMaterial(weekIndex, liveClassIndex, materialIndex, 'type', e.target.value as any)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              >
                                {MATERIAL_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="url"
                                  value={material.url}
                                  onChange={(e) => updateMaterial(weekIndex, liveClassIndex, materialIndex, 'url', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                  placeholder="Material URL"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeMaterial(weekIndex, liveClassIndex, materialIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MinusCircle size={20} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLiveClass(weekIndex, liveClassIndex)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {week.sections.map((section, sectionIndex) => (
                  <div 
                    key={section.id} 
                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop('section', section.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="cursor-move p-1 text-gray-400 hover:text-gray-600"
                            draggable
                            onDragStart={() => handleDragStart('section', section.id)}
                          >
                            <GripVertical size={16} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Section Title
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) =>
                                updateSection(weekIndex, sectionIndex, 'title', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                              placeholder="e.g., Getting Started"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Section Description
                          </label>
                          <textarea
                            value={section.description || ''}
                            onChange={(e) =>
                              updateSection(weekIndex, sectionIndex, 'description', e.target.value)
                            }
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                            placeholder="Brief description of the section"
                          />
                        </div>

                        {/* Lessons */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-900">Lessons</h4>
                            <div className="flex flex-wrap gap-2">
                              {LESSON_TYPES.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => addLesson(weekIndex, sectionIndex, type.value as any)}
                                  className="inline-flex items-center text-sm text-customGreen hover:text-green-700 bg-green-50 px-2 py-1 rounded"
                                >
                                  <type.icon className="mr-1 h-4 w-4" />
                                  Add {type.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {section.lessons.length === 0 && (
                            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                              <p className="text-sm text-gray-500">No lessons added to this section yet.</p>
                              <p className="text-sm text-gray-500 mt-1">Click one of the buttons above to add a lesson.</p>
                            </div>
                          )}

                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="bg-gray-50 rounded-lg p-4 space-y-4"
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop('lesson', lesson.id)}
                              draggable
                              onDragStart={() => handleDragStart('lesson', lesson.id, section.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="cursor-move p-1 text-gray-400 hover:text-gray-600"
                                      draggable
                                      onDragStart={() => handleDragStart('lesson', lesson.id)}
                                    >
                                      <GripVertical size={16} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                                          {LESSON_TYPES.find(t => t.value === lesson.lessonType)?.label || 'Lesson'}
                                        </div>
                                        <div className="text-xs text-gray-500">#{lesson.order}</div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">
                                        Lesson Title
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={(e) =>
                                          updateLesson(
                                            weekIndex,
                                            lessonIndex,
                                            'title',
                                            e.target.value,
                                            sectionIndex
                                          )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                        placeholder="e.g., Introduction to Components"
                                      />
                                    </div>

                                    {lesson.lessonType === 'video' && (
                                      <div>
                                        {renderVideoUpload(weekIndex, sectionIndex, lessonIndex, lesson, false)}
                                      </div>
                                    )}

                                    {lesson.lessonType === 'quiz' && (
                                      <QuizSelector
                                        value={lesson.quiz_id || ''}
                                        onChange={(value) =>
                                          updateLesson(weekIndex, lessonIndex, 'quiz_id', value, sectionIndex)
                                        }
                                      />
                                    )}

                                    {lesson.lessonType === 'assessment' && (
                                      <AssignmentSelector
                                        value={lesson.assignment_id || ''}
                                        onChange={(value) =>
                                          updateLesson(weekIndex, lessonIndex, 'assignment_id', value, sectionIndex)
                                        }
                                      />
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Description
                                    </label>
                                    <textarea
                                      value={lesson.description || ''}
                                      onChange={(e) =>
                                        updateLesson(
                                          weekIndex,
                                          lessonIndex,
                                          'description',
                                          e.target.value,
                                          sectionIndex
                                        )
                                      }
                                      rows={2}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                      placeholder="Detailed description of the lesson"
                                    />
                                  </div>

                                  {/* Resources */}
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <label className="block text-sm font-medium text-gray-700">
                                        Additional Resources
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          addResource(weekIndex, sectionIndex, lessonIndex)
                                        }
                                        className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                                      >
                                        <PlusCircle className="mr-1 h-4 w-4" />
                                        Add Resource
                                      </button>
                                    </div>

                                    {lesson.resources.map((resource, resourceIndex) => (
                                      <div
                                        key={resource.id}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                                      >
                                        <input
                                          type="text"
                                          value={resource.title}
                                          onChange={(e) =>
                                            updateResource(
                                              weekIndex,
                                              sectionIndex,
                                              lessonIndex,
                                              resourceIndex,
                                              'title',
                                              e.target.value
                                            )
                                          }
                                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                          placeholder="Resource Title"
                                        />
                                        <select
                                          value={resource.type}
                                          onChange={(e) =>
                                            updateResource(
                                              weekIndex,
                                              sectionIndex,
                                              lessonIndex,
                                              resourceIndex,
                                              'type',
                                              e.target.value as any
                                            )
                                          }
                                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                        >
                                          {RESOURCE_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                              {type.label}
                                            </option>
                                          ))}
                                        </select>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="url"
                                            value={resource.url}
                                            onChange={(e) =>
                                              updateResource(
                                                weekIndex,
                                                sectionIndex,
                                                lessonIndex,
                                                resourceIndex,
                                                'url',
                                                e.target.value
                                              )
                                            }
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                            placeholder="Resource URL"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeResource(
                                                weekIndex,
                                                sectionIndex,
                                                lessonIndex,
                                                resourceIndex
                                              )
                                            }
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <MinusCircle size={20} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeLesson(weekIndex, sectionIndex, lessonIndex)}
                                  className="ml-4 text-red-500 hover:text-red-700"
                                >
                                  <MinusCircle size={20} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSection(weekIndex, sectionIndex)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSection(weekIndex)}
                  className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add Section
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addWeek}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Week
      </button>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Curriculum Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Weeks</p>
              <p className="text-lg font-medium">{weeks.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Sections</p>
              <p className="text-lg font-medium">
                {weeks.reduce((acc, week) => acc + week.sections.length, 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Lessons</p>
              <p className="text-lg font-medium">
                {weeks.reduce(
                  (acc, week) =>
                    acc + week.sections.reduce((secAcc, section) => secAcc + section.lessons.length, 0),
                  0
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Resources</p>
              <p className="text-lg font-medium">
                {weeks.reduce(
                  (acc, week) =>
                    acc +
                    week.sections.reduce(
                      (secAcc, section) =>
                        secAcc +
                        section.lessons.reduce(
                          (lessonAcc, lesson) => lessonAcc + lesson.resources.length,
                          0
                        ),
                      0
                    ),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCurriculum;