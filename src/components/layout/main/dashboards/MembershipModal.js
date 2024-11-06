import React from "react";

const MembershipModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white px-4 py-3 rounded-lg w-3/5 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header Section */}
        <h2 className="text-4xl font-semibold text-center text-[#1B223C]">
          Find Your Perfect Plan
        </h2>
        <p className="text-gray-500 text-center mt-2 text-xl font-light">
          Discover the ideal plan to fuel your business growth. Our pricing
          options are carefully crafted to cater to your learnings.
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center mt-2  mb-2">
          <button className="px-4 py-2 border rounded-l-md text-primary bg-[#E0EFFE] font-semibold">
            Monthly
          </button>
          <button className="px-4 py-2 border-t border-b text-gray-600 font-semibold">
            Yearly
          </button>
          <button className="px-4 py-2 border-t border-b text-gray-600 font-semibold">
            Half-Yearly
          </button>
          <button className="px-4 py-2 border rounded-r-md text-gray-600 font-semibold">
            Quarterly
          </button>
        </div>

        <div className="flex space-x-6">
          {/* Silver Plan */}
          <div className="py-2 px-6 border rounded-md w-1/2 bg-white">
            <div className="flex flex-col">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_91_3102)">
                  <rect width="56" height="56" rx="14" fill="#7ECA9D" />
                  <circle
                    cx="7.87262"
                    cy="21.0921"
                    r="41.5381"
                    transform="rotate(-0.403168 7.87262 21.0921)"
                    fill="url(#paint0_linear_91_3102)"
                    stroke="url(#paint1_linear_91_3102)"
                    stroke-width="0.085853"
                  />
                  <circle
                    cx="28.0914"
                    cy="50.7752"
                    r="41.5381"
                    transform="rotate(-0.403168 28.0914 50.7752)"
                    fill="url(#paint2_linear_91_3102)"
                    stroke="url(#paint3_radial_91_3102)"
                    stroke-width="0.085853"
                  />
                  <path
                    d="M40 28C40 34.6274 34.6274 40 28 40C21.3726 40 16 34.6274 16 28C16 21.3726 21.3726 16 28 16M34.6667 28C34.6667 31.6819 31.6819 34.6667 28 34.6667C24.3181 34.6667 21.3333 31.6819 21.3333 28C21.3333 24.3181 24.3181 21.3333 28 21.3333M31.6772 24.4688L36.9558 25.0232L39.8172 21.0172L36.3835 19.8727L35.239 16.439L31.233 19.3004L31.6772 24.4688ZM31.6772 24.4688L28 27.9999"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_91_3102"
                    x1="7.87262"
                    y1="-20.4889"
                    x2="7.87262"
                    y2="62.6732"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7ECA9D" />
                    <stop offset="1" stop-color="white" stop-opacity="0.2" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_91_3102"
                    x1="51.4246"
                    y1="16.9581"
                    x2="-44.9089"
                    y2="38.3014"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7ECA9D" />
                    <stop offset="1" stop-color="#7ECA9D" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_91_3102"
                    x1="28.0914"
                    y1="9.19418"
                    x2="28.0914"
                    y2="92.3563"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7ECA9D" stop-opacity="0.38" />
                    <stop offset="1" stop-color="#7ECA9D" />
                  </linearGradient>
                  <radialGradient
                    id="paint3_radial_91_3102"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(28.0914 50.7752) rotate(89.968) scale(86.1425)"
                  >
                    <stop
                      offset="0.046875"
                      stop-color="#B5C2FB"
                      stop-opacity="0"
                    />
                    <stop offset="1" stop-color="#7ECA9D" />
                  </radialGradient>
                  <clipPath id="clip0_91_3102">
                    <rect width="56" height="56" rx="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h3 className="text-4xl font-semibold text-[#1B223C] mt-4">
              Silver
            </h3>
            <p className="text-gray-500 mt-2">
              Unleash the Power with Silver Plan.
            </p>
            <p className="text-gray-700 text-5xl font-bold border-b-2 mb-4">
              $49 <span className="text-lg font-normal">per month</span>
            </p>
            <ul className="text-gray-700 space-y-3  mb-6">
              <li>✔ Learn Offline</li>
              <li>✔ Download Materials</li>
              <li>✔ Early Access</li>
              <li>✔ Priority Support</li>
              <li>✔ Advanced Security</li>
            </ul>
            <button className="bg-primaryColor text-white py-2 w-full rounded-md font-semibold">
              Get Started
            </button>
          </div>

          {/* Gold Plan */}
          <div className="py-2 px-6 border rounded-md w-1/2 bg-primaryColor">
            <div className="flex flex-col">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_91_3146)">
                  <rect width="56" height="56" rx="14" fill="white" />
                  <circle
                    cx="7.87262"
                    cy="41.0921"
                    r="41.5381"
                    transform="rotate(-0.403168 7.87262 41.0921)"
                    fill="url(#paint0_linear_91_3146)"
                    stroke="url(#paint1_linear_91_3146)"
                    stroke-width="0.085853"
                  />
                  <circle
                    opacity="0.4"
                    cx="39.0904"
                    cy="20.7752"
                    r="41.5381"
                    transform="rotate(-0.403168 39.0904 20.7752)"
                    fill="url(#paint2_linear_91_3146)"
                    stroke="url(#paint3_radial_91_3146)"
                    stroke-width="0.085853"
                  />
                  <path
                    d="M16.1498 24.0002H39.8497M21.398 16.0675L27.9998 24.0003L34.6127 16.0731M39.5811 23.3723L34.9831 16.4752C34.8673 16.3015 34.8094 16.2147 34.7329 16.1519C34.6652 16.0962 34.5872 16.0545 34.5033 16.029C34.4086 16.0002 34.3043 16.0002 34.0955 16.0002H21.9039C21.6952 16.0002 21.5909 16.0002 21.4961 16.029C21.4123 16.0545 21.3343 16.0962 21.2666 16.1519C21.1901 16.2147 21.1322 16.3015 21.0164 16.4752L16.4184 23.3723C16.2676 23.5984 16.1923 23.7114 16.1653 23.833C16.1414 23.9404 16.1445 24.0521 16.1743 24.158C16.208 24.2779 16.2895 24.3866 16.4526 24.604L27.1464 38.8624C27.4359 39.2484 27.5806 39.4414 27.7581 39.5104C27.9135 39.5709 28.086 39.5709 28.2414 39.5104C28.4188 39.4414 28.5636 39.2484 28.8531 38.8624L39.5469 24.604C39.71 24.3866 39.7915 24.2779 39.8252 24.158C39.855 24.0521 39.8581 23.9404 39.8342 23.833C39.8072 23.7114 39.7318 23.5984 39.5811 23.3723Z"
                    stroke="#1B223C"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_91_3146"
                    x1="7.87262"
                    y1="-0.48893"
                    x2="7.87262"
                    y2="82.6732"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#DAE2FF" stop-opacity="0.56" />
                    <stop offset="1" stop-color="white" stop-opacity="0.2" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_91_3146"
                    x1="51.4246"
                    y1="36.9581"
                    x2="-44.9089"
                    y2="58.3014"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7ECA9D" />
                    <stop offset="1" stop-color="#7ECA9D" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_91_3146"
                    x1="39.0904"
                    y1="-20.8058"
                    x2="39.0904"
                    y2="62.3563"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#B4C4FF" stop-opacity="0.5" />
                    <stop
                      offset="0.9999"
                      stop-color="#E1E8FF"
                      stop-opacity="0.0821875"
                    />
                    <stop offset="1" stop-color="#4C5C99" stop-opacity="0.08" />
                  </linearGradient>
                  <radialGradient
                    id="paint3_radial_91_3146"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(39.0904 20.7752) rotate(89.968) scale(86.1425)"
                  >
                    <stop
                      offset="0.046875"
                      stop-color="#7ECA9D"
                      stop-opacity="0.28"
                    />
                    <stop offset="1" stop-color="#7ECA9D" />
                  </radialGradient>
                  <clipPath id="clip0_91_3146">
                    <rect width="56" height="56" rx="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between py-2">
              <h3 className="font-semibold text-4xl mt-1 text-[#1B223C] ">
                Gold
              </h3>
              <span className="text-lg text-white border border-white  px-2.5 rounded-md">
                Best Offer
              </span>
            </div>
            <p className="text-[#1B223C] ">
              Take Your Learning to the Next Level
              <br /> with Gold Plan.
            </p>
            <p className="text-gray-700 text-5xl font-bold border-b-2 mb-4">
              $59 <span className="text-lg font-normal">per month</span>
            </p>
            <ul className="text-[#1B223C]  mb-3 space-y-2">
              <li>✔ Advanced Learning Tools</li>
              <li>✔ Dedicated Mentor</li>
              <li>✔ Multi-user Access</li>
              <li>✔ Third-party Integrations</li>
              <li>✔ 24/7 Priority Support</li>
            </ul>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md w-full">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipModal;
