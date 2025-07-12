interface RazorpayConfig {
  key: string;
  currency: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  prefillEnabled?: boolean;
  theme: {
    color: string;
  };
  notes: {
    address: string;
  };
}

// Currency configuration with supported currencies
interface CurrencyConfig {
  code: string;
  symbol: string;
  isSupported: boolean;
}

// Map of supported currencies for Razorpay
export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    isSupported: true
  },
  USD: {
    code: 'USD',
    symbol: '$',
    isSupported: true
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    isSupported: true
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    isSupported: true
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    isSupported: true
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    isSupported: true
  }
};

const RAZORPAY_CONFIG: RazorpayConfig = {
  key: "rzp_live_35wGO3X13yjE5S", // Replace with environment variable in production
  currency: "INR",
  prefill: {
    name: "Medh Student",
    email: "",
    contact: "",
  },
  prefillEnabled: true,
  notes: {
    address: "Razorpay address",
  },
  theme: {
    color: "#7ECA9D",
  },
};

/**
 * Creates a Razorpay configuration with user details
 * @param userId - User ID to get details for prefill
 * @param overrides - Optional overrides for any configuration values
 * @returns Razorpay configuration with user details
 */
export const getRazorpayConfigWithUserDetails = async (
  userId?: string,
  overrides: Partial<RazorpayConfig> = {}
): Promise<RazorpayConfig> => {
  try {
    // Start with the base config
    const config: RazorpayConfig = { ...RAZORPAY_CONFIG };

    // Check if prefill is enabled (can be overridden)
    const prefillEnabled = overrides.prefillEnabled !== undefined ? 
      overrides.prefillEnabled : config.prefillEnabled;

    // Only fetch and apply user details if prefill is enabled
    if (prefillEnabled) {
      // Try to get user details from localStorage if userId isn't provided
      if (!userId && typeof window !== "undefined") {
        userId = localStorage.getItem("userId") || undefined;
      }

      // If we have a userId, try to get user details
      if (userId) {
        let userDetails;

        // First check if user details are in localStorage
        if (typeof window !== "undefined") {
          const userData = localStorage.getItem("user");
          if (userData) {
            try {
              userDetails = JSON.parse(userData);
            } catch (err) {
              console.error("Error parsing user data:", err);
            }
          }
        }

        // If we have user details, update the prefill information
        if (userDetails) {
          config.prefill = {
            name: userDetails.full_name || userDetails.name || config.prefill.name,
            email: userDetails.email || config.prefill.email,
            contact: userDetails.phone_number || userDetails.phone || userDetails.contact || config.prefill.contact,
          };
        } else {
          // Fallback to API call if we don't have user details in localStorage
          try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1';
            const token = localStorage?.getItem("token");
            
            if (token) {
              const response = await fetch(`${apiBaseUrl}/auth/get/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                const user = data?.data || data?.data?.user;
                
                if (user) {
                  config.prefill = {
                    name: user.full_name || user.name || config.prefill.name,
                    email: user.email || config.prefill.email,
                    contact: user.phone_number || user.phone || user.contact || config.prefill.contact,
                  };
                }
              }
            }
          } catch (error) {
            console.error("Error fetching user details for Razorpay:", error);
          }
        }
      }
    } else {
      // If prefill is disabled, set empty values to ensure no prefill happens
      config.prefill = {
        name: "",
        email: "",
        contact: "",
      };
    }

    // Apply any overrides
    return {
      ...config,
      ...overrides,
      prefill: prefillEnabled ? 
        { ...config.prefill, ...(overrides.prefill || {}) } : 
        { name: "", email: "", contact: "" }, // Empty if disabled
      theme: {
        ...config.theme,
        ...(overrides.theme || {}),
      },
      notes: {
        ...config.notes,
        ...(overrides.notes || {}),
      },
    };
  } catch (error) {
    console.error("Error generating Razorpay config:", error);
    return { ...RAZORPAY_CONFIG, ...overrides };
  }
};

/**
 * Check if a currency is supported by Razorpay
 * @param currencyCode The currency code to check
 * @returns boolean indicating if the currency is supported
 */
export const isCurrencySupported = (currencyCode: string): boolean => {
  return SUPPORTED_CURRENCIES[currencyCode]?.isSupported || false;
};

/**
 * Get the currency symbol for a currency code
 * @param currencyCode The currency code to get the symbol for
 * @returns The currency symbol
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || currencyCode;
};

/**
 * Get a Razorpay config for a specific currency
 * @param currencyCode The currency code to use
 * @param userId Optional user ID for prefill
 * @param overrides Optional overrides for the config
 * @returns Razorpay configuration with the specified currency
 */
export const getRazorpayConfigForCurrency = async (
  currencyCode: string,
  userId?: string,
  overrides: Partial<RazorpayConfig> = {}
): Promise<RazorpayConfig> => {
  // Get the base config with user details
  const config = await getRazorpayConfigWithUserDetails(userId, overrides);
  
  // Only update the currency if it's supported
  if (isCurrencySupported(currencyCode)) {
    config.currency = currencyCode;
  } else {
    console.warn(`Currency ${currencyCode} is not supported by Razorpay, using INR instead`);
    config.currency = 'INR';
  }
  
  return config;
};

// USD to INR conversion rate (can be updated or fetched dynamically in production)
export const USD_TO_INR_RATE = 84.47;

// Add helper to select the correct Razorpay key (test/live/user)
export const getRazorpayKey = (userId?: string): string => {
  const testKey = process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY || "rzp_test_REPLACE_ME";
  const env = process.env.NEXT_PUBLIC_RAZORPAY_ENV || "live";
  if (env.toLowerCase() === "test") {
    if (!testKey || testKey.includes("REPLACE_ME")) return RAZORPAY_CONFIG.key;
    return testKey;
  }
  if (userId === "67cfe3a9a50dbb995b4d94da") {
    if (!testKey || testKey.includes("REPLACE_ME")) return RAZORPAY_CONFIG.key;
    return testKey;
  }
  return RAZORPAY_CONFIG.key;
};

// Unified config getter for all payment flows
export const getRazorpayConfig = (userId?: string, overrides: Partial<RazorpayConfig> = {}) => {
  const key = getRazorpayKey(userId);
  return {
    ...RAZORPAY_CONFIG,
    ...overrides,
    key,
    testMode: key !== RAZORPAY_CONFIG.key,
  };
};

export default RAZORPAY_CONFIG;