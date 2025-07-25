const path = require('path');

let tailwindcss, autoprefixer;

try {
  tailwindcss = require('tailwindcss');
} catch (error) {
  console.warn('Warning: TailwindCSS not found, trying alternative path...');
  try {
    tailwindcss = require(path.join(process.cwd(), 'node_modules', 'tailwindcss'));
  } catch (error2) {
    console.error('Error: Cannot find TailwindCSS module');
    throw error2;
  }
}

try {
  autoprefixer = require('autoprefixer');
} catch (error) {
  console.warn('Warning: Autoprefixer not found, trying alternative path...');
  try {
    autoprefixer = require(path.join(process.cwd(), 'node_modules', 'autoprefixer'));
  } catch (error2) {
    console.error('Error: Cannot find Autoprefixer module');
    throw error2;
  }
}

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}; 