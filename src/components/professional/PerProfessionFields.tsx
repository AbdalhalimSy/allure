"use client";

import { Profession, SubProfession, ProfessionEntry } from "@/types/profession";
import PhotoUpload from "./PhotoUpload";
import VideoUpload from "./VideoUpload";
import AudioUpload from "./AudioUpload";
import LanguagesSelector from "./LanguagesSelector";

interface PerProfessionFieldsProps {
  profession: Profession | undefined;
  subProfession: SubProfession | undefined;
  entryIndex: number;
  formData: any;
  onChange: (field: string, value: any, entryIndex: number) => void;
}

export default function PerProfessionFields({
  profession,
  subProfession,
  entryIndex,
  formData,
  onChange,
}: PerProfessionFieldsProps) {
  // Determine requirements for this entry
  const requiresPhoto = subProfession?.requires_photo ?? profession?.requires_photo;
  const requiresVideo = subProfession?.requires_video ?? profession?.requires_video;
  const requiresAudio = subProfession?.requires_audio ?? profession?.requires_audio;
  const requiresLanguages = profession?.requires_languages;

  return (
    <div className="space-y-6 mt-6">
      {/* Photo Upload */}
      {requiresPhoto && (
        <PhotoUpload
          photos={formData.photos || []}
          onChange={(files: File[]) => onChange("photos", files, entryIndex)}
        />
      )}
      {/* Video Upload */}
      {requiresVideo && (
        <VideoUpload
          videos={formData.videos || []}
          onChange={(files: File[]) => onChange("videos", files, entryIndex)}
        />
      )}
      {/* Audio Upload */}
      {requiresAudio && (
        <AudioUpload
          audios={formData.audios || []}
          onChange={(files: File[]) => onChange("audios", files, entryIndex)}
        />
      )}
      {/* Languages Selector */}
      {requiresLanguages && (
        <LanguagesSelector
          selectedLanguages={formData.languages || []}
          onChange={(languages: string[]) => onChange("languages", languages, entryIndex)}
        />
      )}
    </div>
  );
}
