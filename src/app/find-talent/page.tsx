"use client";
import SectionHeader from "@/components/ui/SectionHeader";
import TalentCard, { Talent } from "@/components/talent/TalentCard";
import TalentFilterBar, { TalentFilters } from "@/components/talent/TalentFilterBar";
import { useState, useMemo } from "react";

const DUMMY_TALENTS: Talent[] = [
  { id: "1", name: "Layla Arif", category: "Model", location: "Dubai, UAE", availability: "Available", tags: ["Height 178cm", "Arabic + English", "Editorial"], coverGradient: "bg-gradient-to-tr from-gray-900 via-gray-700 to-amber-600" },
  { id: "2", name: "Omar El Fayed", category: "Model", location: "Riyadh, KSA", availability: "Booked", tags: ["Lifestyle", "TV Ready", "Swimwear"], coverGradient: "bg-gradient-to-tr from-emerald-400 via-emerald-600 to-gray-900" },
  { id: "3", name: "Sofia Haddad", category: "Actor", location: "Beirut, Lebanon", availability: "Remote Only", tags: ["Acting", "Voice", "MC"], coverGradient: "bg-gradient-to-tr from-rose-500 via-fuchsia-600 to-gray-900" },
  { id: "4", name: "Malik Rahman", category: "Creator", location: "Doha, Qatar", availability: "Available", tags: ["Beauty", "Content", "AR"], coverGradient: "bg-gradient-to-tr from-slate-900 via-blue-700 to-cyan-500" },
  { id: "5", name: "Noor Saad", category: "Host", location: "Dubai, UAE", availability: "Available", tags: ["Bilingual", "Event", "Presenter"], coverGradient: "bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-700" },
];

export default function FindTalentPage() {
  const [filters, setFilters] = useState<TalentFilters>({ q: "", category: "", location: "", availability: "" });

  const filtered = useMemo(() => {
    return DUMMY_TALENTS.filter((t) => {
      const matchesQ = filters.q
        ? [t.name, t.category, t.location, ...t.tags].join(" ").toLowerCase().includes(filters.q.toLowerCase())
        : true;
      const matchesCategory = filters.category
        ? t.category.toLowerCase().includes(filters.category.toLowerCase())
        : true;
      const matchesLocation = filters.location
        ? t.location.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const matchesAvailability = filters.availability
        ? t.availability.toLowerCase().includes(filters.availability.toLowerCase())
        : true;
      return matchesQ && matchesCategory && matchesLocation && matchesAvailability;
    });
  }, [filters]);

  const handleReset = () => setFilters({ q: "", category: "", location: "", availability: "" });

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-6 py-10 lg:px-8">
      <SectionHeader
        align="center"
        eyebrow="Talent Search"
        title="Find a Talent"
        description="Search and filter our roster. Connect with the right profiles quickly."
      />
      <TalentFilterBar value={filters} onChange={setFilters} onReset={handleReset} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TalentCard key={t.id} {...t} />
        ))}
      </div>
    </section>
  );
}
