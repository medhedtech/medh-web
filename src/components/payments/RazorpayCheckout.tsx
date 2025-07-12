import React, { useState, useEffect } from 'react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { isCurrencySupported } from '@/config/razorpay';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';

/**
 * Props for the RazorpayCheckout component
 */
interface RazorpayCheckoutProps {
  /** Payment amount in rupees (backend will convert to paise) */
  amount: number;
  /** Course ID when payment type is 'course' */
  courseId?: string;
  /** Enrollment type (e.g., 'individual', 'corporate') */
  enrollmentType?: string;
  /** Plan ID when payment type is 'subscription' */
  planId?: string;
  /** Plan name for subscription plans */
  planName?: string;
  /** Duration type in months for subscription */
  durationType?: number;
  /** Payment type - 'course' or 'subscription' */
  paymentType: 'course' | 'subscription';
  /** Whether the course is self-paced */
  isSelfPaced?: boolean;
  /** Callback when payment is successful */
  onSuccess?: (data: any) => void;
  /** Callback when payment encounters an error */
  onError?: (message: string) => void;
  /** Custom button text */
  buttonText?: string;
  /** Custom CSS classes for the button */
  className?: string;
  /** Payment currency */
  currency?: string;
  /** Original price in original currency (for display) */
  originalPrice?: number;
  /** Price ID when payment is for a course with specific pricing */
  priceId?: string;
}

/**
 * A ready-to-use Razorpay checkout component for Medh that handles the complete payment flow
 * including order creation, user authentication, and payment verification.
 */
const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amount,
  courseId,
  enrollmentType = 'individual',
  planId,
  planName,
  durationType,
  paymentType = 'course',
  isSelfPaced = false,
  onSuccess,
  onError,
  buttonText = 'Pay Now',
  className = 'payment-button',
  currency = 'INR',
  originalPrice,
  priceId
}) => {
  const { processPayment, isLoading, error, resetError, testMode } = useRazorpay();
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Clear error state when component props change
  useEffect(() => {
    resetError();
    setHasError(false);
    setErrorMessage('');
  }, [amount, courseId, planId, resetError]);

  // Handle hook errors
  useEffect(() => {
    if (error) {
      setHasError(true);
      setErrorMessage(error);
      onError && onError(error);
    }
  }, [error, onError]);

  // Validate currency on component mount
  useEffect(() => {
    // Check if the provided currency is supported
    if (currency && !isCurrencySupported(currency)) {
      console.warn(`Currency ${currency} is not supported by Razorpay, will use INR instead`);
    }
  }, [currency]);

  const handlePayment = async () => {
    try {
      setHasError(false);
      
      // Prepare payload based on payment type
      let productInfo = {
        item_name: paymentType === 'course' ? 'Course Enrollment' : 'Subscription Plan',
        description: paymentType === 'course' 
          ? courseId ? `Enrollment for course ${courseId}` : 'Course Enrollment'
          : planName ? `Subscription plan: ${planName}` : 'Subscription Plan'
      };

      // Ensure currency is supported or default to INR
      const finalCurrency = isCurrencySupported(currency) ? currency : 'INR';

      // Generate a receipt ID that's <= 40 characters
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits
      const courseIdShort = (courseId || '').substring(0, 4);
      const planIdShort = (planId || '').substring(0, 4);
      const identifier = courseId ? courseIdShort : planIdShort;
      const receipt = `${paymentType[0]}_${identifier}_${timestamp}`;
      console.log('Generated receipt:', receipt, 'Length:', receipt.length);
      console.log('RazorpayCheckout - Amount being sent (in rupees):', amount);

      // Create the payload
      const payload = {
        amount,
        currency: finalCurrency,
        receipt: receipt,
        payment_type: paymentType,
        productInfo,
        ...(paymentType === 'course' && {
          course_id: courseId,
          enrollment_type: enrollmentType,
          is_self_paced: isSelfPaced,
          price_id: priceId,
          original_price: originalPrice,
          original_currency: currency
        }),
        ...(paymentType === 'subscription' && {
          plan_id: planId,
          plan_name: planName,
          duration_months: durationType
        })
      };

      // Process the payment
      await processPayment(
        payload,
        (data) => {
          onSuccess && onSuccess(data);
        },
        (message) => {
          setHasError(true);
          setErrorMessage(message);
          onError && onError(message);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setHasError(true);
      setErrorMessage(message);
      onError && onError(message);
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="razorpay-checkout-container w-full">
      {testMode && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg mb-4 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold">🧪 TEST MODE ACTIVE</span>
          </div>
          <p className="text-xs mt-1 opacity-90">
            You are using test Razorpay credentials. Use test cards for payment (e.g. 4111 1111 1111 1111, CVV 123, any future expiry).
          </p>
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-blue-500/25 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6" />
            {buttonText}
          </>
        )}
      </button>
      {hasError && errorMessage && (
        <div className="payment-error-message mt-3 text-red-600 bg-red-50 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-red-500" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default RazorpayCheckout; 