# Currency Implementation Guide

## Overview
This document provides details about the currency conversion functionality implemented in the Medh ed-tech platform. The system allows users to view prices in their local currency based on their browser's locale or by manually selecting their preferred currency.

## Key Components

### 1. CurrencyContext (`src/contexts/CurrencyContext.js`)
The core of the currency functionality is a context provider that handles:
- Auto-detection of the user's locale and mapping it to an appropriate currency
- Saving currency preferences in cookies for returning users
- Converting prices from USD (base currency) to the user's selected currency
- Formatting prices with appropriate currency symbols

```jsx
// Example usage in components
import { useCurrency } from '@/contexts/CurrencyContext';

function MyComponent() {
  const { 
    convertPrice, 
    formatPrice, 
    changeCurrency, 
    getCurrentCurrency 
  } = useCurrency();
  
  // Convert a price
  const priceInUserCurrency = convertPrice(29.99);
  
  // Format a price with currency symbol
  const formattedPrice = formatPrice(priceInUserCurrency);
  
  // Get current currency info
  const { code, symbol, name } = getCurrentCurrency();
}
```

### 2. CurrencySelector (`src/components/shared/currency/CurrencySelector.js`)
A dropdown component that allows users to manually select their preferred currency.

- Mini version for nav/header use
- Full version for settings pages
- Visually indicates the currently selected currency

### 3. Utility Functions (`src/utils/priceUtils.js`)
Helper functions for working with prices:

- `formatPrice`: Formats a price with the appropriate currency symbol
- `calculateDiscountPercentage`: Calculates the percentage discount between two prices
- `isFreePrice`: Determines if a price should be displayed as "Free"
- `getFreeLabel`: Returns the label for free items

## Implementation Details

### Currency Detection Logic
1. First checks for a saved preference in cookies
2. If no saved preference, attempts to detect locale from `navigator.language`
3. Maps country codes to appropriate currencies (e.g., 'US' → 'USD', 'IN' → 'INR')
4. Defaults to USD if detection fails

### Currency Data Structure
```javascript
const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { symbol: "€", name: "Euro", rate: 0.91 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.78 },
  // ... more currencies
};
```

### Country-to-Currency Mapping
```javascript
const COUNTRY_CURRENCY_MAP = {
  US: 'USD', CA: 'CAD', GB: 'GBP', 
  IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', 
  IN: 'INR', AU: 'AUD', JP: 'JPY', SG: 'SGD',
  // ... more mappings
};
```

## Components Modified to Use Currency Context

1. **CourseCard** (`src/components/shared/courses/CourseCard.js`)
   - Used in course listings and search results
   - Displays converted and formatted prices

2. **CourseEnroll** (`src/components/shared/course-details/CourseEnroll.js`)
   - Used on course detail pages
   - Shows current price, original price, and discount percentage

3. **CourseHeader** (`src/components/layout/main/dashboards/CourseHeader.js`)
   - Shows the enrollment price in the user's selected currency
   
4. **CourseCard (sections)** (`src/components/sections/courses/CourseCard.js`)
   - Used in featured course sections
   - Implements a custom `formatPrice` function that leverages the currency context

## Future Development

### API Integration
For production, consider integrating with a currency API for real-time exchange rates:
- Options: Open Exchange Rates, Currency Layer, ExchangeRate-API
- Update rates daily or weekly and cache them

### Performance Considerations
- The context loads synchronously to avoid UI flickers
- Currency conversion happens on-the-fly with minimal performance impact
- Exchange rates are currently hardcoded but should be fetched from an API

### Adding New Currencies
To add a new currency:
1. Add it to the `CURRENCIES` object in `CurrencyContext.js`
2. Add any relevant country mappings to `COUNTRY_CURRENCY_MAP`

## Testing
- Test currency detection with different browser locales
- Verify that currency preferences are saved properly
- Ensure all price displays update correctly when changing currencies 