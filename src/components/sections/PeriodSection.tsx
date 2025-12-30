import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import type { PeriodWithHighlights } from '@/lib/firestore/public/periods';
import { HighlightCard } from '../ui/HighlightCard';
import { TextReveal } from '../ui/TextReveal';

interface PeriodSectionProps {
  period: PeriodWithHighlights;
  onInView: (id: string) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

// 성능 최적화: memo로 불필요한 리렌더링 방지
const PeriodSectionComponent = ({ period, onInView, containerRef }: PeriodSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5 });
  
  // Mouse interaction state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  // Notify parent when this section is dominant
  useEffect(() => {
    if (isInView) {
      onInView(period.id);
    }
  }, [isInView, period.id, onInView]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    setMousePosition({ x, y });
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  // Background moves slower than content
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]); // Zoom out effect
  
  // Content Parallax
  const contentY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const yearX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Mouse parallax springs for smooth movement
  const mouseXSpring = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseYSpring = useSpring(0, { stiffness: 50, damping: 20 });

  // Pre-calculate inverse transforms
  const mouseXInverse = useTransform(mouseXSpring, (x) => x * -1);
  const mouseYInverse = useTransform(mouseYSpring, (y) => y * -1);
  const mouseXDecorative = useTransform(mouseXSpring, (x) => x * -2);
  const mouseYDecorative = useTransform(mouseYSpring, (y) => y * -2);

  useEffect(() => {
    mouseXSpring.set(mousePosition.x * 20); // Max 20px movement
    mouseYSpring.set(mousePosition.y * 20);
  }, [mousePosition, mouseXSpring, mouseYSpring]);

  return (
    <section 
      id={period.id} 
      ref={sectionRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white perspective-1000"
      onMouseMove={handleMouseMove}
    >
      {/* Background with Parallax and Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 bg-cover bg-center"
        >
             <div 
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url(${period.heroMedia})` }}
             />
        </motion.div>
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-6 py-20 flex flex-col items-center justify-center h-full">
        <motion.div 
          style={{ y: contentY, opacity: contentOpacity }}
          className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left: Typography / Text Area (5 cols) */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left relative z-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="overflow-hidden mb-4">
                  <motion.h2 
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xl md:text-2xl font-light text-gray-300 tracking-[0.2em] uppercase"
                  >
                    {period.rangeLabel}
                  </motion.h2>
              </div>

              <div className="relative mb-8">
                 <motion.h1 
                    style={{ x: yearX }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500"
                 >
                    {period.yearStart}
                 </motion.h1>
                 <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                    className="h-1 w-full bg-white origin-left mt-2"
                 />
              </div>

              <TextReveal className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {period.title}
              </TextReveal>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-gray-400 font-light leading-relaxed whitespace-pre-line"
              >
                {period.subtitle}
              </motion.p>
            </motion.div>
          </div>

          {/* Right: Interactive Highlight Cards (7 cols) */}
          <div className="lg:col-span-7 relative h-[500px] w-full perspective-1000">
             {/* Floating Cards with Mouse Parallax */}
             {period.highlights.map((highlight, idx) => {
               // Calculate random positions or specific layouts based on index
               const isEven = idx % 2 === 0;
               const isActive = activeCardId === highlight.id;
               const isAnyActive = activeCardId !== null;
               
               // Dynamic positioning: If active, center it. If not, use default positions.
               // Actually, to "move to front", we can just swap Z-index and scale up, 
               // keeping position relative but maybe adjusting translation.
               
               const positionClass = isEven 
                 ? 'top-10 left-0 lg:left-10' 
                 : 'bottom-10 right-0 lg:right-10';
               
               return (
                 <motion.div
                   key={highlight.id}
                   layoutId={`card-${highlight.id}`} // layoutId helps with smooth layout transitions if structure changes
                   onClick={() => setActiveCardId(isActive ? null : highlight.id)}
                   className={`absolute ${positionClass} w-72 md:w-96 cursor-pointer`}
                   initial={{ opacity: 0, y: 100, rotate: isEven ? -5 : 5 }}
                   whileInView={{ opacity: 1, y: 0, rotate: isEven ? -2 : 2 }}
                   animate={{
                     zIndex: isActive ? 50 : (idx * 10), // Active gets top z-index
                     scale: isActive ? 1.1 : (isAnyActive ? 0.9 : 1), // Active scales up, others scale down
                     filter: isAnyActive && !isActive ? 'blur(2px) brightness(0.7)' : 'none', // Focus effect
                     rotate: isActive ? 0 : (isEven ? -2 : 2), // Straighten if active
                   }}
                   transition={{ 
                     duration: 0.6,
                     type: "spring",
                     stiffness: 200,
                     damping: 20
                   }}
                   style={{
                     x: isEven ? mouseXSpring : mouseXInverse,
                     y: isEven ? mouseYSpring : mouseYInverse,
                   }}
                 >
                   <HighlightCard highlight={highlight} />
                 </motion.div>
               );
             })}
             
             {/* Decorative Elements */}
             <motion.div
                style={{
                    x: mouseXDecorative,
                    y: mouseYDecorative,
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" 
             />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// React.memo로 최적화된 컴포넌트 export
export const PeriodSection = memo(PeriodSectionComponent);

// default export로 lazy loading 지원
export default PeriodSection;
