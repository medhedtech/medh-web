// import Image from "next/image";
// import React from "react";
// import post1 from "@/assets/images/footer/footer__1.png";
// import post2 from "@/assets/images/footer/footer__2.png";
// import post3 from "@/assets/images/footer/footer__3.png";
// import FooterHeading from "@/components/shared/headings/FooterHeading";
// import FooterRecentPost from "./FooterRecentPost";
// const FooterRecentPosts = () => {
//   const posts = [
//     {
//       title: "Best Your Business",
//       image: post1,
//       date: "02 Apr 2024",
//       id: 1,
//     },
//     {
//       title: " Keep Your Business",
//       image: post2,
//       date: "02 Apr 2024",
//       id: 2,
//     },
//     {
//       title: "  Nice Your Business",
//       image: post3,
//       date: "02 Apr 2024",
//       id: 3,
//     },
//   ];
//   return (
//     <div
//       className="sm:col-start-1 sm:col-span-12 md:col-start-7 md:col-span-6 lg:col-start-10 lg:col-span-3 pl-0 2xl:pl-50px"
//       data-aos="fade-up"
//     >
//       {/* <FooterHeading className="text-size-22 font-bold text-whiteColor mb-3">
//         Recent Post
//       </FooterHeading>
//       <ul className="flex flex-col gap-y-5">
//         {posts.map((post, idx) => (
//           <FooterRecentPost key={idx} post={post} />
//         ))}
//       </ul> */}
//       <div className="flex flex-col gap-6 ">
//         <FooterHeading>
//           Subscribe to Our
//           <br /> Newsletter!
//         </FooterHeading>
//         <div className="text-white">
//           We don&#39;t send spam so don&#39;t worry.
//         </div>

//         <input
//           type="text"
//           placeholder="Enter your email "
//           className="p-2 bg-transparent border border-white text-white"
//         />
//         <button className="bg-[#F6B335] text-white p-2">SUBSCRIBE</button>
//       </div>
//     </div>
//   );
// };

// export default FooterRecentPosts;

import React, { useState } from "react";
import FooterHeading from "@/components/shared/headings/FooterHeading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Mail, X, CheckCircle, Loader2 } from "lucide-react";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";

// Validation schema using yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const FooterRecentPosts = () => {
  const { postQuery } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await postQuery({
        url: apiUrls?.Newsletter?.addNewsletter,
        postData: { email: data.email },
        onSuccess: () => {
          setShowModal(true);
          reset();
        },
        onFail: (err) => {
          console.error("Subscription failed:", err);
          showToast.error("Error subscribing to the newsletter. Please try again!");
        },
      });
    } catch (error) {
      console.error("Error subscribing:", error);
      showToast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-5">
          <FooterHeading>Newsletter</FooterHeading>
          <div className="mt-1 w-12 h-0.5 bg-gradient-to-r from-green-500 to-transparent rounded-full"></div>
        </div>
        
        <p className="text-gray-300 text-sm mb-6">
          Stay updated with our latest courses, events, and educational insights.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className="text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full pl-10 pr-3 py-3 bg-gray-900/50 border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              "Subscribe Now"
            )}
          </button>
        </form>
        
        <p className="text-gray-400 text-xs mt-4 text-center">
          We respect your privacy and will never share your information.
        </p>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Success Content */}
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-2">
                Subscription Successful!
              </h2>
              
              <p className="text-gray-300 mb-6">
                Thank you for subscribing to our newsletter. You'll now receive updates on our latest courses and educational content.
              </p>
              
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterRecentPosts;
