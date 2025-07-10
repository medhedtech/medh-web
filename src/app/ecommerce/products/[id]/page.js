import ProductDetailsMain from "@/components/layout/main/ecommerce/ProductDetailsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
// import products from "@/../public/fakedata/products.json";
export const metadata = {
  title: "Product Details | Medh - Education LMS Template",
  description: "Product Details | Medh - Education LMS Template",
};
const Product_Details = async ({ params }) => {
  const { id } = params;
  const isExistProducts = products?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistProducts) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
        <ProductDetailsMain id={params?.id} />
        
      </main>
    </PageWrapper>
  );
};
export default Product_Details;
