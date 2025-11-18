import React, { forwardRef } from "react";
import styled from "styled-components";
import {
  HelpCircleIcon,
  LogoutIcon,
  UserProfileIcon,
  SettingsIcon,
} from "@/components/svg";

interface MenuProps {
  onClose: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenCommunityInfo?: () => void;
  onOpenAdminSettings?: () => void;
  isAdmin?: boolean;
}
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const UserMenuComponent = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      onClose,
      onLogout,
      onOpenProfile,
      onOpenCommunityInfo,
      onOpenAdminSettings,
      isAdmin,
    },
    ref,
  ) => {
    const menuItems: MenuItem[] = [
      {
        label: "프로필",
        icon: <UserProfileIcon />,
        onClick: () => {
          onClose();
          onOpenProfile?.();
        },
      },
      ...(isAdmin
        ? [
            {
              label: "관리자 설정",
              icon: <SettingsIcon />,
              onClick: () => {
                onClose();
                onOpenAdminSettings?.();
              },
            },
          ]
        : []),
      {
        label: "커뮤니티 정보",
        icon: <HelpCircleIcon />,
        onClick: () => {
          onClose();
          onOpenCommunityInfo?.();
        },
      },

      {
        label: "로그아웃",
        icon: <LogoutIcon />,
        onClick: () => {
          console.log("로그아웃");
          onLogout();
          onClose();
        },
      },
    ];

    return (
      <>
        <DropdownMenu ref={ref}>
          {menuItems.map((item) => (
            <MenuItemBox key={item.label} onClick={item.onClick}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </MenuItemBox>
          ))}
        </DropdownMenu>
      </>
    );
  },
);

const DropdownMenu = styled.div`
  position: absolute;
  top: 56px;
  right: 0;
  width: 200px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 8px 0;
  z-index: 900;
`;

const MenuItemBox = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #414651;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`;

UserMenuComponent.displayName = "UserMenu";

export const UserMenu = UserMenuComponent;
