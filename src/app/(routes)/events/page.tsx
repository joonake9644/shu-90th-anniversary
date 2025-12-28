'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { getPublicEvents } from '@/lib/firestore/public/events';
import type { Event as FirestoreEvent } from '@/types/firestore';
import { Timestamp } from 'firebase/firestore';

interface EventDisplay {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: string;
  image: string;
  isFeatured?: boolean;
}

const categoryLabels: Record<string, string> = {
  'ceremony': '기념식',
  'exhibition': '전시',
  'conference': '학술',
  'other': '기타',
};

// Helper: Firestore Event → Display Event
function convertEvent(event: FirestoreEvent): EventDisplay {
  const eventDate = event.date instanceof Timestamp ? event.date.toDate() : new Date();

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: eventDate.toISOString().split('T')[0],
    time: eventDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    location: event.location,
    category: event.category,
    attendees: '참석 예정',
    image: event.image || 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?w=800',
    isFeatured: false,
  };
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventDisplay | null>(null);
  const [eventsData, setEventsData] = useState<EventDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from Firestore
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getPublicEvents();
        const displayData = data.map(convertEvent);
        // Set first event as featured
        if (displayData.length > 0) {
          displayData[0].isFeatured = true;
        }
        setEventsData(displayData);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const featuredEvent = eventsData.find((e) => e.isFeatured);
  const upcomingEvents = eventsData.filter((e) => !e.isFeatured);

  return (
    <SubPageLayout
      title="90주년 기념사업"
      subtitle="함께 만들어가는 90주년 축제. Celebrating 90 years together."
    >
      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">이벤트를 불러오는 중...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Featured Event */}
          {featuredEvent && (
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                onClick={() => setSelectedEvent(featuredEvent)}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
                  style={{ backgroundImage: `url(${featuredEvent.image})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

                {/* Content */}
                <div className="relative z-10 p-12 min-h-[500px] flex flex-col justify-end">
                  <div className="inline-block bg-amber-500/90 px-4 py-1.5 rounded-full mb-4 w-fit">
                    <span className="text-black font-bold text-sm uppercase">Featured Event</span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {featuredEvent.title}
                  </h2>

                  <p className="text-gray-300 text-lg mb-8 max-w-2xl">
                    {featuredEvent.description}
                  </p>

                  <div className="flex flex-wrap gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-amber-500" />
                      <span>{new Date(featuredEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-amber-500" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-amber-500" />
                      <span>{featuredEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-amber-500" />
                      <span>{featuredEvent.attendees}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-white mb-8">다가오는 행사</h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {upcomingEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* Empty State */}
          {eventsData.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">등록된 이벤트가 없습니다.</p>
            </div>
          )}
        </>
      )}

      {/* Event Details Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* Closing Message */}
      <section className="text-center py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-3xl md:text-4xl font-light text-white/80 mb-6 tracking-tight">
            함께여서 더 빛나는 순간
          </p>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            여러분의 참여가 90주년을 더욱 특별하게 만듭니다.
          </p>
        </motion.div>
      </section>
    </SubPageLayout>
  );
}

// Event Card Component
function EventCard({
  event,
  index,
  onClick,
}: {
  event: EventDisplay;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group flex flex-col md:flex-row items-start md:items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-xl hover:border-amber-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer"
    >
      {/* Date Badge */}
      <div className="flex flex-col items-center justify-center w-20 h-20 bg-amber-500/20 rounded-xl border border-amber-500/30 flex-shrink-0">
        <span className="text-xs text-amber-500 font-bold uppercase">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-3xl font-bold text-white">
          {new Date(event.date).getDate()}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="inline-block bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-medium mb-2">
          {categoryLabels[event.category] || event.category}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {event.location}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full md:w-auto">
        <button className="w-full md:w-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">
          자세히 보기
        </button>
      </div>
    </motion.div>
  );
}

// Event Modal Component
function EventModal({
  event,
  onClose,
}: {
  event: EventDisplay | null;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-3xl w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Image */}
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          />

          {/* Content */}
          <div className="p-8">
            <div className="inline-block bg-amber-500/90 px-4 py-1.5 rounded-full mb-4">
              <span className="text-black font-bold text-sm">{categoryLabels[event.category] || event.category}</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">{event.title}</h2>

            <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm">날짜</span>
                </div>
                <p className="text-white">
                  {new Date(event.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Clock size={16} />
                  <span className="text-sm">시간</span>
                </div>
                <p className="text-white">{event.time}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <MapPin size={16} />
                  <span className="text-sm">장소</span>
                </div>
                <p className="text-white">{event.location}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users size={16} />
                  <span className="text-sm">참석 예정</span>
                </div>
                <p className="text-white">{event.attendees}</p>
              </div>
            </div>

            <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors">
              참가 신청하기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
