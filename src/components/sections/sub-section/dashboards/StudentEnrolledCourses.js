"use client";
import { useState } from "react";
import dashboardProdileImage from "@/assets/images/dashbord/profile.png";
import PDFImage from "@/assets/images/dashbord/bxs_file-pdf.png";
import Image from "next/image";

const courses = [
  {
    id: 1,
    title: "Web Development",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 2,
    title: "Communication Skills",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 3,
    title: "Leadership is everything",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 4,
    title: "Team work hard work",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 5,
    title: "Master the art of Psychology",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 6,
    title: "React Basics",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
];

const liveCourses = [
  {
    id: 1,
    title: "Team work hard work",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 2,
    title: "Communication Skills",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 3,
    title: "Leadership is everything",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
];

const selfPacedCourses = [
  {
    id: 1,
    title: "Communication Skills",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
  {
    id: 2,
    title: "Leadership is everything",
    instructor: "John Doe",
    image: dashboardProdileImage,
    downloadLink: PDFImage,
  },
];

const StudentEnrolledCourses = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    { name: "Enrolled Courses", content: courses },
    { name: "Live Courses", content: liveCourses },
    { name: "Self-Paced Courses", content: selfPacedCourses },
  ];

  return (
    <div className="p-12 rounded-lg max-w-full mx-auto">
      <h2 className="text-3xl font-semibold mb-8">Course Resources</h2>

      {/* Tab Buttons */}
      <div className="flex mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTab(idx)}
            className={`px-4 py-2 font-medium text-lg ${
              currentTab === idx
                ? "text-[#7ECA9D] border-2 border-[#7ECA9D] rounded-[36px]"
                : "text-gray-500"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map((tab, idx) => (
          <div key={idx} className={idx === currentTab ? "block" : "hidden"}>
            {tab.content.length > 0 ? (
              <div className="space-y-4">
                {tab.content.map((course) => (
                  <div
                    key={course.id}
                    className="p-5 bg-white shadow rounded-lg flex gap-4 items-start"
                  >
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-xl text-[#171A1F] font-normal">
                        {course.title}
                      </h3>
                      <p className="text-[#9095A0]">
                        Instructor: {course.instructor}
                      </p>
                      <a
                        href={course.downloadLink}
                        className="text-[#7ECA9D] font-medium flex items-center mt-2 hover:underline"
                      >
                        <span className="material-icons mr-1">
                          <Image
                            src={course.downloadLink}
                            width={20}
                            height={20}
                            className="rounded-md object-cover"
                          />
                        </span>
                        Download Course Materials
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses available in this tab.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;
