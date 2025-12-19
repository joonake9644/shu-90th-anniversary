import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';
import { Button } from '../ui/button';

export function ArchivePage() {
  return (
    <SubPageLayout 
      title="Digital Archive" 
      subtitle="Preserving the memories, documents, and artifacts of our history."
    >
      <section className="mb-12">
          <div className="flex gap-4 overflow-x-auto pb-4 border-b border-zinc-800">
              {['All', 'Documents', 'Photos', 'Publications', 'Artifacts'].map((cat, i) => (
                  <button key={cat} className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-white text-black' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                      {cat}
                  </button>
              ))}
          </div>
      </section>

      <section className="mb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors group">
                  <div className="aspect-[3/4] bg-zinc-800 flex items-center justify-center relative">
                      <span className="text-zinc-600 text-sm">Preview</span>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm">View Detail</Button>
                      </div>
                  </div>
                  <div className="p-4">
                      <h3 className="font-bold text-sm truncate">Archive Document #{item}</h3>
                      <p className="text-xs text-gray-500 mt-1">19{40 + item}</p>
                  </div>
              </div>
          ))}
      </section>

      <section className="bg-gradient-to-r from-zinc-900 to-black border-y border-zinc-800 py-16 text-center">
           <h2 className="text-3xl font-bold mb-6">Can't find what you're looking for?</h2>
           <p className="text-gray-400 mb-8">Our physical archives contain thousands more records available for research.</p>
           <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Request Access</Button>
      </section>
    </SubPageLayout>
  );
}
