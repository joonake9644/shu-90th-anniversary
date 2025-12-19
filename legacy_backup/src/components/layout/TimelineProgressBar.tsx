import React from 'react';
import { motion } from "motion/react";
import { Period } from '../../data/timelineData';

interface TimelineProgressBarProps {
  periods: Period[];
  activePeriodId: string;
  onPeriodSelect: (id: string) => void;
}

export function TimelineProgressBar({ periods, activePeriodId, onPeriodSelect }: TimelineProgressBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 px-6">
      <div className="container mx-auto">
        <div className="relative h-12 flex items-center">
          {/* Base Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>

          {/* Periods */}
          <div className="relative w-full flex justify-between items-center">
            {periods.map((period) => {
              const isActive = activePeriodId === period.id;
              
              return (
                <button
                  key={period.id}
                  onClick={() => onPeriodSelect(period.id)}
                  className="relative group flex flex-col items-center focus:outline-none"
                  style={{ width: `${100 / periods.length}%` }}
                >
                  {/* Tick Mark */}
                  <div className={`w-px h-3 mb-2 transition-all duration-300 ${isActive ? 'h-6 bg-white' : 'bg-white/40 group-hover:bg-white/80'}`}></div>
                  
                  {/* Label */}
                  <div className={`text-xs md:text-sm font-medium tracking-wide transition-all duration-300 ${isActive ? 'text-white scale-110 font-bold' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    <span className="block md:inline">{period.yearStart}</span>
                    <span className="hidden md:inline"> ~ {period.yearEnd}</span>
                  </div>
                  
                  {/* Title (Only visible on hover or active) */}
                  <div className={`absolute bottom-10 whitespace-nowrap text-sm font-bold text-white transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {period.title}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Active Indicator (could be animated line, but simplified above for now) */}
        </div>
      </div>
    </div>
  );
}
