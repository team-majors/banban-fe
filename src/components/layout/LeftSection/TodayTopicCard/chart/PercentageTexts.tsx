import { TextPosition } from "@/lib/chart";
import { PieData } from "@/types/pie";

export const PercentageTexts = ({
  pieData,
  textPositions,
}: {
  pieData: PieData[];
  textPositions: TextPosition[];
}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 10,
    }}
  >
    {textPositions.map(
      (pos, index) =>
        pos.percent > 0 && (
          <div
            key={`text-${pieData[index]?.option}-${index}`}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: `${pos.fontSize}px`,
              fontWeight: pos.fontWeight,
              letterSpacing: "0.4px",
              pointerEvents: "none",
              userSelect: "none",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {pos.percent}%
          </div>
        ),
    )}
  </div>
);

export default PercentageTexts;
