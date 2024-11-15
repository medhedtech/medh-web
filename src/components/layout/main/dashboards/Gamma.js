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

const schema = yup
  .object({
    full_name: yup.string().required("Name is required"),
    age: yup.string().required("Age is required"),
    email: yup.string().email().required("Email is required"),
    phone_number: yup
      .string()
      .min(10, "At least 10 digits required")
      .max(10, "Must be exactly 10 digits")
      .required("Phone number is required"),
    role: yup.string().required("Role is not selected"),
    assign_department: yup
      // .array()
      .string()
      .oneOf(["Engineering"])
      // .of(yup.string())
      .required("Assign Department is not selected"),
  })
  .required();

const Gamma = () => {
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phoneNumber: "",
    role: "Student",
    assign_department: "Student",
  });
  const { postQuery, loading } = usePostQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(formData);
  // };

  const onSubmit = async (data) => {
    setApiError(null);
    // const { confirm_password, ...rest } = data;

    try {
      await postQuery({
        url: apiUrls.user.register,
        postData: {
          full_name: data?.full_name,
          age: data?.age,
          email: data?.email,
          role: data?.role,
          assign_department: data?.assign_department,
          phone_number: data?.phone_number,
        },
        onSuccess: () => {
          router.push("/admin-subpage3");
          toast.success("Registration successful!");
        },
        onFail: (error) => {
          console.log("Registration failed:", error);
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
    <div className="flex items-start font-Poppins justify-center min-h-screen pt-9 bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-6xl w-full p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Create a new user
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Full Name
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
                // value={formData.fullName}
                // onChange={handleInputChange}
                placeholder="Karan Singh"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.full_name && (
              <p className="text-xs text-red-500 font-normal  ml-2">
                {errors.full_name?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Age
            </label>
            <input
              {...register("age")}
              type="text"
              name="age"
              // value={formData.age}
              // onChange={handleInputChange}
              placeholder="27 years"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.age && (
              <p className="text-xs text-red-500 font-normal  ml-2">
                {errors.age?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Email
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
                placeholder="enteremail@gmail.com"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-normal mt-[3px] ml-2">
                {errors.email?.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Phone number
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
                // value={formData.phoneNumber}
                // onChange={handleInputChange}
                placeholder="8317074259"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.phone_number && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.phone_number?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Select Role
            </label>
            <select
              {...register("role")}
              name="role"
              // value={formData.role}
              // onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.role?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Assign department
            </label>
            <select
              {...register("assign_department")}
              name="assign_department"
              // value={formData.assign_department}
              // onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="ml">ML</option>
              <option value="automation">Automation</option>
            </select>
            {errors.assign_department && (
              <p className="text-xs text-red-500 font-normal mt-[2px] ml-2">
                {errors.assign_department?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
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
