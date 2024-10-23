import Image from "next/image";
import React from "react";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import PopupVideo from "@/components/shared/popup/PopupVideo";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const Registration = () => {
  return (
    // <<<<<<< HEAD
    // <section className="bg-register bg-cover bg-center bg-no-repeat ">
    // =======
    <section className="bg-register bg-cover bg-center bg-no-repeat  ">
      {/* >>>>>>> c211c4f62a5a819cc053b1367cb9374c87b7a304 */}
      {/* registration overlay  */}
      <div className="overlay bg-blueDark  bg-opacity-90 py-4 lg:pb-0 relative z-0  ">
        {/* animate icons  */}
        <div>
          <Image
            className="absolute top-40 left-0 lg:left-[8%] 2xl:top-20 animate-move-hor block z--1"
            src={registrationImage1}
            alt=""
          />
          <Image
            className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top animate-spin-slow block z--1"
            src={registrationImage2}
            alt=""
          />
          <Image
            className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] animate-move-var block z--1"
            src={registrationImage3}
            alt=""
          />
        </div>
        <div className="container">
          {/* about section   */}
          <div className="grid grid-cols-1 lg:grid-cols-12  gap-x-30px">
            {/* about left  */}
            <div
              className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7"
              data-aos="fade-up"
            >
              <div className="relative lg:my-36">
                {/* <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                  Registration
                </span> */}
                <h3 className="text-4xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px font-Poppins">
                  Ready to transform your skills and build a successful future?{" "}
                  {/* <span className="relative after:w-full after:h-[7px] after:bg-secondaryColor after:absolute after:left-0 after:bottom-2 md:after:bottom-4 z-0 after:z-[-1]">
                    Account
                  </span>{" "}
                  Get free access to{" "}
                  <span className="text-yellow1">60000 </span> online course */}
                </h3>
                <div className="flex gap-x-5 items-center">
                  <PopupVideo />

                  <div>
                    <p className="text-size-15 md:text-[22px] lg:text-lg 2xl:text-[22px] leading-6 md:leading-9 lg:leading-8 2xl:leading-9 font-semibold text-white">
                      Learn Something new & Build Your Career From Anywhere In
                      The World
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Subject right */}
            <div className="overflow-visible lg:col-start-8 lg:col-span-5 relative z-1 mb-4">
              <form
                className="p-35px bg-lightGrey10 dark:bg-lightGrey10-dark shadow-experience"
                data-aos="fade-up"
              >
                <h3 className="text-2xl text-[#F2277E] dark:text-blackColor-dark text-center font-semibold mb-5 font-inter">
                  Get In Touch
                </h3>

                <input
                  type="text"
                  placeholder="Your Name*"
                  className="w-full px-14px py-2 bg-lightGrey8 text-base border mb-1.5 border-gray-300"
                />
                <input
                  type="email"
                  placeholder="Your Email*"
                  className="w-full px-14px py-2 bg-lightGrey8 text-base mb-1.5 border border-gray-300"
                />

                {/* Phone Number Input with Country Dropdown */}
                <div className="flex mb-2">
                  <select className="w-1/4 px-2 py-2 bg-lightGrey8 border border-gray-300 mr-2 text-[#5C6574]">
                    <option value="">Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                  <input
                    type="tel"
                    placeholder="Your Phone Number*"
                    className="w-full px-14px py-2 bg-lightGrey8 text-base border border-gray-300"
                  />
                </div>

                <textarea
                  placeholder="Message"
                  className="w-full px-15px pb-3 pt-3 bg-lightGrey8 text-base mb-4 h-[155px] border border-gray-300"
                  cols="30"
                  rows="10"
                />
                <div className="flex items-start space-x-2 mb-12">
                  <input
                    type="checkbox"
                    id="accept"
                    name="accept"
                    className="w-4 h-4 text-[#5F2DED] border-gray-300 rounded mt-1 focus:ring-[#5F2DED]"
                  />
                  <label htmlFor="accept" className="text-sm text-gray-700">
                    By submitting this form, I accept
                    <span className="text-[#5F2DED] ml-1">
                      Terms of Service
                    </span>
                    & <br />
                    <span className="text-[#5F2DED]">Privacy Policy.</span>
                  </label>
                </div>
                <div className="-mb-6">
                  <button className="bg-[#F2277E] text-white px-6 py-2">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
