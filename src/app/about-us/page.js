import AboutMain from "@/components/layout/main/AboutMain";
import AboutContent from "@/components/sections/abouts/AboutContent";
import AtMedh from "@/components/sections/abouts/AtMedh";
import WhoWeAre from "@/components/sections/abouts/WhoWeAre";
import WhyChooseMEDH from "@/components/sections/abouts/WhyChooseMEDH";
import Brands from "@/components/sections/brands/Brands";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import AboutPageContent from "@/components/sections/abouts/AboutPageContent";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "About MEDH | Leading EdTech Platform for Professional Development",
  description: "Discover MEDH's mission to transform education through innovative learning solutions. Our expert-led courses in AI, Data Science, and Digital Marketing help professionals advance their careers.",
  keywords: "about MEDH, EdTech platform, professional development, online learning, career advancement, AI courses, data science education, digital marketing training",
  openGraph: {
    title: "About MEDH | Leading EdTech Platform for Professional Development",
    description: "Discover MEDH's mission to transform education through innovative learning solutions",
    type: "website",
    images: [
      {
        url: "/images/about-og.jpg",
        width: 1200,
        height: 630,
        alt: "About MEDH - Our Mission and Vision"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About MEDH | Leading EdTech Platform",
    description: "Discover MEDH's mission to transform education through innovative learning solutions",
    images: ["/images/about-og.jpg"]
  }
};

// JSON-LD Schema for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MEDH",
  "description": "Leading EdTech Platform for Professional Development",
  "url": "https://www.medh.co/about-us",
  "sameAs": [
    "https://www.linkedin.com/company/medh",
    "https://twitter.com/medh",
    "https://www.facebook.com/medh"
  ],
  "offers": {
    "@type": "Offer",
    "category": "Professional Education"
  }
};

/**
 * About Us Page Component
 * 
 * This page showcases MEDH's mission, vision, and comprehensive information
 * about the company with mobile-first optimization.
 * 
 * @returns The complete about us page
 */
const About = () => {
  return (
    <PageWrapper>
      {/* Add JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Mobile-optimized main content */}
      <main className="min-h-screen">
        <AboutPageContent />
      </main>
    </PageWrapper>
  );
};

export default About;
