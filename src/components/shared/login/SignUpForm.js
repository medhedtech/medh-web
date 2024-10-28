import React, { useState } from "react";
import Image from "next/image";
import SignIn from "@/assets/images/log-sign/sign-in.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "../others/Preloader";

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
    <div className="w-full md:flex md:justify-between mt-[20px] mb-[40px] mb:mt-[30px] md:mb-[50px] md:px-10 ">
      <div className="transition-opacity duration-150 ease-linear md:w-[50%] w-full md:px-3 pt-3 md:border md:shadow-login-shadow2  md:ml-12">
        <div className="md:m-6   shadow-login-shadow rounded-[10px] p-5 ">
          {/* heading   */}

          <form
            className="pt-25px"
            data-aos="fade-up"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-25px mb-25px">
              <div>
                <input
                  {...register("first_name")}
                  type="text"
                  placeholder="First Name"
                  className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 font-normal mt-1">
                    {errors.first_name?.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("last_name")}
                  type="text"
                  placeholder="Last Name"
                  className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 font-normal mt-1">
                    {errors.last_name?.message}
                  </p>
                )}
              </div>
            </div>
            <div className=" gap-4 mb-6 flex">
              {/* Country Code Dropdown */}
              <select
                value={country.code}
                onChange={(e) =>
                  setCountry(countries.find((c) => c.code === e.target.value))
                }
                className="border border-gray-300 rounded-md py-2 px-2 focus:outline-none"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              {/* Mobile Number Input */}
              <input
                {...register("phone_number")} // Hook form registration for validation
                type="tel"
                onChange={(e) => setMobileNumber(e.target.value)}
                value={mobileNumber}
                placeholder="Enter Mobile Number"
                className="w-full h-12 leading-12 pl-5 bg-transparent text-sm border  rounded-md focus:outline-none placeholder:text-gray-400"
              />

              {/* Validation Error Message */}
              {errors.phone_number && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.phone_number?.message}
                </p>
              )}
            </div>

            <div className=" gap-4 gap-y-25px mb-25px">
              <input
                {...register("email")}
                type="email"
                placeholder="E-Mail Verification System"
                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="gap-4 gap-y-25px mb-25px">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
              />
              {errors.password && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className=" gap-4 gap-y-25px mb-25px">
              <input
                {...register("confirm_password")}
                type="password"
                placeholder="Password Confirmation"
                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border-2 border-borderColor  dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
              />
              {errors.confirm_password && (
                <p className="text-sm text-red-500 font-normal mt-1">
                  {errors.confirm_password?.message}
                </p>
              )}
            </div>

           
            <div className="mt-25px text-center">
              <button
                type="submit"
                className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
              >
                SIGN UP
              </button>
            </div>
            <div className="flex justify-center mt-5">
              <p>Already have an account? </p>
              <a href="#" className="text-[#F6B335]">
              Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden md:flex w-[50%] h-auto  items-center justify-center">
        <div className="w-[80%] h-[85%]  flex justify-center pt-3 ml-16">
          <Image src={SignIn} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
