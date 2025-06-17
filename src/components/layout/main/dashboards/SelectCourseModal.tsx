"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import SelectCategoryCard from "./SelectCategoryCard";
import usePostQuery from "@/hooks/postQuery.hook";
import Education from "@/assets/images/course-detailed/education.svg";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import { useRouter } from "next/navigation";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG, { USD_TO_INR_RATE } from "@/config/razorpay";

interface SelectCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: string;
  amount: string;
  selectedPlan: string;
  closeParent: () => void;
}

interface Course {
  _id: string;
  category: string;
}

interface Category {
  _id: string;
  category_name: string;
}

export default function SelectCourseModal({
  isOpen,
  onClose,
  planType,
  amount,
  selectedPlan,
  closeParent,
}: SelectCourseModalProps) {
  const studentId = localStorage.getItem("userId");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const [planAmount, setPlanAmount] = useState<number>(Number(amount.replace("$", "")) || 0);
  const router = useRouter();
  const { openRazorpayCheckout } = useRazorpay();

  const maxSelections = planType === "silver" ? 1 : 3;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const handleProceedToPay = async () => {
    if (!selectedCategories.length) {
      toast.error("Please select at least one category");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const studentId = localStorage.getItem("userId");

      if (!token || !studentId) {
        toast.error("Please log in first.");
        return;
      }

      if (planType) {
        try {
          await openRazorpayCheckout({
            ...RAZORPAY_CONFIG,
            amount: planAmount * 100 * USD_TO_INR_RATE,
            name: `${capitalize(planType)} Membership`,
            description: `Payment for ${capitalize(planType)} Membership`,
            image: Education,
            handler: async function (response) {
              showToast.success("Payment successful!");
              handleSubmit();
            },
            modal: {
              ondismiss: function() {
                setIsProcessing(false);
              }
            }
          });
        } catch (error) {
          console.error("Payment error:", error);
          toast.error("Payment initialization failed. Please try again.");
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          getQuery({
            url: apiUrls?.courses?.getAllCourses,
            onSuccess: (res) => setCourses(res || []),
            onFail: (err) => {
              console.error("Error fetching courses:", err);
              throw new Error("Failed to load courses");
            },
          }),
          getQuery({
            url: apiUrls?.categories?.getAllCategories,
            onSuccess: (res) => setCategories(res?.data || []),
            onFail: (err) => {
              console.error("Error fetching categories:", err);
              throw new Error("Failed to load categories");
            },
          })
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategorySelection = (category: Category) => {
    if (planType === "silver") {
      setSelectedCategories(
        selectedCategories.some((c) => c._id === category._id) ? [] : [category]
      );
    } else {
      setSelectedCategories(prev => {
        if (prev.some((c) => c._id === category._id)) {
          return prev.filter((c) => c._id !== category._id);
        }
        if (prev.length < maxSelections) {
          return [...prev, category];
        }
        return prev;
      });
    }
  };

  const handleSubscribe = async () => {
    if (!studentId) return;
    
    try {
      const membershipResponse = await postQuery({
        url: apiUrls?.Membership?.addMembership,
        postData: {
          student_id: studentId,
          category_ids: selectedCategories.map((category) => category._id),
          amount: planAmount,
          plan_type: planType,
          duration: selectedPlan.toLowerCase(),
        },
      });

      if (!membershipResponse.success) {
        throw new Error("Failed to create membership");
      }

      const membershipId = membershipResponse?.data?._id;
      const expiryDate = membershipResponse?.data?.expiry_date;
      const categoryNames = membershipResponse?.data?.category_ids?.map(
        (category: Category) => category.category_name
      ) || [];

      if (!membershipId || !expiryDate) {
        throw new Error("Invalid membership data received");
      }

      const groupedCourses = categoryNames.map((category: string) =>
        courses.filter((course) => course.category === category)
      );
      const enrolledCourses = groupedCourses.flatMap((group) =>
        group.map((course) => course._id)
      );

      // Process all enrollments in parallel
      await Promise.all(
        enrolledCourses.map(async (courseId) => {
          const subscriptionResponse = await postQuery({
            url: apiUrls?.Subscription?.AddSubscription,
            postData: {
              student_id: studentId,
              course_id: courseId,
              amount: removeFirstChr(amount) * 84.71,
              status: "success",
            },
          });

          if (subscriptionResponse.success) {
            await postQuery({
              url: apiUrls?.EnrollCourse?.enrollCourse,
              postData: {
                student_id: studentId,
                course_id: courseId,
                membership_id: membershipId,
                expiry_date: expiryDate,
                is_self_paced: true,
              },
            });
          }
        })
      );

      showToast.success("Successfully enrolled in all courses!");
      router.push("/dashboards/student-membership");
    } catch (err) {
      console.error("Error during subscription process:", err);
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  const removeFirstChr = (str = ""): number => {
    if (!str.length) return 0;
    return Number(str.substring(1));
  };

  function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleSubmit = () => {
    handleSubscribe();
    onClose();
    closeParent();
  };

  if (!isOpen) return null;

  if (postLoading) return <Preloader />;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Select {planType === "silver" ? "a Category" : `up to ${maxSelections} Categories`}
              </h2>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(85vh - 180px)" }}>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center gap-1.5 text-red-500 p-3">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <SelectCategoryCard
                      category={category}
                      isSelected={selectedCategories.some((c) => c._id === category._id)}
                      onClick={() => toggleCategorySelection(category)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {selectedCategories.length} of {maxSelections} selected
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceedToPay}
                  disabled={selectedCategories.length === 0 || isProcessing}
                  className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-1.5 text-sm ${
                    selectedCategories.length === 0 || isProcessing
                      ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 