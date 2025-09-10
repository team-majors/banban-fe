import styled from "styled-components";
import { useState, useRef, useLayoutEffect } from "react";

interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  itemLabels: string[];
  initialIdx?: number;
  // 로직 변화에 따라 변화, 추가될 수 있음
}

export default function SegmentedControl({
  itemLabels,
  initialIdx,
}: SegmentedControlProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [selectedIdx, setSelectedIdx] = useState(initialIdx ?? 0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  const calculateIndicatorLeft = (idx: number): number => {
    let sum = 0;

    for (let i = 0; i < idx; i++) {
      sum += itemRefs.current[i]?.clientWidth ?? 0;
    }

    const currentWidth = itemRefs.current[idx]?.clientWidth ?? 0;
    return sum + (currentWidth - 24) / 2;
  };

  useLayoutEffect(() => {
    const distance = calculateIndicatorLeft(selectedIdx);
    setIndicatorLeft(distance);
  }, [selectedIdx]);

  return (
    <StyledContainer>
      <StyledItemWrapper>
        {itemLabels.map((label, idx) => (
          <StyledItem
            key={label}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => {
              setSelectedIdx(idx);
            }}
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
  padding: 4px 16px;
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
