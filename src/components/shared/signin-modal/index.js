"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { storeAuthData, sanitizeAuthData } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

const schema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(8, "At least 8 character required")
      .required("Password is required"),
  })
  .required();

const SignInModal = ({ isOpen, onClose }) => {
  const { postQuery, loading } = usePostQuery();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Clean up any invalid auth data when the modal opens
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      sanitizeAuthData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    await postQuery({
      url: apiUrls?.user?.login,
      postData: {
        email: data.email,
        password: data.password,
      },
      onSuccess: (res) => {
        try {
          // Save token and userId using the auth utility
          if (res?.token && res?.id) {
            // Extract user information from token or response
            let fullName = "";
            let role = "";
            
            try {
              // Try to get user name and role from JWT token
              const decoded = jwtDecode(res.token);
              if (decoded.user) {
                fullName = decoded.user.full_name || decoded.user.name || "";
                role = Array.isArray(decoded.user.role) 
                  ? decoded.user.role[0] 
                  : decoded.user.role || "";
              }
            } catch (error) {
              console.error("Error parsing token:", error);
            }
            
            // Use response data as fallback
            if (!fullName) {
              fullName = res.full_name || res.name || "";
            }
            
            if (!role) {
              role = res.role || "";
            }
            
            // Store auth data with full name
            const rememberMe = false; // We're not using remember me in this modal
            const authSuccess = storeAuthData(
              { 
                token: res.token, 
                id: res.id,
                full_name: fullName
              },
              rememberMe,
              data.email
            );
            
            if (authSuccess) {
              // Store additional user information
              if (role) {
                localStorage.setItem("role", role);
              }
              
              showToast.success("Success!");
              setErrorMessage("");
              onClose();
            } else {
              setErrorMessage("Failed to store authentication data");
            }
          } else {
            setErrorMessage("Unexpected response structure from server!");
          }
        } catch (error) {
          console.error("Error during login:", error);
          setErrorMessage("An error occurred during login");
        }
      },
      onFail: (error) => {
        console.error("Login failed:", error);
        setErrorMessage("Invalid credentials! Please try again.");
        toast.error("Invalid credentials! Please try again.");
      },
    });
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-[400px] py-16 px-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute font-normal top-3 text-4xl right-3 text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>

        <h3 className="text-2xl font-medium text-[#5C6574] text-left mb-6">
          Hi, Welcome back!
        </h3>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Username or Email Address"
              className="w-full h-12 pl-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full h-12 pl-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center align-center justify-between space-y-4">
            <label className="flex items-center text-[18px] text-[#5C6574]">
              <input
                type="checkbox"
                className="h-6 w-6 text-green-400 border-2 border-[#cdcfd5] rounded focus:ring-green-400"
              />
              <span className="ml-2">Keep me signed in</span>
            </label>
            <button
              type="button"
              className="text-[#757C8E] text-[16px] font-medium"
            >
              Forgot?
            </button>
          </div>
          {/* Error Message Display */}
          {errorMessage && (
            <p className="text-[16px] text-red-500 my-4 text-center">
              {errorMessage}
            </p>
          )}
          <div className="mt-12 mb-4 text-center">
            <button
              type="submit"
              className="text-size-15 rounded-[10px] text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
            >
              {loading ? "LOADING...." : "SIGN IN"}
            </button>
          </div>

          <div className="flex-row">
            <div className="text-center mt-4 text-[18px] text-gray-600">
              Don&#39;t have an account?
            </div>
            <div className="text-center mt-2 text-[16px] text-gray-600">
              <a href="/signup" className="text-primaryColor font-medium">
                Register Now
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
