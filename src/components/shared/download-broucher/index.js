import { useState, useEffect } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { apiBaseUrl, apiUrls } from "@/apis";
import { Download, X, Phone, User, Mail, Globe, CheckCircle2 } from "lucide-react";

const DownloadBrochureModal = ({ isOpen, onClose, courseTitle, brochureId, courseId }) => {
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country_code: "IN",
    accepted: false,
  });

  const [errors, setErrors] = useState({});

  // Warn if neither courseId nor brochureId is provided
  useEffect(() => {
    if (isOpen && !courseId && !brochureId) {
      console.error("DownloadBrochureModal: Neither courseId nor brochureId was provided");
    }
  }, [isOpen, courseId, brochureId]);

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

  const downloadBrochure = async () => {
    try {
      setLoading(true);
      
      // Check if we have a valid ID to use
      const idToUse = courseId || brochureId;
      
      if (!idToUse) {
        setErrors((prev) => ({
          ...prev,
          general: "Unable to download brochure: Missing course or brochure information. Please try again or contact support.",
        }));
        return; // Stop execution here
      }
      
      // Using the new API endpoints from apiUrls
      const requestData = apiUrls.brouchers.requestBroucher({
        brochure_id: brochureId,
        course_id: courseId,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        country_code: formData.country_code
      });

      console.log("Sending download request to:", `${apiBaseUrl}${requestData.url}`);
      console.log("With user data:", requestData.data);

      const response = await fetch(`${apiBaseUrl}${requestData.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData.data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download error response:", errorText);
        throw new Error(`Failed to download brochure: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received JSON response:", data);

      // Check for various possible URL fields in the response
      let downloadUrl = null;
      
      // Check for URL in the main response
      if (typeof data === 'string' && (data.startsWith('http') || data.includes('.pdf'))) {
        downloadUrl = data;
      }
      // Check for URL in data object
      else if (data && typeof data === 'object') {
        // Check for brochureUrl in data.data structure
        if (data.data && typeof data.data === 'object') {
          downloadUrl = data.data.brochureUrl || data.data.downloadUrl || data.data.url || data.data.file || data.data.fileUrl;
        }
        
        // Check for URL in main data object if not found in data.data
        if (!downloadUrl) {
          downloadUrl = data.brochureUrl || data.downloadUrl || data.url || data.file || data.fileUrl;
        }
      }

      if (!downloadUrl) {
        console.error("Response data structure:", data);
        throw new Error('Download URL not found in response. Please contact support.');
      }

      console.log("Found brochure URL for download:", downloadUrl);

      // Track the download if user ID is available
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          // Track download asynchronously - don't await or block download
          fetch(`${apiBaseUrl}${apiUrls.brouchers.trackBroucherDownload({
            brochure_id: brochureId,
            user_id: userId,
            course_id: courseId,
            source: window.location.pathname,
            metadata: {
              device: navigator.userAgent,
              referrer: document.referrer
            }
          }).url}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiUrls.brouchers.trackBroucherDownload({
              brochure_id: brochureId,
              user_id: userId,
              course_id: courseId,
              source: window.location.pathname,
              metadata: {
                device: navigator.userAgent,
                referrer: document.referrer
              }
            }).data),
          });
        } catch (trackError) {
          // Don't block the download if tracking fails
          console.error('Error tracking brochure download:', trackError);
        }
      }

      // Ensure URL is valid before opening
      if (!downloadUrl.startsWith('http') && !downloadUrl.startsWith('https')) {
        downloadUrl = `https://${downloadUrl}`;
      }

      // Create a hidden anchor to trigger the download and click it programmatically
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener noreferrer';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Also try the traditional window.open as a fallback
      setTimeout(() => {
        try {
          window.open(downloadUrl, '_blank');
        } catch (openError) {
          console.log('Tried fallback window.open method:', openError);
        }
      }, 500);
      
      // Show success message and reset form
      setDownloadSuccess(true);
      setTimeout(() => {
        onClose();
        setDownloadSuccess(false);
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          country_code: "IN",
          accepted: false,
        });
      }, 2000);
    } catch (error) {
      console.error('Error downloading brochure:', error);
      setErrors((prev) => ({
        ...prev,
        general: `Failed to download the brochure: ${error.message}. Please try again later.`,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await downloadBrochure();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-[95%] sm:w-[450px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all">
        {downloadSuccess ? (
          // Success State
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Your brochure is being downloaded.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can close this window.
            </p>
          </div>
        ) : (
          <>
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
              {/* General Error Message */}
              {errors.general && (
                <div className="p-3 mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}
              
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
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadBrochureModal;
