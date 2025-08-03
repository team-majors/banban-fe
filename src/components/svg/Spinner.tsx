export function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{
        width: 18.7,
        height: 18.7,
      }}
    >
      <style jsx>{`
        @keyframes highlight {
          0%,
          100% {
            fill: #fff;
          }
          12.5% {
            fill: #000;
          }
        }
        .dot {
          fill: #fff;
        }
        .dot:nth-child(1) {
          animation: highlight 1s linear infinite;
        }
        .dot:nth-child(2) {
          animation: highlight 1s linear infinite -0.875s;
        }
        .dot:nth-child(3) {
          animation: highlight 1s linear infinite -0.75s;
        }
        .dot:nth-child(4) {
          animation: highlight 1s linear infinite -0.625s;
        }
        .dot:nth-child(5) {
          animation: highlight 1s linear infinite -0.5s;
        }
        .dot:nth-child(6) {
          animation: highlight 1s linear infinite -0.375s;
        }
        .dot:nth-child(7) {
          animation: highlight 1s linear infinite -0.25s;
        }
        .dot:nth-child(8) {
          animation: highlight 1s linear infinite -0.125s;
        }
      `}</style>

      <circle className="dot" cx="50" cy="20" r="6" />
      <circle className="dot" cx="70.7107" cy="29.2893" r="6" />
      <circle className="dot" cx="80" cy="50" r="6" />
      <circle className="dot" cx="70.7107" cy="70.7107" r="6" />
      <circle className="dot" cx="50" cy="80" r="6" />
      <circle className="dot" cx="29.2893" cy="70.7107" r="6" />
      <circle className="dot" cx="20" cy="50" r="6" />
      <circle className="dot" cx="29.2893" cy="29.2893" r="6" />
    </svg>
  );
}
