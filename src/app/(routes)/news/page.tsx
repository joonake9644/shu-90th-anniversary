'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import { subscribeNewsletter } from '@/lib/firestore/newsletter';
import { getPublicNews } from '@/lib/firestore/public/news';
import type { NewsArticle as FirestoreNewsArticle } from '@/types/firestore';
import { Timestamp } from 'firebase/firestore';

interface NewsArticleDisplay {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author: string;
}

const categoryLabels: Record<string, string> = {
  'all': '전체',
  'anniversary': '90주년',
  'achievement': '성과',
  'event': '행사',
  'general': '일반',
};

const categories = ['all', 'anniversary', 'achievement', 'event', 'general'];

// Helper: Firestore NewsArticle → Display NewsArticle
function convertNewsArticle(article: FirestoreNewsArticle): NewsArticleDisplay {
  const publishedAt = article.publishedAt instanceof Timestamp
    ? article.publishedAt.toDate()
    : new Date();

  return {
    id: article.id,
    title: article.title,
    excerpt: article.summary,
    content: article.content,
    date: publishedAt.toISOString().split('T')[0],
    category: article.category,
    image: article.thumbnail || 'https://images.unsplash.com/photo-1689858210110-03f1e91f8c69?w=800',
    author: article.author,
  };
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticleDisplay | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [newsData, setNewsData] = useState<NewsArticleDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // Load news from Firestore
  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await getPublicNews();
        const displayData = data.map(convertNewsArticle);
        setNewsData(displayData);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const filteredNews =
    selectedCategory === 'all'
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
              {categoryLabels[category]}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">뉴스를 불러오는 중...</p>
        </div>
      )}

      {/* News Grid */}
      {!loading && (
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
      )}

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
  article: NewsArticleDisplay;
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
          <span className="text-black font-bold text-xs">{categoryLabels[article.category] || article.category}</span>
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
  article: NewsArticleDisplay | null;
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
              <span className="text-black font-bold text-sm">{categoryLabels[article.category] || article.category}</span>
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
