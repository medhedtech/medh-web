# Loading System Documentation

This document explains how to use the comprehensive loading system throughout your website.

## 🎯 Overview

The loading system provides:
- **Consistent UI**: Same loading animation across all pages
- **Multiple Variants**: Spinner, dots, pulse, bars
- **Flexible Sizing**: sm, md, lg, xl
- **Color Themes**: primary, secondary, white, gray
- **Global State Management**: Context-based loading states
- **TypeScript Support**: Full type safety

## 📦 Components Available

### 1. Basic Loading Component
```tsx
import { Loading } from '@/components/ui/loading';

<Loading 
  size="md" 
  variant="spinner" 
  text="Loading..." 
  color="primary" 
/>
```

### 2. Page Loading (Full Screen)
```tsx
import { PageLoading } from '@/components/ui/loading';

if (loading) {
  return <PageLoading text="Loading page..." size="lg" />;
}
```

### 3. Overlay Loading (Fixed Fullscreen)
```tsx
import { OverlayLoading } from '@/components/ui/loading';

{showOverlay && <OverlayLoading text="Processing..." />}
```

### 4. Inline Loading (Component Level)
```tsx
import { InlineLoading } from '@/components/ui/loading';

{loading ? <InlineLoading size="md" /> : <YourContent />}
```

### 5. Button Loading
```tsx
import { ButtonLoading } from '@/components/ui/loading';

<button disabled={loading}>
  {loading && <ButtonLoading size="sm" />}
  {loading ? 'Submitting...' : 'Submit'}
</button>
```

## 🌐 Global Loading Context

### Setup (Already Done)
The `LoadingProvider` is already added to your app in `src/app/Providers.tsx`.

### Usage
```tsx
import { useLoading, useApiLoading } from '@/contexts/LoadingContext';

// Basic global loading
const { showLoading, hideLoading } = useLoading();

const handleAction = () => {
  showLoading('Processing your request...');
  // Do something
  hideLoading();
};

// API calls with automatic loading
const { withLoading } = useApiLoading();

const fetchData = async () => {
  const result = await withLoading(
    () => fetch('/api/data').then(res => res.json()),
    'Fetching data...'
  );
  return result;
};
```

## 🎨 Customization Options

### Sizes
- `sm`: 16x16px (w-4 h-4)
- `md`: 32x32px (w-8 h-8) - Default
- `lg`: 48x48px (w-12 h-12)
- `xl`: 64x64px (w-16 h-16)

### Variants
- `spinner`: Classic spinning circle (Default)
- `dots`: Three bouncing dots
- `pulse`: Pulsing circle
- `bars`: Animated bars

### Colors
- `primary`: Uses your primary theme color
- `secondary`: Uses your secondary theme color
- `white`: White loading indicator (for dark backgrounds)
- `gray`: Gray loading indicator

## 📋 Common Use Cases

### 1. Page Loading
```tsx
const MyPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch page data
    fetchPageData().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PageLoading text="Loading page content..." size="lg" />;
  }

  return <div>Your page content</div>;
};
```

### 2. Form Submission
```tsx
const MyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitForm(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting && <ButtonLoading size="sm" />}
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

### 3. Data Tables
```tsx
const DataTable = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const refreshData = async () => {
    setLoading(true);
    const newData = await fetchTableData();
    setData(newData);
    setLoading(false);
  };

  return (
    <table>
      <thead>...</thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={3}>
              <div className="flex justify-center py-8">
                <Loading text="Loading data..." size="md" />
              </div>
            </td>
          </tr>
        ) : (
          data.map(item => <tr key={item.id}>...</tr>)
        )}
      </tbody>
    </table>
  );
};
```

### 4. Card Components
```tsx
const InfoCard = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="card">
      {loading ? (
        <div className="flex justify-center p-8">
          <Loading text="Loading card..." size="md" />
        </div>
      ) : (
        <div>Card content</div>
      )}
    </div>
  );
};
```

### 5. Global API Loading
```tsx
const ApiComponent = () => {
  const { withLoading } = useApiLoading();
  const [data, setData] = useState(null);

  const loadData = async () => {
    const result = await withLoading(
      async () => {
        const response = await fetch('/api/data');
        return response.json();
      },
      'Fetching latest data...'
    );
    setData(result);
  };

  return (
    <div>
      <button onClick={loadData}>Load Data</button>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};
```

## 🔧 Migration Guide

### From Custom Loading to New System

**Before:**
```tsx
{loading && (
  <div className="flex justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)}
```

**After:**
```tsx
{loading && <Loading size="md" color="primary" />}
```

### From Page Loading to New System

**Before:**
```tsx
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading-spinner"></div>
    </div>
  );
}
```

**After:**
```tsx
if (loading) {
  return <PageLoading text="Loading..." size="lg" />;
}
```

## 🎯 Best Practices

1. **Use appropriate sizes**: `sm` for buttons, `md` for components, `lg` for pages
2. **Provide meaningful text**: Tell users what's loading
3. **Use global loading for API calls**: Prevents multiple loading states
4. **Match colors to context**: Use `white` on dark backgrounds
5. **Keep loading states consistent**: Use the same variant throughout your app

## 🚀 Performance Tips

- The loading components are lightweight and optimized
- Use `PageLoading` for initial page loads
- Use `InlineLoading` for component-level loading
- Use global context for API calls to prevent UI flickering
- Loading animations use CSS animations for better performance

## 📱 Responsive Design

All loading components are responsive and work well on:
- Mobile devices (360px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

The loading text automatically adjusts font size and spacing for different screen sizes. 