import React from "react";
import { useRouter } from "next/navigation";

const ViewCertificate = ({ certificateUrl }) => {
  const router = useRouter();

  return (
    <div className="p-6 bg-white dark:bg-darkblack rounded-lg shadow-md w-full font-Open mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-size-32 text-gray-700 dark:text-white"
        >
          &larr; View Certificate
        </button>
      </div>
      <p className="text-xl dark:text-whitegrey2">
        Add this certificate to your resume to demonstrate your skills &
        increase your chances of getting noticed.
      </p>
      <div className="mt-6">
        <iframe
          src={certificateUrl}
          width="100%"
          height="600px"
          title="Certificate"
        />
      </div>
      {/* <button
        onClick={handleDownload}
        className="bg-primaryColor text-white py-3 px-4.5 rounded-full text-center w-1/3 mt-14 ml-5"
      >
        Download Certificate
      </button> */}
    </div>
  );
};

export default ViewCertificate;