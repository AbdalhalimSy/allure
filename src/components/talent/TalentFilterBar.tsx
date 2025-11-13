"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useState } from "react";

export type TalentFilters = {
  q: string;
  category: string;
  location: string;
  availability: string;
};

type Props = {
  value: TalentFilters;
  onChange: (next: TalentFilters) => void;
  onReset?: () => void;
};

export default function TalentFilterBar({ value, onChange, onReset }: Props) {
  const [local, setLocal] = useState<TalentFilters>(value);

  const update = (patch: Partial<TalentFilters>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-5">
      <Input placeholder="Search talent, skills..." value={local.q} onChange={(e) => update({ q: e.target.value })} />
      <Select value={local.category} onChange={(e) => update({ category: e.target.value })}>
        <option value="">All Categories</option>
        <option value="model">Model</option>
        <option value="actor">Actor</option>
        <option value="host">Host</option>
        <option value="creator">Creator</option>
      </Select>
      <Select value={local.location} onChange={(e) => update({ location: e.target.value })}>
        <option value="">All Locations</option>
        <option value="dubai">Dubai, UAE</option>
        <option value="riyadh">Riyadh, KSA</option>
        <option value="beirut">Beirut, Lebanon</option>
        <option value="doha">Doha, Qatar</option>
      </Select>
      <Select value={local.availability} onChange={(e) => update({ availability: e.target.value })}>
        <option value="">Any Availability</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="remote">Remote Only</option>
      </Select>
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" className="w-full" onClick={onReset}>Reset</Button>
      </div>
    </div>
  );
}
