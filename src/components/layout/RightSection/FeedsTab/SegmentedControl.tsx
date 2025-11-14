import styled from "styled-components";
import { useState, useRef } from "react";
import { useSegmentedIndicator } from "@/hooks/useSegmentedIndicator";

interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  itemLabels: string[];
  initialIdx?: number;
  onItemClick?: (idx: number) => void;
}

export default function SegmentedControl({
  itemLabels,
  initialIdx,
  onItemClick,
}: SegmentedControlProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [selectedIdx, setSelectedIdx] = useState(initialIdx ?? 0);
  const { indicatorLeft } = useSegmentedIndicator({
    itemRefs,
    selectedIdx,
    dependencyKey: itemLabels.length,
  });

  const handleItemClick = (idx: number) => {
    setSelectedIdx(idx);
    onItemClick?.(idx);
  };

  return (
    <StyledContainer>
      <StyledItemWrapper>
        {itemLabels.map((label, idx) => (
          <StyledItem
            key={label}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => handleItemClick(idx)}
            $isSelected={selectedIdx === idx}
          >
            {label}
          </StyledItem>
        ))}
      </StyledItemWrapper>
      <SegmentedControlItem $left={indicatorLeft} />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
`;

const StyledItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledItem = styled.button<{ $isSelected: boolean }>`
  padding: 4px 12px;
  color: ${({ $isSelected }) => ($isSelected ? "#1F2024" : "#71727a")};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "light")};
  font-size: 14px;

  cursor: pointer;
`;

const SegmentedControlItem = styled.div<{ $left: number }>`
  position: absolute;

  bottom: -4px;

  left: ${({ $left }) => `${$left}px`};

  width: 24px;
  height: 4px;

  background-color: #3f13ff;
  border-radius: 10px;

  transition: all 0.3s ease-in-out;
`;
