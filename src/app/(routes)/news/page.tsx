'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import { subscribeNewsletter } from '@/lib/firestore/newsletter';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author: string;
}

// 임시 뉴스 데이터
const newsData: NewsArticle[] = [
  {
    id: 'n1',
    title: '90주년 기념 의료 연구센터 착공식 개최',
    excerpt: '미래 의료 과학의 중심이 될 최첨단 연구 시설 건립 시작',
    content: '삼육보건대학교는 90주년을 기념하여 총 500억원 규모의 의료 연구센터 착공식을 가졌습니다. 이 시설은 2027년 완공 예정이며, 첨단 의료 기기와 연구 장비를 갖추게 됩니다.',
    date: '2025-12-15',
    category: '시설',
    image: 'https://images.unsplash.com/photo-1689459448455-928ff1f65621?w=800',
    author: '홍보팀',
  },
  {
    id: 'n2',
    title: '글로벌 의료 교육 협력 MOU 체결',
    excerpt: '미국 하버드 의대와 공동 연구 및 교류 프로그램 시작',
    content: '세계 최고 수준의 의료 교육 기관들과의 협력을 통해 우리 대학의 글로벌 경쟁력을 더욱 강화하게 되었습니다.',
    date: '2025-12-10',
    category: '협약',
    image: 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?w=800',
    author: '국제교류팀',
  },
  {
    id: 'n3',
    title: 'WCC 재선정, 세계적 수준 유지',
    excerpt: '3년 연속 세계적 수준의 전문대학(WCC)으로 선정',
    content: '교육부가 주관하는 WCC 평가에서 우수한 성적을 거두며 3년 연속 선정되는 쾌거를 이루었습니다.',
    date: '2025-12-05',
    category: '수상',
    image: 'https://images.unsplash.com/photo-1710616836472-ff86042cd881?w=800',
    author: '기획처',
  },
  {
    id: 'n4',
    title: '90주년 기념 장학금 30억 조성',
    excerpt: '동문들의 기부로 미래 인재 육성을 위한 장학 기금 마련',
    content: '졸업 동문들의 뜻깊은 기부로 90주년 기념 장학 기금 30억원이 조성되었으며, 매년 100명 이상의 학생들이 장학 혜택을 받게 됩니다.',
    date: '2025-11-28',
    category: '장학',
    image: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=800',
    author: '장학팀',
  },
  {
    id: 'n5',
    title: 'AI 기반 스마트 캠퍼스 구축 완료',
    excerpt: '첨단 기술로 학생들의 편의성과 안전성 대폭 향상',
    content: '인공지능과 IoT 기술을 활용한 스마트 캠퍼스 시스템이 전면 도입되어 학습 환경이 획기적으로 개선되었습니다.',
    date: '2025-11-20',
    category: '기술',
    image: 'https://images.unsplash.com/photo-1758270705172-07b53627dfcb?w=800',
    author: '정보처',
  },
  {
    id: 'n6',
    title: '취업률 95% 달성, 전국 1위',
    excerpt: '보건 계열 전문대학 중 최고 취업률 기록',
    content: '2025학년도 졸업생의 취업률이 95%를 돌파하며 전국 보건 계열 전문대학 중 1위를 차지했습니다.',
    date: '2025-11-15',
    category: '성과',
    image: 'https://images.unsplash.com/photo-1763615834709-cd4b196980db?w=800',
    author: '취업지원센터',
  },
];

const categories = ['전체', '시설', '협약', '수상', '장학', '기술', '성과'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const filteredNews =
    selectedCategory === '전체'
      ? newsData
      : newsData.filter((news) => news.category === selectedCategory);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubscribeMessage({
        type: 'error',
        text: '이메일을 입력해주세요.',
      });
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage(null);

    const result = await subscribeNewsletter(email);

    setSubscribeMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });

    if (result.success) {
      setEmail('');
    }

    setIsSubscribing(false);

    // 3초 후 메시지 제거
    setTimeout(() => {
      setSubscribeMessage(null);
    }, 3000);
  };

  return (
    <SubPageLayout
      title="90주년 소식"
      subtitle="삼육보건대학교의 최신 소식과 성과를 전합니다. Latest news and achievements."
    >
      {/* Category Filter */}
      <section className="mb-16">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="mb-20">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((article, index) => (
              <NewsCard
                key={article.id}
                article={article}
                index={index}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">선택한 카테고리에 소식이 없습니다.</p>
          </motion.div>
        )}
      </section>

      {/* Article Modal */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />

      {/* Newsletter */}
      <section className="py-16 bg-white/5 rounded-2xl border border-white/10 text-center mb-20">
        <h2 className="text-3xl font-bold text-white mb-4">뉴스레터 구독</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          최신 소식과 행사 안내를 이메일로 받아보세요
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto px-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            disabled={isSubscribing}
            className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isSubscribing}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {isSubscribing ? '처리 중...' : '구독하기'}
          </button>
        </form>
        {subscribeMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm ${
              subscribeMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {subscribeMessage.text}
          </motion.p>
        )}
      </section>

      {/* Closing Message */}
      <section className="text-center py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-light text-white/80 mb-6 tracking-tight">
            함께 만들어가는 내일
          </p>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            오늘의 소식이 내일의 역사가 됩니다.
          </p>
        </motion.div>
      </section>
    </SubPageLayout>
  );
}

// News Card Component
function NewsCard({
  article,
  index,
  onClick,
}: {
  article: NewsArticle;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-black">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale'
          }`}
        />

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-amber-500/90 px-3 py-1 rounded-full">
          <span className="text-black font-bold text-xs">{article.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(article.date).toLocaleDateString('ko-KR')}
          </span>
          <span>•</span>
          <span>{article.author}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 text-white/70 group-hover:text-amber-500 transition-colors text-sm font-medium">
          <span>자세히 보기</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.article>
  );
}

// Article Modal Component
function ArticleModal({
  article,
  onClose,
}: {
  article: NewsArticle | null;
  onClose: () => void;
}) {
  if (!article) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.article
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-3xl w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden my-8"
        >
          {/* Image */}
          <div className="relative h-80">
            <Image src={article.image} alt={article.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-6 left-6 bg-amber-500/90 px-4 py-1.5 rounded-full">
              <span className="text-black font-bold text-sm">{article.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(article.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tag size={14} />
                {article.author}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">{article.excerpt}</p>

            <div className="border-t border-white/10 pt-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  );
}
