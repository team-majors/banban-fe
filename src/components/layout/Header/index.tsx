"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultButton } from "@/components/common/Button";
import { BellIcon, UserIcon, DotIcon, BanBanLogo } from "@/components/svg";
import styled from "styled-components";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { UserMenu } from "@/components/common/UserMenu/UserMenu";
import Image from "next/image";
import { useClickOutside } from "@/hooks/useClickOutside";
import HeaderSkeleton from "@/components/common/Skeleton/HeaderSkeleton";
import NotificationMenu from "./NotificationMenu";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/notification";
import { ProfileEditCard } from "@/components/profile/ProfileEditCard";
import { CommunityInfoCard } from "@/components/communityInfo/CommunityInfoCard";

interface HeaderProps {
  isNew?: boolean;
  onRegister?: () => void;
}

export default function Header({ isNew, onRegister }: HeaderProps) {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileCardOpen, setProfileCardOpen] = useState(false);
  const [isCommunityCardOpen, setCommunityCardOpen] = useState(false);
  const { isLoggedIn, user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  useClickOutside(
    menuRef,
    () => {
      setUserMenuOpen(false);
      setProfileCardOpen(false);
      setCommunityCardOpen(false);
    },
    "click",
  );
  useClickOutside(notificationRef, () => setNotificationOpen(false), "click");

  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const connectionStatus = useNotificationStore(
    (state) => state.connectionStatus,
  );
  const isTimeout = useNotificationStore((state) => state.isTimeout);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllRead = useNotificationStore((state) => state.markAllAsRead);

  const profileImageSrcState = user?.profileImageUrl || "/user.png";
  const [profileImageSrc, setProfileImageSrc] = useState(profileImageSrcState);

  useEffect(() => {
    setProfileImageSrc(profileImageSrcState);
  }, [profileImageSrcState]);

  const handleToggleMenu = () => {
    setNotificationOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    setUserMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setUserMenuOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
  };

  const handleLogin = () => router.push("/login");
  const handleRegister = () => onRegister?.();
  const handleNotificationToggle = () => {
    setUserMenuOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    setNotificationOpen((prev) => !prev);
  };
  const handleProfile = () => handleToggleMenu();

  useEffect(() => {
    if (!isNotificationOpen) return;
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [isNotificationOpen, notifications, markAsRead]);

  const handleNotificationItemClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead([notification.id]);
    }
    setNotificationOpen(false);

    // 피드 관련 알림이면 해당 피드로 이동
    if (notification.target_type === "FEED" && notification.target_id) {
      router.push(`/feeds/${notification.target_id}`);
    }
  };

  const hasUnreadIndicator = useMemo(() => {
    if (typeof isNew === "boolean") return isNew;
    return unreadCount > 0;
  }, [isNew, unreadCount]);

  const handleOpenProfileCard = () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setCommunityCardOpen(false);
    setProfileCardOpen(true);
  };

  const handleOpenCommunityCard = () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(true);
  };

  const handleLogoClick = () => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setProfileCardOpen(false);
    setCommunityCardOpen(false);
    router.push("/");
  };

  if (pathname === "/login") return null;

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
              <NotificationWrapper ref={notificationRef}>
                <IconButton
                  aria-label="알림"
                  onClick={handleNotificationToggle}
                  $active={isNotificationOpen}
                >
                  <BellIcon />
                  {hasUnreadIndicator && (
                    <NotificationDot data-testid="notification-dot" />
                  )}
                </IconButton>
                {isNotificationOpen && (
                  <NotificationMenu
                    notifications={notifications}
                    connectionStatus={connectionStatus}
                    isTimeout={isTimeout}
                    onMarkAllRead={markAllRead}
                    onItemClick={handleNotificationItemClick}
                  />
                )}
              </NotificationWrapper>

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
                    onLogout={logout}
                    onOpenProfile={handleOpenProfileCard}
                    onOpenCommunityInfo={handleOpenCommunityCard}
                  />
                )}
                {isProfileCardOpen && (
                  <ProfileEditCard onClose={() => setProfileCardOpen(false)} />
                )}
                {isCommunityCardOpen && (
                  <CommunityInfoCard
                    onClose={() => setCommunityCardOpen(false)}
                  />
                )}
              </ProfileWrapper>
            </ButtonsWrapper>
          ) : (
            <AuthButtons
              handleLogin={handleLogin}
              handleRegister={handleRegister}
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
  background: "#F4F6F8",
  text: "#535862",
  primary: "#3f13ff",
  white: "#ffffff",
};

const Z_INDEX = {
  header: 900,
};

const Container = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 900;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 32px;
  background-color: ${COLOR.background};
  z-index: ${Z_INDEX.header};
`;

const LogoArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
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
    $active ? "rgba(63, 19, 255, 0.12)" : "#F4F6F8"};
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
`;

const Actions = styled.div`
  margin-left: auto;
  height: 100%;
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 12px;
`;

const ButtonBase = styled(DefaultButton)`
  border: none;
  width: 86px;
  height: 44px;
  padding: 10px 18px;
  font-size: 16px;
`;

const TransparentButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${COLOR.text};
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: ${COLOR.primary};
  color: ${COLOR.white};
`;

const NotificationDot = styled(DotIcon)`
  position: absolute;
  right: 13px;
  top: 9px;
`;

const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NotificationWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ProfileWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
