"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import ProfessionContent from "../_components/ProfessionContent";

export default function ProfessionPage() {
  return (
    <AccountPageWrapper>
      <ProfessionContent onNext={() => {}} onBack={() => {}} />
    </AccountPageWrapper>
  );
}
