import Image from 'next/image';
import Frame from "@/assets/images/course-detailed/frame.svg";
import Certificate from "@/assets/images/course-detailed/certificate.svg";
import { Award } from 'lucide-react';

const CertificateSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-[#050622]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-6 bg-green-500 rounded-sm mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Course Certificate</h2>
            <Award className="ml-2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/10 rounded-full -mr-16 -mt-16 z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -ml-12 -mb-12 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Side Content */}
                <div className="md:w-1/2 w-full">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3 ring-4 ring-opacity-30 ring-purple-50 dark:ring-purple-900/10">
                        <Award size={22} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Earn a certificate</h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Add this certificate to your resume to demonstrate your skills & increase your chances of getting noticed by employers. Our certificates are recognized in the industry.
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Issued upon successful course completion
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Right Side: Certificate inside Frame */}
                <div className="relative flex justify-center items-center md:w-1/2 w-full">
                  {/* Frame surrounding the certificate */}
                  <div className="relative transform transition-transform hover:scale-105 duration-300">
                    <Image
                      src={Frame}
                      alt="Frame"
                      width={300}
                      height={300}
                      className="relative z-0 w-[220px] md:w-[300px]" // Responsive image width
                    />
                    
                    {/* Certificate Image */}
                    <Image
                      src={Certificate}
                      alt="Certificate of completion"
                      width={250}
                      height={250}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[200px] md:w-[250px]" // Responsive image width
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateSection;
