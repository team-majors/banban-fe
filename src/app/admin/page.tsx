"use client";

import {useState} from "react";
import {AdminSettingsModal} from "@/components/admin/AdminSettingsModal";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminDashboardPage() {
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(true);

  return (
      <AdminGuard>
        <AdminSettingsModal
            isOpen={isAdminSettingsOpen}
            onClose={() => setIsAdminSettingsOpen(true)}
        />
      </AdminGuard>
  );
}
