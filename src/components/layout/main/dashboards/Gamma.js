"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Preloader from "@/components/shared/others/Preloader";
import { apiUrls } from "@/apis";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup
  .object({
    full_name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone_number: yup
      .string()
      .matches(/^\d+$/, "Phone number should contain only digits")
      .min(10, "At least 10 digits required")
      .max(10, "Must be exactly 10 digits")
      .required("Phone number is required"),
    admin_role: yup.string().required("Role is required"),
    confirm_password: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        "Password and confirm password must match"
      )
      .required("Confirm password is required"),
    password: yup
      .string()
      .min(6, "At least 6 characters required")
      .required("Password is required"),
    agree_terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("Agree terms is required")
  })
  .required();

const Gamma = () => {
  const [apiError, setApiError] = useState(null);
  const { postQuery, loading } = usePostQuery();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (data) => {
    setApiError(null);
    const { confirm_password, ...userData } = data;

    try {
      await postQuery({
        url: apiUrls?.user?.register,
        postData: userData,
        onSuccess: () => {
          router.push("/dashboards/admin-subpage3");
          showToast.success("User created successfully!");
        },
        onFail: (error) => {
          console.log("Registration failed:", error);
          showToast.error("User already registered with same email!");
          setApiError(error.message);
        },
      });
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start font-Poppins justify-center min-h-screen pt-9 dark:bg-inherit bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:border dark:bg-inherit max-w-6xl w-full p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 dark:text-white">
          Create a new user
        </h2>
        {apiError && <p className="mb-4 text-red-500">{apiError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 dark:text-whitegrey3">
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("full_name")}
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Karan Singh"
                autoComplete="name"
                className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
              />
            </div>
            {errors.full_name && (
              <p className="text-xs text-red-500 font-normal  ml-2">
                {errors.full_name?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 dark:text-whitegrey3">
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("email")}
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-normal mt-[3px] ml-2">
                {errors.email?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 dark:text-whitegrey3">
              Phone number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faPhone}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("phone_number")}
                type="text"
                id="phone_number"
                name="phone_number"
                maxLength={10}
                placeholder="8317074259"
                autoComplete="tel"
                className="w-full h-12 pl-12 text-sm focus:outline-none text-black bg-[#F7F7F7] border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
              />
            </div>
            {errors.phone_number && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.phone_number?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 dark:text-whitegrey3">
              Select Role
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register("admin_role")}
              id="admin_role"
              name="admin_role"
              className="w-full h-12 pl-4 text-sm focus:outline-none text-black bg-[#F7F7F7] border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
            >
              <option value="">Select</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super-Admin</option>
              <option value="corporate-admin">Corporate Admin</option>
            </select>
            {errors.admin_role && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.admin_role?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="gap-4 mb-4 w-[49%]">
            <label
              htmlFor="password"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                autoComplete="new-password"
                className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className="gap-4 mb-4 w-[49%]">
            <label
              htmlFor="confirm_password"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Confirm Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                {...register("confirm_password")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="w-full h-12 pl-12 pr-10 text-sm focus:outline-none text-black bg-[#F7F7F7] dark:text-contentColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-black placeholder:opacity-80 font-medium rounded-[12px]"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
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
        </div>

        <div className="flex flex-col mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agree_terms"
              {...register("agree_terms")}
              className="w-6 h-6 mr-2 appearance-none border-2 border-gray-400 rounded cursor-pointer checked:bg-[#7ECA9D] checked:border-[#7ECA9D] checked:before:content-['✔'] checked:before:text-white checked:before:text-[12px] checked:before:flex checked:before:justify-center checked:before:items-center"
            />
            <label htmlFor="agree_terms" className="text-sm text-gray-700 cursor-pointer">
              I accept the <a href="/terms-and-conditions" className="text-primaryColor underline hover:no-underline">terms of use</a> and <a href="/privacy-policy" className="text-primaryColor underline hover:no-underline">privacy policy</a>.
            </label>
          </div>
          {errors.agree_terms && (
            <p className="text-red-500 text-xs ml-2 mt-[-5px]">
              {errors.agree_terms.message}
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-[150px] text-primaryColor border border-primaryColor px-[25px] py-[10px] hover:text-white hover:bg-primaryColor"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-size-15 rounded-[150px] text-white bg-primaryColor px-[25px] py-[10px] w-full border border-primaryColor hover:text-primaryColor hover:bg-white inline-block group dark:hover:text-white dark:hover:bg-gray-800"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default Gamma;
