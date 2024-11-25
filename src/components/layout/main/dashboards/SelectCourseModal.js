import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import SelectCourseCard from './SelectCourseCard'

export default function SelectCourseModal({ isOpen, onClose, planType, closeParent }) {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getQuery } = useGetQuery();

  const maxSelections = planType === "silver" ? 1 : 3;
  const [limit] = useState(4);
  const [page] = useState(1);

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

  const handleSubmit = () => {
    console.log(selectedCourses);
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
                onClick={handleSubmit}
                disabled={selectedCourses.length === 0}
                className={`px-6 py-2.5 rounded-lg transition-all ${
                  selectedCourses.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white shadow-md hover:shadow-lg'
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
