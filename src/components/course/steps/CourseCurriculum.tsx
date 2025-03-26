import React, { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { PlusCircle, MinusCircle, GripVertical, Clock, BookOpen, Video, FileText, HelpCircle, Link, File, Download, Calendar, Users, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
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

// Keep only the ILiveClass interface since it's not in the types file
interface ILiveClass {
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number;
  meetingLink?: string;
  instructor?: string;
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
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string } | null>(null);
  const [videoUploads, setVideoUploads] = useState<{ [key: string]: IVideoUploadState }>({});
  const [videoData, setVideoData] = useState<{ [key: string]: IVideoData }>({});

  // Helper function to generate IDs
  const generateId = (prefix: string, ...indices: number[]): string => {
    return `${prefix}_${indices.join('_')}`;
  };

  // Fetch quizzes and assignments when component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(prev => ({ ...prev, quizzes: true }));
        setLoadingError(prev => ({ ...prev, quizzes: '' }));
        
        const courseId = watch('_id');
        if (courseId) {
          const response = await axios.get(`${apiBaseUrl}${apiUrls.courses.getCourseQuizzes(courseId)}`);
          setQuizzes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoadingError(prev => ({ 
          ...prev, 
          quizzes: 'Failed to fetch quizzes. Please try again.' 
        }));
        toast.error('Failed to fetch quizzes');
      } finally {
        setIsLoading(prev => ({ ...prev, quizzes: false }));
      }
    };

    const fetchAssignments = async () => {
      try {
        setIsLoading(prev => ({ ...prev, assignments: true }));
        setLoadingError(prev => ({ ...prev, assignments: '' }));
        
        const courseId = watch('_id');
        if (courseId) {
          const response = await axios.get(`${apiBaseUrl}${apiUrls.courses.getCourseAssignments(courseId)}`);
          setAssignments(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setLoadingError(prev => ({ 
          ...prev, 
          assignments: 'Failed to fetch assignments. Please try again.' 
        }));
        toast.error('Failed to fetch assignments');
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

  // Drag and drop handlers
  const handleDragStart = (type: string, id: string) => {
    setDraggedItem({ type, id });
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

  const handleUpdateLesson = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    field: keyof IBaseLessonFields | 'video_url' | 'duration' | 'quiz_id' | 'assignment_id',
    value: string | boolean | number
  ) => {
    const updatedWeeks = [...weeks];
    const lesson = updatedWeeks[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    
    // Handle type-specific fields
    switch (lesson.lessonType) {
      case 'video': {
        const videoLesson = lesson as IVideoLesson;
        if (field === 'video_url' || field === 'duration') {
          (videoLesson as any)[field] = value as string;
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
      instructor: '',
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
    const updatedWeeks = [...weeks];
    const week = updatedWeeks[weekIndex];
    
    if (week.lessons && week.lessons[lessonIndex]) {
      const lesson = week.lessons[lessonIndex];
      
      // Handle type-specific fields
      switch (lesson.lessonType) {
        case 'video': {
          const videoLesson = lesson as IVideoLesson;
          if (field === 'video_url' || field === 'duration') {
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
    }
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

  // Add video upload handler
  const handleVideoUpload = async (
    file: File,
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number
  ) => {
    const lessonId = weeks[weekIndex].sections[sectionIndex].lessons[lessonIndex].id;
    
    // Update upload state
    setVideoUploads(prev => ({
      ...prev,
      [lessonId]: { isUploading: true, progress: 0, error: null }
    }));

    try {
      // Create form data
      const formData = new FormData();
      formData.append('video', file);
      formData.append('lessonId', lessonId);

      // Make API call to upload video
      const response = await axios.post(
        `${apiBaseUrl}${apiUrls.upload.uploadMedia}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 0)
            );
            setVideoUploads(prev => ({
              ...prev,
              [lessonId]: { ...prev[lessonId], progress }
            }));
          }
        }
      );

      // Update video data
      const { url, duration, thumbnail } = response.data;
      setVideoData(prev => ({
        ...prev,
        [lessonId]: { url, duration, thumbnail, size: file.size }
      }));

      // Update lesson with video URL
      handleUpdateLesson(
        weekIndex,
        sectionIndex,
        lessonIndex,
        'video_url',
        url
      );

      // Update duration if available
      if (duration) {
        handleUpdateLesson(
          weekIndex,
          sectionIndex,
          lessonIndex,
          'duration',
          duration
        );
      }

      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      setVideoUploads(prev => ({
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          error: 'Failed to upload video. Please try again.'
        }
      }));
      toast.error('Failed to upload video');
    } finally {
      setVideoUploads(prev => ({
        ...prev,
        [lessonId]: { ...prev[lessonId], isUploading: false }
      }));
    }
  };

  // Add video preview component
  const VideoPreview: React.FC<{
    videoUrl: string;
    thumbnail?: string;
    duration?: string;
    size?: number;
  }> = ({ videoUrl, thumbnail, duration, size }) => (
    <div className="mt-2 rounded-lg border border-gray-200 p-4">
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
      <div className="space-y-1">
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
    </div>
  );

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
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-customGreen"></div>
          </div>
        )}
      </div>
      {loadingError.quizzes && (
        <p className="text-red-500 text-sm">{loadingError.quizzes}</p>
      )}
      {!isLoading.quizzes && !loadingError.quizzes && quizzes.length === 0 && (
        <p className="text-gray-500 text-sm">
          No quizzes available. Create quizzes first.
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

  // Update the lesson rendering to use new selectors
  const renderLessonContent = (weekIndex: number, sectionIndex: number, lessonIndex: number, lesson: any) => {
    switch (lesson.lessonType) {
      case 'video':
        return renderVideoUpload(weekIndex, sectionIndex, lessonIndex, lesson);
      case 'quiz':
        return (
          <QuizSelector
            value={lesson.quiz_id || ''}
            onChange={(value) =>
              handleUpdateLesson(
                weekIndex,
                sectionIndex,
                lessonIndex,
                'quiz_id',
                value
              )
            }
          />
        );
      case 'assessment':
        return (
          <AssignmentSelector
            value={lesson.assignment_id || ''}
            onChange={(value) =>
              handleUpdateLesson(
                weekIndex,
                sectionIndex,
                lessonIndex,
                'assignment_id',
                value
              )
            }
          />
        );
      default:
        return null;
    }
  };

  // Modify the existing lesson rendering to include video upload
  const renderVideoUpload = (weekIndex: number, sectionIndex: number, lessonIndex: number, lesson: any) => {
    const lessonId = lesson.id;
    const uploadState = videoUploads[lessonId];
    const videoInfo = videoData[lessonId];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Video Upload
        </label>
        
        {lesson.video_url ? (
          <div className="space-y-2">
            <VideoPreview
              videoUrl={lesson.video_url}
              thumbnail={videoInfo?.thumbnail}
              duration={lesson.duration}
              size={videoInfo?.size}
            />
            <button
              type="button"
              onClick={() => {
                handleUpdateLesson(weekIndex, sectionIndex, lessonIndex, 'video_url', '');
                handleUpdateLesson(weekIndex, sectionIndex, lessonIndex, 'duration', '');
                setVideoData(prev => {
                  const newData = { ...prev };
                  delete newData[lessonId];
                  return newData;
                });
              }}
              className="text-red-500 hover:text-red-700 text-sm flex items-center"
            >
              <MinusCircle className="h-4 w-4 mr-1" />
              Remove Video
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-customGreen">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  {uploadState?.isUploading
                    ? `Uploading... ${uploadState.progress}%`
                    : 'Click to upload video'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleVideoUpload(file, weekIndex, sectionIndex, lessonIndex);
                    }
                  }}
                  disabled={uploadState?.isUploading}
                />
              </label>
            </div>
            {uploadState?.error && (
              <p className="text-red-500 text-sm">{uploadState.error}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Or Enter Video URL
          </label>
          <input
            type="url"
            value={lesson.video_url || ''}
            onChange={(e) =>
              handleUpdateLesson(
                weekIndex,
                sectionIndex,
                lessonIndex,
                'video_url',
                e.target.value
              )
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          />
        </div>
      </div>
    );
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
                  
                  {/* Week Topics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Main Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      value={week.topics?.join(', ') || ''}
                      onChange={(e) => {
                        const topics = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        const updatedWeeks = [...weeks];
                        updatedWeeks[weekIndex].topics = topics;
                        setWeeks(updatedWeeks);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="e.g., Components, Props, State"
                    />
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

              {/* Direct Lessons Section */}
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
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
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
                                updateDirectLesson(
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
                              {renderLessonContent(weekIndex, weekIndex, lessonIndex, lesson)}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            value={lesson.description || ''}
                            onChange={(e) =>
                              updateDirectLesson(
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
                              value={liveClass.scheduledDate.toISOString().slice(0, 16)}
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
                                          handleUpdateLesson(
                                            weekIndex,
                                            sectionIndex,
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
                                        {renderLessonContent(weekIndex, sectionIndex, lessonIndex, lesson)}
                                      </div>
                                    )}

                                    {lesson.lessonType === 'quiz' && (
                                      <div>
                                        {renderLessonContent(weekIndex, sectionIndex, lessonIndex, lesson)}
                                      </div>
                                    )}

                                    {lesson.lessonType === 'assessment' && (
                                      <div>
                                        {renderLessonContent(weekIndex, sectionIndex, lessonIndex, lesson)}
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Description
                                    </label>
                                    <textarea
                                      value={lesson.description || ''}
                                      onChange={(e) =>
                                        handleUpdateLesson(
                                          weekIndex,
                                          sectionIndex,
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