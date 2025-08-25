import MoneyGuaranteePolicy from "@/components/layout/main/MoneyGuaranteePolicy";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

export const metadata = {
  title: "Money Guarantee Policy",
  description: "Money Guarantee Policy | Medh",
};

const MoneyGuaranteePolicyPage = () => {
  return (
    <PageWrapper>
      <main className="pt-16">
        <MoneyGuaranteePolicy/>
      </main>
    </PageWrapper>
  );
};

export default MoneyGuaranteePolicyPage;
