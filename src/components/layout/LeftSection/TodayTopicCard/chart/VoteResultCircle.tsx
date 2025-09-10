import { CHART_CONFIG } from "@/constants/chart";
import { calculateTextPosition } from "@/lib/chart";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PercentageTexts from "./PercentageTexts";
import ChartGradients from "./ChartGradients";
import { useId } from "react";

export type PieData = {
  option: string;
  count: number;
  userSelected: boolean;
  percent: number;
};

const { dimensions, outerRadius, angles, animation } = CHART_CONFIG;

const VoteResultCircle = ({ pieData }: { pieData: PieData[] }) => {
  const [showStroke, setShowStroke] = useState(false);

  const textPositions = useMemo(
    () => calculateTextPosition(pieData),
    [pieData],
  );

  const uniqueId = useId();

  const colors = useMemo(
    () => ({
      normal: [
        `url(#${uniqueId}-pinkGradient)`,
        `url(#${uniqueId}-blueGradient)`,
      ],
      highlight: [
        `url(#${uniqueId}-pinkGradientStrong)`,
        `url(#${uniqueId}-blueGradientStrong)`,
      ],
    }),
    [uniqueId],
  );

  const renderCell = useCallback(
    (entry: PieData, index: number) => {
      const isUserSelected = entry.userSelected;
      const shouldHighlight = isUserSelected && showStroke;
      const shouldShowStroke =
        isUserSelected && entry.percent !== 100 && showStroke;

      const fillColor = shouldHighlight
        ? colors.highlight[index % colors.highlight.length]
        : colors.normal[index % colors.normal.length];

      return (
        <Cell
          key={`cell-${entry.option}-${index}`}
          fill={fillColor}
          stroke={shouldShowStroke ? "#fff" : "none"}
          strokeWidth={shouldShowStroke ? 8 : 0}
          filter="url(#shadow)"
          style={{
            transition: "fill 0.5s ease-in-out",
            willChange: "fill",
          }}
        />
      );
    },
    [showStroke, colors],
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowStroke(true), animation.strokeDelay);
    return () => clearTimeout(timer);
  }, []);

  if (!pieData.length) {
    return (
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 16,
        }}
      >
        데이터가 없습니다
      </div>
    );
  }

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart style={{ pointerEvents: "none" }}>
          <ChartGradients uniqueId={uniqueId} />
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            dataKey="count"
            startAngle={angles.start}
            endAngle={angles.end}
            outerRadius={outerRadius}
            innerRadius={0}
            stroke="none"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={animation.duration}
          >
            {pieData.map(renderCell)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* stroke 보여질때 같이 보여지기 */}
      {showStroke && (
        <PercentageTexts pieData={pieData} textPositions={textPositions} />
      )}
    </div>
  );
};

export default VoteResultCircle;
