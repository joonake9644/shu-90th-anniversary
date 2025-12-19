import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';
import { Button } from '../ui/button';

export function MainTimelinePage() {
  return (
    <SubPageLayout 
      title="90 Years Timeline" 
      subtitle="A journey through time, tracing the footsteps of our dedication to health and education since 1936."
    >
      {/* Body Section 1 */}
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white border-l-4 border-amber-500 pl-4">Founding Era</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            In 1936, Dr. Ryu Je-han established the first clinic with a vision to provide compassionate care to those in need. 
            Despite the harsh conditions of the era, the foundation was laid for what would become a beacon of medical education.
          </p>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
              1936: Dr. Ryu Je-han's Clinic
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
              1947: Establishment of the School
            </li>
          </ul>
        </div>
        <div className="h-80 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center">
          <span className="text-zinc-700 font-mono">Archive Image: The Beginning</span>
        </div>
      </section>

      {/* Body Section 2 */}
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="h-80 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center order-2 md:order-1">
           <span className="text-zinc-700 font-mono">Archive Image: Growth</span>
        </div>
        <div className="space-y-6 order-1 md:order-2">
          <h2 className="text-3xl font-bold text-white border-l-4 border-blue-500 pl-4">Expansion & Innovation</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Through the decades, we expanded our curriculum and facilities, embracing modern medical technologies while staying true to our core mission of service.
          </p>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black transition-colors">
            View Full Chronology
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900/50 p-12 rounded-2xl text-center border border-zinc-800">
        <h3 className="text-2xl font-bold mb-4">Be Part of Our History</h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Join us as we celebrate 90 years of excellence and look forward to a century of innovation.
        </p>
        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg">
          Explore the Digital Museum
        </Button>
      </section>
    </SubPageLayout>
  );
}
