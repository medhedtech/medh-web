import Image from "next/image";
import React from "react";
import Certificate from "@/assets/images/dashbord/certificate.png";

const ViewCertificate = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full font-Open mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button className="text-size-32 text-gray-700">
          &larr; View Certificate
        </button>
      </div>
      <p className="text-xl ">
        Add this certificate to your resume to demonstrate your skills &
        increase your chances of getting noticed.
      </p>
      <div>
        <Image src={Certificate} alt="certificate" />
      </div>
      <div className="bg-primaryColor text-white py-3 px-4.5 rounded-full text-center w-1/3 mt-14 ml-5">
        <button>Download Certificate</button>
      </div>
    </div>
  );
};

export default ViewCertificate;
