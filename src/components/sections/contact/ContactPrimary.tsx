"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiCopy, FiCheck, FiMapPin, FiPhone, FiMail, FiExternalLink } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface IContactCard {
  title: string;
  content: string | React.ReactNode;
  icon: React.ReactNode;
  href?: string;
  action: string;
  onClick?: () => void;
  gradient: string;
}

const ContactPrimary: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText('care@medh.co');
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const openInGoogleMaps = useCallback(() => {
    window.open("https://goo.gl/maps/UD1D9H5tL5XdYsnt5", "_blank");
  }, []);

  const contactCards: IContactCard[] = [
    {
      title: "Phone",
      content: "+91 7701840696",
      icon: <FiPhone className="w-6 h-6" />,
      href: "tel:+917701840696",
      action: "Call us",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Office",
      content: (
        <address className="not-italic space-y-2">
          <p className="font-semibold text-gray-900 dark:text-white">Esampark Tech Solutions Pvt. Ltd.</p>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>S-8, 2nd Floor, Pinnacle Business Park</p>
            <p>Mahakali Caves Road, Andheri East</p>
            <p>Mumbai – 400093, Maharashtra</p>
            <p className="font-medium">INDIA</p>
          </div>
        </address>
      ),
      icon: <FiMapPin className="w-6 h-6" />,
      action: "Get directions",
      onClick: openInGoogleMaps,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Email",
      content: "care@medh.co",
      icon: <FiMail className="w-6 h-6" />,
      href: "mailto:care@medh.co",
      action: "Copy email",
      onClick: handleCopyEmail,
      gradient: "from-purple-500 to-purple-600"
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative"
    >
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
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${card.gradient} text-white shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
              </div>

              {/* Content */}
              <div className="flex-grow mb-6">
                {typeof card.content === 'string' ? (
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {card.content}
                  </p>
                ) : (
                  card.content
                )}
              </div>

              {/* Action Button */}
              {(card.href || card.onClick) && (
                <button
                  onClick={card.onClick || (() => card.href && (window.location.href = card.href))}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group-hover:gap-3"
                >
                  <span>{card.action}</span>
                  {card.title === "Email" ? (
                    copied ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />
                  ) : card.title === "Office" ? (
                    <FiExternalLink className="w-4 h-4" />
                  ) : (
                    <FiPhone className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-blue-200/30 dark:border-blue-700/30">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Business Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-md mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Weekdays</h4>
              <p className="text-gray-600 dark:text-gray-300">Monday - Friday</p>
              <p className="text-gray-600 dark:text-gray-300">9:00 AM - 6:00 PM IST</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h4>
              <p className="text-gray-600 dark:text-gray-300">Email: Within 24 hours</p>
              <p className="text-gray-600 dark:text-gray-300">Phone: Immediate</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactPrimary;
