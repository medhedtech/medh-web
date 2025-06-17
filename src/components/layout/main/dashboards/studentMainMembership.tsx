"use client";
import React from "react";
import Image from "next/image";
import { CalendarClock } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import Education from "@/assets/images/course-detailed/education.svg";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { capitalize } from "@mui/material";
import useRazorpay from "@/hooks/useRazorpay";
import RAZORPAY_CONFIG from "@/config/razorpay";
import { toast } from "react-toastify";

interface StudentMainMembershipProps {
  courseImage?: string;
  title: string;
  courseCategory?: string;
  typeLabel: string;
  sessions: string | number;
  duration: string;
  sessionDuration: string;
  membershipName: string;
  expiryDate: string;
  iconVideo: string;
  iconClock: string;
  fallbackImage: string;
  planType?: string;
}

const StudentMainMembership: React.FC<StudentMainMembershipProps> = ({
  courseImage,
  title,
  courseCategory,
  typeLabel,
  sessions,
  duration,
  sessionDuration,
  membershipName,
  expiryDate,
  iconVideo,
  iconClock,
  fallbackImage,
  planType = "Renew",
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: isLoading } = usePostQuery();
  const { 
    openRazorpayCheckout, 
    isScriptLoaded, 
    isLoading: razorpayLoading, 
    error: razorpayError 
  } = useRazorpay();

  const hasExpired = (expiryDate: string): boolean => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    return expiry < today; // Returns true if expiry date is in the past
  };

  const renew = async (membership_id: string): Promise<void> => {
    postQuery({
      url: `${apiUrls?.Membership.renewMembership}/${membership_id}`,
      onSuccess: (data) => {
        window.location.reload();
      },
      onFail: (err) => {
        console.error("Error renewing membership:", err);
      },
    });
  };

  const handleRenewMembership = async (): Promise<void> => {
    const studentId = localStorage.getItem("userId");
    
    if (!studentId) {
      toast.error("Please log in first.");
      return;
    }
    
    getQuery({
      url: `${apiUrls?.Membership.getRenewAmount}?user_id=${studentId}&category=${courseCategory}`,
      onSuccess: async (data) => {
        console.log("Renew Amount: ", data);
        const token = localStorage.getItem("token");
        
        if (!token || !studentId) {
          toast.error("Please log in first.");
          return;
        }
        
        try {
          // Configure Razorpay options
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || RAZORPAY_CONFIG.key,
            amount: data.data.amount * 100 * 84.47, // Convert to INR and paise
            currency: "INR",
            name: `${capitalize(planType)} Membership`,
            description: `Payment for ${capitalize(planType)} Membership`,
            image: "/images/logo.png",
            handler: async function (response: any) {
              console.log("Payment Successful!");
              showToast.success("Payment Successful!");
              renew(data.data.membership_id);
            },
            prefill: {
              name: RAZORPAY_CONFIG.prefill.name,
              email: RAZORPAY_CONFIG.prefill.email,
              contact: RAZORPAY_CONFIG.prefill.contact,
            },
            theme: {
              color: RAZORPAY_CONFIG.theme.color,
            },
          };

          // Use the hook to open the Razorpay checkout
          await openRazorpayCheckout(options);
        } catch (err) {
          console.error("Payment error:", err);
          toast.error("Failed to process payment. Please try again.");
        }
      },
      onFail: (err) => {
        console.error("Error fetching renew amount:", err);
        toast.error("Error fetching membership details. Please try again.");
      },
    });
  };

  return (
    <div className="flex items-center dark:border shadow-student-dashboard p-5 rounded-lg overflow-hidden hover:scale-105 transform transition-transform duration-300">
      <div className="relative h-40 w-[40%]">
        <Image
          src={courseImage || fallbackImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Course Info Section */}
      <div className="px-4 w-[60%] font-Open">
        <span className="text-orange-500 flex text-xs font-bold text-[#FFA927]">
          {typeLabel}
          <p className="ml-4 text-xs font-semibold dark:text-white text-[#202244] mt-0">
            {courseCategory}
          </p>
        </span>
        <h3 className="text-xl font-semibold dark:text-white text-[#202244] mt-2">
          {title}
        </h3>
        <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-2">
          <Image
            src={iconVideo}
            alt="Classes Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          {sessions} Sessions
        </div>
        <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-1">
          <Image
            src={iconClock}
            alt="Clock Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          {duration} | {sessionDuration}
        </div>
        <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-1">
          <CalendarClock className="w-5 mr-2 h-5" />
          Expiry Date: {formatDate(expiryDate)}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[#7ECA9D] font-bold text-xs mt-2">
            Membership Name: {membershipName}
          </p>
          <button
            onClick={handleRenewMembership}
            disabled={!hasExpired(expiryDate) || isLoading || razorpayLoading}
            className={`px-4 py-2.5 rounded-lg transition-all text-xs ${
              !hasExpired(expiryDate) || isLoading || razorpayLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white shadow-md hover:shadow-lg cursor-pointer"
            }`}
          >
            {isLoading || razorpayLoading ? "Processing..." : "Renew"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMainMembership; 