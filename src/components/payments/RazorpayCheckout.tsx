import React, { useState, useEffect } from 'react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { isCurrencySupported } from '@/config/razorpay';

/**
 * Props for the RazorpayCheckout component
 */
interface RazorpayCheckoutProps {
  /** Payment amount in the smallest currency unit (paise for INR) */
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
  const { processPayment, isLoading, error, resetError } = useRazorpay();
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

      // Create the payload
      const payload = {
        amount,
        currency: finalCurrency,
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
    <div className="razorpay-checkout-container">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`${className} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
        aria-busy={isLoading}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
      
      {hasError && errorMessage && (
        <div className="payment-error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default RazorpayCheckout; 