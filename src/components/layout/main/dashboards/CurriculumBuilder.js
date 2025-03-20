import React, { useState } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, FileText, Edit2, Clock, Video, File } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CurriculumBuilder = ({ curriculum = [], onChange }) => {
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());

  const handleAddWeek = () => {
    const newWeek = {
      id: `week_${uuidv4()}`,
      weekTitle: `Week ${curriculum.length + 1}`,
      weekDescription: '',
      topics: [],
      sections: []
    };
    onChange([...curriculum, newWeek]);
  };

  const handleAddSection = (weekIndex) => {
    const updatedCurriculum = [...curriculum];
    const week = updatedCurriculum[weekIndex];
    week.sections.push({
      id: `section_${uuidv4()}`,
      title: `Section ${week.sections.length + 1}`,
      description: '',
      order: week.sections.length,
      lessons: [],
      assignments: [],
      quizzes: [],
      resources: []
    });
    onChange(updatedCurriculum);
  };

  const handleAddLesson = (weekIndex, sectionIndex) => {
    const updatedCurriculum = [...curriculum];
    const section = updatedCurriculum[weekIndex].sections[sectionIndex];
    section.lessons.push({
      id: `lesson_${uuidv4()}`,
      title: `Lesson ${section.lessons.length + 1}`,
      description: '',
      content: '',
      duration: 0,
      order: section.lessons.length,
      videoUrl: '',
      resources: []
    });
    onChange(updatedCurriculum);
  };

  const handleAddQuiz = (weekIndex, sectionIndex) => {
    const updatedCurriculum = [...curriculum];
    const section = updatedCurriculum[weekIndex].sections[sectionIndex];
    section.quizzes.push({
      id: `quiz_${uuidv4()}`,
      title: `Quiz ${section.quizzes.length + 1}`,
      description: '',
      duration: 30,
      questions: []
    });
    onChange(updatedCurriculum);
  };

  const handleAddAssignment = (weekIndex, sectionIndex) => {
    const updatedCurriculum = [...curriculum];
    const section = updatedCurriculum[weekIndex].sections[sectionIndex];
    section.assignments.push({
      id: `assignment_${uuidv4()}`,
      title: `Assignment ${section.assignments.length + 1}`,
      description: '',
      dueDate: null,
      maxScore: 100,
      instructions: '',
      resources: []
    });
    onChange(updatedCurriculum);
  };

  const handleAddResource = (weekIndex, sectionIndex) => {
    const updatedCurriculum = [...curriculum];
    const section = updatedCurriculum[weekIndex].sections[sectionIndex];
    section.resources.push({
      id: `resource_${uuidv4()}`,
      title: '',
      type: 'pdf',
      url: '',
      description: '',
      size_mb: null,
      pages: null,
      upload_date: new Date().toISOString()
    });
    onChange(updatedCurriculum);
  };

  const handleUpdateWeek = (weekIndex, field, value) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex][field] = value;
    onChange(updatedCurriculum);
  };

  const handleUpdateSection = (weekIndex, sectionIndex, field, value) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections[sectionIndex][field] = value;
    onChange(updatedCurriculum);
  };

  const handleUpdateLesson = (weekIndex, sectionIndex, lessonIndex, field, value) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections[sectionIndex].lessons[lessonIndex][field] = value;
    onChange(updatedCurriculum);
  };

  const handleDeleteWeek = (weekIndex) => {
    const updatedCurriculum = curriculum.filter((_, index) => index !== weekIndex);
    onChange(updatedCurriculum);
  };

  const handleDeleteSection = (weekIndex, sectionIndex) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections = updatedCurriculum[weekIndex].sections.filter((_, index) => index !== sectionIndex);
    onChange(updatedCurriculum);
  };

  const handleDeleteLesson = (weekIndex, sectionIndex, lessonIndex) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[weekIndex].sections[sectionIndex].lessons = 
      updatedCurriculum[weekIndex].sections[sectionIndex].lessons.filter((_, index) => index !== lessonIndex);
    onChange(updatedCurriculum);
  };

  const toggleWeekExpansion = (weekIndex) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekIndex)) {
      newExpanded.delete(weekIndex);
    } else {
      newExpanded.add(weekIndex);
    }
    setExpandedWeeks(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Course Curriculum</h3>
        <button
          type="button"
          onClick={handleAddWeek}
          className="flex items-center gap-2 text-customGreen hover:text-green-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add Week
        </button>
      </div>

      <div className="space-y-4">
        {curriculum.map((week, weekIndex) => (
          <div key={week.id} className="border rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => toggleWeekExpansion(weekIndex)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedWeeks.has(weekIndex) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={week.weekTitle}
                      onChange={(e) => handleUpdateWeek(weekIndex, 'weekTitle', e.target.value)}
                      className="text-lg font-medium w-full"
                      placeholder="Week Title"
                    />
                  </div>
                  <textarea
                    value={week.weekDescription}
                    onChange={(e) => handleUpdateWeek(weekIndex, 'weekDescription', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Week Description"
                    rows="2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteWeek(weekIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedWeeks.has(weekIndex) && (
              <div className="p-4 space-y-4">
                {week.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleUpdateSection(weekIndex, sectionIndex, 'title', e.target.value)}
                          className="text-md font-medium w-full mb-2"
                          placeholder="Section Title"
                        />
                        <textarea
                          value={section.description}
                          onChange={(e) => handleUpdateSection(weekIndex, sectionIndex, 'description', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="Section Description"
                          rows="2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(weekIndex, sectionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-gray-700">Lessons</h4>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-md">
                          <Video className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleUpdateLesson(weekIndex, sectionIndex, lessonIndex, 'title', e.target.value)}
                            className="flex-1 text-sm"
                            placeholder="Lesson Title"
                          />
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => handleUpdateLesson(weekIndex, sectionIndex, lessonIndex, 'duration', parseInt(e.target.value))}
                            className="w-20 text-sm text-center"
                            placeholder="Duration (min)"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(weekIndex, sectionIndex, lessonIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddLesson(weekIndex, sectionIndex)}
                        className="text-sm text-customGreen hover:text-green-700 flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Lesson
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleAddQuiz(weekIndex, sectionIndex)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Quiz
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddAssignment(weekIndex, sectionIndex)}
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Assignment
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddResource(weekIndex, sectionIndex)}
                        className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Resource
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSection(weekIndex)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                >
                  Add Section
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurriculumBuilder; 