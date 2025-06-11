"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckSquare, Square, Zap, Target, DollarSign, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

interface IThreeSectionCategoryFilterProps {
  selectedCategory: string[];
  setSelectedCategory: (categories: string[]) => void;
  selectedGrade?: string[];
  setSelectedGrade?: (grades: string[]) => void;
  onSectionChange?: (section: 'live' | 'blended' | 'free' | 'grade') => void;
}

interface ICategorySection {
  id: 'live' | 'blended' | 'free' | 'grade';
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  categories: string[];
  description: string;
}

const ThreeSectionCategoryFilter: React.FC<IThreeSectionCategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedGrade = [],
  setSelectedGrade = () => {},
  onSectionChange
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [animatingSection, setAnimatingSection] = useState<string | null>(null);

  // Define the four sections with their respective categories
  const categorySections: ICategorySection[] = [
    {
      id: 'live',
      title: 'Live Courses',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Interactive live sessions with instructors',
      categories: [
        "AI and Data Science",
        "Personality Development", 
        "Vedic Mathematics",
        "Digital Marketing with Data Analytics"
      ]
    },
    {
      id: 'blended',
      title: 'Blended Learning',
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Combination of live and self-paced learning',
      categories: [
        "AI For Professionals",
        "Business And Management",
        "Career Development",
        "Communication And Soft Skills",
        "Data & Analytics",
        "Environmental and Sustainability Skills",
        "Finance & Accounts",
        "Health & Wellness",
        "Industry-Specific Skills",
        "Language & Linguistic",
        "Legal & Compliance Skills",
        "Personal Well-Being",
        "Sales & Marketing",
        "Technical Skills"
      ]
    },
    {
      id: 'free',
      title: 'Free Courses',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Free courses to get you started',
      categories: [
        "Introduction to Programming",
        "Basic Digital Literacy",
        "Communication Fundamentals",
        "Career Guidance",
        "Personal Development Basics"
      ]
    },
    {
      id: 'grade',
      title: 'Grade Level',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Filter by educational grade level',
      categories: [
        "Preschool",
        "Grade 1-2",
        "Grade 3-4",
        "Grade 5-6",
        "Grade 7-8",
        "Grade 9-10",
        "Grade 11-12",
        "UG/Grad/Pro"
      ]
    }
  ];

  const handleCategoryChange = useCallback((category: string) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((c) => c !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  }, [selectedCategory, setSelectedCategory]);

  const handleGradeChange = useCallback((grade: string) => {
    if (selectedGrade.includes(grade)) {
      setSelectedGrade(selectedGrade.filter((g) => g !== grade));
    } else {
      setSelectedGrade([...selectedGrade, grade]);
    }
  }, [selectedGrade, setSelectedGrade]);

  const isChecked = useCallback((category: string, sectionId: string) => {
    if (sectionId === 'grade') {
      return selectedGrade.includes(category);
    }
    return selectedCategory.includes(category);
  }, [selectedCategory, selectedGrade]);

  const toggleSection = useCallback((sectionId: string) => {
    setAnimatingSection(sectionId);
    
    const newExpanded = new Set<string>();
    
    // If the clicked section is already expanded, close it (empty set)
    // If it's not expanded, open only this section
    if (!expandedSections.has(sectionId)) {
      newExpanded.add(sectionId);
    }
    
    setExpandedSections(newExpanded);
    
    // Clear animation state after animation completes
    setTimeout(() => {
      setAnimatingSection(null);
    }, 300);
  }, [expandedSections]);

  const handleSectionClick = useCallback((section: ICategorySection) => {
    if (onSectionChange) {
      onSectionChange(section.id);
    }
  }, [onSectionChange]);

  const getCategoryId = useCallback((category: string, sectionId: string) => {
    return `${sectionId}-${category.replace(/\s+/g, '-').toLowerCase()}`;
  }, []);

  const handleItemChange = useCallback((category: string, sectionId: string) => {
    if (sectionId === 'grade') {
      handleGradeChange(category);
    } else {
      handleCategoryChange(category);
    }
  }, [handleCategoryChange, handleGradeChange]);

  return (
    <>
      {/* Enhanced CSS for smooth animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInStagger {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes iconRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(180deg);
          }
        }

        @keyframes iconRotateBack {
          from {
            transform: rotate(180deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .section-content-enter {
          animation: slideDown 0.3s ease-out forwards;
        }

        .section-content-exit {
          animation: slideUp 0.3s ease-out forwards;
        }

        .category-item {
          animation: fadeInStagger 0.2s ease-out forwards;
        }

        .icon-expand {
          animation: iconRotate 0.3s ease-out forwards;
        }

        .icon-collapse {
          animation: iconRotateBack 0.3s ease-out forwards;
        }

        .section-header-active {
          animation: pulse 0.3s ease-out;
        }

        .category-item:nth-child(1) { animation-delay: 0ms; }
        .category-item:nth-child(2) { animation-delay: 50ms; }
        .category-item:nth-child(3) { animation-delay: 100ms; }
        .category-item:nth-child(4) { animation-delay: 150ms; }
        .category-item:nth-child(5) { animation-delay: 200ms; }
        .category-item:nth-child(6) { animation-delay: 250ms; }
        .category-item:nth-child(7) { animation-delay: 300ms; }
        .category-item:nth-child(8) { animation-delay: 350ms; }
        .category-item:nth-child(9) { animation-delay: 400ms; }
        .category-item:nth-child(10) { animation-delay: 450ms; }
        .category-item:nth-child(n+11) { animation-delay: 500ms; }
      `}</style>

      <div className="w-full space-y-4">
        {categorySections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isAnimating = animatingSection === section.id;
          const sectionSelectedCount = section.id === 'grade' 
            ? section.categories.filter(cat => selectedGrade.includes(cat)).length
            : section.categories.filter(cat => selectedCategory.includes(cat)).length;
          
          return (
            <div 
              key={section.id} 
              className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-lg ${section.bgColor} ${
                isExpanded ? 'ring-2 ring-opacity-50' : ''
              } ${
                section.id === 'live' ? 'hover:ring-red-200 dark:hover:ring-red-800' :
                section.id === 'blended' ? 'hover:ring-blue-200 dark:hover:ring-blue-800' :
                section.id === 'free' ? 'hover:ring-green-200 dark:hover:ring-green-800' :
                'hover:ring-purple-200 dark:hover:ring-purple-800'
              }`}
            >
              {/* Enhanced Section Header */}
              <div 
                className={`p-4 cursor-pointer transition-all duration-300 ease-out hover:bg-opacity-80 ${
                  isAnimating ? 'section-header-active' : ''
                } ${
                  isExpanded ? 'bg-white dark:bg-gray-800 bg-opacity-50' : ''
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${section.color} transition-all duration-300 ease-out transform hover:scale-110`}>
                      {section.icon}
                    </div>
                    <div>
                      <h4 className={`font-semibold transition-all duration-300 ${section.color} ${
                        isExpanded ? 'text-lg' : 'text-base'
                      }`}>
                        {section.title}
                      </h4>
                      <p className={`text-xs text-gray-600 dark:text-gray-400 mt-1 transition-all duration-300 ${
                        isExpanded ? 'opacity-100' : 'opacity-70'
                      }`}>
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {sectionSelectedCount > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-800 ${section.color} font-medium transition-all duration-300 transform hover:scale-105 shadow-sm`}>
                        {sectionSelectedCount} selected
                      </span>
                    )}
                    <div className={`transition-all duration-300 ease-out ${
                      isExpanded ? 'icon-expand' : 'icon-collapse'
                    }`}>
                      {isExpanded ? (
                        <ChevronUp className={`w-4 h-4 ${section.color}`} />
                      ) : (
                        <ChevronDown className={`w-4 h-4 ${section.color}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Section Content with smooth animations */}
              <div className={`overflow-hidden transition-all duration-300 ease-out ${
                isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 section-content-enter">
                    <div className="pt-4 space-y-3">
                      {section.categories.map((category, index) => (
                        <div key={category} className="group category-item opacity-0">
                          <label 
                            className="flex items-start cursor-pointer group select-none transition-all duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg -m-2"
                            htmlFor={getCategoryId(category, section.id)}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {isChecked(category, section.id) ? (
                                <CheckSquare 
                                  size={18} 
                                  className={`${section.color} transition-all duration-200 ease-out transform group-hover:scale-110 drop-shadow-sm`}
                                />
                              ) : (
                                <Square 
                                  size={18} 
                                  className="text-gray-400 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-all duration-200 ease-out group-hover:scale-110"
                                />
                              )}
                              <input
                                type="checkbox"
                                id={getCategoryId(category, section.id)}
                                className="sr-only"
                                checked={isChecked(category, section.id)}
                                onChange={() => handleItemChange(category, section.id)}
                                aria-label={`Filter by ${category}`}
                              />
                            </div>
                            <span className={`ml-3 text-sm transition-all duration-200 ease-out group-hover:${section.color} group-hover:translate-x-1 line-clamp-2 font-medium text-gray-700 dark:text-gray-300`}>
                              {category}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ThreeSectionCategoryFilter; 