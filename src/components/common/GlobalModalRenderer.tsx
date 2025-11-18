"use client";

import useLoginModal from "@/hooks/ui/modal/useLoginModal";
import { Modal } from "./Modal";

export default function GlobalModalRenderer() {
  const { isOpen, closeLoginModal } = useLoginModal();

  return isOpen ? (
    <Modal onClose={closeLoginModal} isOpen={isOpen}>
      로그인이 필요합니다
    </Modal>
  ) : null;
}
