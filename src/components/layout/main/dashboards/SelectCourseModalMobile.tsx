// Mobile-optimized SelectCourseModal for small screens.
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X, Search, CheckCircle, Star, Loader2, BookOpen } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import usePostQuery from "@/hooks/postQuery.hook";
import Image from "next/image";
import { showToast } from "@/utils/toastManager";
import { createPortal } from "react-dom";

// Types reused from main modal
interface SelectCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: string;
  amount: string;
  selectedPlan: string;
  closeParent: () => void;
}

interface Category {
  _id: string;
  category_name: string;
  category_image?: string;
  courseCount?: number;
  courses?: any[];
}

const SelectCourseModalMobile: React.FC<SelectCourseModalProps> = ({
  isOpen,
  onClose,
  planType,
  amount,
  selectedPlan,
  closeParent,
}) => {
  const studentId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Normalize planType to lowercase for robust logic
  const normalizedPlanType = (planType || "").toLowerCase();
  const maxSelections = normalizedPlanType === "silver" ? 1 : normalizedPlanType === "gold" ? 3 : 1;

  // Fetch categories/courses on open
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(apiUrls?.categories?.getAllCategories).then(res => res.json()),
      fetch(getAllCoursesWithLimits({ page: 1, limit: 200, status: "Published", class_type: "Blended Courses" })).then(res => res.json())
    ]).then(([catRes, courseRes]) => {
      setCategories(catRes?.data || []);
      setCourses(courseRes?.data?.courses || []);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load data");
      setLoading(false);
    });
  }, [isOpen]);

  // Enhance categories with course counts
  const enhancedCategories = useMemo(() => {
    return categories.map(category => {
      const categoryName = category.category_name;
      const categoryBlendedCourses = courses.filter(course => {
        const courseCategory = course.course_category || course.category || '';
        const classType = course.class_type || '';
        return courseCategory.toLowerCase() === categoryName.toLowerCase() && classType.toLowerCase().includes('blended');
      });
      return {
        ...category,
        courseCount: categoryBlendedCourses.length,
        courses: categoryBlendedCourses
      };
    }).filter(category => category.courseCount > 0);
  }, [categories, courses]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return enhancedCategories;
    const query = searchQuery.toLowerCase();
    return enhancedCategories.filter(category => category.category_name.toLowerCase().includes(query));
  }, [enhancedCategories, searchQuery]);

  const toggleCategorySelection = (category: Category) => {
    setSelectedCategories(prev => {
      const isAlreadySelected = prev.some((c) => c._id === category._id);
      if (isAlreadySelected) {
        return prev.filter((c) => c._id !== category._id);
      }
      // Silver: only 1, Gold: up to 3
      if (normalizedPlanType === "silver") {
        return [category];
      } else if (normalizedPlanType === "gold") {
        if (prev.length < maxSelections) {
          return [...prev, category];
        }
        return prev;
      } else {
        // Default fallback: only 1
        return [category];
      }
    });
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 rounded-t-3xl px-4 pt-6 pb-3 flex items-center justify-between shadow-lg">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Choose Categories</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {/* Sticky Search Bar */}
      <div className="sticky top-[56px] z-10 bg-white dark:bg-gray-900 px-4 py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:outline-none text-base text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
            aria-label="Search categories"
          />
        </div>
      </div>
      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
            <span className="text-lg text-gray-600 dark:text-gray-300">Loading categories...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="w-10 h-10 text-gray-400 mb-4" />
            <span className="text-lg text-gray-600 dark:text-gray-300">{error}</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="w-10 h-10 text-gray-400 mb-4" />
            <span className="text-lg text-gray-600 dark:text-gray-300">No categories found.</span>
          </div>
        ) : (
          filteredCategories.map(category => {
            const isSelected = selectedCategories.some(c => c._id === category._id);
            const disabled = !isSelected && selectedCategories.length >= maxSelections;
            return (
              <button
                key={category._id}
                onClick={() => toggleCategorySelection(category)}
                disabled={disabled}
                className={`w-full flex items-center gap-4 p-5 mb-4 rounded-2xl shadow-md transition-all duration-300 border-2 bg-white/90 dark:bg-gray-800/90 hover:scale-[1.02] active:bg-primary-50 dark:active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 group min-h-[96px] min-w-0`
                  + (isSelected
                    ? ' border-primary-500 ring-2 ring-primary-400'
                    : disabled
                    ? ' border-gray-200 dark:border-gray-700 opacity-40 grayscale cursor-not-allowed'
                    : ' border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600')}
                aria-pressed={isSelected}
                aria-label={`Select category ${category.category_name}`}
              >
                {/* Blended Badge */}
                <span className="absolute left-4 top-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black dark:text-white text-xs font-semibold px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <Star className="w-3 h-3 mr-1" /> Blended
                </span>
                {/* Category Image */}
                <div className="w-18 h-18 min-w-[72px] min-h-[72px] rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-amber-50 dark:from-primary-900/40 dark:via-primary-800/30 dark:to-amber-900/20 flex items-center justify-center">
                  <Image
                    src={category.category_image || '/fallback-category-image.jpg'}
                    alt={category.category_name}
                    width={72}
                    height={72}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{category.category_name}</h3>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{category.courseCount} Courses</span>
                </div>
                {/* Checkmark overlay */}
                {isSelected && (
                  <span className="bg-primary-500 text-white rounded-full p-2 shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 min-h-[56px]">
        {/* Summary Section */}
        <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 items-center min-w-0">
            {selectedCategories.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium border border-primary-200 dark:border-primary-800 max-w-[120px] truncate">
                {selectedCategories.map((category, idx) => (
                  <span key={category._id} className="truncate">
                    {category.category_name}{idx < selectedCategories.length - 1 ? ',' : ''}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[120px]">No categories selected</span>
            )}
          </div>
          {/* Plan and Amount */}
          <div className="flex items-center gap-2 ml-0 sm:ml-4 mt-1 sm:mt-0 text-xs text-gray-700 dark:text-gray-200 whitespace-nowrap">
            <span className="font-semibold capitalize">{normalizedPlanType} Plan</span>
            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full inline-block mx-1"></span>
            <span className="font-bold text-primary-700 dark:text-primary-300">{amount}</span>
            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full inline-block mx-1"></span>
            <span className="text-primary-600 dark:text-primary-400">{selectedPlan.toLowerCase()}</span>
          </div>
        </div>
        {/* Pay Button */}
        <button
          onClick={() => {
            if (selectedCategories.length === 0) {
              showToast.error("Please select at least one category");
              return;
            }
            showToast.success("Proceeding to payment...");
            onClose();
            closeParent();
          }}
          disabled={selectedCategories.length === 0}
          className={`flex-shrink-0 px-5 py-2.5 rounded-lg font-semibold text-base transition-all duration-300 flex items-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[120px] justify-center
            ${selectedCategories.length === 0
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'}
          `}
          aria-disabled={selectedCategories.length === 0}
        >
          Pay {amount}
        </button>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      return createPortal(modalContent, modalRoot);
    }
  }
  return null;
};

export default SelectCourseModalMobile; 