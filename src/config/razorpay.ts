interface RazorpayConfig {
  key: string;
  currency: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  notes: {
    address: string;
  };
}

const RAZORPAY_CONFIG: RazorpayConfig = {
  key: "rzp_test_Rz8NSLJbl4LBA5", // Replace with environment variable in production
  currency: "INR",
  prefill: {
    name: "Medh Student",
    email: "medh@student.com",
    contact: "9876543210",
  },
  notes: {
    address: "Razorpay address",
  },
  theme: {
    color: "#7ECA9D",
  },
};

// USD to INR conversion rate (can be updated or fetched dynamically in production)
export const USD_TO_INR_RATE = 84.47;

export default RAZORPAY_CONFIG; 