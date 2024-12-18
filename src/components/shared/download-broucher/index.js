import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { FaTimes } from "react-icons/fa";

const DownloadBrochureModal = ({ isOpen, onClose, courseTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country_code: "IN", // Default country code
    accepted: false,
  });

  const [errors, setErrors] = useState({}); // State to store error messages

  // Regular expressions for validation
  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces for name
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email validation
  const phoneRegex = {
    IN: /^[1-9][0-9]{9}$/, // Indian phone number validation
    AUS: /^[0-9]{9}$/, // Australian phone number validation
    CA: /^[0-9]{10}$/, // Canadian phone number validation
    SGP: /^[0-9]{8}$/, // Singapore phone number validation
    UAE: /^[0-9]{9}$/, // UAE phone number validation
    UK: /^[0-9]{10}$/, // UK phone number validation
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the error for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Handle checkbox for terms and conditions
  const handleCheckboxChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      accepted: e.target.checked,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      accepted: "",
    }));
  };

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name || !nameRegex.test(formData.full_name)) {
      newErrors.full_name =
        "Please enter a valid name (letters and spaces only).";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      !formData.phone_number ||
      !phoneRegex[formData.country_code].test(formData.phone_number)
    ) {
      newErrors.phone_number =
        "Please enter a valid phone number for the selected country.";
    }

    if (!formData.accepted) {
      newErrors.accepted =
        "You must accept the Terms of Service and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if there are validation errors
    }

    try {
      await postQuery({
        url: apiUrls?.brouchers?.addBroucher,
        postData: {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          country_code: formData.country_code,
          course_title: courseTitle || "Default Course Title",
        },
        onSuccess: () => {
          console.log("API Success triggered");
          setShowModal(true);
          onClose();
        },
        onFail: () => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: "An error occurred while sending the brochure.",
          }));
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg w-100 py-6 px-4 relative">
          <div className="flex border-b-2">
            <button
              onClick={onClose}
              className="absolute font-normal top-3 text-4xl right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-Poppins font-semibold mb-4">
              Download Brochure
            </h2>
          </div>
          <h3 className="text-xl font-medium text-[#FFB547] my-4">
            Certificate Course in
            <br />
            <span className="font-bold text-2xl text-[#FFA63E]">
              {courseTitle || "Course Title"}
            </span>
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="full_name"
                placeholder="Your Name*"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
                value={formData.full_name}
                onChange={handleChange}
              />
              {errors.full_name && (
                <p className="text-red-500 text-[10px]">{errors.full_name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email*"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-[10px]">{errors.email}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <select
                name="country_code"
                className="px-4 text-black py-2 border rounded w-1/3 focus:outline-none focus:border-[#FFA63E]"
                value={formData.country_code}
                onChange={handleChange}
              >
                <option value="IN">IN (+91)</option>
                <option value="AUS">AUS (+61)</option>
                <option value="CA">CA (+1)</option>
                <option value="SGP">SGP (+65)</option>
                <option value="UAE">UAE (+971)</option>
                <option value="UK">UK (+44)</option>
              </select>
              <input
                type="tel"
                name="phone_number"
                placeholder="Your Phone*"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            {errors.phone_number && (
              <p className="text-red-500 text-[10px]">{errors.phone_number}</p>
            )}

            <div className="flex items-start space-x-2 mb-12">
              <input
                type="checkbox"
                id="accept"
                checked={formData.accepted}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-[#7ECA9D] border-gray-300 rounded mt-1 focus:ring-[#7ECA9D]"
              />
              <label
                htmlFor="accept"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                By submitting this form, I accept
                <a href="terms-and-services">
                  <span className="text-[#7ECA9D] ml-1">Terms of Service</span>
                </a>{" "}
                & <br />
                <a href="privacy-policy">
                  <span className="text-[#7ECA9D]">Privacy Policy.</span>
                </a>
              </label>
            </div>
            {errors.accepted && (
              <p className="text-red-500 text-[10px]">{errors.accepted}</p>
            )}

            <div className="-mb-6">
              <button
                type="submit"
                className="bg-[#7ECA9D] rounded-[2px] text-white px-6 py-2 flex items-center justify-center"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
            {errors.general && (
              <p className="text-red-500 text-sm mt-4">{errors.general}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default DownloadBrochureModal;
