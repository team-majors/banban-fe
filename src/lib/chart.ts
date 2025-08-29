import { CHART_CONFIG } from "@/constants/chart";

type PieData = {
  option: string;
  count: number;
  userSelected: boolean;
  percent: number;
};

export type TextPosition = {
  x: number;
  y: number;
  percent: number;
  fontSize: number;
  fontWeight: number;
};

export function makePieData(
  options: { id: number; content: string; vote_count: number | null }[],
  votedOptionId: number | null,
): PieData[] {
  const total = options.reduce(
    (sum, opt) => sum + (opt.vote_count === null ? 0 : opt.vote_count),
    0,
  );
  const data = options.map((option) => {
    const count = option.vote_count === null ? 0 : option.vote_count;
    const rawPercent = total > 0 ? (count / total) * 100 : 0;

    const percent = Number.isInteger(rawPercent)
      ? rawPercent
      : Number(rawPercent.toFixed(2));

    return {
      option: option.content,
      count,
      userSelected: votedOptionId === option.id,
      percent,
    };
  });

  return [
    ...data.filter((d) => !d.userSelected),
    ...data.filter((d) => d.userSelected),
  ];
}

export const calculateTextPosition = (
  data: PieData[],
  cx: number = CHART_CONFIG.dimensions.width / 2,
  cy: number = CHART_CONFIG.dimensions.height / 2,
  outerRadius: number = CHART_CONFIG.outerRadius,
): TextPosition[] => {
  if (!data.length) return [];

  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) return [];

  let currentAngle = CHART_CONFIG.angles.start;

  return data.map((item) => {
    const percent = item.count / total;
    const angle = percent * 360;
    const midAngle = currentAngle - angle / 2;

    let x = cx;
    let y = cy;

    if (percent < 1) {
      const RADIAN = Math.PI / 180;
      let radius = outerRadius * 0.5;

      radius += item.userSelected ? 2 : 0;

      x = cx + radius * Math.cos(-midAngle * RADIAN);
      y = cy + radius * Math.sin(-midAngle * RADIAN);
    }

    currentAngle -= angle;

    return {
      x,
      y,
      percent: item.percent,
      fontSize: item.percent === 100 ? 24 : item.userSelected ? 20 : 18,
      fontWeight: item.userSelected ? 700 : 200,
    };
  });
};
