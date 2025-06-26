/*********************************************************************************

	  Template Name: Medh - Education LMS Template
    Author: Kamrul Hasan
    Support: kamrulishasan34@gmail.com
    Description: Medh -  Education, online course, tailwind v3.0 and Next.js v14,.
    Version: 1.0.0
    
****************
*****************************************************************/

/**************************************************************

	Start Tailwind Custom Style Indexing
	|
	|___screens
  |
	|___colors
  |
	|___area
  | |___width 
  | |___height
  | |___max width 
  | |___max height 
	|
  |___spacing
  | |___gap 
  | |___padding
  | |___margin 
  |
  |___typography
  | |___font family 
  | |___font size
  | |___line-height 
  | |___letter spacing  
  |
	|___background
	|
	|___shdow
  |
	|___postion
  |
	|___transform
  | |___tranlate 
	|
	|___ border
  | |___width 
  | |___radius 
	|
	|___animation
  |
	|___components
  | |___containers 
  | |___shadow 

***************************************************************/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      // Breakpoints aligned with Medh's design system
      'xs': "320px",     // => @media (min-width: 320px) { ... }
      'sm': "576px",     // => @media (min-width: 576px) { ... }
      'md': "768px",     // => @media (min-width: 768px) { ... }
      'lg': "992px",     // => @media (min-width: 992px) { ... }
      'xl': "1200px",    // => @media (min-width: 1200px) { ... }
      '2xl': "1366px",   // => @media (min-width: 1366px) { ... }
      '3xl': "1500px",   // => @media (min-width: 1500px) { ... }
      '4xl': "1921px",   // => @media (min-width: 1920px) { ... }

      // Special breakpoints for specific use cases
      'tall': { 'raw': '(min-height: 800px)' },
      'short': { 'raw': '(max-height: 600px)' },
      'tablet': { 'raw': '(min-width: 768px) and (max-width: 991px)' },
      'laptop': { 'raw': '(min-width: 992px) and (max-width: 1199px)' },
      'desktop': { 'raw': '(min-width: 1200px)' },
    },

    extend: {
      // Enhanced spacing system
      spacing: {
        // Dynamic spacing that scales with screen size
        'responsive-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'responsive-md': 'clamp(1rem, 3vw, 2rem)',
        'responsive-lg': 'clamp(1.5rem, 5vw, 3rem)',
        'responsive-xl': 'clamp(2rem, 7vw, 4rem)',
        
        // Percentage-based spacing
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
      },

      // Container sizes aligned with breakpoints
      maxWidth: {
        'xs': '320px',
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
        '2xl': '1366px',
        '3xl': '1500px',
        '4xl': '1920px',
        'content': 'min(65ch, 100% - 2rem)',
      },

      // Enhanced padding system
      padding: {
        'screen-safe': 'env(safe-area-inset-bottom)',
        'responsive-x': 'clamp(1rem, 5vw, 3rem)',
        'responsive-y': 'clamp(0.5rem, 3vh, 2rem)',
      },

      // Grid system optimized for course cards
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
        'responsive': 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        'cards': 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
      },

      // Responsive font sizes for Medh's typography
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 1vw, 1rem)',
        'fluid-base': 'clamp(1rem, 1.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 2vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 2.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 3vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 4vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 5vw, 3rem)',
      },

      // Enhanced line heights
      lineHeight: {
        'tight': '1.1',
        'snug': '1.25',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
        'fluid': 'clamp(1.3, 1.5vw, 1.6)',
      },

      // Enhanced animation durations
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
      },

      // Enhanced z-index system
      zIndex: {
        'behind': '-1',
        'default': '1',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal': '1040',
        'popover': '1050',
        'tooltip': '1060',
        'overlay': '1070',
      },

      // colors - Updated for modern theme
      colors: {
        // Primary brand colors - Vibrant green palette
        primary: {
          DEFAULT: "#38B2AC", // Modern teal as primary color
          50: "#E6FFFA",
          100: "#B2F5EA",
          200: "#81E6D9",
          300: "#4FD1C5",
          400: "#38B2AC",
          500: "#319795", // Same as DEFAULT
          600: "#2C7A7B",
          700: "#285E61",
          800: "#234E52",
          900: "#1D4044",
          950: "#0F2C2D",
        },
        // Secondary brand colors - Warm accent
        secondary: {
          DEFAULT: "#ED8936", // Vibrant orange
          50: "#FFFAF0",
          100: "#FEEBC8",
          200: "#FBD38D",
          300: "#F6AD55",
          400: "#ED8936",
          500: "#DD6B20", 
          600: "#C05621",
          700: "#9C4221",
          800: "#7B341E",
          900: "#652B19",
          950: "#441C13",
        },
        // Accent colors - Extended palette for visual interest
        accent: {
          blue: "#3182CE",
          indigo: "#5A67D8",
          purple: "#805AD5",
          pink: "#D53F8C",
          red: "#E53E3E",
          green: "#38A169",
          yellow: "#ECC94B",
          teal: "#319795",
          cyan: "#0BC5EA",
        },
        // Neutral colors for light mode - Refined grays
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9FA6B2",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        // UI colors
        blue: {
          DEFAULT: "#3182CE",
          light: "#EBF8FF",
          medium: "#BEE3F8",
          dark: "#2C5282",
        },
        purple: {
          DEFAULT: "#805AD5",
          50: "#F3E8FF",
          100: "#E9D8FD",
          200: "#D6BCFA",
          300: "#B794F4",
          400: "#9F7AEA",
          500: "#805AD5",
          600: "#6B46C1",
          700: "#553C9A",
          800: "#44337A",
          900: "#322659",
        },
        pink: {
          DEFAULT: "#D53F8C",
          light: "#FED7E2",
          medium: "#FBB6CE",
          dark: "#97266D",
        },
        orange: {
          DEFAULT: "#ED8936",
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        indigo: {
          DEFAULT: "#5A67D8",
          50: "#F0F5FF",
          100: "#E5EDFF",
          200: "#C3DAFE",
          300: "#A3BFFA",
          400: "#7F9CF5",
          500: "#667EEA",
          600: "#5A67D8",
          700: "#4C51BF",
          800: "#434190",
          900: "#3C366B",
          950: "#1A1744",
        },
        // Background colors
        bodyColor: "#1A202C",
        medhgreen: "#39AC66",
        bodyBg: "#FFFFFF",
        bodyBg1: "#F7FAFC",
        whiteColor: "#ffffff",
        whitegrey: "#6A7C92",
        whitegrey1: "#EDEDED",
        whitegrey2: "#F2F6F7",
        whitegrey3: "#E7DEFF",
        headingColor: "#1A202C",
        contentColor: "#4A5568",
        contentColor2: "#4A5568",
        primaryColor: "#38B2AC",
        secondaryColor: "#ED8936",
        secondaryColor2: "#E53E3E",
        secondaryColor3: "#DD6B20",
        blackColor: "#000000",
        lightBlack: "rgba(0,0,0,.5)",
        blackColor2: "#1A202C",
        darkblack: "#0D1B2A",
        darkcolor: "#1E293B",
        darkgray: "#9FA2CE",
        deepgray: "#202942",
        lightGrey: "#7B8696",
        lightGrey2: "#7B8697",
        lightGrey3: "#7E858B",
        lightGrey4: "#A2A9B6",
        lightGrey5: "#F0F0F5",
        lightGrey8: "#F0F1F3",
        lightGrey6: "#6D6E75",
        lightGrey7: "#F3F4FD",
        lightGrey9: "#9F98B2",
        lightGrey10: "#F5F5FE",
        lightGrey11: "#F7F8FD",
        lightGrey12: "#f0f4f7",
        lightGrey13: "#e5e7eb",
        greencolor: "#38A169",
        lightGrey14: "#727695",
        greencolor2: "#2F855A",
        greencolor3: "#38A169",
        borderColor: "#E2E8F0",
        borderColor1: "#E5E5E5",
        borderColor2: "#CBD5E0",
        borderColor3: "#f8f8f8",
        borderColor4: "#cacaca",
        borderColor5: "rgba(126, 133, 139, 0.18)",
        borderColor6: "#ced4da",
        borderAccordion: "#dee2e6",
        darkdeep1: "#0D1B2A",
        darkdeep2: "#1E293B",
        darkdeep3: "#F4F4F8",
        darkdeep4: "#949392",
        darkdeep5: "#62605D",
        darkdeep6: "#7E8285",
        darkdeep7: "#C4C4C4",
        deepgreen: "#133344",
        deepblue: "#2C5282",
        deepred: "#C53030",
        skycolor: "#0BC5EA",
        yellow: "#ECC94B",
        yellow1: "#F6E05E",
        blueDark: "#2C5282",
        naveBlue: "#2D3748",
        placeholder: "#718096",
        customGreen: "#38A169",
        orange2: "#FEEBC8",
        gh: "#718096",

        // Dark mode colors - modernized with rich dark tones
        "bodyColor-dark": "#E2E8F0",
        "bodyBg-dark": "#171923", // Rich dark background
        "bodyBg1-dark": "#1A202C", // Slightly lighter dark background
        "headingColor-dark": "#F7FAFC",
        "darkBlue-dark": "#E2E8F0",
        "blackColor-dark": "#F7FAFC",
        "blackColor2-dark": "#F7FAFC",
        "whiteColor-dark": "#171923",
        "darkdeep2-dark": "#F7FAFC",
        "darkblack-dark": "#F7FAFC",
        "lightGrey-dark": "#171923",
        "lightGrey7-dark": "#1A202C",
        "lightGrey10-dark": "#1A202C",
        "lightGrey11-dark": "#1A202C",
        "contentColor-dark": "#CBD5E0", // Slightly off-white for better readability
        "darkdeep5-dark": "#F7FAFC",
        "borderColor-dark": "#2D3748", // Modern dark border
        "whitegrey-dark": "#CBD5E0",
        "whitegrey1-dark": "#2D3748",
        "whitegrey2-dark": "#2D3748",
        "deepgray-dark": "#CBD5E0",
        "borderColor2-dark": "#CBD5E0",
        "darkdeep3-dark": "#1A202C",
        "contentColor2-dark": "#CBD5E0",
        "deepgreen-dark": "#CBD5E0",
        "bs-body-color-dark": "#CBD5E0",
        "fb-color": "#4267B2",
        "twiter-color": "#1DA1F2",
        "screen-dark": "#171923", // Modern dark screen background
      },
      // area
      // width
      width: {
        "1px": "1px",
        "14px": ".875rem",
        "18px": "1.125rem",
        "25px": "1.5625rem",
        "34px": "2.125rem",
        "35px": "2.1875rem",
        "38px": "2.375rem",
        "40.19px": "40.19px",
        "41px": "41px",
        11: "2.75px",
        "15px": ".9375rem",
        10.5: "2.625rem",
        "45px": "2.8125rem",
        "52px": "3.25rem",
        "55px": "3.4375rem",
        11: "2.75rem",
        "50px": "3.125rem",
        "58px": "3.625rem",
        "71.94px": "71.94px",
        15: "3.75rem",
        "61px": "3.8125rem",
        "66px": "4.125rem",
        "70px": "4.375rem",
        22: "5.5rem",
        "90px": "5.625rem",
        25: "100px",
        27: "6.75rem",
        30: "7.5rem",
        "130px": "8.125rem",
        "148px": "9.25rem",
        "170px": "10.625rem",
        42.5: "10.625rem",
        150: "37.5rem",
        2000: "2000px",
        "card-img": "4.46875rem",
        "logo-sm": "9.375rem",
        "logo-lg": "10.5625rem",
        "mobile-menu-sm": "17.5rem",
        "mobile-menu-lg": "20.625rem",
        "fixed-shadow": "31.25",
        "78px": "4.875rem",
        "185px": "11.5625rem",
        "250px": "15.625rem",
        "300px": "18.75rem",
        "342px": "21.375rem",
        "435px": "27.1875rem",
        "10%": "10%",
        "30%": "30%",
        "35%": "35%",
        "65%": "65%",
        "60%": "60%",
        "70%": "70%",
        "83%": "83.33333333%",
      },
      // height
      height: {
        "1px": "1px",
        "2px": "2px",
        "10px": ".625rem",
        "14px": ".875rem",
        "15px": "15px",
        "18px": "1.125rem",
        "22px": "1.375rem",
        "25px": "1.5625rem",
        "30px": "1.875rem",
        "34px": "2.125rem",
        "37px": "2.3125rem",
        10.5: "2.625rem",
        "52px": "3.25rem",
        "55px": "3.4375rem",
        11: "2.75rem",
        "35px": "2.1875rem",
        "38px": "2.375rem",
        "41px": "41px",
        "46px": "46px",
        "50px": "3.125rem",
        "58px": "3.625rem",
        15: "3.75rem",
        "54px": "3.375rem",
        "62px": "3.875rem",
        "66px": "4.125rem",
        "69.44px": "69.44px",
        "70px": "4.375rem",
        "78px": "4.875rem",
        22: "5.5rem",
        "90px": "5.625rem",
        25: "100px",
        27: "6.75rem",
        30: "7.5rem",
        250: "62.5rem",
        2000: "2000px",
        "fixed-shadow": "31.25",
      },
      // max width
      maxWidth: {
        15: "3.75rem",
        "50px": "3.125rem",
        25: "6.25rem",
        42.5: "10.625rem",
        127: "31.75rem",
        250: "62.5rem",
        "form-md": "18.75rem",
        "415px": "25.9375rem",
        "form-lg": "26.25rem",
        "435px": "27.1875rem",
        "form-xl": "31.875rem",
        "form-2xl": "33.75rem",
        "150px": "9.375rem",
        "770px": "770px",
        "998px": "998px",
        "1/5": "20%",
        "4/5": "80%",
        dropdown: "125rem",
        dropdown2: "12.5rem",
        dropdown3: "18.75rem",
      },
      // max height
      maxHeight: {
        68: "17rem",
        125: "31.25rem",
        137.5: "34.375rem",
        150: "37.5rem",

        dropdown: "40.625rem",
      },
      // spacing
      // gap
      gap: {
        "5px": ".3125rem",
        "10px": "10px",
        "11px": "11px",
        "13px": ".8125rem",
        "15px": ".9375rem",
        "23px": "1.4375rem",
        "25px": "1.5625rem",
        "30px": "1.875rem",
        "35px": "2.1875rem",
        "37px": "2.3125rem",
        "22px": "1.375rem",
        "50px": "3.125rem",
        15: "3.75rem",
      },
      // padding
      padding: {
        "1px": "1px",
        "3px": "3px",
        "5px": ".3125rem",
        "6px": ".375rem",
        "7px": ".4375rem",
        "9px": ".5625rem",
        "10px": ".625rem",
        "11px": ".6875rem",
        "13px": ".8125rem",
        "14px": ".875rem",
        "15px": ".9375rem",
        "17px": "1.0625rem",
        4.5: "1.125rem",
        "18px": "1.125rem",
        "19px": "1.1875rem",
        "22px": "1.375rem",
        "23px": "1.4375rem",
        "25px": "1.5625rem",
        "26px": "1.625rem",
        "30px": "1.875rem",
        "33px": "2.0625rem",
        "35px": "2.1875rem",
        "37px": "2.3125rem",
        "39px": "2.4375rem",
        "43px": "2.6875rem",
        "45px": "2.8125rem",
        "47px": "2.9375rem",
        "55px": "3.4375rem",
        "50px": "3.125rem",
        "60px": "3.75rem",
        "65px": "4.0625rem",
        "70px": "4.375rem",
        "74px": "4.625rem",
        "90px": "5.625rem",
        "100px": "6.25rem",
        "110px": "6.875rem",
        "130px": "8.125rem",
        "135px": "8.4375rem",
        30: "7.5rem",
        35: "8.75rem",
        "145px": "9.0625rem",
        "150px": "9.375rem",
        "154px": "9.625rem",
        "155px": "9.6875rem",
        40.5: "10.125rem",
        "170px": "10.625rem",
        "175px": "10.9375rem",
        "180px": "11.25rem",
        50: "12.5rem",
        "205px": "12.8125rem",
        "250px": "15.625rem",
      },
      // margin
      margin: {
        "5px": ".3125rem",
        "6px": ".375rem",
        "7px": ".4375rem",
        "10px": ".625rem",
        "14px": ".875rem",
        "15px": ".9375rem",
        4.5: "1.125rem",
        "22px": "1.375rem",
        "25px": "1.5625rem",
        "26px": "1.625rem",
        "30px": "1.875rem",
        "35px": "2.1875rem",
        "43px": "2.6875rem",
        "45px": "2.8125rem",
        "50px": "3.125rem",
        "55px": "3.4375rem",
        "60px": "3.75rem",
        "65px": "4.0625rem",
        "76px": "4.75rem",
        22: "5.5rem",
        "90px": "5.625rem",
        30: "7.5rem",
        "110px": "6.875rem",
        "130px": "8.125rem",
        "150px": "9.375rem",
      },
      space: {
        "5px": ".3125rem",
        "6px": ".375rem",
        "7px": ".4375rem",
        "10px": ".625rem",
        "14px": ".875rem",
        "15px": ".9375rem",
        4.5: "1.125rem",
        "22px": "1.375rem",
        "25px": "1.5625rem",
        "26px": "1.625rem",
        "30px": "1.875rem",
        "35px": "2.1875rem",
        "43px": "2.6875rem",
        "45px": "2.8125rem",
        "50px": "3.125rem",
        "55px": "3.4375rem",
        "60px": "3.75rem",
        "65px": "4.0625rem",
        "76px": "4.75rem",
        22: "5.5rem",
        "90px": "5.625rem",
        30: "7.5rem",
        "110px": "6.875rem",
        "130px": "8.125rem",
        "150px": "9.375rem",
      },
      // typography

      fontFamily: {
        Ubuntu: ["ubuntu", "sans"],
        Poppins: ["Poppins", "sans-serif"],
        Open: ["Open Sans", "sans-serif"],
        Bulgathi: ["Bulgathi", "sans-serif"],
      },

      //  font size
      fontSize: {
        "size-10": ".625rem",
        "size-11": ".6875rem",
        "size-12": ".75rem",
        "size-13": ".8125rem",
        "size-15": ".9375rem",
        "size-17": "1.0625rem",
        "size-19": "1.1875rem",
        "size-21": "1.3125rem",
        "size-22": "1.375rem",
        "size-23": "1.4375rem",
        "size-25": "1.5625rem",
        "size-26": "1.625rem",
        "size-28": "1.75rem",
        "size-32": "2rem",
        "size-34": "2.125rem",
        "size-35": "2.1875rem",
        "size-38": "2.375rem",
        "size-40": "2.5rem",
        "size-42": "2.625rem",
        "size-44": "2.75rem",
        "size-45": "2.8125rem",
        "size-47": "2.9375rem",
        "size-50": "3.125rem",
        "size-55": "3.4375rem",
        "size-58": "3.625rem",
        "size-65": "4.0625rem",
        "size-75": "4.6875rem",
        "size-90": "5.625rem",
        "size-100": "6.25rem",
        "size-140": "8.75rem",
        "size-150": "9.375rem",
        "size-200": "12.5rem",
        "size-auto-xl": "calc(1.325rem + .9vw)",
      },

      // line-height
      lineHeight: {
        1: 1,
        1.2: 1.2,
        1.24: 1.24,
        1.25: 1.25,
        1.45: 1.45,
        1.5: 1.5,
        1.67: 1.67,
        "14px": ".875rem",
        sm: "1.575rem",
        lg: "1.8rem",
        1.8: "1.8rem",
        4.5: "1.125rem",
        "13px": "13px",
        "15px": ".9375rem",
        "19px": "1.1875rem",
        "21px": "1.3125rem",
        "22px": "1.375rem",
        "23px": "1.4375rem",
        "25.8px": "1.6125rem",
        "25px": "1.5625rem",
        "26px": "1.625rem",
        "27px": "1.6875rem",
        "29px": "1.8125rem",
        "30px": "1.875rem",
        "34px": "2.125rem",
        "35px": "2.1875rem",
        "38px": "2.375rem",
        "37px": "2.3125rem",
        10.5: "2.625rem",
        "41px": "41px",
        11: "2.75rem",
        "42px": "2.625rem",
        "43px": "2.6875rem",
        "45px": "2.8125rem",
        "46px": "46px",
        12: "3rem",
        "50px": "3.125rem",
        "52px": "3.25rem",
        "55px": "3.4375rem",
        "69.44px": "69.44px",
        "70px": "4.375rem",
        xl: "3.875rem",
        "2xl": "3.375rem",
        13.5: "3.375rem",
        14: "3.5rem",
        14.5: "3.625rem",
        15: "3.75rem",
        16: "4rem",
        18: "4.5rem",
        "78px": "4.875rem",
        "90px": "5.625rem",
        20: "5rem",
        24: "6rem",
      },
      // letter spacing
      letterSpacing: {
        "5px": "5px",
        half: ".5px",
      },
      // background
      backgroundImage: {
        register: "url('../assets/images/register/register__bg.png')",
      },
      // shdow
      boxShadow: {
        dropdown: "0 0 50px 10px rgba(15, 157, 193, 0.1)",
        "dropdown-secodary": "0 0 50px 10px rgba(95, 45, 237, 0.15)",
        "dropdown-card": "0px 0 5px 5px rgba(0, 0, 0, 0.05)",
        "dropdown-card-hover": "0px 0 5px 5px rgba(0, 0, 0, 0.10)",
        brand: "0 0 20px 10px rgba(95, 45, 237, 0.05)",
        "brand-dark": "0 0 20px 10px rgba(95, 45, 237, 0.1)",
        standard: "0 0 20px 0.4px rgba(0, 0, 0, 0.1)",
        bottom: "0px 4px 4px rgba(0, 0, 0, 0.05)",
        plan: "0px 4px 49px rgba(0, 0, 0, 0.05)",
        experience: "0px 30px 40px 0px rgba(1, 11, 60, 0.06)",
        blog: "0px 3px 40px rgba(14, 37, 49, 0.078)",
        "scroll-up": "0px 10px 50px rgba(13, 38, 59, 0.15)",
        "theme-controller": "0px 6px 34px rgba(215, 216, 222, 0.15)",
        "scroll-up": "0px 10px 50px rgba(13, 38, 59, 0.15)",
        "hero-action": "0px 4px 13px 1px rgba(95, 45, 237, 0.16)",
        "hero-greeting": "0px 10px 20px 0px rgba(0, 5, 52, 0.1)",
        feature: "0px 4px 30px 0px rgba(0, 0, 0, 0.1)",
        "standard-dark": "0px 0 20px 5px rgba(255, 255, 255, 0.1)",
        "dropdown-card-dark": "0px 0 20px 5px rgba(255, 255, 255, 0.2)",
        dropdown3: "0 0 37px rgba(0, 0, 0, 0.07)",
        "overview-button": "0 0 50px 10px rgba(95, 45, 237, 0.08)",
        container: "0 0 50px 10px rgba(95, 45, 237, 0.1)",
        blog2: "0 0 50px 10px rgba(95, 45, 237, 0.05)",
        event: "0px 5px 20px rgba(94, 122, 193, 0.14)",
        review: "0px 10px 25px rgba(0, 0, 0, 0.07)",
        autor: "5px 5px 20px 5px rgba(0, 0, 0, 0.03)",
        accordion: "0 0 20px 10px rgba(95, 45, 237, 0.02)",

        accordion2: "0 0 10px 2px rgba(0, 0, 0, 0.05)",

        "accordion-dark": "0 0 1px 1px rgba(95, 45, 237, 0.2)",
        select: "0 0 0 .25rem rgba(13,110,253,.25)",
        address: "0px 4px 15px rgba(174, 181, 206, 0.09)",
        "address-hover": "0px 4px 25px rgba(174, 181, 206, 0.3)",
        "login-shadow": "0px 0px 15px 0px #0000001A",
        "login-shadow2": "0px 4px 4px 0px #00000040",
        "custom-light": "0px 4px 4px 0px #00000040",
        "box-custom": "0px 4px 4px 0px #00000040",
        "card-custom": "0px 4px 4px 0px #00000040",
        "student-dashboard": "0px 4px 16px 0px #0000001F",

        // Your custom shadow
      },
      // postion
      zIndex: {
        "-1": "-1",
        1: "1",
        xxsmall: "1000",
        xsmall: "10000",
        small: "100000",
        medium: "1000000",
        high: "10000000",
        xl: "100000000",
        xxl: "1000000000",
        xxxl: "1000000010",
      },
      // transform
      // tranlate
      translate: {
        "5px": "5px",
        "50px": "3.125rem",
        "30px": "1.875rem",
      },
      // border
      // width
      borderWidth: {
        "3px": "3px",
        "5px": "5px",
        9: "9px",
        12: "12px",
        15: "15px",
      },
      // radius
      borderRadius: {
        standard: "4px",
        "5px": "5px",
        5: "1.25rem",
        lg2: "10px",
        100: "100%",
      },
      inset: {
        "5px": "5px",
      },
      // animation
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "move-hor": {
          "0%": {
            transform: "translateX(20px)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
        "move-var": {
          "0%": {
            "-webkit-transform": "translateY(0)",
            transform: "translateY(0)",
          },
          "50%": {
            "-webkit-transform": "translateY(-20px)",
            transform: "translateY(-20px)",
          },
          "100%": {
            "-webkit-transform": "translateY(0)",
            transform: "translateY(0)",
          },
        },
        "move-var2": {
          "0%": {
            "-webkit-transform": "translateY(0)",
            transform: "translateY(0)",
          },
          "50%": {
            "-webkit-transform": "translateY(20px)",
            transform: "translateY(20px)",
          },
          "100%": {
            "-webkit-transform": "translateY(0)",
            transform: "translateY(0)",
          },
        },
        "float": {
          "0%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(10px, -10px) scale(1.05)",
          },
          "66%": {
            transform: "translate(-10px, 10px) scale(0.95)",
          },
          "100%": {
            transform: "translate(0, 0) scale(1)",
          },
        },
        "pulse-slow": {
          "0%": {
            opacity: "0.15",
          },
          "50%": {
            opacity: "0.25",
          },
          "100%": {
            opacity: "0.15",
          },
        },
        buble: {
          "0%": {
            " -webkit-transform": "translate(-50%, -50%) scale(0.5)",
            transform: "translate(-50%, -50%) scale(0.5)",
            opacity: 1,
            "border-width": "3px",
          },
          "40%": {
            opacity: 0.5,
            "  border-width": "2px",
          },
          "65%": {
            "border-width": "1px",
          },
          "100%": {
            "-webkit-transform": "translate(-50%, -50%) scale(1)",
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 0,
            "border-width": "1px",
          },
        },
        marquee: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        preloader: {
          "0%": {
            opacity: 1,
            visibility: "visible",
            zIndex: 10000000000,
          },
          "25%": {
            opacity: 1,
            visibility: "visible",
            zIndex: 10000000000,
          },
          "50%": {
            opacity: 1,
            visibility: "visible",
            zIndex: 10000000000,
          },
          "75%": {
            opacity: 1,
            visibility: "visible",
            zIndex: 10000000000,
          },
          "100%": {
            opacity: 0,
            visibility: "hidden",
            zIndex: -1,
          },
        },
        shimmer: {
          '0%, 100%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'neon-pulse': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 2px rgba(56,178,172,0.5))',
            opacity: 1,
          },
          '50%': { 
            filter: 'drop-shadow(0 0 8px rgba(56,178,172,0.8))',
            opacity: 0.8,
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOutRotate: {
          '0%': { opacity: '1', transform: 'rotate(0deg)' },
          '100%': { opacity: '0', transform: 'rotate(180deg)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        "spin-slow": "spin-slow 6s linear 0s infinite alternate",
        "spin-infinit": "spin-slow 2s linear infinite",
        "spin-infinit2": "spin-slow 5s linear infinite",
        "move-hor": "move-hor 3s linear 0s infinite alternate",
        "move-var": "move-var 3s infinite linear",
        "move-var2": "move-var2 3s infinite linear",
        "float": "float 8s infinite ease-in-out",
        "pulse-slow": "pulse-slow 6s infinite ease-in-out",
        buble: "buble 3.25s linear 0s infinite",
        buble2: "buble 3.25s linear .75s infinite",
        marquee: "marquee 25s linear 0s infinite normal",
        preloader: "preloader 1.5s linear 0s",
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 3s infinite',
        'neon-pulse': 'neon-pulse 4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOutRotate: 'fadeOutRotate 0.3s ease-in-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-in',
      },
    },
  },
  // components
  corePlugins: {
    container: false,
  },

  plugins: [
    // containers
    function ({ addComponents }) {
      addComponents({
        ".container-fluid": {
          maxWidth: "100%",
          paddingLeft: "15px",
          paddingRight: "15px",
        },
      });
      addComponents({
        ".container-fluid-2": {
          maxWidth: "100%",
          paddingLeft: "30px",
          paddingRight: "30px",

          "@screen 2xl": {
            paddingLeft: "50px",
            paddingRight: "50px",
          },
          "@screen 3xl": {
            paddingLeft: "150px",
            paddingRight: "150px",
          },
          "@screen 4xl": {
            paddingLeft: "30px",
            paddingRight: "30px",
          },
        },
      });
      addComponents({
        ".container": {
          maxWidth: "100%",
          paddingLeft: "15px",
          paddingRight: "15px",
          margin: "auto",
          "@screen sm": {
            maxWidth: "33.75rem",
          },
          "@screen md": {
            maxWidth: "45rem",
          },
          "@screen lg": {
            maxWidth: "60rem",
          },
          "@screen xl": {
            maxWidth: "71.25rem",
          },
          "@screen 2xl": {
            maxWidth: "75rem",
          },
        },
      });
      addComponents({
        ".container-secondary": {
          maxWidth: "83.125rem",
          margin: "0 auto",
        },
      });
      addComponents({
        ".container2-xl": {
          maxWidth: "100%",
          margin: "0 10px",

          "@screen lg": {
            margin: "0 40px",
          },
          "@screen xl": {
            margin: "0 70px",
          },
        },
      });
      addComponents({
        ".container2-lg": {
          paddingLeft: "15px",
          paddingRight: "15px",
          maxWidth: "99.375rem",
        },
      });
      addComponents({
        ".container2-md": {
          maxWidth: "94.375rem",
        },
      });
      addComponents({
        ".container2-sm": {
          maxWidth: "94.375rem",
          paddingLeft: "15px",
          paddingRight: "15px",
        },
      });

      addComponents({
        ".container-secondary-md": {
          maxWidth: "85.625rem",
          margin: "0 auto",
        },
      });
      addComponents({
        ".container-secondary-lg": {
          maxWidth: "91.25rem",
          margin: "0 auto",
        },
      });
      // shadow
      addComponents({
        ".fixed-shadow": {
          backgroundImage: "linear-gradient(45deg, #F6B335, #7ECA9D)",

          position: "fixed",
          top: "200px",
          right: "auto",
          bottom: "auto",
          zIndex: "-1",
          width: "500px",
          height: "500px",
          borderRadius: "1000px",
          opacity: "0.10",
          filter: "blur(100px)",
        },
      });
    },

    // Responsive container plugin
    function ({ addComponents, theme }) {
      addComponents({
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          '@screen sm': {
            maxWidth: theme('screens.sm'),
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
          '@screen md': {
            maxWidth: theme('screens.md'),
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
          '@screen lg': {
            maxWidth: theme('screens.lg'),
          },
          '@screen xl': {
            maxWidth: theme('screens.xl'),
          },
          '@screen 2xl': {
            maxWidth: theme('screens.2xl'),
          },
        },
      });
    },

    // Safe area plugin for modern devices
    function({ addUtilities }) {
      addUtilities({
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
      });
    },
  ],
};
