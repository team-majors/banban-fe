"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: "대시보드" },
    { href: "/admin/reports", label: "신고 관리" },
    { href: "/admin/polls", label: "투표 관리" },
    { href: "/admin/notifications", label: "알림 관리" },
    { href: "/admin/activity-logs", label: "활동 로그" },
    { href: "/admin/system", label: "시스템" },
  ];

  return (
    <AdminGuard>
      <Shell>
        <Sidebar>
          <NavTitle>관리자 메뉴</NavTitle>
          <NavList>
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <NavLink href={item.href} $active={active}>
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </NavList>
        </Sidebar>
        <Content>{children}</Content>
      </Shell>
    </AdminGuard>
  );
}

const Shell = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  max-width: 1200px;
  padding: 16px;
  margin: 0 auto;
  padding-top: 76px; /* offset for fixed header (60px) + breathing space */
`;

const Sidebar = styled.aside`
  background: #ffffff;
  border: 1px solid #e9eaeb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(10, 13, 18, 0.05);
  padding: 12px;
  height: fit-content;
`;

const NavTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Content = styled.section`
  min-width: 0;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  text-decoration: none;
  border: 1px solid transparent;

  ${({ $active }) =>
    $active
      ? css`
          background: #f9fafb;
          border-color: #e5e7eb;
          font-weight: 700;
        `
      : css`
          &:hover {
            background: #f3f4f6;
          }
        `}
`;
