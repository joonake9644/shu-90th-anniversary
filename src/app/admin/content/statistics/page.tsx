'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ADMIN_ROUTES } from '@/lib/constants/routes';
import {
  getStatisticsData,
  updateStatisticsData,
  type StatisticsData,
  type StatItem,
  type TimelineMilestone,
  type DetailStat,
} from '@/lib/firestore/admin/statistics';

export default function StatisticsManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ADMIN_ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getStatisticsData();
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setMessage({ type: 'error', text: '통계 데이터를 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setMessage(null);
      await updateStatisticsData(data);
      setMessage({ type: 'success', text: '저장되었습니다!' });
      await loadData();
    } catch (error) {
      console.error('Failed to save statistics:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index: number, field: keyof StatItem, value: any) => {
    if (!data) return;
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };

  const updateMilestone = (index: number, field: keyof TimelineMilestone, value: any) => {
    if (!data) return;
    const newMilestones = [...data.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setData({ ...data, milestones: newMilestones });
  };

  const updateDetailStat = (index: number, field: keyof DetailStat, value: any) => {
    if (!data) return;
    const newDetailStats = [...data.detailStats];
    newDetailStats[index] = { ...newDetailStats[index], [field]: value };
    setData({ ...data, detailStats: newDetailStats });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">데이터 로딩 중...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">통계 데이터 없음</h1>
          <p className="text-gray-400 mb-4">
            Setup 페이지에서 초기 데이터를 생성해주세요.
          </p>
          <Link
            href="/admin/content/setup"
            className="px-4 py-2 bg-amber-500 text-black rounded-lg inline-block"
          >
            Setup 페이지로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-500">통계 관리</h1>
              <p className="text-sm text-gray-400 mt-1">
                숫자로 보는 90년 페이지의 통계 데이터를 관리합니다
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={ADMIN_ROUTES.DASHBOARD}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                대시보드로
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700"
              >
                {saving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Hero Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Hero Stats (4개)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.stats.map((stat, index) => (
              <div
                key={stat.id}
                className="bg-gray-900 border border-white/10 rounded-lg p-6"
              >
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">숫자</label>
                  <input
                    type="number"
                    value={stat.number}
                    onChange={(e) => updateStat(index, 'number', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">접미사</label>
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Label (영문)</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">설명</label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => updateStat(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={stat.enabled}
                    onChange={(e) => updateStat(index, 'enabled', e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-400">활성화</label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Milestones */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Timeline Milestones (6개)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-white/10 rounded-lg p-6"
              >
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">연도</label>
                  <input
                    type="number"
                    value={milestone.year}
                    onChange={(e) => updateMilestone(index, 'year', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">재학생 수</label>
                  <input
                    type="number"
                    value={milestone.students}
                    onChange={(e) => updateMilestone(index, 'students', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">라벨</label>
                  <input
                    type="text"
                    value={milestone.label}
                    onChange={(e) => updateMilestone(index, 'label', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research Data */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">연구 & 혁신</h2>
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  연간 연구 논문 수
                </label>
                <input
                  type="number"
                  value={data.research.papers}
                  onChange={(e) =>
                    setData({
                      ...data,
                      research: { ...data.research, papers: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  진행 중인 연구 프로젝트
                </label>
                <input
                  type="number"
                  value={data.research.projects}
                  onChange={(e) =>
                    setData({
                      ...data,
                      research: { ...data.research, projects: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  연구 개발 투자 (억원)
                </label>
                <input
                  type="number"
                  value={data.research.investment}
                  onChange={(e) =>
                    setData({
                      ...data,
                      research: { ...data.research, investment: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 bg-black border border-white/20 text-white rounded"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:bg-gray-700"
          >
            {saving ? '저장 중...' : '모든 변경사항 저장'}
          </button>
        </div>
      </main>
    </div>
  );
}
