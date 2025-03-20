import React, { useState } from 'react';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const QuizBuilder = ({ quiz, onChange }) => {
  const [draggedQuestionIndex, setDraggedQuestionIndex] = useState(null);

  const handleAddQuestion = () => {
    const updatedQuiz = {
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          id: `question_${uuidv4()}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
    };
    onChange(updatedQuiz);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions[index][field] = value;
    onChange(updatedQuiz);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions[questionIndex].options[optionIndex] = value;
    onChange(updatedQuiz);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions[questionIndex].correctAnswer = optionIndex;
    onChange(updatedQuiz);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    };
    onChange(updatedQuiz);
  };

  const handleDragStart = (e, index) => {
    setDraggedQuestionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedQuestionIndex === null) return;
    if (draggedQuestionIndex === index) return;

    const updatedQuiz = { ...quiz };
    const questions = [...updatedQuiz.questions];
    const draggedQuestion = questions[draggedQuestionIndex];
    
    questions.splice(draggedQuestionIndex, 1);
    questions.splice(index, 0, draggedQuestion);
    
    updatedQuiz.questions = questions;
    onChange(updatedQuiz);
    setDraggedQuestionIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedQuestionIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => onChange({ ...quiz, title: e.target.value })}
            className="text-xl font-semibold mb-2"
            placeholder="Quiz Title"
          />
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={quiz.duration}
              onChange={(e) => onChange({ ...quiz, duration: parseInt(e.target.value) })}
              className="w-20 text-sm text-center"
              placeholder="Duration (min)"
            />
            <span className="text-sm text-gray-500">minutes</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="flex items-center gap-2 text-customGreen hover:text-green-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add Question
        </button>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
            draggable
            onDragStart={(e) => handleDragStart(e, questionIndex)}
            onDragOver={(e) => handleDragOver(e, questionIndex)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex items-start gap-4">
              <div className="cursor-move">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                      className="w-full text-lg font-medium mb-2"
                      placeholder={`Question ${questionIndex + 1}`}
                    />
                    <textarea
                      value={question.explanation}
                      onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      placeholder="Explanation (optional)"
                      rows="2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(questionIndex)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                        className="w-4 h-4 text-customGreen"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizBuilder; 