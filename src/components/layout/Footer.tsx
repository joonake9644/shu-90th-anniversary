'use client';

import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import { getPublicFooterContent } from '@/lib/firestore/public/footer';
import type { HomepageFooter } from '@/lib/firestore/admin/footer';

// Fallback 데이터 (Firestore 오류 시 사용)
const fallbackFooter: HomepageFooter = {
  id: 'main',
  brandName: 'SHU 90th',
  slogan: 'Truth · Love · Service',
  description: 'Celebrating 90 years of excellence in health education.\nPreparing for the next century of innovation and service.',
  socialLinks: {
    instagram: 'https://www.instagram.com/shu_university/',
    facebook: 'https://www.facebook.com/sahmyookhealth',
    youtube: 'https://www.youtube.com/@SHU_Official'
  },
  quickLinks: [
    { label: 'History 1936-2026', href: '#' },
    { label: 'Vision 2030', href: '#' },
    { label: 'Campus Map', href: '#' },
    { label: 'Anniversary Events', href: '#' }
  ],
  contact: {
    address: '82 Mangu-ro, Dongdaemun-gu,\nSeoul, Republic of Korea',
    phone: '+82-2212-0082',
    email: 'admin@shu.ac.kr'
  },
  copyrightText: 'Sahmyook Health University. All rights reserved.',
  privacyPolicyUrl: '#',
  termsOfServiceUrl: '#'
};

export function Footer() {
    const currentYear = new Date().getFullYear();

    // CMS 콘텐츠 상태
    const [footer, setFooter] = useState<HomepageFooter>(fallbackFooter);
    const [loading, setLoading] = useState(true);

    // Firestore에서 콘텐츠 로드
    useEffect(() => {
        const loadFooter = async () => {
            try {
                const data = await getPublicFooterContent();
                if (data) {
                    setFooter(data);
                }
            } catch (error) {
                console.error('Error loading footer content:', error);
                // Fallback 데이터 사용
            } finally {
                setLoading(false);
            }
        };

        loadFooter();
    }, []);

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
                                {footer.brandName}
                            </h2>
                            <p className="text-sm font-medium tracking-widest text-blue-400 uppercase">
                                {footer.slogan}
                            </p>
                        </div>
                        <p className="text-zinc-400 leading-relaxed max-w-sm whitespace-pre-line">
                            {footer.description}
                        </p>

                        {/* Social Icons (Vector) */}
                        <div className="flex items-center gap-4 pt-4">
                            <SocialLink href={footer.socialLinks.instagram} icon={<Instagram size={20} />} label="Instagram" />
                            <SocialLink href={footer.socialLinks.facebook} icon={<Facebook size={20} />} label="Facebook" />
                            <SocialLink href={footer.socialLinks.youtube} icon={<Youtube size={20} />} label="Youtube" />
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="md:col-span-3 lg:col-span-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Explore</h3>
                        <ul className="space-y-4">
                            {footer.quickLinks.map((link, index) => (
                                <FooterLink key={index} href={link.href}>{link.label}</FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Contact</h3>
                        <div className="space-y-4 text-zinc-400">
                            <div className="group flex flex-col gap-1">
                                <span className="text-xs text-zinc-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Address</span>
                                <p className="hover:text-white transition-colors whitespace-pre-line">
                                    {footer.contact.address}
                                </p>
                            </div>

                            <div className="group flex flex-col gap-1">
                                <span className="text-xs text-zinc-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Tel</span>
                                <p className="hover:text-white transition-colors font-mono">
                                    {footer.contact.phone}
                                </p>
                            </div>

                            <div className="group flex flex-col gap-1">
                                <span className="text-xs text-zinc-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Email</span>
                                <p className="hover:text-white transition-colors">
                                    {footer.contact.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>© {currentYear} {footer.copyrightText}</p>
                    <div className="flex items-center gap-6">
                        <a href={footer.privacyPolicyUrl} className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href={footer.termsOfServiceUrl} className="hover:text-white transition-colors">Terms of Service</a>
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
