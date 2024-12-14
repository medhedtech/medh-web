"use client";
import Image from "next/image";
import React, { useState } from "react";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import { FaTimes } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import countriesData from "@/utils/countrycode.json";

// Validation schema using yup
const schema = yup.object({
  full_name: yup.string().required("Name is required."),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required."),
  country: yup.string().nullable(),
  phone_number: yup
    .string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
      const { country } = this.parent;

      if (!value || !country) return false;

      // Ensure the phone number has exactly 10 digits
      const isValidLength = /^\d{10}$/.test(value);
      if (!isValidLength) return false;

      // Validate full phone number with country code
      const selectedCountry = countriesData.find((c) => c.name === country);
      if (!selectedCountry) return false;

      const phoneWithCountryCode = selectedCountry.dial_code + value;
      const phoneRegex = /^\+[1-9]\d{1,14}$/;

      return phoneRegex.test(phoneWithCountryCode);
    }),
  designation: yup.string().required("Designation is required"),
  company_name: yup.string().required("Company name is required"),
  company_website: yup
    .string()
    .matches(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*$/,
      "Invalid website URL"
    )
    .required("Website is required"),
  message: yup.string().required("Please enter the message"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});
const CorporateJourneyForm = ({ mainText, subText }) => {
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const selectedCountry = countriesData.find(
        (country) => country.name === data.country
      );
      await postQuery({
        url: apiUrls?.Corporate?.addCorporate,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: selectedCountry.dial_code + data?.phone_number,
          company_name: data?.company_name,
          designation: data?.designation,
          company_website: data?.company_website,
          message: data?.message,
          accept: data?.accept,
        },
        onSuccess: () => {
          // toast.success("Form submitted successfully!");
          setShowModal(true);

          // Reset the form fields after a successful submission
          reset();
        },
        onFail: () => {
          toast.error("Error submitting form.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <section
        id="enroll-section"
        className="bg-register bg-cover bg-center bg-no-repeat"
      >
        <div className="bg-gray-600 overlay bg-opacity-90 py-4 lg:pb-0 relative z-0">
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
            <div className="grid grid-cols-1 lg:grid-cols-14 gap-x-30px justify-items-center">
              <div
                className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7"
                data-aos="fade-up"
              >
                <div className="relative lg:my-48">
                  <h3 className="text-4xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px font-Poppins">
                    {mainText}
                  </h3>
                </div>
              </div>
              {/* Form Section */}
              <div className="overflow-visible w-[90vw] sm:w-[600px]  lg:col-start-8 lg:col-span-5 relative z-1 mb-4">
                <h3 className="text-3xl bg-[#7ECA9D] text-[#FFFFFF] dark:text-blackColor-dark py-6 text-center font-semibold font-inter">
                  {subText}
                </h3>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-[35px] bg-lightGrey10 dark:bg-lightGrey10-dark shadow-experience"
                  data-aos="fade-up"
                >
                  <div className="flex gap-4 flex-col md:flex-row mb-2.5">
                    <div className="flex-col w-full">
                      <input
                        {...register("full_name")}
                        type="text"
                        placeholder="Your Name*"
                        className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-0 sm:mb-1.5 border border-gray-300"
                      />
                      {errors.full_name && (
                        <span className="text-red-500">
                          {errors.full_name.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-col w-full mb-1.5 sm:mb-0">
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Your Email*"
                        className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base sm:mb-1.5 mb-0 border border-gray-300"
                      />
                      {errors.email && (
                        <span className="text-red-500">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone Number Input with Country Dropdown */}
                  <div className="flex flex-col lg:flex-row mb-2 gap-4">
                    <div className="w-full lg:w-2/6">
                      <select
                        {...register("country")}
                        className="w-full text-sm px-2 py-2 dark:bg-inherit bg-lightGrey8 border border-gray-300 text-[#5C6574] max-h-48 overflow-y-auto"
                      >
                        {countriesData.map((country) => {
                          const countryName =
                            country.name.length > 10
                              ? country.name.slice(0, 10) + "..."
                              : country.name;
                          return (
                            <option key={country.code} value={country.name}>
                              {countryName} ({country.dial_code})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="w-full lg:w-3/4">
                      <input
                        {...register("phone_number")}
                        type="tel"
                        placeholder="Your Phone Number*"
                        className="w-full px-14px py-3  dark:bg-inherit bg-lightGrey8 text-base border border-gray-300"
                      />
                    </div>
                  </div>
                  {/* Error Message */}
                  {(errors.country || errors.phone_number) && (
                    <div className="text-red-500">
                      {errors.country?.message || errors.phone_number?.message}
                    </div>
                  )}

                  <div className="flex gap-4 flex-col md:flex-row mb-2.5">
                    <div className="flex-col w-full">
                      <input
                        {...register("designation")}
                        type="text"
                        placeholder="Designation*"
                        className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-0 sm:mb-1.5 border border-gray-300"
                      />
                      {errors.designation && (
                        <span className="text-red-500">
                          {errors.designation.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-col w-full mb-1.5 sm:mb-0">
                      <input
                        {...register("company_name")}
                        type="text"
                        placeholder="Company Name*"
                        className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base sm:mb-1.5 mb-0 border border-gray-300"
                      />
                      {errors.company_name && (
                        <span className="text-red-500">
                          {errors.company_name.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-col w-full mb-1.5 sm:mb-0">
                    <input
                      {...register("company_website")}
                      type="text"
                      placeholder="Website*"
                      className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-0 border border-gray-300"
                    />
                    {errors.company_website && (
                      <span className="text-red-500">
                        {errors.company_website.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <textarea
                      {...register("message")}
                      placeholder="Message*"
                      className="w-full h-[100px] dark:bg-inherit bg-lightGrey8 text-base px-14px py-2 mb-4 border border-gray-300"
                    ></textarea>
                    {errors.message && (
                      <span className="text-red-500">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  <ReCAPTCHA
                    sitekey="6LeNH5QqAAAAAO98HJ00v5yuCkLgHYCSvUEpGhLb"
                    onChange={handleRecaptchaChange}
                  />

                  <div className="flex items-start space-x-2 mb-12">
                    <input
                      {...register("accept")}
                      type="checkbox"
                      id="accept"
                      className="w-6 h-6 text-[#7ECA9D] border-gray-300 rounded mt-1 focus:ring-[#7ECA9D]"
                    />
                    <label
                      htmlFor="accept"
                      className="text-[16px] text-gray-700 dark:text-gray-300"
                    >
                      By submitting this form, I accept
                      <a href="/terms-and-services">
                        <span className="text-[#7ECA9D] ml-1">
                          Terms of Service
                        </span>
                      </a>{" "}
                      &{" "}
                      <a href="/privacy-policy">
                        <span className="text-[#7ECA9D]">Privacy Policy.</span>
                      </a>
                    </label>
                  </div>
                  {errors.accept && (
                    <span className="text-red-500 mt-[-20px]">
                      {errors.accept.message}
                    </span>
                  )}

                  <div className="-mb-4">
                    <button
                      type="submit"
                      className="bg-[#7ECA9D] rounded-[4px] text-white px-6 py-2 transition-all duration-300 ease-in-out hover:bg-[#5fb786] hover:shadow-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-lg md:text-[28px] font-semibold text-green-500">
                🎉 Success!
              </h2>
              <p className="text-gray-700 mt-2">
                Your form has been submitted successfully!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CorporateJourneyForm;
