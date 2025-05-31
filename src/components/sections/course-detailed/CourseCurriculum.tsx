import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  ChevronDown,
  Play,
  CheckCircle,
  Lock,
  Video,
  FileQuestion,
  ClipboardList,
  FileText,
  Users,
  Monitor,
  Headphones,
  BookOpenCheck,
  Target,
  Lightbulb,
  TrendingUp
} from "lucide-react";

// TypeScript Interfaces - Enhanced for flexibility
interface ILesson {
  _id: string;
  title: string;
  duration?: string;
  completed?: boolean;
  type?: string;
  lessonType?: string;
  description?: string;
  status?: string;
  is_completed?: boolean;
}

interface ISection {
  _id: string;
  title: string;
  lessons: ILesson[];
  description?: string;
}

interface IWeek {
  _id: string;
  weekTitle: string;
  weekDescription?: string;
  sections?: ISection[];
  lessons?: ILesson[];
  topics?: string[];
  resources?: any[];
}

interface ICourseCurriculumProps {
  curriculum: IWeek[];
  onLessonSelect: (lesson: ILesson) => void;
}

const CourseCurriculum: React.FC<ICourseCurriculumProps> = ({ 
  curriculum, 
  onLessonSelect 
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]));

  const toggleWeek = (weekIndex: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekIndex)) {
        newSet.delete(weekIndex);
      } else {
        newSet.add(weekIndex);
      }
      return newSet;
    });
  };

  const formatDuration = (duration: any): string => {
    if (!duration) return "60 min"; // Default for video courses
    if (typeof duration === "string") return duration;
    
    if (typeof duration === "number") {
      if (duration < 60) return `${duration} min`;
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    
    return "60 min";
  };

  const getContentIcon = (week: IWeek, index: number) => {
    const title = week.weekTitle?.toLowerCase() || "";
    
    if (title.includes("video")) return <Video className="w-5 h-5" />;
    if (title.includes("live") || title.includes("session")) return <Users className="w-5 h-5" />;
    if (title.includes("assignment") || title.includes("project")) return <ClipboardList className="w-5 h-5" />;
    if (title.includes("quiz") || title.includes("assessment")) return <FileQuestion className="w-5 h-5" />;
    
    // Default icons based on index for variety
    const icons = [Video, BookOpen, Target, Lightbulb, TrendingUp];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5" />;
  };

  const getModuleTypeColor = (week: IWeek) => {
    const title = week.weekTitle?.toLowerCase() || "";
    
    if (title.includes("video")) return "from-blue-500 to-indigo-600";
    if (title.includes("live")) return "from-green-500 to-emerald-600";
    if (title.includes("assignment")) return "from-orange-500 to-amber-600";
    if (title.includes("quiz")) return "from-purple-500 to-violet-600";
    
    return "from-emerald-500 to-teal-600"; // Default
  };

  const extractTopicsFromDescription = (description: string): string[] => {
    if (!description) return [];
    
    // Try to extract structured content
    const lines = description.split('\n').filter(line => line.trim());
    const topics: string[] = [];
    
    let currentTopic = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith('overview') || 
          trimmed.toLowerCase().startsWith('relevance') ||
          trimmed.toLowerCase().includes('topic')) {
        if (currentTopic) {
          topics.push(currentTopic.trim());
        }
        currentTopic = trimmed;
      } else if (currentTopic && trimmed) {
        currentTopic += ' ' + trimmed;
      }
    }
    
    if (currentTopic) {
      topics.push(currentTopic.trim());
    }
    
    return topics.length > 0 ? topics : [description];
  };

  if (!curriculum?.length) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          Curriculum Coming Soon
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We're putting together an amazing curriculum for this course. Check back soon for updates!
        </p>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          Course Curriculum
        </h2>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
          {curriculum.length} modules
        </div>
      </div>
      
      <div className="space-y-4">
        {curriculum.map((week, weekIndex) => {
          const isExpanded = expandedWeeks.has(weekIndex);
          const hasContent = week.lessons?.length || week.sections?.length || week.topics?.length || week.weekDescription;
          const topics = week.topics?.length ? week.topics : extractTopicsFromDescription(week.weekDescription || "");
          
          return (
            <motion.div 
              key={week._id || weekIndex} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: weekIndex * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
            >
              {/* Module Header */}
              <motion.button 
                onClick={() => hasContent && toggleWeek(weekIndex)}
                className={`w-full flex items-center justify-between p-6 text-left transition-all group ${
                  hasContent ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer' : 'cursor-default'
                }`}
                whileHover={hasContent ? { scale: 1.002 } : {}}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getModuleTypeColor(week)} flex items-center justify-center shadow-lg text-white`}>
                    {getContentIcon(week, weekIndex)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {week.weekTitle || `Module ${weekIndex + 1}`}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(null)}
                      </span>
                      
                      {topics.length > 0 && (
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {topics.length} topics
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Content indicators moved to right side */}
                <div className="flex items-center gap-3 mr-4">
                  {week.weekTitle?.toLowerCase().includes('video') && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium">
                      Video
                    </span>
                  )}
                  {week.weekTitle?.toLowerCase().includes('live') && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full font-medium">
                      Live
                    </span>
                  )}
                </div>

                {hasContent && (
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-emerald-500 ${
                    isExpanded ? 'rotate-180' : ''
                  }`} />
                )}
              </motion.button>
              
              {/* Module Content */}
              <AnimatePresence>
                {isExpanded && hasContent && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 space-y-4">
                      {/* Topics/Content */}
                      {topics.length > 0 && (
                        <div className="space-y-3">
                          {topics.map((topic, topicIndex) => (
                            <motion.div
                              key={topicIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: topicIndex * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-lg border border-emerald-100/50 dark:border-emerald-800/30"
                            >
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                  {topic.replace(/^(Overview|Relevance)[\s:]*/, '')}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Traditional Lessons (if any) */}
                      {week.lessons?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3">Lessons</h4>
                          {week.lessons.map((lesson, lessonIndex) => (
                            <motion.button
                              key={lesson._id || lessonIndex}
                              onClick={() => onLessonSelect(lesson)}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group text-left"
                            >
                              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Play className="w-4 h-4 text-white ml-0.5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {lesson.title}
                                </h5>
                                {lesson.duration && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDuration(lesson.duration)}
                                  </p>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Sections (if any) */}
                      {week.sections?.map((section, sectionIndex) => (
                        <div key={section._id || sectionIndex} className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{section.title}</h4>
                          {section.lessons?.map((lesson, lessonIndex) => (
                            <motion.button
                              key={lesson._id || lessonIndex}
                              onClick={() => onLessonSelect(lesson)}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group text-left"
                            >
                              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Play className="w-4 h-4 text-white ml-0.5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {lesson.title}
                                </h5>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default CourseCurriculum; 