import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Clock, BookOpen, CheckCircle, XCircle, ArrowRight, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// Mock API call for the quiz - Replace with actual API implementation
const fetchQuiz = async (quizId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock quiz data - This would come from your API
  return {
    id: quizId,
    title: "Introduction to Quantum Computing Quiz",
    description: "Test your understanding of basic quantum computing concepts",
    time_limit_minutes: 20,
    passing_score: 70,
    questions: [
      {
        id: "q1",
        question: "What is a qubit?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "A classical bit that can only be 0 or 1" },
          { id: "b", text: "A quantum bit that can exist in superposition of states" },
          { id: "c", text: "A measurement unit for quantum processors" },
          { id: "d", text: "A unit of quantum energy" }
        ],
        correct_answer: "b",
        explanation: "A qubit, or quantum bit, is the basic unit of quantum information. Unlike classical bits which can be either 0 or 1, qubits can exist in a superposition of both states simultaneously."
      },
      {
        id: "q2",
        question: "Which of the following is NOT a key principle of quantum mechanics?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Superposition" },
          { id: "b", text: "Entanglement" },
          { id: "c", text: "Binary exclusivity" },
          { id: "d", text: "Interference" }
        ],
        correct_answer: "c",
        explanation: "Binary exclusivity is not a quantum principle. The key principles are superposition (existing in multiple states), entanglement (quantum correlation between particles), and interference (quantum probability waves that can amplify or cancel)."
      },
      {
        id: "q3",
        question: "Explain the concept of quantum entanglement in your own words.",
        type: "text",
        correct_answer: null, // No automatic checking for text answers
        word_limit: 100,
        explanation: "Quantum entanglement is a physical phenomenon where a pair or group of particles interact in such a way that the quantum state of each particle cannot be described independently of the others, regardless of the distance separating them."
      }
    ]
  };
};

// Mock API call for submitting the quiz - Replace with actual API implementation
const submitQuiz = async (quizId, answers) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // This would be calculated on the server in a real implementation
  const results = {
    passed: true,
    score: 85,
    total_questions: answers.length,
    correct_answers: Math.floor(answers.length * 0.85), // Mock calculation
    feedback: "Great job! You have a solid understanding of quantum computing basics.",
    question_results: answers.map(answer => {
      // Mock logic - in a real app this would be determined by the server
      const isCorrect = Math.random() > 0.3; // 70% chance of being correct
      return {
        question_id: answer.questionId,
        is_correct: isCorrect,
        points: isCorrect ? 1 : 0,
        feedback: isCorrect 
          ? "Correct! Well done." 
          : "Incorrect. Review the explanation for more information."
      };
    })
  };
  
  return results;
};

