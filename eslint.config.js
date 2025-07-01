import nextConfig from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import globals from 'globals';
// Filter out globals with leading/trailing whitespace in keys
const filterGlobals = (globs) =>
  Object.fromEntries(
    Object.entries(globs).filter(([key]) => key.trim() === key)
  );

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...filterGlobals(globals.browser),
        ...filterGlobals(globals.node),
        ...filterGlobals(globals.es2021),
        JSX: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      '@next/next': nextConfig,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Next.js rules
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
      
      // React rules
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // General rules
      'no-console': 'warn',
    },
    settings: {
      next: {
        rootDir: '.',
      },
    },
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'public/**',
      'styles/**',
      '**/*.d.ts',
      'coverage/**',
      'dist/**',
    ],
  },
]; 