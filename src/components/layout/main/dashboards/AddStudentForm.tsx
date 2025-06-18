"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import apiWithAuth from "@/utils/apiWithAuth";
import Preloader from "@/components/shared/others/Preloader";
import { UserIcon, EnvelopeIcon, PhoneIcon, EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import useAuth from '@/hooks/useAuth';
import { apiUrls, apiBaseUrl } from "@/apis";
import countryCodes from "@/utils/countrycode.json";

// Generate a random password
const generatePassword = (length = 10): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "@$!%*?&"; // Updated to match backend validation requirements
  
  // Ensure at least one of each required character type
  let password = "";
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));
  
  // Fill the rest randomly
  const allChars = lowercase + uppercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

// Calculate password strength
const calculatePasswordStrength = (password: string | undefined): { score: number; message: string } => {
  if (!password) return { score: 0, message: "" };
  
  let score = 0;
  let message = "";

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/\d/.test(password)) score += 1; // number
  if (/[@$!%*?&]/.test(password)) score += 1; // special character

  // Determine strength message
  if (score < 3) message = "Weak";
  else if (score < 5) message = "Medium";
  else message = "Strong";

  return { score, message };
};

export interface AddStudentFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

interface FormValues {
  full_name: string;
  age: number;
  email: string;
  phone_number: string;
  country_code: string;
  gender: string;
  password?: string;
  use_manual_password: boolean;
  agree_terms: boolean;
  user_image?: string;
}

