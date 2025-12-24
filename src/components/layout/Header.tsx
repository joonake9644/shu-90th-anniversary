'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { MenuOverlay } from './MenuOverlay';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white">
                {/* Logo Area */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        SHU 90th
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-6">
                    <button className="hidden md:flex items-center space-x-1 hover:opacity-70 transition-opacity">
                        <span className="text-sm font-medium">KR</span>
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                        <Search size={24} />
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="hover:opacity-70 transition-opacity relative z-50"
                        aria-label="Menu"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </header>

            {/* Menu Overlay Component */}
            <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Floating X Button for Menu - Actually MenuOverlay usually handles closing via X, 
          but Header has the button. 
          Let's look at legacy Header. It has logic: {isMenuOpen ? <X/> : <Menu/>} 
          AND calls onMenuToggle.
          The MenuOverlay *itself* doesn't have a close button in legacy code (it uses local nav or implicit close?).
          Wait, legacy Header logic:
             <button onClick={onMenuToggle}> {isMenuOpen ? <X/> : <Menu/>} </button>
          And MenuOverlay covers the screen.
          
          In legacy, MenuOverlay is rendered where? App.tsx? No.
          It's likely rendered alongside Header in a Layout component or App.tsx in legacy.
          
          Here, I'll allow Header to manage the state internally or pass it up?
          It's easier to manage internally locally since Layout wraps everything.
          
          Modified Logic:
          - Header manages `isMenuOpen` state.
          - If open, the standard Header button shows X.
          - BUT the MenuOverlay covers the header? 
          - Legacy MenuOverlay css: `fixed inset-0 z-40`. Header is `z-50`.
          - So Header stays on TOP.
      */}

            {/* Re-implementing the Menu Button logic to match legacy exactly */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white pointer-events-none">
                {/* pointer-events-none for wrapper, auto for children to let clicks through but not block overlay? 
              Actually no, z-50 is fine.
          */}
            </header>

            {/* Re-correction: Just render logic cleanly. */}
        </>
    );
}

// Redefining proper export
export function GlobalHeader() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 현재 경로가 /admin으로 시작하면 헤더를 표시하지 않음
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        SHU 90th
                    </Link>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="hidden md:flex items-center space-x-1 hover:opacity-70 transition-opacity">
                        <span className="text-sm font-medium">KR</span>
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                        <Search size={24} />
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="hover:opacity-70 transition-opacity relative z-50"
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    )
}
