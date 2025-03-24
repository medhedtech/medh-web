import { Video, FileQuestion, FileBox, FileText, Code, Link2 } from 'lucide-react';

/**
 * A component that displays the appropriate icon for a lesson type
 * @param {Object} props - Component props
 * @param {string} props.lessonType - The type of lesson (video, quiz, assessment, etc.)
 * @param {number} props.size - Size of the icon in pixels
 * @param {string} props.className - Additional CSS classes
 */
const LessonTypeIcon = ({ lessonType = 'video', size = 16, className = '' }) => {
  switch (lessonType?.toLowerCase()) {
    case 'video':
      return <Video size={size} className={`text-blue-500 ${className}`} />;
    
    case 'quiz':
      return <FileQuestion size={size} className={`text-yellow-500 ${className}`} />;
    
    case 'assessment':
      return <FileBox size={size} className={`text-orange-500 ${className}`} />;
    
    case 'article':
      return <FileText size={size} className={`text-purple-500 ${className}`} />;
    
    case 'code':
      return <Code size={size} className={`text-green-500 ${className}`} />;
    
    case 'link':
      return <Link2 size={size} className={`text-gray-500 ${className}`} />;
    
    default:
      return <FileText size={size} className={`text-gray-400 ${className}`} />;
  }
};

export default LessonTypeIcon; 