"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import AccountSection from "@/components/account/AccountSection";
import AccountPageLoader from "@/components/account/AccountPageLoader";
import Button from "@/components/ui/Button";
import FileUploader from "@/components/ui/FileUploader";
import { toast } from "react-hot-toast";
import {
  fetchPortfolio,
  syncPortfolio,
  validatePortfolioItems,
} from "@/lib/api/portfolio";
import { PortfolioItem } from "@/types/portfolio";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TbGripVertical,
  TbTrash,
  TbUpload,
  TbRefresh,
  TbStar,
  TbStarFilled,
} from "react-icons/tb";
import Image from "next/image";

interface PortfolioContentProps {
  onBack: () => void;
}

interface SortableItemProps {
  item: PortfolioItem;
  index: number;
  onRemove: (id?: number, tempKey?: string) => void;
  onSetFeatured: (id?: number, tempKey?: string) => void;
}

function SortableItem({
  item,
  index,
  onRemove,
  onSetFeatured,
}: SortableItemProps) {
  const { t } = useI18n();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id ?? item.tempKey! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isFeatured = !!item.featured_image;
  const status =
    item.approval_status === "approved"
      ? {
          label: t("account.portfolio.approved") || "Approved",
          color: "emerald",
        }
      : { label: t("account.portfolio.pending") || "Pending", color: "amber" };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Modern Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:ring-[#c49a47]/20 ">
        {/* 3:4 Aspect Ratio Image Container */}
        <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-gray-100 to-gray-50 ">
          {item.file_url ? (
            item.media_type?.startsWith("video") ? (
              <video
                src={item.file_url}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                controls
              />
            ) : (
              <Image
                src={item.file_url}
                alt="Portfolio item"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            )
          ) : item.file ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 ">
              {t("forms.newFilePendingUpload") || "New file pending upload"}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 ">
              {t("forms.noPreview") || "No preview"}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Top Controls Bar */}
        <div className="absolute top-0 start-0 end-0 flex items-center justify-between p-3">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-lg backdrop-blur-sm ">
              #{index + 1}
            </span>
            <span
              className={`rounded-lg ${
                status.color === "emerald" ? "bg-emerald-500" : "bg-amber-500"
              } px-2.5 py-1 text-xs font-semibold text-white shadow-lg`}
            >
              {status.label}
            </span>
          </div>

          {/* Featured Star Button */}
          <button
            type="button"
            onClick={() => onSetFeatured(item.id, item.tempKey)}
            className={`group/star rounded-lg p-2 shadow-lg backdrop-blur-sm transition-all ${
              isFeatured
                ? "bg-[#c49a47] text-white"
                : "bg-white/95 text-gray-400 hover:bg-[#c49a47] hover:text-white "
            }`}
            aria-label={
              t("account.portfolio.setFeaturedTooltip") ||
              "Set as profile picture"
            }
          >
            {isFeatured ? <TbStarFilled size={20} /> : <TbStar size={20} />}
            <span className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity group-hover/star:opacity-100 start-1/2 ltr:-translate-x-10/12 rtl:translate-x-10/12 ">
              {t("account.portfolio.setFeaturedTooltip") ||
                "Set as profile picture"}
            </span>
          </button>
        </div>

        {/* Bottom Action Bar - Always visible on mobile, hover on desktop */}
        <div className="absolute bottom-0 start-0 end-0 translate-y-full p-2 transition-transform duration-500 sm:group-hover:translate-y-0 sm:translate-y-full">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-white/95 p-2 shadow-2xl backdrop-blur-md ">
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(item.id, item.tempKey)}
              className="inline-flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-lg bg-red-500/10 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-red-600 transition-colors hover:bg-red-500 hover:text-white "
            >
              <TbTrash size={16} />
              <span className="hidden sm:inline">
                {t("common.remove") || "Remove"}
              </span>
            </button>

            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="group/drag flex cursor-grab items-center justify-center rounded-lg bg-[#c49a47]/10 px-2 sm:px-3 py-1.5 sm:py-2 text-[#c49a47] transition-colors hover:bg-[#c49a47]/20 active:cursor-grabbing"
              title={t("account.portfolio.dragTooltip") || "Drag to reorder"}
            >
              <TbGripVertical size={18} className="sm:size-5" />
            </div>
          </div>
        </div>

        {/* Featured Badge Indicator */}
        {isFeatured && (
          <div className="absolute bottom-3 rounded-lg bg-[#c49a47] px-3 py-1.5 text-xs font-bold text-white shadow-lg transition-all duration-500 group-hover:bottom-18 start-3">
            {t("account.portfolio.profilePicture") || "Profile Picture"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortfolioContent({ onBack }: PortfolioContentProps) {
  const { t } = useI18n();
  const { fetchProfile } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const normalizeFeatured = (list: PortfolioItem[]): PortfolioItem[] => {
    if (!list.length) return list;
    const featuredIndex = list.findIndex((i) => i.featured_image);
    if (featuredIndex === -1) {
      return list.map((i, idx) => ({ ...i, featured_image: idx === 0 }));
    }
    return list.map((i, idx) => ({
      ...i,
      featured_image: idx === featuredIndex,
    }));
  };

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPortfolio();
      const sorted = [...data].sort(
        (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
      );
      const normalized = normalizeFeatured(
        sorted.map((d) => ({ ...d, priority: d.priority ?? 0 }))
      );
      setItems(normalized);
    } catch {
      toast.error(
        t("account.portfolio.loadFailed") || "Failed to load portfolio"
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => (i.id ?? i.tempKey) === active.id);
    const newIndex = items.findIndex((i) => (i.id ?? i.tempKey) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const handleFilesChange = (files: (File | string)[]) => {
    setSelectedFiles(files);
    const newFiles = files.filter((f): f is File => f instanceof File);
    if (!newFiles.length) return;

    const hasFeatured = items.some((i) => i.featured_image);
    const newItems: PortfolioItem[] = newFiles.map((file, idx) => {
      const mediaType = file.type.startsWith("video") ? "video" : "image";
      return {
        tempKey: `new-${Date.now()}-${idx}`,
        media_type: mediaType,
        featured_image: !hasFeatured && idx === 0,
        title: "",
        description: "",
        priority: items.length + idx,
        file,
        file_url: URL.createObjectURL(file),
      };
    });

    setItems((prev) => normalizeFeatured([...prev, ...newItems]));
    setSelectedFiles([]);
  };

  const removeItem = (id?: number, tempKey?: string) => {
    setItems((prev) => {
      const filtered = prev.filter(
        (i) => (i.id ?? i.tempKey) !== (id ?? tempKey)
      );
      if (filtered.length && !filtered.some((i) => i.featured_image)) {
        const [first, ...rest] = filtered;
        return [{ ...first, featured_image: true }, ...rest];
      }
      return filtered;
    });
  };

  const handleSetFeatured = (id?: number, tempKey?: string) => {
    setItems((prev) =>
      prev.map((i) => {
        const isTarget = (i.id ?? i.tempKey) === (id ?? tempKey);
        return { ...i, featured_image: isTarget };
      })
    );
  };

  const handleSync = async () => {
    setSaving(true);
    setErrors([]);
    const validation = validatePortfolioItems(items);
    if (validation.length) {
      setErrors(validation);
      setSaving(false);
      toast.error(
        t("account.portfolio.validationErrors") || "Validation errors"
      );
      return;
    }
    const normalized = items.map((i, idx) => ({ ...i, priority: idx }));
    const result = await syncPortfolio(normalized);
    setSaving(false);
    if (result.success) {
      toast.success(
        result.message ||
          t("account.portfolio.synced") ||
          "Portfolio synced successfully."
      );
      loadInitial();
      // Refresh profile data to update header profile picture
      await fetchProfile();
    } else {
      const backendErrors = result.errors
        ? Object.values(result.errors).flat()
        : [];
      setErrors((prev) => [
        ...prev,
        ...(backendErrors.length
          ? backendErrors
          : [
              result.message ||
                t("account.portfolio.syncFailed") ||
                "Sync failed",
            ]),
      ]);
      toast.error(
        result.message || t("account.portfolio.syncFailed") || "Sync failed"
      );
    }
  };

  if (loading) {
    return (
      <AccountPageLoader
        message={t("account.portfolio.loading") || "Loading portfolio..."}
      />
    );
  }

  return (
    <AccountSection
      title={t("account.nav.portfolio") || "Portfolio"}
      description={
        t("account.portfolio.description") ||
        "Showcase your best work and projects. Reorder items, pick a profile photo, and sync when ready."
      }
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-[#c49a47]/20 bg-linear-to-br from-slate-900 via-gray-900 to-black p-6 text-white shadow-xl">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold">
              {t("account.portfolio.heroTitle") ||
                "Curate a standout portfolio"}
            </p>
            <p className="text-sm text-white/70">
              {t("account.portfolio.heroSubtitle") ||
                "Highlight a single photo as your public profile picture and arrange the rest for a flowing visual story."}
            </p>
            <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-[#c49a47]/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#c49a47]">
              <span className="h-2 w-2 rounded-full bg-[#c49a47]" />
              {items.length} {t("account.portfolio.items") || "items"}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200/60 bg-white/90 p-5 shadow-lg backdrop-blur ">
          <p className="text-sm font-semibold text-gray-900 ">
            {t("account.portfolio.featuredHint") ||
              "Tip: Star one item to set it as your public profile picture."}
          </p>
          <p className="mt-2 text-xs text-gray-600 ">
            {t("account.portfolio.syncHint") ||
              "Upload multiple images or videos, drag to reorder, then sync to push changes live."}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-gray-200/60 bg-white/90 p-5 shadow-lg backdrop-blur ">
        <FileUploader
          accept="image/*,video/*"
          multiple
          maxSize={100 * 1024 * 1024} // 100MB limit
          value={selectedFiles}
          onChange={handleFilesChange}
          description={
            t("account.profession.upload.selectFiles") ||
            "Click to select or drag & drop files (images/videos up to 100MB)"
          }
        />
      </div>

      {errors.length > 0 && (
        <div className="mb-4 space-y-1 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs text-red-700 shadow-sm ">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

      {items.length > 1 && (
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#c49a47]">
          <TbGripVertical size={18} />
          <span>
            {t("account.portfolio.dragHint") ||
              "Drag and drop to reorder your portfolio items"}
          </span>
        </div>
      )}

      {items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id ?? i.tempKey!)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, idx) => (
                <SortableItem
                  key={item.id ?? item.tempKey!}
                  item={item}
                  index={idx}
                  onRemove={removeItem}
                  onSetFeatured={handleSetFeatured}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-linear-to-br from-gray-50 via-white to-gray-100 p-10 text-center shadow-inner ">
          <div className="absolute inset-0 bg-linear-to-tr from-[#c49a47]/15 via-transparent to-indigo-200/20" />
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="mx-auto h-16 w-16 text-gray-400 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <p className="mt-4 text-base font-semibold text-gray-700 ">
              {t("account.portfolio.noItems") ||
                "No portfolio items yet. Upload your work above!"}
            </p>
            <p className="mt-2 text-sm text-gray-500 ">
              {t("account.portfolio.emptyHint") ||
                "Upload a few shots, star your hero image, then sync to publish."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 ">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            {t("common.back") || "Back"}
          </Button>
          <Button variant="secondary" onClick={loadInitial} disabled={saving}>
            <TbRefresh className="me-1" />{" "}
            {t("account.portfolio.reset") || "Reset"}
          </Button>
        </div>
        <Button
          variant="primary"
          disabled={saving || !items.length}
          onClick={handleSync}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
              {t("account.portfolio.syncing") || "Syncing..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <TbUpload /> {t("account.portfolio.sync") || "Sync Portfolio"}
            </span>
          )}
        </Button>
      </div>
    </AccountSection>
  );
}
