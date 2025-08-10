import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from ".";

const meta: Meta<typeof Header> = {
  title: "Components/Layout/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    isNew: {
      control: "boolean",
      description: "새 알림 여부",
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  args: {
    isNew: false,
  },
};

export const LoggedInNoNotification: Story = {
  args: {
    isNew: false,
  },
};

export const LoggedInWithNotification: Story = {
  args: {
    isNew: true,
  },
};
