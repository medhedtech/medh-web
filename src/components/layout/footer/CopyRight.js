import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/logo_2.png";
import useIsSecondary from "@/hooks/useIsSecondary";
import qr from "@/assets/images/footer/qr.png";
const CopyRight = () => {
  const { isSecondary } = useIsSecondary();
  return (
    <div>
      <div className="relative mx-auto mt-6 w-[150px] h-[150px]">
        <Image src={qr} alt="qr" fill className="object-contain" />
      </div>
      <div className="mx-auto flex justify-center mt-3">
        <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
          <li>
            <a
              href="https://www.facebook.com"
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px rounded-full lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-white bg-white bg-opacity-10 text-center"
            >
              <i className="icofont-facebook"></i>
            </a>
          </li>

          <li>
            <a
              href="https://www.linkedin.com"
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px rounded-full lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-white bg-white bg-opacity-10 text-center"
            >
              <i className="icofont-linkedin"></i>
            </a>
          </li>
          <li>
            <a
              href=""
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px rounded-full lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-white bg-white bg-opacity-10 text-center"
            >
              <i className="icofont-instagram"></i>
            </a>
          </li>
          <li>
            <a
              href=""
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px rounded-full lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-white bg-white bg-opacity-10 text-center"
            >
              <i className="icofont-youtube-play"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="text-white flex justify-center gap-1 mt-2 text-sm">
        <span>Terms of Service </span>|<span>Privacy Policy</span>|
        <span>Reschedule Policy</span>|<span>Cancellation & Refund Policy</span>
      </div>
      <div>
        <h3 className="text-sm text-white text-center mt-4">
          All trademarks and logos appearing on this website are the property of
          their respective owners.
        </h3>
        <p className="text-sm text-white text-center">
          Copyright © 2023. All Rights Reserved.
        </p>
        <p className="text-sm text-white text-center">
          MEDH – LEARN. UPSKILL. ELEVATE.
        </p>
      </div>
      {/* {isSecondary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-10 lg:mt-4 items-center border-t border-darkcolor">
          <div>
            <p className="text-base text-center sm:text-start text-darkgray">
              © 2024 Powered by{" "}
              <a href="#" className="hover:text-primaryColor">
                Edurock
              </a>{" "}
              . All Rights Reserved.
            </p>
          </div>

          <div>
            <ul className="flex items-center justify-center sm:justify-end">
              <li>
                <a
                  href="#"
                  className="text-base text-darkgray hover:text-primaryColor pr-4 border-r border-darkgray leading-1"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-darkgray hover:text-primaryColor pl-4"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-30px pt-10 items-center">
          <div className="lg:col-start-1 lg:col-span-3">
            <a href="index.html">
              <Image src={logoImage} alt="" placeholder="blur" />
            </a>
          </div>

          <div className="lg:col-start-4 lg:col-span-6">
            <p className="text-whiteColor">
              Copyright © <span className="text-primaryColor">2024 </span> by
              edurock. All Rights Reserved.
            </p>
          </div>

          <div className="lg:col-start-10 lg:col-span-3">
            <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
              <li>
                <a
                  href="https://www.facebook.com"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.twitter.com"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.vimeo.com"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-vimeo"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-linkedin"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.skype.com"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-skype"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CopyRight;
