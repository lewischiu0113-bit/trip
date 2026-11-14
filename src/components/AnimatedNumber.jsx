import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedNumber({ value, duration = 0.65, format = (n) => n.toLocaleString() }) {
  const numericValue = Number(value) || 0;
  const [displayValue, setDisplayValue] = useState(numericValue);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const controls = animate(startValue, numericValue, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        setDisplayValue(numericValue);
        prevValueRef.current = numericValue;
      }
    });

    return () => {
      controls.stop();
      prevValueRef.current = numericValue;
    };
  }, [numericValue, duration]);

  return <>{format(displayValue)}</>;
}

