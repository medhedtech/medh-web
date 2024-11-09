"use client";
import SignUpForm from "@/components/shared/login/SignUpForm";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import Image from "next/image";
import shapImage2 from "@/assets/images/education/hero_shape2.png";
import shapImage3 from "@/assets/images/education/hero_shape3.png";
import shapImage4 from "@/assets/images/education/hero_shape4.png";
import shapImage5 from "@/assets/images/education/hero_shape5.png";

const SignupTab = () => {
  return (
    <section className="relative ">
      <div className="w-full py-100px flex justify-center items-center ">
        <div className="md:w-[100%] w-full border-2">
          {/* Sign-up content */}
          <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px  md:py-30px rounded-5px ">
            <div className="tab-contents border-2 border-black">
              <TabContentWrapper isShow={true}>
                <SignUpForm />
              </TabContentWrapper>
            </div>
          </div>
        </div>
      </div>
      {/* animated icons */}
      <div>
        <Image
          loading="lazy"
          className="absolute right-[5%] top-[30%] animate-move-var"
          src={shapImage2}
          alt="Shape"
        />
        <Image
          loading="lazy"
          className="absolute left-[4%] top-1/2 animate-move-hor"
          src={shapImage3}
          alt="Shape"
        />
        <Image
          loading="lazy"
          className="absolute left-1/2 bottom-[60px] animate-spin-slow"
          src={shapImage4}
          alt="Shape"
        />
        <Image
          loading="lazy"
          className="absolute left-1/2 top-10 animate-spin-slow"
          src={shapImage5}
          alt="Shape"
        />
      </div>
    </section>
  );
};

export default SignupTab;
