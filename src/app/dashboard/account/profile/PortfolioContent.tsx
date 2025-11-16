"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import FileUploader from "@/components/ui/FileUploader";
import { toast } from "react-hot-toast";
import { fetchPortfolio, syncPortfolio, validatePortfolioItems } from "@/lib/api/portfolio";
import { PortfolioItem } from "@/types/portfolio";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbStarFilled, TbClock, TbCheck, TbGripVertical, TbTrash, TbUpload, TbRefresh } from "react-icons/tb";
import Image from "next/image";

interface PortfolioContentProps {
  onBack: () => void;
}

interface SortableItemProps {
  item: PortfolioItem;
  onChange: (item: PortfolioItem) => void;
  onRemove: (id?: number, tempKey?: string) => void;
  isFeaturedDisabled: boolean;
}

function SortableItem({ item, onChange, onRemove, isFeaturedDisabled }: SortableItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:border-white/10 dark:from-white/5 dark:to-white/10"
    >
      <div {...attributes} {...listeners} className="relative aspect-[4/3] overflow-hidden cursor-move">
        {item.file_url ? (
          // Existing or preview image/video
          item.media_type.startsWith("video") ? (
            <video src={item.file_url} className="h-full w-full object-cover" controls />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={item.file_url}
                alt="Portfolio item"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          )
        ) : item.file ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">New file pending upload</div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">No preview</div>
        )}
        {item.featured_image && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#c49a47] text-white text-xs px-2 py-1 rounded shadow-lg">
            <TbStarFilled size={14} /> <span>{t('portfolio.featured') || 'Featured'}</span>
          </div>
        )}
        {item.approval_status === "pending" && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow-lg">
            <TbClock size={14} /> <span>{t('portfolio.pending') || 'Pending'}</span>
          </div>
        )}
        {item.approval_status === "approved" && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
            <TbCheck size={14} /> <span>{t('portfolio.approved') || 'Approved'}</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 opacity-80 pointer-events-none">
          <TbGripVertical size={22} className="text-[#c49a47] drop-shadow" />
        </div>
      </div>
      {/* Inline editing controls */}
      <div className="space-y-2 p-3 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10">
        <input
          type="text"
          placeholder={t('portfolio.titlePlaceholder') || 'Title'}
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
          className="w-full rounded border border-gray-300 dark:border-white/20 bg-white/90 dark:bg-white/5 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a47]"
        />
        <textarea
          placeholder={t('portfolio.descriptionPlaceholder') || 'Description'}
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          rows={2}
          className="w-full rounded border border-gray-300 dark:border-white/20 bg-white/90 dark:bg-white/5 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a47] resize-none"
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={item.featured_image}
              onChange={() => {
                if (item.featured_image) {
                  onChange({ ...item, featured_image: false });
                } else if (!isFeaturedDisabled) {
                  onChange({ ...item, featured_image: true });
                } else {
                  toast.error(t('portfolio.onlyOneFeatured') || 'Only one item can be featured');
                }
              }}
            />
            <span>{t('portfolio.featured') || 'Featured'}</span>
          </label>
          <button
            type="button"
            onClick={() => onRemove(item.id, item.tempKey)}
            className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
          >
            <TbTrash size={14} /> {t('common.remove') || 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioContent({ onBack }: PortfolioContentProps) {
  const { t } = useI18n();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPortfolio();
      // Ensure each existing item has editing defaults
      setItems(
        data.map((d) => ({
          ...d,
          title: d.title || "",
          description: d.description || "",
          priority: d.priority ?? 0,
        }))
      );
    } catch {
      toast.error(t('portfolio.loadFailed') || 'Failed to load portfolio');
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
    const newItems: PortfolioItem[] = newFiles.map((file, idx) => {
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      return {
        tempKey: `new-${Date.now()}-${idx}`,
        media_type: mediaType,
        featured_image: false,
        title: '',
        description: '',
        priority: items.length + idx,
        file,
        file_url: URL.createObjectURL(file),
      };
    });
    setItems(prev => [...prev, ...newItems]);
    setSelectedFiles([]);
  };

  const removeItem = (id?: number, tempKey?: string) => {
    setItems(prev => prev.filter(i => (i.id ?? i.tempKey) !== (id ?? tempKey)));
  };

  const updateItem = (updated: PortfolioItem) => {
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i.tempKey && i.tempKey === updated.tempKey ? updated : i)));
  };

  const enforceSingleFeatured = (newItems: PortfolioItem[]) => {
    const firstFeaturedIndex = newItems.findIndex(i => i.featured_image);
    if (firstFeaturedIndex === -1) return newItems;
    return newItems.map((i, idx) => ({ ...i, featured_image: idx === firstFeaturedIndex }));
  };

  const handleSync = async () => {
    setSaving(true);
    setErrors([]);
    const validation = validatePortfolioItems(items);
    if (validation.length) {
      setErrors(validation);
      setSaving(false);
  toast.error(t('portfolio.validationErrors') || 'Validation errors');
      return;
    }
    // Enforce single featured before send
    const normalized = enforceSingleFeatured(items).map((i, idx) => ({ ...i, priority: idx }));
    const result = await syncPortfolio(normalized);
    setSaving(false);
    if (result.success) {
  toast.success(result.message || t('portfolio.synced') || 'Portfolio synced');
      loadInitial();
    } else {
      const backendErrors = result.errors ? Object.values(result.errors).flat() : [];
  setErrors(prev => [...prev, ...(backendErrors.length ? backendErrors : [result.message || t('portfolio.syncFailed') || 'Sync failed'])]);
  toast.error(result.message || t('portfolio.syncFailed') || 'Sync failed');
    }
  };

  if (loading) {
    return (
      <Loader size="lg" text={t("common.loading") || "Loading..."} center />
    );
  }

  return (
    <AccountSection
      title={t("account.nav.portfolio") || "Portfolio"}
  description={t('portfolio.description') || 'Showcase your best work and projects. Reorder items and sync when ready.'}
    >
      {/* File Uploader */}
      <div className="mb-6">
        <FileUploader
          accept="image/*"
          multiple
          maxSize={100 * 1024 * 1024} // 100MB limit
          value={selectedFiles}
          onChange={handleFilesChange}
          description="Click to select or drag & drop files (images/videos up to 100MB)"
        />
      </div>
      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="mb-4 space-y-1 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
      {/* Drag-and-drop hint */}
      {items.length > 1 && (
        <div className="mb-2 flex items-center gap-2 text-sm text-[#c49a47] font-medium">
          <TbGripVertical size={18} /> {t('portfolio.dragHint') || 'Drag and drop to reorder your portfolio items'}
        </div>
      )}
      {/* Portfolio Grid with Drag and Drop */}
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
              {items.map((item) => (
                <SortableItem
                  key={item.id ?? item.tempKey!}
                  item={item}
                  onChange={updateItem}
                  onRemove={removeItem}
                  isFeaturedDisabled={!item.featured_image && items.some(i => i.featured_image)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}

      {items.length === 0 && (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="mx-auto h-16 w-16 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('portfolio.noItems') || 'No portfolio items yet. Upload your work above!'}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-between border-t border-gray-200 pt-6 dark:border-white/10">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            {t("common.back") || "Back"}
          </Button>
          <Button variant="secondary" onClick={loadInitial} disabled={saving}>
            <TbRefresh className="mr-1" /> {t('portfolio.reset') || 'Reset'}
          </Button>
        </div>
        <Button variant="primary" disabled={saving || !items.length} onClick={handleSync}>
          {saving ? (
            <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> {t('portfolio.syncing') || 'Syncing...'}</span>
          ) : (
            <span className="flex items-center gap-2"><TbUpload /> {t('portfolio.sync') || 'Sync Portfolio'}</span>
          )}
        </Button>
      </div>
    </AccountSection>
  );
}
