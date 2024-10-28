import React from "react";
import Image from "next/image";
import Login from "@/assets/images/log-sign/login.svg";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";

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
    <div className="w-full md:flex md:justify-between mt-[20px] mb-[40px] mb:mt-[30px] md:mb-[50px] md:px-10">
      <div className=" opacity-100 transition-opacity duration-150 ease-linear md:w-2/4 w-full md:px-5 pt-10 md:border md:shadow-login-shadow2 md:ml-12">
        <div className="md:m-6   shadow-login-shadow rounded-[10px] p-5">
          {/* heading   */}
          <div className="text-[#5C6574] ">
            <p className="text-[20px] dark:text-blackColor-dark">
              Hi, Welcome back!
            </p>
          </div>

          <form
            className="pt-5px"
            data-aos="fade-up"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-25px">
              <input
                {...register("email")}
                type="text"
                placeholder="Email Address"
                className="w-full h-50px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-[#CDCFD5] dark:border-borderColor-dark placeholder:text-[#BEBCBC]  font-medium rounded-[8px]"
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="mb-10px">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full h-50px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-[#CDCFD5] dark:border-borderColor-dark placeholder:text-[#BEBCBC]  font-medium rounded-[8px]"
              />
              {errors.password && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="text-[#F6B335] flex justify-end">
              <a
                href="#"
                className=" relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-[#F6B335] after:transition-all after:duration-300 hover:after:w-full"
              >
                Forgot your password?
              </a>
            </div>
            {/* <div className="flex items-center text-contentColor dark:text-contentColor-dark mt-1 p-3 border-2">
              <input
                type="checkbox"
                id="remember"
                className="w-18px h-18px mr-2 block box-content"
              />
              <label htmlFor="remember">i'm not a robot</label>
            </div> */}
            <div className="flex items-center text-contentColor dark:text-contentColor-dark mt-6">
              <input
                type="checkbox"
                id="remember"
                className="w-18px h-18px mr-2 block box-content"
              />
              <label htmlFor="remember">Keep me signed in</label>
            </div>

            <div className="mt-35px text-center">
              <button
                type="submit"
                className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark tracking-wide"
              >
                SIGN IN
              </button>
            </div>
            <div className="flex justify-center mt-5">
              <p>Don't have an account? </p>
              <a href="#" className="text-[#F6B335]">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden md:flex w-2/4 h-auto  items-center justify-center">
      <div className="w-[80%] h-[80%]  flex justify-center pt-3 ml-16">
          <Image src={Login} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
