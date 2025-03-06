'use client';

import React from "react";
import { motion } from "framer-motion";

const ContactPrimary = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#f8f9ff] to-[#f0f8ff] dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7ECA9D] to-[#5BB381] inline-block text-transparent bg-clip-text mb-4"
            variants={itemVariants}
          >
            Get in Touch
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Have questions about Medh? We're here to help you transform your learning journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Phone Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
            style={{
              boxShadow: "0px 8px 24px rgba(126, 202, 157, 0.12)",
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#7ECA9D] to-[#5BB381] rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Phone</h3>
              <a
                href="tel:+917701840696"
                className="text-[#7ECA9D] hover:text-[#5BB381] transition-colors duration-300"
              >
                +91 7701840696
              </a>
            </div>
          </motion.div>

          {/* Address Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
            style={{
              boxShadow: "0px 8px 24px rgba(126, 202, 157, 0.12)",
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#7ECA9D] to-[#5BB381] rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Office</h3>
              <address className="not-italic text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-medium text-[#7ECA9D]">esampark</p>
                <p>S-8, 2nd Floor,</p>
                <p>Pinnacle Business Park,</p>
                <p>Mahakali Caves Road,</p>
                <p>Andheri East, Mumbai – 400093</p>
                <p>Maharashtra, INDIA</p>
              </address>
            </div>
          </motion.div>

          {/* Email Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
            style={{
              boxShadow: "0px 8px 24px rgba(126, 202, 157, 0.12)",
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#7ECA9D] to-[#5BB381] rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Email</h3>
              <a
                href="mailto:care@medh.co"
                className="text-[#7ECA9D] hover:text-[#5BB381] transition-colors duration-300"
              >
                care@medh.co
              </a>
            </div>
          </motion.div>
        </div>

        {/* Map Integration */}
        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-2xl overflow-hidden h-[400px] backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700"
          style={{
            boxShadow: "0px 8px 24px rgba(126, 202, 157, 0.12)",
          }}
        >
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.989878087447!2d72.85558!3d19.1123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7e3f2058d07%3A0x0!2sPinnacle%20Business%20Park%2C%20Mahakali%20Caves%20Rd%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra%20400093!5e0!3m2!1sen!2sin!4v1624451234567!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactPrimary;
