"use client";

import { useRef, useState } from "react";
import { DefaultButton } from "@/components/common/Button";
import { BellIcon, UserIcon, DotIcon, BanBanLogo } from "@/components/svg";
import styled from "styled-components";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { UserMenu } from "@/components/common/UserMenu/UserMenu";
import Image from "next/image";
import { useClickOutside } from "@/hooks/useClickOutside";
import HeaderSkeleton from "@/components/common/Skeleton/HeaderSkeleton";

interface HeaderProps {
  isNew: boolean;
  onRegister?: () => void;
  onNotificationClick?: () => void;
}

export default function Header({
  isNew = false,
  onRegister,
  onNotificationClick,
}: HeaderProps) {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoggedIn, user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setUserMenuOpen(false), "click");

  const handleToggleMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setUserMenuOpen(false);
  };

  const handleLogin = () => router.push("/login");
  const handleRegister = () => onRegister?.();
  const handleNotification = () => onNotificationClick?.();
  const handleProfile = () => handleToggleMenu();

  if (pathname === "/login") return null;

  if (loading) return <HeaderSkeleton />;
  else
    return (
      <Container>
        <LogoArea>
          <BanBanLogo />
        </LogoArea>
        <Actions>
          {isLoggedIn ? (
            <ButtonsWrapper>
              <LoggedInIcons
                isNew={isNew}
                profileImageUrl={user?.profileImageUrl}
                handleNotification={handleNotification}
                handleProfile={handleProfile}
              />
              {isUserMenuOpen && (
                <UserMenu
                  onClose={() => handleCloseMenu()}
                  onLogout={logout}
                  ref={menuRef}
                />
              )}
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

function LoggedInIcons({
  isNew,
  profileImageUrl,
  handleNotification,
  handleProfile,
}: {
  isNew: boolean;
  profileImageUrl?: string;
  handleNotification: () => void;
  handleProfile: () => void;
}) {
  return (
    <>
      <IconButton aria-label="알림" onClick={handleNotification}>
        <BellIcon />
        {isNew && <NotificationDot />}
      </IconButton>
      <IconButton aria-label="프로필" onClick={handleProfile}>
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            width={48}
            height={48}
            alt="userProfileImage"
            objectFit="cover"
            style={{
              borderRadius: "50%",
            }}
          />
        ) : (
          <UserIcon />
        )}
      </IconButton>
    </>
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
  background: "#f9f8ff",
  text: "#535862",
  primary: "#3f13ff",
  white: "#ffffff",
};

const Z_INDEX = {
  header: 999,
};

const Container = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 999;
  height: 64px;
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

const IconButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(63, 19, 255, 0.1);
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
`;
