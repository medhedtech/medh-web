import { redirect } from 'next/navigation';
import ShopMain from "@/components/layout/main/ecommerce/ShopMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Shop | Medh - Education Products Store",
  description: "Browse and purchase high-quality educational products and resources at Medh's online store.",
};

/**
 * Shop Page
 * 
 * This page serves as the main entry point for the Medh online store.
 * It renders the same ShopMain component used in the ecommerce section
 * to provide a consistent shopping experience.
 */
export default function Shop() {
  return (
    <PageWrapper>
      <main>
        <ShopMain />
      </main>
    </PageWrapper>
  );
} 