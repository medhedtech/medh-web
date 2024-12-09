"use client";
import Image from "next/image";
import React, { useState } from "react";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import PopupVideo from "@/components/shared/popup/PopupVideo";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

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
  resume_image: yup.string(),
});

const Registration = ({ showUploadField = false, pageTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const [fileName, setFileName] = useState("No file chosen");
  const [pdfBrochure, setPdfBrochure] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      showUploadField,
    },
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result;
          const postData = { base64String: base64 };

          await postQuery({
            url: apiUrls?.upload?.uploadDocument,
            postData,
            onSuccess: (data) => {
              console.log("PDF uploaded successfully!");
              setPdfBrochure(data?.data);
            },
            onError: () => {
              console.log("PDF upload failed. Please try again.");
            },
          });
        };
      } catch (error) {
        console.log("Error uploading PDF. Please try again.");
      }
    } else {
      setFileName("No file chosen");
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Prepare the postData to send
      const postData = {
        full_name: data.full_name,
        country: data.country,
        email: data.email,
        phone_number: data.phone_number,
        message: data.message,
        accept: data.accept,
        page_title: pageTitle, 
      };

      // Add resume_image if pdfBrochure is available
      if (pdfBrochure) {
        postData.resume_image = pdfBrochure;
      }

      await postQuery({
        url: apiUrls?.Contacts?.createContact,
        postData,
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

  return (
    <>
      <section
        id="courses-section"
        className="bg-register bg-cover bg-center bg-no-repeat"
      >
        {/* background: #7ECA9DEE; */}

        <div className="overlay bg-gray-600 bg-opacity-90 py-4 lg:pb-0 relative z-0">
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
                    Ready to transform your skills and build a successful
                    future?
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
              <div className="overflow-visible lg:col-start-8 lg:col-span-11 relative z-1 mb-4">
                <div className="bg-[#7ECA9D] p-2 w-full">
                  <h3 className="text-2xl mt-4 text-white dark:text-white-dark text-center font-semibold mb-5 font-inter">
                    Get In Touch
                  </h3>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="py-[35px] px-4 bg-white dark:bg-white-dark shadow-experience"
                  data-aos="fade-up"
                >
                  <input
                    {...register("full_name")}
                    type="text"
                    placeholder="Your Name*"
                    className="w-full px-14px py-2 dark:bg-inherit bg-white text-base border mb-1.5 border-gray-300"
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
                    className="w-full px-14px py-2 dark:bg-inherit bg-white text-base mb-1.5 border border-gray-300"
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}

                  {/* Phone Number Input with Country Dropdown */}
                  <div className="flex flex-col lg:flex-row mb-2 gap-4">
                    <div className="w-full lg:w-2/6">
                      <select
                        {...register("country")}
                        className="w-full px-2 py-2 dark:bg-inherit bg-white border border-gray-300 text-[#5C6574]"
                      >
                        <option value="IN">IN (+91)</option>
                        <option value="AUS">AUS (+61)</option>
                        <option value="CA">CA (+1)</option>
                        <option value="SGP">SGP (+65) </option>
                        <option value="UAE">UAE (+971)</option>
                        <option value="UK">Uk (+44) </option>
                      </select>
                    </div>

                    <div className="w-full lg:w-3/4">
                      <input
                        {...register("phone_number")}
                        type="tel"
                        placeholder="Your Phone Number*"
                        className="w-full px-14px py-3 dark:bg-inherit bg-white text-base border border-gray-300"
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
                    className="w-full px-15px pb-3 pt-3 dark:bg-inherit bg-white text-base mb-4 h-[155px] border border-gray-300"
                    cols="30"
                    rows="10"
                  />
                  {errors.message && (
                    <span className="text-red-500">
                      {errors.message.message}
                    </span>
                  )}

                  {showUploadField && (
                    <>
                      <h2 className="text-[1rem] font-bold font-Poppins text-[#000000D9] dark:text-white">
                        Upload Job Description*
                      </h2>
                      <div className="w-full">
                        <label
                          htmlFor="fileInput"
                          className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer w-full text-gray-700 dark:text-white"
                        >
                          <FaCamera className="text-gray-500" />
                          {fileName}
                        </label>
                        <input
                          {...register("resume_image")}
                          id="fileInput"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handlePdfUpload}
                        />
                      </div>
                    </>
                  )}

                  <ReCAPTCHA
                    sitekey="6LeNH5QqAAAAAO98HJ00v5yuCkLgHYCSvUEpGhLb"
                    onChange={handleRecaptchaChange}
                  />

                  <div className="flex items-start space-x-2 mt-4 mb-12">
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
                      <Link href="/terms-and-services">
                        <span className="text-[#7ECA9D] ml-1">
                          Terms of Service
                        </span>
                      </Link>{" "}
                      &{" "}
                      <Link href="/privacy-policy">
                        <span className="text-[#7ECA9D]">Privacy Policy.</span>
                      </Link>
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
                      className="bg-[#7ECA9D] rounded-[2px] text-white px-6 py-2"
                    >
                      {loading ? "Loading..." : "Submit"}
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

export default Registration;
