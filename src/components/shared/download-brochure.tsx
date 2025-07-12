import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle, Mail, Phone, User, BookOpen, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildAdvancedComponent, buildComponent, getResponsive } from '@/utils/designSystem';
import { clsx } from 'clsx';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string; // Added countryCode to form data
  agreedToTerms: boolean;
}

export interface DownloadBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  brochureId?: string;
  courseId?: string;
  course?: any;
}

const countryCodes = [
  { name: "United States", dial_code: "+1" },
  { name: "India", dial_code: "+91" },
  { name: "United Kingdom", dial_code: "+44" },
  { name: "Canada", dial_code: "+1" },
  { name: "Australia", dial_code: "+61" },
  { name: "Germany", dial_code: "+49" },
  { name: "France", dial_code: "+33" },
  { name: "Japan", dial_code: "+81" },
  { name: "China", dial_code: "+86" },
  { name: "Brazil", dial_code: "+55" },
  { name: "Mexico", dial_code: "+52" },
  { name: "South Africa", dial_code: "+27" },
  { name: "Afghanistan", dial_code: "+93" },
  { name: "Albania", dial_code: "+355" },
  { name: "Algeria", dial_code: "+213" },
  { name: "Andorra", dial_code: "+376" },
  { name: "Angola", dial_code: "+244" },
  { name: "Argentina", dial_code: "+54" },
  { name: "Armenia", dial_code: "+374" },
  { name: "Aruba", dial_code: "+297" },
  { name: "Austria", dial_code: "+43" },
  { name: "Azerbaijan", dial_code: "+994" },
  { name: "Bahamas", dial_code: "+1-242" },
  { name: "Bahrain", dial_code: "+973" },
  { name: "Bangladesh", dial_code: "+880" },
  { name: "Barbados", dial_code: "+1-246" },
  { name: "Belarus", dial_code: "+375" },
  { name: "Belgium", dial_code: "+32" },
  { name: "Belize", dial_code: "+501" },
  { name: "Benin", dial_code: "+229" },
  { name: "Bermuda", dial_code: "+1-441" },
  { name: "Bhutan", dial_code: "+975" },
  { name: "Bolivia", dial_code: "+591" },
  { name: "Bosnia and Herzegovina", dial_code: "+387" },
  { name: "Botswana", dial_code: "+267" },
  { name: "Bulgaria", dial_code: "+359" },
  { name: "Burkina Faso", dial_code: "+226" },
  { name: "Burundi", dial_code: "+257" },
  { name: "Cambodia", dial_code: "+855" },
  { name: "Cameroon", dial_code: "+237" },
  { name: "Cape Verde", dial_code: "+238" },
  { name: "Central African Republic", dial_code: "+236" },
  { name: "Chad", dial_code: "+235" },
  { name: "Chile", dial_code: "+56" },
  { name: "Colombia", dial_code: "+57" },
  { name: "Comoros", dial_code: "+269" },
  { name: "Congo", dial_code: "+242" },
  { name: "Costa Rica", dial_code: "+506" },
  { name: "Croatia", dial_code: "+385" },
  { name: "Cuba", dial_code: "+53" },
  { name: "Cyprus", dial_code: "+357" },
  { name: "Czech Republic", dial_code: "+420" },
  { name: "Denmark", dial_code: "+45" },
  { name: "Djibouti", dial_code: "+253" },
  { name: "Dominica", dial_code: "+1-767" },
  { name: "Dominican Republic", dial_code: "+1-809" },
  { name: "East Timor", dial_code: "+670" },
  { name: "Ecuador", dial_code: "+593" },
  { name: "Egypt", dial_code: "+20" },
  { name: "El Salvador", dial_code: "+503" },
  { name: "Equatorial Guinea", dial_code: "+240" },
  { name: "Eritrea", dial_code: "+291" },
  { name: "Estonia", dial_code: "+372" },
  { name: "Ethiopia", dial_code: "+251" },
  { name: "Fiji", dial_code: "+679" },
  { name: "Finland", dial_code: "+358" },
  { name: "Gabon", dial_code: "+241" },
  { name: "Gambia", dial_code: "+220" },
  { name: "Georgia", dial_code: "+995" },
  { name: "Ghana", dial_code: "+233" },
  { name: "Greece", dial_code: "+30" },
  { name: "Grenada", dial_code: "+1-473" },
  { name: "Guatemala", dial_code: "+502" },
  { name: "Guinea", dial_code: "+224" },
  { name: "Guinea-Bissau", dial_code: "+245" },
  { name: "Guyana", dial_code: "+592" },
  { name: "Haiti", dial_code: "+509" },
  { name: "Honduras", dial_code: "+504" },
  { name: "Hong Kong", dial_code: "+852" },
  { name: "Hungary", dial_code: "+36" },
  { name: "Iceland", dial_code: "+354" },
  { name: "Indonesia", dial_code: "+62" },
  { name: "Iran", dial_code: "+98" },
  { name: "Iraq", dial_code: "+964" },
  { name: "Ireland", dial_code: "+353" },
  { name: "Israel", dial_code: "+972" },
  { name: "Italy", dial_code: "+39" },
  { name: "Jamaica", dial_code: "+1-876" },
  { name: "Jordan", dial_code: "+962" },
  { name: "Kazakhstan", dial_code: "+7" },
  { name: "Kenya", dial_code: "+254" },
  { name: "Kuwait", dial_code: "+965" },
  { name: "Kyrgyzstan", dial_code: "+996" },
  { name: "Laos", dial_code: "+856" },
  { name: "Latvia", dial_code: "+371" },
  { name: "Lebanon", dial_code: "+961" },
  { name: "Lesotho", dial_code: "+266" },
  { name: "Liberia", dial_code: "+231" },
  { name: "Libya", dial_code: "+218" },
  { name: "Liechtenstein", dial_code: "+423" },
  { name: "Lithuania", dial_code: "+370" },
  { name: "Luxembourg", dial_code: "+352" },
  { name: "Macau", dial_code: "+853" },
  { name: "Madagascar", dial_code: "+261" },
  { name: "Malawi", dial_code: "+265" },
  { name: "Malaysia", dial_code: "+60" },
  { name: "Maldives", dial_code: "+960" },
  { name: "Mali", dial_code: "+223" },
  { name: "Malta", dial_code: "+356" },
  { name: "Mauritania", dial_code: "+222" },
  { name: "Mauritius", dial_code: "+230" },
  { name: "Mexico", dial_code: "+52" },
  { name: "Moldova", dial_code: "+373" },
  { name: "Monaco", dial_code: "+377" },
  { name: "Mongolia", dial_code: "+976" },
  { name: "Montenegro", dial_code: "+382" },
  { name: "Morocco", dial_code: "+212" },
  { name: "Mozambique", dial_code: "+258" },
  { name: "Myanmar", dial_code: "+95" },
  { name: "Namibia", dial_code: "+264" },
  { name: "Nepal", dial_code: "+977" },
  { name: "Netherlands", dial_code: "+31" },
  { name: "New Zealand", dial_code: "+64" },
  { name: "Nicaragua", dial_code: "+505" },
  { name: "Niger", dial_code: "+227" },
  { name: "Nigeria", dial_code: "+234" },
  { name: "North Korea", dial_code: "+850" },
  { name: "Norway", dial_code: "+47" },
  { name: "Oman", dial_code: "+968" },
  { name: "Pakistan", dial_code: "+92" },
  { name: "Palestine", dial_code: "+970" },
  { name: "Panama", dial_code: "+507" },
  { name: "Papua New Guinea", dial_code: "+675" },
  { name: "Paraguay", dial_code: "+595" },
  { name: "Peru", dial_code: "+51" },
  { name: "Philippines", dial_code: "+63" },
  { name: "Poland", dial_code: "+48" },
  { name: "Portugal", dial_code: "+351" },
  { name: "Puerto Rico", dial_code: "+1-787" },
  { name: "Qatar", dial_code: "+974" },
  { name: "Romania", dial_code: "+40" },
  { name: "Russia", dial_code: "+7" },
  { name: "Rwanda", dial_code: "+250" },
  { name: "San Marino", dial_code: "+378" },
  { name: "Saudi Arabia", dial_code: "+966" },
  { name: "Senegal", dial_code: "+221" },
  { name: "Serbia", dial_code: "+381" },
  { name: "Sierra Leone", dial_code: "+232" },
  { name: "Singapore", dial_code: "+65" },
  { name: "Slovakia", dial_code: "+421" },
  { name: "Slovenia", dial_code: "+386" },
  { name: "Somalia", dial_code: "+252" },
  { name: "South Korea", dial_code: "+82" },
  { name: "Spain", dial_code: "+34" },
  { name: "Sri Lanka", dial_code: "+94" },
  { name: "Sudan", dial_code: "+249" },
  { name: "Sweden", dial_code: "+46" },
  { name: "Switzerland", dial_code: "+41" },
  { name: "Syria", dial_code: "+963" },
  { name: "Taiwan", dial_code: "+886" },
  { name: "Tajikistan", dial_code: "+992" },
  { name: "Tanzania", dial_code: "+255" },
  { name: "Thailand", dial_code: "+66" },
  { name: "Togo", dial_code: "+228" },
  { name: "Tonga", dial_code: "+676" },
  { name: "Trinidad and Tobago", dial_code: "+1-868" },
  { name: "Tunisia", dial_code: "+216" },
  { name: "Turkey", dial_code: "+90" },
  { name: "Turkmenistan", dial_code: "+993" },
  { name: "Uganda", dial_code: "+256" },
  { name: "Ukraine", dial_code: "+380" },
  { name: "United Arab Emirates", dial_code: "+971" },
  { name: "Uruguay", dial_code: "+598" },
  { name: "Uzbekistan", dial_code: "+998" },
  { name: "Venezuela", dial_code: "+58" },
  { name: "Vietnam", dial_code: "+84" },
  { name: "Yemen", dial_code: "+967" },
  { name: "Zambia", dial_code: "+260" },
  { name: "Zimbabwe", dial_code: "+263" },
];


