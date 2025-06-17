import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Deletion Request - Meta OAuth Compliance | Medh",
  description: "Request data deletion from Medh platform. Meta OAuth compliance page for Facebook login users to delete their personal data.",
  keywords: ["data deletion", "privacy", "facebook", "meta oauth", "gdpr", "medh"],
  robots: "noindex, nofollow", // Prevent indexing of data deletion page
};

export default function DeleteDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 