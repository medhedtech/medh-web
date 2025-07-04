"use client";
import TabButtonPrimary from "@/components/shared/buttons/TabButtonPrimary";
import LoginForm from "@/components/shared/login/LoginForm";
import SignUpForm from "@/components/shared/login/SignUpForm";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import Image from "next/image";
import shapImage2 from "@/assets/images/education/hero_shape2.png";
import shapImage3 from "@/assets/images/education/hero_shape3.png";
import shapImage4 from "@/assets/images/education/hero_shape4.png";
import shapImage5 from "@/assets/images/education/hero_shape5.png";
import useTab from "@/hooks/useTab";

interface TabButton {
  name: string;
  content: JSX.Element;
}

const LoginTab = (): JSX.Element => {
  const { currentIdx, handleTabClick } = useTab();
  const tabButtons: TabButton[] = [
    { name: "Login", content: <LoginForm /> },
    {
      name: " Sing up",
      content: <SignUpForm />,
    },
  ];
  return (
    <section className="relative ">
      <div className="w-full  flex justify-center items-center ">
        <div className="md:w-[100%] w-full border-2">
          {/* tab controller */}

          {/* <div className=" flex justify-center items-center">
            <div className="tab-links md:w-[60%] w-full grid grid-cols-2 gap-11px text-blackColor text-lg lg:text-size-22 font-semibold font-hind mb-43px mt-30px md:mt-0 ">
              {tabButtons?.map(({ name }, idx) => (
                <TabButtonPrimary
                  key={idx}
                  idx={idx}
                  handleTabClick={handleTabClick}
                  currentIdx={currentIdx}
                  button={"lg"}
                  name={name}
                />
              ))}
            </div>
          </div> */}

          {/* tab contents */}
          <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px   rounded-5px ">
            <div className="tab-contents boder-2 border-black">
              {tabButtons.map(({ content }, idx) => (
                <TabContentWrapper
                  key={idx}
                  isShow={idx === currentIdx || false}
                >
                  {content}
                </TabContentWrapper>
              ))}
            </div>
            {/* <div className="flex flex-wrap text-[13px] md:text-[14px] border-t-2 border-[#727695] md:w-[59%] w-full text-[#727695] pb-5 pl-2 md:pl-10 ">
              <p className="pr-1">By proceeding to login your account you are agreeing to our</p>
              <a href="#" className="text-[#252525] text-[14px] md:text-[15px]">
              Terms of Use
              </a>
              <span className="px-2">and</span>
              <a href="#" className="text-[#252525] text-[14px] md:text-[15px]">
              Privacy Policy
              </a>
            </div> */}
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

export default LoginTab;
