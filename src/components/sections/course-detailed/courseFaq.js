"use client";
import React, { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls, apiBaseUrl } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import { ChevronDown, ChevronRight, HelpCircle, AlertCircle } from "lucide-react";
import axios from "axios";

export default function CourseFaq({ courseId }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { getQuery, loading: courseLoading } = useGetQuery();
  const [courseDetails, setCourseDetails] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noFaqsFound, setNoFaqsFound] = useState(false);
  const [showFaqSection, setShowFaqSection] = useState(true);

  console.log("Component rendered with courseId:", courseId);

  // Fetch course details to get the category
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId]);

  // Fetch FAQs based on course category
  useEffect(() => {
    if (courseDetails) {
      // Check all possible category field names
      const category = courseDetails.category || courseDetails.course_category || courseDetails.courseCategory;
      if (category) {
        fetchFaqsByCategory(category);
      } else {
        console.log("No category found in course details:", courseDetails);
        // Try fetching general FAQs instead of hiding immediately
        fetchAllFaqs();
      }
    }
  }, [courseDetails]);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => {
          console.log("Course details fetched:", data);
          setCourseDetails(data);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
          // Try fetching general FAQs instead of hiding immediately
          fetchAllFaqs();
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
      // Try fetching general FAQs instead of hiding immediately
      fetchAllFaqs();
    }
  };

  // Helper function to safely extract FAQs from various response formats
  const extractFaqsFromResponse = (response) => {
    console.log("Extracting FAQs from response:", response);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.faqs && Array.isArray(response.data.faqs)) {
      return response.data.faqs;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // This is the format we're seeing in the logs - faqs are in response.data.data
      console.log("Found FAQs in response.data.data:", response.data.data);
      return response.data.data;
    }
    
    return [];
  };

  const fetchAllFaqs = async () => {
    setLoading(true);
    console.log("Attempting to fetch all FAQs as fallback");
    
    try {
      const allFaqsResponse = await axios.get(`${apiBaseUrl}${apiUrls.faqs.getAllFaqs}`);
      console.log("All FAQs response:", allFaqsResponse);
      
      const extractedFaqs = extractFaqsFromResponse(allFaqsResponse);
      console.log("Extracted all FAQs:", extractedFaqs);
      
      if (extractedFaqs.length > 0) {
        setFaqs(extractedFaqs);
        setShowFaqSection(true);
        setNoFaqsFound(false);
      } else {
        console.log("No FAQs found in the response");
        setNoFaqsFound(true);
        setShowFaqSection(true); // Still show the section, just with a message
      }
    } catch (err) {
      console.error("Error fetching all FAQs:", err);
      setShowFaqSection(true); // Show section with error message
      setError("Unable to load FAQs at this time");
    } finally {
      setLoading(false);
    }
  };

  const fetchFaqsByCategory = async (category) => {
    setLoading(true);
    let foundFaqs = false;
    console.log("Trying to fetch FAQs for category:", category);
    
    // Properly encode the category name for URL
    const encodedCategory = encodeURIComponent(category);
    
    try {
      // Try the getAllFaqs endpoint first as it's more likely to work
      try {
        const allFaqsResponse = await axios.get(`${apiBaseUrl}${apiUrls.faqs.getAllFaqs}`);
        console.log("All FAQs response:", allFaqsResponse);
        
        const allFaqsData = extractFaqsFromResponse(allFaqsResponse);
        console.log("Processed FAQs data:", allFaqsData);
        
        if (allFaqsData.length > 0) {
          // If we have all FAQs, filter them by category on the client side
          const categoryFaqs = allFaqsData.filter(
            faq => faq.category && faq.category.toLowerCase() === category.toLowerCase()
          );
          
          console.log(`Found ${categoryFaqs.length} FAQs for category ${category}:`, categoryFaqs);
          
          if (categoryFaqs.length > 0) {
            setFaqs(categoryFaqs);
            foundFaqs = true;
          } else {
            // If we have FAQs but none for this category, use all FAQs instead
            console.log("No category-specific FAQs found, using all FAQs:", allFaqsData);
            setFaqs(allFaqsData);
            foundFaqs = true;
          }
        }
      } catch (err) {
        console.error("Error fetching all FAQs:", err);
      }
      
      // If we couldn't find FAQs, try the category endpoint as a backup
      if (!foundFaqs) {
        try {
          console.log(`Trying category endpoint: ${apiBaseUrl}${apiUrls.faqs.getFaqsByCategory}/${encodedCategory}`);
          const response = await axios.get(`${apiBaseUrl}${apiUrls.faqs.getFaqsByCategory}/${encodedCategory}`);
          console.log("Category FAQs response:", response);
          
          const categoryFaqsData = extractFaqsFromResponse(response);
          console.log("Processed category FAQs data:", categoryFaqsData);
          
          if (categoryFaqsData.length > 0) {
            console.log("Setting category FAQs:", categoryFaqsData);
            setFaqs(categoryFaqsData);
            foundFaqs = true;
          }
        } catch (err) {
          console.error(`Error fetching FAQs for category ${category}:`, err);
        }
      }
      
      // Even if we don't find FAQs, show the section with a message
      console.log("Final foundFaqs state:", foundFaqs);
      setNoFaqsFound(!foundFaqs);
      setShowFaqSection(true); // Always show the section now
      setLoading(false);
    } catch (err) {
      console.error("Error in FAQ fetching process:", err);
      setError("Unable to load FAQs at this time");
      setShowFaqSection(true); // Show with error message
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  console.log("Current state - loading:", loading, "courseLoading:", courseLoading, "showFaqSection:", showFaqSection, "faqs:", faqs, "noFaqsFound:", noFaqsFound);

  if (courseLoading || loading) {
    return <Preloader />;
  }

  // No longer hiding section completely, just check if we should show the section at all
  if (!showFaqSection) {
    console.log("Not showing FAQ section because showFaqSection is false");
    return null;
  }

  // Find the category to display
  const displayCategory = courseDetails?.category || courseDetails?.course_category || "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-[#050622]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-green-500 rounded-sm mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
            Frequently Asked Questions 
            {displayCategory && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({displayCategory})
              </span>
            )}
          </h2>
          <HelpCircle className="ml-2 text-gray-400 w-5 h-5" />
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* No FAQs found message */}
        {noFaqsFound && !error && (
          <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg flex items-start">
            <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">No specific FAQs available for this course category yet.</p>
              <p className="mt-1">Our team is working on adding more FAQs. Meanwhile, check out our <a href="/faq" className="underline hover:text-blue-800 dark:hover:text-blue-200">general FAQs page</a> or contact our support team for assistance.</p>
            </div>
          </div>
        )}

        {/* FAQs list */}
        {faqs.length > 0 && (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-all duration-200"
              >
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer ${
                    openIndex === index 
                      ? "bg-green-50 dark:bg-green-900/20" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className={`text-base font-medium pr-8 ${
                    openIndex === index 
                      ? "text-green-700 dark:text-green-400" 
                      : "text-gray-800 dark:text-gray-200"
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 p-1 rounded-full ${
                    openIndex === index 
                      ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {openIndex === index ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                {openIndex === index && (
                  <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-300 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>
              If you have any other questions or concerns not covered in the FAQs, please feel free to 
              <a href="/faq" className="font-medium underline ml-1 hover:text-blue-800 dark:hover:text-blue-200">
                view all FAQs
              </a> or 
              <a href="/contact-us" className="font-medium underline ml-1 hover:text-blue-800 dark:hover:text-blue-200">
                contact our support team
              </a>.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
