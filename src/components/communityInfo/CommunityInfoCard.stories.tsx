import { StoryObj, Meta } from "@storybook/react-vite";
import { CommunityInfoCard } from "./CommunityInfoCard";

const meta: Meta<typeof CommunityInfoCard> = {
  title: "Components/Common/CommunityInfoCard",
  component: CommunityInfoCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CommunityInfoCard>;

export const Default: Story = {};
