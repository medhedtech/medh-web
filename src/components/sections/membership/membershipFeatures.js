import React from "react";
import Image from "next/image";
import Symbol1 from "@/assets/images/membership/Symbol-1.svg";
import Symbol2 from "@/assets/images/membership/Symbol-2.svg";
import Symbol3 from "@/assets/images/membership/Symbol-3.svg";
import Symbol4 from "@/assets/images/membership/Symbol-4.svg";
import Symbol5 from "@/assets/images/membership/Symbol-5.svg";
import Symbol6 from "@/assets/images/membership/Symbol-6.svg";

const MembershipFeatures = () => {
  const features = [
    {
      title: "Program Selection and Design",
      description:
        "We offer a wide array of programs, carefully curated to cater to various skill levels and industries. Our programs are designed by a team of experts, considering market trends, industry demands, and emerging technologies.",
      icon: Symbol1,
      color: "from-blue-500/10 to-indigo-500/10"
    },
    {
      title: "Interactive Learning Environment",
      description:
        "Our platform features multimedia content, quizzes, assignments, and Live Interactive Sessions with our Educators for doubt clearance and mentorship. This fosters active engagement, collaboration, and hands-on application of skills.",
      icon: Symbol2,
      color: "from-emerald-500/10 to-teal-500/10"
    },
    {
      title: "Experienced Educators",
      description:
        "Our programs are curated by experienced instructors who bring a wealth of knowledge and practical experience to the table. They provide guidance, answer queries, and facilitate discussions to enhance the learning experience.",
      icon: Symbol3,
      color: "from-purple-500/10 to-violet-500/10"
    },
    {
      title: "Continuous Support and Feedback",
      description:
        "Throughout the course, we provide ongoing support, feedback, and guidance to ensure learners are on the right track. We believe in a collaborative learning experience and encourage peer-to-peer interactions.",
      icon: Symbol4,
      color: "from-orange-500/10 to-amber-500/10"
    },
    {
      title: "Industry-Relevant Certifications",
      description:
        "Upon successful completion of a program, learners receive a certificate that is recognized by industry professionals. This certification serves as a testament to their acquired skills and boosts their career prospects.",
      icon: Symbol5,
      color: "from-rose-500/10 to-pink-500/10"
    },
    {
      title: "Community Engagement",
      description:
        "Our platform facilitates a vibrant community where learners can network, share experiences, and collaborate on projects. We believe in building a strong professional network for our learners, helping them to thrive in their careers.",
      icon: Symbol6,
      color: "from-cyan-500/10 to-sky-500/10"
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full">
        <div className="absolute top-20 left-[5%] w-[600px] h-[600px] bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
        <div className="absolute top-40 right-[5%] w-[600px] h-[600px] bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[15%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full py-24">
        <div className="w-full max-w-[2100px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Membership{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Features
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience a comprehensive learning journey with our premium membership features,
              designed to enhance your professional growth and development
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-inner transform group-hover:scale-110 transition-transform duration-500">
                      <Image 
                        src={feature.icon} 
                        alt={feature.title}
                        width={56}
                        height={56}
                        className="transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipFeatures;
