"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";
import { ArrowRight, Mail } from "lucide-react";

function BannerNewsCourse() {
  const router = useRouter();

  const courses = [
    {
      heading:
        "Stay connected with MEDH as we continue to pioneer advancements in EdTech and skill development.",
      description:
        "Together, we can create a brighter future through the power of education.",
      buttonText: "Contact us",
      imageUrl: CourseBannerImg,
      buttonBgColor: "#F6B335",
      icon: VerticalIcon,
      stats: [
        { label: "Media Coverage", value: "50+" },
        { label: "Success Stories", value: "100+" },
        { label: "Industry Updates", value: "Weekly" }
      ]
    },
  ];

  const handleEnrollClick = () => {
    router.push("/contact-us");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-[#F6B335]/20 via-secondary-500/20 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-[#F6B335]/20 via-secondary-500/20 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Content Section */}
              <div className="p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                    {course.heading}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {course.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6 py-6">
                    {course.stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-2xl font-bold text-[#F6B335] dark:text-[#F6B335]">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnrollClick}
                      className="inline-flex items-center px-6 py-3 bg-[#F6B335] hover:bg-[#e5a52f] text-white font-medium rounded-lg transition-all shadow-lg shadow-[#F6B335]/30 hover:shadow-xl hover:shadow-[#F6B335]/40"
                    >
                      <Mail className="mr-2" size={18} />
                      {course.buttonText}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default BannerNewsCourse;
