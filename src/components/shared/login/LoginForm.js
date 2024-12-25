import React, { useState } from "react";
import Image from "next/image";
import LogIn from "@/assets/images/log-sign/logIn.png";
import logo1 from "@/assets/images/logo/medh_logo-1.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import lock from "@/assets/images/log-sign/lock.svg";
import Email from "@/assets/images/log-sign/Email.svg";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";

const schema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(8, "At least 8 character required")
      .required("Password is required"),
    agree_terms: yup
      .boolean()
      .oneOf([true], "You must accept the agree to proceed"),
  })
  .required();

const LoginForm = () => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  // Update onChange handler
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const onSubmit = async (data) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    await postQuery({
      url: apiUrls?.user?.login,
      postData: {
        email: data.email,
        password: data.password,
        agree_terms: data?.agree_terms,
      },
      onSuccess: (res) => {
        const decoded = jwtDecode(res.token);
        const userRole = decoded.user.role[0];
        // localStorage.setItem("token", res.token);
        // localStorage.setItem("userId", res.id);
        if (rememberMe) {
          // Save token in Cookies for 30 days
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.id);
          Cookies.set("token", res.token, { expires: 30 });
          Cookies.set("userId", res.id, { expires: 30 });
        } else {
          // Save token in localStorage for session
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.id);
        }
        if (
          userRole === "admin" ||
          userRole === "instructor" ||
          userRole === "student"
        ) {
          router.push(`/dashboards/${userRole}-dashboard`);
        } else {
          // Default case if the role doesn't match any predefined roles
          router.push("/");
        }
        toast.success("Login successful!");
        setRecaptchaError(false);
        setRecaptchaValue(null);
      },
      onFail: (error) => {
        toast.error("Invalid Credentials!");
        console.log(error);
      },
    });
  };

  if (loading) {
    return <Preloader />;
  }

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
            <h1 className="font-Open font-semibold text-3xl">Welcome Back!</h1>
            <p className="text-[#545454] text-size-17">
              Log in to access your account
            </p>
          </div>

          <form className="pt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="gap-4 mb-6">
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
                  className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium  rounded-[12px]"
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 font-normal mt-1 ml-2">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={lock}
                  alt="lock-icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-normal mt-1 ml-2">
                  {errors.password?.message}
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

            <div className="flex justify-between items-center cursor-pointer mt-2 mb-4">
              <div className="flex items-center cursor-pointer my-2">
                <input
                  type="checkbox"
                  id="remember_me"
                  onChange={handleRememberMeChange}
                  className="w-6 h-6 mr-2 appearance-none border-2 border-gray-400 rounded-full cursor-pointer checked:bg-[#7ECA9D] checked:border-[#7ECA9D] checked:before:content-['✔'] checked:before:text-white checked:before:text-[12px] checked:before:flex checked:before:justify-center checked:before:items-center"
                />
                <label
                  htmlFor="remember_me"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Remember Me
                </label>
              </div>
              <div className="text-primaryColor font-semibold font-Open">
                <a href="/forgot-password"> Forgot Password?</a>
              </div>
            </div>

            <div className="flex items-center cursor-pointer my-2">
              <input
                type="checkbox"
                id="terms"
                {...register("agree_terms")}
                className="w-6 h-6 mr-2 appearance-none border-2 border-gray-400 rounded-full cursor-pointer checked:bg-[#7ECA9D] checked:border-[#7ECA9D] checked:before:content-['✔'] checked:before:text-white checked:before:text-[12px] checked:before:flex checked:before:justify-center checked:before:items-center"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer"
              >
                I accept the{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-primaryColor underline hover:no-underline"
                >
                  terms of use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-primaryColor underline hover:no-underline"
                >
                  privacy policy
                </a>
                .
              </label>
            </div>
            {errors.agree_terms && (
              <p className="text-red-500 text-xs ml-2 mt-[-5px]">
                {errors.agree_terms.message}
              </p>
            )}

            <div className="mt-12 text-center">
              <button
                type="submit"
                className="text-size-15 rounded-[150px] text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
              >
                SIGN IN
              </button>
            </div>

            <div className="flex justify-center mt-5 text-[#545454] gap-4 font-Open text-sm">
              <p>Don&#39;t have an Account? </p>
              <a href="/signup" className="text-primaryColor font-semibold">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
