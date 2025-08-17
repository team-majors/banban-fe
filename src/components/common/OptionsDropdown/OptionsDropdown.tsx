import { WarningCircle } from "@/components/svg";
import styled from "styled-components";

interface OptionsDropdownProps {
  onHide: () => void;
  onReport: () => void;
}

export const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  onHide,
  onReport,
}) => {
  return (
    <Container>
      <OptionButton onClick={onHide}>관심 없음</OptionButton>
      <OptionButton $isReport onClick={onReport}>
        신고
        <Icon>
          <WarningCircle />
        </Icon>
      </OptionButton>
    </Container>
  );
};

// -------- styled-components -------- //

const Container = styled.div.attrs(() => ({ role: "menu" }))`
  position: absolute;
  right: 0;
  top: 12px;
  width: 300px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  overflow: hidden;
`;

const OptionButton = styled.button<{ $isReport?: boolean }>`
  width: 100%;
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $isReport }) => ($isReport ? "#FF4242" : "#333")};
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
