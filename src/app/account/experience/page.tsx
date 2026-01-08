"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import ExperienceContent from "../_components/ExperienceContent";

export default function ExperiencePage() {
  return (
    <AccountPageWrapper>
      <ExperienceContent onNext={() => {}} onBack={() => {}} />
    </AccountPageWrapper>
  );
}
