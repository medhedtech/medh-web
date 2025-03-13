"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, useInView } from "framer-motion";
import { FiMap, FiPhone, FiMail, FiClock, FiCheckCircle } from "react-icons/fi";
// Remove Mapbox imports
// import Map, { Marker, NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// Remove Mapbox token
// const MAPBOX_TOKEN = 'pk.eyJ1IjoibWVkaC1kZXYiLCJhIjoiY2x2dnRuNXpvMDJrcTJybzNpMGZ2ZTVndyJ9.0sDyTf2BJ0G-F_vIeR1JNw';

const ContactPrimary = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Remove Mapbox viewState
  // const [viewState, setViewState] = useState({
  //  longitude: 72.8556,  // Office longitude
  //  latitude: 19.1123,   // Office latitude
  //  zoom: 15
  // });
  
  // Remove marker location
  // const markerLocation = useMemo(() => ({
  //  longitude: 72.8556,
  //  latitude: 19.1123
  // }), []);
  
  // Mouse follow animation values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const rotateX = useTransform(mouseY, [0, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 500], [-5, 5]);
  const glowX = useTransform(mouseX, [0, 500], [0, 100]);
  const glowY = useTransform(mouseY, [0, 300], [0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const headingVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('care@medh.co');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCardHover = (index) => {
    setActiveCard(index);
  };
  
  const handleCardLeave = () => {
    setActiveCard(null);
  };

  // Simplified onLoad handler for iframe
  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);
  
  // Open the office location in Google Maps
  const openInGoogleMaps = () => {
    window.open("https://goo.gl/maps/UD1D9H5tL5XdYsnt5", "_blank");
  };

  const contactCards = [
    {
      title: "Phone",
      content: "+91 7701840696",
      icon: (
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
      ),
      href: "tel:+917701840696",
      action: "Call us",
      emoji: "📱"
    },
    {
      title: "Office",
      content: (
        <address className="not-italic text-gray-600 dark:text-gray-300 space-y-1">
          <p className="font-medium text-[#7ECA9D]">esampark</p>
          <p>S-8, 2nd Floor,</p>
          <p>Pinnacle Business Park,</p>
          <p>Mahakali Caves Road,</p>
          <p>Andheri East, Mumbai – 400093</p>
          <p>Maharashtra, INDIA</p>
        </address>
      ),
      icon: (
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
      ),
      href: "https://goo.gl/maps/UD1D9H5tL5XdYsnt5",
      action: "Get directions",
      emoji: "🏢"
    },
    {
      title: "Email",
      content: "care@medh.co",
      icon: (
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
      ),
      href: "mailto:care@medh.co",
      action: "Copy email",
      emoji: "📧",
      onClick: handleCopyEmail
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 bg-gray-50 dark:bg-gray-900 w-full overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have questions about our courses or how we can help you succeed? 
            Reach out to us!
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
          {/* Contact Information Cards - Full width layout */}
          <div className="w-full lg:w-2/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactCards.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-50 dark:bg-[#7ECA9D]/10 rounded-full mr-3">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <div className="flex-grow">{item.content}</div>
              </motion.div>
            ))}
          </div>

          {/* Google Map - Full width map container with responsive height */}
          <div className="w-full lg:w-3/5 relative rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 h-[400px] md:h-[500px]">
            {/* Loading state */}
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-[#7ECA9D] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                </div>
              </div>
            )}

            {/* Map with proper stacking context */}
            <div className="relative w-full h-full z-0">
              {/* Google Map iframe */}
              <iframe
                ref={mapRef}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.6886970906114!2d77.30289831481935!3d28.66682798849935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfaee853e7dbf%3A0x4850ffffdf8de30c!2sBhavishya%20Nidhi%20Bhawan%2C%20Deshbandhu%20Nagar%2C%20Pandav%20Nagar%2C%20Delhi%2C%20110092!5e0!3m2!1sen!2sin!4v1680257257971!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="z-0"
                onLoad={handleMapLoad}
              ></iframe>

              {/* Map overlay for better UX */}
              <div 
                className={`absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10 opacity-80 ${isMapLoaded ? 'block' : 'hidden'}`}
              ></div>
              
              {/* Location marker with animation */}
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 ${isMapLoaded ? 'block' : 'hidden'}`}>
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-6 h-6 bg-[#7ECA9D] rounded-full flex items-center justify-center shadow-lg shadow-[#7ECA9D]/30">
                    <FiCheckCircle className="text-white w-4 h-4" />
                  </div>
                  <div className="w-2 h-2 bg-[#7ECA9D] rounded-full mt-1 shadow-lg shadow-[#7ECA9D]/30"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPrimary;
