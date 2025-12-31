import { MessageCircle, Phone } from "lucide-react";
import { ContactAndAttributesProps } from "./types";

export function ContactAndAttributes({ profile, t }: ContactAndAttributesProps) {
  return (
    <>
      {(profile.mobile || profile.whatsapp) && (
        <div className="rounded-xl bg-gray-50 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">{t("talents.contact")}</p>
          {profile.mobile && (
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">{t("talents.phone")}</p>
                <p dir="ltr" className="text-sm font-semibold text-gray-900">{profile.mobile}</p>
              </div>
            </div>
          )}
          {profile.whatsapp && (
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">{t("talents.whatsapp")}</p>
                <p dir="ltr" className="text-sm font-semibold text-gray-900">{profile.whatsapp}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">{t("talents.physicalAttributes")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {profile.hair_color && (
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-600">{t("talents.hairColor")}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{profile.hair_color}</p>
            </div>
          )}
          {profile.eye_color && (
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-600">{t("talents.eyeColor")}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{profile.eye_color}</p>
            </div>
          )}
          {profile.hair_type && (
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-600">{t("talents.hairType")}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{profile.hair_type}</p>
            </div>
          )}
          {profile.hair_length && (
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-600">{t("talents.hairLength")}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{profile.hair_length}</p>
            </div>
          )}
        </div>
      </div>

      {(profile.chest || profile.bust || profile.waist) && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">{t("talents.measurements")}</h3>
          <div className="grid grid-cols-3 gap-3">
            {profile.chest && (
              <div className="rounded-lg bg-gray-100 p-3 text-center">
                <p className="text-xs text-gray-600">{t("talents.chest")}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{profile.chest}</p>
                <p className="text-xs text-gray-500">cm</p>
              </div>
            )}
            {profile.bust && (
              <div className="rounded-lg bg-gray-100 p-3 text-center">
                <p className="text-xs text-gray-600">{t("talents.bust")}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{profile.bust}</p>
                <p className="text-xs text-gray-500">cm</p>
              </div>
            )}
            {profile.waist && (
              <div className="rounded-lg bg-gray-100 p-3 text-center">
                <p className="text-xs text-gray-600">{t("talents.waist")}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{profile.waist}</p>
                <p className="text-xs text-gray-500">cm</p>
              </div>
            )}
          </div>
        </div>
      )}

      {(profile.shoe_size || profile.tshirt_size || profile.pants_size || profile.jacket_size) && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">{t("talents.sizes")}</h3>
          <div className="grid grid-cols-2 gap-3">
            {profile.shoe_size && (
              <div className="rounded-lg bg-gray-100 p-3">
                <p className="text-xs text-gray-600">{t("talents.shoe")}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{profile.shoe_size}</p>
              </div>
            )}
            {profile.tshirt_size && (
              <div className="rounded-lg bg-gray-100 p-3">
                <p className="text-xs text-gray-600">{t("talents.tshirt")}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{profile.tshirt_size}</p>
              </div>
            )}
            {profile.pants_size && (
              <div className="rounded-lg bg-gray-100 p-3">
                <p className="text-xs text-gray-600">{t("talents.pants")}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{profile.pants_size}</p>
              </div>
            )}
            {profile.jacket_size && (
              <div className="rounded-lg bg-gray-100 p-3">
                <p className="text-xs text-gray-600">{t("talents.jacket")}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{profile.jacket_size}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
