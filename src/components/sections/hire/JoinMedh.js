import Image from "next/image";
import React from "react";
import Educator from "@/assets/images/hire/Educator.png";
import Partner from "@/assets/images/hire/Partner.png";

// AddIcon component
const AddIcon = ({ fill = "white" }) => {
  return (
    <svg
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5498 7.32227H11.4502V11.4971H7.2998V13.5723H11.4502V17.7471H13.5498V13.5723H17.7002V11.4971H13.5498V7.32227ZM12.5 2.12207C11.0677 2.12207 9.7168 2.39062 8.44727 2.92773C7.17773 3.48112 6.07096 4.22982 5.12695 5.17383C4.18294 6.11784 3.44238 7.21647 2.90527 8.46973C2.35189 9.73926 2.0752 11.0902 2.0752 12.5225C2.0752 13.9548 2.35189 15.3057 2.90527 16.5752C3.44238 17.8447 4.18294 18.9515 5.12695 19.8955C6.07096 20.8395 7.17773 21.5801 8.44727 22.1172C9.7168 22.6706 11.0677 22.9473 12.5 22.9473C13.9323 22.9473 15.2832 22.6706 16.5527 22.1172C17.8223 21.5801 18.929 20.8395 19.873 19.8955C20.8171 18.9515 21.5576 17.8447 22.0947 16.5752C22.6481 15.3057 22.9248 13.9548 22.9248 12.5225C22.9248 11.0902 22.6481 9.73926 22.0947 8.46973C21.5576 7.21647 20.8171 6.11784 19.873 5.17383C18.929 4.22982 17.8223 3.48112 16.5527 2.92773C15.2832 2.39062 13.9323 2.12207 12.5 2.12207ZM12.5 20.8721C11.3444 20.8721 10.262 20.6523 9.25293 20.2129C8.24381 19.7734 7.36084 19.1753 6.604 18.4185C5.84717 17.6616 5.25716 16.7786 4.83398 15.7695C4.39453 14.7604 4.1748 13.6781 4.1748 12.5225C4.1748 11.3831 4.39453 10.3008 4.83398 9.27539C5.25716 8.26628 5.84717 7.38737 6.604 6.63867C7.36084 5.88997 8.24381 5.2959 9.25293 4.85645C10.262 4.41699 11.3444 4.19727 12.5 4.19727C13.6556 4.19727 14.738 4.41699 15.7471 4.85645C16.7562 5.2959 17.6392 5.88997 18.396 6.63867C19.1528 7.38737 19.7428 8.26628 20.166 9.27539C20.6055 10.3008 20.8252 11.3831 20.8252 12.5225C20.8252 13.6781 20.6055 14.7604 20.166 15.7695C19.7428 16.7786 19.1528 17.6616 18.396 18.4185C17.6392 19.1753 16.7562 19.7734 15.7471 20.2129C14.738 20.6523 13.6556 20.8721 12.5 20.8721Z"
        fill={fill}
      />
    </svg>
  );
};

// JoinMedh component with customizable content and styles
const JoinMedh = ({
  educatorImage = Educator,
  educatorTitle = "Join Medh as an Educator",
  educatorText = "Join Medh’s pioneering learning community and contribute to shaping a transformative educational journey for learners worldwide.",
  educatorButtonText = "Get Started",
  educatorButtonColor = "#5F2DED",
  partnerImage = Partner,
  partnerTitle = "Partner with Medh as a School / Institute",
  partnerText = "To implement customized skill development programs, empowering your students to excel in their chosen fields on a global scale.",
  partnerButtonText = "Let’s Collaborate",
  partnerButtonColor = "white",
  partnerTextColor = "white",
  partnerBackgroundColor = "#F2277E",
  partnerBtnColor = "black",
}) => {
  return (
    <div className="flex flex-col gap-4 md:gap-0">
      {/* Educator Section */}
      <div className="flex flex-col md:flex-row md:items-center bg-white">
        <Image
          src={educatorImage}
          width={720}
          height={375}
          className="w-full md:w-1/2 object-cover"
        />
        <div className="flex flex-col justify-center px-4 md:w-1/2 md:px-8 lg:pl-24">
          <h1 className="font-bold text-[#252525] text-3xl mt-4 md:mt-0">
            {educatorTitle}
          </h1>
          <p className="text-[#727695] text-base leading-7 mt-2">
            {educatorText}
          </p>
          <div
            className="text-white px-3.5 py-1 rounded-3xl  flex w-fit items-center gap-2.5 mt-4"
            style={{ backgroundColor: educatorButtonColor }}
          >
            <AddIcon />
            {educatorButtonText}
          </div>
        </div>
      </div>

      {/* School Collaboration Section */}
      <div
        className="flex flex-col md:flex-row md:items-center gap-4 lg:gap-0"
        style={{ backgroundColor: partnerBackgroundColor }}
      >
        <div className="flex flex-col justify-center px-4 md:w-1/2 md:px-8 lg:pl-24">
          <h1
            className="font-bold text-3xl mt-4 md:mt-0"
            style={{ color: partnerTextColor }}
          >
            {partnerTitle}
          </h1>
          <p
            className="text-base leading-7 mt-2"
            style={{ color: partnerTextColor }}
          >
            {partnerText}
          </p>
          <div
            className="px-2.5 py-1 rounded-3xl flex items-center gap-2.5 mt-4 w-fit"
            style={{
              backgroundColor: partnerButtonColor,
              color: partnerBtnColor,
            }}
          >
            <AddIcon
              fill={partnerButtonColor === "white" ? "black" : "white"}
            />
            {partnerButtonText}
          </div>
        </div>
        <Image
          src={partnerImage}
          width={720}
          height={375}
          className="w-full md:w-1/2 object-cover"
        />
      </div>
    </div>
  );
};

export default JoinMedh;
