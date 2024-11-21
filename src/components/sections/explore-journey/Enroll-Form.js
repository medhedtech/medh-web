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

// Validation schema using yup
const schema = yup.object({
  full_name: yup.string().required("Name is required."),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required."),
  country: yup.string().nullable(),
  phone_number: yup.string().required("Please enter mobile number"),
  course_category: yup.string().required("Please select category"),
  course_type: yup.string().required("Please select course type"),
  message: yup.string().required("Please enter the message"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

const ExploreJourney = ({ mainText, subText }) => {
  const { postQuery, loading } = usePostQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.enrollWebsiteform?.createEnrollWebsiteForm,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: data?.phone_number,
          course_category: data?.course_category,
          course_type: data?.course_type,
          message: data?.message,
          accept: data?.accept,
        },
        onSuccess: () => {
          toast.success("Form submitted successfully!");
          reset({
            full_name: "",
            email: "",
            country: "",
            phone_number: "",
            course_category: "",
            course_type: "",
            message: "",
            accept: "",
          });
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
    <section
      id="enroll-section"
      className="bg-register bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-[#7ECA9D] overlay bg-opacity-90 py-4 lg:pb-0 relative z-0">
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
          <div className="grid grid-cols-1 lg:grid-cols-14 gap-x-30px">
            <div
              className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7"
              data-aos="fade-up"
            >
              <div className="relative lg:my-36">
                <h3 className="text-4xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px font-Poppins">
                  {/* Transform Your Career. Explore Your Journey in AI and Data
                  Science. */}
                  {mainText}
                </h3>
              </div>
            </div>
            {/* Form Section */}
            <div className="overflow-visible w-[600px] lg:col-start-8 lg:col-span-5 relative z-1 mb-4">
              <h3 className="text-3xl bg-[#7ECA9D] text-[#FFFFFF] dark:text-blackColor-dark py-6 text-center font-semibold font-inter">
                {/* Enroll Now ! */}
                {subText}
              </h3>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-[35px] bg-lightGrey10 dark:bg-lightGrey10-dark shadow-experience"
                data-aos="fade-up"
              >
                <div className="flex gap-4">
                  <div className="flex-col w-full">
                    <input
                      {...register("full_name")}
                      type="text"
                      placeholder="Your Name*"
                      className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-1.5 border border-gray-300"
                    />
                    {errors.full_name && (
                      <span className="text-red-500">
                        {errors.full_name.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-col w-full">
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Your Email*"
                      className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-1.5 border border-gray-300"
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
                  <div className="w-full lg:w-1/3">
                    <select
                      {...register("country")}
                      className="w-full px-2 py-2 dark:bg-inherit bg-lightGrey8 border border-gray-300 text-[#5C6574]"
                    >
                      <option value="">Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div className="w-full lg:w-3/4">
                    <input
                      {...register("phone_number")}
                      type="tel"
                      placeholder="Your Phone Number*"
                      className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base border border-gray-300"
                    />
                  </div>
                </div>
                {(errors.country || errors.phone_number) && (
                  <div className="text-red-500">
                    {errors.country?.message || errors.phone_number?.message}
                  </div>
                )}

                <div className="flex gap-4">
                  <select
                    {...register("course_category")}
                    type="text"
                    className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base border mb-1.5 border-gray-300"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Personality Development">
                      Personality Development
                    </option>
                    <option value="Vedic Mathematics">Vedic Mathematics</option>
                    <option value="Digital Marketing & Data Analytics">
                      Digital Marketing & Data Analytics
                    </option>
                  </select>
                  {errors.course_category && (
                    <span className="text-red-500">
                      {errors.course_category.message}
                    </span>
                  )}

                  {/* Second Select: Three options */}
                  <select
                    {...register("course_type")}
                    type="text"
                    placeholder="Select Course Type"
                    className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-1.5 border border-gray-300"
                  >
                    <option disabled value="">
                      Select Course Type
                    </option>
                    <option value="option1">Foundation Certificate</option>
                    <option value="option2">Advanced Certificate</option>
                    <option value="option3">Executive Certificate</option>
                  </select>
                  {errors.course_type && (
                    <span className="text-red-500">
                      {errors.course_type.message}
                    </span>
                  )}
                </div>

                <textarea
                  {...register("message")}
                  placeholder="Message"
                  type="text"
                  className="w-full px-15px pb-3 pt-3 dark:bg-inherit bg-lightGrey8 text-base mb-4 h-[125px] border border-gray-300"
                  cols="30"
                  rows="16"
                />
                {errors.message && (
                  <span className="text-red-500">{errors.message.message}</span>
                )}

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
                    <span className="text-[#7ECA9D] ml-1">
                      Terms of Service{" "}
                    </span>
                    & <span className="text-[#7ECA9D]">Privacy Policy.</span>
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
  );
};

export default ExploreJourney;
