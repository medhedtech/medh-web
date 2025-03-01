import CartMain from "@/components/layout/main/ecommerce/CartMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Cart | Medh - Education LMS Template",
  description: "Cart | Medh - Education LMS Template",
};

const Cart = async () => {
  return (
    <PageWrapper>
      <main>
        <CartMain />
        
      </main>
    </PageWrapper>
  );
};

export default Cart;
