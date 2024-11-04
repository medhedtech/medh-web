import React from "react";
import CourseGridItem from "./CourseGridItem";
import CourseListItem from "./CourseListItem";
import MLimg from "@/assets/images/dashbord/MLimg.png";
import ML1 from "@/assets/images/dashbord/ML1.png";
import ML2 from "@/assets/images/dashbord/ML2.png";
import ML3 from "@/assets/images/dashbord/ML3.png";
import ML4 from "@/assets/images/dashbord/ML4.png";
import ML5 from "@/assets/images/dashbord/ML5.png";
import ML6 from "@/assets/images/dashbord/ML6.png";
import grid1 from "@/assets/images/dashbord/grid1.png";
import grid2 from "@/assets/images/dashbord/grid2.png";
import grid3 from "@/assets/images/dashbord/grid3.png";
import grid4 from "@/assets/images/dashbord/grid4.png";

const coursesListData = [
  {
    courseId: 1,
    image: MLimg,
    title: "Advance Machine Learning for Beginners",
    description:
      "Master the art of machine learning by taking this course that includes MLOps, Git, Docker.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
  {
    courseId: 2,
    image: ML1,
    title: "Machine Learning for Beginners",
    description:
      "Learn the basics of ML, Git, and Docker in this beginner course.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
];

const coursesListData2 = [
  {
    courseId: 3,
    image: ML2,
    title: "Learn ML with Python",
    description:
      "Master the art of machine learning by taking this course that includes MLOps, Git, Docker.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
  {
    courseId: 4,
    image: ML3,
    title: "Automate With ML",
    description:
      "Learn the basics of ML, Git, and Docker in this beginner course.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
  {
    courseId: 5,
    image: ML4,
    title: "ML and Daily Task",
    description:
      "Learn the basics of ML, Git, and Docker in this beginner course.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
  {
    courseId: 6,
    image: ML5,
    title: "Machine Learning for Beginners ",
    description:
      "Learn the basics of ML, Git, and Docker in this beginner course.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
  {
    courseId: 7,
    image: ML6,
    title: "Advance Machine Learning for Beginners ",
    description:
      "Learn the basics of ML, Git, and Docker in this beginner course.",
    instructor: "Mr. Poltu Kaka",
    rating: 4.0,
    duration: "3 Months Course",
  },
];

const coursesGridData = [
  {
    courseId: 8,
    image: grid1,
    title: "Learn AI and ML",
    instructor: "Sayef Mamud, PixelCo",
    rating: 4.0,
  },
  {
    courseId: 9,
    image: grid2,
    title: "Learn to play hockey",
    instructor: "Sayef Mamud, PixelCo",
    rating: 4.0,
  },
  {
    courseId: 10,
    image: grid3,
    title: "Mastering AI and ML 2024",
    instructor: "Sayef Mamud, PixelCo",
    rating: 4.0,
  },
  {
    courseId: 11,
    image: grid4,
    title: "Learn to play hockey",
    instructor: "Sayef Mamud, PixelCo",
    rating: 4.0,
  },
];

const SearchDetails = () => {
  return (
    <div className="w-full mx-auto p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="text-base font-bold flex gap-2">
            <span>
              <svg
                width="30"
                height="29"
                viewBox="0 0 30 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.8348 9.07233C17.0011 9.23848 17.2266 9.33181 17.4618 9.33181C17.6969 9.33181 17.9224 9.23848 18.0888 9.07233L18.9405 8.22057V20.2753C18.9405 20.5107 19.034 20.7363 19.2004 20.9027C19.3668 21.0691 19.5924 21.1626 19.8278 21.1626C20.0631 21.1626 20.2887 21.0691 20.4551 20.9027C20.6215 20.7363 20.715 20.5107 20.715 20.2753V8.22057L21.5668 9.07233C21.648 9.1595 21.7459 9.22942 21.8548 9.27791C21.9636 9.32641 22.0811 9.35248 22.2002 9.35458C22.3194 9.35669 22.4377 9.33477 22.5482 9.29015C22.6587 9.24552 22.759 9.1791 22.8433 9.09485C22.9275 9.0106 22.9939 8.91024 23.0386 8.79976C23.0832 8.68929 23.1051 8.57095 23.103 8.45182C23.1009 8.33269 23.0748 8.2152 23.0263 8.10637C22.9778 7.99753 22.9079 7.89958 22.8208 7.81835L20.4548 5.45235C20.2884 5.2862 20.0629 5.19287 19.8278 5.19287C19.5926 5.19287 19.3671 5.2862 19.2008 5.45235L16.8348 7.81835C16.6686 7.98471 16.5753 8.21022 16.5753 8.44534C16.5753 8.68046 16.6686 8.90597 16.8348 9.07233ZM11.251 20.5001L12.1028 19.6484C12.184 19.5612 12.282 19.4913 12.3908 19.4428C12.4996 19.3943 12.6171 19.3682 12.7362 19.3661C12.8554 19.364 12.9737 19.3859 13.0842 19.4305C13.1947 19.4752 13.295 19.5416 13.3793 19.6258C13.4635 19.7101 13.5299 19.8104 13.5746 19.9209C13.6192 20.0314 13.6411 20.1497 13.639 20.2689C13.6369 20.388 13.6108 20.5055 13.5623 20.6143C13.5138 20.7232 13.4439 20.8211 13.3568 20.9023L10.9908 23.2683C10.8244 23.4345 10.5989 23.5278 10.3638 23.5278C10.1286 23.5278 9.90313 23.4345 9.73677 23.2683L7.37077 20.9023C7.2836 20.8211 7.21368 20.7232 7.16519 20.6143C7.11669 20.5055 7.09062 20.388 7.08852 20.2689C7.08642 20.1497 7.10833 20.0314 7.15295 19.9209C7.19758 19.8104 7.264 19.7101 7.34825 19.6258C7.4325 19.5416 7.53286 19.4752 7.64334 19.4305C7.75381 19.3859 7.87215 19.364 7.99128 19.3661C8.11041 19.3682 8.2279 19.3943 8.33674 19.4428C8.44557 19.4913 8.54352 19.5612 8.62475 19.6484L9.47651 20.5001V8.44534C9.47651 8.21003 9.56999 7.98435 9.73638 7.81796C9.90277 7.65157 10.1284 7.55809 10.3638 7.55809C10.5991 7.55809 10.8247 7.65157 10.9911 7.81796C11.1575 7.98435 11.251 8.21003 11.251 8.44534V20.5001Z"
                  fill="black"
                />
              </svg>
            </span>
            Sort
          </button>
          <button className="text-size-15 font-semibold border border-[#BDB7B7] rounded-3xl px-2">
            Relevance
          </button>
        </div>
        <button className="text-gray-700 text-lg flex gap-2">
          <span>
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.73633 21.4582H10.8343V19.0922H3.73633V21.4582ZM3.73633 7.26221V9.62821H25.0303V7.26221H3.73633ZM3.73633 15.5432H17.9323V13.1772H3.73633V15.5432Z"
                fill="black"
              />
            </svg>
          </span>{" "}
          Filter
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {coursesListData.map((course) => (
          <CourseListItem key={course.courseId} {...course} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Newly Launched</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coursesGridData.map((course) => (
          <CourseGridItem key={course.courseId} {...course} />
        ))}
      </div>

      <div className="space-y-4 mt-8">
        {coursesListData2.map((course) => (
          <CourseListItem key={course.courseId} {...course} />
        ))}
      </div>
    </div>
  );
};

export default SearchDetails;
