import SurfaceCard from "@/components/ui/SurfaceCard";

export type Talent = {
  id: string;
  name: string;
  category: string;
  location: string;
  availability: string;
  tags: string[];
  coverGradient?: string;
};

export default function TalentCard({ name, category, location, availability, tags, coverGradient = "bg-gradient-to-tr from-gray-900 via-gray-700 to-amber-600" }: Talent) {
  return (
    <SurfaceCard accent="gold" className="h-full">
      <div className={["aspect-[4/3] w-full rounded-2xl mb-4 overflow-hidden","relative isolate", coverGradient].join(" ")}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">{category}</p>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{location}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-800 dark:text-gray-200">{availability}</span>
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Ready</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-gray-200/80 dark:border-white/20 bg-white/70 dark:bg-white/5 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
