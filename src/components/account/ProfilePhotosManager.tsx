"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  getProfilePhotos,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "@/lib/api/profile-photos";
import { ProfilePhoto, ApprovalStatus } from "@/types/profile-photo";
import {
  TbPhoto,
  TbTrash,
  TbCheck,
  TbClock,
  TbX,
  TbStar,
  TbUpload,
  TbUser,
  TbCamera,
} from "react-icons/tb";

export default function ProfilePhotosManager() {
  const { user, activeProfileId } = useAuth();
  const { t } = useI18n();
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!activeProfileId) {
        setError("No active profile selected");
        return;
      }
      const token = localStorage.getItem("auth_token") || "";
      const response = await getProfilePhotos(activeProfileId, token);
      if (response.success) {
        setPhotos(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  }, [activeProfileId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, JPG, GIF, and WEBP images are allowed");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must not exceed 5MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccessMessage(null);
      if (!activeProfileId) {
        setError("No active profile selected");
        return;
      }
      const token = localStorage.getItem("auth_token") || "";
      const response = await uploadProfilePhoto(file, activeProfileId, token);

      if (response.success) {
        setSuccessMessage("Photo uploaded! Waiting for admin approval.");
        await fetchPhotos(); // Refresh the list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm(t("account.profilePhotos.confirmDelete"))) return;

    try {
      setError(null);
      const token = localStorage.getItem("auth_token") || "";
      const response = await deleteProfilePhoto(photoId, token);

      if (response.success) {
        setSuccessMessage("Photo deleted successfully");
        await fetchPhotos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    }
  };

  const getStatusBadge = (status: ApprovalStatus, isActive: boolean) => {
    if (isActive) {
      return (
        <div className="absolute top-3 end-3 bg-linear-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
          <TbStar className="w-3.5 h-3.5" />
          {t("account.profilePhotos.badges.active")}
        </div>
      );
    }

    switch (status) {
      case "approved":
        return (
          <div className="absolute top-3 end-3 bg-linear-to-r from-green-400 to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <TbCheck className="w-3.5 h-3.5" />
            {t("account.profilePhotos.badges.approved")}
          </div>
        );
      case "pending":
        return (
          <div className="absolute top-3 end-3 bg-linear-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <TbClock className="w-3.5 h-3.5" />
            {t("account.profilePhotos.badges.pending")}
          </div>
        );
      case "rejected":
        return (
          <div className="absolute top-3 end-3 bg-linear-to-r from-red-400 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <TbX className="w-3.5 h-3.5" />
            {t("account.profilePhotos.badges.rejected")}
          </div>
        );
    }
  };

  const approvedPhoto = photos.find(
    (p) => p.approval_status === "approved" && p.is_profile_picture
  );
  const pendingPhoto = photos.find((p) => p.approval_status === "pending");
  const rejectedPhotos = photos.filter((p) => p.approval_status === "rejected");

  // Get current profile's featured image
  const currentProfileFeaturedImage = user?.talent?.profiles.find(
    (p) => p.id === activeProfileId
  )?.featured_image_url;

  // Get current profile picture from user.profile, approved photo, or featured image
  const currentProfilePicture =
    user?.profile?.profile_picture ||
    approvedPhoto?.profile_picture ||
    currentProfileFeaturedImage;
  const userName = user?.profile
    ? `${user.profile.first_name} ${user.profile.last_name}`.trim()
    : user?.email || "User";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Avatar Sidebar */}
      <div className="w-full lg:w-64 xl:w-80 shrink-0">
        <div className="lg:sticky lg:top-24 space-y-6">
          {/* Profile Avatar Card */}
          <div className="bg-linear-to-br from-primary/5 via-white to-primary/5 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 lg:p-8">
              <div className="relative group">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-2xl">
                  {currentProfilePicture ? (
                    <img
                      src={currentProfilePicture}
                      alt={userName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                      <TbUser className="w-20 lg:w-24 h-20 lg:h-24 text-primary/40 dark:text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Update Picture Icon on Hover */}
                  <label
                    htmlFor="profile-avatar-upload"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white/90 dark:bg-gray-900/90 p-3 rounded-full shadow-lg">
                        <TbCamera className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-lg">
                        Update Photo
                      </span>
                    </div>
                  </label>
                </div>
                {approvedPhoto && (
                  <div className="absolute -bottom-3 -end-3 bg-linear-to-r from-green-400 to-green-500 text-white p-3 rounded-xl shadow-lg">
                    <TbCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {userName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {approvedPhoto
                    ? t("account.profilePhotos.sidebar.activeStatus")
                    : t("account.profilePhotos.sidebar.noPhoto")}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-6 lg:px-8 py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {photos.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("account.profilePhotos.sidebar.totalPhotos")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {
                      photos.filter((p) => p.approval_status === "approved")
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("account.profilePhotos.sidebar.approvedPhotos")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">
                    {
                      photos.filter((p) => p.approval_status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {t("account.profilePhotos.sidebar.pendingPhotos")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <TbPhoto className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {t("account.profilePhotos.sidebar.guidelines")}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {t("account.profilePhotos.sidebar.guidelinesText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {t("account.profilePhotos.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("account.profilePhotos.description")}
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
          <label
            htmlFor="photo-upload"
            className={`group relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
              uploading
                ? "border-gray-300 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                : "border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary bg-white dark:bg-gray-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover:shadow-lg"
            }`}
          >
            <div className="flex flex-col items-center justify-center py-8 px-6">
              <div
                className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                  uploading
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30"
                }`}
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : (
                  <TbUpload
                    className={`w-8 h-8 transition-colors ${
                      uploading
                        ? "text-gray-400"
                        : "text-primary group-hover:text-primary"
                    }`}
                  />
                )}
              </div>
              <p className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
                {uploading ? (
                  t("account.profilePhotos.upload.uploading")
                ) : (
                  <>
                    <span className="text-primary">
                      {t("account.profilePhotos.upload.label")}
                    </span>{" "}
                    {t("account.profilePhotos.upload.dragDrop")}
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("account.profilePhotos.upload.fileFormat")}
              </p>
            </div>
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <TbX className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-800 dark:text-green-200 px-6 py-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <TbCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {(approvedPhoto || pendingPhoto) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Profile Picture */}
            {approvedPhoto && (
              <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={approvedPhoto.profile_picture}
                    alt="Current Profile Picture"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  {getStatusBadge(
                    approvedPhoto.approval_status,
                    approvedPhoto.is_profile_picture
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <TbStar className="w-5 h-5 text-yellow-500" />
                    {t("account.profilePhotos.photos.current")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t("account.profilePhotos.photos.currentDesc")}
                  </p>
                  <button
                    onClick={() => handleDelete(approvedPhoto.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    <TbTrash className="w-4 h-4" />
                    {t("profilePhotos.photos.deletePhoto")}
                  </button>
                </div>
              </div>
            )}

            {/* Pending Photo */}
            {pendingPhoto && (
              <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={pendingPhoto.profile_picture}
                    alt="Pending Photo"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  {getStatusBadge(pendingPhoto.approval_status, false)}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <TbClock className="w-5 h-5 text-orange-500" />
                    {t("account.profilePhotos.photos.pending")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t("account.profilePhotos.photos.pendingDesc")}
                  </p>
                  <button
                    onClick={() => handleDelete(pendingPhoto.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    <TbTrash className="w-4 h-4" />
                    {t("account.profilePhotos.photos.deletePhoto")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rejected Photos */}
        {rejectedPhotos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TbX className="w-6 h-6 text-red-500" />
              {t("account.profilePhotos.rejected.title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={photo.profile_picture}
                      alt="Rejected Photo"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                    />
                    {getStatusBadge(photo.approval_status, false)}
                  </div>
                  <div className="p-4">
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      <TbTrash className="w-4 h-4" />
                      {t("account.profilePhotos.photos.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Photos State */}
        {photos.length === 0 && (
          <div className="text-center py-16 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <TbCamera className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("account.profilePhotos.empty.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {t("account.profilePhotos.empty.description")}
            </p>
          </div>
        )}

        {/* Info Box */}
        {approvedPhoto && pendingPhoto && (
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <TbPhoto className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {t("account.profilePhotos.info.title")}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t("account.profilePhotos.info.description")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden avatar upload input */}
        <input
          id="profile-avatar-upload"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
