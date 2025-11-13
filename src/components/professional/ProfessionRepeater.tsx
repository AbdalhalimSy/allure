'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Profession, ProfessionEntry } from '@/types/profession';

interface ProfessionRepeaterProps {
  professions: Profession[];
  value: ProfessionEntry[];
  onChange: (entries: ProfessionEntry[]) => void;
}

export default function ProfessionRepeater({
  professions,
  value,
  onChange,
}: ProfessionRepeaterProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  const addEntry = () => {
    const newEntry: ProfessionEntry = {
      id: Date.now().toString(),
      professionId: null,
      subProfessionId: null,
    };
    onChange([...value, newEntry]);
  };

  const removeEntry = (id: string) => {
    onChange(value.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<ProfessionEntry>) => {
    onChange(
      value.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const getSelectedProfession = (entry: ProfessionEntry) => {
    return professions.find(p => p.id === entry.professionId);
  };

  const getSelectedSubProfession = (entry: ProfessionEntry) => {
    const profession = getSelectedProfession(entry);
    return profession?.sub_professions?.find(sp => sp.id === entry.subProfessionId);
  };

  const getFilteredProfessions = (dropdownId: string) => {
    const query = searchQueries[dropdownId]?.toLowerCase() || '';
    if (!query) return professions;
    return professions.filter(p => p.name.toLowerCase().includes(query));
  };

  const getFilteredSubProfessions = (entry: ProfessionEntry, dropdownId: string) => {
    const profession = getSelectedProfession(entry);
    if (!profession?.sub_professions) return [];
    
    const query = searchQueries[dropdownId]?.toLowerCase() || '';
    if (!query) return profession.sub_professions;
    return profession.sub_professions.filter(sp => sp.name.toLowerCase().includes(query));
  };

  const handleProfessionSelect = (entryId: string, professionId: number) => {
    updateEntry(entryId, { professionId, subProfessionId: null });
    setOpenDropdown(null);
    setSearchQueries(prev => ({ ...prev, [`profession-${entryId}`]: '' }));
  };

  const handleSubProfessionSelect = (entryId: string, subProfessionId: number) => {
    updateEntry(entryId, { subProfessionId });
    setOpenDropdown(null);
    setSearchQueries(prev => ({ ...prev, [`subprofession-${entryId}`]: '' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Professions
        </label>
        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#c49a47] rounded-md hover:bg-[#b88833] shadow-md shadow-[#c49a47]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Profession
        </button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg dark:border-white/10">
          <p className="text-gray-500 text-sm dark:text-gray-400">No professions added yet</p>
          <button
            type="button"
            onClick={addEntry}
            className="mt-2 text-[#c49a47] hover:text-[#b88833] text-sm font-medium transition-colors"
          >
            Add your first profession
          </button>
        </div>
      )}

      <div className="space-y-4">
        {value.map((entry, index) => {
          const selectedProfession = getSelectedProfession(entry);
          const selectedSubProfession = getSelectedSubProfession(entry);
          const professionDropdownId = `profession-${entry.id}`;
          const subProfessionDropdownId = `subprofession-${entry.id}`;

          return (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-white dark:border-white/10 dark:bg-white/5" ref={dropdownRef}>
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  {/* Profession Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Profession {index + 1}
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === professionDropdownId
                              ? null
                              : professionDropdownId
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-2 text-left bg-white border border-gray-200 rounded-md hover:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 dark:bg-black dark:border-white/10 dark:text-white transition-colors"
                      >
                        <span className={selectedProfession ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
                          {selectedProfession?.name || 'Select profession'}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </button>

                      {openDropdown === professionDropdownId && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden dark:bg-gray-900 dark:border-white/10">
                          <div className="p-2 border-b border-gray-200 dark:border-white/10">
                            <input
                              type="text"
                              placeholder="Search professions..."
                              value={searchQueries[professionDropdownId] || ''}
                              onChange={(e) =>
                                setSearchQueries(prev => ({
                                  ...prev,
                                  [professionDropdownId]: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 focus:border-[#c49a47] dark:bg-gray-800 dark:border-white/10 dark:text-white"
                              autoFocus
                            />
                          </div>
                          <div className="overflow-y-auto max-h-48">
                            {getFilteredProfessions(professionDropdownId).map(profession => (
                              <button
                                key={profession.id}
                                type="button"
                                onClick={() => handleProfessionSelect(entry.id, profession.id)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                                  entry.professionId === profession.id
                                    ? 'bg-[#c49a47]/10 text-[#c49a47] dark:bg-[#c49a47]/20'
                                    : 'text-gray-900 dark:text-gray-200'
                                }`}
                              >
                                {profession.name}
                              </button>
                            ))}
                            {getFilteredProfessions(professionDropdownId).length === 0 && (
                              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                No professions found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sub-Profession Dropdown - Only show if profession is selected */}
                  {selectedProfession && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Sub-Profession
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === subProfessionDropdownId
                                ? null
                                : subProfessionDropdownId
                            )
                          }
                          className="w-full flex items-center justify-between px-4 py-2 text-left bg-white border border-gray-200 rounded-md hover:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 dark:bg-black dark:border-white/10 dark:text-white transition-colors"
                        >
                          <span className={selectedSubProfession ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
                            {selectedSubProfession?.name || 'Select sub-profession'}
                          </span>
                          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </button>

                        {openDropdown === subProfessionDropdownId && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden dark:bg-gray-900 dark:border-white/10">
                            <div className="p-2 border-b border-gray-200 dark:border-white/10">
                              <input
                                type="text"
                                placeholder="Search sub-professions..."
                                value={searchQueries[subProfessionDropdownId] || ''}
                                onChange={(e) =>
                                  setSearchQueries(prev => ({
                                    ...prev,
                                    [subProfessionDropdownId]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 focus:border-[#c49a47] dark:bg-gray-800 dark:border-white/10 dark:text-white"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-y-auto max-h-48">
                              {getFilteredSubProfessions(entry, subProfessionDropdownId).map(subProfession => (
                                <button
                                  key={subProfession.id}
                                  type="button"
                                  onClick={() => handleSubProfessionSelect(entry.id, subProfession.id)}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                                    entry.subProfessionId === subProfession.id
                                      ? 'bg-[#c49a47]/10 text-[#c49a47] dark:bg-[#c49a47]/20'
                                      : 'text-gray-900 dark:text-gray-200'
                                  }`}
                                >
                                  {subProfession.name}
                                </button>
                              ))}
                              {getFilteredSubProfessions(entry, subProfessionDropdownId).length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  No sub-professions found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
                  title="Remove profession"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
