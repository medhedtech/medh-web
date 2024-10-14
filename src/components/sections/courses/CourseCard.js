import Image from "next/image";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white flex flex-col justify-between shadow-md mx-auto">
      <Image
        src={course.image}
        alt={course.title}
        className="rounded-md"
        width={300}
        height={200}
      />
      <h3>{course.title}</h3>
      <h3 className="font-semibold text-lg mt-1">{course.label}</h3>
      <p className="text-gray-500">{course.duration}</p>
      <div className="flex justify-end mt-2">
        <button className="bg-[#5F2DED] text-sm text-white px-4 leading-none py-2">
          Download Brochure
        </button>
        <button className="bg-[#F2277E] text-sm text-white px-4 leading-none">
          Program Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
