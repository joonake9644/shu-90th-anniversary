import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';

export function NewsPage() {
  return (
    <SubPageLayout 
      title="News & Stories" 
      subtitle="Latest updates, press releases, and stories from our 90th anniversary year."
    >
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="aspect-video bg-zinc-800 w-full flex items-center justify-center">
                      <span className="text-zinc-600">Article Image</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 text-xs font-mono text-amber-500 uppercase">
                          <span>Press Release</span>
                          <span>•</span>
                          <span>Dec {10 + i}, 2025</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-amber-500 transition-colors">
                          University Announces New Medical Research Center for 90th Anniversary
                      </h3>
                      <p className="text-gray-400 text-sm mb-6 flex-1">
                          A significant investment in the future of medical science marks the beginning of our centennial journey...
                      </p>
                      <a href="#" className="text-white text-sm font-bold border-b border-transparent group-hover:border-white w-fit">
                          Read More
                      </a>
                  </div>
              </article>
          ))}
      </section>

      <section className="bg-zinc-800 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="text-gray-400 mb-8">Get the latest news and event invitations delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
              <button className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200">
                  Subscribe
              </button>
          </div>
      </section>
    </SubPageLayout>
  );
}
