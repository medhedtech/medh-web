import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Careers at Medh - Join Our Innovative EdTech Team",
  description: "Join Medh's dynamic team and be part of transforming education through innovation and technology. Explore exciting career opportunities in EdTech.",
  keywords: "Medh careers, EdTech jobs, teaching jobs, education technology careers",
};

interface CareersLayoutProps {
  children: React.ReactNode;
}

export default function CareersLayout({ children }: CareersLayoutProps) {
  return children;
}
