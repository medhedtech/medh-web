import Image from "next/image";
import React from "react";
import ProfileImg from "@/assets/images/dashbord/ProfileImg.png";
import ProfileBanner from "@/assets/images/dashbord/ProfileBanner.png";

const EditProfile = ({ onBackClick }) => {
  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <button
          className="text-xl font-semibold text-gray-800 mr-4 cursor-pointer"
          onClick={onBackClick}
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>
      <div className=" pl-10 pr-4">
        <div className="relative mb-20 ">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={ProfileBanner}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white opacity-50"></div>{" "}
          </div>
          <div className="absolute top-28 left-6 flex items-center ">
            <Image
              src={ProfileImg}
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full h-[150px] border-4 border-white object-cover"
            />
            <button className="absolute bg-white bottom-1  right-2 w-8 h-8 border shadow-2xl rounded-full flex items-center justify-center text-white">
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 20H21"
                    stroke="#7ECA9D"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.5 3.50023C16.8978 3.1024 17.4374 2.87891 18 2.87891C18.2786 2.87891 18.5544 2.93378 18.8118 3.04038C19.0692 3.14699 19.303 3.30324 19.5 3.50023C19.697 3.69721 19.8532 3.93106 19.9598 4.18843C20.0665 4.4458 20.1213 4.72165 20.1213 5.00023C20.1213 5.2788 20.0665 5.55465 19.9598 5.81202C19.8532 6.06939 19.697 6.30324 19.5 6.50023L7 19.0002L3 20.0002L4 16.0002L16.5 3.50023Z"
                    stroke="#7ECA9D"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <form className="grid grid-cols-1 font-Open md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-normal mb-2">First Name</label>
            <input
              type="text"
              placeholder="Manik Yadav"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Manik Yadav"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9798648976"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">Email</label>
            <input
              type="email"
              placeholder="manik@gmail.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              placeholder="23/05/1995"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">Domain</label>
            <input
              type="text"
              placeholder="Student"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">
              Date of Join
            </label>
            <input
              type="date"
              placeholder="12/10/2024"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">
              Add Facebook Link
            </label>
            <input
              type="url"
              placeholder="http://facebook.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">
              Add Twitter Link
            </label>
            <input
              type="url"
              placeholder="http://twitter.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-base font-normal mb-2">
              Add LinkedIn Link
            </label>
            <input
              type="url"
              placeholder="http://linkedin.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className=" py-2 px-5 bg-primaryColor  text-white font-semibold rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Update/Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
