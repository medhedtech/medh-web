import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import SelectCourseCard from "./SelectCourseCard";
import SelectCategoryCard from "./SelectCategoryCard";
import usePostQuery from "@/hooks/postQuery.hook";
import Education from "@/assets/images/course-detailed/education.svg";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";

export default function SelectCourseModal({
  isOpen,
  onClose,
  planType,
  amount,
  selectedPlan,
  closeParent,
}) {
  const studentId = localStorage.getItem("userId");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getQuery } = useGetQuery();
  const { postQuery, loading: postLoading } = usePostQuery();
  const [planAmount, setPlanAmount] = useState(
    Number(amount.replace("$", "")) || 0
  );
  const [enrolledCategories, setEnrolledCategories] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const maxSelections = planType === "silver" ? 1 : 3;
  const [limit] = useState(40);
  const [page] = useState(1);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToPay = async () => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("userId");

    if (!token || !studentId) {
      return;
    }
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Please log in first.");
      return;
    }
    if (planType) {
      const options = {
        key: "rzp_test_Rz8NSLJbl4LBA5",
        amount: planAmount * 100 * 84.47,
        currency: "INR",
        name: `${capitalize(planType)} Membership`,
        description: `Payment for ${capitalize(planType)} Membership`,
        image: Education,
        handler: async function (response) {
          console.log("Payment Successful!");

          // Call subscription API after successful payment
          await handleSubmit();
        },
        prefill: {
          name: "Medh Membership Plan",
          email: "medh@student.com",
          contact: "9876543210",
        },
        notes: {
          address: "Razorpay address",
        },
        theme: {
          color: "#7ECA9D",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  useEffect(() => {
    const fetchCourses = () => {
      try {
        setLoading(true);
        getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (res) => {
            setCourses(res || []);
          },
          onFail: (err) => {
            console.error("Error fetching courses:", err);
            setError("Failed to load courses. Please try again later.");
          },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = () => {
      try {
        setLoading(true);
        getQuery({
          url: apiUrls?.categories?.getAllCategories,
          onSuccess: (res) => {
            console.log("response", res);
            setCategories(res?.data || []);
          },
          onFail: (err) => {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories. Please try again later.");
          },
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCourses();
      fetchCategories();
    }
  }, [isOpen]);

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCourseSelection = (course) => {
    if (selectedCourses.find((c) => c._id === course._id)) {
      setSelectedCourses(selectedCourses.filter((c) => c._id !== course._id));
    } else if (selectedCourses.length < maxSelections) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const toggleCategorySelection = (category) => {
    if (selectedCategories.find((c) => c._id === category._id)) {
      setSelectedCategories(
        selectedCategories.filter((c) => c._id !== category._id)
      );
    } else if (selectedCategories.length < maxSelections) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // const handleSubscribe = async () => {
  //   try {
  //     await postQuery({
  //       url: apiUrls?.Membership?.addMembership,
  //       postData: {
  //         student_id: studentId,
  //         course_ids: selectedCourses.map((course) => course._id),
  //         amount: planAmount,
  //         plan_type: planType,
  //         duration: selectedPlan.toLowerCase(),
  //       },
  //       onSuccess: (res) => {
  //         toast.success("Membership successfully taken!");
  //         console.log("Membership Created", res);
  //       },
  //       onFail: (err) => {
  //         console.error("Error while creating subscription", err);
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const removeFirstChr = (str = "") => {
    if (!str.length) {
      return 0;
    }
    return Number(str.substring(1));
  };

  const handleSubscribe = async () => {
    try {
      await postQuery({
        url: apiUrls?.Membership?.addMembership,
        postData: {
          student_id: studentId,
          category_ids: selectedCategories.map((category) => category._id),
          amount: planAmount,
          plan_type: planType,
          duration: selectedPlan.toLowerCase(),
        },
        onSuccess: async (res) => {
          toast.success("Membership successfully taken!");

          // Extract expiry_date from the membership response
          const membershipId = res?.data?._id;
          const expiryDate = res?.data?.expiry_date;
          const categoryNames =
            res?.data?.category_ids?.map(
              (category) => category.category_name
            ) || [];
          console.log("All Categories: ", categoryNames);

          const groupedCourses = categoryNames.map((category) =>
            courses.filter((course) => course.category === category)
          );
          console.log("Enrolled Courses: ", groupedCourses);

          const enrolledCourses = groupedCourses.flatMap((group) =>
            group.map((course) => course._id)
          );
          console.log("Enrolled Course IDs: ", enrolledCourses);

          if (!membershipId || !expiryDate) {
            toast.error("Membership response is missing required data.");
            return;
          }

          // Enroll courses with the same expiry date
          const enrollmentPromises = enrolledCourses.map((id) => {
            return postQuery({
              url: apiUrls?.Subscription?.AddSubscription,
              postData: {
                student_id: studentId,
                course_id: id,
                amount: removeFirstChr(amount) * 84.71,
                status: "success",
              },
              onSuccess: () => {
                console.log(`Successfully enrolled in course: ${id}`);
                postQuery({
                  url: apiUrls?.EnrollCourse?.enrollCourse,
                  postData: {
                    student_id: studentId,
                    course_id: id,
                    membership_id: membershipId,
                    expiry_date: expiryDate,
                    is_self_paced: true,
                  },
                  onSuccess: () => {
                    console.log(`Successfully enrolled in course: ${id}`);
                  },
                  onFail: (err) => {
                    console.error(`Failed to enroll in course: ${id}`, err);
                  },
                });
              },
              onFail: (err) => {
                console.error(`Failed to enroll in course: ${id}`, err);
              },
            });
          });

          // Wait for all enrollments to complete
          await Promise.all(enrollmentPromises);
        },
        onFail: (err) => {
          console.error("Error while creating subscription", err);
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  function capitalize(str) {
    if (!str) return ""; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleSubmit = () => {
    console.log("in sub");
    handleSubscribe();
    onClose();
    closeParent();
  };

  if (!isOpen) return null;

  if (postLoading) {
    return <Preloader />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Select {planType === "silver" ? "a Category" : "up to 3 Categories"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
        </div>

        {/* Course List */}
        {/* <div
          className="overflow-y-auto p-4"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses.map((course) => (
                <SelectCourseCard
                  key={course._id}
                  course={course}
                  isSelected={selectedCourses.some((c) => c._id === course._id)}
                  onClick={() => toggleCourseSelection(course)}
                />
              ))}
            </div>
          )}
        </div> */}
        <div
          className="overflow-y-auto p-4"
          style={{
            maxHeight: "calc(90vh - 200px)",
            minHeight: "calc(90vh - 200px)",
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredCategories &&
                filteredCategories.map((category) => (
                  <SelectCategoryCard
                    key={category._id}
                    category={category}
                    isSelected={selectedCategories.some(
                      (c) => c._id === category._id
                    )}
                    onClick={() => toggleCategorySelection(category)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCategories.length} of {maxSelections} selected
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToPay}
                disabled={selectedCategories.length === 0}
                className={`px-6 py-2.5 rounded-lg transition-all ${
                  selectedCategories.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white shadow-md hover:shadow-lg"
                }`}
              >
                Proceed with Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
