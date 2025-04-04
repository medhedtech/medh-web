import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiBaseUrl, apiUrls } from "@/apis";
import useAuth from "@/hooks/useAuth";

const DownloadBrochureModal = ({
  isOpen,
  onClose,
  courseTitle,
  brochureId,
  courseId,
  inlineForm = false,
  flipCard = false
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    country_code: "IN",
    accepted: false,
  });
  const [errors, setErrors] = useState({});

  // Auto-fill form with user data if authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      setFormData(prevData => ({
        ...prevData,
        full_name: user.full_name || user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        country_code: user.country_code || "IN",
        accepted: true,
      }));
    }
  }, [isOpen, isAuthenticated, user]);

  // Warn if neither courseId nor brochureId is provided
  useEffect(() => {
    if (isOpen && !courseId && !brochureId) {
      console.error("DownloadBrochureModal: Missing courseId or brochureId");
    }
  }, [isOpen, courseId, brochureId]);

  // Basic validation regex patterns
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
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, accepted: e.target.checked }));
    setErrors(prev => ({ ...prev, accepted: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name || !nameRegex.test(formData.full_name)) {
      newErrors.full_name = "Invalid name";
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phone_number || !phoneRegex[formData.country_code]?.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone";
    }
    if (!formData.accepted) {
      newErrors.accepted = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function for direct download (authenticated users)
  const handleDirectDownload = async () => {
    try {
      setLoading(true);
      const idToUse = courseId || brochureId;
      if (!idToUse) {
        console.error("Missing course or brochure ID");
        onClose();
        return;
      }

      console.log('Opening brochure in new tab...');
      
      // Get the authentication token
      const token = localStorage.getItem('auth_token') || '';
      
      // Create a URL with the token and open in a new tab
      const brochureUrl = `${apiBaseUrl}/broucher/download/${idToUse}`;
      
      // Open in a new tab
      const newTab = window.open('about:blank', '_blank');
      
      // Create a form to send the token securely via POST
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = brochureUrl;
      form.target = '_blank';
      
      // Add token as hidden field
      const tokenField = document.createElement('input');
      tokenField.type = 'hidden';
      tokenField.name = 'token';
      tokenField.value = token;
      form.appendChild(tokenField);
      
      // Add to document, submit, and remove
      document.body.appendChild(form);
      
      if (newTab) {
        // If new tab was successfully opened
        newTab.location = brochureUrl + `?token=${encodeURIComponent(token)}`;
      } else {
        // Fallback - this might be blocked by popup blockers
        window.open(brochureUrl + `?token=${encodeURIComponent(token)}`, '_blank');
      }
      
      console.log('Brochure opened in new tab');
      setDownloadSuccess(true);
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
        setDownloadSuccess(false);
      }, 1500);
      
      setLoading(false);
    } catch (err) {
      console.error('Error opening brochure:', err);
      setLoading(false);
      setErrors(prev => ({ ...prev, general: "Failed to open brochure. Please try again." }));
    }
  };

  // Function for email delivery (non-authenticated users)
  const downloadBrochure = async () => {
    try {
      setLoading(true);
      const idToUse = courseId || brochureId;
      if (!idToUse) {
        setErrors(prev => ({ ...prev, general: "Missing course or brochure details" }));
        return;
      }

      // For all users, send email via POST request
      const requestData = apiUrls.brouchers.requestBroucher({
        brochure_id: brochureId,
        course_id: courseId,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        country_code: formData.country_code,
        send_email: true,
        sender_email: "medh@medhlive.com"
      });
      
      const response = await fetch(`${apiBaseUrl}${requestData.url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData.data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send brochure to email");
      }
      
      await response.json();
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
      }, 1500);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await downloadBrochure();
  };

  // Always render the form, even for authenticated users
  if (!isOpen) return null;

  const containerClass = inlineForm
    ? "absolute inset-0 z-[600] flex items-center justify-center"
    : "fixed inset-0 z-[500] flex items-center justify-center";
  const contentClass = inlineForm
    ? "w-11/12 max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all animate-fadeIn"
    : "relative w-[95%] sm:w-[450px] max-h-[90vh] overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transform transition-all";

  return (
    <div className={containerClass}>
      {!inlineForm && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      )}
      <div className={contentClass}>
        <div className="flex justify-between items-center border-b pb-1 mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Download Brochure</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          {isAuthenticated ? 
            "Confirm your details to download the brochure from Medh." :
            "Fill in your details and we'll email you the brochure from Medh."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="full_name"
            placeholder="Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              name="accepted"
              checked={formData.accepted}
              onChange={handleCheckboxChange}
              className="h-4 w-4"
            />
            <label className="text-xs text-gray-600">I agree</label>
          </div>
          {errors.accepted && <p className="text-xs text-red-500">{errors.accepted}</p>}
          {errors.general && <p className="text-xs text-red-500">{errors.general}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-1 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-75"
          >
            {loading ? "Submitting..." : "Get Brochure"}
          </button>
        </form>
        {downloadSuccess && (
          <div className="mt-2 text-center text-green-600 text-xs">
            Brochure has been sent to your email.
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadBrochureModal;
