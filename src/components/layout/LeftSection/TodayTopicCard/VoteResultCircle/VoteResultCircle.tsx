import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AnimatedProgressProvider from "../AnimatedProgressProvider";
import { easeQuadInOut } from "d3-ease";

export default function VoteResultCircle() {
  return (
    <AnimatedProgressProvider
      valueStart={0}
      valueEnd={60}
      easingFunction={easeQuadInOut}
      duration={1}
    >
      {(value: number) => {
        return (
          <CircularProgressbar
            className="max-h-[280px] font-bold"
            value={value}
            text={"24시간 자유, 월 300씩 들어오는 백수"}
            strokeWidth={50}
            styles={buildStyles({
              strokeLinecap: "butt",
              textSize: "5px",
              textColor: "white",
              trailColor: "#FF05CE",
              pathColor: "#293ef8",
            })}
          />
        );
      }}
    </AnimatedProgressProvider>
  );
}
