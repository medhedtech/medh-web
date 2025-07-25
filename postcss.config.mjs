/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // autoprefixer: {}, // Disabled due to dependency conflicts with React 19
  },
};

export default config;
