import React, { useState } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

// Validation schema using yup
const schema = yup.object({
  full_name: yup.string().required("Name is required."),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required."),
  country: yup.string().nullable(),
  phone_number: yup.string().required("Please enter mobile number"),
  message: yup.string(),
  accept: yup
    .boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required(),
});

function JobApply() {
  const { postQuery, loading } = usePostQuery();
  const [fileName, setFileName] = useState("No file chosen");
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [pdfBrochure, setPdfBrochure] = useState(null);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result;
          const postData = { base64String: base64 };

          await postQuery({
            url: apiUrls?.upload?.uploadDocument,
            postData,
            onSuccess: (data) => {
              console.log("PDF uploaded successfully!");
              setPdfBrochure(data?.data);
            },
            onError: () => {
              console.log("PDF upload failed. Please try again.");
            },
          });
        };
      } catch (error) {
        console.log("Error uploading PDF. Please try again.");
      }
    } else {
      setFileName("No file chosen");
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.jobForm?.addJobPost,
        postData: {
          full_name: data?.full_name,
          country: data?.country,
          email: data?.email,
          phone_number: data?.phone_number,
          message: data?.message,
          resume_image: pdfBrochure,
          accept: data?.accept,
        },
        onSuccess: () => {
          setShowModal(true);
          // toast.success("Form submitted successfully!");
          setPdfBrochure(null);
          setFileName("No file chosen");

          // Reset the form fields after a successful submission
          reset();
        },
        onFail: () => {
          toast.error("Error submitting form.");
        },
      });
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-screen-dark rounded-md">
        <h2 className="text-[#7ECA9D] text-3xl text-center font-Poppins font-bold mb-4">
          Apply Now
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("full_name")}
            type="text"
            placeholder="Your Name*"
            className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none"
            required
          />
          {errors.full_name && (
            <div className="text-red-500">{errors.full_name.message}</div>
          )}

          <input
            {...register("email")}
            type="email"
            placeholder="Your Email*"
            className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none"
            required
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}

          {/* Phone Number Input with Country Dropdown */}
          <div className="flex flex-row mb-2 gap-4">
            <div className="w-[35%]">
              <select
                {...register("country")}
                className="w-full border py-3 dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none"
                required
              >
                <option value="IN">IN (+91)</option>
                <option value="AUS">AUS (+61)</option>
                <option value="CA">CA (+1)</option>
                <option value="SGP">SGP (+65) </option>
                <option value="UAE">UAE (+971)</option>
                <option value="UK">Uk (+44) </option>
              </select>
              {errors.country && (
                <div className="text-red-500">{errors.country.message}</div>
              )}
            </div>
            <div className="w-[65%]">
              <input
                {...register("phone_number")}
                type="tel"
                placeholder="Your Phone Number*"
                className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none"
                required
              />
              {errors.phone_number && (
                <div className="text-red-500">
                  {errors.phone_number.message}
                </div>
              )}
            </div>
          </div>

          <textarea
            {...register("message")}
            placeholder="Write your cover letter"
            className="w-full border dark:bg-inherit border-gray-300 p-2 rounded-md focus:outline-none"
            rows="5"
          />

          {/* Resume Upload */}
          <h2 className="text-[1rem] font-bold font-Poppins text-[#000000D9] dark:text-white">
            Upload Your Resume*
          </h2>
          <div className="w-full">
            <label
              htmlFor="fileInput"
              className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer w-full text-gray-700 dark:text-white"
            >
              <FaCamera className="text-gray-500" />
              {fileName}
            </label>
            <input
              {...register("resume_image")} // Added name attribute using react-hook-form
              id="fileInput" // Correct id for file input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 mb-12">
            <input
              {...register("accept")}
              type="checkbox"
              id="accept"
              className="w-6 h-6 text-[#7ECA9D] border-gray-300 rounded mt-1 focus:ring-[#7ECA9D]"
              required
            />
            <label
              htmlFor="accept"
              className="text-[16px] text-gray-700 dark:text-gray-300"
            >
              By submitting this form, I accept
              <a href="/terms-and-services">
                <span className="text-[#7ECA9D] ml-1">Terms of Service</span>
              </a>{" "}
              &{" "}
              <a href="/privacy-policy">
                <span className="text-[#7ECA9D]">Privacy Policy.</span>
              </a>
            </label>
          </div>
          {errors.accept && (
            <span className="text-red-500 mt-[-20px]">
              {errors.accept.message}
            </span>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#7ECA9D] text-white px-4 py-2 rounded-md hover:bg-[#7ECA9D] transition duration-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-lg md:text-[28px] font-semibold text-green-500">
                🎉 Success!
              </h2>
              <p className="text-gray-700 mt-2">
                Your form has been submitted successfully!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobApply;
