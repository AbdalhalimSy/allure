import SurfaceCard from "@/components/ui/SurfaceCard";

type TalentSpotlightCardProps = {
  name: string;
  category: string;
  location: string;
  availability: string;
  tags: string[];
  coverGradient: string;
};

export default function TalentSpotlightCard({
  name,
  category,
  location,
  availability,
  tags,
  coverGradient,
}: TalentSpotlightCardProps) {
  return (
    <SurfaceCard accent="gold" className="h-full group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div
        className={[
          "aspect-4/3 w-full rounded-2xl mb-6 overflow-hidden",
          "relative isolate transition-transform duration-300 group-hover:scale-105",
          coverGradient,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 start-3 text-xs uppercase tracking-[0.2em] text-white/80">
          Spotlight
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            {category}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{location}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {availability}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Ready
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200/80 dark:border-white/20 bg-white/70 dark:bg-white/5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
