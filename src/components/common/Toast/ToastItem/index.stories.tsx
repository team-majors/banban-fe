import ToastItem from ".";
import { Toast } from "../types";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const baseToast = {
  id: "example-toast",
  message: "테스트 메시지입니다.",
  duration: 5000,
} satisfies Partial<Toast>;

const meta: Meta<typeof ToastItem> = {
  title: "Components/Common/Toast/ToastItem",
  component: ToastItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastItem>;

export const Success: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "success",
    } as Toast,
  },
};

export const Error: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "error",
    } as Toast,
  },
};

export const Info: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "info",
    } as Toast,
  },
};

export const ShortDuration: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "default",
      duration: 1000,
      message: "1초 후 사라지는 토스트",
    } as Toast,
  },
};

export const LongDuration: Story = {
  args: {
    toast: {
      ...baseToast,
      type: "warning",
      duration: 10000,
      message: "10초 동안 유지되는 토스트",
    } as Toast,
  },
};
