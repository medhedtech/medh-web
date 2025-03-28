"use client";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "@/utils/api";
import Preloader from "@/components/shared/others/Preloader";
import UsersTableStudent from "./StudentManagement";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import useAuth from '@/hooks/useAuth';

// Validation Schema - Memoized
const schema = yup.object({
  full_name: yup.string().required("Student name is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(13, "Age must be above 13 years"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  user_image: yup.string().optional(),
});

const AddStudentForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [showStudentListing, setShowStudentListing] = React.useState(false);
  const [studentImage, setStudentImage] = React.useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => ({
      full_name: "",
      age: "",
      email: "",
    }), []),
  });

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        const postData = { base64String: base64, fileType: "image" };

        setLoading(true);
        try {
          const response = await api.post("/upload/image", postData);
          setStudentImage(response.data?.data);
          setValue("user_image", response.data?.data);
          toast.success("Image uploaded successfully");
        } catch (error) {
          toast.error("Image upload failed. Please try again.");
          console.error("Upload error:", error);
        } finally {
          setLoading(false);
        }
      };
    } catch (error) {
      console.error("Error uploading Image:", error);
      toast.error("Error uploading image. Please try again.");
    }
  }, [setValue]);

  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);
      await api.post("/user/register", {
        ...data,
        role: "student",
        user_image: studentImage,
      });
      
      toast.success("Student added successfully!");
      reset();
      setShowStudentListing(true);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("User already exists with this email.");
      } else {
        toast.error("Error adding student. Please try again.");
      }
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
    }
  }, [reset, studentImage]);

  if (!user) {
    router.push('/login');
    return null;
  }

  if (showStudentListing) {
    return <UsersTableStudent onCancel={() => setShowStudentListing(false)} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start justify-center w-full bg-gray-100 p-4 pt-9">
      <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-md font-Poppins">
        <h2 className="text-2xl font-semibold mb-6">Add Student</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Full Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="full_name"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="full_name"
                placeholder="Student Name"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("full_name")}
              />
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.full_name && (
              <span className="text-red-500 text-xs">
                {errors.full_name.message}
              </span>
            )}
          </div>

          {/* Age Field */}
          <div className="flex flex-col">
            <label
              htmlFor="age"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Age
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              id="age"
              placeholder="Age"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("age")}
            />
            {errors.age && (
              <span className="text-red-500 text-xs">{errors.age.message}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-xs px-2 text-[#808080] font-medium mb-1"
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                {...register("email")}
              />
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end items-center space-x-4 sm:col-span-2 mt-4">
            <button
              type="button"
              onClick={() => setShowStudentListing(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-green-500 focus:outline-none transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(AddStudentForm);
