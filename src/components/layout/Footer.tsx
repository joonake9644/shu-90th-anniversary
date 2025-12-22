'use client';

import React from 'react';
import { Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
// import { motion } from 'motion/react'; // Not strictly needed for the static footer parts, keeping it simple.

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-950 border-t border-white/10 relative overflow-hidden text-white">
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="container mx-auto px-6 py-20 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

                    {/* Brand Column */}
                    <div className="md:col-span-5 lg:col-span-4 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">
                                SHU 90th
                            </h2>
                            <p className="text-sm font-medium tracking-widest text-blue-400 uppercase">
                                Truth · Love · Service
                            </p>
                        </div>
                        <p className="text-zinc-400 leading-relaxed max-w-sm">
                            Celebrating 90 years of excellence in health education.
                            Preparing for the next century of innovation and service.
                        </p>

                        {/* Social Icons (Vector) */}
                        <div className="flex items-center gap-4 pt-4">
                            <SocialLink href="https://www.instagram.com/shu_university/" icon={<Instagram size={20} />} label="Instagram" />
                            <SocialLink href="https://www.facebook.com/sahmyookhealth" icon={<Facebook size={20} />} label="Facebook" />
                            <SocialLink href="https://www.youtube.com/@SHU_Official" icon={<Youtube size={20} />} label="Youtube" />
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="md:col-span-3 lg:col-span-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <FooterLink href="#">History 1936-2026</FooterLink>
                            <FooterLink href="#">Vision 2030</FooterLink>
                            <FooterLink href="#">Campus Map</FooterLink>
                            <FooterLink href="#">Anniversary Events</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Contact</h3>
                        <div className="space-y-4 text-zinc-400">
                            <div className="group flex flex-col gap-1">
                                <span className="text-xs text-zinc-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Address</span>
                                <p className="hover:text-white transition-colors">
                                    82 Mangu-ro, Dongdaemun-gu,<br />Seoul, Republic of Korea
                                </p>
                            </div>

                            <div className="group flex flex-col gap-1">
                                <span className="text-xs text-zinc-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Tel</span>
                                <p className="hover:text-white transition-colors font-mono">
                                    +82-2212-0082
                                </p>
                            </div>

                            <div className="group flex flex-col gap-1">
                                <span className="text-xs text-zinc-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Email</span>
                                <p className="hover:text-white transition-colors">
                                    admin@shu.ac.kr
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>© {currentYear} Sahmyook Health University. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <a
                href={href}
                className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
                <span>{children}</span>
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
        </li>
    );
}
