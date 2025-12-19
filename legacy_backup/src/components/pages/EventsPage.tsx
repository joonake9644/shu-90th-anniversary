import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';
import { Button } from '../ui/button';

export function EventsPage() {
  return (
    <SubPageLayout 
      title="90th Events" 
      subtitle="Join us in a year-long celebration of our heritage and future."
    >
      <section className="mb-20">
          <div className="bg-white text-black rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              
              <div className="flex-1 relative z-10">
                  <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">Upcoming Main Event</span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">90th Anniversary Gala Concert</h2>
                  <p className="text-lg text-gray-700 mb-8 max-w-md">
                      A night of music and harmony, celebrating 90 years of history with alumni, students, and distinguished guests.
                  </p>
                  <Button className="bg-black text-white hover:bg-zinc-800 text-lg px-8 py-6">Reserve Seats</Button>
              </div>
              <div className="flex-1 w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Event Banner Image</span>
              </div>
          </div>
      </section>

      <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 pl-4 border-l-4 border-white">Event Calendar</h2>
          <div className="space-y-4">
              {[
                  { month: "MAR", day: "15", title: "Founders Day Ceremony", loc: "Main Auditorium" },
                  { month: "MAY", day: "02", title: "Global Medical Conference", loc: "Science Hall" },
                  { month: "AUG", day: "20", title: "Alumni Homecoming", loc: "Campus Green" },
                  { month: "OCT", day: "10", title: "Vision 2030 Proclamation", loc: "Grand Hall" },
              ].map((evt, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-800/50 transition-colors group">
                      <div className="flex flex-col items-center justify-center w-full md:w-24 p-4 bg-zinc-800 rounded-lg mb-4 md:mb-0 md:mr-8 group-hover:bg-white group-hover:text-black transition-colors">
                          <span className="text-sm font-bold uppercase">{evt.month}</span>
                          <span className="text-3xl font-bold">{evt.day}</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                          <h3 className="text-xl font-bold mb-1">{evt.title}</h3>
                          <p className="text-gray-400 text-sm">{evt.loc}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                          <Button variant="ghost" className="text-white hover:text-amber-500">Details &rarr;</Button>
                      </div>
                  </div>
              ))}
          </div>
      </section>
    </SubPageLayout>
  );
}
