import Link from "next/link";
import AmbientBackground from "@/components/experience/AmbientBackground";

const STEPS = [
  { n: "01", title: "Define", accent: "#59d8ff", body: "You set the domain, the target property envelope, and the performance threshold. The engine takes it from there." },
  { n: "02", title: "Hypothesise", accent: "#5b8cff", body: "The LLM generates falsifiable scientific hypotheses and compiles each into a formal Experiment Specification." },
  { n: "03", title: "Simulate", accent: "#9d7bff", body: "The LQM evaluates thousands of candidates in parallel, at millisecond speed per structure, with uncertainty on every prediction." },
  { n: "04", title: "Validate", accent: "#ffb02e", body: "Anomalies escalate to an exact DFT oracle. The LQM retrains on the labelled results, and every loop makes it sharper." },
  { n: "05", title: "Deliver", accent: "#37e6a0", body: "A ranked, confidence-annotated discovery report lands, ready for experimental handoff." },
];

export default function Technology() {
  return (
    <>
      <AmbientBackground accent="#9d7bff" secondary="#2f6bf0" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        {/* Hero */}
        <div className="mb-28 text-center">
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-quantum">
            CORE TECHNOLOGY
          </div>
          <h1 data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="display-xl mb-8">
            One engine.
            <br />
            <span className="text-glow font-serif font-normal italic text-quantum">Infinite</span>{" "}
            experiments.
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
            className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-paper/80 md:text-2xl"
          >
            An LLM orchestrator paired with an LQM simulation layer: a closed,
            self-improving loop evaluating millions of candidates while you sleep.
          </p>
        </div>

        {/* The two minds */}
        <div className="mb-28 grid gap-8 md:grid-cols-2">
          <div
            data-reveal
            className="group rounded-3xl border-2 border-nova-blue/25 bg-white/5 p-10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-nova-blue/70 hover:shadow-[0_0_50px_rgba(47,107,240,0.25)]"
          >
            <div className="mb-5 font-mono text-base font-bold tracking-widest text-nova-blue">
              LLM · ORCHESTRATOR
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">It writes the science.</h2>
            <p className="text-lg leading-relaxed text-paper/75">
              Generates novel, falsifiable scientific hypotheses grounded in domain
              knowledge, and translates each into a formal{" "}
              <i className="font-serif">Experiment Specification</i> for the
              quantitative engine to evaluate.
            </p>
          </div>
          <div
            data-reveal
            style={{ "--reveal-delay": "150ms" } as React.CSSProperties}
            className="group rounded-3xl border-2 border-quantum/25 bg-white/5 p-10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-quantum/70 hover:shadow-[0_0_50px_rgba(157,123,255,0.25)]"
          >
            <div className="mb-5 font-mono text-base font-bold tracking-widest text-quantum">
              LQM · SIMULATION LAYER
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">It runs the physics.</h2>
            <p className="text-lg leading-relaxed text-paper/75">
              A physics-aware ML model predicting domain properties (formation energy,
              bandgap and more) in milliseconds per structure. Every prediction carries
              a calibrated uncertainty score.
            </p>
          </div>
        </div>

        {/* The 5-step engine */}
        <div className="mb-28">
          <h2 data-reveal className="display-md mb-4 text-center">
            The 5-step{" "}
            <span className="gradient-text-cool font-serif font-normal italic">discovery engine</span>
          </h2>
          <p data-reveal className="mx-auto mb-14 max-w-2xl text-center text-lg text-paper/60">
            Each colour is a stage. Each loop compresses months of bench time into minutes.
          </p>
          <div className="flex flex-col gap-5">
            {STEPS.map((s, k) => (
              <div
                key={s.n}
                data-reveal
                style={{ "--reveal-delay": `${k * 90}ms`, "--acc": s.accent } as React.CSSProperties}
                className="group flex items-start gap-8 rounded-3xl border-2 border-paper/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--acc)] hover:shadow-[0_0_44px_-8px_var(--acc)] md:items-center"
              >
                <span
                  className="font-heading text-6xl font-bold text-paper/15 transition-colors duration-300 group-hover:text-[var(--acc)] md:text-8xl"
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="mb-2 font-heading text-2xl font-bold transition-colors duration-300 group-hover:text-[var(--acc)] md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="max-w-2xl text-lg leading-relaxed text-paper/70">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          data-reveal
          className="rounded-3xl border-2 border-quantum/25 bg-gradient-to-br from-quantum/10 to-nova-blue/10 p-12 text-center backdrop-blur-md md:p-16"
        >
          <h2 className="display-md mb-6">
            See it deployed{" "}
            <span className="text-glow font-serif font-normal italic text-plasma">live.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-paper/70">
            NexCon-03 is already running this loop against compound semiconductors.
          </p>
          <Link
            href="/products"
            className="inline-block rounded-full bg-quantum px-12 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_36px_rgba(157,123,255,0.6)]"
          >
            Explore NexCon-03 →
          </Link>
        </div>
      </div>
    </>
  );
}
