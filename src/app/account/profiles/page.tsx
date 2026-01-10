"use client";

import { useState } from "react";
import AccountPageWrapper from "../_lib/AccountPageWrapper";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import { useI18n } from "@/contexts/I18nContext";
import ProfilesList from "@/components/account/ProfilesList";
import CreateProfileModal from "@/components/account/CreateProfileModal";

export default function ProfilesPage() {
  const { t } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <AccountPageWrapper requireCompleteProfile={false}>
      <div className="space-y-6 sm:space-y-8">
        <AccountSection
          title={t("account.profiles.title") || "My Profiles"}
          description={
            t("account.profiles.description") ||
            "Manage your talent profiles. You can create multiple profiles for different personas, family members, or twins."
          }
        >
          <div className="space-y-6">
            {/* Profiles List */}
            <ProfilesList onCreateNew={() => setShowCreateModal(true)} />

            {/* Add Profile Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                {t("account.profiles.addProfile") || "Add New Profile"}
              </Button>
            </div>
          </div>
        </AccountSection>
      </div>

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </AccountPageWrapper>
  );
}
