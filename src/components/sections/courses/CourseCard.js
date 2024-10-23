import Image from "next/image";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white flex flex-col justify-between shadow-md dark:bg-black dark:border-whitegrey border">
      <Image
        src={course.image}
        alt={course.title}
        className="rounded-md w-full"
        width={300}
        height={200}
      />
      <div className="text-center py-3">
        <h3>{course.title}</h3>
        <h3 className="font-bold text-[#5C6574] text-lg ">{course.label}</h3>
        <h3 className="font-semibold text-md">{course.grade}</h3>
        <p className="text-gray-500">{course.duration}</p>
      </div>
      <div className="flex  mt-2 ">
        <button className="bg-[#5F2DED] text-sm text-white px-4 w-1/2 leading-none py-3.5">
          Download Brochure
        </button>
        <button className="bg-[#F2277E] text-sm text-white px-4 w-1/2 leading-none py-3.5">
          Program Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
