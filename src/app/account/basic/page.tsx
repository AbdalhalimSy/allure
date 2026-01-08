"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import BasicInformationContent from "../_components/BasicInformationContent";

export default function BasicInformationPage() {
  return (
    <AccountPageWrapper>
      <BasicInformationContent onNext={() => {}} />
    </AccountPageWrapper>
  );
}
