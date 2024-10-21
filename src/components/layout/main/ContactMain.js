import ContactFrom from "@/components/sections/contact-form/ContactFrom";
import ContactBanner from "@/components/sections/contact/ContactBanner";
import ContactPrimary from "@/components/sections/contact/ContactPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import Hire from "@/components/sections/hire/Hire";
import HirePage from "@/components/sections/hire/HirePage";
import JoinMedh from "@/components/sections/hire/JoinMedh";
import Joinmedhpage from "@/components/sections/hire/Joinmedhpage";
import Registration from "@/components/sections/registrations/Registration";
import React from "react";

const ContactMain = () => {
  return (
    <>
      {/* <HeroPrimary path={"Contact Page"} title={"Contact Page"} /> */}
      <ContactBanner />
      <Registration />
      <ContactPrimary />
      <Joinmedhpage />
      <HirePage />
      {/* <Hire /> */}
      {/* <ContactFrom /> */}
    </>
  );
};

export default ContactMain;
