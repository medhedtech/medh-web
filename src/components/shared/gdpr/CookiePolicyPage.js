"use client";

import React from 'react';
// import BreadcrumbOne from '@/components/shared/breadcrumb/BreadcrumbOne';
// import FooterOne from '@/components/layout/footer/FooterOne';
import CookieSettings from './CookieSettings';
// import HeaderOne from '@/components/layout/header/HeaderOne';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <CookieConsentProvider>
      <Header styles="header-style-1" />
      
      {/* Simple Breadcrumb */}
      <div className="bg-gray-100 dark:bg-gray-900 py-6 pt-20">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-[#7ECA9D] text-center">Cookie Policy</h1>
            </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <section className="mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This Cookie Policy explains how MEDH ("we", "us", or "our") uses cookies and similar technologies
                on our website. This policy is designed to help you understand what cookies are, how we use them,
                and the choices you have regarding their use.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                What Are Cookies?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used
                to make websites work more efficiently and provide information to the website owners. Cookies can be "persistent"
                or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are
                deleted as soon as you close your web browser.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How We Use Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">We use cookies for several purposes:</p>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li className="mb-2">
                  <strong>Necessary Cookies:</strong> These cookies are essential for the website to function properly.
                  They enable basic functions like page navigation and access to secure areas of the website.
                </li>
                <li className="mb-2">
                  <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website
                  by collecting and reporting information anonymously. This helps us improve our website.
                </li>
                <li className="mb-2">
                  <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites.
                  The intention is to display ads that are relevant and engaging to the individual user.
                </li>
                <li className="mb-2">
                  <strong>Preferences Cookies:</strong> These cookies enable the website to remember your preferences
                  and choices you make on the website, such as your preferred language or region.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Third-Party Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics
                of the website, deliver advertisements on and through the website, and so on.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Your Cookie Choices
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Most web browsers allow you to control cookies through their settings preferences. However,
                if you limit the ability of websites to set cookies, you may impact your overall user experience.
                To find out more about cookies, including how to see what cookies have been set and how to manage and
                delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.allaboutcookies.org</a>.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Managing Your Cookie Preferences
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You can manage your cookie preferences at any time by using our cookie settings panel below.
                This allows you to select which categories of cookies you accept or reject. Please note that
                essential cookies cannot be rejected as they are necessary for the website to function properly.
              </p>
            </section>
          </div>
          
          {/* Cookie Settings Component */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Manage Cookie Preferences
            </h2>
            <CookieSettings />
          </div>
          
          {/* Additional Information */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 sm:p-8 mb-8">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Changes to Our Cookie Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting
                the new Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have any questions about our Cookie Policy, please contact us at <a href="mailto:care@medh.co" className="text-primary-600 hover:text-primary-700 transition-colors">care@medh.co</a>.
              </p>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </CookieConsentProvider>
  );
};

export default CookiePolicyPage; 