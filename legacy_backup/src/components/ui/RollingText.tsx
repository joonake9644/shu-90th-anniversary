import React, { useEffect, useMemo } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface RollingTextProps {
  text: string;
  startText?: string; // Optional starting text. If not provided, random chars are used.
  duration?: number;
  delay?: number;
  className?: string;
  height?: string | number;
  active?: boolean;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function RollingText({
  text,
  startText,
  duration = 1.5,
  delay = 0,
  className = "",
  height = "1em",
  active = true,
}: RollingTextProps) {
  // Normalize lengths
  // If startText is provided, pad/trim. If not, we'll handle in the column.
  const targetChars = text.split("");
  
  return (
    <div className={`inline-flex items-center overflow-hidden leading-none whitespace-pre ${className}`} style={{ height }}>
      {targetChars.map((char, index) => {
        // Determine start char
        // If startText is shorter, or not provided, pick a "random" char based on index to be deterministic
        let initialChar = 'A';
        if (startText && index < startText.length) {
            initialChar = startText[index];
        } else {
            // Pick a character ~10 steps away backwards or just random
            // For a consistent feel, let's pick 'A' or random.
            // Let's use a simple deterministic offset for default start
            initialChar = String.fromCharCode(65 + (index * 7) % 26);
        }

        return (
          <CharColumn
            key={`${index}-${char}`} 
            toChar={char}
            fromChar={initialChar}
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

interface CharColumnProps {
  fromChar: string;
  toChar: string;
  delay: number;
  height: string | number;
  direction: "up" | "down";
  active: boolean;
}

function CharColumn({ fromChar, toChar, delay, height, direction, active }: CharColumnProps) {
  const { sequence, finalIndex } = useMemo(() => {
    // If char is not A-Z (e.g. space), just return it
    if (!/[A-Za-z]/.test(toChar)) {
        return { sequence: [toChar], finalIndex: 0 };
    }

    const seq: string[] = [];
    const loops = 1; // Loops for text can be fewer as 26 chars is long
    
    // Convert to 0-25 index
    const toCode = toChar.toUpperCase().charCodeAt(0) - 65;
    const fromCode = fromChar.toUpperCase().charCodeAt(0) - 65;

    // If non-alpha passed effectively (should be covered by regex check above), fallback
    if (toCode < 0 || toCode > 25 || fromCode < 0 || fromCode > 25) {
         return { sequence: [toChar], finalIndex: 0 };
    }

    let current = fromCode;
    seq.push(ALPHABET[current]);
    
    let count = 0;
    const dist = direction === "up" 
       ? (toCode - fromCode + 26) % 26 
       : (fromCode - toCode + 26) % 26;
       
    // Minimum spin distance to ensure it looks cool
    const minSteps = 10;
    const targetCount = dist < minSteps ? dist + 26 : dist;
    // Add extra loops if desired, but 26 chars is already a lot of scrolling

    while (count < targetCount) {
      if (direction === "up") {
        current = (current + 1) % 26;
      } else {
        current = (current - 1 + 26) % 26;
      }
      seq.push(ALPHABET[current]);
      count++;
    }
    
    return { sequence: seq, finalIndex: seq.length - 1 };
  }, [fromChar, toChar, direction]);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    if (!active) {
        spring.jump(0);
        return;
    }
    
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
        {sequence.map((char, i) => (
          <div key={i} className="flex items-center justify-center w-full" style={{ height }}>
            {char}
          </div>
        ))}
      </motion.div>
      {/* Placeholder for width - use the target char */}
      <span className="opacity-0 pointer-events-none relative z-[-1]">{toChar}</span>
    </div>
  );
}
