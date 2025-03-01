import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import BannerNews from "@/components/sections/news-media/bannerNews";
import BannerNewsCourse from "@/components/sections/news-media/bannerNewsCourse";
import LatestNews from "@/components/sections/news-media/latestNews";

import Certified from "@/components/sections/why-medh/Certified";

function NewsMedia() {
  return (
    <PageWrapper>
      <BannerNews />
      <LatestNews />
      <BannerNewsCourse />
      <div className="bg-white py-8">
        <Certified />
      </div>
      
    </PageWrapper>
  );
}

export default NewsMedia;
