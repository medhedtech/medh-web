import { Metadata } from 'next';

// JSON-LD Schema for Course
const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "AI and Data Science Course",
  "description": "Master artificial intelligence and data science with our comprehensive course. Gain hands-on experience in machine learning, neural networks, and data analysis.",
  "provider": {
    "@type": "Organization",
    "name": "MEDH",
    "sameAs": "https://www.medh.co"
  },
  "educationalLevel": "Professional",
  "courseCode": "AI-DS-101",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "educationalProgramMode": "full-time",
    "inLanguage": "en"
  }
};

export const metadata: Metadata = {
  title: "AI and Data Science Course | MEDH",
  description: "Master artificial intelligence and data science with our comprehensive course. Gain hands-on experience in machine learning, neural networks, and data analysis.",
  keywords: "AI course, data science training, machine learning course, neural networks, data analysis, MEDH courses, professional development, tech education",
  openGraph: {
    title: "AI and Data Science Course | MEDH",
    description: "Master AI and Data Science with MEDH's comprehensive course",
    type: "website",
    images: [
      {
        url: "/images/courses/ai-data-science-og.jpg",
        width: 1200,
        height: 630,
        alt: "MEDH AI and Data Science Course"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI and Data Science Course | MEDH",
    description: "Master AI and Data Science with MEDH's comprehensive course",
    images: ["/images/courses/ai-data-science-og.jpg"]
  }
};

interface AiDataScienceLayoutProps {
  children: React.ReactNode;
}

export default function AiDataScienceLayout({ children }: AiDataScienceLayoutProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {children}
    </>
  );
}
