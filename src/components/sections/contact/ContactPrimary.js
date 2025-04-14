"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiCopy, FiCheck, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ContactPrimary = () => {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('care@medh.co');
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGoogleMaps = () => {
    window.open("https://goo.gl/maps/UD1D9H5tL5XdYsnt5", "_blank");
  };

  const contactCards = [
    {
      title: "Phone",
      content: "+91 7701840696",
      icon: <FiPhone className="w-6 h-6" />,
      href: "tel:+917701840696",
      action: "Call us",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      title: "Office",
      content: (
        <address className="not-italic space-y-1.5">
          <p className="font-medium text-emerald-500 dark:text-emerald-400">Esampark Tech solutions Pvt. Ltd. </p>
          <div className="text-gray-600 dark:text-gray-300">
            <p>S-8, 2nd Floor,</p>
            <p>Pinnacle Business Park,</p>
            <p>Mahakali Caves Road,</p>
            <p>Andheri East, Mumbai – 400093</p>
            <p>Maharashtra, INDIA</p>
          </div>
        </address>
      ),
      icon: <FiMapPin className="w-6 h-6" />,
      action: "Get directions",
      onClick: openInGoogleMaps,
      gradient: "from-violet-400 to-purple-500"
    },
    {
      title: "Email",
      content: "care@medh.co",
      icon: <FiMail className="w-6 h-6" />,
      href: "mailto:care@medh.co",
      action: "Copy email",
      onClick: handleCopyEmail,
      gradient: "from-blue-400 to-indigo-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-emerald-100 to-purple-200 dark:from-emerald-900 dark:to-purple-900"/>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-100 to-sky-200 dark:from-cyan-900 dark:to-sky-900"/>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions about our courses or how we can help you succeed? 
              Reach out to us!
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {contactCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} text-white`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                </div>

                <div className="flex-grow mb-4">
                  {typeof card.content === 'string' ? (
                    <p className="text-gray-600 dark:text-gray-300">{card.content}</p>
                  ) : (
                    card.content
                  )}
                </div>

                {card.href || card.onClick ? (
                  <button
                    onClick={card.onClick || (() => window.location.href = card.href)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  >
                    {card.action}
                    {card.title === "Email" && (
                      copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />
                    )}
                  </button>
                ) : null}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPrimary;
