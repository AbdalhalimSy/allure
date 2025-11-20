"use client";
import SectionHeader from "@/components/ui/SectionHeader";
import TalentCard from "@/components/talent/TalentCard";
import { Talent, TalentFilters } from "@/types/talent";
import TalentFilterBar from "@/components/talent/TalentFilterBar";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api/client";
import TalentCardSkeleton from "@/components/talent/TalentCardSkeleton";

export default function TalentsPage() {
  const [filters, setFilters] = useState<TalentFilters>({
    search: "",
    per_page: 12,
    page: 1,
  });
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTalents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        // Add all filter parameters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });

        const response = await apiClient.get(`/talents?${params.toString()}`);
        setTalents(response.data.data || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error("Failed to fetch talents:", error);
        setTalents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [filters]);

  const handleReset = () => {
    setFilters({
      search: "",
      per_page: 12,
      page: 1,
    });
  };

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-6 py-10 lg:px-8">
      <SectionHeader 
        title="Find Talent" 
        description="Discover talented professionals for your next project"
      />
      
      <TalentFilterBar
        value={filters}
        onChange={setFilters}
        onReset={handleReset}
        loadingResults={loading}
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <TalentCardSkeleton key={i} />
          ))}
        </div>
      ) : talents.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {total} {total === 1 ? "talent" : "talents"}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {talents.map((talent) => (
              <TalentCard key={talent.profile.id} talent={talent} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            No talents found
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </section>
  );
}
