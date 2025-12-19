import React, { useState } from 'react';
import { Menu, Search, Globe, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white">
      {/* Logo Area */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold tracking-tighter">
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
          onClick={onMenuToggle}
          className="hover:opacity-70 transition-opacity relative z-50"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
