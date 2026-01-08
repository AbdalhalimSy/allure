"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import AppearanceContent from "../_components/AppearanceContent";

export default function AppearancePage() {
  return (
    <AccountPageWrapper>
      <AppearanceContent onNext={() => {}} onBack={() => {}} />
    </AccountPageWrapper>
  );
}
