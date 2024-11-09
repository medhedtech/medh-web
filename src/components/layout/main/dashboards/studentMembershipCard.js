"use client";
import React, { useState } from "react";
import StudentMainMembership from "./studentMainMembership";
import Image from "next/image";
import MembershipModal from "./MembershipModal"; // Import the modal component
import SubscriptionLogo from "@/assets/images/student-dashboard/subscription.svg";
import Card1 from "@/assets/images/student-dashboard/card1.svg";
import Card2 from "@/assets/images/student-dashboard/card2.svg";
import Card3 from "@/assets/images/student-dashboard/card3.svg";
import Card4 from "@/assets/images/student-dashboard/card4.svg";
import Card5 from "@/assets/images/student-dashboard/card5.svg";
import Card6 from "@/assets/images/student-dashboard/card6.svg";

const StudentMembershipCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const memberships = [
    {
      id: 1,
      title: "Machine Learning",
      type: "Diploma",
      classes: "21 Class",
      hours: "42 Hours",
      membershipName: "Gold",
      imageSrc: Card1,
    },
    {
      id: 2,
      title: "App Development",
      type: "Certificate",
      classes: "21 Class",
      hours: "42 Hours",
      membershipName: "Gold",
      imageSrc: Card2,
    },
    {
      id: 3,
      title: "AI in Business",
      type: "Certificate",
      classes: "21 Class",
      hours: "42 Hours",
      membershipName: "Gold",
      imageSrc: Card3,
    },
    {
      id: 4,
      title: "English Basics",
      type: "Certificate",
      classes: "21 Class",
      hours: "42 Hours",
      membershipName: "Gold",
      imageSrc: Card4,
    },
    {
      id: 5,
      title: "Machine Learning",
      type: "Diploma",
      classes: "21 Class",
      hours: "42 Hours",
      membershipName: "Gold",
      imageSrc: Card5,
    },
    {
      id: 6,
      title: "Web Development",
      type: "Certificate",
      classes: "21 Class",
      hours: "42 Hours",
      membershipName: "Gold",
      imageSrc: Card6,
    },
  ];

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 font-Open">
          <h2 className="text-3xl font-bold text-gray-800 font-Open">
            Membership
          </h2>
          <button
            className="flex items-center bg-[#FCA400] gap-x-2 text-white font-bold  py-2 px-4 rounded-3xl hover:bg-orange-600 transition font-Open"
            onClick={() => setIsModalOpen(true)}
          >
            <Image src={SubscriptionLogo} width={30} alt="Subscription Logo" />
            <p>Upgrade Membership</p>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {memberships.map((membership) => (
            <StudentMainMembership
              key={membership.id}
              membership={membership}
            />
          ))}
        </div>
      </div>

      {/* Membership Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default StudentMembershipCard;
