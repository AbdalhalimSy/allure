import Link from "next/link";
import Image from "next/image";
import { Talent } from "@/types/talent";
import { MapPin, Ruler, Sparkles, TrendingUp } from "lucide-react";
import AccentTag from "@/components/ui/AccentTag";
import { useI18n } from "@/contexts/I18nContext";

// Re-export Talent type for convenience
export type { Talent };

interface TalentCardProps {
  talent: Talent;
}

export default function TalentCard({ talent }: TalentCardProps) {
  const { t } = useI18n();
  const { profile, professions, media } = talent;
  
  // Get featured image or first photo
  const featuredPhoto = media.photos.find(p => p.featured_image) || media.photos[0];
  const photoUrl = featuredPhoto?.url || "/placeholder-avatar.jpg";
  
  // Get first profession name
  const primaryProfession = professions[0]?.name || "Talent";
  
  // Calculate social reach
  const totalFollowers = (profile.instagram_followers || 0) + 
                         (profile.youtube_followers || 0) + 
                         (profile.tiktok_followers || 0) + 
                         (profile.facebook_followers || 0);
  
  return (
    <Link href={`/talents/${profile.id}`}>
      <div className="group relative h-full overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#c49a47]/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative h-full overflow-hidden rounded-3xl border border-gray-200/50 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/80">
          {/* Image */}
          <div className="relative aspect-3/4 w-full overflow-hidden">
            <Image
              src={photoUrl}
              alt={`${profile.first_name} ${profile.last_name}`}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60" />
            <div className="absolute inset-0 bg-linear-to-br from-[#c49a47]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Top Badge */}
            <div className="absolute start-3 top-3">
              <AccentTag variant="primary" icon={<Sparkles className="h-3 w-3" />}>
                {primaryProfession}
              </AccentTag>
            </div>
            {/* Social Reach Badge */}
            {totalFollowers > 0 && (
              <div className="absolute end-3 top-3">
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  <TrendingUp className="h-3 w-3" />
                  {totalFollowers > 1000000 
                    ? `${(totalFollowers / 1000000).toFixed(1)}M` 
                    : totalFollowers > 1000 
                    ? `${(totalFollowers / 1000).toFixed(1)}K`
                    : totalFollowers}
                </div>
              </div>
            )}
            
            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 start-0 end-0 p-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {profile.first_name} {profile.last_name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/90">
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 backdrop-blur-sm">
                    <span>{t(`filters.${profile.gender}`)}</span>
                    <span>•</span>
                    <span>{profile.age}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 backdrop-blur-sm">
                    <Ruler className="h-3 w-3" />
                    <span>{profile.height}cm</span>
                  </div>
                  
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 backdrop-blur-sm">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[100px]">{profile.country.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Professions */}
          {professions.length > 1 && (
            <div className="p-3">
              <div className="flex flex-wrap gap-1.5">
                {professions.slice(1, 4).map((profession) => (
                  <span
                    key={profession.id}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300"
                  >
                    {profession.name}
                  </span>
                ))}
                {professions.length > 4 && (
                  <span className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-2.5 py-0.5 text-xs font-medium text-white">
                    +{professions.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
