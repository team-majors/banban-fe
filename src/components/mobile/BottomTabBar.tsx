import styled from "styled-components";
import { PollIcon, FeedIcon } from "@/components/svg";

interface BottomTabBarProps {
  activeTab: "poll" | "feeds";
  onTabChange: (tab: "poll" | "feeds") => void;
}

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <Container>
      <TabButton
        $active={activeTab === "poll"}
        onClick={() => onTabChange("poll")}
        aria-label="투표"
      >
        <PollIcon
          width={24}
          height={24}
          color={activeTab === "poll" ? "#3f13ff" : "#535862"}
        />
        <TabLabel $active={activeTab === "poll"}>투표</TabLabel>
      </TabButton>

      <TabButton
        $active={activeTab === "feeds"}
        onClick={() => onTabChange("feeds")}
        aria-label="피드"
      >
        <FeedIcon
          width={24}
          height={24}
          color={activeTab === "feeds" ? "#3f13ff" : "#535862"}
        />
        <TabLabel $active={activeTab === "feeds"}>피드</TabLabel>
      </TabButton>
    </Container>
  );
}

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #d5d7da;
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 100;
  height: 64px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const TabLabel = styled.span<{ $active: boolean }>`
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? "#3f13ff" : "#535862")};
  transition: color 0.2s ease;
`;
