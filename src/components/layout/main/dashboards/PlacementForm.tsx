"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Send, 
  Loader2, 
  Building2, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  MessageSquare,
  X,
  FileText,
  Gift,
  Code,
  Award,
  Bookmark,
  Link as LinkIcon,
  Calendar,
  Clock,
  Upload,
  Building,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { 
  FieldArrayWithId, 
  UseFieldArrayAppend, 
  UseFieldArrayRemove, 
  UseFormRegister, 
  FieldErrors,
  UseFormGetValues,
  Resolver
} from 'react-hook-form';

// Define your API endpoints for the placement form
// Add these near the top of the file after imports
const PLACEMENT_FORM_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/placement-form`;
const USER_PROFILE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/user/profile`;

interface Education {
  degree: string;
  institution: string;
  year: number;
  grade: string;
}

interface Achievement {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  url?: string;
}

interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
  technologies?: string;
  achievements?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string;
  projectUrl?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  isOpenSource?: boolean;
}

interface Internship {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  resumeFile: FileList;
  linkedin_profile: string;
  github_profile: string;
  portfolio_url: string;
  website: string;
  highest_education: string;
  university: string;
  degree: string;
  field_of_study: string;
  graduation_year: string;
  gpa: string;
  work_experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    technologies: string;
    achievements: string;
  }[];
  internships: {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string;
    githubUrl: string;
    demoUrl: string;
    startDate: string;
    endDate: string;
    current: boolean;
    role: string;
    highlights: string;
  }[];
  skills: string[];
  achievements: {
    title: string;
    issuer: string;
    date: string;
    description: string;
    url: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
    expiry: string;
    credentialID: string;
    url: string;
  }[];
  preferred_location: string;
  preferred_job_type: string;
  preferred_work_type: string;
  expected_salary: string;
  notice_period: string;
  references: {
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }[];
  additional_info: string;
  message: string;
  willing_to_relocate: boolean;
  availability_date: string;
  languages_known: string;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
  error?: string;
  required?: boolean;
  fieldName?: string;
  validationErrors?: Set<string>;
}

// File size validator
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const schema = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[0-9]{10}$/,
      'Phone number must be 10 digits without spaces or special characters'
    ),
  resumeFile: yup.mixed<FileList>().required('Resume is required'),
  linkedin_profile: yup.string().url('Must be a valid URL'),
  github_profile: yup.string().url('Must be a valid URL'),
  portfolio_url: yup.string().url('Must be a valid URL'),
  website: yup.string().url('Must be a valid URL'),
  highest_education: yup.string().required('Highest education is required'),
  university: yup.string().required('University is required'),
  degree: yup.string().required('Degree is required'),
  field_of_study: yup.string().required('Field of study is required'),
  graduation_year: yup.string().required('Graduation year is required'),
  gpa: yup.string().required('GPA is required'),
  work_experience: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Job title is required'),
      company: yup.string().required('Company name is required'),
      location: yup.string(),
      startDate: yup.string().required('Start date is required'),
      endDate: yup.string().when('current', {
        is: false,
        then: (schema) => schema.required('End date is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
      current: yup.boolean(),
      description: yup.string().required('Job description is required'),
      technologies: yup.string(),
      achievements: yup.string(),
    })
  ),
  internships: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Internship title is required'),
      company: yup.string().required('Company name is required'),
      startDate: yup.string().required('Start date is required'),
      endDate: yup.string().required('End date is required'),
      description: yup.string().required('Internship description is required'),
    })
  ),
  projects: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Project title is required'),
      description: yup.string().required('Project description is required'),
      technologies: yup.string().required('Technologies used is required'),
      githubUrl: yup.string().url('Must be a valid URL'),
      demoUrl: yup.string().url('Must be a valid URL'),
      startDate: yup.string(),
      endDate: yup.string(),
      current: yup.boolean(),
      role: yup.string(),
      highlights: yup.string(),
    })
  ),
  skills: yup.array().of(yup.string()),
  languages_known: yup.string().required("Languages are required"),
  achievements: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Achievement title is required'),
      issuer: yup.string(),
      date: yup.string().required('Date is required'),
      description: yup.string(),
      url: yup.string().url('Must be a valid URL'),
    })
  ),
  certifications: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Certification title is required'),
      issuer: yup.string().required('Issuer is required'),
      date: yup.string().required('Date is required'),
      expiry: yup.string(),
      credentialID: yup.string(),
      url: yup.string().url('Must be a valid URL'),
    })
  ),
  preferred_location: yup.string(),
  preferred_job_type: yup.string(),
  preferred_work_type: yup.string().required('Preferred work type is required'),
  expected_salary: yup.string(),
  notice_period: yup.string(),
  willing_to_relocate: yup.boolean().required("This field is required"),
  availability_date: yup.string(),
  message: yup.string().required("Message is required"),
  references: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Reference name is required'),
      position: yup.string(),
      company: yup.string(),
      email: yup.string().email('Invalid email'),
      phone: yup.string(),
      relationship: yup.string(),
    })
  ),
  additional_info: yup.string(),
});

