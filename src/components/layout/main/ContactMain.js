import ContactBanner from "@/components/sections/contact/ContactBanner";
import ContactPrimary from "@/components/sections/contact/ContactPrimary";
import HirePage from "@/components/sections/hire/HirePage";
import Joinmedhpage from "@/components/sections/hire/Joinmedhpage";
import Registration from "@/components/sections/registrations/Registration";
import React from "react";

const ContactMain = () => {
  return (
    <>
      <ContactBanner />
      <Registration  pageTitle="contact_us" />
      <ContactPrimary />
      <Joinmedhpage />
      <HirePage />
    </>
  );
};

export default ContactMain;
