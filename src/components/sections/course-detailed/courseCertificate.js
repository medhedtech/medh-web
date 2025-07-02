import Image from 'next/image';
import Frame from "@/assets/images/course-detailed/frame.svg";
// import Certificate from "@/assets/images/course-detailed/certificate.svg";
import { Award } from 'lucide-react';

const CertificateSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-1.5 h-6 bg-green-500 rounded-sm mr-2 sm:mr-3"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-50">Course Certificate</h2>
            <Award className="ml-2 text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 rounded-xl p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-green-50 dark:bg-green-900/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 z-0"></div>
            <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                {/* Left Side Content */}
                <div className="md:w-1/2 w-full">
                  <div className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3 ring-4 ring-opacity-30 ring-purple-50 dark:ring-purple-900/10">
                        <Award size={18} className="sm:w-[22px] sm:h-[22px]" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Earn a certificate</h3>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Add this certificate to your resume to demonstrate your skills & increase your chances of getting noticed by employers. Our certificates are recognized in the industry.
                    </p>
                    
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Issued upon successful course completion
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Right Side: Real Certificate Image */}
                <div className="relative flex justify-center items-center md:w-1/2 w-full mt-4 md:mt-0">
                  <div className="relative transform transition-transform hover:scale-105 duration-300">
                    <Image
                      src="/Live Certificate.jpg"
                      alt="Sample Live Course Certificate"
                      width={350}
                      height={250}
                      className="rounded-lg shadow-md w-[180px] sm:w-[220px] md:w-[350px] h-auto border border-gray-200 dark:border-gray-700"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Added benefits section */}
          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 mr-3 flex-shrink-0">
                <Award size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1">Industry Recognition</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Our certificates are valued by leading companies and industry experts.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-500 mr-3 flex-shrink-0">
                <Award size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1">Digital & Physical</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receive both digital and physical copies of your achievement certificate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateSection;
