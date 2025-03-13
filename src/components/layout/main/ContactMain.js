'use client';
import ContactBanner from "@/components/sections/contact/ContactBanner";
import ContactPrimary from "@/components/sections/contact/ContactPrimary";
import HirePage from "@/components/sections/hire/HirePage";
import Joinmedhpage from "@/components/sections/hire/Joinmedhpage";
import Registration from "@/components/sections/registrations/Registration";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowDownCircle, MessageSquare, Sparkles, Star, Send, Rocket, Gift, Trophy, CheckCircle2, Frown } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import confetti from 'canvas-confetti';

const ContactMain = () => {
  // State management
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [achievement, setAchievement] = useState(null);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Achievement badges
  const achievements = [
    { id: 'explorer', title: 'Explorer Badge', description: 'You scrolled through the page!', icon: <Rocket className="w-6 h-6 text-purple-500" /> },
    { id: 'curious', title: 'Curious Mind', description: 'You checked out our location!', icon: <Star className="w-6 h-6 text-yellow-500" /> },
    { id: 'feedback', title: 'Feedback Hero', description: 'You reacted to our page!', icon: <Trophy className="w-6 h-6 text-amber-500" /> }
  ];

  // Handle cursor movement for floating elements
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
    setCursorPosition({ x: clientX, y: clientY });
  };

  // Scroll tracking animation
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  // Handle trigger achievement
  const triggerAchievement = (achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      setAchievement(achievement);
      setTimeout(() => {
        setAchievement(null);
      }, 3000);
    }
  };

  // Run confetti
  const runConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set up scroll tracking for explorer achievement
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight && !localStorage.getItem('explorer-achieved')) {
        triggerAchievement('explorer');
        localStorage.setItem('explorer-achieved', 'true');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to the next section
  const scrollToNextSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const revealEmojis = () => {
    setShowEmoji(true);
  };

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmoji(false);
    triggerAchievement('feedback');
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 1500);
    runConfetti();
  };

  return (
    <div 
      className="bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 min-h-screen w-full"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <Head>
        <title>Connect with Medh - Your Adventure Starts Here!</title>
        <meta name="description" content="Join the Medh adventure! Reach out to us for awesome learning experiences, cool courses, and fun educational opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      {/* Achievement notification - Improved for mobile */}
      <AnimatePresence>
        {achievement && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 max-w-[90%] sm:max-w-sm"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 sm:p-3 rounded-full">
              {achievement.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">Achievement Unlocked! 🎉</h3>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">{achievement.title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">{achievement.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Registration Form */}
      <section className="relative overflow-hidden min-h-[90vh] pt-6 sm:pt-10">
        {/* Background elements - same as before */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated grid */}
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(126, 202, 157, 0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
          
          {/* Floating elements - simplified for mobile performance */}
          <motion.div 
            className="absolute top-1/4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-purple-300 to-indigo-300 dark:from-purple-600 dark:to-indigo-600 rounded-full blur-3xl opacity-40"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/4 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-pink-300 to-orange-200 dark:from-pink-600 dark:to-orange-500 rounded-full blur-3xl opacity-30"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Animated stars - reduce quantity on mobile */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white dark:bg-purple-300 rounded-full"
              style={{
                width: Math.random() * 4 + 2 + "px",
                height: Math.random() * 4 + 2 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-8"
            style={{ opacity, scale, y }}
          >
            <motion.div variants={fadeInUp} className="mb-3 sm:mb-4 inline-block">
              <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#7ECA9D]/20 to-purple-300/20 dark:from-[#7ECA9D]/30 dark:to-purple-600/30 text-[#5BB381] dark:text-[#7ECA9D] font-medium text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Begin Your Adventure
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 relative"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7ECA9D] via-teal-500 to-purple-500 dark:from-[#7ECA9D] dark:via-teal-400 dark:to-purple-400">
                Say Hello to
              </span>
              <div className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400"> Medh!</span>
                <motion.span 
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-yellow-300 dark:bg-yellow-500 rounded-full opacity-70 z-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.span>
              </div>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium px-2"
            >
              <span className="inline-block">✨</span> Ready to join our epic learning adventure? Drop us a message and let's start something amazing!
            </motion.p>
            
            {/* Interactive scroll indicator - more touch-friendly */}
            <motion.div
              variants={fadeInUp}
              className="mt-6 sm:mt-10"
            >
              <motion.button 
                onClick={() => scrollToNextSection("contact-details")}
                className="group relative inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#7ECA9D] to-purple-500 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 touch-manipulation"
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 text-sm sm:text-base">Begin Your Journey</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative z-10"
                >
                  <ArrowDownCircle size={18} />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-[#7ECA9D] opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 rounded-full" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Registration Card - optimized for mobile */}
          <motion.div 
            className="relative mx-auto max-w-4xl group"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7ECA9D] via-purple-500 to-[#5BB381] rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-700 animate-gradient-x"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
              {/* Floating objects in card - reduced for mobile */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 transform rotate-12 hidden sm:block">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="text-3xl"
                >
                  🚀
                </motion.div>
              </div>
              
              <div className="absolute bottom-10 left-10 hidden sm:block">
                <motion.div 
                  {...floatingAnimation}
                  className="text-2xl"
                >
                  💌
                </motion.div>
              </div>
              
              {/* Registration form with ID for navigation */}
              <div id="registration-form" className="pb-2 sm:pb-0">
                <Registration pageTitle="contact_us" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact details section */}
      <div id="contact-details">
        <ContactPrimary />
      </div>

      {/* Interactive feedback section - mobile optimized */}
      <section className="py-10 sm:py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-medium text-xs sm:text-sm mb-4 sm:mb-6">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              Your Opinion Matters
            </span>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5BB381] to-purple-600 dark:from-[#7ECA9D] dark:to-purple-400">
              How's Your Experience?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 text-sm sm:text-base">
              Let us know what you think of our new contact page!
            </p>
            
            {/* Interactive Emoji Feedback - more touch-friendly */}
            {!selectedEmoji ? (
              <motion.div className="flex justify-center mb-6 sm:mb-8">
                {!showEmoji ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={revealEmojis}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/60 text-purple-600 dark:text-purple-300 font-medium rounded-full transition-all flex items-center gap-2 active:bg-purple-200 touch-manipulation"
                  >
                    <span className="text-sm sm:text-base">Share your reaction</span>
                    <Sparkles className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.div
                    className="flex gap-2 sm:gap-4 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-full shadow-lg"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {[
                      { emoji: "😍", label: "Love it" },
                      { emoji: "😊", label: "Like it" },
                      { emoji: "😐", label: "Neutral" },
                      { emoji: "😕", label: "Needs work" }
                    ].map((item, index) => (
                      <motion.button
                        key={index}
                        className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => selectEmoji(item)}
                      >
                        <span className="text-xl sm:text-2xl">{item.emoji}</span>
                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{selectedEmoji.emoji}</div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Thanks for your feedback!</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  You rated our page as "{selectedEmoji.label}". We appreciate your input!
                </p>
                <motion.div 
                  className="mt-3 sm:mt-4 text-[#5BB381] font-medium text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Achievement Unlocked</span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Career opportunities section - mobile optimized */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <section className="py-12 sm:py-20 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Animated background elements - simplified for mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0] 
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-[#7ECA9D]/20 to-purple-300/20 rounded-full blur-3xl"
            />
            
            <motion.div
              animate={{ 
                x: [0, 15, 0],
                y: [0, 10, 0] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -bottom-20 -left-20 w-56 sm:w-72 h-56 sm:h-72 bg-gradient-to-tr from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10 sm:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-3 sm:mb-4"
              >
                <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-[#7ECA9D]/20 text-[#5BB381] dark:text-[#7ECA9D] font-medium text-xs sm:text-sm">
                  <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                  Join Our Crew
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#5BB381] to-purple-600 dark:from-[#7ECA9D] dark:to-purple-400"
              >
                Level Up Your Career
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm sm:text-lg"
              >
                Join our team of education innovators and help shape the future of learning! 
                <span className="inline-block ml-2">🌟</span>
              </motion.p>
            </div>
            
            {/* HirePage component */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <HirePage />
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* Final CTA section - mobile optimized */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-indigo-950 dark:to-gray-900 relative overflow-hidden">
        {/* 3D floating objects - hidden on smallest screens */}
        <motion.div
          className="absolute right-10 top-10 text-3xl sm:text-4xl hidden sm:block"
          {...floatingAnimation}
        >
          🎮
        </motion.div>
        
        <motion.div
          className="absolute left-20 bottom-10 text-3xl sm:text-4xl hidden sm:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        >
          🎯
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-6 sm:p-8 md:p-12">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7ECA9D] to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                >
                  <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5BB381] to-purple-600">
                  Still Have Questions?
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
                  Our team is ready to help you discover all the amazing opportunities at Medh!
                </p>
                
                <motion.a
                  href="mailto:care@medh.co"
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#7ECA9D] to-purple-500 hover:from-purple-500 hover:to-[#7ECA9D] text-white font-medium rounded-full transition-all shadow-lg shadow-purple-500/20 active:scale-95 touch-manipulation text-sm sm:text-base"
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Email Our Team</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </motion.a>
                
                <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
                  {["twitter", "instagram", "tiktok", "youtube"].map((platform, i) => (
                    <motion.a
                      key={platform}
                      href="#"
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#7ECA9D]/20 hover:text-[#5BB381] dark:hover:bg-[#7ECA9D]/20 dark:hover:text-[#7ECA9D] transition-colors active:scale-90 touch-manipulation"
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                    >
                      <i className={`fab fa-${platform} text-base sm:text-lg`}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Animated wave footer */}
            <div className="h-12 sm:h-16 bg-gradient-to-r from-[#7ECA9D] to-purple-500 relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 10,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(240)'%3E%3Cstop offset='0' stop-color='%23ffffff' stop-opacity='0.4'/%3E%3Cstop offset='1' stop-color='%23ffffff' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='url(%23a)' cx='12' cy='12' r='12'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23b)'/%3E%3C/svg%3E\")",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Confetti overlay */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50" />
        )}
      </section>

      {/* Fixed mobile navigation shortcuts */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-[#5BB381] dark:text-[#7ECA9D] touch-manipulation"
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>

      {/* Footer credit - improved alignment */}
      <footer className="py-4 bg-white dark:bg-gray-900 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <p>Made with ✨ by Medh Team</p>
      </footer>
    </div>
  );
};

export default ContactMain;
