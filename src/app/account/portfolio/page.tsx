"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import PortfolioContent from "../_components/PortfolioContent";

export default function PortfolioPage() {
  return (
    <AccountPageWrapper>
      <PortfolioContent onBack={() => {}} />
    </AccountPageWrapper>
  );
}
