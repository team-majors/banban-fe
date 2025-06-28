import React from "react";
import { LoginButton } from ".";
import Image from "next/image";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof LoginButton> = {
  title: "Components/LoginButton",
  component: LoginButton,
  argTypes: {
    color: { control: "color" },
    fontcolor: { control: "color" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof LoginButton>;

export const Default: Story = {
  args: {
    color: "#F9E000",
    fontcolor: "#371C1D",
    children: "카카오로 로그인",
    icon: <Image src="/kakao.png" alt="kakao-icon" width={24} height={24} />,
  },
};

export const Disabled: Story = {
  args: {
    color: "#F9E000",
    fontcolor: "#371C1D",
    disabled: true,
    children: "카카오로 로그인",
    icon: <Image src="/kakao.png" alt="kakao-icon" width={24} height={24} />,
  },
};
