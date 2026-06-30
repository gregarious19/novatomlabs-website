import Hero from "@/components/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Model Architecture Section */}
      <section className="py-24 px-6 md:px-12 bg-white/50 dark:bg-ink/30 border-t border-ink/5 dark:border-paper/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up delay-100">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">LLM + LQM Architecture</h2>
            <p className="text-lg text-ink/70 dark:text-paper/70">
              Our proprietary engine pairs two powerful models into a closed, self-improving loop, compressing years of experimental iteration into a single discovery session.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 animate-fade-in-up delay-200">
            {/* LLM Card */}
            <div className="p-8 md:p-10 rounded-3xl glass-dark border border-nova-blue/20 hover:border-nova-blue/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-nova-blue/20 flex items-center justify-center mb-6">
                <span className="font-mono text-nova-blue font-bold tracking-tighter">LLM</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-nova-blue">Large Language Model Orchestrator</h3>
              <p className="text-ink/80 dark:text-paper/80 leading-relaxed">
                Generates novel, falsifiable scientific hypotheses grounded in domain knowledge. Translates each hypothesis into a formal <span className="italic font-serif">Experiment Specification</span> for the quantitative engine to evaluate.
              </p>
            </div>

            {/* LQM Card */}
            <div className="p-8 md:p-10 rounded-3xl glass-dark border border-electron/20 hover:border-electron/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-electron/20 flex items-center justify-center mb-6">
                <span className="font-mono text-electron font-bold tracking-tighter">LQM</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-electron">Large Quantitative Model Simulator</h3>
              <p className="text-ink/80 dark:text-paper/80 leading-relaxed">
                A physics-aware ML model that predicts domain properties like formation energy and bandgap in milliseconds. Every prediction carries a calibrated uncertainty score, escalating anomalies to an exact DFT oracle.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center animate-fade-in-up delay-300">
            <Link 
              href="/technology" 
              className="inline-flex items-center gap-2 font-semibold text-nova-blue hover:text-electron transition-colors"
            >
              Explore the 5-Step Discovery Engine
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
