import { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { Download, X, Phone, User, Mail, Globe } from "lucide-react";

const DownloadBrochureModal = ({ isOpen, onClose, courseTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country_code: "IN",
    accepted: false,
  });

  const [errors, setErrors] = useState({});

  // Regular expressions for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = {
    IN: /^[1-9][0-9]{9}$/,
    AUS: /^[0-9]{9}$/,
    CA: /^[0-9]{10}$/,
    SGP: /^[0-9]{8}$/,
    UAE: /^[0-9]{9}$/,
    UK: /^[0-9]{10}$/,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, accepted: e.target.checked }));
    setErrors((prev) => ({ ...prev, accepted: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name || !nameRegex.test(formData.full_name)) {
      newErrors.full_name = "Please enter a valid name (letters and spaces only)";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone_number || !phoneRegex[formData.country_code].test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }

    if (!formData.accepted) {
      newErrors.accepted = "Please accept the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          setShowModal(true);
          onClose();
        },
        onFail: () => {
          setErrors((prev) => ({
            ...prev,
            general: "An error occurred while sending the brochure.",
          }));
        },
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-[95%] sm:w-[450px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Download size={24} className="text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Download Brochure
            </h2>
          </div>

          <div className="mt-2 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get detailed information about
            </p>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              {courseTitle || "Course Title"}
            </h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          {/* Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="full_name"
              placeholder="Your Name*"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.full_name ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              value={formData.full_name}
              onChange={handleChange}
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Your Email*"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Input Group */}
          <div className="relative flex gap-3">
            <div className="relative w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe size={18} className="text-gray-400" />
              </div>
              <select
                name="country_code"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                value={formData.country_code}
                onChange={handleChange}
              >
                <option value="IN">IN +91</option>
                <option value="AUS">AU +61</option>
                <option value="CA">CA +1</option>
                <option value="SGP">SG +65</option>
                <option value="UAE">AE +971</option>
                <option value="UK">UK +44</option>
              </select>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number*"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.phone_number ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
          </div>
          {errors.phone_number && (
            <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="accept"
              checked={formData.accepted}
              onChange={handleCheckboxChange}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors"
            />
            <label htmlFor="accept" className="text-sm text-gray-600 dark:text-gray-300">
              By submitting this form, I accept the{" "}
              <a href="/terms-and-services" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.accepted && (
            <p className="text-xs text-red-500">{errors.accepted}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Download size={18} />
                Download Now
              </>
            )}
          </button>

          {errors.general && (
            <p className="text-sm text-red-500 text-center">{errors.general}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DownloadBrochureModal;
