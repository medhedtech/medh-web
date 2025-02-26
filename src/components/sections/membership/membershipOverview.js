"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Users, CheckCircle } from "lucide-react";

const data = {
  tabs: [
    {
      id: 1,
      name: "MEDH Membership Overview",
      icon: <Users className="w-5 h-5" />,
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            MEDH Membership is designed to provide members with unparalleled
            access to resources, support, and opportunities that drive
            educational and professional development. Our membership program is
            tailored to meet the diverse needs of our community, offering a
            range of benefits that cater to individuals, students, and
            educational institutions. By joining MEDH Membership, you become
            part of a forward-thinking community dedicated to innovation and
            excellence in education.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Silver Membership",
      icon: <Star className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-primary-500 dark:text-primary-400 font-semibold mb-2">
              Choose Your Path
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Explore and learn any or all courses within a 'Single-Course-Category' of your preferences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Exclusive Content Access",
                description:
                  "Enjoy access to a curated library of exclusive educational content, including webinars, tutorials, and research papers.",
              },
              {
                title: "Discounts on Courses",
                description:
                  "Receive up to 20% discount on all MEDH skill development courses including LIVE and Blended both, allowing you to learn more for less.",
              },
              {
                title: "Community Engagement",
                description:
                  "Participate in members-only forums and discussion groups to connect with like-minded individuals and share knowledge.",
              },
              {
                title: "Monthly Newsletter",
                description:
                  "Stay informed with our monthly newsletter featuring the latest updates, tips, and insights from industry experts.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      name: "Gold Membership",
      icon: <Crown className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
            <h3 className="text-amber-600 dark:text-amber-400 font-semibold mb-3">
              Premium Access
            </h3>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Explore and learn any or all programs within any of the Three-Course-Categories of your preference.
            </p>
            <p className="text-primary-500 dark:text-primary-400 mt-4 font-medium">
              All Silver Membership Benefits plus additional perks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Premium Content Access",
                description:
                  "Gain access to advanced courses, special workshops, and exclusive events that are not available to the general public.",
              },
              {
                title: "Personalized Support",
                description:
                  "Receive one-on-one mentoring sessions and personalized guidance from our team of experts to help you achieve your goals.",
              },
              {
                title: "Early Access to New Courses",
                description:
                  "Be the first to access new courses and programs before they are released to the public.",
              },
              {
                title: "Higher Discount Rates",
                description:
                  "Enjoy up to 30% discount on all Medh courses, including LIVE and Blended both, maximizing your learning opportunities.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-amber-100 dark:border-amber-900/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
  ],
};

const MembershipOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
            Membership Benefits
          </span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Unlock Your Potential with <span className="text-primary-500 dark:text-primary-400">MEDH Membership</span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Welcome to MEDH Membership, where we empower individuals, students,
            and educational institutions with exclusive benefits that foster
            growth, learning, and success.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12 space-x-4">
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeContent.content}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default MembershipOverview;
