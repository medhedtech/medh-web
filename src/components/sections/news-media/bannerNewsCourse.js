"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.jpg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";
import { ArrowRight, Mail } from "lucide-react";

function BannerNewsCourse() {
  const router = useRouter();

  const courses = [
    {
      heading:
        "Stay connected with MEDH as we continue to pioneer advancements in EdTech and skill development.",
      description:
        "Together, we can create a brighter future through the power of education.",
      buttonText: "Contact us",
      imageUrl: CourseBannerImg,
      buttonBgColor: "#F6B335",
      icon: VerticalIcon,
      stats: [
        { label: "Media Coverage", value: "50+" },
        { label: "Success Stories", value: "100+" },
        { label: "Industry Updates", value: "Weekly" }
      ]
    },
  ];

  const handleEnrollClick = () => {
    router.push("/contact-us");
  };

  return (
    <></>
  );
}

export default BannerNewsCourse;
