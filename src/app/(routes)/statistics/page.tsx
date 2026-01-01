'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { useInView } from 'framer-motion';
import { getPublicStatisticsData } from '@/lib/firestore/public/statistics';
import type { StatisticsData } from '@/lib/firestore/admin/statistics';

// Fallback 데이터
const fallbackData: StatisticsData = {
  stats: [
    { id: 'years', number: 90, suffix: '년', label: 'Years of Excellence', description: '1936년부터 현재까지', order: 1, enabled: true },
    { id: 'alumni', number: 50000, suffix: '+', label: 'Proud Alumni', description: '전 세계로 뻗어나간 동문', order: 2, enabled: true },
    { id: 'partners', number: 120, suffix: '+', label: 'Global Partners', description: '협력 대학 및 기관', order: 3, enabled: true },
    { id: 'services', number: 1500, suffix: '+', label: 'Community Services', description: '지역사회 의료 봉사', order: 4, enabled: true },
  ],
  milestones: [
    { year: 1936, students: 30, label: '개교' },
    { year: 1948, students: 100, label: '전문학교 승격' },
    { year: 1979, students: 500, label: '전문대학 승격' },
    { year: 1998, students: 1200, label: '종합 보건대학' },
    { year: 2013, students: 3000, label: 'WCC 선정' },
    { year: 2026, students: 4500, label: '90주년' },
  ],
  detailStats: [
    { id: 'departments', number: 15, suffix: '개', label: '학과 및 전공', items: ['간호학과', '치위생과', '물리치료과', '방사선과', '임상병리과', '...외 10개'] },
    { id: 'employment', number: 95, suffix: '%', label: '취업률', items: ['전문대학 최상위권', '보건 계열 1위', '산학협력 우수'] },
    { id: 'countries', number: 20, suffix: '개국', label: '해외 교류국', items: ['미국', '일본', '중국', '필리핀', '태국', '...외 15개국'] },
    { id: 'scholarship', number: 30, suffix: '억원', label: '연간 장학금', items: ['성적 우수 장학금', '생활비 지원', '해외 연수 지원'] },
    { id: 'dormitory', number: 500, suffix: '석', label: '기숙사 수용 인원', items: ['최신 시설', '쾌적한 환경', '24시간 관리'] },
    { id: 'partnerships', number: 100, suffix: '개', label: '산학협력 기업', items: ['대형 병원', '의료 기관', '연구소', '기업체'] },
  ],
  research: {
    papers: 200,
    projects: 50,
    investment: 10,
  },
};

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getPublicStatisticsData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
        // fallback 데이터 사용
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <SubPageLayout
      title="숫자로 보는 90년"
      subtitle="90년의 여정을 숫자로 되돌아봅니다. Our 90-year journey in numbers."
    >
      {/* Hero Stats */}
      <section className="mb-32">
        {loading ? (
          <div className="text-center text-gray-400">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.stats.map((stat) => (
              <BigStatCard
                key={stat.id}
                number={stat.number}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
              />
            ))}
          </div>
        )}
      </section>

      {/* Timeline Growth */}
      <section className="mb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            90년의 성장
          </h2>
          <p className="text-gray-400 text-lg">
            작은 간호원 양성소에서 세계적 수준의 보건 대학으로
          </p>
        </motion.div>

        <TimelineGrowth />
      </section>

      {/* Detailed Stats Grid */}
      <section className="mb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            주요 성과
          </h2>
          <p className="text-gray-400 text-lg">
            삼육보건대학교가 걸어온 자랑스러운 발자취
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.detailStats.map((stat) => (
            <StatDetailCard
              key={stat.id}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              items={stat.items}
            />
          ))}
        </div>
      </section>

      {/* Research & Innovation */}
      <section className="mb-32">
        <div className="bg-white/5 rounded-2xl p-12 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <AnimatedNumber value={data.research.papers} suffix="+" className="text-5xl font-bold text-amber-500 mb-4" />
              <p className="text-gray-400">연간 연구 논문</p>
            </div>
            <div className="text-center">
              <AnimatedNumber value={data.research.projects} suffix="개" className="text-5xl font-bold text-amber-500 mb-4" />
              <p className="text-gray-400">진행 중인 연구 프로젝트</p>
            </div>
            <div className="text-center">
              <AnimatedNumber value={data.research.investment} suffix="억원" className="text-5xl font-bold text-amber-500 mb-4" />
              <p className="text-gray-400">연구 개발 투자</p>
            </div>
          </div>
        </div>
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
            숫자 너머의 이야기
          </p>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            이 숫자들은 단순한 통계가 아닙니다.
            각각의 숫자 뒤에는 학생들의 꿈과 도전,
            교수님들의 열정, 그리고 동문들의 헌신이 담겨 있습니다.
          </p>
        </motion.div>
      </section>
    </SubPageLayout>
  );
}

