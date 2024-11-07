import Image from "next/image";
import React from "react";
import ProfileImg from "@/assets/images/dashbord/ProfileImg.png";

const ProfileDetails = ({ onEditClick }) => {
  return (
    <div className=" md:py-50px mb-30px  dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="px-5 border border-borderColor dark:border-borderColor-dark flex justify-between">
        <h2 className="text-2xl font-semibold px-4 text-blackColor dark:text-blackColor-dark">
          Profile
        </h2>
        {/* Edit Icon */}
        <span onClick={onEditClick} className="cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
              stroke="#7ECA9D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
              stroke="#7ECA9D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="shadow-lg p-4  mx-4 rounded-lg" style={{ boxShadow: '0px 4px 24px 0px #0000001F' }}>
        <div className="py-4.5 px-5">
          <Image src={ProfileImg} alt="profile img" width={192} height={173} />
        </div>
        <ul className="px-4 ">
          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">First Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                Manik Yadav
              </span>
            </div>
          </li>

          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Last Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                Yadav Naresh
              </span>
            </div>
          </li>
          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Email Id</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                manikyadav123@gmail.com
              </span>
            </div>
          </li>

          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Mobile Number</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                {" "}
                +91 8765428929
              </span>
            </div>
          </li>

          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Date of Birth</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                {" "}
                12-11-1994
              </span>
            </div>
          </li>
          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Date of Joining </span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                10-10-2023
              </span>
            </div>
          </li>

          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">
                Registration Id Number
              </span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">9019</span>
            </div>
          </li>

          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Domain Belongs to</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block text-[20px] text-[#544C4C]">
                Student
              </span>
            </div>
          </li>
          <li className=" grid grid-cols-1 md:grid-cols-12 mb-3">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block text-[20px]">Social Media Links</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <div className="flex gap-2">
                <span>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_269_2834)">
                      <path
                        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
                        fill="#3C5A9A"
                      />
                      <path
                        d="M26.5023 6.13916H22.0718C19.4426 6.13916 16.5182 7.24497 16.5182 11.0561C16.531 12.384 16.5182 13.6558 16.5182 15.0871H13.4766V19.9273H16.6123V33.8612H22.3744V19.8353H26.1776L26.5217 15.0736H22.2751C22.2751 15.0736 22.2846 12.9553 22.2751 12.3402C22.2751 10.8341 23.8423 10.9203 23.9365 10.9203C24.6823 10.9203 26.1323 10.9225 26.5045 10.9203V6.13916H26.5023Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_269_2834">
                        <rect width="40" height="40" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_269_2837)">
                      <path
                        d="M20 0C8.95422 0 0 8.95421 0 20C0 31.0457 8.95422 39.9999 20 39.9999C31.0457 39.9999 40 31.0457 40 20C39.9999 8.95421 31.0455 0 20 0ZM14.6639 29.669H10.2727V15.4823H14.6639V29.669ZM12.4474 13.6245C11.0133 13.6245 9.85069 12.4524 9.85069 11.0068C9.85069 9.56102 11.0135 8.38902 12.4474 8.38902C13.8814 8.38902 15.044 9.56102 15.044 11.0068C15.0441 12.4525 13.8814 13.6245 12.4474 13.6245ZM31.1199 29.669H26.75V22.2222C26.75 20.1797 25.9742 19.0396 24.3592 19.0396C22.6015 19.0396 21.6833 20.227 21.6833 22.2222V29.669H17.4716V15.4823H21.6833V17.393C21.6833 17.393 22.9501 15.0496 25.9583 15.0496C28.9665 15.0496 31.12 16.8864 31.12 20.6862L31.1199 29.669Z"
                        fill="url(#paint0_linear_269_2837)"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint0_linear_269_2837"
                        x1="5.85785"
                        y1="5.85785"
                        x2="34.1421"
                        y2="34.1421"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#2489BE" />
                        <stop offset="1" stop-color="#0575B3" />
                      </linearGradient>
                      <clipPath id="clip0_269_2837">
                        <rect width="40" height="40" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_269_2839)">
                      <path
                        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
                        fill="#2DAAE1"
                      />
                      <path
                        d="M32.8232 12.0446C31.8798 12.4632 30.8666 12.7462 29.8013 12.8734C30.8885 12.2223 31.7215 11.1906 32.1147 9.96265C31.0819 10.5761 29.9516 11.0079 28.7729 11.2395C27.8136 10.217 26.4457 9.57861 24.9324 9.57861C22.0276 9.57861 19.6718 11.9335 19.6718 14.8399C19.6718 15.2518 19.7182 15.6535 19.8074 16.0393C15.4346 15.8195 11.5579 13.7249 8.96295 10.5421C8.50984 11.3195 8.25048 12.2232 8.25048 13.1875C8.25048 15.0126 9.17945 16.623 10.591 17.5663C9.75538 17.5404 8.93811 17.3148 8.2075 16.9085V16.9749C8.2075 19.5244 10.0208 21.6501 12.4279 22.1336C11.9857 22.2547 11.5217 22.318 11.0416 22.318C10.7022 22.318 10.3729 22.2859 10.0512 22.2254C10.7207 24.315 12.6638 25.836 14.9655 25.879C13.1648 27.2905 10.8958 28.132 8.43154 28.132C8.00709 28.132 7.5876 28.1066 7.17578 28.057C9.50454 29.5502 12.2696 30.4219 15.2409 30.4219C24.9181 30.4219 30.2106 22.4048 30.2106 15.4523C30.2106 15.224 30.2055 14.9975 30.1945 14.7718C31.2257 14.0259 32.1158 13.1024 32.8232 12.0446Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_269_2839">
                        <rect width="40" height="40" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDetails;
