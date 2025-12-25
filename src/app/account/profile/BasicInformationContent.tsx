"use client";

import { useState, useEffect } from "react";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import AccountFormSkeleton from "@/components/account/AccountFormSkeleton";
import Input from "@/components/ui/Input";
import SingleSelect from "@/components/ui/SingleSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import PhoneInput from "@/components/ui/PhoneInput";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { useLookupData } from "@/hooks/useLookupData";
import { getErrorMessage } from "@/lib/utils/errorHandling";

interface BasicInformationContentProps {
  onNext: () => void;
}

interface BasicInfoFormState {
  profile_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  nationality_ids: number[];
  ethnicity_ids: number[];
  mobile: string;
  whatsapp: string;
  country_id: number;
  differentWhatsApp: boolean;
}

export default function BasicInformationContent({
  onNext,
}: BasicInformationContentProps) {
  const { user, fetchProfile } = useAuth();
  const { t } = useI18n();
  const { data: lookupData, loading: loadingLookups } = useLookupData({
    fetchNationalities: true,
    fetchEthnicities: true,
    fetchCountries: true,
    showError: true,
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BasicInfoFormState>({
    profile_id: 0,
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    nationality_ids: [] as number[],
    ethnicity_ids: [] as number[],
    mobile: "",
    whatsapp: "",
    country_id: 0,
    differentWhatsApp: false,
  });

  // Extract countries from lookupData
  const nationalities = lookupData.nationalities || [];
  const ethnicities = lookupData.ethnicities || [];
  const countries = lookupData.countries || [];

  useEffect(() => {
    const profile = user?.profile;
    if (!profile) return;
    const mobile = profile.mobile || "";
    const whatsapp = profile.whatsapp || "";
    const isDifferent = mobile !== whatsapp && whatsapp !== "";

    setFormData({
      profile_id: profile.id || 0,
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      gender: profile.gender || "",
      dob: profile.dob || "",
      nationality_ids: profile.nationalities?.map((n) => n.id) || [],
      ethnicity_ids: profile.ethnicities?.map((e) => e.id) || [],
      mobile: mobile,
      whatsapp: whatsapp,
      country_id: profile.lc_country_id ?? profile.country?.id ?? 0,
      differentWhatsApp: isDifferent,
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "country_id") {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value: string, field: "mobile" | "whatsapp") => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // If not using different WhatsApp and mobile changes, sync whatsapp
      if (field === "mobile" && !prev.differentWhatsApp) {
        updated.whatsapp = value;
      }
      return updated;
    });
  };

  const handleWhatsAppToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      differentWhatsApp: checked,
      // If unchecking, sync WhatsApp with mobile
      whatsapp: checked ? prev.whatsapp : prev.mobile,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.first_name || !formData.last_name) {
        toast.error(t("account.basic.errors.nameRequired"));
        setLoading(false);
        return;
      }
      if (!formData.mobile) {
        toast.error(t("account.basic.errors.phoneRequired"));
        setLoading(false);
        return;
      }
      if (formData.differentWhatsApp && !formData.whatsapp) {
        toast.error(t("account.basic.errors.save"));
        setLoading(false);
        return;
      }
      if (!formData.gender) {
        toast.error(t("account.basic.errors.genderRequired"));
        setLoading(false);
        return;
      }
      if (!formData.dob) {
        toast.error(t("account.basic.errors.dobRequired"));
        setLoading(false);
        return;
      }
      if (!formData.country_id || formData.country_id === 0) {
        toast.error(t("account.basic.errors.countryRequired"));
        setLoading(false);
        return;
      }
      if (formData.nationality_ids.length === 0) {
        toast.error(t("account.basic.errors.nationalityRequired"));
        setLoading(false);
        return;
      }
      if (formData.nationality_ids.length > 2) {
        toast.error(t("account.basic.errors.nationalityLimit"));
        setLoading(false);
        return;
      }
      if (formData.ethnicity_ids.length === 0) {
        toast.error(t("account.basic.errors.ethnicityRequired"));
        setLoading(false);
        return;
      }
      if (formData.ethnicity_ids.length > 2) {
        toast.error(t("account.basic.errors.ethnicityLimit"));
        setLoading(false);
        return;
      }

      const cleanMobile = formData.mobile.replace(/\s/g, "");
      const payload = {
        profile_id: formData.profile_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        dob: formData.dob,
        mobile: cleanMobile,
        whatsapp: formData.differentWhatsApp
          ? formData.whatsapp.replace(/\s/g, "")
          : cleanMobile,
        country_id: formData.country_id,
        nationality_ids: formData.nationality_ids,
        ethnicity_ids: formData.ethnicity_ids,
      };

      const { data } = await apiClient.post(
        "/profile/basic-information",
        payload
      );
      if (data.status === "success") {
        toast.success(t("account.basic.success"));
        await fetchProfile();
        onNext();
      }
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        t("account.basic.errors.saveFailed")
      );
      toast.error(message || t("account.basic.errors.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Show skeleton while loading lookups or user data */}
      {loadingLookups || !user ? (
        <AccountFormSkeleton />
      ) : (
        <form onSubmit={handleSubmit}>
          <AccountSection
            title={t("account.basic.title")}
            description={t("account.basic.description")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <AccountField
                label={t("account.basic.fields.firstName")}
                required
              >
                <Input
                  name="first_name"
                  placeholder={t("basicInformation.johnExample") || "John"}
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </AccountField>

              <AccountField label={t("account.basic.fields.lastName")} required>
                <Input
                  name="last_name"
                  placeholder={t("basicInformation.doeExample") || "Doe"}
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </AccountField>

              <AccountField
                label={t("account.basic.fields.email")}
                required
                description={t("account.basic.fields.emailDescription")}
              >
                <Input
                  type="email"
                  placeholder={
                    t("basicInformation.emailExample") || "john.doe@example.com"
                  }
                  value={user?.email || ""}
                  disabled
                />
              </AccountField>

              <AccountField label={t("account.basic.fields.mobile")} required>
                <PhoneInput
                  name="mobile"
                  placeholder={t("basicInformation.phoneExample") || "123-4567"}
                  value={formData.mobile}
                  onChange={(value) => handlePhoneChange(value, "mobile")}
                  required
                />
              </AccountField>

              <AccountField label="" className="content-center mt-4">
                <Switch
                  checked={formData.differentWhatsApp}
                  onChange={handleWhatsAppToggle}
                  label={t("account.basic.fields.differentWhatsApp")}
                />
              </AccountField>

              {formData.differentWhatsApp && (
                <AccountField
                  label={t("account.basic.fields.whatsapp")}
                  required
                >
                  <PhoneInput
                    name="whatsapp"
                    placeholder="123-4567"
                    value={formData.whatsapp}
                    onChange={(value) => handlePhoneChange(value, "whatsapp")}
                    required
                  />
                </AccountField>
              )}

              <AccountField label={t("account.basic.fields.dob")} required>
                <DatePicker
                  value={formData.dob}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, dob: date }))
                  }
                  placeholder={t("account.basic.fields.dateOfBirth")}
                  maxDate={new Date().toISOString().split("T")[0]}
                />
              </AccountField>

              <AccountField label={t("account.basic.fields.gender")} required>
                <SingleSelect
                  options={[
                    {
                      value: "male",
                      label: t("account.basic.genderOptions.male"),
                    },
                    {
                      value: "female",
                      label: t("account.basic.genderOptions.female"),
                    },
                    {
                      value: "other",
                      label: t("account.basic.genderOptions.other"),
                    },
                  ]}
                  value={formData.gender}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, gender: String(val) }))
                  }
                  placeholder={t("account.basic.fields.gender")}
                  searchable={false}
                />
              </AccountField>

              <AccountField label={t("account.basic.fields.country")} required>
                <SingleSelect
                  options={countries.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={formData.country_id || ""}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      country_id: Number(val),
                    }))
                  }
                  placeholder={t("account.basic.fields.country")}
                  loading={loadingLookups}
                  disabled={loadingLookups}
                />
              </AccountField>
            </div>

            <div className="space-y-6">
              <AccountField
                label={t("account.basic.fields.nationalities")}
                required
                description={t("account.basic.fields.nationalitiesDescription")}
              >
                <MultiSelect
                  options={nationalities}
                  value={formData.nationality_ids}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, nationality_ids: value }))
                  }
                  placeholder={t("account.basic.fields.nationality")}
                  loading={loadingLookups}
                  maxSelected={2}
                  limitMessage={t("account.basic.errors.nationalityLimit")}
                />
              </AccountField>

              <AccountField
                label={t("account.basic.fields.ethnicities")}
                required
                description={t("account.basic.fields.ethnicitiesDescription")}
              >
                <MultiSelect
                  options={ethnicities}
                  value={formData.ethnicity_ids}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, ethnicity_ids: value }))
                  }
                  placeholder={t("account.basic.fields.ethnicity")}
                  loading={loadingLookups}
                  maxSelected={2}
                  limitMessage={t("account.basic.errors.ethnicityLimit")}
                />
              </AccountField>
            </div>

 <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 ">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading
                  ? t("account.buttons.saving")
                  : t("common.saveAndContinue")}
              </Button>
            </div>
          </AccountSection>
        </form>
      )}
    </>
  );
}
