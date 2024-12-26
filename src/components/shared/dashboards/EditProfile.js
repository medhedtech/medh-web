"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProfileImgPlaceholder from "@/assets/images/dashbord/profileImg.png";
import ProfileBanner from "@/assets/images/dashbord/profileBanner.png";
import Preloader from "../others/Preloader";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const schema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email"),
  phone_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit number"),
  age: yup
    .date()
    .nullable()
    .typeError("Invalid date")
    .max(new Date(), "Date of Birth cannot be in the future"),
  facebook_link: yup.string().url("Invalid URL"),
  linkedin_link: yup.string().url("Invalid URL"),
  instagram_link: yup.string().url("Invalid URL"),
});

const EditProfile = ({ onBackClick }) => {
  const [studentId, setStudentId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      getQuery({
        url: `${apiUrls?.user?.getDetailsbyId}/${studentId}`,
        // onSuccess: (data) => {
        //   setProfileData(data?.data);
        //    if (profile?.age) {
        //   setSelectedDate(moment(profile.age, "YYYY-MM-DD").toDate());
        // }
        //   reset(data?.data);
        // },
        onSuccess: (data) => {
          const profile = data?.data;
          setProfileData(profile);

          // Set the DOB if it exists in the profile
          if (profile?.age) {
            setSelectedDate(moment(profile.age, "YYYY-MM-DD").toDate());
          }

          reset(profile);
        },
        onFail: (error) => {
          console.error("Failed to fetch user details:", error);
        },
      });
    }
  }, [studentId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result.split(",")[1];
          const postData = { base64String: base64, fileType: "image" };

          await postQuery({
            url: apiUrls?.upload?.uploadImage,
            postData,
            onSuccess: (data) => {
              setProfileImage(data?.data);
              setValue("upload_image", data?.data);
              console.log("Image uploaded successfully:", data?.data);
            },
            onError: (error) => {
              toast.error("Image upload failed. Please try again.");
              console.error("Upload error:", error);
            },
          });
        };
      } catch (error) {
        console.error("Error uploading Image:", error);
      }
    }
  };

  // const onSubmit = async (data) => {
  //   if (!studentId) {
  //     toast.error("Please log in to continue.");
  //     return;
  //   }
  //   setLoading(true);
  //   // Step 2: Update the user details
  //   postQuery({
  //     url: `${apiUrls?.user?.update}/${studentId}`,
  //     postData: {
  //       ...data,
  //       age: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null,
  //       user_image: profileImage || data.user_image,
  //     },
  //     onSuccess: () => {
  //       toast.success("Profile updated successfully!");
  //       setSelectedDate(null);
  //       reset();
  //     },
  //     onFail: (error) => {
  //       console.error("Error submitting form:", error);
  //       toast.error("Failed to update profile. Please try again.");
  //     },
  //   }).finally(() => {
  //     setLoading(false);
  //   });
  // };

  const onSubmit = async (data) => {
    if (!studentId) {
      toast.error("Please log in to continue.");
      return;
    }
    setLoading(true);

    // Step 2: Update the user details
    postQuery({
      url: `${apiUrls?.user?.update}/${studentId}`,
      postData: {
        ...data,
        age: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null,
        user_image: profileImage || data.user_image,
      },
      onSuccess: async () => {
        toast.success("Profile updated successfully!");
        setSelectedDate(null);
        reset();

        // Fetch the latest profile data after successful update
        try {
          const response = await getQuery({
            url: `${apiUrls?.user?.getDetailsbyId}/${studentId}`,
          });

          // Ensure the data is correctly returned and set
          if (response?.data) {
            setProfileData(response?.data);
            reset(response?.data);
            console.log("Profile data updated:", response?.data);
          } else {
            toast.error("Failed to fetch updated profile details.");
          }
        } catch (error) {
          console.error("Error fetching updated user details:", error);
          toast.error("Failed to fetch updated profile details.");
        }
      },
      onFail: (error) => {
        console.error("Error submitting form:", error);
        toast.error("Failed to update profile. Please try again.");
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // setValue("date", date);
  };

  if (loading || !profileData) {
    return <Preloader />;
  }

  return (
    <div className="w-full mx-auto p-6 dark:bg-inherit dark:text-white bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <button
          className="text-xl font-semibold mr-4 cursor-pointer"
          onClick={onBackClick}
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>
      <div className="pl-10 pr-4">
        <div className="relative mb-20">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={ProfileBanner}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white opacity-50"></div>
          </div>
          <div className="absolute top-28 left-6 flex items-center">
            <Image
              src={profileData?.user_image || ProfileImgPlaceholder}
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full h-[150px] border-4 border-white object-cover"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Full Name Field */}
          <div>
            <label className="block text-base font-bold mb-2">Full Name</label>
            <input
              {...register("full_name")}
              type="text"
              disabled
              placeholder="Enter your full name"
              className="mt-1 block w-full px-3 py-2 text-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 cursor-not-allowed focus:ring-green-500"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-base font-bold mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              disabled
              className="mt-1 block w-full px-3 py-2 cursor-not-allowed text-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-base font-bold mb-2">
              Phone Number
            </label>
            <input
              {...register("phone_number")}
              type="text"
              placeholder="Enter your phone number"
              disabled
              className="mt-1 block w-full px-3 py-2 cursor-not-allowed text-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Age Field */}
          {/* <div>
            <label className="block text-base font-bold mb-2">Age</label>
            <input
              {...register("age")}
              type="number"
              placeholder="Enter your age"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
            )}
          </div> */}

          {/* Facebook Link Field */}
          <div>
            <label className="block text-base font-bold mb-2">
              Facebook Link
            </label>
            <input
              {...register("facebook_link")}
              type="url"
              placeholder="Enter your Facebook profile URL"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.facebook_link && (
              <p className="text-red-500 text-sm mt-1">
                {errors.facebook_link.message}
              </p>
            )}
          </div>

          {/* LinkedIn Link Field */}
          <div>
            <label className="block text-base font-bold mb-2">
              LinkedIn Link
            </label>
            <input
              {...register("linkedin_link")}
              type="url"
              placeholder="Enter your LinkedIn profile URL"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.linkedin_link && (
              <p className="text-red-500 text-sm mt-1">
                {errors.linkedin_link.message}
              </p>
            )}
          </div>

          {/* Twitter Link Field */}
          <div>
            <label className="block text-base font-bold mb-2">
              Instagram Link
            </label>
            <input
              {...register("instagram_link")}
              type="url"
              placeholder="Enter your Instagram profile URL"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.instagram_link && (
              <p className="text-red-500 text-sm mt-1">
                {errors.instagram_link.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-base font-bold mb-2">D.O.B.</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                handleDateChange(date);
                setValue("age", date, { shouldValidate: true });
              }}
              placeholderText="Select Date"
              dateFormat="dd/MM/yyyy"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="py-2 px-5 bg-primaryColor text-white font-semibold rounded-full hover:bg-green-600 focus:outline-none focus:ring-2"
            >
              Update/Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
