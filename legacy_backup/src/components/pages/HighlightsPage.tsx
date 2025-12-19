import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';
import { Button } from '../ui/button';

export function HighlightsPage() {
  return (
    <SubPageLayout 
      title="90th Highlights" 
      subtitle="Celebrating the key moments and achievements that define our 90-year legacy."
    >
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-white">Milestone Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800 transition-colors">
                    <div className="h-40 bg-black/50 mb-4 rounded-lg flex items-center justify-center text-zinc-600">
                        Highlight Image {item}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Achievement {item}</h3>
                    <p className="text-gray-400 text-sm">
                        A brief description of this significant highlight in our university's history.
                    </p>
                </div>
            ))}
        </div>
      </section>

      <section className="mb-20">
         <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                 <h2 className="text-3xl font-bold text-white">Global Recognition</h2>
                 <p className="text-gray-300 leading-relaxed">
                    Our commitment to excellence has been recognized globally, fostering partnerships with institutions around the world.
                 </p>
                 <Button className="bg-amber-600 hover:bg-amber-700 text-white">Read Impact Report</Button>
            </div>
            <div className="flex-1 h-64 w-full bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600">Map / Awards Visual</span>
            </div>
         </div>
      </section>

      <section className="text-center py-12 border-t border-zinc-800">
          <h3 className="text-2xl font-light mb-6">"Illuminating the world through health and truth."</h3>
          <Button variant="link" className="text-amber-500 hover:text-amber-400 text-lg">Download 90th Brochure &rarr;</Button>
      </section>
    </SubPageLayout>
  );
}
