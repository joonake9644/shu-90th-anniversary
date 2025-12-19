import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Header } from '../layout/Header';
import { MenuOverlay } from '../layout/MenuOverlay';
import { TimelineProgressBar } from '../layout/TimelineProgressBar';
import { HeroSection } from '../sections/HeroSection';
import { TimelineIntro } from '../sections/TimelineIntro';
import HistoryStory from '../sections/HistoryStory'; // Default import
import { Footer } from '../layout/Footer';
import { PeriodSection } from '../sections/PeriodSection';
import { MarqueeSection } from '../sections/MarqueeSection';
import { timelineData } from '../../data/timelineData';

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePeriodId, setActivePeriodId] = useState<string>(timelineData[0].id);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    // Note: In a routed environment, we might want to lift Lenis to App.tsx or use a layout wrapper.
    // For now, keeping it here to preserve original behavior as requested.
    const lenis = new Lenis({
      duration: 2.0, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle scroll restoration and initial scroll
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(timer);
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handlePeriodSelect = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActivePeriodId(id);
  };

  const handlePeriodInView = (id: string) => {
    setActivePeriodId(id);
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black overflow-x-hidden">
      <Header 
        isMenuOpen={isMenuOpen} 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
      />
      
      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* Hero */}
      <div>
        <HeroSection />
      </div>

      {/* Intro Transition to Timeline */}
      <TimelineIntro />

      {/* 90th Anniversary Story (Epic Scrollytelling) */}
      <HistoryStory />

      {/* Moving Text Divider */}
      <div>
        <MarqueeSection text="TRUTH · LOVE · SERVICE · 90TH ANNIVERSARY · " direction="left" speed={1.2} />
      </div>

      {/* Timeline Sections */}
      <div className="relative">
        {timelineData.map((period, index) => (
          <div key={period.id}>
            <React.Fragment>
              <PeriodSection 
                period={period} 
                onInView={handlePeriodInView}
              />
              {/* Add Marquee between sections occasionally */}
              {index === 1 && (
                <div>
                 <MarqueeSection text="GLOBAL SHU · HEALTH EXPERTS · " direction="right" speed={2.5} />
                </div>
              )}
               {index === 3 && (
                 <div>
                 <MarqueeSection text="VISION 2030 · INNOVATION · " direction="left" speed={2} />
                 </div>
              )}
            </React.Fragment>
          </div>
        ))}
      </div>

      {/* Footer / Contact (Detailed) */}
      <Footer />

      <TimelineProgressBar 
        periods={timelineData} 
        activePeriodId={activePeriodId} 
        onPeriodSelect={handlePeriodSelect}
      />
      
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        .stroke-text-thin {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
        }
        
        /* Lenis Recommended CSS */
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-scrolling iframe {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
