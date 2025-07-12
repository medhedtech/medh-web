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
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  useEffect(() => {
    // Optionally pre-fill if user data is available (e.g., from local storage or context)
    const storedName = localStorage.getItem('fullName') || '';
    const storedEmail = localStorage.getItem('userEmail') || '';
    const storedPhone = localStorage.getItem('phoneNumber') || '';
    setFormData(prev => ({
      ...prev,
      fullName: storedName,
      email: storedEmail,
      phoneNumber: storedPhone,
    }));

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\s-()+.]{7,15}$/.test(formData.phoneNumber)) {
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
      // POST to the required endpoint
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.countryCode + formData.phoneNumber,
        course_title: courseTitle || '',
      };
      const response = await fetch('http://localhost:8080/api/v1/broucher/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to submit brochure request');
      let emailToShow = formData.email;
      try {
        const data = await response.json();
        if (data && data.email) {
          emailToShow = data.email;
        }
      } catch (err) {
        // ignore JSON parse error, fallback to form value
      }
      setSentEmail(emailToShow);
      setIsSubmitted(true);
      toast.success('Brochure request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit brochure request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Download Brochure</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Please fill in your details below to receive the brochure for this course via email.</p>
        {courseTitle && <div className="mb-4 text-base font-semibold text-primary-700 dark:text-primary-300">{courseTitle}</div>}
        {isSubmitted ? (
          <div className="flex flex-col items-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Brochure Sent!</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">We've sent the brochure to <span className="font-semibold">{sentEmail || formData.email}</span></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 text-sm border ${errors.fullName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
              />
              {errors.fullName && <span className="text-xs text-red-500">{errors.fullName}</span>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 text-sm border ${errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg text-sm text-gray-700 dark:text-gray-300 select-none">+91</span>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 text-sm border-l-0 border ${errors.phoneNumber ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200`}
                />
              </div>
              {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber}</span>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agreedToTerms" className="text-xs text-gray-700 dark:text-gray-300">I agree to receive the brochure and communications from Medh</label>
              {errors.agreedToTerms && <span className="text-xs text-red-500 ml-2">{errors.agreedToTerms}</span>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg font-semibold text-base transition-all duration-300 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isSubmitting ? 'Sending...' : 'Get Brochure'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DownloadBrochureModal;