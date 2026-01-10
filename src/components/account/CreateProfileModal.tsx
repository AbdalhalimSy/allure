"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import DatePicker from "@/components/ui/DatePicker";
import MultiSelect from "@/components/ui/MultiSelect";
import SingleSelect from "@/components/ui/SingleSelect";
import PhoneInput from "@/components/ui/PhoneInput";
import Switch from "@/components/ui/Switch";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { logger } from "@/lib/utils/logger";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LookupOption {
  id: number;
  name: string;
  code?: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  second_twin_name: string;
  gender: string;
  dob: string;
  mobile: string;
  whatsapp: string;
  country_id: number;
  nationality_ids: number[];
  ethnicity_ids: number[];
  differentWhatsApp: boolean;
}

export default function CreateProfileModal({
  isOpen,
  onClose,
}: CreateProfileModalProps) {
  const { t } = useI18n();
  const { fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [nationalities, setNationalities] = useState<LookupOption[]>([]);
  const [ethnicities, setEthnicities] = useState<LookupOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    second_twin_name: "",
    gender: "",
    dob: "",
    mobile: "",
    whatsapp: "",
    country_id: 0,
    nationality_ids: [],
    ethnicity_ids: [],
    differentWhatsApp: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch lookups
  useEffect(() => {
    if (isOpen) {
      fetchLookups();
    }
  }, [isOpen]);

  const fetchLookups = async () => {
    try {
      setLoadingLookups(true);
      const [countriesRes, nationalitiesRes, ethnicitiesRes] =
        await Promise.all([
          apiClient.get("/lookups/countries"),
          apiClient.get("/lookups/nationalities"),
          apiClient.get("/lookups/ethnicities"),
        ]);

      if (countriesRes.data.status === "success") {
        setCountries(countriesRes.data.data);
      }
      if (nationalitiesRes.data.status === "success") {
        setNationalities(nationalitiesRes.data.data);
      }
      if (ethnicitiesRes.data.status === "success") {
        setEthnicities(ethnicitiesRes.data.data);
      }
    } catch (error) {
      logger.error("Failed to fetch lookups", error);
      toast.error(t("common.error") || "Failed to load options");
    } finally {
      setLoadingLookups(false);
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
    setErrors({});

    // Basic validation
    if (!formData.first_name.trim()) {
      setErrors((prev) => ({
        ...prev,
        first_name:
          t("account.profiles.errors.firstNameRequired") ||
          "First name is required",
      }));
      return;
    }
    if (!formData.last_name.trim()) {
      setErrors((prev) => ({
        ...prev,
        last_name:
          t("account.profiles.errors.lastNameRequired") ||
          "Last name is required",
      }));
      return;
    }
    if (!formData.dob) {
      setErrors((prev) => ({
        ...prev,
        dob:
          t("account.profiles.errors.dobRequired") ||
          "Date of birth is required",
      }));
      return;
    }
    if (!formData.mobile.trim()) {
      setErrors((prev) => ({
        ...prev,
        mobile:
          t("account.profiles.errors.mobileRequired") ||
          "Mobile number is required",
      }));
      return;
    }
    if (!formData.gender) {
      setErrors((prev) => ({
        ...prev,
        gender:
          t("account.profiles.errors.genderRequired") || "Gender is required",
      }));
      return;
    }
    if (!formData.country_id || formData.country_id === 0) {
      setErrors((prev) => ({
        ...prev,
        country_id:
          t("account.profiles.errors.countryRequired") || "Country is required",
      }));
      return;
    }
    if (formData.nationality_ids.length === 0) {
      setErrors((prev) => ({
        ...prev,
        nationality_ids:
          t("account.profiles.errors.nationalityRequired") ||
          "At least one nationality is required",
      }));
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const cleanMobile = formData.mobile.replace(/\s/g, "");
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(formData.second_twin_name && {
          second_twin_name: formData.second_twin_name,
        }),
        gender: formData.gender,
        dob: formData.dob,
        mobile: cleanMobile,
        whatsapp: formData.differentWhatsApp
          ? formData.whatsapp.replace(/\s/g, "")
          : cleanMobile,
        country_id: formData.country_id,
        nationality_ids: formData.nationality_ids,
        ...(formData.ethnicity_ids.length > 0 && {
          ethnicity_ids: formData.ethnicity_ids,
        }),
      };

      const response = await apiClient.post("/profile/create", payload);

      if (response.data.status === "success") {
        toast.success(
          t("account.profiles.createSuccess") || "Profile created successfully"
        );

        // Refresh profile data
        await fetchProfile();

        // Reset form and close modal
        setFormData({
          first_name: "",
          last_name: "",
          second_twin_name: "",
          gender: "",
          dob: "",
          mobile: "",
          whatsapp: "",
          country_id: 0,
          nationality_ids: [],
          ethnicity_ids: [],
          differentWhatsApp: false,
        });
        onClose();
      }
    } catch (error: any) {
      logger.error("Failed to create profile", error);

      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors: Record<string, string> = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        toast.error(
          error.response?.data?.message ||
            t("account.profiles.createError") ||
            "Failed to create profile"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        first_name: "",
        last_name: "",
        second_twin_name: "",
        gender: "",
        dob: "",
        mobile: "",
        whatsapp: "",
        country_id: 0,
        nationality_ids: [],
        ethnicity_ids: [],
        differentWhatsApp: false,
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {t("account.profiles.createNewProfile") || "Create New Profile"}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {t("account.profiles.basicInformation") || "Basic Information"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <Label>
                  {t("account.profiles.fields.firstName") || "First Name"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder={
                    t("account.profiles.placeholders.firstName") ||
                    "Enter first name"
                  }
                  disabled={loading}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label>
                  {t("account.profiles.fields.lastName") || "Last Name"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder={
                    t("account.profiles.placeholders.lastName") ||
                    "Enter last name"
                  }
                  disabled={loading}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Second Twin Name */}
            <div>
              <Label>
                {t("account.profiles.fields.secondTwinName") ||
                  "Second Name (for twins)"}
              </Label>
              <Input
                value={formData.second_twin_name}
                onChange={(e) =>
                  setFormData({ ...formData, second_twin_name: e.target.value })
                }
                placeholder={
                  t("account.profiles.placeholders.secondTwinName") ||
                  "Optional: for twins"
                }
                disabled={loading}
              />
            </div>

            {/* Gender */}
            <div>
              <Label>
                {t("account.profiles.fields.gender") || "Gender"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <SingleSelect
                options={[
                  {
                    value: "male",
                    label: t("male") || "Male",
                  },
                  {
                    value: "female",
                    label: t("female") || "Female",
                  },
                  {
                    value: "other",
                    label: t("other") || "Other",
                  },
                ]}
                value={formData.gender}
                onChange={(val) =>
                  setFormData({ ...formData, gender: String(val) })
                }
                placeholder={
                  t("account.profiles.fields.gender") || "Select gender"
                }
                searchable={false}
                disabled={loading}
              />
              {errors.gender && (
                <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label>
                {t("account.profiles.fields.dob") || "Date of Birth"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={formData.dob}
                onChange={(date) => setFormData({ ...formData, dob: date })}
                maxDate={new Date().toISOString().split("T")[0]}
                placeholder={
                  t("account.profiles.placeholders.dob") ||
                  "Select date of birth"
                }
              />
              {errors.dob && (
                <p className="text-sm text-red-600 mt-1">{errors.dob}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {t("account.profiles.contactInformation") ||
                "Contact Information"}
            </h3>

            <div className="space-y-4">
              {/* Mobile */}
              <div>
                <Label>
                  {t("account.profiles.fields.mobile") || "Mobile Number"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <PhoneInput
                  value={formData.mobile}
                  onChange={(value) => handlePhoneChange(value, "mobile")}
                  placeholder={t("account.basic.phoneExample") || "123-4567"}
                  disabled={loading}
                />
                {errors.mobile && (
                  <p className="text-sm text-red-600 mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Different WhatsApp Toggle */}
              <div>
                <Switch
                  checked={formData.differentWhatsApp}
                  onChange={handleWhatsAppToggle}
                  label={
                    t("account.basic.fields.differentWhatsApp") ||
                    "Use different WhatsApp number"
                  }
                  disabled={loading}
                />
              </div>

              {/* WhatsApp - Only show if different */}
              {formData.differentWhatsApp && (
                <div>
                  <Label>
                    {t("account.profiles.fields.whatsapp") || "WhatsApp Number"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <PhoneInput
                    value={formData.whatsapp}
                    onChange={(value) => handlePhoneChange(value, "whatsapp")}
                    placeholder={t("account.basic.phoneExample") || "123-4567"}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location & Demographics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              {t("account.profiles.locationDemographics") ||
                "Location & Demographics"}
            </h3>

            {/* Country */}
            <div>
              <Label>
                {t("account.profiles.fields.country") || "Country"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <SingleSelect
                options={countries.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                value={formData.country_id || ""}
                onChange={(val) =>
                  setFormData({ ...formData, country_id: Number(val) })
                }
                placeholder={
                  t("account.profiles.placeholders.country") || "Select country"
                }
                loading={loadingLookups}
                disabled={loading || loadingLookups}
              />
              {errors.country_id && (
                <p className="text-sm text-red-600 mt-1">{errors.country_id}</p>
              )}
            </div>

            {/* Nationalities */}
            <div>
              <Label>
                {t("account.profiles.fields.nationalities") || "Nationalities"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <MultiSelect
                options={nationalities}
                value={formData.nationality_ids}
                onChange={(ids) =>
                  setFormData({ ...formData, nationality_ids: ids })
                }
                placeholder={
                  t("account.profiles.placeholders.nationalities") ||
                  "Select nationalities"
                }
                loading={loadingLookups}
              />
              {errors.nationality_ids && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.nationality_ids}
                </p>
              )}
            </div>

            {/* Ethnicities */}
            <div>
              <Label>
                {t("account.profiles.fields.ethnicities") || "Ethnicities"}
              </Label>
              <MultiSelect
                options={ethnicities}
                value={formData.ethnicity_ids}
                onChange={(ids) =>
                  setFormData({ ...formData, ethnicity_ids: ids })
                }
                placeholder={
                  t("account.profiles.placeholders.ethnicities") ||
                  "Select ethnicities (optional)"
                }
                loading={loadingLookups}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || loadingLookups}
              className="flex-1"
            >
              {loading
                ? t("account.profiles.creating") || "Creating..."
                : t("account.profiles.createProfile") || "Create Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