const DownloadBrochureModal = ({
  isOpen,
  onClose,
  courseTitle,
  brochureId, // Ensure brochureId is destructured here
  course = null,
  courseId, // Ensure courseId is destructured here
}: DownloadBrochureModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91', // Default country code
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Optionally pre-fill if user data is available (e.g., from local storage or context)
    const storedName = localStorage.getItem('fullName') || '';
    const storedEmail = localStorage.getItem('userEmail') || ''; // Changed from 'email' to 'userEmail'
    const storedPhone = localStorage.getItem('phoneNumber') || '';
    setFormData(prev => ({
      ...prev,
      fullName: storedName,
      email: storedEmail,
      phoneNumber: storedPhone,
    }));

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling on body
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false); // Reset form submission status when closed
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Ensure scroll is re-enabled on unmount/close
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors(prev => ({ ...prev, [name]: undefined })); // Clear error on input change
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}; // Corrected: removed extra ">".
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    // Updated phone number regex to be more flexible for international numbers
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\s-()+.]{7,15}$/.test(formData.phoneNumber)) { // Flexible regex for 7-15 digits, spaces, hyphens, parentheses, plus, dot
      newErrors.phoneNumber = 'Phone number is invalid';
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      // In a real application, you would send formData to your backend
      // For example: await axios.post('/api/download-brochure', { ...formData, courseId, brochureId });

      console.log('Form Data Submitted:', { ...formData, courseId, brochureId });

      // Save to local storage for future pre-filling
      localStorage.setItem('fullName', formData.fullName);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('phoneNumber', formData.phoneNumber);

      setIsSubmitted(true);
      toast.success('Brochure request submitted successfully!');
      // Optionally, trigger an actual download or send via email from backend
    } catch (error) {
      console.error('Brochure download error:', error);
      toast.error('Failed to submit brochure request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 z-[1000] flex justify-center overflow-y-auto pt-[10px] pb-4" // pt-[10px] for 10px from top, overflow-y-auto for scrollability
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          buildAdvancedComponent.glassCard({ variant: 'default' }), // Apply glassmorphism
          "relative rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-4 my-auto border border-gray-200 dark:border-gray-700"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
                Download Brochure
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Please fill in your details below to receive the brochure for{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {courseTitle || course?.title || 'this course'}
              </span>{' '}
              via email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className={clsx(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
                      "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
                      "py-2 px-3 pl-10", // Consistent padding for all inputs
                      errors.fullName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                    )}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className={clsx(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
                      "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
                      "py-2 px-3 pl-10", // Consistent padding for all inputs
                      errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                    )}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="sr-only">
                  Phone Number
                </label>
                <div className="relative flex">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className={clsx(
                      "py-2 px-3", // Base padding
                      "border border-gray-300 dark:border-gray-600 rounded-l-md", // Left border and rounded left
                      "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                      "focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base",
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    )}
                    disabled={isSubmitting}
                  >
                    {countryCodes.map((country, index) => (
                      <option key={`${country.name}-${country.dial_code}-${index}`} value={country.dial_code}>
                        {country.dial_code}
                      </option>
                    ))}
                  </select>
                  {/* Phone icon inside the input field */}
                  <div className="relative flex-grow"> {/* flex-grow to take remaining width */}
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className={clsx(
                        "block w-full rounded-r-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm", // Right border and rounded right
                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
                        "py-2 pr-3 pl-10", // Consistent padding, more padding-left for icon
                        errors.phoneNumber ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                      )}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="agreedToTerms"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  I agree to receive the brochure and communications from Medh
                </label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-xs -mt-3">{errors.agreedToTerms}</p>
              )}

              <button
                type="submit"
                className={buildComponent.button('primary', 'lg')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Get Brochure'}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-10"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your brochure request has been submitted. Please check your email for the brochure.
            </p>
            <button
              onClick={onClose}
              className={buildComponent.button('secondary', 'md')}
            >
              Close
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default DownloadBrochureModal;