import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Calendar, Clock, Link2, Upload, FileCheck, FilePlus, ExternalLink, Download, CheckCircle, AlertTriangle, FileText, RefreshCw, X } from 'lucide-react';
import { showToast } from '@/utils/toastManager';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { formatDistanceToNow, format } from 'date-fns';
import dynamic from 'next/dynamic';

// Dynamically import Markdown editor to avoid SSR issues
const MarkdownEditor = dynamic(() => import('@/components/shared/MarkdownEditor'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-xl"></div>
});

// Mock API call to fetch assignment details - Replace with actual API call
const fetchAssignment = async (assignmentId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock assignment data - This would come from your API
  return {
    id: assignmentId,
    title: "Quantum Mechanics Assignment",
    description: "Apply quantum principles by solving the given problems and implementing a basic quantum system.",
    instructions: `## Assignment Instructions

1. **Part 1: Theoretical Questions**
   - Explain the concept of quantum superposition in your own words
   - Compare and contrast quantum computing with classical computing
   - Describe how quantum entanglement works and its practical applications

2. **Part 2: Practical Implementation**
   - Implement a basic quantum circuit using Qiskit
   - Run the circuit on a simulator and analyze the results
   - Optimize your circuit and explain your optimization approach

3. **Submission Guidelines**
   - Submit your answers in a single PDF or Markdown file
   - For code, include code snippets and screenshots of results
   - Cite any references you use
   
**Grading Criteria:**
- Accuracy of theoretical explanations (40%)
- Quality of implementation (40%)
- Clarity and organization (20%)`,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    max_score: 100,
    submission_type: "file", // could be "file", "link", "text", or "multiple"
    allowed_file_types: [".pdf", ".md", ".zip", ".ipynb"],
    max_file_size_mb: 10,
    resources: [
      {
        title: "Assignment Guidelines",
        url: "https://example.com/assignment-guide.pdf",
        type: "pdf"
      },
      {
        title: "Qiskit Documentation",
        url: "https://qiskit.org/documentation/",
        type: "link"
      }
    ]
  };
};

// Mock API call to submit assignment - Replace with actual API implementation
const submitAssignment = async (assignmentId, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response
  return {
    success: true,
    message: "Assignment submitted successfully!",
    submission_id: "sub_" + Math.random().toString(36).substr(2, 9),
    submission_date: new Date().toISOString(),
    status: "submitted"
  };
};

