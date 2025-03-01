import ShopMain from "@/components/layout/main/ecommerce/ShopMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Shop Dark | Medh - Education LMS Template",
  description: "Shop Dark | Medh - Education LMS Template",
};

const Shop_Dark = async () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ShopMain />
        
      </main>
    </PageWrapper>
  );
};

export default Shop_Dark;
