// components/ClassCard.js
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

const ClassCard = ({
  title,
  instructor,
  dateTime,
  isLive,
  image,
  courseId,
}) => {
  const router = useRouter();

  const handleEnrollCourse = () => {
    if (courseId) {
      router.push(`/dashboards/my-courses/${courseId}`);
    } else {
      console.error("Course ID is missing!");
    }
  };

  return (
    <div className="relative">
      {/* Live Badge */}
      {isLive && (
        <div className="flex items-center space-x-1 absolute top-3 left-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000]"></div>
          <span className="text-xs text-[#888C94]">Live</span>
        </div>
      )}

      {/* Card Content */}
      <div className="max-w-xs rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg">
        {/* Image */}
        <div className="w-full h-48">
          <Image
            src={image}
            alt={title}
            width={320}
            height={192}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Card Details */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-[#282F3E]">{title}</h3>
          <p className="text-xs text-[#585D69]">{instructor}</p>
          <p className="text-xs text-[#888C94] mt-2">{dateTime}</p>

          {/* Join Button */}
          <button
            onClick={handleEnrollCourse}
            className="mt-4 px-4 py-2 bg-primaryColor text-white font-semibold rounded-xl hover:bg-green-600 transition"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
ClassCard.propTypes = {
  title: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  isLive: PropTypes.bool,
  image: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

// Default Props
ClassCard.defaultProps = {
  isLive: false,
};

export default ClassCard;

// try {
//   const studentId = localStorage.getItem("userId");
//   if (!studentId) {
//     showToast.error("Please log in to join classes.");
//     return;
//   }
//   await postQuery({
//     url: apiUrls?.EnrollCourse?.enrollCourse,
//     postData: {
//       student_id: studentId,
//       course_id: courseId,
//     },
//     onSuccess: () => {
//       showToast.success("Hurray ! You are enrolled successfully.");
//     },
//     onFail: () => {
//       showToast.error("Error enrolling in the course. Please try again.");
//     },
//   });
// } catch (error) {
//   console.error("An error occurred:", error);
//   showToast.error("An unexpected error occurred. Please try again.");
// }