const AssessmentComponent = ({ assignmentId, lessonId, courseId, meta = {}, onSubmit }) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState(null);
  
  // Text submission state
  const [textSubmission, setTextSubmission] = useState("");
  
  // Link submission state
  const [linkSubmission, setLinkSubmission] = useState("");
  
  // File submission state
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // Fetch assignment details on component mount
  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true);
        const data = await fetchAssignment(assignmentId);
        setAssignment(data);
        
        // Check for existing submission in localStorage (in a real app, this would come from the API)
        const savedSubmission = localStorage.getItem(`assignment-${assignmentId}-submission`);
        if (savedSubmission) {
          try {
            const parsed = JSON.parse(savedSubmission);
            if (parsed.submitted) {
              setSubmitted(true);
              setSubmissionResponse(parsed.response);
            } else {
              // Restore draft
              if (data.submission_type === "text") {
                setTextSubmission(parsed.content || "");
              } else if (data.submission_type === "link") {
                setLinkSubmission(parsed.content || "");
              }
              // For files, we can't restore from localStorage in a meaningful way
            }
          } catch (e) {
            console.error("Error parsing saved submission:", e);
          }
        }
      } catch (err) {
        console.error("Error loading assignment:", err);
        setError(err.message || "Failed to load assignment details");
        toast.error("Could not load assignment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAssignment();
  }, [assignmentId]);
  
  // Save draft submission to localStorage
  const saveDraft = () => {
    if (!assignment) return;
    
    const submission = {
      submitted: false,
      timestamp: new Date().toISOString(),
      content: assignment.submission_type === "text" 
        ? textSubmission 
        : assignment.submission_type === "link"
          ? linkSubmission
          : null
    };
    
    localStorage.setItem(`assignment-${assignmentId}-submission`, JSON.stringify(submission));
    showToast.success("Draft saved successfully!");
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = selectedFiles.filter(file => {
      if (!assignment.allowed_file_types) return false;
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !assignment.allowed_file_types.includes(extension);
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(file => {
      if (!assignment.max_file_size_mb) return false;
      return file.size > assignment.max_file_size_mb * 1024 * 1024;
    });
    
    if (oversizedFiles.length > 0) {
      toast.error(`File(s) exceed ${assignment.max_file_size_mb}MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Add files to state
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  // Remove a file from the selection
  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  // Handle assignment submission
  const handleSubmit = async () => {
    if (!assignment) return;
    
    // Validate submission based on type
    if (assignment.submission_type === "text" && !textSubmission.trim()) {
      toast.error("Please enter your submission text");
      return;
    }
    
    if (assignment.submission_type === "link" && !linkSubmission.trim()) {
      toast.error("Please enter a valid submission link");
      return;
    }
    
    if ((assignment.submission_type === "file" || assignment.submission_type === "multiple") && files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare submission data
      let submissionData = {
        assignment_id: assignmentId,
        lesson_id: lessonId,
        course_id: courseId
      };
      
      if (assignment.submission_type === "text") {
        submissionData.content = textSubmission;
      } else if (assignment.submission_type === "link") {
        submissionData.link = linkSubmission;
      } else if (assignment.submission_type === "file" || assignment.submission_type === "multiple") {
        // In a real implementation, you would upload files to a server and include their references
        submissionData.files = files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }));
      }
      
      // Submit assignment
      const response = await submitAssignment(assignmentId, submissionData);
      setSubmissionResponse(response);
      setSubmitted(true);
      
      // Save submission in localStorage
      localStorage.setItem(`assignment-${assignmentId}-submission`, JSON.stringify({
        submitted: true,
        timestamp: new Date().toISOString(),
        response
      }));
      
      // Call onSubmit callback if provided
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit({
          assignmentId,
          submissionId: response.submission_id,
          submissionDate: response.submission_date
        });
      }
      
      showToast.success("Assignment submitted successfully!");
    } catch (err) {
      console.error("Error submitting assignment:", err);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Reset submission to edit
  const handleEditSubmission = () => {
    if (window.confirm("Are you sure you want to edit your submission? You will need to resubmit after making changes.")) {
      setSubmitted(false);
      setSubmissionResponse(null);
      
      // Clear localStorage submission status
      const savedSubmission = localStorage.getItem(`assignment-${assignmentId}-submission`);
      if (savedSubmission) {
        try {
          const parsed = JSON.parse(savedSubmission);
          localStorage.setItem(`assignment-${assignmentId}-submission`, JSON.stringify({
            ...parsed,
            submitted: false
          }));
        } catch (e) {
          console.error("Error updating saved submission:", e);
        }
      }
    }
  };
  
  // Format the due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const distanceToNow = formatDistanceToNow(date, { addSuffix: true });
    const formattedDate = format(date, "PPP p"); // e.g., "April 29, 2023 at 3:45 PM"
    
    return {
      relative: distanceToNow,
      formatted: formattedDate,
      isOverdue: date < new Date()
    };
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-12 h-12 text-primaryColor animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading assignment details...</p>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Failed to Load Assignment</h3>
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
  
  // Format due date information
  const dueDate = assignment?.due_date ? formatDueDate(assignment.due_date) : null;
  
  // Render successful submission view
  if (submitted && submissionResponse) {
    const submissionDate = new Date(submissionResponse.submission_date);
    
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Assignment Submitted!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            Your assignment has been submitted successfully.
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Submission ID</p>
              <p className="font-medium text-gray-800 dark:text-white">{submissionResponse.submission_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                <p className="font-medium text-gray-800 dark:text-white capitalize">{submissionResponse.status}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Submitted On</p>
              <p className="font-medium text-gray-800 dark:text-white">{format(submissionDate, "MMM d, yyyy")}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Submitted At</p>
              <p className="font-medium text-gray-800 dark:text-white">{format(submissionDate, "h:mm a")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">What happens next?</p>
              <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                Your submission will be reviewed by the instructor. Once graded, you'll receive feedback and your score.
                This typically takes 3-5 business days.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEditSubmission}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Edit Submission
          </motion.button>
          
          {assignment?.resources?.length > 0 && (
            <a
              href={assignment.resources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors flex items-center"
            >
              View Resources
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
        </div>
      </div>
    );
  }
  
  // Render assignment details and submission form
  return (
    <div className="max-w-3xl mx-auto">
      {/* Assignment header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h2>
          
          {dueDate && (
            <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              dueDate.isOverdue
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            }`}>
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>Due {dueDate.relative}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">{assignment.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <Clock className="w-4 h-4 text-blue-500 mb-1.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="font-medium text-gray-800 dark:text-white text-sm">{dueDate?.formatted || 'No due date'}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <FileText className="w-4 h-4 text-green-500 mb-1.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Submission Type</p>
            <p className="font-medium text-gray-800 dark:text-white text-sm capitalize">
              {assignment.submission_type === "file" ? "File Upload" : assignment.submission_type}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
            <CheckCircle className="w-4 h-4 text-purple-500 mb-1.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Max Score</p>
            <p className="font-medium text-gray-800 dark:text-white text-sm">{assignment.max_score} points</p>
          </div>
        </div>
        
        {/* Assignment instructions */}
        <div className="prose prose-sm dark:prose-invert max-w-none mb-6 border-t border-gray-100 dark:border-gray-700 pt-6">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(assignment.instructions)) }} />
        </div>
        
        {/* Assignment resources */}
        {assignment.resources && assignment.resources.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">Resources</h4>
            <div className="space-y-2">
              {assignment.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {resource.type === "pdf" ? (
                    <FileText className="w-5 h-5 text-red-500 mr-3" />
                  ) : (
                    <Link2 className="w-5 h-5 text-blue-500 mr-3" />
                  )}
                  <span className="text-gray-800 dark:text-white font-medium">{resource.title}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Submission form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your Submission</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Complete your assignment and submit it before the due date.
          </p>
        </div>
        
        <div className="p-6">
          {/* Text submission */}
          {assignment.submission_type === "text" && (
            <div className="mb-6">
              <MarkdownEditor
                value={textSubmission}
                onChange={setTextSubmission}
                height="300px"
                placeholder="Enter your assignment submission here. You can use Markdown for formatting."
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={saveDraft}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primaryColor"
                >
                  Save Draft
                </button>
              </div>
            </div>
          )}
          
          {/* Link submission */}
          {assignment.submission_type === "link" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Submission Link
              </label>
              <div className="flex">
                <input
                  type="url"
                  value={linkSubmission}
                  onChange={(e) => setLinkSubmission(e.target.value)}
                  placeholder="https://github.com/yourusername/your-project"
                  className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-l-lg focus:ring-primaryColor focus:border-primaryColor bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={saveDraft}
                  className="px-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 border-l-0 rounded-r-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Save Draft
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Provide a URL to your repository, document, or project.
              </p>
            </div>
          )}
          
          {/* File submission */}
          {(assignment.submission_type === "file" || assignment.submission_type === "multiple") && (
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple={assignment.submission_type === "multiple"}
                  accept={assignment.allowed_file_types?.join(',')}
                  className="hidden"
                />
                
                <FilePlus className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Drag and drop your file(s) or</p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors inline-flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </button>
                
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Allowed file types: {assignment.allowed_file_types?.join(', ') || 'All files'}
                  <br />
                  Maximum file size: {assignment.max_file_size_mb || 10}MB per file
                </p>
              </div>
              
              {/* File list */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-2">Selected Files</h4>
                  
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    >
                      <div className="flex items-center overflow-hidden">
                        <FileText className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-500 hover:text-red-500"
                        aria-label="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Submission button */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {dueDate && (
                <span className={dueDate.isOverdue ? 'text-red-500' : ''}>
                  {dueDate.isOverdue ? 'Overdue!' : 'Due'} {dueDate.formatted}
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-6 py-2.5 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors flex items-center ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Assignment
                  <Upload className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentComponent; 