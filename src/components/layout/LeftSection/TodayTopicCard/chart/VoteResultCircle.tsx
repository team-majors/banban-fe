import { CHART_CONFIG } from "@/constants/chart";
import { calculateTextPosition } from "@/lib/chart";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PercentageTexts from "./PercentageTexts";
import ChartGradients from "./ChartGradients";
import { useId } from "react";
import { PieData } from "@/types/pie";

type PieDataWithIndex = PieData & { originalIndex: number };

const { dimensions, outerRadius, angles, animation } = CHART_CONFIG;

const VoteResultCircle = ({ pieData }: { pieData: PieData[] }) => {
  const [showStroke, setShowStroke] = useState(false);

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

  const sortedData = useMemo(() => {
    return pieData
      .map((d, i) => ({ ...d, originalIndex: i }))
      .sort((a, b) => {
        // 2b. 정렬
        const aWillHaveStroke = a.userSelected && a.percent !== 100;
        const bWillHaveStroke = b.userSelected && b.percent !== 100;

        if (aWillHaveStroke && !bWillHaveStroke) return 1;
        if (!aWillHaveStroke && bWillHaveStroke) return -1;
        return 0;
      });
  }, [pieData]);

  // 1. 원본 데이터 기준 텍스트 위치 계산 (변경 없음)
  const textPositions = useMemo(
    () => calculateTextPosition(sortedData),
    [sortedData],
  );

  const renderCell = useCallback(
    (entry: PieDataWithIndex) => {
      const isUserSelected = entry.userSelected;
      const shouldHighlight = isUserSelected && showStroke;
      const shouldShowStroke =
        isUserSelected && entry.percent !== 100 && showStroke;

      const fillColor = shouldHighlight
        ? colors.highlight[entry.optionOrder === 1 ? 0 : 1]
        : colors.normal[entry.optionOrder === 1 ? 0 : 1];

      return (
        <Cell
          key={`cell-${entry.option}-${entry.originalIndex}`}
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
            data={sortedData} // 4. 정렬된 데이터 사용 (이전과 동일)
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
            {sortedData.map(renderCell)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {showStroke && (
        <PercentageTexts pieData={sortedData} textPositions={textPositions} />
      )}
    </div>
  );
};

export default VoteResultCircle;
