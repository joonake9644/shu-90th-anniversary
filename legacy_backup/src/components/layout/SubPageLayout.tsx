import React from 'react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { MenuOverlay } from '../layout/MenuOverlay';

interface SubPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SubPageLayout({ title, subtitle, children }: SubPageLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Header 
        isMenuOpen={isMenuOpen} 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
      />
      
      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      <div className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="mb-20 mt-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </section>

        {children}

      </div>
      
      <Footer />
    </div>
  );
}
