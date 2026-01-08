"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import ProfilePhotosManager from "@/components/account/ProfilePhotosManager";

export default function ProfilePhotosPage() {
  return (
    <AccountPageWrapper requireCompleteProfile={false}>
      <ProfilePhotosManager />
    </AccountPageWrapper>
  );
}