const FormInput: React.FC<FormInputProps> = ({ label, icon: Icon, error, required, fieldName, validationErrors, ...props }) => {
  const hasValidationError = fieldName && validationErrors?.has(fieldName);
  
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors ${
            error || hasValidationError 
              ? 'text-red-500' 
              : 'text-gray-400 group-focus-within:text-primary-500'
          }`} />
        </div>
        <input
          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
            error || hasValidationError
              ? 'border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-200 dark:ring-red-800' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 bg-white dark:bg-gray-800'
          } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
          {...props}
        />
      </div>
      <AnimatePresence mode="wait">
        {(error || (hasValidationError && required)) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1 flex items-center"
          >
            <span className="mr-1">⚠️</span>
            {error || 'This field is required'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FormTextAreaProps {
  label: string;
  icon: React.ElementType;
  error?: string;
  rows?: number;
  [key: string]: any;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({ label, icon: Icon, error, rows = 4, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute top-3 left-3 pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
      </div>
      <textarea
        rows={rows}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none`}
        {...props}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

interface FormSelectProps {
  label: string;
  icon: React.ElementType;
  error?: string;
  options: { value: string; label: string }[];
  [key: string]: any;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, icon: Icon, error, options, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
      </div>
      <select
        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

interface FormFileUploadProps {
  label: string;
  accept?: string;
  error?: string;
  required?: boolean;
  fieldName?: string;
  validationErrors?: Set<string>;
  [key: string]: any;
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({ label, accept, error, required, fieldName, validationErrors, ...props }) => {
  const [fileName, setFileName] = useState<string>("");
  const hasValidationError = fieldName && validationErrors?.has(fieldName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
    
    // Call original onChange if it exists
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <input
          type="file"
          accept={accept}
          className="sr-only"
          id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          {...props}
          onChange={handleFileChange}
        />
        <label
          htmlFor={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`flex items-center w-full border rounded-xl cursor-pointer transition-all duration-200 ${
            error || hasValidationError
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-200 dark:ring-red-800' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`flex items-center justify-center h-12 w-12 rounded-l-xl transition-colors ${
            error || hasValidationError
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-primary-50 dark:bg-primary-900/20'
          }`}>
            <Upload className={`h-5 w-5 ${
              error || hasValidationError ? 'text-red-500' : 'text-primary-500'
            }`} />
          </div>
          <div className="px-4 py-3 truncate">
            {fileName ? (
              <span className="text-gray-900 dark:text-white text-sm">{fileName}</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">Choose a file...</span>
            )}
          </div>
        </label>
      </div>
      <AnimatePresence mode="wait">
        {(error || (hasValidationError && required)) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1 flex items-center"
          >
            <span className="mr-1">⚠️</span>
            {error || 'This field is required'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FormToggleProps {
  label: string;
  description?: string;
  error?: string;
  [key: string]: any;
}

const FormToggle: React.FC<FormToggleProps> = ({ label, description, error, ...props }) => {
  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>
          {description && <p className="text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FormRadioGroupProps {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  [key: string]: any;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ label, options, error, ...props }) => {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
        {label}
      </label>
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${props.name}-${option.value}`}
              type="radio"
              value={option.value}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              {...props}
            />
            <label
              htmlFor={`${props.name}-${option.value}`}
              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProjectsTabProps {
  projectFields: any[];
  appendProject: (project: any) => void;
  removeProject: (index: number) => void;
  register: any;
  errors: any;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ 
  projectFields, 
  appendProject, 
  removeProject, 
  register, 
  errors 
}) => {
  return (
    <div className="space-y-8">
      {/* Projects Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Projects
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Showcase your best work</span>
        </div>
        
        {/* Dynamic Project Fields */}
        <div className="space-y-4">
          {projectFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex justify-between mb-3">
                <h4 className="font-medium">Project #{index + 1}</h4>
                {index > 0 && (
                  <button 
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Project Title"
                  icon={Code}
                  placeholder="e.g. E-commerce Platform"
                  error={errors.projects?.[index]?.title?.message}
                  {...register(`projects.${index}.title`)}
                />
                
                <FormInput
                  label="Your Role"
                  icon={User}
                  placeholder="e.g. Lead Developer, Designer"
                  error={errors.projects?.[index]?.role?.message}
                  {...register(`projects.${index}.role`)}
                />
                
                <div className="col-span-1 md:col-span-2">
                  <FormTextArea
                    label="Project Description"
                    icon={MessageSquare}
                    placeholder="Describe the project's purpose, features and your specific contributions"
                    rows={3}
                    error={errors.projects?.[index]?.description?.message}
                    {...register(`projects.${index}.description`)}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <FormInput
                    label="Technologies Used"
                    icon={Code}
                    placeholder="e.g. React, Node.js, MongoDB, AWS"
                    error={errors.projects?.[index]?.technologies?.message}
                    {...register(`projects.${index}.technologies`)}
                  />
                </div>
                
                <FormInput
                  label="Project URL"
                  icon={LinkIcon}
                  type="url"
                  placeholder="e.g. https://github.com/yourusername/project"
                  error={errors.projects?.[index]?.projectUrl?.message}
                  {...register(`projects.${index}.projectUrl`)}
                />
                
                <div className="flex items-center h-full pt-7">
                  <FormToggle
                    label="This is an open-source project"
                    error={errors.projects?.[index]?.isOpenSource?.message}
                    {...register(`projects.${index}.isOpenSource`)}
                  />
                </div>
                
                <FormInput
                  label="Start Date"
                  icon={Calendar}
                  type="month"
                  error={errors.projects?.[index]?.startDate?.message}
                  {...register(`projects.${index}.startDate`)}
                />
                
                <FormInput
                  label="End Date"
                  icon={Calendar}
                  type="month"
                  error={errors.projects?.[index]?.endDate?.message}
                  {...register(`projects.${index}.endDate`)}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => appendProject({ 
              title: '', 
              description: '', 
              technologies: '', 
              projectUrl: '',
              role: '',
              startDate: '',
              endDate: '',
              isOpenSource: false
            })}
            className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            + Add Another Project
          </button>
        </div>
      </div>
    </div>
  );
};

interface AchievementsTabProps {
  achievementFields: any[];
  appendAchievement: (achievement: any) => void;
  removeAchievement: (index: number) => void;
  register: any;
  errors: any;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({
  achievementFields,
  appendAchievement,
  removeAchievement,
  register,
  errors
}) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Achievements & Certifications
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Add your certifications and awards</span>
        </div>
        
        <div className="space-y-4">
          {achievementFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex justify-between mb-3">
                <h4 className="font-medium">Achievement #{index + 1}</h4>
                <button 
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Title/Name"
                  icon={Award}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  error={errors.achievements?.[index]?.title?.message}
                  {...register(`achievements.${index}.title`)}
                />
                
                <FormInput
                  label="Issuing Organization"
                  icon={Building2}
                  placeholder="e.g. Amazon Web Services"
                  error={errors.achievements?.[index]?.issuer?.message}
                  {...register(`achievements.${index}.issuer`)}
                />
                
                <FormInput
                  label="Issue Date"
                  icon={Calendar}
                  type="month"
                  error={errors.achievements?.[index]?.date?.message}
                  {...register(`achievements.${index}.date`)}
                />
                
                <FormInput
                  label="Credential URL"
                  icon={LinkIcon}
                  type="url"
                  placeholder="e.g. https://credential.net/abc123"
                  error={errors.achievements?.[index]?.url?.message}
                  {...register(`achievements.${index}.url`)}
                />
                
                <div className="col-span-1 md:col-span-2">
                  <FormTextArea
                    label="Description"
                    icon={MessageSquare}
                    placeholder="Briefly describe this achievement, certification, or award"
                    rows={2}
                    error={errors.achievements?.[index]?.description?.message}
                    {...register(`achievements.${index}.description`)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => appendAchievement({ title: '', issuer: '', date: '', description: '', url: '' })}
            className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            + Add Achievement/Certification
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdditionalDetailsTabProps {
  register: any;
  errors: any;
  validationErrors: Set<string>;
}

const AdditionalDetailsTab: React.FC<AdditionalDetailsTabProps> = ({
  register,
  errors,
  validationErrors
}) => {
  return (
    <div className="space-y-8">
      {/* Job Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Job Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Preferred Location"
            icon={MapPin}
            placeholder="e.g. New York, Remote, Anywhere"
            error={errors.preferred_location?.message}
            required={true}
            fieldName="preferred_location"
            validationErrors={validationErrors}
            {...register("preferred_location")}
          />
          
          <FormInput
            label="Preferred Job Type"
            icon={Briefcase}
            placeholder="e.g. Full-time, Part-time, Contract"
            error={errors.preferred_job_type?.message}
            required={true}
            fieldName="preferred_job_type"
            validationErrors={validationErrors}
            {...register("preferred_job_type")}
          />
          
          <FormInput
            label="Expected Salary/Rate"
            icon={Briefcase}
            placeholder="e.g. $80,000 per year or $50 per hour"
            error={errors.expected_salary?.message}
            required={true}
            fieldName="expected_salary"
            validationErrors={validationErrors}
            {...register("expected_salary")}
          />
          
          <FormInput
            label="Notice Period"
            icon={Clock}
            placeholder="e.g. 2 weeks, 1 month"
            error={errors.notice_period?.message}
            validationErrors={validationErrors}
            {...register("notice_period")}
          />
          
          <FormInput
            label="Available From"
            icon={Calendar}
            type="date"
            error={errors.availability_date?.message}
            required={true}
            fieldName="availability_date"
            validationErrors={validationErrors}
            {...register("availability_date")}
          />
          
          <div className="flex items-center h-full pt-7">
            <FormToggle
              label="I am willing to relocate for work"
              error={errors.willing_to_relocate?.message}
              {...register("willing_to_relocate")}
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <FormRadioGroup
              label="Preferred Work Type"
              options={[
                { value: 'onsite', label: 'On-site' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' }
              ]}
              error={errors.preferred_work_type?.message}
              {...register("preferred_work_type")}
            />
          </div>
        </div>
      </div>
      
      {/* References and Additional Information */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Additional Information
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <FormTextArea
            label="Professional References"
            icon={User}
            placeholder="If you'd like to provide references, please include their name, position, relationship to you, email, and phone number"
            rows={3}
            error={errors.references?.message}
            {...register("references")}
          />
          
          <FormTextArea
            label="Additional Information"
            icon={MessageSquare}
            placeholder="Is there anything else you'd like us to know about you or your application?"
            rows={4}
            error={errors.additional_info?.message}
            {...register("additional_info")}
          />
          
          <FormTextArea
            label="Career Goals and Aspirations"
            icon={Briefcase}
            placeholder="Briefly describe your short-term and long-term career goals and what type of role you're seeking"
            rows={3}
            error={errors.message?.message}
            {...register("message")}
          />
        </div>
      </div>
    </div>
  );
};

interface WorkExperienceTabProps {
  workExpFields: any[];
  appendWorkExp: (workExp: any) => void;
  removeWorkExp: (index: number) => void;
  internshipFields: any[];
  appendInternship: (internship: any) => void;
  removeInternship: (index: number) => void;
  register: any;
  errors: any;
  getValues: any;
}

const WorkExperienceTab: React.FC<WorkExperienceTabProps> = ({
  workExpFields,
  appendWorkExp,
  removeWorkExp,
  internshipFields,
  appendInternship,
  removeInternship,
  register,
  errors,
  getValues
}) => {
  return (
    <div className="space-y-8">
      {/* Work Experience Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Professional Experience
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">List your work history</span>
        </div>
        
        {/* Dynamic Work Experience Fields */}
        <div className="space-y-4">
          {workExpFields.map((field, index) => {
            const isCurrent = getValues(`work_experience.${index}.current`);
            
            return (
              <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex justify-between mb-3">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  {index > 0 && (
                    <button 
                      type="button"
                      onClick={() => removeWorkExp(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Job Title"
                    icon={Briefcase}
                    placeholder="e.g. Senior Developer"
                    error={errors.work_experience?.[index]?.title?.message}
                    {...register(`work_experience.${index}.title`)}
                  />
                  
                  <FormInput
                    label="Company/Organization"
                    icon={Building2}
                    placeholder="e.g. Google"
                    error={errors.work_experience?.[index]?.company?.message}
                    {...register(`work_experience.${index}.company`)}
                  />
                  
                  <FormInput
                    label="Location"
                    icon={MapPin}
                    placeholder="e.g. Mountain View, CA or Remote"
                    {...register(`work_experience.${index}.location`)}
                  />
                  
                  <div className="flex items-center h-full pt-7">
                    <FormToggle
                      label="I currently work here"
                      {...register(`work_experience.${index}.current`)}
                    />
                  </div>
                  
                  <FormInput
                    label="Start Date"
                    icon={Calendar}
                    type="month"
                    error={errors.work_experience?.[index]?.startDate?.message}
                    {...register(`work_experience.${index}.startDate`)}
                  />
                  
                  {!isCurrent && (
                    <FormInput
                      label="End Date"
                      icon={Calendar}
                      type="month"
                      error={errors.work_experience?.[index]?.endDate?.message}
                      {...register(`work_experience.${index}.endDate`)}
                    />
                  )}
                  
                  <div className="col-span-1 md:col-span-2">
                    <FormInput
                      label="Technologies Used"
                      icon={Code}
                      placeholder="e.g. React, Node.js, AWS"
                      {...register(`work_experience.${index}.technologies`)}
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <FormTextArea
                      label="Job Description"
                      icon={MessageSquare}
                      placeholder="Describe your responsibilities and achievements in this role"
                      rows={3}
                      error={errors.work_experience?.[index]?.description?.message}
                      {...register(`work_experience.${index}.description`)}
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <FormTextArea
                      label="Key Achievements"
                      icon={Award}
                      placeholder="List your key achievements and contributions in this role"
                      rows={2}
                      {...register(`work_experience.${index}.achievements`)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          <button
            type="button"
            onClick={() => appendWorkExp({ 
              title: '', 
              company: '', 
              startDate: '', 
              endDate: '', 
              current: false, 
              description: '',
              location: '',
              technologies: '',
              achievements: ''
            })}
            className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            + Add Work Experience
          </button>
        </div>
      </div>
      
      {/* Internship Experience Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Internship Experience
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Add relevant internships</span>
        </div>
        
        {/* Dynamic Internship Fields */}
        <div className="space-y-4">
          {internshipFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex justify-between mb-3">
                <h4 className="font-medium">Internship #{index + 1}</h4>
                <button 
                  type="button"
                  onClick={() => removeInternship(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Internship Title"
                  icon={Briefcase}
                  placeholder="e.g. Web Development Intern"
                  error={errors.internships?.[index]?.title?.message}
                  {...register(`internships.${index}.title`)}
                />
                
                <FormInput
                  label="Company/Organization"
                  icon={Building2}
                  placeholder="e.g. Microsoft"
                  error={errors.internships?.[index]?.company?.message}
                  {...register(`internships.${index}.company`)}
                />
                
                <FormInput
                  label="Start Date"
                  icon={Calendar}
                  type="month"
                  error={errors.internships?.[index]?.startDate?.message}
                  {...register(`internships.${index}.startDate`)}
                />
                
                <FormInput
                  label="End Date"
                  icon={Calendar}
                  type="month"
                  error={errors.internships?.[index]?.endDate?.message}
                  {...register(`internships.${index}.endDate`)}
                />
                
                <div className="col-span-1 md:col-span-2">
                  <FormTextArea
                    label="Internship Description"
                    icon={MessageSquare}
                    placeholder="Describe your responsibilities and learning during this internship"
                    rows={3}
                    error={errors.internships?.[index]?.description?.message}
                    {...register(`internships.${index}.description`)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {internshipFields.length === 0 ? (
            <button
              type="button"
              onClick={() => appendInternship({ title: '', company: '', startDate: '', endDate: '', description: '' })}
              className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              + Add Internship Experience
            </button>
          ) : (
            <button
              type="button"
              onClick={() => appendInternship({ title: '', company: '', startDate: '', endDate: '', description: '' })}
              className="flex items-center justify-center w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              + Add Another Internship
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Define EducationTab component
const EducationTab = ({ register, errors, validationErrors }: { register: UseFormRegister<FormValues>, errors: FieldErrors<FormValues>, validationErrors: Set<string> }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Highest Education"
          icon={GraduationCap}
          type="text"
          placeholder="e.g. Bachelor's, Master's, PhD"
          error={errors.highest_education?.message}
          required={true}
          fieldName="highest_education"
          validationErrors={validationErrors}
          {...register("highest_education")}
        />
        
        <FormInput
          label="University/Institution"
          icon={Building}
          type="text"
          placeholder="e.g. Stanford University"
          error={errors.university?.message}
          required={true}
          fieldName="university"
          validationErrors={validationErrors}
          {...register("university")}
        />
        
        <FormInput
          label="Degree"
          icon={BookOpen}
          type="text"
          placeholder="e.g. Bachelor of Science"
          error={errors.degree?.message}
          required={true}
          fieldName="degree"
          validationErrors={validationErrors}
          {...register("degree")}
        />
        
        <FormInput
          label="Field of Study"
          icon={BookOpen}
          type="text"
          placeholder="e.g. Computer Science"
          error={errors.field_of_study?.message}
          validationErrors={validationErrors}
          {...register("field_of_study")}
        />
        
        <FormInput
          label="Graduation Year"
          icon={Calendar}
          type="text"
          placeholder="e.g. 2023"
          error={errors.graduation_year?.message}
          required={true}
          fieldName="graduation_year"
          validationErrors={validationErrors}
          {...register("graduation_year")}
        />
        
        <FormInput
          label="GPA/Grade"
          icon={Award}
          type="text"
          placeholder="e.g. 3.8/4.0 or First Class"
          error={errors.gpa?.message}
          validationErrors={validationErrors}
          {...register("gpa")}
        />

        <div className="col-span-1 md:col-span-2">
          <FormTextArea
            label="Technical Skills"
            icon={Code}
            placeholder="List your technical skills (e.g. Java, React, Python, AWS)"
            error={errors.skills?.message}
            {...register("skills")}
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <FormTextArea
            label="Languages Known"
            icon={MessageSquare}
            placeholder="Languages you can communicate in"
            error={errors.languages_known?.message}
            {...register("languages_known")}
          />
        </div>
      </div>
    </div>
  );
};

interface PlacementFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define tabs for the multi-step form
interface TabInfo {
  label: string;
  icon: React.ElementType;
}

const PlacementForm: React.FC<PlacementFormProps> = ({ isOpen, onClose }) => {
  // Define tabs for the form
  const tabs: TabInfo[] = [
    { label: "Personal Info", icon: User },
    { label: "Education", icon: GraduationCap },
    { label: "Experience", icon: Briefcase },
    { label: "Projects", icon: Code },
    { label: "Achievements", icon: Award },
    { label: "Additional Details", icon: FileText }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    control,
    getValues,
    watch
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues, any>,
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone_number: '',
      linkedin_profile: '',
      github_profile: '',
      portfolio_url: '',
      website: '',
      highest_education: '',
      university: '',
      degree: '',
      field_of_study: '',
      graduation_year: '',
      gpa: '',
      work_experience: [{ title: '', company: '', startDate: '', endDate: '', current: false, description: '', location: '', technologies: '', achievements: '' }],
      internships: [],
      projects: [{ title: '', description: '', technologies: '', githubUrl: '', demoUrl: '', startDate: '', endDate: '', current: false, role: '', highlights: '' }],
      skills: [],
      achievements: [{ title: '', issuer: '', date: '', description: '', url: '' }],
      certifications: [],
      preferred_location: '',
      preferred_job_type: '',
      preferred_work_type: 'onsite',
      expected_salary: '',
      notice_period: '',
      willing_to_relocate: false,
      references: [{ name: '', position: '', company: '', email: '', phone: '', relationship: '' }],
      additional_info: '',
      message: '',
      availability_date: '',
      languages_known: ''
    }
  });

  // Initialize useFieldArray for dynamic form fields
  const { fields: workExpFields, append: appendWorkExp, remove: removeWorkExp } = useFieldArray({
    control,
    name: "work_experience"
  });

  const { fields: internshipFields, append: appendInternship, remove: removeInternship } = useFieldArray({
    control,
    name: "internships"
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects"
  });

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: "achievements"
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: "certifications"
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control,
    name: "references"
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [validatedTabs, setValidatedTabs] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [showValidationShake, setShowValidationShake] = useState(false);
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Form submission logic
      const res = await postQuery({
        url: PLACEMENT_FORM_ENDPOINT,
        postData: data,
        showToast: true,
        successMessage: "Form submitted successfully!"
      });
      
      if (res.data) {
        onClose();
        reset();
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Validate specific tab fields
  const validateTabFields = async (tabIndex: number): Promise<boolean> => {
    const currentValues = getValues();
    const tabValidationFields: { [key: number]: string[] } = {
      0: ['firstname', 'lastname', 'email', 'phone_number', 'resumeFile'], // Personal Info
      1: ['highest_education', 'university', 'degree', 'graduation_year'], // Education
      2: [], // Experience (optional)
      3: [], // Projects (optional)
      4: [], // Achievements (optional)
      5: ['preferred_location', 'preferred_job_type', 'expected_salary', 'availability_date'] // Additional Details
    };

    const fieldsToValidate = tabValidationFields[tabIndex] || [];
    const tabErrors: string[] = [];

    // Validate required fields for the current tab
    for (const field of fieldsToValidate) {
      const value = currentValues[field as keyof FormValues];
      
      if (field === 'resumeFile') {
        // Special handling for file upload
        if (!value || (value as FileList).length === 0) {
          tabErrors.push('Resume/CV is required');
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        // Get field label for better error message
        const fieldLabels: { [key: string]: string } = {
          firstname: 'First Name',
          lastname: 'Last Name',
          email: 'Email',
          phone_number: 'Phone Number',
          highest_education: 'Highest Education',
          university: 'University/Institution',
          degree: 'Degree',
          graduation_year: 'Graduation Year',
          preferred_location: 'Preferred Location',
          preferred_job_type: 'Preferred Job Type',
          expected_salary: 'Expected Salary',
          availability_date: 'Availability Date'
        };
        tabErrors.push(`${fieldLabels[field] || field} is required`);
      }
    }

    // Update validation errors state for visual feedback
    const errorFields = new Set<string>();
    for (const field of fieldsToValidate) {
      const value = currentValues[field as keyof FormValues];
      
      if (field === 'resumeFile') {
        if (!value || (value as FileList).length === 0) {
          errorFields.add(field);
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        errorFields.add(field);
      }
    }
    
    setValidationErrors(errorFields);
    
    // Trigger shake animation if validation fails
    if (errorFields.size > 0) {
      setShowValidationShake(true);
      setTimeout(() => setShowValidationShake(false), 600);
    }
    
    return errorFields.size === 0;
  };

  const nextTab = async () => {
    if (activeTab < tabs.length - 1) {
      const isValid = await validateTabFields(activeTab);
      if (isValid) {
        setValidatedTabs(prev => new Set([...prev, activeTab]));
        setActiveTab(activeTab + 1);
      }
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  // Allow direct tab navigation only to completed or previous tabs
  const handleTabClick = async (tabIndex: number) => {
    if (tabIndex === activeTab) return; // Already on this tab
    
    if (tabIndex < activeTab) {
      // Allow going back to previous tabs
      setActiveTab(tabIndex);
    } else if (tabIndex === activeTab + 1) {
      // Allow going to next tab only if current tab is validated
      const isValid = await validateTabFields(activeTab);
      if (isValid) {
        setValidatedTabs(prev => new Set([...prev, activeTab]));
        setActiveTab(tabIndex);
      }
    } else {
      // Don't allow skipping tabs - no action taken
      return;
    }
  };

  // User data pre-filling disabled to avoid authentication issues
  // Form works perfectly with empty defaults
  useEffect(() => {
    console.log("Placement form opened - using empty form defaults");
    // Form will start with the defaultValues defined in useForm
    // No API calls needed - form is fully functional without pre-filled data
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full bg-white dark:bg-gray-800 overflow-hidden flex flex-col pt-16 lg:pt-20"
        style={{ minHeight: '100vh' }}
      >
        {/* Form Header with gradient background */}
        <div className="bg-gradient-to-r from-primary-600/90 to-primary-500/90 p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Placement Application Form</h2>
            <p className="text-white/80 text-sm mt-1">Complete all sections to apply for placement opportunities</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Form Progress Bar */}
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-700">
          <div 
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Tab Navigation */}
        <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto sticky top-0 z-10 shadow-sm">
          <div className={`flex items-center min-w-max p-2 transition-transform duration-200 ${
            showValidationShake ? 'animate-pulse' : ''
          }`}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTabClick(index)}
                disabled={index > activeTab + 1 && !validatedTabs.has(index - 1)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium mr-2 transition-all duration-200 relative ${
                  activeTab === index
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                    : validatedTabs.has(index) || index <= activeTab
                      ? 'text-primary-600 hover:bg-primary-50/50 dark:text-primary-400 dark:hover:bg-primary-900/10 cursor-pointer'
                      : index === activeTab + 1
                        ? 'text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/30 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed opacity-60 dark:text-gray-600'
                }`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 
                  ${activeTab === index 
                    ? 'bg-primary-500 text-white' 
                    : validatedTabs.has(index)
                      ? 'bg-green-500 text-white'
                      : index < activeTab
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                  {validatedTabs.has(index) ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span>{tab.label}</span>
                {activeTab === index && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-6 md:p-8"
          >
            {/* Tab 1: Personal Info */}
            {activeTab === 0 && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                      <User className="h-5 w-5 text-primary-500 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Basic Information
                    </h3>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="First Name"
                        icon={User}
                        type="text"
                        placeholder="Enter your first name"
                        error={errors.firstname?.message}
                        required={true}
                        fieldName="firstname"
                        validationErrors={validationErrors}
                        {...register("firstname")}
                      />
                      <FormInput
                        label="Last Name"
                        icon={User}
                        type="text"
                        placeholder="Enter your last name"
                        error={errors.lastname?.message}
                        required={true}
                        fieldName="lastname"
                        validationErrors={validationErrors}
                        {...register("lastname")}
                      />
                      <FormInput
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="your.email@example.com"
                        error={errors.email?.message}
                        required={true}
                        fieldName="email"
                        validationErrors={validationErrors}
                        {...register("email")}
                      />
                      <FormInput
                        label="Phone Number"
                        icon={Phone}
                        type="tel"
                        placeholder="10-digit phone number"
                        error={errors.phone_number?.message}
                        required={true}
                        fieldName="phone_number"
                        validationErrors={validationErrors}
                        {...register("phone_number")}
                      />
                      <FormFileUpload
                        label="Resume/CV"
                        accept=".pdf,.doc,.docx"
                        error={errors.resumeFile?.message}
                        required={true}
                        fieldName="resumeFile"
                        validationErrors={validationErrors}
                        {...register("resumeFile")}
                      />
                      <div className="col-span-1 md:col-span-2">
                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">Online Presence</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="LinkedIn Profile"
                            icon={LinkIcon}
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            error={errors.linkedin_profile?.message}
                            validationErrors={validationErrors}
                            {...register("linkedin_profile")}
                          />
                          <FormInput
                            label="GitHub Profile"
                            icon={Code}
                            type="url"
                            placeholder="https://github.com/yourusername"
                            error={errors.github_profile?.message}
                            validationErrors={validationErrors}
                            {...register("github_profile")}
                          />
                          <FormInput
                            label="Portfolio Website"
                            icon={LinkIcon}
                            type="url"
                            placeholder="https://yourportfolio.com"
                            error={errors.portfolio_url?.message}
                            validationErrors={validationErrors}
                            {...register("portfolio_url")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab 2: Education & Skills */}
            {activeTab === 1 && (
              <EducationTab register={register} errors={errors} validationErrors={validationErrors} />
            )}
            
            {/* Tab 3: Experience */}
            {activeTab === 2 && (
              <WorkExperienceTab
                workExpFields={workExpFields}
                appendWorkExp={appendWorkExp}
                removeWorkExp={removeWorkExp}
                internshipFields={internshipFields}
                appendInternship={appendInternship}
                removeInternship={removeInternship}
                register={register}
                errors={errors}
                getValues={getValues}
              />
            )}

            {/* Tab 4: Projects */}
            {activeTab === 3 && (
              <ProjectsTab
                projectFields={projectFields}
                appendProject={appendProject}
                removeProject={removeProject}
                register={register}
                errors={errors}
              />
            )}

            {/* Tab 5: Achievements */}
            {activeTab === 4 && (
              <AchievementsTab
                achievementFields={achievementFields}
                appendAchievement={appendAchievement}
                removeAchievement={removeAchievement}
                register={register}
                errors={errors}
              />
            )}

            {/* Tab 6: Additional Details */}
            {activeTab === 5 && (
              <AdditionalDetailsTab
                register={register}
                errors={errors}
                validationErrors={validationErrors}
              />
            )}
          </motion.div>
          
          {/* Navigation Buttons - Fixed at bottom */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 z-10 shadow-lg">
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                activeTab === 0 ? onClose() : prevTab();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
                ${activeTab === 0 
                  ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'} 
                transition-all duration-200`}
            >
              {activeTab === 0 ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </>
              )}
            </motion.button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Step {activeTab + 1} of {tabs.length}
            </div>
            
            {activeTab < tabs.length - 1 ? (
              <motion.button
                type="button"
                onClick={nextTab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 transition-all duration-200 relative group"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
                {/* Validation hint tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Complete required fields to continue
                </div>
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={loading || !isDirty}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200
                  ${loading || !isDirty 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                    : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PlacementForm;