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
import logo1 from "@/assets/images/logo/medh_logo.png";
import Name from "@/assets/images/log-sign/Name.svg";
import lock from "@/assets/images/log-sign/lock.svg";
import Email from "@/assets/images/log-sign/Email.svg";
import phone from "@/assets/images/log-sign/phone.svg";
import eyeOff from "@/assets/images/log-sign/eyeIcon.svg";
import eye from "@/assets/images/log-sign/eye.svg";

const schema = yup
  .object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email().required("Email is required"),
    phone_number: yup
      .string()
      .min(10, "At least 10 digits required")
      .max(10, "must be at most 10 characters")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(8, "At least 8 character required")
      .required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

const SignUpForm = () => {
  const [country, setCountry] = useState({ name: "IN", code: "+91" });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [mobileNumber, setMobileNumber] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { postQuery, loading } = usePostQuery();

  const onSubmit = async (data) => {
    const { confirm_password, ...rest } = data;
    await postQuery({
      url: apiUrls.register,
      onSuccess: (res) => {
        console.log(res);
      },
      onFail: (error) => {
        console.log(error);
      },
      postData: rest,
    });
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
          <Image src={SignIn} className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="transition-opacity duration-150 ease-linear md:w-[50%] w-full md:px-3 pt-3">
        <div className="md:m-6 rounded-[10px] p-5">
          {/* heading */}
          <div className="w-[179px] mx-auto">
            <Image priority="false" src={logo1} alt="logo" className="py-2" />
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
                />
                <input
                  {...register("Name")}
                  type="text"
                  placeholder="Name"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[162px]"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-6">
              <div className="relative">
                <Image
                  src={Email}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="E-Mail"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[162px]"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={phone}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("phone")}
                  type="phone"
                  placeholder="Phone Number"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[162px]"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.phone?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={lock}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[162px]"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <Image
                  src={lock}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-12 pl-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-[#000000] placeholder:opacity-80 font-medium rounded-[162px]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  <Image
                    src={showPassword ? eyeOff : eye}
                    alt="Toggle Password Visibility"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>

            <div className="flex items-center cursor-pointer mb-4">
              <input type="checkbox" id="terms" className="hidden peer" />
              <label
                htmlFor="terms"
                className="flex items-center cursor-pointer text-xs text-[#545454]"
              >
                <div className="w-5 h-5 rounded-full border-2 ml-2 border-gray-400 flex items-center justify-center mr-2 peer-checked:bg-primaryColor">
                  <div className="w-3 h-3 rounded-full bg-white peer-checked:block hidden"></div>
                </div>
                Agree to Terms & Conditions
              </label>
            </div>

            <div className="mt-12 text-center">
              <button
                type="submit"
                className="text-size-15 rounded-[150px] text-whiteColor bg-primaryColor px-25px py-10px w-full border-2 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
              >
                SIGN UP
              </button>
            </div>

            <div className="flex justify-center mt-5 text-[#545454] gap-4 font-Open text-sm">
              <p>Don’t have an Account? </p>
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
