'use client';
import ContactBanner from "@/components/sections/contact/ContactBanner";
import ContactPrimary from "@/components/sections/contact/ContactPrimary";
import HirePage from "@/components/sections/hire/HirePage";
import Registration from "@/components/sections/registrations/Registration";
import React from "react";
import { MessageSquare, Sparkles, Star, Send, Rocket, ArrowDown, Phone, Mail, MapPin } from "lucide-react";
import Head from "next/head";

interface IContactMainProps {}

const ContactMain: React.FC<IContactMainProps> = () => {
  // Smooth scroll to the next section
  const scrollToNextSection = (sectionId: string): void => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen w-full">
      <Head>
        <title>Contact Us - Medh | Professional Learning Solutions</title>
        <meta name="description" content="Connect with Medh for professional learning solutions. Get in touch with our expert team for courses, training, and educational opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 py-20 sm:py-24 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                <Phone className="w-4 h-4" />
                Get in Touch
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Start a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Conversation
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ready to advance your career with professional learning? Our expert team is here to guide you through the best educational opportunities tailored to your goals.
            </p>
            
            <button 
              onClick={() => scrollToNextSection("contact-form")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-1"
            >
              <span>Start Your Journey</span>
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Registration pageTitle="contact_us" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details Section */}
      <section id="contact-details" className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Other Ways to Reach Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the method that works best for you
            </p>
          </div>
          
          <ContactPrimary />
        </div>
      </section>

      {/* Career Opportunities Section */}
      <section className="py-20 sm:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                <Rocket className="w-4 h-4" />
                Join Our Team
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Career Opportunities
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join our team of education innovators and help shape the future of learning
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <HirePage />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Still Have Questions?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our dedicated team is ready to help you discover the perfect learning path for your career goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:care@medh.co"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Mail className="w-5 h-5" />
                Email Our Team
              </a>
              
              <a
                href="tel:+917701840696"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-blue-100 text-sm">
                Available Monday to Friday, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 dark:bg-gray-950 text-center text-sm text-gray-400">
        <div className="container mx-auto px-4">
          <p>© 2024 Medh. All rights reserved. | Made with ❤️ by Medh Team</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactMain;
