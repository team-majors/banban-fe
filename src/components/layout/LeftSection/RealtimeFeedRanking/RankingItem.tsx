import ArrowDownIcon from "@/components/svg/ArrowDownIcon";
import ArrowUpIcon from "@/components/svg/ArrowUpIcon";
import styled, { css } from "styled-components";

interface RankingItemProps {
  rank: number;
  title: string;
  figure?: number;
  onSelect?: () => void;
}

export default function RankingItem({
  rank,
  title,
  figure,
  onSelect,
}: RankingItemProps) {
  return (
    <Container type="button" onClick={onSelect} disabled={!onSelect}>
      <Left>
        <Rank $highlight={rank <= 3}>{rank}</Rank>
        <div>{title}</div>
      </Left>
      {figure === 0 ? (
        <FigureSpacer />
      ) : (
        <Figure $increase={figure > 0}>
          <div>{figure}</div>
          <ArrowWrapper>
            {figure > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </ArrowWrapper>
        </Figure>
      )}
    </Container>
  );
}

const COLOR = {
  highlight: "#FF474F",
  normal: "#828282",
  increase: "#FF474F",
  decrease: "#59BCFB",
};

const Container = styled.button`
  display: flex;
  gap: 15px;
  justify-content: space-between;
  color: #181d27;
  line-height: 24px;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const Left = styled.div`
  display: flex;
  gap: 10px;
`;

const Rank = styled.div<{ $highlight: boolean }>`
  color: ${({ $highlight }) => ($highlight ? COLOR.highlight : COLOR.normal)};
`;

const Figure = styled.div<{ $increase: boolean }>`
  display: flex;
  align-items: center;
  ${({ $increase }) =>
    $increase
      ? css`
          color: ${COLOR.increase};
        `
      : css`
          color: ${COLOR.decrease};
        `}
`;

const ArrowWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
`;

const FigureSpacer = styled.div`
  width: 50px;
  height: 24px;
`;
