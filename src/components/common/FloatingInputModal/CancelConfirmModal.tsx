import styled from "styled-components";

interface CancelConfirmModalProps {
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const CancelConfirmModal = ({ onSave, onDiscard, onCancel }: CancelConfirmModalProps) => {
  return (
    <CancelModalOverlay onClick={onCancel}>
      <CancelModalContainer onClick={(e) => e.stopPropagation()}>
        <CancelModalHeader>
          <CancelModalTitle>임시 저장 하시겠어요?</CancelModalTitle>
        </CancelModalHeader>
        <CancelModalContent>
          <CancelModalMessage>
            다시 수정하고 싶을 때 편하게 불러올 수 있어요.
          </CancelModalMessage>
        </CancelModalContent>
        <CancelModalFooter>
          <CancelModalButton onClick={onSave} variant="primary">
            임시 저장
          </CancelModalButton>
          <Divider />
          <CancelModalButton onClick={onDiscard} variant="danger">
            저장 안 할래요
          </CancelModalButton>
          <Divider />
          <CancelModalButton onClick={onCancel} variant="secondary">
            취소
          </CancelModalButton>
        </CancelModalFooter>
      </CancelModalContainer>
    </CancelModalOverlay>
  );
};

// 취소 확인 모달 스타일 컴포넌트들
const CancelModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const CancelModalContainer = styled.div`
  /* Auto layout */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 20px;

  width: 320px;
  min-height: 200px;

  /* White */
  background: #FFFFFF;
  /* Gray/200 */
  border: 1px solid #E9EAEB;
  /* Shadow/lg */
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03);
  border-radius: 12px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;

  box-sizing: border-box;
`;

const CancelModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CancelModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CancelModalContent = styled.div`
  width: 100%;
`;

const CancelModalMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const CancelModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
`;

const CancelModalButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
  border-radius: 6px;

  color: ${props => {
    switch (props.variant) {
      case 'primary': return '#111827';  // 검정색
      case 'danger': return '#FF8B8B';   // 빨간색
      default: return '#111827';         // 검정색
    }
  }};

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary': return '#f9fafb';
        case 'danger': return '#fef2f2';
        default: return '#f9fafb';
      }
    }};
  }

  &:active {
    background: ${props => {
      switch (props.variant) {
        case 'primary': return '#f3f4f6';
        case 'danger': return '#fee2e2';
        default: return '#f3f4f6';
      }
    }};
  }
`;
