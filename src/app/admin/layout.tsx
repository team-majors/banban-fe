"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";

const NAV_ITEMS = [
  { href: "/admin/system", label: "시스템" },
  { href: "/admin/reports", label: "신고 관리" },
  { href: "/admin/polls", label: "투표 관리" },
  { href: "/admin/notifications", label: "알림 관리" },
  { href: "/admin/activity-logs", label: "활동 로그" },
  { href: "/admin/users", label: "사용자 관리" },
];

const linkBase =
  "whitespace-nowrap rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition hover:bg-slate-100";
const linkActive =
  "bg-slate-100 border-slate-200 text-slate-900 shadow-sm";
const linkInactive = "text-slate-600";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-20 lg:flex-row lg:px-8 lg:pt-24">
          <aside className="hidden w-full max-w-[240px] flex-shrink-0 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sticky self-start top-24 lg:block">
            <div className="mb-4 text-sm font-semibold text-slate-500">
              관리자 메뉴
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${linkBase} ${
                      active ? linkActive : linkInactive
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="lg:hidden">
            <nav className="sticky top-16 z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 pb-3 pt-2 shadow-sm">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${linkBase} ${
                      active ? linkActive : linkInactive
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <section className="flex-1">{children}</section>
        </div>
      </div>
    </AdminGuard>
  );
}
