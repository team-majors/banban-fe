import { WarningCircle } from "@/components/svg";
import styled from "styled-components";

interface OptionsDropdownProps {
  isMyFeed?: boolean;
  onHide?: () => void;
  onReport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  isMyFeed,
  onHide,
  onReport,
  onEdit,
  onDelete,
}) => {
  return (
    <Container>
      {isMyFeed ? (
        <>
          <OptionButton onClick={onEdit}>수정</OptionButton>
          <OptionButton $isDelete onClick={onDelete}>
            삭제
            <Icon>
              <WarningCircle />
            </Icon>
          </OptionButton>
        </>
      ) : (
        <>
          <OptionButton onClick={onHide}>관심 없음</OptionButton>
          <OptionButton $isReport onClick={onReport}>
            신고
            <Icon>
              <WarningCircle />
            </Icon>
          </OptionButton>
        </>
      )}
    </Container>
  );
};

// -------- styled-components -------- //

const Container = styled.div.attrs(() => ({ role: "menu" }))`
  position: absolute;
  right: 0;
  top: 12px;
  width: 168px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  overflow: hidden;
`;

const OptionButton = styled.button<{
  $isReport?: boolean;
  $isDelete?: boolean;
}>`
  width: 100%;
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $isReport, $isDelete }) =>
    $isReport || $isDelete ? "#FF4242" : "#333"};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const Icon = styled.span`
  font-size: 16px;
`;
