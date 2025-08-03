import { useLoginModalStore } from "@/store/useLoginModalStore";

export default function useLoginModal() {
  const isOpen = useLoginModalStore((state) => state.isOpen);
  const openLoginModal = useLoginModalStore((state) => state.openLoginModal);
  const closeLoginModal = useLoginModalStore((state) => state.closeLoginModal);

  return { isOpen, openLoginModal, closeLoginModal };
}
