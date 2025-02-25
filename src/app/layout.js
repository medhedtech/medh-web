import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "./globals.css";
import FixedShadow from "@/components/shared/others/FixedShadow";
import PreloaderPrimary from "@/components/shared/others/PreloaderPrimary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

// Using local font instead of Google Fonts to avoid build issues
const hind = localFont({
  src: [
    {
      path: '../assets/fonts/Hind-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Hind-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: "swap",
  variable: "--font-hind",
});

// Metadata for SEO
export const metadata = {
  title: "MEDH - Upskill Your Career with Expert-Led Courses",
  description: "MEDH offers professional courses in AI, Data Science, Digital Marketing, and more. Join our expert-led programs to advance your career with personalized learning experiences.",
  keywords: "online courses, professional development, upskilling, data science, AI, digital marketing, career advancement",
  authors: [{ name: "MEDH" }],
  openGraph: {
    title: "MEDH - Upskill Your Career with Expert-Led Courses",
    description: "Join MEDH's expert-led programs to advance your career with personalized learning experiences.",
    url: "https://www.medhupskill.com",
    siteName: "MEDH",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${hind.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="relative bg-bodyBg dark:bg-bodyBg-dark text-gray-700 dark:text-gray-200 min-h-screen font-sans flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Preloader */}
          <PreloaderPrimary />
          
          {/* Main Content */}
          <div className="flex-grow flex flex-col relative z-10">
            {children}
          </div>

          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <FixedShadow />
            <FixedShadow align={"right"} />
          </div>
          
          {/* Toast Notifications */}
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
