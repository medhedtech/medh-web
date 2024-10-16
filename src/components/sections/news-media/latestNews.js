import React from "react";
import Image from "next/image";
import News1 from "@/assets/images/news-media/news-1.svg";
import News2 from "@/assets/images/news-media/news-2.svg";
import News3 from "@/assets/images/news-media/news-3.svg";
import News4 from "@/assets/images/news-media/news-4.svg";
import News5 from "@/assets/images/news-media/news-5.svg";
import NewsL1 from "@/assets/images/news-media/news-l1.svg";


const latestNewsData = {
  title: "Latest News",
  newsDescription:
    "MEDH, an EdTech Platform to Offer Personalized Skill Development Learning",
  newsContent:
    "A shift in the skill development industry is created by the launch of Medh, an EdTech platform.",
  newsDate: "April 20, 2024",
  logos: [News1, News2, News3, News4, News5],
};

function LatestNews() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="mx-auto w-[80%]  flex flex-col ">
      <div className="text-center lg:px-35 font-popins">
          <h1 className=" text-3xl font-bold text-[#252525] mb-2">Always making the right noise</h1>
          <p className="text-[16px] text-[#727695] font-semibold mb-8">Welcome to MEDH, where innovation meets education, to revolutionize the EdTech landscape
          by providing personalized skill development courses that cater to learners of all ages.</p>
        </div>

      <div className=" flex flex-col lg:flex-row justify-between items-start">
        {/* Left side - News Details */}
        <div className="lg:w-[50%] border p-3 rounded-md ">
          <h2 className="text-2xl font-bold text-[#E01A00]">
            {latestNewsData.title}
          </h2>
          <div className=" mb-3 mt-1">
            <Image src={NewsL1} width={240}/>
          </div>
          <p className="text-lg text-[#555555] mb-1 font-bold">
            {latestNewsData.newsDescription}
          </p>
          <p className="text-[15px] text-[#727695] font-normal mb-3">{latestNewsData.newsContent}</p>
          <p className=" text-[15px] text-[#727695] font-normal font-sans">{latestNewsData.newsDate}</p>
        </div>

        {/* Right side - Logos */}
        <div className="lg:w-[45%] flex flex-wrap justify-between items-center border p-3 rounded-md ">
          {latestNewsData.logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-wrap mb-5 "
            >
              <Image
                src={logo}
                alt={`Logo ${index + 1}`} 
                width={210} 
                height={100} 
              />
            </div>
          ))}
        </div>
      </div>
        <p className="text-center text-[15px] lg:px-20 mt-12 text-[#727695]">We believe in the transformative power of education and are committed to empowering students with the skills they need to navigate and excel in the modern world. At MEDH, we value innovation, inclusivity, and excellence, and we strive to create a learning environment that is engaging, effective, and accessible to everyone.</p>
      </div>
    </section>
  );
}

export default LatestNews;
