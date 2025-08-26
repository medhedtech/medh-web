"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Preloader from "@/components/shared/others/Preloader";
import Image from "next/image";
import LogIn from "@/assets/images/log-sign/logIn.png";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import Email from "@/assets/images/log-sign/Email.svg";
import lock from "@/assets/images/log-sign/lock.svg";
import CustomReCaptcha from '../../shared/ReCaptcha';

const schema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    tempPassword: yup.string().when("emailSent", {
      is: true,
      then: yup.string().required("Temporary password is required"),
    }),
    newPassword: yup.string().when("tempPasswordVerified", {
      is: true,
      then: yup
        .string()
        .min(8, "At least 8 characters required")
        .required("New password is required"),
    }),
    confirmPassword: yup.string().when("tempPasswordVerified", {
      is: true,
      then: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
  })
  .required();

const ForgotPassword = () => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [tempPasswordVerified, setTempPasswordVerified] = useState(false);
  const { postQuery, loading } = usePostQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaError(false);
  };

  const onSubmit = async (data) => {
    if (!emailSent) {
      // Step 1: Send temporary password email
      try {
        await postQuery({
          url: apiUrls?.user?.sendResetEmail,
          postData: {
            email: data?.email,
          },
          onSuccess: () => {
            showToast.success("Temporary password sent to your email.");
            setEmailSent(true);
            setRecaptchaError(false);
          },
          onFail: () => showToast.error("Failed to send temporary password."),
        });
      } catch {
        showToast.error("An error occurred while sending email.");
      }
    } else if (!tempPasswordVerified) {
      // Step 2: Verify temporary password
      try {
        await postQuery({
          url: apiUrls?.user?.verfiySystemPassword,
          postData: {
            email: data?.email,
            tempPassword: data?.tempPassword,
          },
          onSuccess: () => {
            showToast.success("Password verified.");
            setTempPasswordVerified(true);
          },
          onFail: () => showToast.error("Invalid password."),
        });
      } catch {
        showToast.error("An error occurred during verification.");
      }
    } else {
      // Step 3: Update to new password
      try {
        await postQuery({
          url: apiUrls?.user?.resetPassword,
          postData: {
            email: data?.email,
            newPassword: data?.newPassword,
            confirmPassword: data?.confirmPassword,
          },
          onSuccess: () => {
            showToast.success("Password reset successful!");
            router.push("/login");
          },
          onFail: () =>
            showToast.error(
              "New password and confirm password do not match. Please try again."
            ),
        });
      } catch {
        showToast.error(
          "Unable to reset password at the moment. Please try again later."
        );
      }
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="mx-auto md:flex md:justify-between h-auto max-w-[1064px] shadow-2xl border-2 p-5">
      <div className="hidden md:flex mx-auto">
        <div className="w-[504px] h-[774px] my-auto flex justify-center">
          <Image
            src={LogIn}
            alt="login-icon"
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
            <h1 className="font-Open font-semibold text-3xl">Reset Password</h1>
            <p className="text-[#545454] text-size-17">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="pt-6">
            {/* Email Field */}
            <div className="gap-4 mb-2">
              <div className="relative">
                <Image
                  src={Email}
                  alt="email-icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="E-Mail"
                  className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px] focus:ring-2 focus:ring-primaryColor"
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 font-normal mt-1 ml-2">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="my-4">
              <CustomReCaptcha
                onChange={handleRecaptchaChange}
                error={recaptchaError}
              />
            </div>
            {/* Temporary Password Field */}
            {emailSent && !tempPasswordVerified && (
              <div className="w-full mb-6">
                <div className="relative">
                  <Image
                    src={lock}
                    alt="lock-icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    {...register("tempPassword")}
                    type={showPassword ? "text" : "password"}
                    placeholder="System Generated Password"
                    className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </span>
                  {errors.tempPassword && (
                    <p className="text-xs text-red-500 font-normal mt-[3px] ml-2">
                      {errors.tempPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* New Password & Confirm Password Fields */}
            {tempPasswordVerified && (
              <>
                {/* New Password */}
                <div className="w-full mb-6">
                  <div className="relative">
                    <Image
                      src={lock}
                      alt="lock-icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    />
                    <input
                      {...register("newPassword")}
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                    />
                    {/* Toggle Icon */}
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </span>
                    {errors.newPassword && (
                      <p className="text-xs text-red-500 font-normal mt-[3px] ml-2">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="w-full mb-6">
                  <div className="relative">
                    <Image
                      src={lock}
                      alt="lock-icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                    />
                    {/* Toggle Icon */}
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </span>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 font-normal mt-[3px] ml-2">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="text-size-15 rounded-[150px] text-white bg-primaryColor px-25px py-10px w-full border-2 border-primaryColor hover:text-primaryColor hover:bg-white inline-block group"
            >
              {!emailSent
                ? "Send Password On Email"
                : !tempPasswordVerified
                ? "Verify System Generated Password"
                : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
