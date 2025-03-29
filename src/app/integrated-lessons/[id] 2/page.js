"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Clock, 
  ChevronLeft, 
  Download, 
  Menu, 
  CheckCircle, 
  ChevronUp, 
  Play, 
  Loader,
  AlertCircle,
  Calendar,
  Users,
  Clock3,
  WifiOff,
  RefreshCw,
  Star,
  Eye,
  UserCheck,
  BookOpenCheck,
  GraduationCap,
  Award,
  FileQuestion,
  ClipboardList,
  Video,
  FileText as FileIcon,
  DollarSign,
  Globe,
  FileBox,
  Timer,
  ChevronRight,
  Beaker,
  Brain,
  Code2,
  Cpu,
  Database,
  FlaskConical,
  Microscope,
  Target,
  Users2,
  ChevronDown,
  FileUp,
  Link2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import useCourseLesson from "@/hooks/useCourseLesson.hook";
import { toast } from "react-toastify";
import VideoPlayer from '@/components/shared/lessons/VideoPlayer';

// Import necessary components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import LessonAccordion from "@/components/shared/lessons/LessonAccordion";

// Add new imports for enhanced functionality
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatDuration, formatDate } from "@/utils/format";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import clsx from "clsx";

const CourseMetrics = ({ meta }) => {
  if (!meta) return null;
  
  const metrics = [
    { icon: Eye, label: "views", value: meta.views.toLocaleString() },
    { icon: Star, label: "rating", value: `${meta.ratings.average} (${meta.ratings.count})` },
    { icon: UserCheck, label: "enrolled", value: meta.enrollments }
  ];
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
        >
          <metric.icon className={`w-4 h-4 ${metric.label === "rating" ? "text-yellow-400" : ""}`} />
          <span>{metric.value} {metric.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const CoursePricing = ({ prices }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  if (!prices?.length) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Pricing Options
      </h3>
      <div className="space-y-4">
        {prices.map((price, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {price.currency}
              </span>
              <span className="text-lg font-bold text-primaryColor">
                {price.currency} {price.individual}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-2" />
                Batch price: {price.currency} {price.batch}
                <span className="ml-2 text-xs text-gray-500">
                  (min: {price.min_batch_size}, max: {price.max_batch_size})
                </span>
              </div>
              {price.early_bird_discount > 0 && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Early bird discount: {price.early_bird_discount}% off
                </div>
              )}
              {price.group_discount > 0 && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-2" />
                  Group discount: {price.group_discount}% off
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CourseResources = ({ resources }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  if (!resources?.length) return null;

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const resourceTypes = ["all", ...new Set(resources.map(r => r.type).filter(Boolean))];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileIcon className="w-5 h-5 mr-2" />
        Course Resources
      </h3>
      
      <div className="mb-4 space-y-3">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
        />
        
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === type
                  ? "bg-primaryColor text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <div className="flex-1">
              <h4 className="font-medium group-hover:text-primaryColor transition-colors">
                {resource.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {resource.description}
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-4">
                {resource.size_mb && (
                  <span className="flex items-center">
                    <FileBox className="w-3 h-3 mr-1" />
                    {resource.size_mb} MB
                  </span>
                )}
                {resource.pages && (
                  <span className="flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {resource.pages} pages
                  </span>
                )}
                {resource.upload_date && (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(resource.upload_date)}
                  </span>
                )}
              </div>
            </div>
            <motion.a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 p-2 text-primaryColor hover:bg-primaryColor/10 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
            </motion.a>
          </motion.div>
        ))}
        
        {filteredResources.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No resources found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseAssignments = ({ assignments }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  if (!assignments?.length) return null;

  const filteredAssignments = assignments.filter(assignment => 
    selectedStatus === "all" || assignment.status === selectedStatus
  );

  const statuses = ["all", "pending", "submitted", "graded"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ClipboardList className="w-5 h-5 mr-2" />
        Assignments
      </h3>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedStatus === status
                ? "bg-primaryColor text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  {assignment.title}
                  {assignment.status === "graded" && (
                    <span className="text-sm font-medium bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded">
                      Graded
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {assignment.description}
                </p>
              </div>
              <span className="text-sm font-medium bg-primaryColor/10 text-primaryColor px-2 py-1 rounded ml-4">
                {assignment.maxScore} points
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mt-3">
              <div className="space-x-4">
                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {formatDate(assignment.dueDate)}
                </span>
                {assignment.timeLeft && (
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {assignment.timeLeft} remaining
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {assignment.resources?.length > 0 && (
                  <Link
                    href={assignment.resources[0].fileUrl}
                    className="text-primaryColor hover:underline flex items-center"
                  >
                    <FileIcon className="w-4 h-4 mr-1" />
                    Guidelines
                  </Link>
                )}
                {assignment.status !== "submitted" && (
                  <button
                    onClick={() => {/* Handle submission */}}
                    className="px-3 py-1 text-sm font-medium bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredAssignments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No assignments found with the selected status</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseQuizzes = ({ quizzes }) => {
  if (!quizzes?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileQuestion className="w-5 h-5 mr-2" />
        Quizzes
      </h3>
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{quiz.title}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {quiz.duration} min
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {quiz.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CourseFAQs = ({ faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);

  if (!faqs?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <HelpCircle className="w-5 h-5 mr-2" />
        Frequently Asked Questions
      </h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b last:border-0 pb-3 last:pb-0"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full text-left flex justify-between items-start py-2"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronUp
                className={`w-5 h-5 transform transition-transform ${
                  openFaq === index ? "" : "rotate-180"
                }`}
              />
            </button>
            <AnimatePresence>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-2">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CourseOverview = ({ courseData }) => {
  if (!courseData?.course_description) return null;

  const { program_overview, benefits, learning_objectives, course_requirements, target_audience } = courseData.course_description;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <BookOpenCheck className="w-6 h-6 mr-2 text-primaryColor" />
        Course Overview
      </h3>

      <div className="space-y-6">
        {/* Program Overview */}
        <div>
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2 text-primaryColor" />
            Program Overview
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {program_overview}
          </p>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-primaryColor" />
            Benefits
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {benefits}
          </p>
        </div>

        {/* Learning Objectives */}
        {learning_objectives?.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primaryColor" />
              Learning Objectives
            </h4>
            <ul className="space-y-2">
              {learning_objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Course Requirements */}
        {course_requirements?.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-primaryColor" />
              Prerequisites
            </h4>
            <ul className="space-y-2">
              {course_requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="w-5 h-5 mr-2 text-primaryColor mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Target Audience */}
        {target_audience?.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <Users2 className="w-5 h-5 mr-2 text-primaryColor" />
              Who Should Take This Course
            </h4>
            <ul className="space-y-2">
              {target_audience.map((audience, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="w-5 h-5 mr-2 text-primaryColor mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{audience}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools & Technologies */}
        {courseData.tools_technologies?.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <Code2 className="w-5 h-5 mr-2 text-primaryColor" />
              Tools & Technologies
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {courseData.tools_technologies.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                    {tool.category === 'framework' && <Code2 className="w-5 h-5 text-primaryColor" />}
                    {tool.category === 'programming_language' && <Database className="w-5 h-5 text-primaryColor" />}
                    {tool.category === 'platform' && <Cpu className="w-5 h-5 text-primaryColor" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tool.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// FAQ section component
const FAQSection = ({ faqs }) => {
  if (!faqs?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <HelpCircle className="w-6 h-6 mr-2 text-primaryColor" />
        Frequently Asked Questions
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group"
            open={index === 0}
          >
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <h4 className="text-base font-medium pr-2">
                {faq.question}
              </h4>
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-4 text-gray-600 dark:text-gray-300">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

// Final evaluation section component
const FinalEvaluation = ({ evaluation }) => {
  if (!evaluation) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <GraduationCap className="w-6 h-6 mr-2 text-primaryColor" />
        Final Evaluation
      </h3>

      <div className="space-y-6">
        {/* Project Description */}
        <div>
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <FileBox className="w-5 h-5 mr-2 text-primaryColor" />
            Project Description
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {evaluation.project_description}
          </p>
        </div>

        {/* Evaluation Criteria */}
        {evaluation.evaluation_criteria?.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-primaryColor" />
              Evaluation Criteria
            </h4>
            <ul className="space-y-2">
              {evaluation.evaluation_criteria.map((criterion, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submission Guidelines */}
        {evaluation.submission_guidelines?.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <FileUp className="w-5 h-5 mr-2 text-primaryColor" />
              Submission Guidelines
            </h4>
            <ul className="space-y-2">
              {evaluation.submission_guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="w-5 h-5 mr-2 text-primaryColor mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grading Rubric */}
        {evaluation.grading_rubric && (
          <div>
            <h4 className="text-lg font-medium mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primaryColor" />
              Grading Rubric
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(evaluation.grading_rubric).map(([component, details], index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {component}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {details.weight}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {details.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced loading component
const LoadingState = ({ message = "Loading...", description }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 mx-auto"
      >
        <Loader className="w-full h-full text-primaryColor" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {message}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Update the navigation logic
const findNextAndPreviousLessons = (curriculum, currentLessonId) => {
  let prevLesson = null;
  let nextLesson = null;
  let foundCurrent = false;

  // Guard against undefined or invalid curriculum
  if (!Array.isArray(curriculum)) {
    console.warn('Invalid curriculum format: expected an array');
    return { prevLesson: null, nextLesson: null };
  }

  // Flatten the curriculum structure for navigation
  const allLessons = curriculum.reduce((acc, week) => {
    // Guard against invalid week structure
    if (!week || !Array.isArray(week.sections)) {
      console.warn('Invalid week format: missing or invalid sections array');
      return acc;
    }

    const weekLessons = week.sections.reduce((sectionAcc, section) => {
      // Guard against invalid section structure
      if (!section || !Array.isArray(section.lessons)) {
        console.warn('Invalid section format: missing or invalid lessons array');
        return sectionAcc;
      }

      return [...sectionAcc, ...section.lessons.map(lesson => ({
        ...lesson,
        weekTitle: week.weekTitle || 'Untitled Week',
        sectionTitle: section.title || 'Untitled Section'
      }))];
    }, []);
    return [...acc, ...weekLessons];
  }, []);

  // Sort lessons by order
  const sortedLessons = allLessons.sort((a, b) => (a.order || 0) - (b.order || 0));

  // Find current, next and previous lessons
  for (let i = 0; i < sortedLessons.length; i++) {
    if (sortedLessons[i]._id === currentLessonId) {
      foundCurrent = true;
      if (i > 0) {
        prevLesson = sortedLessons[i - 1];
      }
      if (i < sortedLessons.length - 1) {
        nextLesson = sortedLessons[i + 1];
      }
      break;
    }
  }

  return { prevLesson, nextLesson };
};

// Resources list component
const ResourcesList = ({ resources }) => {
  if (!resources?.length) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <FileBox className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">No resources available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource, index) => (
        <div
          key={index}
          className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex-shrink-0">
            {resource.type === 'pdf' && (
              <div className="w-10 h-10 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
            )}
            {resource.type === 'code' && (
              <div className="w-10 h-10 rounded bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-purple-500" />
              </div>
            )}
            {resource.type === 'link' && (
              <div className="w-10 h-10 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-500" />
              </div>
            )}
            {resource.type === 'dataset' && (
              <div className="w-10 h-10 rounded bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {resource.title}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {resource.size && `${resource.size} • `}
                {resource.type.toUpperCase()}
              </span>
            </div>
            {resource.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {resource.description}
              </p>
            )}
            <div className="mt-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primaryColor hover:text-primaryColor/80"
              >
                {resource.type === 'link' ? 'Visit Resource' : 'Download'}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton for resources
const ResourcesSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// Loading skeleton for the course page
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-1" />
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-6" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-2" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IntegratedLesson = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  
  // State for UI controls
  const [contentOpen, setContentOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showError, setShowError] = useState(false);
  
  // New hooks for enhanced functionality
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [autoplay, setAutoplay] = useLocalStorage("video-autoplay", true);
  const [quality, setQuality] = useLocalStorage("video-quality", "auto");
  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage("video-speed", 1);
  
  // Track lesson progress
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Use our custom hook for course and lesson data
  const {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    submitAssignment,
    submitQuiz,
    getLoading,
    postLoading
  } = useCourseLesson(id, id);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      setShowError(true);
      toast.error(error.message || 'An error occurred');
    } else {
      setShowError(false);
    }
  }, [error]);
  
  // Handle marking lesson as complete
  const handleMarkComplete = async () => {
    if (!isOnline) {
      toast.error('No internet connection. Please check your connection and try again.');
      return;
    }

    try {
      setIsCompleting(true);
      await markLessonComplete({
        completed_at: new Date().toISOString(),
        duration: 0
      });
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Handle video progress
  const handleTimeUpdate = (currentTime) => {
    setProgress((currentTime / lessonData?.duration) * 100);
    setLastPosition(currentTime);
    
    // Auto-mark as complete when near the end
    if (progress > 95 && !lessonData?.is_completed) {
      handleMarkComplete();
    }
  };
  
  // Save last position before unloading
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(`lesson-${id}-position`, lastPosition);
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [id, lastPosition]);
  
  // Restore last position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(`lesson-${id}-position`);
    if (savedPosition) {
      setLastPosition(parseFloat(savedPosition));
    }
  }, [id]);

  // Get next and previous lessons
  const { prevLesson, nextLesson } = useMemo(() => {
    if (!courseData?.curriculum) return { prevLesson: null, nextLesson: null };
    return findNextAndPreviousLessons(courseData.curriculum, id);
  }, [courseData, id]);

  // Default lesson structure with proper typing
  const defaultLessonStructure = {
    weekTitle: "Loading Course Content",
    weekDescription: "Please wait while we load the course content",
    sections: [
      {
        title: "Introduction",
        description: "Loading course introduction...",
        order: 1,
        lessons: [
          {
            _id: "loading",
            title: "Loading Lesson",
            description: "Please wait while we load the lesson content",
            content: "Loading...",
            duration: 0,
            order: 1,
            type: "video"
          }
        ]
      }
    ]
  };

  // Course info section with quantum-specific metadata
  const CourseInfo = ({ courseData }) => {
    const data = courseData || {
      course_title: "Loading...",
      course_duration: "Loading...",
      no_of_Sessions: "-",
      course_tag: "",
      meta: { views: 0, ratings: { average: 0, count: 0 }, enrollments: 0 }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {data.course_title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primaryColor/10 text-primaryColor">
                {data.course_tag}
              </span>
              <span className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 mr-1" />
                {data.meta.ratings.average.toFixed(1)}
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  ({data.meta.ratings.count} ratings)
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Clock3 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
              <div className="font-medium">{data.course_duration}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Sessions</div>
              <div className="font-medium">{data.no_of_Sessions} lessons</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Enrolled</div>
              <div className="font-medium">{data.meta.enrollments} students</div>
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Cpu className="w-3.5 h-3.5" />
            Quantum Computing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Code2 className="w-3.5 h-3.5" />
            Qiskit
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <Brain className="w-3.5 h-3.5" />
            Quantum Algorithms
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Microscope className="w-3.5 h-3.5" />
            Hands-on Labs
          </span>
        </div>
      </div>
    );
  };

  // Loading state with context
  if (loading || getLoading || postLoading) {
    return (
      <PageWrapper>
        <LoadingState 
          message={
            getLoading ? 'Loading lesson content...' : 
            postLoading ? 'Processing your request...' :
            'Initializing...'
          }
          description={
            getLoading ? 'Please wait while we fetch your lesson' : 
            postLoading ? 'Please wait while we process your request' :
            'Please wait while we set up the course'
          }
        />
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen">
          {/* Left Column: Video Player and Content (60-70% width) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <Link 
                  href="/integrated-lessons" 
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primaryColor transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Back to course</span>
                </Link>
                <div className="flex items-center gap-4">
                  {/* Video Controls */}
                  {lessonData?.type === "video" && (
                    <>
                      <button
                        onClick={() => setAutoplay(!autoplay)}
                        className={`text-sm font-medium ${
                          autoplay ? "text-primaryColor" : "text-gray-500"
                        }`}
                      >
                        Autoplay
                      </button>
                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="text-sm bg-transparent border-none focus:ring-0"
                      >
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                      </select>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="text-sm bg-transparent border-none focus:ring-0"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-6">
                {/* Lesson Title and Info */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {courseData?.course_title}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {lessonData?.title || "Loading..."}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDuration(lessonData?.duration || 0)}
                    </span>
                    {lessonData?.type && (
                      <span className="flex items-center">
                        <ItemTypeIcon type={lessonData.type} className="w-4 h-4 mr-2" />
                        {lessonData.type.charAt(0).toUpperCase() + lessonData.type.slice(1)}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Video Player or Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8"
                >
                  {lessonData?.type === 'video' ? (
                    <VideoPlayer
                      src={lessonData.videoUrl}
                      poster={lessonData.thumbnailUrl}
                      autoplay={autoplay}
                      quality={quality}
                      playbackSpeed={playbackSpeed}
                      onProgress={(progress, currentTime) => {
                        // Update progress in your state management
                        console.log('Progress:', progress, 'Current Time:', currentTime);
                      }}
                      onEnded={() => {
                        // Handle video completion
                        if (nextLesson && autoplay) {
                          router.push(`/integrated-lessons/${nextLesson._id}`);
                        }
                      }}
                      onError={(error) => {
                        toast.error('Error playing video. Please try again.');
                        console.error('Video Error:', error);
                      }}
                    />
                  ) : (
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-4">
                          {lessonData?.type === 'document' && <FileText className="w-12 h-12 mx-auto text-gray-400" />}
                          {lessonData?.type === 'quiz' && <HelpCircle className="w-12 h-12 mx-auto text-gray-400" />}
                          {lessonData?.type === 'assignment' && <ClipboardList className="w-12 h-12 mx-auto text-gray-400" />}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          This content is not a video. Please check the content below.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Tabs for Additional Content */}
                <div className="mb-8">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8" aria-label="Lesson content">
                      <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          true
                            ? "border-primaryColor text-primaryColor"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          false
                            ? "border-primaryColor text-primaryColor"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Transcript
                      </button>
                      <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          false
                            ? "border-primaryColor text-primaryColor"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Notes
                      </button>
                      <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          false
                            ? "border-primaryColor text-primaryColor"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Resources
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      {lessonData?.description || "No description available."}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  {prevLesson ? (
                    <button
                      onClick={() => router.push(`/integrated-lessons/${courseData._id}/lecture/${prevLesson.id}`)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextLesson && (
                    <button
                      onClick={() => router.push(`/integrated-lessons/${courseData._id}/lecture/${nextLesson.id}`)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Course Curriculum (30-40% width) */}
          <div className="w-[400px] border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <LessonAccordion
              currentLessonId={id}
              courseData={courseData}
              onLessonSelect={(lesson) => {
                if (!lesson?.id) {
                  console.error('Invalid lesson selected:', lesson);
                  return;
                }

                // Validate the lesson exists in the curriculum
                const isValidLesson = courseData?.curriculum?.some(week => 
                  week?.sections?.some(section =>
                    section?.lessons?.some(l => l?.id === lesson.id)
                  )
                );

                if (!isValidLesson) {
                  console.error('Selected lesson not found in curriculum:', lesson.id);
                  return;
                }

                // Only navigate if it's a different lesson
                if (lesson.id !== id) {
                  router.push(`/integrated-lessons/${courseData._id}/lecture/${lesson.id}`);
                }
              }}
              className="h-full"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <motion.button
              onClick={() => setContentOpen(!contentOpen)}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-primaryColor text-white rounded-full shadow-lg"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default IntegratedLesson;