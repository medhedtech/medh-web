import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import BannerNews from "@/components/sections/news-media/bannerNews";
import BannerNewsCourse from "@/components/sections/news-media/bannerNewsCourse";
import LatestNews from "@/components/sections/news-media/latestNews";
import ThemeController from "@/components/shared/others/ThemeController";

function NewsMedia() {
  return (
    <PageWrapper>
      <BannerNews />
      <LatestNews />
      <BannerNewsCourse />
      <ThemeController />
    </PageWrapper>
  );
}

export default NewsMedia;
