/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type TooltipPayload = ReadonlyArray<any>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: any;
  };

const data = [
  { name: "A", value: 63.47 },
  { name: "B", value: 37.53 },
];

const COLORS = ["url(#blueGradient)", "url(#pinkGradient)"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius =
    Number(innerRadius)! + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx)! + radius * Math.cos(-Number(midAngle ?? 0) * RADIAN);
  const y = Number(cy)! + radius * Math.sin(-Number(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={20}
      fontWeight="bold"
      letterSpacing={0.8}
    >
      {(percent! * 100).toFixed(2)}%
    </text>
  );
};

const VoteResultCircle = () => (
  <div
    style={{
      width: "256px",
      height: "256px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
      borderRadius: "50%",
      background: "transparent",
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1478FF" />
            <stop offset="100%" stopColor="#6142FF" />
          </linearGradient>
          <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF05CE" />
            <stop offset="100%" stopColor="#FF474F" />
          </linearGradient>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          outerRadius="104%"
          stroke="none"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default VoteResultCircle;
