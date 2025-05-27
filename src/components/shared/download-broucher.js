import { useState, useEffect } from "react";
import { X, Download, ArrowRight, Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { apiBaseUrl, apiUrls } from "@/apis";
import useAuth from "@/hooks/useAuth";

// Modify animation styles to create a slide-in/overlay effect rather than a complete flip
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

@keyframes slideOverIn {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideOverInMobile {
  0% { transform: translateY(70%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideOverOut {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

@keyframes slideOverOutMobile {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(70%); opacity: 0; }
}

.overlay-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.content-visible {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.3s ease;
}

.content-hidden {
  opacity: 0.3;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.overlay-visible {
  animation: slideOverIn 0.4s ease forwards;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.overlay-visible-mobile {
  animation: slideOverInMobile 0.3s ease forwards;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
}

.overlay-hidden {
  animation: slideOverOut 0.4s ease forwards;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
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

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.mobile-form-container {
  max-height: 90vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom, 16px);
  backdrop-filter: blur(8px);
}

/* Touch-friendly mobile styles */
@media (max-width: 640px) {
  .touch-target {
    min-height: 44px;
  }
  
  .mobile-header {
    backdrop-filter: blur(4px);
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
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

/**
 * DownloadBrochureModal Component
 * 
 * Supports multiple brochure download methods:
 * 1. Direct brochure URLs from course object (course.brochures array)
 * 2. API-based download using courseId or brochureId
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {string} courseTitle - Course title (optional, can be derived from course object)
 * @param {string} brochureId - ID for API-based brochure download
 * @param {string} courseId - ID for API-based course brochure download
 * @param {object} course - Course object containing brochures array with direct URLs
 * @param {boolean} inlineForm - Whether to display as inline form
 * @param {boolean} flipCard - Whether to use flip card animation
 * @param {ReactNode} children - Child components for flip card mode
 */
const DownloadBrochureModal = ({
  isOpen,
  onClose,
  courseTitle,
  brochureId,
  courseId,
  course = null, // New prop for course object with brochures array
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

  // Add cardMode for compact styles in flipCard mode
  const cardMode = !!flipCard;

  // Get effective course title from props or course object
  const effectiveCourseTitle = courseTitle || (course && course.course_title) || '';

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

  // Warn if neither courseId, brochureId, nor course with brochures is provided
  useEffect(() => {
    if (isOpen && !courseId && !brochureId && (!course || !course.brochures || course.brochures.length === 0)) {
      console.error("DownloadBrochureModal: Missing courseId, brochureId, or course with brochures array");
    }
  }, [isOpen, courseId, brochureId, course]);

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

  // Function for direct brochure URL download (for courses with brochures array)
  const handleDirectBrochureDownload = async () => {
    try {
      setLoading(true);
      
      if (course && course.brochures && course.brochures.length > 0) {
        console.log('Opening brochure from direct URL...');
        
        // Get the first brochure URL (you can modify this logic to handle multiple brochures)
        const brochureUrl = course.brochures[0];
        
        // Open the direct brochure URL in a new tab
        const newTab = window.open('about:blank', '_blank');
        
        if (newTab) {
          newTab.location = brochureUrl;
        } else {
          // Fallback - this might be blocked by popup blockers
          window.open(brochureUrl, '_blank');
        }
        
        console.log('Brochure opened from direct URL');
        setDownloadSuccess(true);
        
        // Close the modal after a short delay
        setTimeout(() => {
          onClose();
          setDownloadSuccess(false);
        }, 1800);
        
        setLoading(false);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error opening brochure from direct URL:', err);
      setLoading(false);
      setErrors(prev => ({ ...prev, general: "Failed to open brochure. Please try again." }));
      return false;
    }
  };

  // Function for direct download (authenticated users)
  const handleDirectDownload = async () => {
    try {
      setLoading(true);
      
      // Check if we have a course with direct brochure URLs first
      if (course && course.brochures && course.brochures.length > 0) {
        const success = await handleDirectBrochureDownload();
        if (success) return;
      }
      
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
      
      // Check if we have a course with direct brochure URLs
      if (course && course.brochures && course.brochures.length > 0) {
        // For courses with direct brochure URLs, we can still send via email
        // but we'll need to handle this differently or just direct download
        console.log('Course has direct brochure URLs, attempting direct download for non-authenticated user');
        
        // For now, let's direct download for non-authenticated users as well
        const brochureUrl = course.brochures[0];
        
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = brochureUrl;
        link.download = `${course.course_title || 'Course'}_Brochure.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
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
        
        return;
      }
      
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

  // Handle flip card mode (redesigned as overlay instead of flip)
  if (flipCard) {
    return (
      <div className="overlay-container">
        {/* Original card content always visible but dimmed when form is shown */}
        <div className={`${isFlipped ? 'content-hidden' : 'content-visible'}`}>
          {children}
        </div>

        {/* Form overlay slides in from bottom */}
        {isFlipped && (
          <div className={isMobile ? "overlay-visible-mobile bg-white/95 dark:bg-gray-800/95" : "overlay-visible bg-white dark:bg-gray-800 rounded-xl shadow-xl"}>
            <div className={`flex flex-col h-full ${isMobile ? 'p-3 pt-1 mobile-form-container' : 'p-4 pt-3'} justify-between`}>
              <div>
                <div className={`flex justify-between items-center ${isMobile ? 'mobile-header bg-white/90 dark:bg-gray-800/90 mb-2 pb-2 pt-1' : 'border-b border-gray-200 dark:border-gray-700 pb-2 mb-2'}`}>
                  <div>
                    <h2 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-900 dark:text-white`}>Download Brochure</h2>
                    {effectiveCourseTitle && (
                      <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400 truncate max-w-[180px]`}>{effectiveCourseTitle}</p>
                    )}
                  </div>
                  <button 
                    onClick={handleBackToCard} 
                    className={`${isMobile ? 'p-2 touch-target' : 'p-1.5'} text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors`}
                  >
                    <ArrowLeft size={isMobile ? 14 : 16} />
                  </button>
                </div>
                
                {/* Compact form and states for card mode - better centered */}
                {isAuthenticated ? (
                  <div className={`text-center ${isMobile ? 'py-3' : 'py-4'}`}>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-500 mb-2 mx-auto"></div>
                        <p className={`text-gray-600 dark:text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>Opening brochure...</p>
                      </div>
                    ) : downloadSuccess ? (
                      <div className="text-center text-green-600 animate-fadeIn">
                        <CheckCircle size={isMobile ? 24 : 28} className="mx-auto mb-2 text-green-500" />
                        <p className={`text-gray-800 dark:text-gray-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>Brochure opened!</p>
                      </div>
                    ) : (
                      <div>
                        <Download size={isMobile ? 20 : 24} className="mx-auto mb-2 text-indigo-500" />
                        <p className={`${isMobile ? 'text-[10px] mb-2' : 'text-xs mb-3'} text-gray-600 dark:text-gray-400`}>
                          Click below to download the course brochure
                        </p>
                        <button
                          onClick={handleDirectDownload}
                          className={`${isMobile ? 'px-3 py-2 text-xs touch-target' : 'px-4 py-2 text-sm'} bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 font-medium sheen`}
                        >
                          Download Now
                        </button>
                      </div>
                    )}
                  </div>
                ) : formSubmitted && downloadSuccess ? (
                  <div className={`text-center ${isMobile ? 'py-3' : 'py-4'} animate-fadeIn`}>
                    <Mail size={isMobile ? 24 : 28} className="mx-auto mb-2 text-green-500" />
                    <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-900 dark:text-white mb-1`}>Brochure Sent!</h3>
                    <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
                      We've sent the brochure to <span className="font-semibold">{formData.email}</span>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={`${isMobile ? 'space-y-2.5 py-0' : 'space-y-2.5 py-1'}`}>
                    <div>
                      <label htmlFor="flip_full_name" className={`block ${isMobile ? 'text-[11px] mb-0.5' : 'text-xs mb-1'} font-medium text-gray-700 dark:text-gray-300`}>Full Name</label>
                      {errors.full_name && <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-500 float-right`}>{errors.full_name}</span>}
                      <input
                        type="text"
                        id="flip_full_name"
                        name="full_name"
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full ${isMobile ? 'px-3 py-2 text-xs touch-target' : 'px-3 py-2 text-sm'} border ${errors.full_name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
                      />
                    </div>
                    <div>
                      <label htmlFor="flip_email" className={`block ${isMobile ? 'text-[11px] mb-0.5' : 'text-xs mb-1'} font-medium text-gray-700 dark:text-gray-300`}>Email Address</label>
                      {errors.email && <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-500 float-right`}>{errors.email}</span>}
                      <input
                        type="email"
                        id="flip_email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full ${isMobile ? 'px-3 py-2 text-xs touch-target' : 'px-3 py-2 text-sm'} border ${errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
                      />
                    </div>
                    <div>
                      <label htmlFor="flip_phone" className={`block ${isMobile ? 'text-[11px] mb-0.5' : 'text-xs mb-1'} font-medium text-gray-700 dark:text-gray-300`}>Phone Number</label>
                      {errors.phone_number && <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-500 float-right`}>{errors.phone_number}</span>}
                      <input
                        type="tel"
                        id="flip_phone"
                        name="phone_number"
                        placeholder="Enter your phone number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={`w-full ${isMobile ? 'px-3 py-2 text-xs touch-target' : 'px-3 py-2 text-sm'} border ${errors.phone_number ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white`}
                      />
                    </div>
                    <div className={`${isMobile ? 'pt-0.5' : 'pt-1'}`}>
                      <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-2'}`}>
                        <input
                          type="checkbox"
                          id="flip_accepted"
                          name="accepted"
                          checked={formData.accepted}
                          onChange={handleCheckboxChange}
                          className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 ${errors.accepted ? 'border-red-300' : ''}`}
                        />
                        <div>
                          <label htmlFor="flip_accepted" className={`${isMobile ? 'text-[11px]' : 'text-xs'} text-gray-600 dark:text-gray-300`}>
                            I agree to receive communications from Medh
                          </label>
                          {errors.accepted && <p className={`mt-0.5 ${isMobile ? 'text-[10px]' : 'text-xs'} text-red-500`}>{errors.accepted}</p>}
                        </div>
                      </div>
                    </div>
                    {errors.general && (
                      <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg`}>
                        <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-600 dark:text-red-400`}>{errors.general}</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
              
              {/* Move button to bottom for better positioning */}
              {!isAuthenticated && !formSubmitted && (
                <div className={`${isMobile ? 'pb-4 pt-3' : 'pb-2 pt-1'}`}>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full ${isMobile ? 'py-2.5 px-4 text-sm touch-target' : 'py-2 px-4 text-sm'} font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-75 flex items-center justify-center shadow-md shadow-indigo-500/20 sheen`}
                  >
                    {loading ? (
                      <>
                        <span className={`${isMobile ? 'mr-2 h-3.5 w-3.5' : 'mr-2 h-3.5 w-3.5'} rounded-full border-2 border-white border-t-transparent animate-spin`}></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Get Brochure
                        <ArrowRight size={isMobile ? 16 : 16} className={`${isMobile ? 'ml-2' : 'ml-2'}`} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // If authenticated, don't show the form - it will be handled via useEffect
  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
        <div 
          className="relative w-[95%] sm:w-[400px] p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all animate-scaleIn modal-content-responsive border border-gray-200 dark:border-gray-700 download-brochure-modal"
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
        className={`${contentClass} border border-gray-200 dark:border-gray-700 download-brochure-modal`} 
        onClick={handleModalClick}
        style={inlineForm ? {position: 'absolute', zIndex: 1000} : {}}
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white modal-title-responsive">Download Brochure</h2>
            {effectiveCourseTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">{effectiveCourseTitle}</p>
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
                  className="w-full py-3 px-5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-75 flex items-center justify-center shadow-md shadow-indigo-500/20 sheen"
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Brochure
                      <ArrowRight size={16} className="ml-2" />
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