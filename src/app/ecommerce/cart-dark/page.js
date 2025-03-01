import CartMain from "@/components/layout/main/ecommerce/CartMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Cart Dark | Medh - Education LMS Template",
  description: "Cart Dark | Medh - Education LMS Template",
};

const Cart_Dark = async () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CartMain />
        
      </main>
    </PageWrapper>
  );
};

export default Cart_Dark;
