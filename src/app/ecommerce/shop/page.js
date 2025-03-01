import ShopMain from "@/components/layout/main/ecommerce/ShopMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Shop | Medh - Education LMS Template",
  description: "Shop | Medh - Education LMS Template",
};

const Shop = async () => {
  return (
    <PageWrapper>
      <main>
        <ShopMain />
        
      </main>
    </PageWrapper>
  );
};

export default Shop;
