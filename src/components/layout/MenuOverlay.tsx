'use client';

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { id: 1, label: "90주년 스토리", sub: "Main Timeline", path: "/history" },
    { id: 2, label: "명장면 90", sub: "Highlights", path: "/highlights" },
    { id: 3, label: "영상으로 보는 90", sub: "Video History", path: "/video-history" },
    { id: 4, label: "숫자로 보는 90", sub: "Statistics", path: "/statistics" },
    { id: 5, label: "역사 갤러리", sub: "Archive", path: "/archive" },
    { id: 6, label: "90주년 기념사업", sub: "Events", path: "/events" },
    { id: 7, label: "90주년 소식", sub: "News", path: "/news" },
    { id: 8, label: "디지털 방명록", sub: "Guestbook", path: "/guestbook" },
];

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-40 bg-black text-white flex flex-col justify-center items-center"
                >
                    <div className="container max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex flex-col justify-center space-y-8">
                            <nav className="flex flex-col space-y-6">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        onClick={onClose}
                                        className="group block relative"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="flex items-center justify-between text-3xl md:text-5xl font-bold tracking-tighter hover:text-gray-400 transition-colors"
                                        >
                                            <span className="whitespace-nowrap">{item.label}</span>
                                            {/* VISIBILITY CHANGE: User requested English next to Korean. 
                        Legacy had 'opacity-0 group-hover:opacity-100'. 
                        I will change to 'opacity-100' or 'opacity-60' to be always visible but subtle. 
                        "한글 옆에 영어로 표기되었었어" -> "It is written in English next to Korean" (past tense implies it was).
                        I will make it visible.
                    */}
                                            <span className="text-sm font-normal text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity ml-4 tracking-normal">
                                                {item.sub}
                                            </span>
                                        </motion.div>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="hidden md:flex flex-col justify-center border-l border-gray-800 pl-12 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">참여하기</h3>
                                <p className="text-gray-400 mb-4 tracking-tight">삼육보건대학교의 90년, 당신의 이야기로 채워주세요.</p>
                                <button className="flex items-center space-x-2 text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all tracking-tight">
                                    <span>사연 보내기</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">발전기금 후원</h3>
                                <p className="text-gray-400 mb-4 tracking-tight">100년을 향한 도약에 힘을 보태주세요.</p>
                                <button className="flex items-center space-x-2 text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all tracking-tight">
                                    <span>후원하기</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
