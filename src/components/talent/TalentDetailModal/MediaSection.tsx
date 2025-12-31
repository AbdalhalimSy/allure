import Image from "next/image";
import { PlayCircle, Music2 } from "lucide-react";
import { MediaSectionProps, MediaItem } from "./types";

function buildMediaLists(photos: MediaItem[], videos: MediaItem[], audios: MediaItem[]) {
  const all = [...photos, ...videos, ...audios];
  return { all };
}

export function MediaSection({ photos, videos, audios, mediaTab, onTabChange, onOpenLightbox, t }: MediaSectionProps) {
  const photoItems = photos.map((p) => ({ ...p, type: "photo" as const }));
  const videoItems = videos.map((v) => ({ ...v, type: "video" as const }));
  const audioItems = audios.map((a) => ({ ...a, type: "audio" as const }));

  const { all } = buildMediaLists(photoItems, videoItems, audioItems);
  const filtered = mediaTab === "all"
    ? all
    : all.filter((item) => item.type === mediaTab);

  const tabs: { id: "all" | "photo" | "video" | "audio"; label: string }[] = [
    { id: "all", label: t("talents.allMedia") },
    { id: "photo", label: t("talents.photos") },
    { id: "video", label: t("talents.videos") },
    { id: "audio", label: t("talents.audios") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              mediaTab === tab.id ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-gray-700 border-gray-200 hover:border-primary/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
          {t("talents.noMedia") || "No media available"}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onOpenLightbox({ type: item.type, url: item.url, thumbnail: (item as any).thumbnail_url })}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {item.type === "photo" && (
                <div className="relative aspect-square">
                  <Image src={item.url} alt="Media" fill className="object-cover" />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              )}
              {item.type === "video" && (
                <div className="relative aspect-square bg-gray-100">
                  {(item as any).thumbnail_url ? (
                    <Image src={(item as any).thumbnail_url} alt="Video" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">{t("talents.video") || "Video"}</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white">
                      <PlayCircle className="h-6 w-6" />
                    </span>
                  </div>
                </div>
              )}
              {item.type === "audio" && (
                <div className="flex items-center gap-3 p-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Music2 className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{t("talents.audio") || "Audio"}</p>
                    <p className="text-xs text-gray-500">{t("talents.tapToPlay") || "Tap to play"}</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
