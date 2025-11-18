import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useSegmentedIndicator } from "@/hooks/ui/feed/useSegmentedIndicator";

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
  const { indicatorLeft, indicatorWidth } = useSegmentedIndicator({
    itemRefs,
    selectedIdx,
    dependencyKey: itemLabels.length,
  });

  useEffect(() => {
    if (typeof initialIdx === "number") {
      setSelectedIdx(initialIdx);
    }
  }, [initialIdx]);

  const handleItemClick = (idx: number) => {
    if (idx === selectedIdx) return;
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
        <SegmentedControlItem $left={indicatorLeft} $width={indicatorWidth} />
      </StyledItemWrapper>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  position: relative;
`;

const StyledItemWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  position: relative;
  width: fit-content;
`;

const StyledItem = styled.button<{ $isSelected: boolean }>`
  padding: 4px 12px;
  color: ${({ $isSelected }) => ($isSelected ? "#1F2024" : "#71727a")};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "light")};
  font-size: 14px;

  cursor: pointer;
`;

const SegmentedControlItem = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  bottom: -4px;
  height: 4px;
  width: ${({ $width }) => `${$width}px`};
  max-width: 100%;
  background-color: #3f13ff;
  border-radius: 10px;
  pointer-events: none;
  transform: translateX(${({ $left }) => $left}px);
  transition: transform 0.2s ease, width 0.2s ease;
`;
