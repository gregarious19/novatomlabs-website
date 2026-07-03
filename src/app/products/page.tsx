import Link from "next/link";
import AmbientBackground from "@/components/experience/AmbientBackground";

const MATERIALS = [
  { mat: "AlGaN", accent: "#4cc3ff", use: "Wide-bandgap optoelectronics: deep-UV LEDs, biosensing" },
  { mat: "GaN", accent: "#5b8cff", use: "Power & RF devices: 5G RF, defence radar" },
  { mat: "SiC", accent: "#37e6a0", use: "High-power electronics: EV drivetrains, grid infrastructure" },
  { mat: "HfO₂", accent: "#9d7bff", use: "Gate-stack engineering: high-k dielectrics" },
];

const ROADMAP = [
  { name: "NexPharma-01", accent: "#59d8ff", desc: "Pharmaceutical candidate screening: binding affinity, ADMET", when: "2026" },
  { name: "NexQM-01", accent: "#9d7bff", desc: "Quantum & topological materials: superconductors, quantum spin liquids", when: "2026" },
  { name: "NexCat-01", accent: "#ffb02e", desc: "Catalysis & clean-energy materials: H₂ evolution, CO₂ reduction", when: "2027" },
];

export default function Products() {
  return (
    <>
      <AmbientBackground accent="#37e6a0" secondary="#2f6bf0" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        {/* Hero */}
        <div className="mb-24 text-center">
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-plasma">
            PRODUCTS &amp; ROADMAP
          </div>
          <h1 data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="display-xl mb-8">
            NexCon-03
            <br />
            <span className="text-glow font-serif font-normal italic text-plasma">is live.</span>
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
            className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-paper/80 md:text-2xl"
          >
            The autonomous discovery loop, deployed against the most critical
            scientific frontier first: compound semiconductors.
          </p>
        </div>

        {/* Flagship */}
        <div
          data-reveal
          className="relative mb-28 overflow-hidden rounded-3xl border-2 border-plasma/25 bg-gradient-to-br from-plasma/10 to-nova-blue/10 p-10 backdrop-blur-md md:p-14"
        >
          <div className="pointer-events-none absolute right-0 top-0 select-none p-8 font-mono text-9xl font-bold opacity-10">
            NX-03
          </div>
          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-plasma/15 px-5 py-2 font-mono text-sm font-bold tracking-widest text-plasma">
              <span className="h-2 w-2 animate-pulse rounded-full bg-plasma" />
              LIVE PRODUCT
            </div>
            <h2 className="display-md mb-6">Autonomous semiconductor discovery.</h2>
            <p className="mb-12 max-w-2xl text-xl leading-relaxed text-paper/80">
              Discovers novel compound semiconductor materials, evaluating formation
              energy, bandgap, dopant defect energetics and synthesisability proxies,
              entirely on its own.
            </p>
            <h3 className="mb-6 font-mono text-sm font-bold tracking-[0.3em] text-paper/50">
              MATERIAL FAMILIES COVERED
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {MATERIALS.map((item, k) => (
                <div
                  key={item.mat}
                  data-reveal
                  style={{ "--reveal-delay": `${k * 80}ms`, "--acc": item.accent } as React.CSSProperties}
                  className="group rounded-2xl border-2 border-paper/10 bg-ink/40 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--acc)] hover:shadow-[0_0_40px_-6px_var(--acc)]"
                >
                  <div className="mb-2 font-heading text-3xl font-bold transition-colors duration-300 group-hover:text-[var(--acc)]">
                    {item.mat}
                  </div>
                  <div className="text-base leading-relaxed text-paper/70">{item.use}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap timeline */}
        <div className="mb-28">
          <h2 data-reveal className="display-md mb-14 text-center">
            What&apos;s{" "}
            <span className="gradient-text-warm font-serif font-normal italic">next.</span>
          </h2>
          <div className="relative flex flex-col gap-6 md:pl-10">
            <div className="absolute bottom-4 left-[3px] top-4 hidden w-0.5 bg-gradient-to-b from-ion via-quantum to-fusion md:block" />
            {ROADMAP.map((item, k) => (
              <div
                key={item.name}
                data-reveal
                style={{ "--reveal-delay": `${k * 100}ms`, "--acc": item.accent } as React.CSSProperties}
                className="group relative flex flex-col justify-between gap-4 rounded-3xl border-2 border-paper/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--acc)] hover:shadow-[0_0_44px_-8px_var(--acc)] md:flex-row md:items-center"
              >
                <div className="absolute -left-[43px] top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink bg-[var(--acc)] md:block" />
                <div>
                  <h3 className="mb-2 font-heading text-2xl font-bold transition-colors duration-300 group-hover:text-[var(--acc)] md:text-3xl">
                    {item.name}
                  </h3>
                  <p className="text-lg text-paper/70">{item.desc}</p>
                </div>
                <div className="shrink-0 font-mono text-xl font-bold tracking-widest text-paper/40 transition-colors duration-300 group-hover:text-[var(--acc)]">
                  {item.when}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div data-reveal className="text-center">
          <h2 className="display-md mb-8">
            Point it at{" "}
            <span className="text-glow font-serif font-normal italic text-plasma">your</span>{" "}
            frontier.
          </h2>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-plasma px-12 py-5 text-lg font-bold text-ink transition-all hover:scale-105 hover:shadow-[0_0_36px_rgba(55,230,160,0.6)]"
          >
            Request access →
          </Link>
        </div>
      </div>
    </>
  );
}
