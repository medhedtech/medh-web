"use client";

import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import { useRouter } from "next/navigation";

export default function PlacementCourseBanner() {
  const router = useRouter();
  const courses = [
    {
      heading: "Embark on the pathway to professional success",
      description: "Invest in your future and unlock limitless opportunities.",
      buttonText: "Enroll Now",
      imageUrl: CourseBannerImg,
    },
  ];

  const handleEnrollClick = () => {
    router.push("/contact-us");
  };

  return (
    <>
      <div>
        {courses.map((course, index) => (
          <CourseBanner
            key={index}
            heading={course.heading}
            description={course.description}
            buttonText={course.buttonText}
            imageUrl={course.imageUrl}
            onButtonClick={() => handleEnrollClick(course)}
          />
        ))}
      </div>

      <div className="w-full bg-white">
        <p className="sm:w-[50%] leading-normal w-[95%] mx-auto bg-white text-center dark:bg-screen-dark dark:text-gray300 sm:mt-[-20px] mt-[-10px] pb-8 px-3 text-[17px] text-[#727695]">
          It&#39;s essential to highlight that &#39;Medh-Job-Assurance&#39; is
          grounded in a transparent and ethical framework, ensuring learners
          fully comprehend the program&#39;s commitments and expectations.
        </p>
      </div>
    </>
  );
}
