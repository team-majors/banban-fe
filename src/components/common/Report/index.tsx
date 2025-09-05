import React, { useState } from 'react';
import styled from 'styled-components';
import { CloseIcon } from '@/components/svg/CloseIcon';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string, detail?: string, targetType?: string, targetId?: number) => void;
  targetType: string;
  targetId: number;
}

const reportReasons = [
  { code: 'SPAM_AD', label: '스팸·광고성 게시물' },
  { code: 'PROFANITY_HATE', label: '욕설·혐오 표현' },
  { code: 'VIOLENCE_HARM', label: '폭력적·유해 콘텐츠' },
  { code: 'OBSCENE_SEXUAL', label: '음란물·성적 콘텐츠' },
  { code: 'PERSONAL_INFO', label: '개인정보 노출' },
  { code: 'COPYRIGHT', label: '저작권 침해' },
  { code: 'ETC', label: '기타(사유 입력)' }
];

export const ReportModal = ({
  isOpen,
  onClose,
  onReport,
  targetType,
  targetId
}: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isDetailMode, setIsDetailMode] = useState<boolean>(false);
  const [detailText, setDetailText] = useState<string>('');

  const handleReasonSelect = (reasonCode: string) => {
    setSelectedReason(reasonCode);
    
    if (reasonCode === 'ETC') {
      setIsDetailMode(true);
    } else {
      onReport(reasonCode, undefined, targetType, targetId);
      setSelectedReason('');
      onClose();
    }
  };

  const handleDetailSubmit = () => {
    if (detailText.trim()) {
      onReport('ETC', detailText.trim(), targetType, targetId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setIsDetailMode(false);
    setDetailText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <ModalTitle>
              {isDetailMode ? '상세 사유 입력' : '신고하기'}
            </ModalTitle>
            <ModalSubtitle>
              {isDetailMode 
                ? '신고 사유를 자세히 설명해주세요.'
                : '커뮤니티 정책에 어긋나는 게시물을 알려주세요. 신고하신 내용을 확인해 빠르게 대응할게요 🚨'
              }
            </ModalSubtitle>
          </HeaderContent>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {isDetailMode ? (
            <DetailInputContainer>
              <DetailTextarea
                value={detailText}
                onChange={(e) => setDetailText(e.target.value)}
                placeholder="신고 사유를 자세히 입력해주세요..."
              />
              <ButtonContainer>
                <CancelButton onClick={() => setIsDetailMode(false)}>
                  취소
                </CancelButton>
                <SubmitButton 
                  onClick={handleDetailSubmit}
                  disabled={!detailText.trim()}
                >
                  신고하기
                </SubmitButton>
              </ButtonContainer>
            </DetailInputContainer>
          ) : (
            reportReasons.map((reason, index) => (
              <React.Fragment key={reason.code}>
                <ReasonItem
                  $isSelected={selectedReason === reason.code}
                  onClick={() => handleReasonSelect(reason.code)}
                >
                  {reason.label}
                </ReasonItem>
                {index < reportReasons.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  min-height: 300px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalBody = styled.div`
  padding: 0;
  height: auto;
  overflow-y: auto;
`;

const ReasonItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.$isSelected ? '#3b82f6' : '#374151'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
    color: #3b82f6;
  }

  &:active {
    background-color: #f1f5f9;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 0 24px;
`;

const DetailInputContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  padding: 12px 24px;
  background-color: ${props => props.disabled ? '#d1d5db' : '#ef4444'};
  color: ${props => props.disabled ? '#9ca3af' : 'white'};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.disabled ? '#d1d5db' : '#dc2626'};
  }

  &:disabled {
    opacity: 0.6;
  }
`;