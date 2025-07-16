import React, { useState, useEffect, useRef } from "react";
import { Animate } from "react-move";

interface AnimatedProgressProviderProps {
  valueStart?: number;
  valueEnd: number;
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  easingFunction: any;
  repeat?: boolean;
  children: (value: number) => React.ReactElement;
}

const AnimatedProgressProvider: React.FC<AnimatedProgressProviderProps> = ({
  valueStart = 0,
  valueEnd,
  duration,
  easingFunction,
  repeat,
  children,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (repeat) {
      intervalRef.current = window.setInterval(() => {
        setIsAnimated((prev) => !prev);
      }, duration * 1000);
    } else {
      setIsAnimated(true);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [repeat, duration]);

  return (
    <Animate
      start={() => ({
        value: valueStart,
      })}
      update={() => ({
        value: [isAnimated ? valueEnd : valueStart],
        timing: {
          duration: duration * 1000,
          ease: easingFunction,
        },
      })}
    >
      {({ value }) => children(value)}
    </Animate>
  );
};

export default AnimatedProgressProvider;
