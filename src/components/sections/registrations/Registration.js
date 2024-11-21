"use client";
import Image from "next/image";
import React, { useState } from "react";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import PopupVideo from "@/components/shared/popup/PopupVideo";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import usePostQuery from "@/hooks/postQuery.hook";
import Preloader from "@/components/shared/others/Preloader";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema using yup
const schema = yup.object({
  full_name: yup.string().required("Name is required."),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required."),
  country: yup.string().nullable(),
  phone_number: yup.string().required("Please enter mobile number"),
  message: yup.string().required("Please enter the message"),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

const Registration = () => {
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
        url: apiUrls?.Contacts?.createContact,
        postData: {
          full_name: data.full_name,
          country: data.country,
          email: data.email,
          phone_number: data.phone_number,
          message: data.message,
          accept: data.accept,
        },
        onSuccess: () => {
          toast.success("Form submitted successfully!");
          reset({
            full_name: "",
            email: "",
            country: "",
            phone_number: "",
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
      id="courses-section"
      className="bg-register bg-cover bg-center bg-no-repeat"
    >
      {/* background: #7ECA9DEE; */}

      <div className="overlay bg-[#7ECA9DEE] bg-opacity-90 py-4 lg:pb-0 relative z-0">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px">
            <div
              className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7"
              data-aos="fade-up"
            >
              <div className="relative lg:my-36">
                <h3 className="text-4xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px font-Poppins">
                  Ready to transform your skills and build a successful future?
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
            {/* Form Section */}
            <div className="overflow-visible lg:col-start-8 lg:col-span-5 relative z-1 mb-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-35px bg-lightGrey10 dark:bg-lightGrey10-dark shadow-experience"
                data-aos="fade-up"
              >
                <h3 className="text-2xl text-[#F6B335] dark:text-blackColor-dark text-center font-semibold mb-5 font-inter">
                  Get In Touch
                </h3>

                <input
                  {...register("full_name")}
                  type="text"
                  placeholder="Your Name*"
                  className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base border mb-1.5 border-gray-300"
                />
                {errors.full_name && (
                  <span className="text-red-500">
                    {errors.full_name.message}
                  </span>
                )}

                <input
                  {...register("email")}
                  type="email"
                  placeholder="Your Email*"
                  className="w-full px-14px py-2 dark:bg-inherit bg-lightGrey8 text-base mb-1.5 border border-gray-300"
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}

                {/* Phone Number Input with Country Dropdown */}
                <div className="flex flex-col lg:flex-row mb-2 gap-4">
                  <div className="w-full lg:w-1/4">
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

                <textarea
                  {...register("message")}
                  placeholder="Message"
                  className="w-full px-15px pb-3 pt-3 dark:bg-inherit bg-lightGrey8 text-base mb-4 h-[155px] border border-gray-300"
                  cols="30"
                  rows="10"
                />
                {errors.message && (
                  <span className="text-red-500">{errors.message.message}</span>
                )}

                <div className="flex items-start space-x-2 mb-12">
                  <input
                    {...register("accept")}
                    type="checkbox"
                    id="accept"
                    className="w-4 h-4 text-[#7ECA9D] border-gray-300 rounded mt-1 focus:ring-[#7ECA9D]"
                  />
                  <label
                    htmlFor="accept"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    By submitting this form, I accept
                    <span className="text-[#7ECA9D] ml-1">
                      Terms of Service {" "}
                    </span>
                    & <br />
                    <span className="text-[#7ECA9D]">Privacy Policy.</span>
                  </label>
                </div>
                {errors.accept && (
                  <span className="text-red-500 mt-[-20px]">
                    {errors.accept.message}
                  </span>
                )}

                <div className="-mb-6">
                  <button
                    type="submit"
                    className="bg-[#F6B335] text-white px-6 py-2"
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

export default Registration;