// Big Stat Card with Count-up Animation
function BigStatCard({
  number,
  suffix,
  label,
  description,
}: {
  number: number;
  suffix: string;
  label: string;
  description: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  // 모바일 최적화: margin을 0으로 설정하여 즉시 애니메이션 시작
  const isInView = useInView(ref, { once: true, margin: '0px', amount: 0.3 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      // 애니메이션 시간 80% 단축: 2초 → 0.4초
      const animation = animate(count, number, {
        duration: 0.4,
        ease: 'easeOut',
      });

      const unsubscribe = rounded.on('change', (latest) => {
        setDisplayValue(latest);
      });

      return () => {
        animation.stop();
        unsubscribe();
      };
    }
  }, [isInView, number, count, rounded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 hover:border-amber-500/50 transition-all duration-500 h-full flex flex-col justify-between">
        {/* 숫자 크기 조정: 박스에 맞게 반응형 크기 설정 */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-3 font-mono leading-none whitespace-nowrap">
          <span className="inline-block">{displayValue.toLocaleString()}</span>
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl align-top">{suffix}</span>
        </div>
        <div>
          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest mb-2">
            {label}
          </div>
          <div className="text-xs text-gray-600">{description}</div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-amber-500/10 to-transparent" />
      </div>
    </motion.div>
  );
}

// Timeline Growth Visualization
function TimelineGrowth() {
  const [milestones, setMilestones] = useState(fallbackData.milestones);

  useEffect(() => {
    const loadData = async () => {
      const result = await getPublicStatisticsData();
      if (result) {
        setMilestones(result.milestones);
      }
    };
    loadData();
  }, []);

  return (
    <div className="relative">
      {/* Timeline Bar */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center"
          >
            {/* Dot */}
            <div className="w-4 h-4 bg-amber-500 rounded-full mx-auto mb-4 relative z-10 shadow-lg shadow-amber-500/50" />

            {/* Year */}
            <div className="text-2xl font-bold text-white mb-2 font-mono">
              {milestone.year}
            </div>

            {/* Students Count */}
            <div className="text-3xl font-bold text-amber-500 mb-1">
              {milestone.students.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">재학생</div>

            {/* Label */}
            <div className="mt-3 text-sm text-gray-400">{milestone.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Stat Detail Card
function StatDetailCard({
  number,
  suffix,
  label,
  items,
}: {
  number: number;
  suffix: string;
  label: string;
  items: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <AnimatedNumber
        value={number}
        suffix={suffix}
        className="text-4xl font-bold text-amber-500 mb-3 font-mono"
      />
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-start">
            <span className="text-amber-500/50 mr-2">•</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Animated Number Component
function AnimatedNumber({
  value,
  suffix = '',
  className = '',
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  // 모바일 최적화: margin을 0으로 설정하여 즉시 애니메이션 시작
  const isInView = useInView(ref, { once: true, margin: '0px', amount: 0.3 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      // 애니메이션 시간 80% 단축: 1.5초 → 0.3초
      const animation = animate(count, value, {
        duration: 0.3,
        ease: 'easeOut',
      });

      const unsubscribe = rounded.on('change', (latest) => {
        setDisplayValue(latest);
      });

      return () => {
        animation.stop();
        unsubscribe();
      };
    }
  }, [isInView, value, count, rounded]);

  return (
    <div ref={ref} className={className}>
      {displayValue.toLocaleString()}
      {suffix}
    </div>
  );
}
