'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { GuestbookForm } from '@/components/guestbook/GuestbookForm';
import { GuestbookList } from '@/components/guestbook/GuestbookList';

export default function GuestbookPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmitSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <SubPageLayout
      title="디지털 방명록"
      subtitle="삼육보건대학교에 대한 여러분의 소중한 추억과 메시지를 남겨주세요. Leave your precious memories and messages."
    >
      {/* Main Content */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - 1/3 width on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24">
              <GuestbookForm onSubmitSuccess={handleSubmitSuccess} />
            </div>
          </motion.div>

          {/* List Section - 2/3 width on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <GuestbookList refreshTrigger={refreshTrigger} />
          </motion.div>
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
          <p className="text-2xl md:text-3xl font-light text-white/80 mb-4 tracking-tight">
            함께 만들어가는 90년의 이야기
          </p>
          <p className="text-gray-500 text-sm tracking-wider">
            여러분의 목소리가 역사가 됩니다
          </p>
        </motion.div>
      </section>
    </SubPageLayout>
  );
}
