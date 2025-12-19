import React from 'react';
import { SubPageLayout } from '../layout/SubPageLayout';

export function StatisticsPage() {
  return (
    <SubPageLayout 
      title="Statistics" 
      subtitle="90 years of impact by the numbers."
    >
      <section className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
              { label: "Graduates", value: "50,000+" },
              { label: "Years", value: "90" },
              { label: "Global Partners", value: "120+" },
              { label: "Medical Camps", value: "1,500+" },
          ].map((stat, idx) => (
              <div key={idx} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2 font-mono">
                      {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
          ))}
      </section>

      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 min-h-[300px] flex items-center justify-center">
              <span className="text-zinc-600 font-mono">Infographic: Growth Chart</span>
          </div>
          <div className="space-y-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold">Consistent Growth</h2>
              <p className="text-gray-300">
                  Since our humble beginnings in 1936, we have consistently grown in student population, academic programs, and social contribution.
              </p>
              <div className="space-y-4">
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[80%]"></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                      <span>1936</span>
                      <span>2026</span>
                  </div>
              </div>
          </div>
      </section>

      <section className="text-center">
          <button className="text-white underline underline-offset-4 hover:text-amber-500 transition-colors">
              Download Annual Statistical Report (PDF)
          </button>
      </section>
    </SubPageLayout>
  );
}
