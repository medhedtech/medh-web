# Theme Context Documentation

The Theme Context provides theme management functionality throughout the Medh application, supporting light and dark themes.

## Features

- **Theme Options**: Support for light and dark themes
- **Light Theme Default**: Light theme is the default
- **Theme Persistence**: Saves theme preference to localStorage
- **SSR Compatibility**: Designed to work with server-side rendering

## Usage

### Basic Usage with Hook

The simplest way to use the theme context is through the `useTheme` hook:

```tsx
import { useTheme } from '@/hooks';

function ThemeToggle() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={`p-2 rounded ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

### Available Theme Values

- `light`: Light theme (default)
- `dark`: Dark theme

### Theme Context API

The Theme Context provides the following properties and methods:

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `'light' \| 'dark'` | The currently selected theme |
| `setTheme` | `(theme: 'light' \| 'dark') => void` | Function to set a specific theme |
| `resolvedTheme` | `'light' \| 'dark'` | The actual theme being applied |
| `isDark` | `boolean` | Whether the current theme is dark |
| `toggleTheme` | `() => void` | Toggle between light and dark themes |

### Manually Setting Theme

You can manually set the theme to any of the available options:

```tsx
import { useTheme } from '@/hooks';

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <h3>Choose Theme</h3>
      <select 
        value={theme} 
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

### Using with Tailwind CSS

The Theme Context automatically adds or removes the `dark` class on the `html` element, making it compatible with Tailwind's dark mode when configured with the `class` strategy.

Make sure your `tailwind.config.js` includes:

```js
module.exports = {
  darkMode: 'class',
  // other config
}
```

Then use Tailwind's dark mode variants in your components:

```tsx
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">
  This element will adapt to the current theme
</div>
```

## Implementation Details

- The theme context uses `localStorage` to persist theme preferences
- When the theme changes, it updates the `dark` class on the document root element for CSS styling
- The context is wrapped with the `'use client'` directive for Next.js compatibility 