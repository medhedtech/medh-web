import Image from 'next/image';
import Frame from "@/assets/images/course-detailed/frame.svg";
import Certificate from "@/assets/images/course-detailed/certificate.svg";

const CertificateSection = () => {
  return (
    <section className="bg-white dark:bg-[#050622] w-full md:pt-6  pb-10 md:px-4 ">
      <div className="flex flex-col md:flex-row items-center justify-between lg:w-[63%] w-[100%] lg:ml-[7%] px-4 md:px-0 ">
        
        {/* Left Side Content with Half Border */}
        <div className="mb-6 md:mb-0 border-t-2 border-l-2 border-b-2 max-sm:border-r-2 border-gray-300 py-4  md:w-[50%] w-full text-center ">
          <h2 className="text-xl md:text-2xl font-bold text-[#5C6574] mb-2 dark:text-gray-50">Earn a certificate</h2>
          <p className="text-[#727695] dark:text-gray-300">
            Add this certificate to your resume to demonstrate your skills & increase your chances of getting noticed.
          </p>
        </div>

        {/* Right Side: Certificate inside Frame */}
        <div className="relative flex justify-center items-center w-full md:w-auto">
          {/* Frame surrounding the certificate */}
          <Image
            src={Frame}
            alt="Frame"
            width={300}
            height={300}
            className="relative z-0 w-[200px] md:w-[350px]" // Responsive image width
          />
          
          {/* Certificate Image */}
          <Image
            src={Certificate}
            alt="Certificate of completion"
            width={250}
            height={250}
            className="absolute z-10 w-[180px] md:w-[250px]" // Responsive image width
          />
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;
