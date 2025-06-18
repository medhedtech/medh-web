import React, { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { 
  PlusCircle, 
  MinusCircle, 
  Video, 
  FileText, 
  HelpCircle, 
  Clock, 
  Calendar,
  Compass,
  BookOpen,
  Layers,
  Zap,
  Award
} from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import { v4 as uuidv4 } from 'uuid';
import { 
  ICourseFormData, 
  ICurriculumWeek, 
  ISection, 
  ILesson, 
  IVideoLesson,
  IQuizLesson,
  IAssessmentLesson,
  LessonType,
} from '@/types/course.types';
import { useUpload } from '@/hooks/useUpload';
import FileUpload from '@/components/shared/FileUpload';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/services/uploadService';
import { getAuthToken, isAuthenticated } from '@/utils/auth';
import axios from 'axios';
import { apiBaseUrl, apiUrls } from '@/apis';

interface SimpleCurriculumProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: FormState<ICourseFormData>;
  watch: any;
}

const SimpleCurriculum: React.FC<SimpleCurriculumProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [weeks, setWeeks] = useState<ICurriculumWeek[]>([]);
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: boolean }>({});
  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: string]: boolean }>({});
  const [dragItem, setDragItem] = useState<any>(null);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);
  const [videoUploads, setVideoUploads] = useState<{ [key: string]: { isUploading: boolean; progress: number; error: string | null } }>({});
  const [videoData, setVideoData] = useState<{ [key: string]: { url: string; duration: string; thumbnail?: string; size?: number } }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { progress: number; status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error'; error?: string } }>({});
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      showToast.success('File uploaded successfully');
    },
    onError: (error) => {
      showToast.error(error.message);
    }
  });

  // Initialize the curriculum with a single week if empty
  useEffect(() => {
    const currentCurriculum = watch('curriculum') || [];
    if (currentCurriculum.length === 0) {
      const initialWeek = createNewWeek();
      setValue('curriculum', [initialWeek]);
      setWeeks([initialWeek]);
      
      // Expand the first week by default
      setExpandedWeeks({ [initialWeek.id]: true });
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
      
      // Expand the first week by default
      if (formattedWeeks.length > 0) {
        setExpandedWeeks({ [formattedWeeks[0].id]: true });
      }
    }
  }, []);
  
  // Simplified utility functions
  const createNewWeek = (): ICurriculumWeek => ({
    id: uuidv4(),
    weekNumber: weeks.length + 1,
    weekTitle: `Week ${weeks.length + 1}`,
    weekDescription: '',
    topics: [],
    sections: [],
    liveClasses: [],
    lessons: []
  });
  
  const createNewSection = (): ISection => ({
    id: uuidv4(),
    title: 'New Section',
    description: '',
    order: 0,
    lessons: [],
    resources: []
  });
  
  const createNewLesson = (type: LessonType): ILesson => {
    const baseLesson = {
      id: uuidv4(),
      title: type === 'video' ? 'New Video Lesson' : 
             type === 'quiz' ? 'New Quiz' : 'New Assignment',
      description: '',
      order: 0,
      isPreview: false,
      meta: {},
      resources: [],
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

  // Handler to add a new week
  const handleAddWeek = () => {
    const newWeek = createNewWeek();
    const updatedWeeks = [...weeks, newWeek];
    setWeeks(updatedWeeks);
    setValue('curriculum', updatedWeeks);
    
    // Expand the newly added week
    setExpandedWeeks(prev => ({ ...prev, [newWeek.id]: true }));
    
    // Auto-scroll to the new week
    setTimeout(() => {
      document.getElementById(`week-${newWeek.id}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  // Handler to add a new section to a week
  const handleAddSection = (weekIndex: number) => {
    const updatedWeeks = [...weeks];
    const newSection = createNewSection();
    newSection.order = updatedWeeks[weekIndex].sections.length;
    updatedWeeks[weekIndex].sections.push(newSection);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
    
    // Auto-scroll to the new section
    setTimeout(() => {
      document.getElementById(`section-${newSection.id}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  // Handler to add a new lesson to a section
  const handleAddLesson = (weekIndex: number, sectionIndex: number, type: LessonType = 'video') => {
    const updatedWeeks = [...weeks];
    const newLesson = createNewLesson(type);
    newLesson.order = updatedWeeks[weekIndex].sections[sectionIndex].lessons.length;
    updatedWeeks[weekIndex].sections[sectionIndex].lessons.push(newLesson);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
    
    // Auto-scroll to the new lesson
    setTimeout(() => {
      document.getElementById(`lesson-${newLesson.id}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  // Handler to remove a week
  const handleRemoveWeek = (weekIndex: number) => {
    if (weeks.length <= 1) {
      showToast.warning("You need at least one week in your curriculum");
      return;
    }
    
    if (window.confirm("Are you sure you want to remove this week and all its content?")) {
      const updatedWeeks = weeks.filter((_, index) => index !== weekIndex);
      
      // Renumber the remaining weeks
      updatedWeeks.forEach((week, index) => {
        week.weekNumber = index + 1;
        if (!week.weekTitle || week.weekTitle.startsWith('Week ')) {
          week.weekTitle = `Week ${index + 1}`;
        }
      });
      
      setWeeks(updatedWeeks);
      setValue('curriculum', updatedWeeks);
    }
  };

  // Handler to remove a section
  const handleRemoveSection = (weekIndex: number, sectionIndex: number) => {
    if (window.confirm("Are you sure you want to remove this section and all its lessons?")) {
      const updatedWeeks = [...weeks];
      updatedWeeks[weekIndex].sections = updatedWeeks[weekIndex].sections.filter(
        (_, index) => index !== sectionIndex
      );
      
      // Update section orders
      updatedWeeks[weekIndex].sections.forEach((section, index) => {
        section.order = index;
      });
      
      setWeeks(updatedWeeks);
      setValue('curriculum', updatedWeeks);
    }
  };

  // Handler to remove a lesson
  const handleRemoveLesson = (weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    if (window.confirm("Are you sure you want to remove this lesson?")) {
      const updatedWeeks = [...weeks];
      updatedWeeks[weekIndex].sections[sectionIndex].lessons = 
        updatedWeeks[weekIndex].sections[sectionIndex].lessons.filter(
          (_, index) => index !== lessonIndex
        );
      
      // Update lesson orders
      updatedWeeks[weekIndex].sections[sectionIndex].lessons.forEach((lesson, index) => {
        lesson.order = index;
      });
      
      setWeeks(updatedWeeks);
      setValue('curriculum', updatedWeeks);
    }
  };

  // Handlers for updating fields
  const updateWeekField = (weekIndex: number, field: keyof ICurriculumWeek, value: any) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex] = {
      ...updatedWeeks[weekIndex],
      [field]: value
    };
    setWeeks(updatedWeeks);
    setValue('curriculum', updatedWeeks);
  };

  const updateSectionField = (weekIndex: number, sectionIndex: number, field: keyof ISection, value: any) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].sections[sectionIndex] = {
      ...updatedWeeks[weekIndex].sections[sectionIndex],
      [field]: value
    };
    setWeeks(updatedWeeks);
    setValue('curriculum', updatedWeeks);
  };

  const updateLessonField = (weekIndex: number, sectionIndex: number, lessonIndex: number, field: string, value: any) => {
    const updatedWeeks = [...weeks];
    const lesson = updatedWeeks[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    
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
      (lesson as any)[field] = value;
    }
    
    setWeeks(updatedWeeks);
    setValue('curriculum', updatedWeeks);
  };

  // Toggle week expansion
  const toggleWeekExpansion = (weekId: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, item: any, type: string) => {
    setDragItem({ item, type });
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a class to the dragged element for styling
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('dragging');
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDragItem(null);
    setDraggingOver(null);
    
    // Remove the dragging class
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('dragging');
    }
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggingOver(targetId);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  // Simple lesson renderer based on type
  const renderLessonContent = (lesson: ILesson) => {
    switch (lesson.lessonType) {
      case 'video':
        return (
          <div className="flex items-center text-gray-600 text-sm">
            <Video className="w-4 h-4 mr-2" />
            <span>Video Lesson</span>
            {(lesson as IVideoLesson).duration && (
              <span className="ml-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {(lesson as IVideoLesson).duration}
              </span>
            )}
          </div>
        );
      case 'quiz':
        return (
          <div className="flex items-center text-gray-600 text-sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span>Quiz</span>
          </div>
        );
      case 'assessment':
        return (
          <div className="flex items-center text-gray-600 text-sm">
            <FileText className="w-4 h-4 mr-2" />
            <span>Assignment</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Simplified topic management
  const handleAddTopic = (weekIndex: number, newTopic: string) => {
    if (!newTopic.trim()) return;
    
    const updatedWeeks = [...weeks];
    const currentTopics = updatedWeeks[weekIndex].topics || [];
    
    if (!currentTopics.includes(newTopic.trim())) {
      updatedWeeks[weekIndex].topics = [...currentTopics, newTopic.trim()];
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

  // Handler to add a direct lesson to a week
  const handleAddDirectLesson = (weekIndex: number, type: LessonType = 'video') => {
    const updatedWeeks = [...weeks];
    const week = updatedWeeks[weekIndex];
    const newLesson = createNewLesson(type);
    newLesson.order = (week.lessons || []).length;
    
    if (!week.lessons) {
      week.lessons = [];
    }
    
    week.lessons.push(newLesson);
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
    
    // Auto-scroll to the new lesson
    setTimeout(() => {
      document.getElementById(`direct-lesson-${newLesson.id}`)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  // Handler to remove a direct lesson
  const handleRemoveDirectLesson = (weekIndex: number, lessonIndex: number) => {
    if (window.confirm("Are you sure you want to remove this lesson?")) {
      const updatedWeeks = [...weeks];
      const week = updatedWeeks[weekIndex];
      
      if (week.lessons) {
        week.lessons = week.lessons.filter((_, index) => index !== lessonIndex);
        
        // Update lesson orders
        week.lessons.forEach((lesson, index) => {
          lesson.order = index;
        });
        
        setValue('curriculum', updatedWeeks);
        setWeeks(updatedWeeks);
      }
    }
  };

  // Update direct lesson fields
  const updateDirectLessonField = (weekIndex: number, lessonIndex: number, field: string, value: any) => {
    const updatedWeeks = [...weeks];
    const week = updatedWeeks[weekIndex];
    
    if (!week.lessons) return;
    
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
      (lesson as any)[field] = value;
    }
    
    setValue('curriculum', updatedWeeks);
    setWeeks(updatedWeeks);
  };

  // Video upload handler for section lessons
  const handleVideoUpload = async (file: File, weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const lessonId = weeks[weekIndex].sections[sectionIndex].lessons[lessonIndex].id;

    // Check authentication first
    if (!isAuthenticated()) {
      showToast.error('Your session has expired. Please login again.');
      return;
    }

    // Get auth token
    const token = getAuthToken();
    if (!token) {
      showToast.error('Authentication token not found. Please login again.');
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('video/')) {
      showToast.error('Please upload a valid video file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast.error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
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
          withCredentials: true,
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
      updateLessonField(weekIndex, sectionIndex, lessonIndex, 'video_url', url);
      if (duration) {
        updateLessonField(weekIndex, sectionIndex, lessonIndex, 'duration', duration);
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
      showToast.error(errorMessage);
    }
  };

  // Video upload handler for direct lessons
  const handleDirectVideoUpload = async (file: File, weekIndex: number, lessonIndex: number) => {
    if (!weeks[weekIndex].lessons) return;
    const lessonId = weeks[weekIndex].lessons[lessonIndex].id;

    // Check authentication first
    if (!isAuthenticated()) {
      showToast.error('Your session has expired. Please login again.');
      return;
    }

    // Get auth token
    const token = getAuthToken();
    if (!token) {
      showToast.error('Authentication token not found. Please login again.');
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('video/')) {
      showToast.error('Please upload a valid video file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast.error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
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
      updateDirectLessonField(weekIndex, lessonIndex, 'video_url', url);
      if (duration) {
        updateDirectLessonField(weekIndex, lessonIndex, 'duration', duration);
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
      showToast.error(errorMessage);
    }
  };

  // Video preview component for displaying uploaded videos
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
        {duration && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
        )}
        {size && (
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
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
          View Video
        </a>
      </div>
    </div>
  );

  // Render video upload component for section lessons
  const renderVideoUpload = (weekIndex: number, sectionIndex: number, lessonIndex: number, lesson: IVideoLesson) => {
    const lessonId = lesson.id;
    const progress = uploadProgress[lessonId];
    const videoInfo = videoData[lessonId];

    return (
      <div className="mt-3 px-3 py-2 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Video Content</h3>
        
        {lesson.video_url ? (
          <VideoPreview
            videoUrl={lesson.video_url}
            thumbnail={videoInfo?.thumbnail}
            duration={lesson.duration}
            size={videoInfo?.size}
            onRemove={() => {
              updateLessonField(weekIndex, lessonIndex, 'video_url', '', sectionIndex);
              updateLessonField(weekIndex, lessonIndex, 'duration', '', sectionIndex);
              setVideoData(prev => {
                const newData = { ...prev };
                delete newData[lessonId];
                return newData;
              });
            }}
          />
        ) : (
          <div className="space-y-2">
            <FileUpload
              label=""
              accept="video/*"
              onFileSelect={async (file) => {
                await handleVideoUpload(file, weekIndex, sectionIndex, lessonIndex);
              }}
              currentFile={null}
              required={false}
            />
            
            <div className="mt-1">
              <label className="block text-xs text-blue-700">
                Or Enter Video URL
              </label>
              <input
                type="url"
                value={lesson.video_url || ''}
                onChange={(e) => updateLessonField(
                  weekIndex,
                  lessonIndex,
                  'video_url', 
                  e.target.value,
                  sectionIndex
                )}
                className="mt-1 w-full text-sm p-1.5 border border-blue-200 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
          </div>
        )}

        {progress?.status === 'uploading' && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-blue-600 mb-1">
              <span>Uploading...</span>
              <span>{progress.progress}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {progress?.status === 'error' && (
          <p className="text-red-500 text-xs mt-1">{progress.error}</p>
        )}
      </div>
    );
  };

  // Render video upload component for direct lessons
  const renderDirectVideoUpload = (weekIndex: number, lessonIndex: number, lesson: IVideoLesson) => {
    const lessonId = lesson.id;
    const progress = uploadProgress[lessonId];
    const videoInfo = videoData[lessonId];

    return (
      <div className="mt-3 px-3 py-2 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Video Content</h3>
        
        {lesson.video_url ? (
          <VideoPreview
            videoUrl={lesson.video_url}
            thumbnail={videoInfo?.thumbnail}
            duration={lesson.duration}
            size={videoInfo?.size}
            onRemove={() => {
              updateDirectLessonField(weekIndex, lessonIndex, 'video_url', '');
              updateDirectLessonField(weekIndex, lessonIndex, 'duration', '');
              setVideoData(prev => {
                const newData = { ...prev };
                delete newData[lessonId];
                return newData;
              });
            }}
          />
        ) : (
          <div className="space-y-2">
            <FileUpload
              label=""
              accept="video/*"
              onFileSelect={async (file) => {
                await handleDirectVideoUpload(file, weekIndex, lessonIndex);
              }}
              currentFile={null}
              required={false}
            />
            
            <div className="mt-1">
              <label className="block text-xs text-blue-700">
                Or Enter Video URL
              </label>
              <input
                type="url"
                value={lesson.video_url || ''}
                onChange={(e) => updateDirectLessonField(
                  weekIndex,
                  lessonIndex,
                  'video_url', 
                  e.target.value
                )}
                className="mt-1 w-full text-sm p-1.5 border border-blue-200 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
          </div>
        )}

        {progress?.status === 'uploading' && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-blue-600 mb-1">
              <span>Uploading...</span>
              <span>{progress.progress}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {progress?.status === 'error' && (
          <p className="text-red-500 text-xs mt-1">{progress.error}</p>
        )}
      </div>
    );
  };

  // In the rendering section for each lesson, add this to expand lesson content
  const handleLessonDetailsClick = (lessonId: string) => {
    setActiveTabs(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Modify the section lesson rendering to include video upload
  const renderLessonWithDetails = (lesson: ILesson, weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const isActive = activeTabs[lesson.id] || false;
    
    return (
      <div 
        key={lesson.id}
        id={`lesson-${lesson.id}`}
        className={`p-3 ${
          lesson.lessonType === 'video' ? 'bg-blue-50' :
          lesson.lessonType === 'quiz' ? 'bg-purple-50' :
          'bg-orange-50'
        } rounded-lg`}
        draggable
        onDragStart={(e) => handleDragStart(e, { weekIndex, sectionIndex, lessonIndex }, 'lesson')}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => updateLessonField(
                weekIndex, 
                sectionIndex, 
                lessonIndex, 
                'title', 
                e.target.value
              )}
              className={`w-full bg-transparent border-none p-0 mb-1 ${
                lesson.lessonType === 'video' ? 'text-blue-800' :
                lesson.lessonType === 'quiz' ? 'text-purple-800' :
                'text-orange-800'
              } font-medium focus:ring-0`}
              placeholder={`${lesson.lessonType === 'video' ? 'Video' : 
                          lesson.lessonType === 'quiz' ? 'Quiz' : 
                          'Assignment'} Title`}
            />
            {renderLessonContent(lesson)}
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleLessonDetailsClick(lesson.id)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              {isActive ? "Hide" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => handleRemoveLesson(weekIndex, sectionIndex, lessonIndex)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <MinusCircle size={16} />
            </button>
          </div>
        </div>
        
        {isActive && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={lesson.description || ''}
                  onChange={(e) => updateLessonField(
                    weekIndex, 
                    sectionIndex,
                    lessonIndex, 
                    'description', 
                    e.target.value
                  )}
                  rows={2}
                  className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-light focus:border-blue"
                  placeholder="Explain what students will learn"
                />
              </div>
              
              {lesson.lessonType === 'video' && renderVideoUpload(weekIndex, sectionIndex, lessonIndex, lesson as IVideoLesson)}
              
              <div className="flex items-center py-1">
                <input
                  type="checkbox"
                  checked={lesson.isPreview}
                  onChange={(e) => updateLessonField(
                    weekIndex,
                    lessonIndex,
                    'isPreview',
                    e.target.checked,
                    sectionIndex
                  )}
                  className="h-4 w-4 text-customGreen rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Make this lesson available as a free preview
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Curriculum Builder</h2>
        <p className="text-gray-600">
          Build your course structure by adding weeks, sections, and lessons. Use the visual builder below to organize your content.
        </p>
      </div>

      {/* Visual Curriculum Builder */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Your Curriculum</h3>
          <button
            type="button"
            onClick={handleAddWeek}
            className="flex items-center px-4 py-2 bg-customGreen text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Add Week
          </button>
        </div>

        {/* Weeks Container */}
        <div className="space-y-6">
          {weeks.map((week, weekIndex) => (
            <div 
              key={week.id}
              id={`week-${week.id}`}
              className={`border rounded-lg overflow-hidden ${
                expandedWeeks[week.id] ? 'border-customGreen shadow-md' : 'border-gray-200'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, { weekIndex }, 'week')}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, `week-${week.id}`)}
              onDragLeave={handleDragLeave}
            >
              {/* Week Header */}
              <div 
                className={`p-4 ${expandedWeeks[week.id] ? 'bg-green-50' : 'bg-gray-50'} 
                  cursor-pointer flex justify-between items-center`}
                onClick={() => toggleWeekExpansion(week.id)}
              >
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-customGreen text-white mr-3">
                    {weekIndex + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900">{week.weekTitle || `Week ${weekIndex + 1}`}</h4>
                    <p className="text-sm text-gray-500">
                      {week.sections.length} {week.sections.length === 1 ? 'section' : 'sections'},
                      {' '}
                      {week.sections.reduce((total, section) => total + section.lessons.length, 0)}{' '}
                      {week.sections.reduce((total, section) => total + section.lessons.length, 0) === 1 ? 'lesson' : 'lessons'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWeek(weekIndex);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <MinusCircle size={18} />
                  </button>
                </div>
              </div>

              {/* Week Content (only shown when expanded) */}
              {expandedWeeks[week.id] && (
                <div className="p-4 bg-white">
                  {/* Week Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Week Title
                      </label>
                      <input
                        type="text"
                        value={week.weekTitle}
                        onChange={(e) => updateWeekField(weekIndex, 'weekTitle', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-customGreen-light focus:border-customGreen"
                        placeholder="e.g., Introduction to the Course"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Week Description
                      </label>
                      <input
                        type="text"
                        value={week.weekDescription}
                        onChange={(e) => updateWeekField(weekIndex, 'weekDescription', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-customGreen-light focus:border-customGreen"
                        placeholder="Brief overview of this week's content"
                      />
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topics Covered This Week
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(week.topics || []).map((topic, topicIndex) => (
                        <div 
                          key={`topic-${weekIndex}-${topicIndex}`}
                          className="bg-green-50 text-customGreen px-3 py-1 rounded-full flex items-center text-sm"
                        >
                          <span>{topic}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(weekIndex, topicIndex)}
                            className="ml-2 text-green-700 hover:text-green-900"
                          >
                            <MinusCircle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a topic (press Enter)"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring focus:ring-customGreen-light focus:border-customGreen"
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
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input) {
                            handleAddTopic(weekIndex, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-customGreen text-white rounded-r-md hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Direct Lessons */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-800">Direct Lessons</h5>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddDirectLesson(weekIndex, 'video')}
                          className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <Video className="mr-1 h-3 w-3" />
                          Video
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddDirectLesson(weekIndex, 'quiz')}
                          className="flex items-center text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          <HelpCircle className="mr-1 h-3 w-3" />
                          Quiz
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddDirectLesson(weekIndex, 'assessment')}
                          className="flex items-center text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Assignment
                        </button>
                      </div>
                    </div>

                    {(!week.lessons || week.lessons.length === 0) ? (
                      <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">No direct lessons yet</p>
                        <p className="text-xs text-gray-400">Direct lessons are not part of any section</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {week.lessons.map((lesson, lessonIndex) => {
                          const isActive = activeTabs[`direct_${lesson.id}`] || false;
                          
                          return (
                            <div 
                              key={lesson.id}
                              id={`direct-lesson-${lesson.id}`}
                              className={`p-3 ${
                                lesson.lessonType === 'video' ? 'bg-blue-50' :
                                lesson.lessonType === 'quiz' ? 'bg-purple-50' :
                                'bg-orange-50'
                              } rounded-lg`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, { weekIndex, lessonIndex }, 'direct_lesson')}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => updateDirectLessonField(
                                      weekIndex, 
                                      lessonIndex, 
                                      'title', 
                                      e.target.value
                                    )}
                                    className={`w-full bg-transparent border-none p-0 mb-1 ${
                                      lesson.lessonType === 'video' ? 'text-blue-800' :
                                      lesson.lessonType === 'quiz' ? 'text-purple-800' :
                                      'text-orange-800'
                                    } font-medium focus:ring-0`}
                                    placeholder={`${lesson.lessonType === 'video' ? 'Video' : 
                                                lesson.lessonType === 'quiz' ? 'Quiz' : 
                                                'Assignment'} Title`}
                                  />
                                  {renderLessonContent(lesson)}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => setActiveTabs(prev => ({
                                      ...prev,
                                      [`direct_${lesson.id}`]: !prev[`direct_${lesson.id}`]
                                    }))}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                  >
                                    {isActive ? "Hide" : "Edit"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDirectLesson(weekIndex, lessonIndex)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <MinusCircle size={16} />
                                  </button>
                                </div>
                              </div>
                              
                              {isActive && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Description
                                      </label>
                                      <textarea
                                        value={lesson.description || ''}
                                        onChange={(e) => updateDirectLessonField(
                                          weekIndex, 
                                          lessonIndex, 
                                          'description', 
                                          e.target.value
                                        )}
                                        rows={2}
                                        className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-light focus:border-blue"
                                        placeholder="Explain what students will learn"
                                      />
                                    </div>
                                    
                                    {lesson.lessonType === 'video' && renderDirectVideoUpload(weekIndex, lessonIndex, lesson as IVideoLesson)}
                                    
                                    <div className="flex items-center py-1">
                                      <input
                                        type="checkbox"
                                        checked={lesson.isPreview}
                                        onChange={(e) => updateDirectLessonField(
                                          weekIndex,
                                          lessonIndex,
                                          'isPreview',
                                          e.target.checked
                                        )}
                                        className="h-4 w-4 text-customGreen rounded border-gray-300"
                                      />
                                      <label className="ml-2 text-sm text-gray-700">
                                        Make this lesson available as a free preview
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-gray-800">Sections</h5>
                      <button
                        type="button"
                        onClick={() => handleAddSection(weekIndex)}
                        className="flex items-center text-sm px-3 py-1 bg-customGreen text-white rounded-md hover:bg-green-600"
                      >
                        <Layers className="mr-1 h-4 w-4" />
                        Add Section
                      </button>
                    </div>

                    {week.sections.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                        <BookOpen className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-500">No sections yet</p>
                        <p className="text-sm text-gray-400">Add a section to organize your lessons</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {week.sections.map((section, sectionIndex) => (
                          <div
                            key={section.id}
                            id={`section-${section.id}`}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                            draggable
                            onDragStart={(e) => handleDragStart(e, { weekIndex, sectionIndex }, 'section')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, `section-${section.id}`)}
                            onDragLeave={handleDragLeave}
                          >
                            {/* Section Header */}
                            <div className="bg-gray-50 p-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 mr-2">
                                  {sectionIndex + 1}
                                </span>
                                <input
                                  type="text"
                                  value={section.title}
                                  onChange={(e) => updateSectionField(
                                    weekIndex, 
                                    sectionIndex, 
                                    'title', 
                                    e.target.value
                                  )}
                                  className="bg-transparent border-none p-0 text-gray-800 font-medium focus:ring-0"
                                  placeholder="Section Title"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSection(weekIndex, sectionIndex)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <MinusCircle size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Section Description */}
                            <div className="p-3">
                              <input
                                type="text"
                                value={section.description || ''}
                                onChange={(e) => updateSectionField(
                                  weekIndex, 
                                  sectionIndex, 
                                  'description', 
                                  e.target.value
                                )}
                                className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring focus:ring-customGreen-light focus:border-customGreen"
                                placeholder="Brief description of this section"
                              />
                            </div>

                            {/* Lessons */}
                            <div className="p-3 pt-0">
                              <div className="flex justify-between items-center mb-2">
                                <h6 className="text-sm font-medium text-gray-600">Lessons</h6>
                                <div className="flex flex-wrap gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAddLesson(weekIndex, sectionIndex, 'video')}
                                    className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  >
                                    <Video className="mr-1 h-3 w-3" />
                                    Video
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAddLesson(weekIndex, sectionIndex, 'quiz')}
                                    className="flex items-center text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                  >
                                    <HelpCircle className="mr-1 h-3 w-3" />
                                    Quiz
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAddLesson(weekIndex, sectionIndex, 'assessment')}
                                    className="flex items-center text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                                  >
                                    <FileText className="mr-1 h-3 w-3" />
                                    Assignment
                                  </button>
                                </div>
                              </div>

                              {section.lessons.length === 0 ? (
                                <div className="text-center py-4 border border-dashed border-gray-200 rounded-lg">
                                  <p className="text-sm text-gray-400">No lessons yet</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {section.lessons.map((lesson, lessonIndex) => 
                                    renderLessonWithDetails(lesson, weekIndex, sectionIndex, lessonIndex)
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Week Button (Bottom) */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleAddWeek}
            className="inline-flex items-center px-4 py-2 bg-customGreen text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Add Another Week
          </button>
        </div>
      </div>

      {/* Curriculum Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Curriculum Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Compass className="h-5 w-5 text-blue-700 mr-2" />
              <h4 className="font-medium text-blue-800">Total Weeks</h4>
            </div>
            <p className="text-3xl font-bold text-blue-900">{weeks.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Layers className="h-5 w-5 text-green-700 mr-2" />
              <h4 className="font-medium text-green-800">Total Sections</h4>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {weeks.reduce((total, week) => total + week.sections.length, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-purple-700 mr-2" />
              <h4 className="font-medium text-purple-800">Total Lessons</h4>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {weeks.reduce((total, week) => 
                total + week.sections.reduce((sectionTotal, section) => 
                  sectionTotal + section.lessons.length, 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
        <div className="flex items-start">
          <Zap className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Quick Tips</h3>
            <ul className="text-indigo-700 space-y-2">
              <li className="flex items-start">
                <Award className="h-4 w-4 mr-2 mt-1" />
                <span>Create a logical flow by organizing content into weeks and sections</span>
              </li>
              <li className="flex items-start">
                <Award className="h-4 w-4 mr-2 mt-1" />
                <span>Use a mix of video lessons, quizzes, and assignments for better engagement</span>
              </li>
              <li className="flex items-start">
                <Award className="h-4 w-4 mr-2 mt-1" />
                <span>Drag and drop items to reorder weeks, sections, and lessons</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCurriculum; 