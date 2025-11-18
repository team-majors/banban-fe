"use client";

import { useEffect, useRef, useState } from "react";
import { DefaultButton } from "@/components/common/Button";
import { BanBanLogo, UserIcon } from "@/components/svg";
import styled from "styled-components";
import { media } from "@/constants/breakpoints";
import useAuth from "@/hooks/auth/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { UserMenu } from "@/components/common/UserMenu/UserMenu";
import Image from "next/image";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import HeaderSkeleton from "@/components/common/Skeleton/HeaderSkeleton";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { AdminSettingsModal } from "@/components/admin/AdminSettingsModal";
import { CommunityInfoCard } from "@/components/communityInfo/CommunityInfoCard";
import { logger } from "@/utils/logger";
import { isAdmin as checkIsAdmin } from "@/utils/jwt";
import STORAGE_KEYS from "@/constants/storageKeys";
import dynamic from "next/dynamic";

const ConfirmModal = dynamic(
  () =>
    import("@/components/common/ConfirmModal/ConfirmModal").then(
      (mod) => mod.ConfirmModal,
    ),
  { ssr: false },
);

const DynamicNotificationControls = dynamic(
  () => import("./NotificationControls"),
  {
    ssr: false,
    loading: () => <NotificationButtonGhost />,
  },
);

interface HeaderProps {
  isNew?: boolean;
}

export default function Header({ isNew }: HeaderProps) {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isProfileCardOpen, setProfileCardOpen] = useState(false);
  const [isCommunityCardOpen, setCommunityCardOpen] = useState(false);
  const [isAdminSettingsOpen, setAdminSettingsOpen] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoggedIn, user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    menuRef,
    () => {
      setUserMenuOpen(false);
      setProfileCardOpen(false);
      setCommunityCardOpen(false);
    },
    "click",
  );

  const profileImageSrcState = user?.profileImageUrl || "/user.png";
  const [profileImageSrc, setProfileImageSrc] = useState(profileImageSrcState);

  useEffect(() => {
    setProfileImageSrc(profileImageSrcState);
  }, [profileImageSrcState]);

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

  const handleToggleMenu = () => {
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    setUserMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setUserMenuOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    setAdminSettingsOpen(false);
  };

  const handleLogin = () => router.push("/login");
  const handleProfile = () => handleToggleMenu();
  const handleOpenLogoutConfirm = () => {
    setUserMenuOpen(false);
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
  };

  const handleOpenProfileCard = () => {
    setUserMenuOpen(false);
    setCommunityCardOpen(false);
    setProfileCardOpen(true);
  };

  const handleOpenCommunityCard = () => {
    setUserMenuOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(true);
  };

  const handleOpenAdminSettings = () => {
    setUserMenuOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    setAdminSettingsOpen(true);
  };

  const handleLogoClick = () => {
    setUserMenuOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    router.push("/");
  };

  const shouldHideHeader =
    pathname === "/login" ||
    pathname?.startsWith("/auth/kakao") ||
    pathname?.startsWith("/auth/naver");

  if (shouldHideHeader) return null;

  if (loading) return <HeaderSkeleton />;
  else
    return (
      <Container>
        <LogoArea>
          <LogoButton
            type="button"
            aria-label="banban 홈으로"
            onClick={handleLogoClick}
          >
            <BanBanLogo />
          </LogoButton>
        </LogoArea>

        <Actions>
          {isLoggedIn ? (
            <ButtonsWrapper>
              <DynamicNotificationControls isNew={isNew} />

              <ProfileWrapper ref={menuRef}>
                <IconButton
                  aria-label="프로필"
                  onClick={handleProfile}
                  $active={isUserMenuOpen}
                >
                  {user?.profileImageUrl ? (
                    <Image
                      src={profileImageSrc}
                      width={28}
                      height={28}
                      alt="userProfileImage"
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                      onError={() => setProfileImageSrc("/menu_user.png")}
                    />
                  ) : (
                    <UserIcon />
                  )}
                </IconButton>
                {isUserMenuOpen && (
                  <UserMenu
                    onClose={() => handleCloseMenu()}
                    onLogout={handleOpenLogoutConfirm}
                    onOpenProfile={handleOpenProfileCard}
                    onOpenCommunityInfo={handleOpenCommunityCard}
                    onOpenAdminSettings={handleOpenAdminSettings}
                    isAdmin={isAdmin}
                  />
                )}
                <ProfileEditModal
                  isOpen={isProfileCardOpen}
                  onClose={() => setProfileCardOpen(false)}
                />
                <AdminSettingsModal
                  isOpen={isAdminSettingsOpen}
                  onClose={() => setAdminSettingsOpen(false)}
                />
                {isCommunityCardOpen && (
                  <CommunityInfoCard
                    onClose={() => setCommunityCardOpen(false)}
                  />
                )}
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
              </ProfileWrapper>
            </ButtonsWrapper>
          ) : (
            <AuthButtons
              handleLogin={handleLogin}
              handleRegister={handleLogin}
            />
          )}
        </Actions>
      </Container>
    );
}

interface AuthButtonsInterface {
  handleLogin: () => void;
  handleRegister: () => void;
}

function AuthButtons({ handleLogin, handleRegister }: AuthButtonsInterface) {
  return (
    <>
      <TransparentButton onClick={handleLogin}>로그인</TransparentButton>
      <PrimaryButton onClick={handleRegister}>회원가입</PrimaryButton>
    </>
  );
}

const COLOR = {
  background: "#f8fafc",
  text: "#535862",
  primary: "#3f13ff",
  white: "#ffffff",
};

const Z_INDEX = {
  header: 1,
};

const NotificationButtonGhost = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: rgba(63, 19, 255, 0.12);

  ${media.mobile} {
    display: none;
  }
`;

const Container = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 60px;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 32px;
  z-index: ${Z_INDEX.header};
  background-color: #f8fafc;

  ${media.mobile} {
    padding: 0px 12px;
  }
`;

const LogoArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  ${media.mobile} {
    position: static;
    left: auto;
    transform: none;
  }
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  ${media.mobile} {
    svg {
      width: 100px;
    }
  }
`;

const IconButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 100%;
  background-color: ${({ $active }) =>
    $active ? "rgba(63, 19, 255, 0.12)" : "#f8fafc"};
  margin-right: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "rgba(63, 19, 255, 0.18)" : "rgba(63, 19, 255, 0.1)"};
  }

  &:focus {
    outline: 2px solid #3e13ff6c;
    outline-offset: 2px;
  }

  ${media.mobile} {
    /* 최소 터치 영역 44px (Apple HIG 권장) */
    width: 44px;
    height: 44px;
    margin-right: 4px;
  }
`;

const Actions = styled.div`
  margin-left: auto;
  height: 100%;
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 12px;

  ${media.mobile} {
    gap: 8px;
  }
`;

const ButtonBase = styled(DefaultButton)`
  border: none;
  width: 86px;
  height: 44px;
  font-size: 16px;

  ${media.mobile} {
    width: 72px;
    height: 44px; /* 터치 영역 유지 (44px) */
    padding: 8px 10px;
    font-size: 14px;
  }
`;

const TransparentButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${COLOR.text};
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: ${COLOR.primary};
  color: ${COLOR.white};
`;

const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProfileWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
