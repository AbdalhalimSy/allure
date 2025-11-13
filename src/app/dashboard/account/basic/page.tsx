"use client";

import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import MultiSelect from "@/components/ui/MultiSelect";
import PhoneInput from "@/components/ui/PhoneInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

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

export default function BasicInformationPage() {
  const { user, fetchProfile } = useAuth();
  const { locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [ethnicities, setEthnicities] = useState<Ethnicity[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [formData, setFormData] = useState({
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

  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  useEffect(() => {
    // Fetch nationalities, ethnicities, and countries
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
    if (user?.profile) {
      setFormData({
        profile_id: user.profile.id || 0,
        first_name: user.profile.first_name || "",
        last_name: user.profile.last_name || "",
        gender: user.profile.gender || "",
        dob: user.profile.dob || "",
        nationality_ids:
          user.profile.nationalities?.map((n: any) => n.id) || [],
        ethnicity_ids: user.profile.ethnicities?.map((e: any) => e.id) || [],
        mobile: user.profile.mobile || "",
        whatsapp: user.profile.whatsapp || "",
        country_id:
          (user.profile.lc_country_id as any) ||
          (user.profile.country && (user.profile.country as any).id) ||
          0,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // Convert country_id to number
    if (name === "country_id") {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
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

      // Prepare payload with proper arrays
      const payload = {
        profile_id: formData.profile_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        dob: formData.dob,
        mobile: formData.mobile.replace(/\s/g, ""), // Remove spaces
        whatsapp: formData.whatsapp.replace(/\s/g, ""), // Remove spaces
        country_id: formData.country_id,
        nationality_ids: formData.nationality_ids,
        ethnicity_ids: formData.ethnicity_ids,
      };

      console.log("Submitting payload:", payload);

      const { data } = await apiClient.post(
        "/profile/basic-information",
        payload
      );
      if (data.status === "success") {
        toast.success(data.message || "Profile updated successfully");
        await fetchProfile(); // Refresh profile data
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user?.profile) {
      setFormData({
        profile_id: user.profile.id || 0,
        first_name: user.profile.first_name || "",
        last_name: user.profile.last_name || "",
        gender: user.profile.gender || "",
        dob: user.profile.dob || "",
        nationality_ids:
          user.profile.nationalities?.map((n: any) => n.id) || [],
        ethnicity_ids: user.profile.ethnicities?.map((e: any) => e.id) || [],
        mobile: user.profile.mobile || "",
        whatsapp: user.profile.whatsapp || "",
        country_id:
          (user.profile.lc_country_id as any) ||
          (user.profile.country && (user.profile.country as any).id) ||
          0,
      });
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
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
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </AccountField>

              <AccountField label="Gender" required>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </Select>
              </AccountField>

              <AccountField label="Country of Residence" required>
                <Select
                  name="country_id"
                  value={formData.country_id || ""}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </Select>
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
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </AccountSection>
        </form>
      </AccountLayout>
    </ProtectedRoute>
  );
}
