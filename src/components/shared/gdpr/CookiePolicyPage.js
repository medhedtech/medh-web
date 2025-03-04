"use client";

import React from 'react';
// import BreadcrumbOne from '@/components/shared/breadcrumb/BreadcrumbOne';
// import FooterOne from '@/components/layout/footer/FooterOne';
import CookieSettings from './CookieSettings';
// import HeaderOne from '@/components/layout/header/HeaderOne';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';

const CookiePolicyPage = () => {
  return (
    <CookieConsentProvider>
      <div className="sticky-header">
        <div id="main-wrapper" className="main-wrapper">
          <Header styles="header-style-1" />
          {/* BreadcrumbOne component replaced with simple heading */}
          <div className="edu-breadcrumb-area">
            <div className="container">
              <div className="breadcrumb-inner">
                <div className="page-title">
                  <h1 className="title">Cookie Policy</h1>
                </div>
                <ul className="edu-breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="separator"><i className="icon-angle-right"></i></li>
                  <li className="breadcrumb-item active" aria-current="page">Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="edu-privacy-policy-area edu-section-gap bg-color-white">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="privacy-policy mb-5">
                    <h4 className="text-xl font-bold mb-4">Cookie Policy for MEDH</h4>
                    <p className="mb-4">
                      This Cookie Policy explains how MEDH ("we", "us", or "our") uses cookies and similar technologies
                      on our website. This policy is designed to help you understand what cookies are, how we use them,
                      and the choices you have regarding their use.
                    </p>
                    
                    <h5 className="text-lg font-bold mt-6 mb-3">What Are Cookies?</h5>
                    <p className="mb-4">
                      Cookies are small text files that are placed on your device when you visit a website. They are widely used
                      to make websites work more efficiently and provide information to the website owners. Cookies can be "persistent"
                      or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are
                      deleted as soon as you close your web browser.
                    </p>
                    
                    <h5 className="text-lg font-bold mt-6 mb-3">How We Use Cookies</h5>
                    <p className="mb-2">We use cookies for several purposes:</p>
                    <ul className="list-disc pl-6 mb-4">
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
                    
                    <h5 className="text-lg font-bold mt-6 mb-3">Third-Party Cookies</h5>
                    <p className="mb-4">
                      In addition to our own cookies, we may also use various third-party cookies to report usage statistics
                      of the website, deliver advertisements on and through the website, and so on.
                    </p>
                    
                    <h5 className="text-lg font-bold mt-6 mb-3">Your Cookie Choices</h5>
                    <p className="mb-4">
                      Most web browsers allow you to control cookies through their settings preferences. However,
                      if you limit the ability of websites to set cookies, you may impact your overall user experience.
                      To find out more about cookies, including how to see what cookies have been set and how to manage and
                      delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
                    </p>
                    
                    <h5 className="text-lg font-bold mt-6 mb-3">Managing Your Cookie Preferences</h5>
                    <p className="mb-4">
                      You can manage your cookie preferences at any time by using our cookie settings panel below.
                      This allows you to select which categories of cookies you accept or reject. Please note that
                      essential cookies cannot be rejected as they are necessary for the website to function properly.
                    </p>
                  </div>
                  
                  <div className="cookie-settings-wrapper my-10">
                    <h4 className="text-xl font-bold mb-6 text-center">Manage Cookie Preferences</h4>
                    <CookieSettings />
                  </div>
                  
                  <div className="additional-info mt-8">
                    <h5 className="text-lg font-bold mb-3">Changes to Our Cookie Policy</h5>
                    <p className="mb-4">
                      We may update our Cookie Policy from time to time. We will notify you of any changes by posting
                      the new Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
                    </p>
                    
                    <h5 className="text-lg font-bold mt-6 mb-3">Contact Us</h5>
                    <p className="mb-4">
                      If you have any questions about our Cookie Policy, please contact us at <a href="mailto:privacy@medh.co" className="text-blue-600 hover:underline">privacy@medh.co</a>.
                    </p>
                    
                    <p className="text-sm text-gray-600 mt-8">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </CookieConsentProvider>
  );
};

export default CookiePolicyPage; 