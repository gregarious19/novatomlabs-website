export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20 animate-fade-in-up">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">About NovAtom Labs</h1>
        <p className="text-xl text-ink/70 dark:text-paper/70">
          We are an AI-native company that replaces the bottleneck of human bandwidth in scientific discovery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-heading font-bold mb-6">The Problem</h2>
          <p className="text-ink/80 dark:text-paper/80 leading-relaxed mb-4">
            Scientific discovery — in materials, drugs, catalysis, quantum systems — is bottlenecked by human bandwidth. It takes 6–10 years on average to go from hypothesis to validated discovery, costing upwards of $50M+.
          </p>
          <p className="text-ink/80 dark:text-paper/80 leading-relaxed">
            Any given domain has 10⁸+ unexplored candidate structures that no human team will ever manually screen.
          </p>
        </div>
        <div className="p-8 rounded-3xl glass-dark border border-ink/10 dark:border-paper/10">
          <h2 className="text-2xl font-heading font-bold mb-4 text-nova-blue">Our Thesis</h2>
          <p className="text-lg leading-relaxed">
            This bottleneck is not a knowledge problem; it is a throughput and iteration problem. An autonomous system that never stops can compress years of experimental iteration into a single discovery session.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-heading font-bold mb-10 text-center">The Team</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border border-ink/10 dark:border-paper/10 bg-white/30 dark:bg-ink/30 hover:shadow-lg transition-all">
            <h3 className="text-2xl font-bold font-heading mb-1">Arnav Kulshrestha</h3>
            <div className="text-sm font-mono text-nova-blue mb-4 uppercase tracking-widest">Co-Founder & CEO</div>
            <p className="text-ink/70 dark:text-paper/70 leading-relaxed">
              Computational physics, LQM architecture, materials science, and semiconductor physics. Deep focus on quantum and solid-state physics as the theoretical foundation for the system.
            </p>
            <div className="mt-6 text-xs font-mono text-ink/40 dark:text-paper/40">ALUMNI · BITS PILANI</div>
          </div>
          <div className="p-8 rounded-3xl border border-ink/10 dark:border-paper/10 bg-white/30 dark:bg-ink/30 hover:shadow-lg transition-all">
            <h3 className="text-2xl font-bold font-heading mb-1">Pranay Sharma</h3>
            <div className="text-sm font-mono text-nova-blue mb-4 uppercase tracking-widest">Co-Founder & CTO</div>
            <p className="text-ink/70 dark:text-paper/70 leading-relaxed">
              Machine learning, deep learning, and AI infrastructure. Specialises in agentic AI architecture — building the autonomous reasoning and orchestration layer that drives the LLM-LQM loop.
            </p>
            <div className="mt-6 text-xs font-mono text-ink/40 dark:text-paper/40">ALUMNI · BITS PILANI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
