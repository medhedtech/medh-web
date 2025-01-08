"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Preloader from "@/components/shared/others/Preloader";
import { toast } from "react-toastify";
import { apiUrls } from "@/apis";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup
  .object({
    full_name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone_number: yup
      .string()
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
      .min(8, "At least 8 characters required")
      .required("Password is required"),
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
    // const { confirm_password, ...rest } = data;

    try {
      await postQuery({
        url: apiUrls?.user?.register,
        postData: {
          full_name: data?.full_name,
          email: data?.email,
          admin_role: data?.admin_role,
          phone_number: data?.phone_number,
          password: data?.password,
        },
        onSuccess: () => {
          router.push("/dashboards/admin-subpage3");
          toast.success("User created successfully!");
        },
        onFail: (error) => {
          console.log("Registration failed:", error);
          toast.error("User already registerd with same email!");
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
                name="full_name"
                placeholder="Karan Singh"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 dark:bg-inherit dark: focus:ring-indigo-500"
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
                name="email"
                // value={formData.email}
                // onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 dark:bg-inherit focus:ring-indigo-500"
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
                name="phone_number"
                maxLength={10}
                // value={formData.phoneNumber}
                // onChange={handleInputChange}
                placeholder="8317074259"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 dark:bg-inherit focus:ring-indigo-500"
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
              name="admin_role"
              // value={formData.admin_role}
              // onChange={handleInputChange}
              className="mt-1 block w-full border dark:text-whitegrey1 border-gray-300 rounded-md px-2 py-0 focus:outline-none focus:ring-2 dark:bg-inherit focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super-Admin</option>
              <option value="cooporate-admin">Cooporate-Admin</option>
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
                placeholder="Password"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
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
                placeholder="Confirm Password"
                className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-inherit dark:text-white dark:border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-customGreen text-white px-4 py-2 rounded-md"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default Gamma;
