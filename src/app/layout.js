import ClientLayout from './ClientLayout';

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
  return <ClientLayout>{children}</ClientLayout>;
}
