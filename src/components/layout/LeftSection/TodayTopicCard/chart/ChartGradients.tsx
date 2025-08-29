export default function ChartGradients() {
  return (
    <defs>
      <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF05CE" />
        <stop offset="100%" stopColor="#FF474F" />
      </linearGradient>
      <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1478FF" />
        <stop offset="100%" stopColor="#6142FF" />
      </linearGradient>
      <linearGradient id="pinkGradientStrong" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF05CE" />
        <stop offset="100%" stopColor="#FF0000" />
      </linearGradient>
      <linearGradient id="blueGradientStrong" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1478FF" />
        <stop offset="100%" stopColor="#0000FF" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="3"
          floodColor="rgba(0,0,0,0.25)"
        />
      </filter>
    </defs>
  );
}
