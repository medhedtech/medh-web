import allProducts from "@/../public/fakedata/products.json";
import productImage1 from "@/assets/images/products/1.jpg";
import productImage2 from "@/assets/images/products/2.jpg";
import productImage3 from "@/assets/images/products/3.jpg";
import productImage4 from "@/assets/images/products/4.jpg";
import productImage5 from "@/assets/images/products/5.jpg";
import productImage6 from "@/assets/images/products/6.jpg";
import productImage7 from "@/assets/images/products/7.jpg";
import productImage8 from "@/assets/images/products/8.jpg";
import productImage9 from "@/assets/images/products/9.jpg";
import productImage10 from "@/assets/images/products/10.jpg";
import productImage11 from "@/assets/images/products/11.jpg";
import productImage12 from "@/assets/images/products/12.jpg";
import productImage13 from "@/assets/images/products/13.jpg";
import productImage14 from "@/assets/images/products/14.jpg";
import productImage15 from "@/assets/images/products/15.jpg";
import { StaticImageData } from 'next/image';

// TypeScript interfaces
interface IProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  image?: StaticImageData;
  [key: string]: any; // Allow for additional properties from JSON
}

interface IProductWithImage extends Omit<IProduct, 'image'> {
  image: StaticImageData;
}

const getAllProducts = (): IProductWithImage[] => {
  const images: StaticImageData[] = [
    productImage1,
    productImage2,
    productImage3,
    productImage4,
    productImage5,
    productImage6,
    productImage7,
    productImage8,
    productImage9,
    productImage10,
    productImage11,
    productImage12,
    productImage13,
    productImage14,
    productImage15,
    productImage8,
    productImage9,
    productImage10,
    productImage1,
    productImage2,
    productImage3,
    productImage4,
    productImage5,
    productImage6,
    productImage7,
    productImage8,
    productImage9,
    productImage10,
    productImage11,
    productImage12,
    productImage13,
    productImage14,
    productImage15,
  ];

  const products: IProductWithImage[] = [...allProducts]?.map((product: IProduct, idx: number): IProductWithImage => ({
    ...product,
    image: images[idx],
  }));

  return products;
};

// Export both named and default for backward compatibility
export { getAllProducts };
export default getAllProducts;
export type { IProduct, IProductWithImage };
