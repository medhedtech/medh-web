import Image from "next/image";
import Link from "next/link";
import React from "react";
import PopupVideo from "../popup/PopupVideo";

const BlogPrimary = ({ blog, idx }) => {
  const { title, image, author, desc, id, date, month } = blog;
  return (
    <div className="group shadow-blog2 " data-aos="fade-up">
      {/* blog thumbnail  */}
      <div className="overflow-hidden relative ">
        <Image src={image} alt="" className="w-full" placeholder="blur" />
      </div>
      {/* blog content  */}
      <div className="pt-26px pb-5 px-30px">
        <h3 className="lg:text-[25px] text-20px  leading-34px md:leading-10 font-Poppins font-bold dark:text-gray-300 text-[#252525] ">
          <Link href={`/blogs/${id}`}>{title}</Link>
        </h3>

        <p className="text-base text-contentColor dark:text-contentColor-dark mb-15px !leading-30px">
          {desc}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <Link
              href={`/blogs/${id}`}
              className="uppercase text-[#252525] dark:text-whitegrey hover:text-secondaryColor "
            >
              READ MORE <i class="icofont-arrow-right text-xl"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPrimary;
