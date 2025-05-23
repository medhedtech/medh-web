"use client";

import { useState } from "react";

export type BaseCourseFormData = {
  course_category: string;
  course_subcategory: string;
  course_title: string;
  course_subtitle: string;
  course_tag: string;
  course_description: {
    program_overview: string;
    benefits: string;
    learning_objectives: string[];
    course_requirements: string[];
    target_audience: string[];
  };
  course_level: string;
  language: string;
  course_image: string;
  brochures: string[];
  status: string;
  course_type: string;
  tools_technologies: {
    name: string;
    category: string;
    description: string;
    logo_url: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  show_in_home: boolean;
};

type BaseCourseFormProps = {
  initialData?: Partial<BaseCourseFormData>;
  onDataChange: (data: Partial<BaseCourseFormData>) => void;
};

export default function BaseCourseForm({ 
  initialData = {}, 
  onDataChange 
}: BaseCourseFormProps) {
  const [formData, setFormData] = useState<Partial<BaseCourseFormData>>({
    course_category: "",
    course_subcategory: "",
    course_title: "",
    course_subtitle: "",
    course_tag: "",
    course_description: {
      program_overview: "",
      benefits: "",
      learning_objectives: [""],
      course_requirements: [""],
      target_audience: [""],
    },
    course_level: "Beginner",
    language: "English",
    course_image: "",
    brochures: [""],
    status: "Draft",
    tools_technologies: [
      {
        name: "",
        category: "programming_language",
        description: "",
        logo_url: "",
      },
    ],
    faqs: [
      {
        question: "",
        answer: "",
      },
    ],
    show_in_home: false,
    ...initialData,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields with dot notation (e.g., "course_description.program_overview")
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BaseCourseFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    onDataChange(formData);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    onDataChange(formData);
  };

  const handleArrayItemChange = (
    parentKey: keyof BaseCourseFormData,
    index: number,
    value: string
  ) => {
    const updatedArray = [...(formData[parentKey] as string[])];
    updatedArray[index] = value;
    
    setFormData((prev) => ({
      ...prev,
      [parentKey]: updatedArray,
    }));
    
    onDataChange(formData);
  };

  const addArrayItem = (parentKey: keyof BaseCourseFormData) => {
    const updatedArray = [...(formData[parentKey] as string[]), ""];
    
    setFormData((prev) => ({
      ...prev,
      [parentKey]: updatedArray,
    }));
    
    onDataChange(formData);
  };

  const removeArrayItem = (parentKey: keyof BaseCourseFormData, index: number) => {
    const updatedArray = [...(formData[parentKey] as string[])];
    updatedArray.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      [parentKey]: updatedArray,
    }));
    
    onDataChange(formData);
  };

  const handleObjectArrayChange = (
    parentKey: keyof BaseCourseFormData,
    index: number,
    field: string,
    value: string
  ) => {
    const array = [...(formData[parentKey] as any[])];
    array[index] = { ...array[index], [field]: value };
    
    setFormData((prev) => ({
      ...prev,
      [parentKey]: array,
    }));
    
    onDataChange(formData);
  };

  const addObjectToArray = (parentKey: keyof BaseCourseFormData, template: any) => {
    const updatedArray = [...(formData[parentKey] as any[]), template];
    
    setFormData((prev) => ({
      ...prev,
      [parentKey]: updatedArray,
    }));
    
    onDataChange(formData);
  };

  const removeObjectFromArray = (parentKey: keyof BaseCourseFormData, index: number) => {
    const updatedArray = [...(formData[parentKey] as any[])];
    updatedArray.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      [parentKey]: updatedArray,
    }));
    
    onDataChange(formData);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-indigo-100 pb-4">
        <h2 className="text-xl font-semibold text-indigo-800">Basic Course Information</h2>
      </div>
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="course_title" className="block mb-2 font-medium text-gray-700">
            Course Title*
          </label>
          <input
            type="text"
            id="course_title"
            name="course_title"
            value={formData.course_title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label htmlFor="course_subtitle" className="block mb-2 font-medium text-gray-700">
            Course Subtitle
          </label>
          <input
            type="text"
            id="course_subtitle"
            name="course_subtitle"
            value={formData.course_subtitle}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="course_category" className="block mb-2 font-medium text-gray-700">
            Course Category*
          </label>
          <input
            type="text"
            id="course_category"
            name="course_category"
            value={formData.course_category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label htmlFor="course_subcategory" className="block mb-2 font-medium text-gray-700">
            Course Subcategory
          </label>
          <input
            type="text"
            id="course_subcategory"
            name="course_subcategory"
            value={formData.course_subcategory}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="course_tag" className="block mb-2 font-medium text-gray-700">
          Course Tag
        </label>
        <input
          type="text"
          id="course_tag"
          name="course_tag"
          value={formData.course_tag}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>
      
      {/* Course Description */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-indigo-100 pb-4">
          <h3 className="text-lg font-medium text-indigo-800">Course Description</h3>
        </div>
        
        <div>
          <label htmlFor="program_overview" className="block mb-2 font-medium text-gray-700">
            Program Overview*
          </label>
          <textarea
            id="program_overview"
            name="course_description.program_overview"
            value={formData.course_description?.program_overview}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-28"
            required
          />
        </div>
        
        <div>
          <label htmlFor="benefits" className="block mb-2 font-medium text-gray-700">
            Benefits*
          </label>
          <textarea
            id="benefits"
            name="course_description.benefits"
            value={formData.course_description?.benefits}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-28"
            required
          />
        </div>
        
        {/* Learning Objectives */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <label className="font-medium text-gray-700">Learning Objectives</label>
            <button
              type="button"
              onClick={() => addArrayItem("course_description.learning_objectives" as any)}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Objective
            </button>
          </div>
          
          {formData.course_description?.learning_objectives?.map((objective, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => 
                  handleArrayItemChange(
                    "course_description.learning_objectives" as any,
                    index,
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => 
                  removeArrayItem(
                    "course_description.learning_objectives" as any,
                    index
                  )
                }
                className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                disabled={formData.course_description?.learning_objectives?.length === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {/* Course Requirements */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <label className="font-medium text-gray-700">Course Requirements</label>
            <button
              type="button"
              onClick={() => addArrayItem("course_description.course_requirements" as any)}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Requirement
            </button>
          </div>
          
          {formData.course_description?.course_requirements?.map((requirement, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => 
                  handleArrayItemChange(
                    "course_description.course_requirements" as any,
                    index,
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => 
                  removeArrayItem(
                    "course_description.course_requirements" as any,
                    index
                  )
                }
                className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                disabled={formData.course_description?.course_requirements?.length === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {/* Target Audience */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <label className="font-medium text-gray-700">Target Audience</label>
            <button
              type="button"
              onClick={() => addArrayItem("course_description.target_audience" as any)}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Target Audience
            </button>
          </div>
          
          {formData.course_description?.target_audience?.map((audience, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={audience}
                onChange={(e) => 
                  handleArrayItemChange(
                    "course_description.target_audience" as any,
                    index,
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => 
                  removeArrayItem(
                    "course_description.target_audience" as any,
                    index
                  )
                }
                className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                disabled={formData.course_description?.target_audience?.length === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Course Settings */}
      <div className="border-b border-indigo-100 pb-4">
        <h3 className="text-lg font-medium text-indigo-800">Course Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="course_level" className="block mb-2 font-medium text-gray-700">
            Course Level
          </label>
          <select
            id="course_level"
            name="course_level"
            value={formData.course_level}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="language" className="block mb-2 font-medium text-gray-700">
            Language
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="course_image" className="block mb-2 font-medium text-gray-700">
            Course Image URL*
          </label>
          <input
            type="text"
            id="course_image"
            name="course_image"
            value={formData.course_image}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show_in_home"
            name="show_in_home"
            checked={formData.show_in_home}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <label htmlFor="show_in_home" className="ml-2 font-medium text-gray-700">
            Show on Homepage
          </label>
        </div>
      </div>
      
      {/* Tools & Technologies */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-indigo-100 pb-4">
          <h3 className="text-lg font-medium text-indigo-800">Tools & Technologies</h3>
          <button
            type="button"
            onClick={() => 
              addObjectToArray("tools_technologies", {
                name: "",
                category: "programming_language",
                description: "",
                logo_url: "",
              })
            }
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Tool/Technology
          </button>
        </div>
        
        {formData.tools_technologies?.map((tech, index) => (
          <div key={index} className="bg-white p-5 mb-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Name*</label>
                <input
                  type="text"
                  value={tech.name}
                  onChange={(e) => 
                    handleObjectArrayChange(
                      "tools_technologies",
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">Category</label>
                <select
                  value={tech.category}
                  onChange={(e) => 
                    handleObjectArrayChange(
                      "tools_technologies",
                      index,
                      "category",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                >
                  <option value="programming_language">Programming Language</option>
                  <option value="framework">Framework</option>
                  <option value="library">Library</option>
                  <option value="tool">Tool</option>
                  <option value="platform">Platform</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={tech.description}
                  onChange={(e) => 
                    handleObjectArrayChange(
                      "tools_technologies",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">Logo URL</label>
                <input
                  type="text"
                  value={tech.logo_url}
                  onChange={(e) => 
                    handleObjectArrayChange(
                      "tools_technologies",
                      index,
                      "logo_url",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => removeObjectFromArray("tools_technologies", index)}
              className="mt-4 text-red-500 text-sm font-medium hover:text-red-700 flex items-center"
              disabled={formData.tools_technologies?.length === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove Tool/Technology
            </button>
          </div>
        ))}
      </div>
      
      {/* FAQs */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-indigo-100 pb-4">
          <h3 className="text-lg font-medium text-indigo-800">FAQs</h3>
          <button
            type="button"
            onClick={() => 
              addObjectToArray("faqs", {
                question: "",
                answer: "",
              })
            }
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add FAQ
          </button>
        </div>
        
        {formData.faqs?.map((faq, index) => (
          <div key={index} className="bg-white p-5 mb-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Question*</label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => 
                  handleObjectArrayChange(
                    "faqs",
                    index,
                    "question",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Answer*</label>
              <textarea
                value={faq.answer}
                onChange={(e) => 
                  handleObjectArrayChange(
                    "faqs",
                    index,
                    "answer",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-28"
                required
              />
            </div>
            
            <button
              type="button"
              onClick={() => removeObjectFromArray("faqs", index)}
              className="mt-4 text-red-500 text-sm font-medium hover:text-red-700 flex items-center"
              disabled={formData.faqs?.length === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove FAQ
            </button>
          </div>
        ))}
      </div>
      
      {/* Brochures */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <label className="font-medium text-indigo-800 text-lg">Brochures (PDF URLs)</label>
          <button
            type="button"
            onClick={() => addArrayItem("brochures")}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Brochure
          </button>
        </div>
        
        {formData.brochures?.map((brochure, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={brochure}
              onChange={(e) => 
                handleArrayItemChange(
                  "brochures",
                  index,
                  e.target.value
                )
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="PDF URL"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("brochures", index)}
              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
              disabled={formData.brochures?.length === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 