"use client";
import useIsTrue from "@/hooks/useIsTrue";
import React from "react";
import Link from "next/link";

const HeaderTop = () => {
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");

  return (
    <div className="bg-[#7ECA9D] dark:bg-lightGrey10-dark hidden lg:block">
      <div
        className={`${
          isHome1 ||
          isHome1Dark ||
          isHome4 ||
          isHome4Dark ||
          isHome5 ||
          isHome5Dark
            ? "lg:container 3xl:container2-lg"
            : "container 3xl:container-secondary-lg "
        } 4xl:container mx-auto text-whiteColor text-size-12 xl:text-sm py-5px xl:py-9px`}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="flex pl-16">
              <span className="pr-6">Call: +91 77108 40696</span> |{" "}
              <span className="pl-6">Follow us:</span>
              <ul className="flex gap-2.5 pl-2">
                <li>
                  <a href="https://www.facebook.com">
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com">
                    <i className="icofont-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com">
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com">
                    <i className="icofont-youtube-play"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Link href={'/login'}>
          <div className="flex gap-2 pr-10 items-center">
            
            <div>
                <i className="icofont-login"></i>
            </div>
            LOGIN
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
