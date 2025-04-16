import React, { useState, useEffect } from 'react';
import { X, Download, ArrowLeft } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

interface DownloadBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
  courseTitle?: string;
  courseId?: string;
  flipCard?: boolean;
  onSubmit?: (data: FormData) => Promise<void>;
}

const DownloadBrochureModal: React.FC<DownloadBrochureModalProps> = ({ 
  isOpen, 
  onClose, 
  className = "", 
  children, 
  courseTitle = "Course Brochure",
  courseId,
  flipCard = false,
  onSubmit 
}) => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ fullName: '', email: '', phone: '' });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Add styles for flip card animation
  const flipCardStyles = `
    .flip-card-container {
      perspective: 1000px;
      width: 100%;
      height: 100%;
    }

    .flip-card {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .flip-card.flipped {
      transform: rotateY(180deg);
    }

    .flip-card-front,
    .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    .flip-card-back {
      transform: rotateY(180deg);
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }

    .shake {
      animation: shake 0.5s ease-in-out;
    }

    .form-transition {
      transition: all 0.3s ease;
    }

    .form-transition.loading {
      opacity: 0.7;
      pointer-events: none;
    }
  `;

  // Add style tag if it doesn't exist
  useEffect(() => {
    if (!document.getElementById('flip-card-styles')) {
      const style = document.createElement('style');
      style.id = 'flip-card-styles';
      style.textContent = flipCardStyles;
      document.head.appendChild(style);
      return () => {
        if (document.getElementById('flip-card-styles')) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || !/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className={`space-y-4 form-transition ${isSubmitting ? 'loading' : ''}`}>
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm shake">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-600 text-sm">
          Brochure download link has been sent to your email!
        </div>
      )}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400
            bg-white dark:bg-gray-800 transition-colors"
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400
            bg-white dark:bg-gray-800 transition-colors"
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400
            bg-white dark:bg-gray-800 transition-colors"
          placeholder="Enter your phone number"
          disabled={isSubmitting}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md
          ${isSubmitting 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-colors`}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            Processing...
          </>
        ) : (
          <>
            <Download size={16} />
            Download Brochure
          </>
        )}
      </button>
    </form>
  );

  if (flipCard) {
    return (
      <div className="flip-card-container">
        <div className={`flip-card ${isOpen ? 'flipped' : ''}`}>
          {/* Front side - Course Card */}
          <div className="flip-card-front">
            {children}
          </div>
          
          {/* Back side - Brochure Form */}
          <div className="flip-card-back">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full h-full relative overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Go back"
                    >
                      <ArrowLeft size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Download Course Brochure
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                
                {renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original modal view for non-flip card cases
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300 ease-in-out ${className}`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-auto relative z-10 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Download Course Brochure
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default DownloadBrochureModal; 