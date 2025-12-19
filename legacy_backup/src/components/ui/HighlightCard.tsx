import React from 'react';
import { motion } from "motion/react";
import { Plus, ArrowUpRight } from 'lucide-react';
import { Highlight } from '../../data/timelineData';

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <motion.div 
      className="group relative cursor-pointer"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* Card Container with Tilt Effect Simulation via CSS transform in parent or here? 
          Actually, simple scale/lift is safer for performance. 
      */}
      <div className="relative overflow-hidden aspect-[4/3] rounded-lg bg-gray-900 shadow-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-500">
        <motion.div
          className="w-full h-full"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.1 }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }} // smooth ease
        >
             <img 
              src={highlight.thumb} 
              alt={highlight.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
             <div className="flex items-start justify-between">
                <div>
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-white text-black mb-2 rounded-full">
                        {highlight.year}
                    </span>
                    <h4 className="text-xl font-bold leading-tight text-white mb-2 group-hover:text-white transition-colors">
                    {highlight.title}
                    </h4>
                </div>
                <motion.div 
                    variants={{
                        rest: { opacity: 0, x: -10, y: 10 },
                        hover: { opacity: 1, x: 0, y: 0 }
                    }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-full p-2 text-black"
                >
                    <ArrowUpRight size={20} />
                </motion.div>
             </div>
             
             <motion.p 
                className="text-sm text-gray-300 line-clamp-2 mt-2"
                variants={{
                    rest: { height: 0, opacity: 0, marginTop: 0 },
                    hover: { height: 'auto', opacity: 1, marginTop: 8 }
                }}
             >
                {highlight.description}
             </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
