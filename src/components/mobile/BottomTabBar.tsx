import {
  HomeIcon,
  BellIcon,
  UserIcon,
  DiscussionDoubleIcon,
} from "@/components/svg";

export type TabType = "home" | "feeds" | "notifications" | "profile";

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasUnreadNotifications?: boolean;
}

export default function BottomTabBar({
  activeTab,
  onTabChange,
  hasUnreadNotifications = false,
}: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-[#d5d7da] py-2 pb-[max(8px,env(safe-area-inset-bottom))] z-[100] h-16">
      <button
        onClick={() => onTabChange("home")}
        aria-label="홈"
        className="flex flex-col items-center justify-center gap-1 flex-1 border-none bg-transparent cursor-pointer p-2 transition-transform active:scale-95"
      >
        <HomeIcon
          width={24}
          height={24}
          color={activeTab === "home" ? "#3f13ff" : "#535862"}
        />
        <span
          className={`text-xs transition-colors ${
            activeTab === "home"
              ? "font-semibold text-[#3f13ff]"
              : "font-normal text-[#535862]"
          }`}
        >
          홈
        </span>
      </button>

      <button
        onClick={() => onTabChange("feeds")}
        aria-label="피드"
        className="flex flex-col items-center justify-center gap-1 flex-1 border-none bg-transparent cursor-pointer p-2 transition-transform active:scale-95"
      >
        <DiscussionDoubleIcon
          width={24}
          height={24}
          color={activeTab === "feeds" ? "#3f13ff" : "#535862"}
        />
        <span
          className={`text-xs transition-colors ${
            activeTab === "feeds"
              ? "font-semibold text-[#3f13ff]"
              : "font-normal text-[#535862]"
          }`}
        >
          피드
        </span>
      </button>

      <button
        onClick={() => onTabChange("notifications")}
        aria-label="알림"
        className="flex flex-col items-center justify-center gap-1 flex-1 border-none bg-transparent cursor-pointer p-2 transition-transform active:scale-95"
      >
        <div className="relative flex items-center justify-center">
          <BellIcon
            width={24}
            height={24}
            color={activeTab === "notifications" ? "#3f13ff" : "#535862"}
          />
          {hasUnreadNotifications && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff474f] border-2 border-white" />
          )}
        </div>
        <span
          className={`text-xs transition-colors ${
            activeTab === "notifications"
              ? "font-semibold text-[#3f13ff]"
              : "font-normal text-[#535862]"
          }`}
        >
          알림
        </span>
      </button>

      <button
        onClick={() => onTabChange("profile")}
        aria-label="프로필"
        className="flex flex-col items-center justify-center gap-1 flex-1 border-none bg-transparent cursor-pointer p-2 transition-transform active:scale-95"
      >
        <UserIcon
          width={24}
          height={24}
          color={activeTab === "profile" ? "#3f13ff" : "#535862"}
        />
        <span
          className={`text-xs transition-colors ${
            activeTab === "profile"
              ? "font-semibold text-[#3f13ff]"
              : "font-normal text-[#535862]"
          }`}
        >
          프로필
        </span>
      </button>
    </nav>
  );
}
