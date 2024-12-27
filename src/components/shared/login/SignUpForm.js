"use client";
import React, { useState } from "react";
import Image from "next/image";
import SignIn from "@/assets/images/log-sign/SignIn.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Name from "@/assets/images/log-sign/Name.svg";
import lock from "@/assets/images/log-sign/lock.svg";
import Email from "@/assets/images/log-sign/Email.svg";
import phone from "@/assets/images/log-sign/phone.svg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const schema = yup
  .object({
    full_name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone_number: yup
      .string()
      .min(10, "At least 10 digits required")
      .max(10, "Must be exactly 10 digits")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(8, "At least 8 characters required")
      .required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    agree_terms: yup
      .boolean()
      .oneOf([true], "You must accept the agree to proceed"),
  })
  .required();

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { postQuery, loading } = usePostQuery();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (data) => {
    // if (!recaptchaValue) {
    //   setRecaptchaError(true);
    //   return;
    // }
    setApiError(null);
    try {
      await postQuery({
        url: apiUrls?.user?.register,
        postData: {
          full_name: data?.full_name,
          email: data?.email,
          password: data?.password,
          phone_number: data?.phone_number,
          agree_terms: data?.agree_terms,
        },
        onSuccess: () => {
          setRecaptchaError(false);
          setRecaptchaValue(null);
          router.push("/login");
          toast.success("Registration successful!");
        },
        onFail: (error) => {
          console.log("Full error object:", error);

          const errorMessage = error?.response?.data?.message;
          if (!errorMessage) {
            toast.error("An unexpected error occurred.");
            setApiError("An unexpected error occurred.");
            return;
          }

          if (errorMessage === "User already exists") {
            toast.error(
              "This email is already registered. Please try logging in."
            );
          } else if (errorMessage.toLowerCase().includes("validation")) {
            toast.error("Please check your input fields and try again.");
          } else {
            toast.error("Registration failed. Please try again.");
          }
          setApiError(errorMessage);
        },
      });
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Preloader />;
  }

  const countries = [
    { name: "IN", code: "+91" },
    { name: "US", code: "+1" },
    { name: "UK", code: "+44" },
    // Add more countries as needed
  ];

  return (
    <div className="mx-auto md:flex md:justify-between p-5 h-auto max-w-[1064px] shadow-2xl border-2">
      <div className="hidden md:flex mx-auto">
        <div className="w-[504px] h-[774px] my-auto flex justify-center">
          <Image
            src={SignIn}
            alt="sign-up image"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="transition-opacity duration-150 ease-linear md:w-[50%] w-full md:px-3 pt-3">
        <div className="md:m-6 rounded-[10px] p-5">
          {/* heading */}
          <div className="w-[179px] mx-auto">
            <a href="/">
              <Image priority="false" src={logo1} alt="logo" className="py-2" />
            </a>
          </div>
          <div className="pt-11">
            <h1 className="font-Open font-semibold text-3xl">
              Getting Started!
            </h1>
            <p className="text-[#545454] text-base">
              Create an Account to see your content.
            </p>
          </div>

          <form
            className="pt-6"
            // data-aos="fade-up"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full mb-6 flex flex-col gap-4">
              <div className="relative">
                <Image
                  src={Name}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  alt="name-icon"
                />
                <input
                  {...register("full_name")}
                  type="text"
                  placeholder="Enter Your Name"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
                />
              </div>
              {errors.full_name && (
                <p className="text-xs text-red-500 font-normal mt-[-10px] ml-2">
                  {errors.full_name?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-6">
              <div className="relative">
                <Image
                  src={Email}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  alt="email-icon"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter Your E-Mail"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-normal mt-[3px] ml-2">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={phone}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  alt="phone-icon"
                />
                <input
                  {...register("phone_number")}
                  type="phone"
                  placeholder="Phone Number"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                />
              </div>
              {errors.phone_number && (
                <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                  {errors.phone_number?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={lock}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  alt="lock-icon"
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-12 pl-10 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                  {errors.password?.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={lock}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  alt="lock-icon"
                />
                <input
                  {...register("confirm_password")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-12 pl-10 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-[#000000] placeholder:opacity-80 font-medium  rounded-[12px]"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                  {errors.confirm_password?.message}
                </p>
              )}
            </div>

            <ReCAPTCHA
              sitekey="6LeNH5QqAAAAAO98HJ00v5yuCkLgHYCSvUEpGhLb"
              onChange={handleRecaptchaChange}
            />
            {/* ReCAPTCHA Error Message */}
            {recaptchaError && (
              <span className="text-red-500 text-[12px]">
                Please complete the ReCAPTCHA verification.
              </span>
            )}

            <div className="flex items-center cursor-pointer my-2">
              <input
                type="checkbox"
                id="terms"
                {...register("agree_terms")}
                className="w-6 h-6 mr-2 appearance-none border-2 border-gray-400 rounded-full cursor-pointer checked:bg-[#7ECA9D] checked:border-[#7ECA9D] checked:before:content-['✔'] checked:before:text-white checked:before:text-[12px] checked:before:flex checked:before:justify-center checked:before:items-center"
              />
              <label
                htmlFor="terms"
                className="text-xs text-[#545454] cursor-pointer"
              >
                Agree to <a href="/terms-and-conditions">Terms & Conditions</a>
              </label>
            </div>
            {errors.agree_terms && (
              <p className="text-red-500 text-xs ml-2 mt-[-5px]">
                {errors.agree_terms.message}
              </p>
            )}

            {/* API Error Display */}
            {apiError && (
              <p className="text-xs text-red-500 font-normal mt-1 ">
                {apiError}
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="text-size-15 rounded-[150px] text-whiteColor bg-primaryColor px-25px py-10px w-full border-2 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
              >
                SIGN UP
              </button>
            </div>

            <div className="flex justify-center mt-5 text-[#545454] gap-4 font-Open text-sm">
              <p>Already have an account? </p>
              <a href="/login" className="text-primaryColor font-semibold">
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
