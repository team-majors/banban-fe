"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/auth/useAuth";
import { Avatar } from "@/components/common/Avatar";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { CommunityInfoCard } from "@/components/communityInfo/CommunityInfoCard";
import {
  LogoutIcon,
  UserProfileIcon,
  UsersIcon,
  SettingsIcon,
} from "@/components/svg";
import { isAdmin as checkIsAdmin } from "@/utils/jwt";
import STORAGE_KEYS from "@/constants/storageKeys";
import { logger } from "@/utils/logger";
import { AdminSettingsModal } from "@/components/admin/AdminSettingsModal";
import dynamic from "next/dynamic";

const ConfirmModal = dynamic(
  () =>
    import("@/components/common/ConfirmModal/ConfirmModal").then(
      (mod) => mod.ConfirmModal,
    ),
  { ssr: false },
);

export default function ProfilePage() {
  const { user, logout, isLoggedIn } = useAuth();
  const [isProfileEditOpen, setProfileEditOpen] = useState(false);
  const [isCommunityInfoOpen, setCommunityInfoOpen] = useState(false);
  const [isAdminSettingsOpen, setAdminSettingsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAdmin(false);
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
          : null;

      setIsAdmin(checkIsAdmin(token));
    } catch (error) {
      logger.warn("Failed to check admin status:", error);
      setIsAdmin(false);
    }
  }, [isLoggedIn]);

  const handleOpenLogoutConfirm = () => {
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col w-full h-full bg-[#f4f6f8]">
        <div className="flex flex-col items-center justify-center h-full py-15 px-5">
          <p className="text-base text-[#858d9d] m-0">로그인이 필요합니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#f4f6f8]">
      <div className="flex items-center px-4 py-4 bg-white border-b border-[#e9eaeb]">
        <h1 className="text-xl font-bold text-[#181d27]">프로필</h1>
      </div>

      <div className="flex items-center gap-4 px-4 py-6 bg-white border-b border-[#e9eaeb]">
        <Avatar
          src={user.profileImageUrl || "/user.png"}
          alt={user.username}
          size={80}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-[#181d27] m-0 mb-1">
            {user.username}
          </h2>
          <p className="text-sm text-[#858d9d] m-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-3 bg-white border-t border-b border-[#e9eaeb]">
        <button
          onClick={() => setProfileEditOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-4 border-none border-b border-[#e9eaeb] bg-white cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb]"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4f6f8]">
            <UserProfileIcon width={20} height={20} color="#535862" />
          </div>
          <span className="text-base text-[#181d27] font-medium">
            프로필 편집
          </span>
        </button>

        <button
          onClick={() => setCommunityInfoOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-4 border-none border-b border-[#e9eaeb] bg-white cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb]"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4f6f8]">
            <UsersIcon width={20} height={20} color="#535862" />
          </div>
          <span className="text-base text-[#181d27] font-medium">
            커뮤니티 정보
          </span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setAdminSettingsOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-4 border-none border-b border-[#e9eaeb] bg-white cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb]"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4f6f8]">
              <SettingsIcon width={20} height={20} color="#535862" />
            </div>
            <span className="text-base text-[#181d27] font-medium">
              관리자 설정
            </span>
          </button>
        )}

        <button
          onClick={handleOpenLogoutConfirm}
          className="flex items-center gap-3 w-full px-4 py-4 border-none bg-white cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb]"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4f6f8]">
            <LogoutIcon width={20} height={20} color="#535862" />
          </div>
          <span className="text-base text-[#181d27] font-medium">로그아웃</span>
        </button>
      </div>

      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setProfileEditOpen(false)}
      />

      {isCommunityInfoOpen && (
        <CommunityInfoCard onClose={() => setCommunityInfoOpen(false)} />
      )}

      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setAdminSettingsOpen(false)}
      />
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="로그아웃하시겠어요?"
        message="로그아웃하시겠어요? 다음 사용 시 재로그인이 필요해요."
        confirmText="로그아웃"
        cancelText="취소"
        isDanger
      />
    </div>
  );
}
