import React, { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { PlusCircle, MinusCircle, GripVertical, Clock, BookOpen, Video, FileText, HelpCircle, Link, File, Download, Calendar, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiBaseUrl, apiUrls } from '@/apis';

// Enhanced TypeScript interfaces for better type safety
interface IMaterial {
  title: string;
  url: string;
  type: 'pdf' | 'document' | 'presentation' | 'code' | 'other';
}

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

interface ILessonResource {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  type: 'pdf' | 'document' | 'video' | 'audio' | 'link';
}

interface ILesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessonType: 'video' | 'quiz' | 'assessment';
  isPreview: boolean;
  meta?: Record<string, any>;
  resources: ILessonResource[];
  
  // Type-specific fields
  video_url?: string;
  duration?: string;
  quiz_id?: string;
  assignment_id?: string;
}

interface ISection {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
  resources: ILessonResource[];
}

interface ICurriculumWeek {
  id: string;
  weekTitle: string;
  weekDescription?: string;
  topics: string[];
  lessons?: ILesson[];
  liveClasses: ILiveClass[];
  sections: ISection[];
  resources?: ILessonResource[];
}

interface ICourseFormData {
  curriculum: ICurriculumWeek[];
  [key: string]: any;
}

interface CourseCurriculumProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
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

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  // Initialize curriculum with a basic structure
  const [curriculum, setCurriculum] = useState<ICurriculumWeek[]>([
    {
      id: '1',
      weekTitle: '',
      weekDescription: '',
      topics: [],
      liveClasses: [],
      sections: []
    }
  ]);

  // Add state for quizzes and assignments
  const [quizzes, setQuizzes] = useState<Array<{ _id: string; title: string }>>([]);
  const [assignments, setAssignments] = useState<Array<{ _id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState({
    quizzes: false,
    assignments: false
  });
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string } | null>(null);

  // Helper function to generate IDs
  const generateId = (prefix: string, ...indices: number[]): string => {
    return `${prefix}_${indices.join('_')}`;
  };

  // Fetch quizzes and assignments when component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(prev => ({ ...prev, quizzes: true }));
        const courseId = watch('_id'); // Get current course ID if editing
        if (courseId) {
          const response = await axios.get(`${apiBaseUrl}${apiUrls.courses.getCourseQuizzes(courseId)}`);
          setQuizzes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Failed to fetch quizzes');
      } finally {
        setIsLoading(prev => ({ ...prev, quizzes: false }));
      }
    };

    const fetchAssignments = async () => {
      try {
        setIsLoading(prev => ({ ...prev, assignments: true }));
        const courseId = watch('_id'); // Get current course ID if editing
        if (courseId) {
          const response = await axios.get(`${apiBaseUrl}${apiUrls.courses.getCourseAssignments(courseId)}`);
          setAssignments(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error('Failed to fetch assignments');
      } finally {
        setIsLoading(prev => ({ ...prev, assignments: false }));
      }
    };

    fetchQuizzes();
    fetchAssignments();
  }, [watch]);

  // Update form data whenever curriculum changes
  useEffect(() => {
    setValue('curriculum', curriculum);
  }, [curriculum, setValue]);

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
      setCurriculum(newCurriculum);
    } else if (draggedItem.type === 'lesson' && targetType === 'section') {
      // Move lesson between sections
      const newCurriculum = reorderLessons(targetId);
      setCurriculum(newCurriculum);
    }

    setDraggedItem(null);
  };

  const reorderSections = (targetWeekId: string): ICurriculumWeek[] => {
    if (!draggedItem) return curriculum;

    // Find source and target weeks
    const sourceWeekIndex = curriculum.findIndex(week => 
      week.sections.some(section => section.id === draggedItem.id)
    );
    
    const targetWeekIndex = curriculum.findIndex(week => week.id === targetWeekId);
    
    if (sourceWeekIndex === -1 || targetWeekIndex === -1) return curriculum;
    
    // Find the section to move
    const sourceWeek = curriculum[sourceWeekIndex];
    const sectionIndex = sourceWeek.sections.findIndex(s => s.id === draggedItem.id);
    const sectionToMove = { ...sourceWeek.sections[sectionIndex] };
    
    // Create new curriculum with the section moved
    const newCurriculum = [...curriculum];
    
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
    if (!draggedItem) return curriculum;
    
    // Find the source section and lesson
    let sourceSectionId = '';
    let sourceWeekIndex = -1;
    let sourceSectionIndex = -1;
    
    // Find the lesson to move
    for (let w = 0; w < curriculum.length; w++) {
      const week = curriculum[w];
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
    
    if (sourceWeekIndex === -1 || sourceSectionIndex === -1) return curriculum;
    
    // Find the target section
    let targetWeekIndex = -1;
    let targetSectionIndex = -1;
    
    for (let w = 0; w < curriculum.length; w++) {
      const week = curriculum[w];
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
    
    if (targetWeekIndex === -1 || targetSectionIndex === -1) return curriculum;
    
    // Check if source and target are the same
    if (sourceSectionId === targetSectionId) return curriculum;
    
    // Get the lesson to move
    const sourceSection = curriculum[sourceWeekIndex].sections[sourceSectionIndex];
    const lessonIndex = sourceSection.lessons.findIndex(l => l.id === draggedItem.id);
    const lessonToMove = { ...sourceSection.lessons[lessonIndex] };
    
    // Create new curriculum
    const newCurriculum = [...curriculum];
    
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
    const newIndex = curriculum.length + 1;
    setCurriculum([
      ...curriculum,
      {
        id: generateId('week', newIndex),
        weekTitle: '',
        weekDescription: '',
        topics: [],
        liveClasses: [],
        sections: []
      }
    ]);
  };

  // Remove week
  const removeWeek = (weekIndex: number) => {
    const updatedCurriculum = curriculum.filter((_, index) => index !== weekIndex);
    // Update IDs to maintain consistency
    updatedCurriculum.forEach((week, index) => {
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
    
    setCurriculum(updatedCurriculum);
  };

  // Section functions
  const addSection = (weekIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const newSectionNumber = updatedCurriculum[weekIndex].sections.length + 1;
    
    updatedCurriculum[weekIndex].sections.push({
      id: generateId('section', weekIndex + 1, newSectionNumber),
      title: `Section ${newSectionNumber}`,
      description: '',
      order: newSectionNumber,
      resources: [],
      lessons: []
    });
    
    setCurriculum(updatedCurriculum);
  };

  const removeSection = (weekIndex: number, sectionIndex: number) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections = updatedCurriculum[weekIndex].sections.filter(
      (_, index) => index !== sectionIndex
    );
    
    // Update section orders
    updatedCurriculum[weekIndex].sections.forEach((section, index) => {
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
    
    setCurriculum(updatedCurriculum);
  };

  // Lesson functions
  const addLesson = (weekIndex: number, sectionIndex: number, type: 'video' | 'quiz' | 'assessment' = 'video') => {
    const updatedCurriculum = [...curriculum];
    const newLessonNumber = updatedCurriculum[weekIndex].sections[sectionIndex].lessons.length + 1;
    
    const baseLesson: ILesson = {
      id: generateId('lesson', weekIndex + 1, sectionIndex + 1, newLessonNumber),
      title: '',
      description: '',
      order: newLessonNumber,
      isPreview: false,
      meta: {},
      resources: [],
      lessonType: type
    };
    
    // Add type-specific fields
    switch (type) {
      case 'quiz':
        baseLesson.quiz_id = '';
        break;
      case 'assessment':
        baseLesson.assignment_id = '';
        break;
      default:
        baseLesson.video_url = '';
        baseLesson.duration = '';
    }
    
    updatedCurriculum[weekIndex].sections[sectionIndex].lessons.push(baseLesson);
    setCurriculum(updatedCurriculum);
  };

  const removeLesson = (weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections[sectionIndex].lessons = 
      updatedCurriculum[weekIndex].sections[sectionIndex].lessons.filter(
        (_, index) => index !== lessonIndex
      );
      
    // Update lesson orders
    updatedCurriculum[weekIndex].sections[sectionIndex].lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
      lesson.id = generateId('lesson', weekIndex + 1, sectionIndex + 1, index + 1);
      
      // Update resource IDs
      lesson.resources.forEach((resource, rIndex) => {
        resource.id = generateId('resource', weekIndex + 1, sectionIndex + 1, index + 1, rIndex + 1);
      });
    });
    
    setCurriculum(updatedCurriculum);
  };

  // Resource functions
  const addResource = (weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const lesson = updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    
    const newResource: ILessonResource = {
      id: generateId('resource', weekIndex + 1, sectionIndex + 1, lessonIndex + 1, lesson.resources.length + 1),
      title: '',
      fileUrl: '',
      type: 'pdf',
      description: ''
    };
    
    lesson.resources.push(newResource);
    setCurriculum(updatedCurriculum);
  };

  const removeResource = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number
  ) => {
    const updatedCurriculum = [...curriculum];
    const lesson = updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    lesson.resources = lesson.resources.filter((_, index) => index !== resourceIndex);
    
    // Update resource IDs
    lesson.resources.forEach((resource, index) => {
      resource.id = generateId('resource', weekIndex + 1, sectionIndex + 1, lessonIndex + 1, index + 1);
    });
    
    setCurriculum(updatedCurriculum);
  };

  // Update functions
  const updateWeek = (weekIndex: number, field: keyof ICurriculumWeek, value: string) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex] = {
      ...updatedCurriculum[weekIndex],
      [field]: value
    };
    setCurriculum(updatedCurriculum);
  };

  const updateSection = (
    weekIndex: number,
    sectionIndex: number,
    field: keyof ISection,
    value: string
  ) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections[sectionIndex] = {
      ...updatedCurriculum[weekIndex].sections[sectionIndex],
      [field]: value
    };
    setCurriculum(updatedCurriculum);
  };

  const updateLesson = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    field: keyof ILesson,
    value: string | boolean
  ) => {
    const updatedCurriculum = [...curriculum];
    const lesson = updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex] = {
      ...lesson,
      [field]: value
    };
    setCurriculum(updatedCurriculum);
  };

  const updateResource = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number,
    field: keyof ILessonResource,
    value: string
  ) => {
    const updatedCurriculum = [...curriculum];
    const lesson = updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    lesson.resources[resourceIndex] = {
      ...lesson.resources[resourceIndex],
      [field]: value
    };
    setCurriculum(updatedCurriculum);
  };

  // Add live class
  const addLiveClass = (weekIndex: number) => {
    const updatedCurriculum = [...curriculum];
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
    
    updatedCurriculum[weekIndex].liveClasses.push(newLiveClass);
    setCurriculum(updatedCurriculum);
  };

  // Remove live class
  const removeLiveClass = (weekIndex: number, liveClassIndex: number) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].liveClasses = updatedCurriculum[weekIndex].liveClasses.filter(
      (_, index) => index !== liveClassIndex
    );
    setCurriculum(updatedCurriculum);
  };

  // Update live class
  const updateLiveClass = (
    weekIndex: number,
    liveClassIndex: number,
    field: keyof ILiveClass,
    value: any
  ) => {
    const updatedCurriculum = [...curriculum];
    const liveClass = updatedCurriculum[weekIndex].liveClasses[liveClassIndex];
    updatedCurriculum[weekIndex].liveClasses[liveClassIndex] = {
      ...liveClass,
      [field]: value
    };
    setCurriculum(updatedCurriculum);
  };

  // Add material to live class
  const addMaterial = (weekIndex: number, liveClassIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const newMaterial: IMaterial = {
      title: '',
      url: '',
      type: 'other'
    };
    
    updatedCurriculum[weekIndex].liveClasses[liveClassIndex].materials.push(newMaterial);
    setCurriculum(updatedCurriculum);
  };

  // Remove material from live class
  const removeMaterial = (weekIndex: number, liveClassIndex: number, materialIndex: number) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].liveClasses[liveClassIndex].materials = 
      updatedCurriculum[weekIndex].liveClasses[liveClassIndex].materials.filter(
        (_, index) => index !== materialIndex
      );
    setCurriculum(updatedCurriculum);
  };

  // Update material
  const updateMaterial = (
    weekIndex: number,
    liveClassIndex: number,
    materialIndex: number,
    field: keyof IMaterial,
    value: string
  ) => {
    const updatedCurriculum = [...curriculum];
    const material = updatedCurriculum[weekIndex].liveClasses[liveClassIndex].materials[materialIndex];
    updatedCurriculum[weekIndex].liveClasses[liveClassIndex].materials[materialIndex] = {
      ...material,
      [field]: value
    };
    setCurriculum(updatedCurriculum);
  };

  // Add direct lesson to week
  const addDirectLesson = (weekIndex: number, type: 'video' | 'quiz' | 'assessment' = 'video') => {
    const updatedCurriculum = [...curriculum];
    const week = updatedCurriculum[weekIndex];
    const newLessonNumber = (week.lessons || []).length + 1;
    
    const newLesson: ILesson = {
      id: generateId('lesson_direct', weekIndex + 1, newLessonNumber),
      title: '',
      description: '',
      order: newLessonNumber,
      isPreview: false,
      meta: {},
      resources: [],
      lessonType: type
    };

    // Add type-specific fields
    switch (type) {
      case 'quiz':
        newLesson.quiz_id = '';
        break;
      case 'assessment':
        newLesson.assignment_id = '';
        break;
      default:
        newLesson.video_url = '';
        newLesson.duration = '';
    }

    if (!week.lessons) {
      week.lessons = [];
    }
    
    week.lessons.push(newLesson);
    setCurriculum(updatedCurriculum);
  };

  // Remove direct lesson from week
  const removeDirectLesson = (weekIndex: number, lessonIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const week = updatedCurriculum[weekIndex];
    
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
    
    setCurriculum(updatedCurriculum);
  };

  // Update direct lesson
  const updateDirectLesson = (
    weekIndex: number,
    lessonIndex: number,
    field: keyof ILesson,
    value: string | boolean
  ) => {
    const updatedCurriculum = [...curriculum];
    const week = updatedCurriculum[weekIndex];
    
    if (week.lessons && week.lessons[lessonIndex]) {
      week.lessons[lessonIndex] = {
        ...week.lessons[lessonIndex],
        [field]: value
      };
      setCurriculum(updatedCurriculum);
    }
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
        {curriculum.map((week, weekIndex) => (
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
                        const updatedCurriculum = [...curriculum];
                        updatedCurriculum[weekIndex].topics = topics;
                        setCurriculum(updatedCurriculum);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="e.g., Components, Props, State"
                    />
                  </div>
                </div>
                {curriculum.length > 1 && (
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
                              <label className="block text-sm font-medium text-gray-700">
                                Duration (HH:MM:SS)
                              </label>
                              <input
                                type="text"
                                value={lesson.duration || ''}
                                onChange={(e) =>
                                  updateDirectLesson(
                                    weekIndex,
                                    lessonIndex,
                                    'duration',
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                pattern="^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$"
                              />
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

                {week.liveClasses.map((liveClass, liveClassIndex) => (
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
                                          updateLesson(
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
                                        <label className="block text-sm font-medium text-gray-700">
                                          Duration (HH:MM:SS)
                                        </label>
                                        <input
                                          type="text"
                                          value={lesson.duration || ''}
                                          onChange={(e) =>
                                            updateLesson(
                                              weekIndex,
                                              sectionIndex,
                                              lessonIndex,
                                              'duration',
                                              e.target.value
                                            )
                                          }
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                          pattern="^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$"
                                        />
                                      </div>
                                    )}

                                    {lesson.lessonType === 'quiz' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Select Quiz
                                        </label>
                                        <select
                                          value={lesson.quiz_id || ''}
                                          onChange={(e) =>
                                            updateLesson(
                                              weekIndex,
                                              sectionIndex,
                                              lessonIndex,
                                              'quiz_id',
                                              e.target.value
                                            )
                                          }
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                          disabled={isLoading.quizzes}
                                        >
                                          <option value="">Select a quiz</option>
                                          {quizzes.map((quiz) => (
                                            <option key={quiz._id} value={quiz._id}>
                                              {quiz.title}
                                            </option>
                                          ))}
                                        </select>
                                        {isLoading.quizzes && (
                                          <p className="mt-1 text-sm text-gray-500">Loading quizzes...</p>
                                        )}
                                        {quizzes.length === 0 && !isLoading.quizzes && (
                                          <p className="mt-1 text-sm text-gray-500">
                                            No quizzes available. Create quizzes first.
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {lesson.lessonType === 'assessment' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Select Assignment
                                        </label>
                                        <select
                                          value={lesson.assignment_id || ''}
                                          onChange={(e) =>
                                            updateLesson(
                                              weekIndex,
                                              sectionIndex,
                                              lessonIndex,
                                              'assignment_id',
                                              e.target.value
                                            )
                                          }
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                                          disabled={isLoading.assignments}
                                        >
                                          <option value="">Select an assignment</option>
                                          {assignments.map((assignment) => (
                                            <option key={assignment._id} value={assignment._id}>
                                              {assignment.title}
                                            </option>
                                          ))}
                                        </select>
                                        {isLoading.assignments && (
                                          <p className="mt-1 text-sm text-gray-500">Loading assignments...</p>
                                        )}
                                        {assignments.length === 0 && !isLoading.assignments && (
                                          <p className="mt-1 text-sm text-gray-500">
                                            No assignments available. Create assignments first.
                                          </p>
                                        )}
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
                                        updateLesson(
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

                                  {lesson.lessonType === 'video' && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">
                                        Video URL
                                      </label>
                                      <input
                                        type="url"
                                        value={lesson.video_url || ''}
                                        onChange={(e) =>
                                          updateLesson(
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
                                  )}

                                  <div>
                                    <label className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={lesson.isPreview}
                                        onChange={(e) =>
                                          updateLesson(
                                            weekIndex,
                                            sectionIndex,
                                            lessonIndex,
                                            'isPreview',
                                            e.target.checked
                                          )
                                        }
                                        className="rounded border-gray-300 text-customGreen focus:ring-customGreen"
                                      />
                                      <span className="text-sm text-gray-700">
                                        Make this lesson preview-able (free access)
                                      </span>
                                    </label>
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
                                            value={resource.fileUrl}
                                            onChange={(e) =>
                                              updateResource(
                                                weekIndex,
                                                sectionIndex,
                                                lessonIndex,
                                                resourceIndex,
                                                'fileUrl',
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
              <p className="text-lg font-medium">{curriculum.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Sections</p>
              <p className="text-lg font-medium">
                {curriculum.reduce((acc, week) => acc + week.sections.length, 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Lessons</p>
              <p className="text-lg font-medium">
                {curriculum.reduce(
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
                {curriculum.reduce(
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