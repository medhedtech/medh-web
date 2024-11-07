"use client";
import Image from "next/image";
import React, { useState } from "react";
import MLimg from "@/assets/images/dashbord/MLimg.png";
import { useRouter } from "next/navigation";

const BillDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleProceedToPay = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container py-7">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button className="text-blue-500 text-xl">
          <div>
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M31.2623 11.9996C31.2623 12.8868 30.5357 13.6134 29.6485 13.6134H6.08742L13.3888 20.9559C14.0351 21.6022 14.0351 22.6109 13.3888 23.2552C13.1068 23.5392 12.7033 23.6998 12.2587 23.6998C11.8552 23.6998 11.4126 23.5392 11.1306 23.2161L1.08334 13.1296C0.439017 12.4833 0.439017 11.4747 1.08334 10.8695L11.1306 0.783045C11.7749 0.138725 12.7836 0.138725 13.4299 0.783045C14.0743 1.42938 14.0743 2.43803 13.4299 3.08235L6.08742 10.3857H29.6485C30.5357 10.3857 31.2623 11.1124 31.2623 11.9996Z"
                fill="#202244"
              />
            </svg>
          </div>
        </button>
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Billing Details
        </h2>
      </div>

      <div className="flex gap-4 py-10">
        {/* Image Section */}
        <div className="w-1/2">
          <Image
            src={MLimg}
            className="w-full rounded-xl h-96"
            alt="ML Course Image"
          />
        </div>

        <div className="w-1/2">
          <div className="flex justify-between">
            <p className="font-bold text-xs text-[#FF6B00]">Diploma</p>
            <p className="text-gray-500 text-sm">
              <span className="text-yellow-500">★ 4.0</span>
            </p>
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            Advance Machine Learning for Beginners
          </h3>

          <div className="flex justify-between dark:text-gray-300 mb-4">
            <span className="font-semibold text-[#202244] text-sm">Name:</span>{" "}
            <span className="text-[#545454] text-sm">Manik Das</span>
          </div>
          <div className="flex justify-between dark:text-gray-300 mb-4">
            <span className="font-semibold text-[#202244] text-sm">
              Email ID:
            </span>{" "}
            <span className="text-[#545454] text-sm">manik@gmail.com</span>
          </div>
          <div className="flex justify-between dark:text-gray-300 mb-4">
            <span className="font-semibold text-[#202244] text-sm">
              Course:
            </span>{" "}
            <span className="text-[#545454] text-sm">
              Advance Machine Learning
            </span>
          </div>
          <div className="flex justify-between dark:text-gray-300 mb-4">
            <span className="font-semibold text-[#202244] text-sm">
              Category:
            </span>{" "}
            <span className="text-[#545454] text-sm">Tech</span>
          </div>
          <div className="flex justify-between dark:text-gray-300 mb-4">
            <span className="font-semibold text-[#202244] text-sm">Price:</span>{" "}
            <span className="text-[#545454] text-sm">29,000 /-</span>
          </div>

          <button
            onClick={handleProceedToPay}
            className="mt-6 w-full px-6 py-3 bg-[#7ECA9D] text-white font-semibold rounded-full hover:bg-green-500"
          >
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center mx-auto justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white  rounded-lg p-12 w-1/2">
            <div className="">
              <svg
                width="64"
                height="63"
                viewBox="0 0 64 63"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <path
                  d="M31.9992 58.4999C47.0766 58.4999 59.2992 46.2773 59.2992 31.1999C59.2992 16.1225 47.0766 3.8999 31.9992 3.8999C16.9218 3.8999 4.69922 16.1225 4.69922 31.1999C4.69922 46.2773 16.9218 58.4999 31.9992 58.4999Z"
                  fill="#7ECA9D"
                />
                <path
                  d="M45.7787 18.98L28.0987 36.66L20.8187 29.38L17.1787 33.02L28.0987 43.94L49.4187 22.62L45.7787 18.98Z"
                  fill="white"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-center text-[#FFA927]">
              Payment Successful
            </h2>
            <p className="mb-4 text-center text-[#737373]">
              Thank You. We have received <br /> your Payment.
            </p>
            <div className="flex justify-center rounded-full mx-auto ">
              <button
                onClick={() => {
                  closeModal();
                  router.push("/dashboards/my-courses");
                }}
                className="px-8 py-2 bg-primaryColor text-center text-white rounded-full hover:bg-green-500"
              >
                Go to Courses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
