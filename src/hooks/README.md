# Medh Custom React Hooks

This directory contains reusable custom React hooks for the Medh application. These hooks follow modern React best practices and are fully typed with TypeScript.

## Table of Contents

- [Input Hooks](#input-hooks)
- [Data Fetching Hooks](#data-fetching-hooks)
- [DOM Interaction Hooks](#dom-interaction-hooks)
- [Storage Hooks](#storage-hooks)
- [Error Handling Hooks](#error-handling-hooks)
- [Navigation Hooks](#navigation-hooks)
- [UI/UX Hooks](#uiux-hooks)
- [Authentication Hooks](#authentication-hooks)

## Input Hooks

### useDebounce

Delays updates for rapidly changing values, useful for search inputs.

```tsx
import { useDebounce } from '@/hooks';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // API call will only happen 500ms after the user stops typing
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

### useThrottle

Limits how frequently a value is updated, useful for scroll/resize events.

```tsx
import { useThrottle } from '@/hooks';

const ScrollComponent = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const throttledPosition = useThrottle(scrollPosition, 200);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // This will only update at most once every 200ms
  useEffect(() => {
    console.log('Throttled scroll position:', throttledPosition);
  }, [throttledPosition]);
  
  return <div>Scroll position: {throttledPosition}</div>;
};
```

### usePrevious

Tracks and provides the previous value of a state or prop.

```tsx
import { usePrevious } from '@/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}, Previous: {previousCount ?? 'None'}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## Data Fetching Hooks

### useFetch

Standardizes API calls by handling loading, error, and data states.

```tsx
import { useFetch } from '@/hooks';

const DataComponent = () => {
  const { data, isLoading, error, refetch } = useFetch<User[]>('/api/users', {
    responseType: 'json',
    retryCount: 3,
    onSuccess: (data) => console.log('Data loaded:', data),
    onError: (error) => console.error('Error loading data:', error)
  });
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data?.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};
```

## DOM Interaction Hooks

### useClickOutside

Detects clicks outside a designated element, useful for closing modals or dropdowns.

```tsx
import { useRef } from 'react';
import { useClickOutside } from '@/hooks';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && (
        <div ref={dropdownRef} className="dropdown">
          Dropdown content
        </div>
      )}
    </div>
  );
};
```

### useIntersectionObserver

Observes when an element enters/leaves the viewport (for lazy-loading, animations, etc.).

```tsx
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks';

const LazyImage = ({ src, alt }) => {
  const imgRef = useRef(null);
  const { isIntersecting } = useIntersectionObserver(imgRef, {
    triggerOnce: true,
    rootMargin: '200px'
  });
  
  return (
    <div ref={imgRef}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
};
```

## Storage Hooks

### useLocalStorage

Synchronizes state with localStorage for persistent data storage.

```tsx
import { useLocalStorage } from '@/hooks';

const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
};
```

### useStorage

Centralized storage hook for managing user data, course progress, and application preferences.

See `src/contexts/StorageContext.md` for detailed documentation.

## Error Handling Hooks

### useErrorBoundary

Captures and manages errors within components, providing a way to reset error state.

```tsx
import { useErrorBoundary } from '@/hooks';

const ErrorProne = () => {
  const { error, hasError, captureError, resetError } = useErrorBoundary({
    maxErrorCount: 3,
    logErrors: true
  });
  
  const handleRiskyOperation = () => {
    try {
      // Risky operation
      throw new Error('Something went wrong');
    } catch (err) {
      captureError(err);
    }
  };
  
  if (hasError) {
    return (
      <div className="error-container">
        <p>Error: {error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  }
  
  return (
    <button onClick={handleRiskyOperation}>
      Perform risky operation
    </button>
  );
};
```

## Navigation Hooks

### usePathMatch (formerly useIsTrue)

Checks if the current path matches a given path with various matching options.

```tsx
import { usePathMatch } from '@/hooks';

const NavLink = ({ href, children }) => {
  const isActive = usePathMatch(href);
  const isSectionActive = usePathMatch(href, { exact: false });
  
  return (
    <a href={href} className={isActive ? 'active' : ''}>
      {children}
      {isSectionActive && !isActive && ' (In this section)'}
    </a>
  );
};
```

## UI/UX Hooks

### useMediaQuery

Listens for viewport changes to enable responsive behavior.

```tsx
import { useMediaQuery } from '@/hooks';

const ResponsiveComponent = () => {
  const { matches: isMobile } = useMediaQuery('(max-width: 768px)');
  const { matches: isDarkMode } = useMediaQuery('(prefers-color-scheme: dark)');
  
  return (
    <div>
      <p>You are viewing this on a {isMobile ? 'mobile' : 'desktop'} device.</p>
      <p>Your system preference is {isDarkMode ? 'dark' : 'light'} mode.</p>
    </div>
  );
};
```

### useScrollDirection

Detects scroll direction with various configuration options.

```tsx
import { useScrollDirection } from '@/hooks';

const Header = () => {
  const scrollDirection = useScrollDirection({
    thresholdPixels: 50,
    resetWhenStill: true
  });
  
  return (
    <header className={`sticky-header ${scrollDirection === 'down' ? 'hidden' : ''}`}>
      Site header
    </header>
  );
};
```

## Authentication Hooks

### useAuth

Centralizes authentication logic, including token management and session validation.

```tsx
import { useAuth } from '@/hooks';

const Profile = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in to view your profile</p>
        <button onClick={() => login()}>Log in</button>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
};
```

### useRequireAuth

Redirects unauthenticated users to the login page.

```tsx
import { useRequireAuth } from '@/hooks';

const ProtectedPage = () => {
  const { user, loading } = useRequireAuth();
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
};
```

## useRazorpay

A custom hook for integrating with the Razorpay payment gateway. It handles script loading, checkout initialization, and provides error handling.

### Usage

```tsx
import { useRazorpay } from '@/hooks';
import RAZORPAY_CONFIG, { USD_TO_INR_RATE } from '@/config/razorpay';

const MyComponent = () => {
  const { openRazorpayCheckout, isLoading, error } = useRazorpay();

  const handlePayment = async () => {
    try {
      await openRazorpayCheckout({
        ...RAZORPAY_CONFIG,
        amount: 1000 * 100 * USD_TO_INR_RATE, // Convert to paise and apply exchange rate
        name: 'Product Name',
        description: 'Payment for Product',
        handler: function(response) {
          console.log('Payment successful', response);
          // Handle successful payment
        }
      });
    } catch (error) {
      console.error('Payment failed', error);
      // Handle payment failure
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};
```

### API

#### Return Values

| Name | Type | Description |
|------|------|-------------|
| `loadRazorpayScript` | `() => Promise<boolean>` | Loads the Razorpay script manually. Returns `true` if successful. |
| `openRazorpayCheckout` | `(options: RazorpayOptions) => Promise<void>` | Opens the Razorpay checkout with the provided options. Automatically loads the script if needed. |
| `isScriptLoaded` | `boolean` | Indicates if the Razorpay script has been loaded. |
| `isLoading` | `boolean` | Indicates if a loading operation is in progress. |
| `error` | `string \| null` | Error message if an error occurred, null otherwise. |

#### RazorpayOptions

See the `RazorpayOptions` interface in the hook for all available options.

#### Notes

- The hook automatically handles script loading when you call `openRazorpayCheckout`.
- There's a centralized config file at `src/config/razorpay.ts` for common settings.
- For production, use environment variables for the Razorpay key. 