import WishlistMain from "@/components/layout/main/ecommerce/WishlistMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Wishlist Dark | Medh - Education LMS Template",
  description: "Wishlist Dark | Medh - Education LMS Template",
};

const Wishlist_Dark = async () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <WishlistMain />
        
      </main>
    </PageWrapper>
  );
};

export default Wishlist_Dark;
