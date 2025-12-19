import React, { useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring, 
  useTransform, 
  useMotionValue, 
  useVelocity, 
  useAnimationFrame 
} from "motion/react";

// Helper function to wrap a number between a min and max
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface MarqueeSectionProps {
  text: string;
  direction?: 'left' | 'right';
  speed?: number; // Base speed
}

export function MarqueeSection({ text, direction = 'left', speed = 5 }: MarqueeSectionProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Parallax speed based on scroll velocity
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Wrap the x value so it loops seamlessly.
  // The range should be adjusted based on the content width.
  // Assuming 4 repeats, we wrap between -25% and -50% to loop the middle part?
  // Let's try wrapping between 0 and -50% for standard loop.
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(direction === 'left' ? 1 : -1);

  useAnimationFrame((t, delta) => {
    // Basic movement
    let moveBy = directionFactor.current * speed * (delta / 1000);

    // Add scroll velocity for "warp speed" effect
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative flex overflow-hidden py-6 bg-black border-y border-white/10">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {/* Repeat content enough times to cover screen and allow loop */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-8 mx-4">
            <span className="text-5xl md:text-7xl font-black uppercase text-transparent stroke-text opacity-50">
              {text}
            </span>
            <span className="text-5xl md:text-7xl font-black uppercase text-white">
              {text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
