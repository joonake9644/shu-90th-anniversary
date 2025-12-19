import React, { useEffect, useState, useMemo } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface RollingNumberProps {
  value: number; 
  startValue?: number;
  duration?: number;
  delay?: number;
  className?: string;
  height?: string | number;
  active?: boolean; // New prop to control animation trigger
}

export function RollingNumber({
  value,
  startValue = 0,
  duration = 1.5,
  delay = 0,
  className = "",
  height = "1em",
  active = true,
}: RollingNumberProps) {
  const valueStr = value.toString();
  const startStr = startValue.toString();
  
  // Normalize lengths
  const maxLength = Math.max(valueStr.length, startStr.length);
  const paddedValue = valueStr.padStart(maxLength, "0");
  const paddedStart = startStr.padStart(maxLength, "0");
  
  const digits = paddedValue.split("");
  const startDigits = paddedStart.split("");

  return (
    <div className={`inline-flex items-center overflow-hidden leading-none tabular-nums ${className}`} style={{ height }}>
      {digits.map((digit, index) => {
        const currentDigit = parseInt(digit);
        const prevDigit = parseInt(startDigits[index]);
        
        return (
          <DigitColumn
            key={`${index}`} 
            to={currentDigit}
            from={prevDigit}
            delay={delay + index * 0.1}
            height={height}
            active={active}
            // Alternate direction for mechanical feel
            direction={index % 2 === 0 ? "up" : "down"}
          />
        );
      })}
    </div>
  );
}

interface DigitColumnProps {
  from: number;
  to: number;
  delay: number;
  height: string | number;
  direction: "up" | "down";
  active: boolean;
}

function DigitColumn({ from, to, delay, height, direction, active }: DigitColumnProps) {
  const { sequence, finalIndex } = useMemo(() => {
    const seq = [];
    const loops = 2; 
    
    let current = from;
    seq.push(current);
    
    let count = 0;
    const dist = direction === "up" 
       ? (to - from + 10) % 10 
       : (from - to + 10) % 10;
       
    const targetCount = dist + (loops * 10);

    while (count < targetCount) {
      if (direction === "up") {
        current = (current + 1) % 10;
      } else {
        current = (current - 1 + 10) % 10;
      }
      seq.push(current);
      count++;
    }
    
    return { sequence: seq, finalIndex: seq.length - 1 };
  }, [from, to, direction]);

  const spring = useSpring(0, {
    stiffness: 60, // Slower start
    damping: 20,   // Smooth stop
    mass: 1,
  });

  useEffect(() => {
    // If not active, stay at 0 (start value)
    if (!active) {
        spring.jump(0);
        return;
    }

    // When active becomes true (or is true on mount)
    // We start from 0 (which is `from` value in the sequence)
    // And animate to finalIndex
    
    const timeout = setTimeout(() => {
        spring.set(finalIndex);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [active, finalIndex, delay, spring]);

  const y = useTransform(spring, (val) => {
    return `-${val * 100}%`;
  });

  return (
    <div className="relative inline-flex flex-col overflow-hidden" style={{ height }}>
      <motion.div
        style={{ y }}
        className="absolute left-0 right-0 top-0 flex flex-col items-center"
      >
        {sequence.map((num, i) => (
          <div key={i} className="flex items-center justify-center w-full" style={{ height }}>
            {num}
          </div>
        ))}
      </motion.div>
      <span className="opacity-0 pointer-events-none relative z-[-1]">0</span>
    </div>
  );
}
