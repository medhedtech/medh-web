import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import SelectCourseCard from "./SelectCourseCard";
import usePostQuery from "@/hooks/postQuery.hook";
import Education from "@/assets/images/course-detailed/education.svg";
import { toast } from "react-toastify";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const [planAmount, setPlanAmount] = useState(Number(amount.replace("$", "")) || 0)

  const maxSelections = planType === "silver" ? 1 : 3;
  const [limit] = useState(4);
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
        amount: planAmount * 100,
        currency: "INR",
        name: `${capitalize(planType)} Membership`,
        description: `Payment for ${capitalize(planType)} Membership`,
        image: Education,
        handler: async function (response) {
          toast.success("Payment Successful!");

          // Call subscription API after successful payment
          await handleSubmit();
        },
        prefill: {
          name: "Medh Student",
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
          url: apiUrls?.courses?.getAllCoursesWithLimits(
            page,
            limit,
            "",
            "",
            "",
            "Upcoming",
            "",
            "",
            true
          ),
          onSuccess: (res) => {
            setCourses(res?.courses || []);
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

    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const filteredCourses = courses.filter((course) =>
    course.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCourseSelection = (course) => {
    if (selectedCourses.find((c) => c._id === course._id)) {
      setSelectedCourses(selectedCourses.filter((c) => c._id !== course._id));
    } else if (selectedCourses.length < maxSelections) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleSubscribe = async () => {
    try {
      await postQuery({
        url: apiUrls?.Membership?.addMembership,
        postData: {
          student_id: studentId,
          course_ids: selectedCourses.map((course) => course._id),
          amount: planAmount,
          plan_type: planType,
          duration: selectedPlan.toLowerCase(),
        },
        onSuccess: (res) => {
          console.log("Membership Created", res);
        },
        onFail: (err) => {
          console.error("Error while creating subscription", err);
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  function capitalize(str) {
    if (!str) return ""; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleSubmit = () => {
    console.log("in sub")
    handleSubscribe();
    onClose();
    closeParent();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Select {planType === "silver" ? "a Course" : "up to 3 Courses"}
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
        <div
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCourses.length} of {maxSelections} selected
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
                disabled={selectedCourses.length === 0}
                className={`px-6 py-2.5 rounded-lg transition-all ${
                  selectedCourses.length === 0
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
