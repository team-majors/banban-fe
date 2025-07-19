import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import styled from "styled-components";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Modal> = {
  title: "Components/Common/Modal",
  component: Modal,
  args: {
    isOpen: true,
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState<typeof args.isOpen>(args.isOpen);

    useEffect(() => {
      setIsOpen(args.isOpen);
    }, [args.isOpen]);

    return (
      <>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <ModalTitle id="modal-title">신고하기</ModalTitle>
          </Modal.Header>
          <Modal.Body>
            <DummyContent id="modal-content">
              커뮤니티 정책에 어긋나는 게시물을 알려주세요. 신고하신 내용을
              확인해 빠르게 대응할게요 🚨
            </DummyContent>
          </Modal.Body>
        </Modal>
      </>
    );
  },
};

const DummyContent = styled.div`
  padding: 12px 0;
  font-size: 14px;
  color: #333;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;
