export default function Technology() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20 animate-fade-in-up">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Core Technology</h1>
        <p className="text-xl text-ink/70 dark:text-paper/70 max-w-3xl">
          The proprietary architecture that pairs an LLM orchestrator with an LQM simulation layer. 
          A closed, self-improving loop evaluating millions of candidates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-24">
        <div className="p-8 rounded-3xl glass-dark border border-nova-blue/20">
          <h2 className="text-2xl font-heading font-bold mb-4 text-nova-blue">LLM Orchestrator</h2>
          <p className="text-ink/80 dark:text-paper/80 leading-relaxed">
            Generates novel, falsifiable scientific hypotheses grounded in domain knowledge. Translates each hypothesis into a formal <i>Experiment Specification</i> for the quantitative engine.
          </p>
        </div>
        <div className="p-8 rounded-3xl glass-dark border border-electron/20">
          <h2 className="text-2xl font-heading font-bold mb-4 text-electron">LQM Simulation Layer</h2>
          <p className="text-ink/80 dark:text-paper/80 leading-relaxed">
            A physics-aware ML model that predicts domain properties (formation energy, bandgap, etc.) in milliseconds per structure. Every prediction carries a calibrated uncertainty score.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-heading font-bold mb-8">The 5-Step Discovery Engine</h2>
        <div className="space-y-6">
          {[
            { step: "01", desc: "User defines the domain, target property envelope, and performance threshold." },
            { step: "02", desc: "LLM generates falsifiable hypotheses → formal Experiment Specifications." },
            { step: "03", desc: "LQM evaluates thousands of candidates in parallel at millisecond speed." },
            { step: "04", desc: "Uncertain structures escalated to DFT oracle; LQM retrains on labelled results." },
            { step: "05", desc: "Ranked, confidence-annotated discovery report delivered for experimental handoff." }
          ].map((item) => (
            <div key={item.step} className="flex gap-6 items-start p-6 rounded-2xl bg-white/50 dark:bg-ink/50 border border-ink/5 dark:border-paper/10 hover:border-nova-blue/50 transition-colors">
              <span className="text-4xl font-heading font-bold text-ink/20 dark:text-paper/20">{item.step}</span>
              <p className="text-lg pt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
