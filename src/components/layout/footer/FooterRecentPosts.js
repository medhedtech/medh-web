import Image from "next/image";
import React from "react";
import post1 from "@/assets/images/footer/footer__1.png";
import post2 from "@/assets/images/footer/footer__2.png";
import post3 from "@/assets/images/footer/footer__3.png";
import FooterHeading from "@/components/shared/headings/FooterHeading";
import FooterRecentPost from "./FooterRecentPost";
const FooterRecentPosts = () => {
  const posts = [
    {
      title: "Best Your Business",
      image: post1,
      date: "02 Apr 2024",
      id: 1,
    },
    {
      title: " Keep Your Business",
      image: post2,
      date: "02 Apr 2024",
      id: 2,
    },
    {
      title: "  Nice Your Business",
      image: post3,
      date: "02 Apr 2024",
      id: 3,
    },
  ];
  return (
    <div
      className="sm:col-start-1 sm:col-span-12 md:col-start-7 md:col-span-6 lg:col-start-10 lg:col-span-3 pl-0 2xl:pl-50px"
      data-aos="fade-up"
    >
      {/* <FooterHeading className="text-size-22 font-bold text-whiteColor mb-3">
        Recent Post
      </FooterHeading>
      <ul className="flex flex-col gap-y-5">
        {posts.map((post, idx) => (
          <FooterRecentPost key={idx} post={post} />
        ))}
      </ul> */}
      <div className="flex flex-col gap-6 ">
        <FooterHeading>
          Subscribe to Our
          <br /> Newsletter!
        </FooterHeading>
        <div className="text-white">We don't send spam so don't worry.</div>

        <input
          type="text"
          placeholder="Enter your email "
          className="p-2 bg-transparent border border-white text-white"
        />
        <button className="bg-[#F2277E] text-white p-2">SUBSCRIBE</button>
      </div>
    </div>
  );
};

export default FooterRecentPosts;
