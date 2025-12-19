import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';

export function VideoHistoryPage() {
  return (
    <SubPageLayout 
      title="Video History" 
      subtitle="Watch the stories of our people, our campus, and our mission through the decades."
    >
      <section className="mb-20">
        <div className="aspect-video w-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 relative group">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform cursor-pointer">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-3xl font-bold">90th Anniversary Documentary: The Light</h2>
                <p className="text-gray-300">A special feature covering our journey from 1936 to 2026.</p>
            </div>
        </div>
      </section>

      <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Archived Footage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group cursor-pointer">
                      <div className="aspect-video bg-zinc-900 rounded-lg mb-3 overflow-hidden border border-zinc-800 relative">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-xs rounded text-white font-mono">03:45</div>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-amber-500 transition-colors">Historical Clip #{i}</h3>
                      <p className="text-sm text-gray-500">19{50 + i*5} Campus Event</p>
                  </div>
              ))}
          </div>
      </section>
      
      <section className="bg-zinc-900 p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h3 className="text-xl font-bold mb-2">Submit Your Footage</h3>
              <p className="text-gray-400 text-sm">Do you have video recordings from your time at the university?</p>
          </div>
          <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
              Upload to Archive
          </button>
      </section>
    </SubPageLayout>
  );
}
