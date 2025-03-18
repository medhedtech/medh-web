'use client';
import ContactBanner from "@/components/sections/contact/ContactBanner";
import ContactPrimary from "@/components/sections/contact/ContactPrimary";
import HirePage from "@/components/sections/hire/HirePage";
import Registration from "@/components/sections/registrations/Registration";
import React from "react";
import { MessageSquare, Sparkles, Star, Send, Rocket } from "lucide-react";
import Head from "next/head";

const ContactMain = () => {
  // Smooth scroll to the next section
  const scrollToNextSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 min-h-screen w-full pt-6 ">
      <Head>
        <title>Connect with Medh - Your Adventure Starts Here!</title>
        <meta name="description" content="Join the Medh adventure! Reach out to us for awesome learning experiences, cool courses, and fun educational opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      {/* Hero Section with Registration Form */}
      <section className="relative overflow-hidden min-h-[90vh] pt-6 sm:pt-10">
        {/* Static background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Static grid */}
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(126, 202, 157, 0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
          
          {/* Static gradient elements */}
          <div className="absolute top-1/4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-purple-300 to-indigo-300 dark:from-purple-600 dark:to-indigo-600 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-pink-300 to-orange-200 dark:from-pink-600 dark:to-orange-500 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-6 relative z-10">
          <div className="text-center mb-8">
            <div className="mb-3 sm:mb-4 inline-block">
              <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#7ECA9D]/20 to-purple-300/20 dark:from-[#7ECA9D]/30 dark:to-purple-600/30 text-[#5BB381] dark:text-[#7ECA9D] font-medium text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Begin Your Adventure
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7ECA9D] via-teal-500 to-purple-500 dark:from-[#7ECA9D] dark:via-teal-400 dark:to-purple-400">
                Say Hello to <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400">Medh!</span>
              </span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium px-2">
              <span className="inline-block">✨</span> Ready to join our epic learning adventure? Drop us a message and let's start something amazing!
            </p>
            
            {/* Static scroll indicator */}
            <div className="mt-6 sm:mt-10">
              <button 
                onClick={() => scrollToNextSection("contact-details")}
                className="group relative inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#7ECA9D] to-purple-500 text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 touch-manipulation"
              >
                <span className="relative z-10 text-sm sm:text-base">Begin Your Journey</span>
                <span className="relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12l4 4 4-4"/>
                    <path d="M12 8v8"/>
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-[#7ECA9D] opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 rounded-full" />
              </button>
            </div>
          </div>

          {/* Registration Card */}
          <div className="relative mx-auto max-w-4xl group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7ECA9D] via-purple-500 to-[#5BB381] rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-700"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
              {/* Static decorative elements */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 transform rotate-12 hidden sm:block">
                <span className="text-3xl">🚀</span>
              </div>
              
              <div className="absolute bottom-10 left-10 hidden sm:block">
                <span className="text-2xl">💌</span>
              </div>
              
              {/* Registration form */}
              <div id="registration-form" className="pb-2 sm:pb-0">
                <Registration pageTitle="contact_us" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact details section */}
      <div id="contact-details">
        <ContactPrimary />
      </div>

      {/* Career opportunities section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-[#7ECA9D]/20 text-[#5BB381] dark:text-[#7ECA9D] font-medium text-xs sm:text-sm">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                Join Our Crew
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#5BB381] to-purple-600 dark:from-[#7ECA9D] dark:to-purple-400">
              Level Up Your Career
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm sm:text-lg">
              Join our team of education innovators and help shape the future of learning! 
              <span className="inline-block ml-2">🌟</span>
            </p>
          </div>
          
          {/* HirePage component */}
          <div className="relative">
            <HirePage />
          </div>
        </div>
      </section>

      {/* Final CTA section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-indigo-950 dark:to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-12">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7ECA9D] to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5BB381] to-purple-600">
                  Still Have Questions?
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
                  Our team is ready to help you discover all the amazing opportunities at Medh!
                </p>
                
                <a
                  href="mailto:care@medh.co"
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#7ECA9D] to-purple-500 hover:from-purple-500 hover:to-[#7ECA9D] text-white font-medium rounded-full transition-all shadow-lg shadow-purple-500/20 active:scale-95 touch-manipulation text-sm sm:text-base"
                >
                  <span>Email Our Team</span>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                
                <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
                  {["twitter", "instagram", "tiktok", "youtube"].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#7ECA9D]/20 hover:text-[#5BB381] dark:hover:bg-[#7ECA9D]/20 dark:hover:text-[#7ECA9D] transition-colors"
                    >
                      <i className={`fab fa-${platform} text-base sm:text-lg`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Static wave footer */}
            <div className="h-12 sm:h-16 bg-gradient-to-r from-[#7ECA9D] to-purple-500 relative overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(240)'%3E%3Cstop offset='0' stop-color='%23ffffff' stop-opacity='0.4'/%3E%3Cstop offset='1' stop-color='%23ffffff' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='24' height='24' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='url(%23a)' cx='12' cy='12' r='12'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23b)'/%3E%3C/svg%3E\")",
                backgroundSize: "24px 24px",
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Static navigation button */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5BB381] dark:text-[#7ECA9D] border border-gray-200/50 dark:border-gray-700/50"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Static footer */}
      <footer className="py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="flex items-center justify-center gap-2">
          Made with ✨ by Medh Team
        </p>
      </footer>
    </div>
  );
};

export default ContactMain;
