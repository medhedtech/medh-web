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
import { FaTimes } from "react-icons/fa";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";

// Validation schema using yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Email is required."),
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
          toast.error("Error subscribing to the newsletter. Please try again!");
        },
      });
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="sm:col-start-1 sm:col-span-12 md:col-start-7 md:col-span-6 lg:col-start-10 lg:col-span-3 pl-0 2xl:pl-50px"
        data-aos="fade-up"
      >
        <div className="flex flex-col gap-6">
          <FooterHeading>
            Subscribe to Our
            <br /> Newsletter!
          </FooterHeading>
          <div className="text-white">
            We don&#39;t send spam, so don&#39;t worry.
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter your email"
                className="p-2 bg-transparent border border-white text-white w-full rounded-md focus:ring-2 focus:ring-[#F6B335] focus:outline-none"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#7ECA9D] text-white px-4 py-2 w-full rounded-md hover:bg-[#7ECA9D] transition duration-200"
            >
              {loading ? "Loading..." : "SUBSCRIBE"}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-lg md:text-[28px] font-semibold text-green-500">
                🎉 Success!
              </h2>
              <p className="text-gray-700 mt-2">
                Your email has been subscribed successfully!
                {/* A confirmation email is on the way. Follow the instructions and check the spam folder. Thank you. */}
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterRecentPosts;
