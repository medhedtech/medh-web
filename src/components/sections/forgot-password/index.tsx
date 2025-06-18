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

// Define form data interface
interface IForgotPasswordFormData {
  email: string;
  tempPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Define validation schema with TypeScript
const schema = yup
  .object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    tempPassword: yup.string().when('emailSent', {
      is: (val: boolean) => val === true,
      then: (schema) => schema.required("Temporary password is required"),
      otherwise: (schema) => schema.optional(),
    }),
    newPassword: yup.string().when('tempPasswordVerified', {
      is: (val: boolean) => val === true,
      then: (schema) => schema
        .min(8, "At least 8 characters required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("New password is required"),
      otherwise: (schema) => schema.optional(),
    }),
    confirmPassword: yup.string().when('tempPasswordVerified', {
      is: (val: boolean) => val === true,
      then: (schema) => schema
        .oneOf([yup.ref('newPassword')], "Passwords must match")
        .required("Confirm password is required"),
      otherwise: (schema) => schema.optional(),
    }),
  })
  .required();

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [tempPasswordVerified, setTempPasswordVerified] = useState<boolean>(false);
  const { postQuery, loading } = usePostQuery();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [recaptchaError, setRecaptchaError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IForgotPasswordFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch form values for conditional validation
  const emailValue = watch("email");

  const handleRecaptchaChange = (value: string | null): void => {
    setRecaptchaError(!value);
  };

  const onSubmit = async (data: IForgotPasswordFormData): Promise<void> => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (!emailSent) {
        // Step 1: Send temporary password email
        await postQuery({
          url: apiUrls?.user?.sendResetEmail,
          postData: {
            email: data.email,
          },
          onSuccess: () => {
            showToast.success("Temporary password sent to your email.");
            setEmailSent(true);
            setRecaptchaError(false);
            // Redirect to login page after successfully sending the email
            router.push("/login");
          },
          onFail: (error) => {
            showToast.error(error?.message || "Failed to send temporary password.");
          },
        });
      } else if (!tempPasswordVerified) {
        // Step 2: Verify temporary password
        await postQuery({
          url: apiUrls?.user?.verfiySystemPassword,
          postData: {
            email: data.email,
            tempPassword: data.tempPassword,
          },
          onSuccess: () => {
            showToast.success("Password verified.");
            setTempPasswordVerified(true);
          },
          onFail: (error) => {
            showToast.error(error?.message || "Invalid password.");
          },
        });
      } else {
        // Step 3: Update to new password
        await postQuery({
          url: apiUrls?.user?.resetPassword,
          postData: {
            email: data.email,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
          onSuccess: () => {
            showToast.success("Password reset successful!");
            router.push("/login");
          },
          onFail: (error) => {
            showToast.error(
              error?.message || "New password and confirm password do not match. Please try again."
            );
          },
        });
      }
    } catch (error) {
      showToast.error(
        "An error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when email changes
  React.useEffect(() => {
    if (emailValue && emailSent) {
      setEmailSent(false);
      setTempPasswordVerified(false);
      setValue("tempPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    }
  }, [emailValue, emailSent, setValue]);

  if (loading) return <Preloader />;

  return (
    <div className="mx-auto md:flex md:justify-between h-auto max-w-[1064px] shadow-2xl border-2 p-5">
      <div className="hidden md:flex mx-auto">
        <div className="w-[504px] h-[774px] my-auto flex justify-center">
          <Image
            src={LogIn}
            alt="login-icon"
            className="w-full h-full object-contain"
            priority={false}
          />
        </div>
      </div>
      <div className="transition-opacity duration-150 ease-linear md:w-[50%] w-full md:px-3 pt-3">
        <div className="md:m-6 rounded-[10px] p-5">
          {/* heading */}
          <div className="w-[179px] mx-auto">
            <a href="/" aria-label="Go to homepage">
              <Image priority={false} src={logo1} alt="Medh logo" className="py-2" />
            </a>
          </div>
          <div className="pt-11">
            <h1 className="font-Open font-semibold text-3xl">Reset Password</h1>
            <p className="text-[#545454] text-size-17">
              {!emailSent 
                ? "Enter your email address to receive a password reset link."
                : !tempPasswordVerified
                ? "Enter the temporary password sent to your email."
                : "Create a new password for your account."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="pt-6">
            {/* Email Field */}
            <div className="gap-4 mb-2">
              <div className="relative">
                <Image
                  src={Email}
                  alt=""
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="E-Mail"
                  aria-label="Email address"
                  disabled={emailSent && !tempPasswordVerified}
                  className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px] focus:ring-2 focus:ring-primaryColor disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 font-normal mt-1 ml-2" role="alert">
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
                    alt=""
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    {...register("tempPassword")}
                    type={showPassword ? "text" : "password"}
                    placeholder="System Generated Password"
                    aria-label="Temporary password"
                    className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                  {errors.tempPassword && (
                    <p className="text-xs text-red-500 font-normal mt-[3px] ml-2" role="alert">
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
                      alt=""
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      {...register("newPassword")}
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      aria-label="New password"
                      className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
                    />
                    {/* Toggle Icon */}
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                    {errors.newPassword && (
                      <p className="text-xs text-red-500 font-normal mt-[3px] ml-2" role="alert">
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
                      alt=""
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      aria-label="Confirm password"
                      className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
                    />
                    {/* Toggle Icon */}
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 font-normal mt-[3px] ml-2" role="alert">
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
              disabled={isSubmitting || recaptchaError}
              className="text-size-15 rounded-[150px] text-white bg-primaryColor px-25px py-10px w-full border-2 border-primaryColor hover:text-primaryColor hover:bg-white inline-block group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-primaryColor disabled:hover:text-white"
              aria-label={
                !emailSent
                  ? "Send password reset email"
                  : !tempPasswordVerified
                  ? "Verify temporary password"
                  : "Reset password"
              }
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                !emailSent
                  ? "Send Password On Email"
                  : !tempPasswordVerified
                  ? "Verify System Generated Password"
                  : "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