const QuizComponent = ({ quizId, lessonId, courseId, meta = {}, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch quiz data on component mount
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await fetchQuiz(quizId);
        setQuiz(quizData);
        
        // Initialize time limit from quiz data or metadata
        const timeLimit = quizData.time_limit_minutes || meta.time_limit || 20;
        setTimeRemaining(timeLimit * 60); // Convert minutes to seconds
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError(err.message || "Failed to load quiz data");
        toast.error("Could not load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId, meta]);
  
  // Timer countdown logic
  useEffect(() => {
    if (!quizStarted || !timeRemaining || timeRemaining <= 0 || quizSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time is up
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, quizSubmitted]);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    toast.info(`Quiz started! You have ${formatTime(timeRemaining)} to complete.`);
  };
  
  // Handle answer selection for multiple choice questions
  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  // Handle text input for open-ended questions
  const handleTextAnswer = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Submit the quiz
  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      // Check if user wants to submit with unanswered questions
      if (!window.confirm(`You have ${quiz.questions.length - Object.keys(answers).length} unanswered questions. Do you want to submit anyway?`)) {
        return;
      }
    }
    
    try {
      setSubmitting(true);
      
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      
      // Submit quiz
      const quizResults = await submitQuiz(quizId, formattedAnswers);
      setResults(quizResults);
      setQuizSubmitted(true);
      
      // Call onComplete callback if provided
      if (onComplete && typeof onComplete === 'function') {
        onComplete(quizResults);
      }
      
      showToast.success("Quiz submitted successfully!");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Reset the quiz to try again
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizStarted(false);
    setQuizSubmitted(false);
    setResults(null);
    setTimeRemaining(quiz.time_limit_minutes * 60);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-12 h-12 text-primaryColor animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Failed to Load Quiz</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Quiz intro screen
  if (!quizStarted && !quizSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-primaryColor mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{quiz.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{quiz.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Limit</p>
              <p className="font-semibold text-gray-800 dark:text-white">{quiz.time_limit_minutes} minutes</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Passing Score</p>
              <p className="font-semibold text-gray-800 dark:text-white">{quiz.passing_score}%</p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 mb-8 text-left">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Quiz Instructions:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
              <li>• Read each question carefully before answering</li>
              <li>• You can navigate between questions using the Next and Previous buttons</li>
              <li>• You can review and change your answers before submitting</li>
              <li>• Once time expires, the quiz will be automatically submitted</li>
              <li>• You need to score at least {quiz.passing_score}% to pass this quiz</li>
            </ul>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartQuiz}
            className="px-6 py-3 bg-primaryColor text-white rounded-full hover:bg-primaryColor/90 transition-colors font-medium text-lg flex items-center justify-center gap-2 mx-auto"
          >
            Start Quiz
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }
  
  // Quiz results screen
  if (quizSubmitted && results) {
    const isPassed = results.passed;
    
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          {isPassed ? (
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isPassed ? "Quiz Passed! 🎉" : "Quiz Not Passed"}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {results.feedback || (isPassed ? "Great job on completing the quiz!" : "Don't worry, you can retry the quiz.")}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">{results.score}%</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Passing</p>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">{quiz.passing_score}%</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">{results.correct_answers}/{results.total_questions}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Taken</p>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">
                {formatTime((quiz.time_limit_minutes * 60) - timeRemaining)}
              </p>
            </div>
          </div>
        </div>
        
        {!isPassed && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResetQuiz}
            className="px-6 py-3 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors font-medium flex items-center justify-center gap-2 mx-auto mb-6"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </motion.button>
        )}
        
        <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-4">Question Breakdown</h3>
        
        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const questionResult = results.question_results.find(r => r.question_id === question.id);
            const isCorrect = questionResult?.is_correct;
            
            return (
              <div 
                key={question.id}
                className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10' 
                    : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white mb-1">
                      {index + 1}. {question.question}
                    </p>
                    
                    {question.type === 'multiple_choice' && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Your answer:</p>
                        <p className="text-sm font-medium">
                          {question.options.find(opt => opt.id === answers[question.id])?.text || 'Not answered'}
                        </p>
                        
                        {!isCorrect && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Correct answer:</p>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              {question.options.find(opt => opt.id === question.correct_answer)?.text}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {question.type === 'text' && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Your answer:</p>
                        <p className="text-sm font-medium">
                          {answers[question.id] || 'Not answered'}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Active quiz interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasAnswered = answers[currentQuestion.id] !== undefined;
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz header with progress and timer */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center">
          <span className="bg-primaryColor text-white text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3">
            {currentQuestionIndex + 1}
          </span>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
              <div 
                className="h-2 bg-primaryColor rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
          <Clock className={`w-4 h-4 mr-1.5 ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`} />
          <span className={`text-sm font-mono font-medium ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      
      {/* Current question */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h3>
        
        {/* Multiple choice question */}
        {currentQuestion.type === 'multiple_choice' && (
          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <div 
                key={option.id}
                onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option.id
                    ? 'border-primaryColor bg-primaryColor/5 dark:bg-primaryColor/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-primaryColor'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[currentQuestion.id] === option.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primaryColor" />
                    )}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Text/essay question */}
        {currentQuestion.type === 'text' && (
          <div>
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primaryColor focus:border-primaryColor bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              rows={5}
              maxLength={currentQuestion.word_limit ? currentQuestion.word_limit * 6 : 1000} // Approximation for characters
            />
            {currentQuestion.word_limit && (
              <div className="flex justify-end mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Word limit: {currentQuestion.word_limit} words
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg flex items-center ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
          Previous
        </button>
        
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 flex items-center"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Question navigation dots */}
      <div className="flex justify-center mt-8 flex-wrap gap-2">
        {quiz.questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              currentQuestionIndex === index
                ? 'bg-primaryColor text-white'
                : answers[q.id] !== undefined
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            aria-label={`Go to question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizComponent; 