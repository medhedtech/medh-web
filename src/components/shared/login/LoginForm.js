import React from "react";
import Image from "next/image";
import LogIn from "@/assets/images/log-sign/logIn.png";
import axios from "axios";
import logo1 from "@/assets/images/logo/medh_logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";
import lock from "@/assets/images/log-sign/lock.svg";
import Email from "@/assets/images/log-sign/Email.svg";

const schema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(8, "At least 8 character required")
      .required("Password is required"),
  })
  .required();

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { postQuery, loading } = usePostQuery();

  const onSubmit = async (data) => {
    await postQuery({
      url: apiUrls.login,
      onSuccess: (res) => {
        console.log(res);
      },
      onFail: (error) => {
        console.log(error);
      },
      postData: data,
    });
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="mx-auto md:flex md:justify-between h-auto max-w-[1064px] shadow-2xl border-2 p-5">
      <div className="hidden md:flex mx-auto">
        <div className="w-[504px] h-[774px] my-auto flex justify-center">
          <Image src={LogIn} className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="transition-opacity duration-150 ease-linear md:w-[50%] w-full md:px-3 pt-3">
        <div className="md:m-6 rounded-[10px] p-5">
          {/* heading */}
          <div className="w-[179px] mx-auto">
            <Image priority="false" src={logo1} alt="logo" className="py-2" />
          </div>
          <div className="pt-11">
            <h1 className="font-Open font-semibold text-3xl">Welcome Back!</h1>
            <p className="text-[#545454] text-size-17">
              Log in to access your account
            </p>
          </div>

          <form
            className="pt-6"
            data-aos="fade-up"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                  className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[162px]"
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
                  src={lock}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[162px]"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center cursor-pointer mb-4">
              <div>
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
              <div className="text-primaryColor font-semibold font-Open">
                Forgot Password?
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                type="submit"
                className="text-size-15 rounded-[150px] text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
              >
                SIGN In
              </button>
            </div>

            <div className="flex justify-center mt-5 text-[#545454] gap-4 font-Open text-sm">
              <p>Don’t have an Account? </p>
              <a href="#" className="text-primaryColor font-semibold">
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
