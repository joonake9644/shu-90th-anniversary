import React from 'react';
import { motion, useScroll, useTransform } from "motion/react";

interface HeroSectionProps {
  containerRef?: React.RefObject<HTMLElement>;
}

export function HeroSection({ containerRef }: HeroSectionProps) {
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax: Image scales down and moves slightly
  // "Deep Parallax" Strategy: Background stays longer (sticky feel) but darkens to merge with next section
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]); // Subtle zoom
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]); // Moves down very slowly (parallax)
  
  // Create a "dissolve" effect into the next black section
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.9]); 
  
  // Text Parallax: Accelerates UP and dissolves
  // This creates a "flying through" feeling
  const textY = useTransform(scrollYProgress, [0, 1], [0, -200]); // Moves up faster
  const bigTextScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.8]); // Expands drastically
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]); // Fades out early
  const contentBlur = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(10px)"]);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Layer */}
      <motion.div 
        style={{ scale, y }}
        className="absolute inset-0 z-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1730307403182-46906ab72173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaGlzdG9yeSUyMG9sZCUyMGJ1aWxkaW5nJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NjU3ODkxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center grayscale opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        {/* Dynamic Darkening Overlay for seamless transition */}
        <motion.div 
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black" 
        />
        
        {/* CSS Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // smooth ease
          style={{ y: textY, opacity: contentOpacity, filter: contentBlur }}
        >
            <motion.div 
                className="inline-block overflow-hidden mb-6"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            >
                <span className="block py-2 px-6 border border-white/30 rounded-full text-sm tracking-[0.3em] backdrop-blur-md whitespace-nowrap">
                    THE 90TH ANNIVERSARY
                </span>
            </motion.div>

            <motion.div 
                style={{ scale: bigTextScale }}
                className="flex items-baseline justify-center mb-4 leading-[0.85] mix-blend-overlay"
            >
                <span className="text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter">
                  90
                </span>
                <span className="text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter ml-4 italic font-light">
                  YEARS
                </span>
            </motion.div>
            
            <div>
                <h2 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-4 text-gray-300">
                    Of History
                </h2>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-lg md:text-2xl font-medium tracking-[0.3em] uppercase mb-8 text-white/80"
                >
                    Sahmyook Health University
                </motion.div>

                <motion.p 
                    className="max-w-xl mx-auto text-lg text-gray-400 font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    삼육보건대학교 90주년, <br/>
                    진심의 교육으로 세상을 치유해온 시간
                </motion.p>
            </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-70">Scroll to Explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white via-white/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}