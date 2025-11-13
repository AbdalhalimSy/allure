import SurfaceCard from "@/components/ui/SurfaceCard";

type CastingOpportunityCardProps = {
  title: string;
  brand: string;
  location: string;
  timeline: string;
  budget: string;
  requirements: string[];
  accent?: "gold" | "midnight" | "rose" | "emerald" | "none";
};

export default function CastingOpportunityCard({
  title,
  brand,
  location,
  timeline,
  budget,
  requirements,
  accent = "midnight",
}: CastingOpportunityCardProps) {
  return (
    <SurfaceCard accent={accent} className="h-full" padding="p-7">
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
            {brand}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-300">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Location
            </p>
            <p className="font-medium text-gray-900 dark:text-white">{location}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Timeline
            </p>
            <p className="font-medium text-gray-900 dark:text-white">{timeline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Budget
            </p>
            <p className="font-medium text-gray-900 dark:text-white">{budget}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Status
            </p>
            <p className="font-medium text-emerald-600 dark:text-emerald-400">
              Open
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
            Key Requirements
          </p>
          <ul className="space-y-2">
            {requirements.map((requirement) => (
              <li
                key={requirement}
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c49a47]" />
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SurfaceCard>
  );
}
