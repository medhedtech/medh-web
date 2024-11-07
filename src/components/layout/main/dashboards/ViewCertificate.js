import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import Certificate from "@/assets/images/dashbord/certificate.png";

const ViewCertificate = () => {
  const router = useRouter();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/images/certificate.png";
    link.download = "Certificate.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full font-Open mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="text-size-32 text-gray-700">
          &larr; View Certificate
        </button>
      </div>
      <p className="text-xl">
        Add this certificate to your resume to demonstrate your skills &
        increase your chances of getting noticed.
      </p>
      <div className="mt-6">
        <Image src={Certificate} alt="certificate" width={600} height={400} />
      </div>
      <button 
        onClick={handleDownload}
        className="bg-primaryColor text-white py-3 px-4.5 rounded-full text-center w-1/3 mt-14 ml-5"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default ViewCertificate;