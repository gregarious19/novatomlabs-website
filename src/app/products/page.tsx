export default function Products() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20 animate-fade-in-up">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Products & Roadmap</h1>
        <p className="text-xl text-ink/70 dark:text-paper/70 max-w-3xl">
          Deploying our autonomous discovery loop against the most critical scientific frontiers.
        </p>
      </div>

      {/* Flagship Product */}
      <div className="mb-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-nova-blue/10 to-electron/10 border border-nova-blue/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <div className="font-mono text-9xl font-bold">NX-03</div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-blue/20 text-nova-blue text-xs font-mono font-bold tracking-widest mb-6 uppercase">
            Live Product
          </div>
          <h2 className="text-4xl font-heading font-bold mb-4">NexCon-03</h2>
          <p className="text-lg text-ink/80 dark:text-paper/80 mb-8 max-w-2xl">
            Autonomously discovers novel compound semiconductor materials. Evaluating formation energy, bandgap, dopant defect energetics, and synthesisability proxies.
          </p>
          
          <h3 className="text-xl font-heading font-bold mb-4">Material Families Covered:</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { mat: "AlGaN", use: "Wide-Bandgap Optoelectronics (Deep-UV LEDs, biosensing)" },
              { mat: "GaN", use: "Power & RF Devices (5G RF, defence radar)" },
              { mat: "SiC", use: "High-Power Electronics (EV drivetrains, grid infrastructure)" },
              { mat: "HfO₂", use: "Gate-Stack Engineering (High-k dielectrics)" }
            ].map(item => (
              <div key={item.mat} className="p-4 rounded-xl bg-white/50 dark:bg-ink/50 border border-ink/5 dark:border-paper/10">
                <div className="font-bold text-nova-blue mb-1">{item.mat}</div>
                <div className="text-sm text-ink/70 dark:text-paper/70">{item.use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h2 className="text-3xl font-heading font-bold mb-8">Future Roadmap</h2>
        <div className="space-y-4">
          {[
            { name: "NexPharma-01", desc: "Pharmaceutical candidate screening (binding affinity, ADMET)", status: "In Development — 2026" },
            { name: "NexQM-01", desc: "Quantum & topological materials (superconductors, quantum spin liquids)", status: "In Development — 2026" },
            { name: "NexCat-01", desc: "Catalysis & clean-energy materials (H₂ evolution, CO₂ reduction)", status: "In Development — 2027" }
          ].map(item => (
            <div key={item.name} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-ink/10 dark:border-paper/10 gap-4">
              <div>
                <h4 className="text-xl font-bold mb-1">{item.name}</h4>
                <p className="text-sm text-ink/70 dark:text-paper/70">{item.desc}</p>
              </div>
              <div className="font-mono text-xs text-ink/50 dark:text-paper/50 tracking-wider uppercase shrink-0">
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