// Validation Schema - Memoized
const schema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  age: yup.number().required("Age is required").min(1, "Age must be at least 1"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  country_code: yup.string().required("Country code is required"),
  gender: yup.string().required("Gender is required"),
  password: yup.string().when('use_manual_password', {
    is: true,
    then: (schema) => schema
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)"
      ),
    otherwise: (schema) => schema.optional()
  }),
  use_manual_password: yup.boolean().default(false),
  agree_terms: yup.boolean().oneOf([true], "You must agree to the terms").required(),
  user_image: yup.string().optional(),
});

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onCancel, onSuccess }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [passwordCopied, setPasswordCopied] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(schema),
    defaultValues: useMemo(() => ({
      full_name: "",
      age: 0,
      email: "",
      phone_number: "",
      country_code: "+91", // Default to India
      gender: "Male",
      password: "",
      use_manual_password: false,
      agree_terms: false,
    }), []),
  });

  const useManualPassword = watch('use_manual_password');
  const currentPassword = watch('password');
  const passwordStrength = calculatePasswordStrength(currentPassword);

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword();
    setValue('password', newPassword);
    setGeneratedPassword(newPassword);
    trigger('password');
  }, [setValue, trigger]);

  const copyPasswordToClipboard = useCallback(() => {
    const passwordToCopy = useManualPassword ? currentPassword : generatedPassword;
    if (!passwordToCopy) return;
    
    navigator.clipboard.writeText(passwordToCopy)
      .then(() => {
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy password: ', err);
        showToast.error("Failed to copy password");
      });
  }, [useManualPassword, currentPassword, generatedPassword]);

  const onSubmit = useCallback(async (data: FormValues) => {
    try {
      // Get the password based on the selected option
      const password = data.use_manual_password ? data.password : generatedPassword;
      
      if (!password) {
        showToast.error('Password is required');
        return;
      }

      // Validate password if using manual password
      if (data.use_manual_password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
          showToast.error('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)');
          return;
        }
      }

      // Extract country code from the full country code string (e.g., "+91" -> "91")
      const countryCode = data.country_code.replace('+', '');
      
      // Format phone number in E.164 format (with the "+" prefix)
      const formattedPhoneNumber = `+${countryCode}${data.phone_number}`;
      
      const studentData = {
        full_name: data.full_name,
        email: data.email,
        phone_numbers: [{
          country: countryCode,
          number: formattedPhoneNumber
        }],
        password: password,
        agree_terms: data.agree_terms,
        status: "Active",
        meta: { 
          gender: data.gender,
          upload_resume: [],
          age: String(data.age),
        },
        role: ["student"]
      };

      const response = await fetch(`${apiBaseUrl}${apiUrls.user.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          showToast.error('Session expired. Please login again.');
          // Handle session expiry - redirect to login or refresh token
          return;
        }
        throw new Error(result.message || 'Failed to add student');
      }

      showToast.success('Student added successfully');
      reset();
      
      // Wait a moment before returning to the student management page
      setTimeout(() => {
        onCancel();
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error('Error adding student:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to add student');
    }
  }, [reset, onCancel, generatedPassword, onSuccess]);

  // Show loading state only when loading, don't check auth here
  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full bg-gray-50 dark:bg-darkblack p-4 pt-9">
      <div className="w-[95%] max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white border-b pb-4 dark:border-gray-700">Add Student</h2>
        
        {isSubmitSuccess ? (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 mb-6 rounded-md">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="font-medium text-lg">Success!</h3>
            </div>
            <p className="mb-2">The student has been added successfully. A temporary password has been sent to their email.</p>
            <p className="text-sm italic">Redirecting to student management page...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit as any)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="sm:col-span-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
            </div>
            
            {/* Full Name Field */}
            <div className="flex flex-col">
              <label
                htmlFor="full_name"
                className="text-sm px-1 text-gray-600 dark:text-gray-300 font-medium mb-1"
              >
                Full Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="full_name"
                  placeholder="Student Name"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  {...register("full_name")}
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.full_name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.full_name.message}
                </span>
              )}
            </div>

            {/* Gender Field */}
            <div className="flex flex-col">
              <label
                htmlFor="gender"
                className="text-sm px-1 text-gray-600 dark:text-gray-300 font-medium mb-1"
              >
                Gender
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="gender"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: "1.25rem" }}
                {...register("gender")}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </span>
              )}
            </div>

            {/* Age Field */}
            <div className="flex flex-col">
              <label
                htmlFor="age"
                className="text-sm px-1 text-gray-600 dark:text-gray-300 font-medium mb-1"
              >
                Age
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="age"
                placeholder="Age"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && (
                <span className="text-red-500 text-xs mt-1">{errors.age.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm px-1 text-gray-600 dark:text-gray-300 font-medium mb-1"
              >
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  {...register("email")}
                />
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="sm:col-span-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 mt-2">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Information
              </h3>
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="phone_number"
                className="text-sm px-1 text-gray-600 dark:text-gray-300 font-medium mb-1"
              >
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex">
                <select
                  id="country_code"
                  className="w-28 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-l-lg py-2.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors appearance-none bg-no-repeat bg-right pr-6"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: "1rem" }}
                  {...register("country_code")}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.dial_code}>
                      {country.code} ({country.dial_code})
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    id="phone_number"
                    placeholder="Phone Number"
                    className="w-full border-y border-r border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-r-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    {...register("phone_number")}
                  />
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.phone_number && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.phone_number.message}
                </span>
              )}
              {errors.country_code && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.country_code.message}
                </span>
              )}
            </div>

            <div className="sm:col-span-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 mt-2">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Authentication
              </h3>
            </div>

            {/* Password Type Selection */}
            <div className="sm:col-span-2 mb-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="auto_password"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!useManualPassword}
                    onChange={() => setValue('use_manual_password', false)}
                  />
                  <label
                    htmlFor="auto_password"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Generate Random Password
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="manual_password"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={useManualPassword}
                    {...register("use_manual_password")}
                  />
                  <label
                    htmlFor="manual_password"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Set Manual Password
                  </label>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="sm:col-span-2">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm px-1 text-gray-600 dark:text-gray-300 font-medium mb-1"
                >
                  Password
                  {useManualPassword && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder={useManualPassword ? "Enter password" : "Generated password will appear here"}
                      readOnly={!useManualPassword}
                      className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${!useManualPassword ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                      {...register("password")}
                      value={useManualPassword ? currentPassword : (generatedPassword || "")}
                      onChange={(e) => {
                        if (useManualPassword) {
                          setValue('password', e.target.value);
                          trigger('password');
                        }
                      }}
                    />
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {!useManualPassword && (
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Generate
                    </button>
                  )}
                  {(useManualPassword ? currentPassword : generatedPassword) && (
                    <button
                      type="button"
                      onClick={copyPasswordToClipboard}
                      className={`px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${passwordCopied ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {passwordCopied ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>
                {useManualPassword && errors.password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </span>
                )}
                {useManualPassword && currentPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score < 3 ? 'text-red-500' : 
                        passwordStrength.score < 5 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength.score < 3 ? 'bg-red-500' : 
                          passwordStrength.score < 5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${Math.min(100, (passwordStrength.score / 6) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="sm:col-span-2 mt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agree_terms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register("agree_terms")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="agree_terms"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {errors.agree_terms && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.agree_terms.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : "Add Student"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStudentForm; 