"use client";

import { useState, useEffect } from "react";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import Input from "@/components/ui/Input";
import SingleSelect from "@/components/ui/SingleSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import PhoneInput from "@/components/ui/PhoneInput";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";

interface Nationality {
  id: number;
  code: string;
  name: string;
}

interface Ethnicity {
  id: number;
  code: string;
  name: string;
}

interface Country {
  id: number;
  name: string;
  iso_alpha_2: string;
  iso_alpha_3: string;
}

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
}

export default function BasicInformationContent({
  onNext,
}: BasicInformationContentProps) {
  const { user, fetchProfile } = useAuth();
  const { locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [ethnicities, setEthnicities] = useState<Ethnicity[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
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
  });

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoadingLookups(true);
        const [nationalitiesRes, ethnicitiesRes, countriesRes] =
          await Promise.all([
            apiClient.get(`/lookups/nationalities?lang=${locale}`),
            apiClient.get(`/lookups/ethnicities?lang=${locale}`),
            apiClient.get(`/lookups/countries?lang=${locale}`),
          ]);

        if (nationalitiesRes.data.status === "success") {
          setNationalities(nationalitiesRes.data.data);
        }
        if (ethnicitiesRes.data.status === "success") {
          setEthnicities(ethnicitiesRes.data.data);
        }
        if (countriesRes.data.status === "success") {
          setCountries(countriesRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch lookups:", error);
        toast.error("Failed to load form options");
      } finally {
        setLoadingLookups(false);
      }
    };

    fetchLookups();
  }, [locale]);

  useEffect(() => {
    const profile = user?.profile;
    if (!profile) return;
    setFormData({
      profile_id: profile.id || 0,
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      gender: profile.gender || "",
      dob: profile.dob || "",
      nationality_ids: profile.nationalities?.map((n) => n.id) || [],
      ethnicity_ids: profile.ethnicities?.map((e) => e.id) || [],
      mobile: profile.mobile || "",
      whatsapp: profile.whatsapp || "",
      country_id: profile.lc_country_id ?? profile.country?.id ?? 0,
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.first_name || !formData.last_name) {
        toast.error("First name and last name are required");
        setLoading(false);
        return;
      }
      if (!formData.mobile || !formData.whatsapp) {
        toast.error("Mobile and WhatsApp numbers are required");
        setLoading(false);
        return;
      }
      if (!formData.gender) {
        toast.error("Gender is required");
        setLoading(false);
        return;
      }
      if (!formData.dob) {
        toast.error("Date of birth is required");
        setLoading(false);
        return;
      }
      if (!formData.country_id || formData.country_id === 0) {
        toast.error("Country of residence is required");
        setLoading(false);
        return;
      }
      if (formData.nationality_ids.length === 0) {
        toast.error("At least one nationality is required");
        setLoading(false);
        return;
      }
      if (formData.ethnicity_ids.length === 0) {
        toast.error("At least one ethnicity is required");
        setLoading(false);
        return;
      }

      const payload = {
        profile_id: formData.profile_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        dob: formData.dob,
        mobile: formData.mobile.replace(/\s/g, ""),
        whatsapp: formData.whatsapp.replace(/\s/g, ""),
        country_id: formData.country_id,
        nationality_ids: formData.nationality_ids,
        ethnicity_ids: formData.ethnicity_ids,
      };

      const { data } = await apiClient.post(
        "/profile/basic-information",
        payload
      );
      if (data.status === "success") {
        toast.success(data.message || "Profile updated successfully");
        await fetchProfile();
        onNext();
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? ((error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ??
            (error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error)
          : null;
      toast.error(message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AccountSection
        title="Basic Information"
        description="Update your personal details and contact information"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <AccountField label="First Name" required>
            <Input
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </AccountField>

          <AccountField label="Last Name" required>
            <Input
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </AccountField>

          <AccountField
            label="Email Address"
            required
            description="Your primary email for notifications"
          >
            <Input
              type="email"
              placeholder="john.doe@example.com"
              value={user?.email || ""}
              disabled
            />
          </AccountField>

          <AccountField label="Mobile Number" required>
            <PhoneInput
              name="mobile"
              placeholder="123-4567"
              value={formData.mobile}
              onChange={(value) => handlePhoneChange(value, "mobile")}
              required
            />
          </AccountField>

          <AccountField label="WhatsApp Number" required>
            <PhoneInput
              name="whatsapp"
              placeholder="123-4567"
              value={formData.whatsapp}
              onChange={(value) => handlePhoneChange(value, "whatsapp")}
              required
            />
          </AccountField>

          <AccountField label="Date of Birth" required>
            <DatePicker
              value={formData.dob}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, dob: date }))
              }
              placeholder="Select your date of birth"
              maxDate={new Date().toISOString().split('T')[0]}
            />
          </AccountField>

          <AccountField label="Gender" required>
            <SingleSelect
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
                { value: "prefer_not_to_say", label: "Prefer not to say" },
              ]}
              value={formData.gender}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, gender: String(val) }))
              }
              placeholder="Select Gender"
              searchable={false}
            />
          </AccountField>

          <AccountField label="Country of Residence" required>
            <SingleSelect
              options={countries.map((c) => ({ value: c.id, label: c.name }))}
              value={formData.country_id || ""}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, country_id: Number(val) }))
              }
              placeholder="Select Country"
              loading={loadingLookups}
              disabled={loadingLookups}
            />
          </AccountField>
        </div>

        <div className="space-y-6">
          <AccountField
            label="Nationalities"
            required
            description="Select one or more nationalities"
          >
            <MultiSelect
              options={nationalities}
              value={formData.nationality_ids}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, nationality_ids: value }))
              }
              placeholder="Select nationalities..."
              loading={loadingLookups}
            />
          </AccountField>

          <AccountField
            label="Ethnicities"
            required
            description="Select one or more ethnicities"
          >
            <MultiSelect
              options={ethnicities}
              value={formData.ethnicity_ids}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, ethnicity_ids: value }))
              }
              placeholder="Select ethnicities..."
              loading={loadingLookups}
            />
          </AccountField>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-white/10">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </AccountSection>
    </form>
  );
}
