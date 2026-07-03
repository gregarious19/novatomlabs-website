import AmbientBackground from "@/components/experience/AmbientBackground";

const TEAM = [
  {
    name: "Arnav Kulshrestha",
    role: "CO-FOUNDER & CEO",
    accent: "#ffb02e",
    body: "Computational physics, LQM architecture, materials science, and semiconductor physics. Deep focus on quantum and solid-state physics as the theoretical foundation for the system.",
  },
  {
    name: "Pranay Sharma",
    role: "CO-FOUNDER & CTO",
    accent: "#59d8ff",
    body: "Machine learning, deep learning, and AI infrastructure. Specialises in agentic AI architecture, building the autonomous reasoning and orchestration layer that drives the LLM-LQM loop.",
  },
];

export default function About() {
  return (
    <>
      <AmbientBackground accent="#ffb02e" secondary="#ff5c9d" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        {/* Hero */}
        <div className="mb-28 text-center">
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-fusion">
            ABOUT NOVATOM LABS
          </div>
          <h1 data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="display-xl mb-8">
            We replace waiting
            <br />
            with{" "}
            <span className="text-glow font-serif font-normal italic text-fusion">discovery.</span>
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
            className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-paper/80 md:text-2xl"
          >
            An AI-native company removing the bottleneck of human bandwidth from
            scientific discovery.
          </p>
        </div>

        {/* Problem stats */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {[
            { big: "6–10", small: "years from hypothesis to validated discovery", accent: "#ff5c9d" },
            { big: "$50M+", small: "sunk into every discovery program", accent: "#ffb02e" },
            { big: "10⁸", small: "unexplored candidates no human team will screen", accent: "#59d8ff" },
          ].map((s, k) => (
            <div
              key={s.big}
              data-reveal
              style={{ "--reveal-delay": `${k * 100}ms`, "--acc": s.accent } as React.CSSProperties}
              className="group rounded-3xl border-2 border-paper/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--acc)] hover:shadow-[0_0_44px_-8px_var(--acc)]"
            >
              <div className="font-heading text-6xl font-bold text-[var(--acc)] md:text-7xl">{s.big}</div>
              <p className="mt-4 text-base leading-relaxed text-paper/70">{s.small}</p>
            </div>
          ))}
        </div>

        {/* Thesis */}
        <div
          data-reveal
          className="mb-28 rounded-3xl border-2 border-fusion/25 bg-gradient-to-br from-fusion/10 to-photon/10 p-10 backdrop-blur-md md:p-16"
        >
          <div className="mb-6 font-mono text-sm font-bold tracking-[0.3em] text-fusion">OUR THESIS</div>
          <p className="font-heading text-2xl font-bold leading-snug md:text-4xl">
            This is not a knowledge problem. It is a{" "}
            <span className="text-glow font-serif font-normal italic text-fusion">throughput</span>{" "}
            problem. An autonomous system that never stops can compress years of
            experimental iteration into a single discovery session.
          </p>
        </div>

        {/* Team */}
        <div>
          <h2 data-reveal className="display-md mb-14 text-center">
            The{" "}
            <span className="gradient-text-warm font-serif font-normal italic">minds</span>{" "}
            behind the machine.
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {TEAM.map((t, k) => (
              <div
                key={t.name}
                data-reveal
                style={{ "--reveal-delay": `${k * 120}ms`, "--acc": t.accent } as React.CSSProperties}
                className="group rounded-3xl border-2 border-paper/10 bg-white/[0.03] p-10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[var(--acc)] hover:shadow-[0_0_50px_-8px_var(--acc)]"
              >
                <h3 className="mb-2 font-heading text-3xl font-bold transition-colors duration-300 group-hover:text-[var(--acc)]">
                  {t.name}
                </h3>
                <div className="mb-6 font-mono text-sm font-bold uppercase tracking-widest text-[var(--acc)]">
                  {t.role}
                </div>
                <p className="text-lg leading-relaxed text-paper/75">{t.body}</p>
                <div className="mt-8 font-mono text-xs font-bold tracking-widest text-paper/40">
                  STUDENT · BITS PILANI
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
