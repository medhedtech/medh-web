import { useState, useEffect } from "react";
import { X, Download, ArrowRight, Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { apiBaseUrl, apiUrls } from "@/apis";
import useAuth from "@/hooks/useAuth";

// Add animation styles similar to CourseCard
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes flipCard {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

@keyframes flipCardReverse {
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0deg); }
}

.flip-container {
  perspective: 1000px;
  height: 100%;
  width: 100%;
  position: relative;
}

.flipped .flipper {
  transform: rotateY(180deg);
}

.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
  height: 100%;
  width: 100%;
}

.front, .back {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
  z-index: 1;
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease forwards;
}

.animate-slideUp {
  animation: slideUp 0.4s ease forwards;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease forwards;
}

.animate-flipCard {
  animation: flipCard 0.6s ease-in-out forwards;
}

.animate-flipCardReverse {
  animation: flipCardReverse 0.6s ease-in-out forwards;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.sheen {
  position: relative;
  overflow: hidden;
}

.sheen::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  transition: all 0.75s;
}

.sheen:hover::after {
  left: 100%;
}

/* Responsive modal styles */
@media (max-width: 640px) {
  .modal-content-responsive {
    max-width: 95% !important;
    padding: 1.25rem !important;
  }
  
  .modal-title-responsive {
    font-size: 1.125rem !important;
  }
  
  .modal-padding-responsive {
    padding: 1.25rem !important;
  }
  
  .modal-form-padding {
    padding: 0.75rem !important;
  }
}
`;

const DownloadBrochureModal = ({
  isOpen,
  onClose,
  courseTitle,
  brochureId,
  courseId,
  inlineForm = false,
  flipCard = false,
  children
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        const userAgent = 
          typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobile = Boolean(
          userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
          )
        );
        setIsMobile(mobile || window.innerWidth <= 768);
      };
      
      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);
      
      return () => window.removeEventListener("resize", checkIfMobile);
    }
  }, []);

  // Add animation style to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = animationStyles;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  // Handle flipping card effect when opened
  useEffect(() => {
    if (isOpen && flipCard) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [isOpen, flipCard]);

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

  // Auto download brochure if user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      handleDirectDownload();
    }
  }, [isOpen, isAuthenticated]);

  // Handle modal overflow lock for body
  useEffect(() => {
    if (isOpen && !inlineForm && !flipCard) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, inlineForm, flipCard]);

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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, accepted: e.target.checked }));
    
    // Clear error for checkbox
    if (errors.accepted) {
      setErrors(prev => ({ ...prev, accepted: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) {
      newErrors.full_name = "Name is required";
    } else if (!nameRegex.test(formData.full_name)) {
      newErrors.full_name = "Please enter a valid name";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!phoneRegex[formData.country_code]?.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }
    
    if (!formData.accepted) {
      newErrors.accepted = "You must agree to receive communications";
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
      }, 1800);
      
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
      setFormSubmitted(true);
      
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
        setFormSubmitted(false);
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          country_code: "IN",
          accepted: false,
        });
      }, 2500);
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
      setFormSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await downloadBrochure();
  };

  const handleModalClick = (e) => {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation();
  };
  
  // Return to course card view (for flip card mode)
  const handleBackToCard = (e) => {
    e.preventDefault();
    setIsFlipped(false);
    setTimeout(() => {
      onClose();
    }, 600); // Match animation duration
  };

  if (!isOpen) return null;

  // Handle flip card mode
  if (flipCard) {
    return (
      <div className={`flip-container ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '400px' }}>
        <div className="flipper">
          <div className="front">
            {/* This is where the CourseCard content would be displayed */}
            {children}
          </div>
          <div className="back bg-white dark:bg-gray-800 rounded-xl shadow-xl" style={{ zIndex: isFlipped ? 3 : 1 }}>
            <div className="flex flex-col h-full p-5">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Download Brochure</h2>
                  {courseTitle && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">{courseTitle}</p>
                  )}
                </div>
                <button 
                  onClick={handleBackToCard} 
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>

              {/* Simplify to standard form layout without flex-1 and overflow */}
              {isAuthenticated ? (
                <div className="text-center py-8">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4 mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Opening brochure...</p>
                    </div>
                  ) : downloadSuccess ? (
                    <div className="text-center text-green-600 animate-fadeIn">
                      <CheckCircle size={40} className="mx-auto mb-4 text-green-500" />
                      <p className="text-gray-800 dark:text-gray-200 font-medium">Brochure opened!</p>
                    </div>
                  ) : (
                    <div>
                      <Download size={30} className="mx-auto mb-4 text-indigo-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                        Click below to download the course brochure
                      </p>
                      <button
                        onClick={handleDirectDownload}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 text-sm font-medium sheen"
                      >
                        Download Now
                      </button>
                    </div>
                  )}
                </div>
              ) : formSubmitted && downloadSuccess ? (
                <div className="text-center py-8 animate-fadeIn">
                  <Mail size={40} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Brochure Sent!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent the brochure to <span className="font-semibold">{formData.email}</span>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                  <div>
                    <label htmlFor="flip_full_name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    {errors.full_name && <span className="text-xs text-red-500 float-right">{errors.full_name}</span>}
                    <input
                      type="text"
                      id="flip_full_name"
                      name="full_name"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-sm border ${errors.full_name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
                    />
                  </div>

                  <div>
                    <label htmlFor="flip_email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    {errors.email && <span className="text-xs text-red-500 float-right">{errors.email}</span>}
                    <input
                      type="email"
                      id="flip_email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-sm border ${errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
                    />
                  </div>

                  <div>
                    <label htmlFor="flip_phone" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    {errors.phone_number && <span className="text-xs text-red-500 float-right">{errors.phone_number}</span>}
                    <input
                      type="tel"
                      id="flip_phone"
                      name="phone_number"
                      placeholder="Enter your phone number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-sm border ${errors.phone_number ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="flip_accepted"
                        name="accepted"
                        checked={formData.accepted}
                        onChange={handleCheckboxChange}
                        className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 ${errors.accepted ? 'border-red-300' : ''}`}
                      />
                      <div>
                        <label htmlFor="flip_accepted" className="text-xs text-gray-600 dark:text-gray-300">
                          I agree to receive communications from Medh
                        </label>
                        {errors.accepted && <p className="mt-0.5 text-xs text-red-500">{errors.accepted}</p>}
                      </div>
                    </div>
                  </div>
                  
                  {errors.general && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                  )}
                  
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 w-full disabled:opacity-75 sheen"
                      style={{ position: isMobile ? 'sticky' : undefined, bottom: isMobile ? 0 : undefined, zIndex: isMobile ? 50 : undefined }}
                    >
                      {loading ? (
                        <>
                          <span className="mr-2 h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download size={16} className="text-indigo-500" />
                          Get Brochure
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, don't show the form - it will be handled via useEffect
  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
        <div 
          className="relative w-[95%] sm:w-[400px] p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all animate-scaleIn modal-content-responsive"
          onClick={handleModalClick}
        >
          <div className="flex justify-between items-center border-b pb-4 mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white modal-title-responsive">Opening Brochure</h2>
            <button onClick={onClose} aria-label="Close" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="text-center p-6 sm:p-8 modal-padding-responsive">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-5"></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Opening brochure in a new tab...</p>
                <p className="text-sm text-gray-500 mt-3">If nothing happens, please check your popup blocker.</p>
              </div>
            ) : downloadSuccess ? (
              <div className="text-center text-green-600 py-6 animate-fadeIn">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600 dark:text-green-500" />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Brochure opened!</p>
                <p className="text-gray-600 dark:text-gray-400">We've opened the brochure in a new tab.</p>
              </div>
            ) : (
              <div className="text-red-500 py-5">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-600 dark:text-red-500" />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Something went wrong</p>
                <p className="text-gray-600 dark:text-gray-400 mb-5">{errors.general || "Failed to open brochure"}</p>
                <button
                  onClick={handleDirectDownload}
                  className="mt-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20 sheen"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate appropriate z-index based on context
  const zIndexValue = inlineForm ? 'z-[1000]' : 'z-[900]';
  
  const containerClass = inlineForm
    ? `absolute inset-0 ${zIndexValue} flex items-center justify-center`
    : `fixed inset-0 ${zIndexValue} flex items-center justify-center`;
    
  const contentClass = inlineForm
    ? "w-11/12 max-w-md p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all animate-scaleIn modal-content-responsive"
    : "relative w-[95%] sm:w-[450px] max-h-[95vh] overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all animate-scaleIn modal-content-responsive";

  return (
    <div className={containerClass}>
      {!inlineForm && (
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" 
          onClick={onClose} 
        />
      )}
      <div 
        className={contentClass} 
        onClick={handleModalClick}
        style={inlineForm ? {position: 'absolute', zIndex: 1000} : {}}
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white modal-title-responsive">Download Brochure</h2>
            {courseTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">{courseTitle}</p>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {formSubmitted && downloadSuccess ? (
          <div className="py-8 animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Mail size={36} className="text-green-600 dark:text-green-500" />
            </div>
            <div className="text-center px-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Brochure Sent!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                We've sent the brochure to <span className="font-semibold">{formData.email}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please check your inbox and spam folder if you don't see it.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center bg-gradient-to-r from-purple-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-5 rounded-lg">
              <div className="mb-3 text-indigo-600 dark:text-indigo-400">
                <Download size={24} className="mx-auto mb-3" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Please login to download the course brochure directly, or fill in your details below to receive it via email.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  {errors.full_name && <span className="text-xs text-red-500">{errors.full_name}</span>}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-sm border ${errors.full_name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-sm border ${errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  {errors.phone_number && <span className="text-xs text-red-500">{errors.phone_number}</span>}
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    placeholder="Enter your phone number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-sm border ${errors.phone_number ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="accepted"
                      name="accepted"
                      checked={formData.accepted}
                      onChange={handleCheckboxChange}
                      className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${errors.accepted ? 'border-red-300' : ''}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="accepted" className="text-sm text-gray-600 dark:text-gray-300">
                      I agree to receive the brochure and communications from Medh
                    </label>
                    {errors.accepted && <p className="mt-1.5 text-xs text-red-500">{errors.accepted}</p>}
                  </div>
                </div>
              </div>
              
              {errors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fadeIn">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}
              
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 w-full disabled:opacity-75 sheen"
                  style={{ position: isMobile ? 'sticky' : undefined, bottom: isMobile ? 0 : undefined, zIndex: isMobile ? 50 : undefined }}
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={16} className="text-indigo-500" />
                      Get Brochure
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// Add style to document if in browser environment
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

export default DownloadBrochureModal;
