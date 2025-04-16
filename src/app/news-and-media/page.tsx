import React from "react";
import type { NextPage } from "next";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import BannerNews from "@/components/sections/news-media/bannerNews";
import BannerNewsCourse from "@/components/sections/news-media/bannerNewsCourse";
import LatestNews from "@/components/sections/news-media/latestNews";
import Certified from "@/components/sections/why-medh/Certified";

const NewsMedia: NextPage = () => {
  return (
    <PageWrapper>
      <BannerNews />
      <LatestNews />
      <BannerNewsCourse />
      <Certified />
    </PageWrapper>
  );
};

export default NewsMedia; 