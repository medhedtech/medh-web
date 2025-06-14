"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, ArrowRight, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import CustomReCaptcha from '../../shared/ReCaptcha';

// TypeScript interfaces
interface IContactMethod {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
  description: string;
}

interface IFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  accept: boolean;
}

// Contact methods data
const contactMethods: IContactMethod[] = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    value: "care@medh.co",
    href: "mailto:care@medh.co",
    description: "Send us an email anytime"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    value: "+91 77108 96496",
    href: "tel:+917710896496",
    description: "Call us during business hours"
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "WhatsApp",
    value: "+91 77180 01580",
    href: "https://wa.me/917718001580",
    description: "Chat with us on WhatsApp"
  }
];

const ContactMain: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    accept: false
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);

  const isDark: boolean = mounted ? theme === 'dark' : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRecaptchaChange = (value: string | null): void => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Check if terms are accepted
    if (!formData.accept) {
      return;
    }

    // Check if reCAPTCHA is completed
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "", accept: false });
      setRecaptchaValue(null);
      setRecaptchaError(false);
    }, 3000);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            Get in Touch
          </div>

          {/* Main Heading */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Let's Start a{' '}
            <span className="relative">
              <span className="text-emerald-500">Conversation</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-emerald-200 dark:text-emerald-800"
                viewBox="0 0 100 12"
                fill="currentColor"
              >
                <path d="M0 8c30-6 70-6 100 0v4H0z" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className={`rounded-2xl p-8 shadow-sm border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h2 className={`text-2xl font-semibold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Send us a message
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Message Sent!
                    </h3>
                    <p className={`${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <div className="flex justify-center mt-8">
                      <CustomReCaptcha
                        onChange={handleRecaptchaChange}
                        error={recaptchaError}
                      />
                    </div>

                    <div className="flex items-start mt-6">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name="accept"
                          id="accept"
                          checked={formData.accept}
                          onChange={handleInputChange}
                          required
                          className="h-5 w-5 text-emerald-600 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500"
                        />
                      </div>
                      <label
                        htmlFor="accept"
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                      >
                        By submitting this form, I accept{' '}
                        <Link href="/terms-and-services">
                          <span className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                            Terms of Service
                          </span>
                        </Link>{" "}
                        &{" "}
                        <Link href="/privacy-policy">
                          <span className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                            Privacy Policy
                          </span>
                        </Link>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.accept || !recaptchaValue}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-8">
                <h2 className={`text-2xl font-semibold mb-8 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Get in touch
                </h2>

                <div className="space-y-6 mb-12">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.href}
                      className={`block p-6 rounded-xl border transition-all duration-200 hover:scale-105 group ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 hover:border-emerald-500'
                          : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                          {method.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold mb-1 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {method.title}
                          </h3>
                          <p className={`font-medium mb-1 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`}>
                            {method.value}
                          </p>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                                 {/* Company Information */}
                 <div className={`p-6 rounded-xl mb-6 ${
                   isDark ? 'bg-gray-800' : 'bg-gray-50'
                 }`}>
                   <h3 className={`font-semibold mb-3 ${
                     isDark ? 'text-white' : 'text-gray-900'
                   }`}>
                     Company Information
                   </h3>
                   <div className="space-y-3">
                     <div>
                       <p className={`font-medium ${
                         isDark ? 'text-emerald-400' : 'text-emerald-600'
                       }`}>
                         eSampark Tech Solutions Pvt Ltd
                       </p>
                     </div>
                     <div className="flex items-start gap-2">
                       <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                         isDark ? 'text-gray-400' : 'text-gray-500'
                       }`} />
                       <div>
                         <p className={`text-sm ${
                           isDark ? 'text-gray-300' : 'text-gray-600'
                         }`}>
                           Mumbai (Maharashtra)
                         </p>
                         <p className={`text-sm ${
                           isDark ? 'text-gray-300' : 'text-gray-600'
                         }`}>
                           Gurugram (Delhi NCR)
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Response Time */}
                 <div className={`p-6 rounded-xl ${
                   isDark ? 'bg-gray-800' : 'bg-gray-50'
                 }`}>
                   <h3 className={`font-semibold mb-3 ${
                     isDark ? 'text-white' : 'text-gray-900'
                   }`}>
                     Response Time
                   </h3>
                   <p className={`text-sm leading-relaxed ${
                     isDark ? 'text-gray-300' : 'text-gray-600'
                   }`}>
                     We typically respond to all inquiries within 24 hours during business days. 
                     For urgent matters, please call us directly.
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to get started?
          </h2>
          <p className={`text-lg mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of learners who have transformed their careers with Medh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactMain;
