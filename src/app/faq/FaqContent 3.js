"use client";
import React, { useEffect } from "react";
import Faq from "@/components/sections/faq/Faq";

const FaqContent = () => {
  // Set the document title when the component mounts
  useEffect(() => {
    document.title = "Frequently Asked Questions | MEDH - Education LMS Platform";
  }, []);

  return (
    <>
      {/* Page Title Section */}
      <section className="page-title-area">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title-content text-center pt-100px pb-100px">
                <h2 className="text-size-40 lg:text-size-50 text-blackColor dark:text-whiteColor font-medium leading-[1.3]">
                  Frequently Asked Questions
                </h2>
                <div className="breadcrumb-list">
                  <ul className="flex flex-wrap justify-center gap-12px items-center">
                    <li>
                      <a href="/" className="text-contentColor dark:text-contentColor-dark">
                        Home
                      </a>
                    </li>
                    <li className="text-primary relative before:content-['-'] before:absolute before:left-[-7px] before:top-0">
                      FAQ
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Component with Category Filters */}
      <Faq />
    </>
  );
};

export default FaqContent; 