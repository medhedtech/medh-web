import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData, ICurriculumWeek, ISection, ILesson, ILessonResource } from '@/types/course.types';
import { PlusCircle, MinusCircle, GripVertical, Clock, BookOpen, Video, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiBaseUrl, apiUrls } from '@/apis';

interface CourseCurriculumProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

const LESSON_TYPES = [
  { value: 'video', label: 'Video Lesson', icon: Video },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'assessment', label: 'Assignment', icon: FileText }
];

const RESOURCE_TYPES = ['pdf', 'document', 'link', 'other'] as const;

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [curriculum, setCurriculum] = React.useState<ICurriculumWeek[]>([
    {
      id: '1',
      weekNumber: 1,
      weekTitle: '',
      weekDescription: '',
      sections: [
        {
          id: '1-1',
          title: 'Getting Started',
          description: '',
          order: 1,
          resources: [],
          lessons: [
            {
              id: '1-1-1',
              title: '',
              description: '',
              order: 1,
              isPreview: false,
              meta: {},
              resources: [],
              lessonType: 'video',
              video_url: '',
              duration: ''
            }
          ]
        }
      ]
    }
  ]);

  // Add state for quizzes and assignments
  const [quizzes, setQuizzes] = React.useState<Array<{ _id: string; title: string }>>([]);
  const [assignments, setAssignments] = React.useState<Array<{ _id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = React.useState({
    quizzes: false,
    assignments: false
  });

  // Fetch quizzes and assignments when component mounts
  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(prev => ({ ...prev, quizzes: true }));
        const courseId = watch('_id'); // Get current course ID if editing
        const response = await axios.get(`${apiBaseUrl}${apiUrls.courses.getCourseQuizzes(courseId || '')}`);
        setQuizzes(response.data.quizzes || []);
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
        const response = await axios.get(`${apiBaseUrl}${apiUrls.courses.getCourseAssignments(courseId || '')}`);
        setAssignments(response.data.assignments || []);
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
  React.useEffect(() => {
    setValue('curriculum', curriculum);
  }, [curriculum, setValue]);

  const addWeek = () => {
    const newWeekNumber = curriculum.length + 1;
    setCurriculum([
      ...curriculum,
      {
        id: `${newWeekNumber}`,
        weekNumber: newWeekNumber,
        weekTitle: '',
        weekDescription: '',
        sections: [
          {
            id: `${newWeekNumber}-1`,
            title: 'Getting Started',
            description: '',
            order: 1,
            resources: [],
            lessons: []
          }
        ]
      }
    ]);
  };

  const removeWeek = (weekIndex: number) => {
    const updatedCurriculum = curriculum.filter((_, index) => index !== weekIndex);
    // Update week numbers
    updatedCurriculum.forEach((week, index) => {
      week.weekNumber = index + 1;
      week.id = `${index + 1}`;
    });
    setCurriculum(updatedCurriculum);
  };

  const addSection = (weekIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const newSectionNumber = updatedCurriculum[weekIndex].sections.length + 1;
    updatedCurriculum[weekIndex].sections.push({
      id: `${weekIndex + 1}-${newSectionNumber}`,
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
    });
    setCurriculum(updatedCurriculum);
  };

  const addLesson = (weekIndex: number, sectionIndex: number, type: 'video' | 'quiz' | 'assessment' = 'video') => {
    const updatedCurriculum = [...curriculum];
    const newLessonNumber = updatedCurriculum[weekIndex].sections[sectionIndex].lessons.length + 1;
    const baseLesson = {
      id: `${weekIndex + 1}-${sectionIndex + 1}-${newLessonNumber}`,
      title: '',
      description: '',
      order: newLessonNumber,
      isPreview: false,
      meta: {},
      resources: []
    };

    let newLesson: ILesson;
    switch (type) {
      case 'quiz':
        newLesson = {
          ...baseLesson,
          lessonType: 'quiz',
          quiz_id: ''
        };
        break;
      case 'assessment':
        newLesson = {
          ...baseLesson,
          lessonType: 'assessment',
          assignment_id: ''
        };
        break;
      default:
        newLesson = {
          ...baseLesson,
          lessonType: 'video',
          video_url: '',
          duration: ''
        };
    }

    updatedCurriculum[weekIndex].sections[sectionIndex].lessons.push(newLesson);
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
    });
    setCurriculum(updatedCurriculum);
  };

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
    field: string,
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

  const addResource = (weekIndex: number, sectionIndex: number, lessonIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const lesson = updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    const newResource: ILessonResource = {
      id: `${lesson.id}-resource-${lesson.resources.length + 1}`,
      title: '',
      url: '',
      type: 'pdf',
      description: ''
    };
    lesson.resources.push(newResource);
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

  const removeResource = (
    weekIndex: number,
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number
  ) => {
    const updatedCurriculum = [...curriculum];
    const lesson = updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex];
    lesson.resources = lesson.resources.filter((_, index) => index !== resourceIndex);
    setCurriculum(updatedCurriculum);
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
          >
            <div className="space-y-6">
              {/* Week Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Week {week.weekNumber} Title
                    </label>
                    <input
                      type="text"
                      value={week.weekTitle}
                      onChange={(e) => updateWeek(weekIndex, 'weekTitle', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="e.g., Introduction to React"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Week Description
                    </label>
                    <textarea
                      value={week.weekDescription}
                      onChange={(e) => updateWeek(weekIndex, 'weekDescription', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="Brief overview of the week's content"
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

              {/* Sections */}
              <div className="space-y-4">
                {week.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div>
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Section Description
                          </label>
                          <textarea
                            value={section.description}
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
                            <div className="flex space-x-2">
                              {LESSON_TYPES.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => addLesson(weekIndex, sectionIndex, type.value as any)}
                                  className="inline-flex items-center text-sm text-customGreen hover:text-green-700"
                                >
                                  <type.icon className="mr-1 h-4 w-4" />
                                  Add {type.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="bg-gray-50 rounded-lg p-4 space-y-4"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-4">
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
                                          Duration
                                        </label>
                                        <input
                                          type="text"
                                          value={(lesson as any).duration}
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
                                          placeholder="e.g., 10:30"
                                        />
                                      </div>
                                    )}

                                    {lesson.lessonType === 'quiz' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Select Quiz
                                        </label>
                                        <select
                                          value={(lesson as any).quiz_id}
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
                                      </div>
                                    )}

                                    {lesson.lessonType === 'assessment' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Select Assignment
                                        </label>
                                        <select
                                          value={(lesson as any).assignment_id}
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
                                        value={(lesson as any).video_url}
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
                                        placeholder="Enter video URL"
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
                                        Make this lesson preview-able
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
                                            <option key={type} value={type}>
                                              {type.charAt(0).toUpperCase() + type.slice(1)}
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

                      {week.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(weekIndex, sectionIndex)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <MinusCircle size={20} />
                        </button>
                      )}
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