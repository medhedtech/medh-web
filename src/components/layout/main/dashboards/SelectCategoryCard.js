import React, { useEffect, useState } from "react";
import { Users, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import Image from "next/image";
import SelectCourseCard from './SelectCourseCard'
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";


export default function CategoryCard({ category, isSelected, onClick }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { getQuery } = useGetQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isDown, setIsDown] = useState(false);

  const imgSrc = category?.category_image || AiMl;
  useEffect(()=>{
    const fetchCourses = () => {
      try {
        setLoading(true);
        getQuery({
          url: apiUrls?.courses?.getAllCourses,
          onSuccess: (res) => {
            setCourses(res || []);
            console.log(res)
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

    fetchCourses();
  }, [isPreviewOpen])

  const filteredCourses = courses.filter(
    (course) => course.category === category.category_name
  );

  return (
    <div
      onClick={onClick}
      className={`group p-4 border rounded-xl cursor-pointer transition-all duration-200 relative ${
        isSelected
          ? "border-[#3B82F6] bg-[#EFF6FF] shadow-md"
          : "border-gray-300 hover:border-[#93C5FD] hover:shadow-lg"
      }`}
    >
      <div className="flex gap-4">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={imgSrc}
            alt={category.category_name}
            className="w-full h-full object-cover rounded-lg"
            width={128}
            height={128}
          />
          <div
            className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
              isSelected
                ? "bg-[#3B82F6] opacity-20"
                : "opacity-0 group-hover:opacity-10 bg-black"
            }`}
          ></div>
        </div>
        <div className="flex-1 space-y-2 relative">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900">
              {category.category_name}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {filteredCourses?.length || 0} courses
            </div>
          </div>
        </div>
      </div>

      {/* ChevronDown Button */}
      <div
        className="absolute z-10 -bottom-4 right-[50%] translate-x-[50%] bg-[#fff] border-2 p-2 rounded-full flex items-center justify-center hover:border-[#93C5FD] hover:shadow-lg"
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from triggering the parent onClick
          setIsPreviewOpen(!isPreviewOpen);
          setIsDown((prev) => !prev)
        }}
      >
        {!isDown ? <ChevronDown /> : <ChevronUp />}
      </div>

      {/* Preview Section */}
      {isPreviewOpen && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 max-h-[230px] overflow-auto">
          <h4 className="font-semibold text-gray-800 mb-2">
            Courses in {category.category_name}:
          </h4>
          {filteredCourses?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses.map((course) => (
                <SelectCourseCard
                  key={course._id}
                  course={course}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No courses available in this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
