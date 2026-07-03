"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DiscoveryScene } from "./DiscoveryScene";

const ACTS = [
  "The void",
  "The search space",
  "The engine",
  "The loop",
  "NexCon-03",
  "Horizon",
];

const STEPS = [
  { n: "01", title: "Define", body: "You set the target: domain, property envelope, performance threshold." },
  { n: "02", title: "Hypothesise", body: "The LLM writes falsifiable hypotheses and compiles them into formal experiment specifications." },
  { n: "03", title: "Simulate", body: "The LQM screens thousands of candidate structures in parallel, at millisecond speed per structure." },
  { n: "04", title: "Validate", body: "Uncertain predictions escalate to an exact DFT oracle, and the model retrains on the results." },
  { n: "05", title: "Deliver", body: "A ranked, confidence-scored discovery report, ready for experimental handoff." },
];

const MATERIALS = [
  { name: "AlGaN", tint: "#4cc3ff", use: "Deep-UV optoelectronics: sterilisation LEDs, biosensing" },
  { name: "GaN", tint: "#5b8cff", use: "Power & RF devices: 5G base stations, defence radar" },
  { name: "SiC", tint: "#37e6a0", use: "High-power electronics: EV drivetrains, grid infrastructure" },
  { name: "HfO₂", tint: "#9d7bff", use: "Gate-stack engineering: high-k dielectrics" },
];

const PARTNERS = [
  { name: "BITS Pilani", logo: "/assets/partners/bits-pilani.svg", initials: "BP" },
  { name: "CREST, BITS Pilani", logo: "/assets/partners/crest-bits-pilani.svg", initials: "CR" },
];

const ROADMAP = [
  { name: "NexPharma-01", desc: "Drug candidate screening: binding affinity, ADMET", when: "2026", accent: "text-ion" },
  { name: "NexQM-01", desc: "Quantum & topological materials: superconductors", when: "2026", accent: "text-quantum" },
  { name: "NexCat-01", desc: "Catalysis & clean energy: H₂ evolution, CO₂ reduction", when: "2027", accent: "text-fusion" },
];

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

/** Renders a partner logo file, falling back to an initials monogram until it's supplied. */
function PartnerLogo({ name, logo, initials }: { name: string; logo: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-paper/15 bg-white/5 font-heading text-xl font-bold text-paper/70">
        {initials}
      </div>
    );
  }
  return (
    <Image
      src={logo}
      alt={`${name} logo`}
      width={64}
      height={64}
      className="h-16 w-16 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function DiscoveryExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sceneRef = useRef<DiscoveryScene | null>(null);
  const actRef = useRef(0);
  const stepRef = useRef(0);

  const [act, setAct] = useState(0);
  const [step, setStep] = useState(0);
  const [material, setMaterial] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let scene: DiscoveryScene | null = null;
    try {
      scene = new DiscoveryScene(canvasWrapRef.current!, {
        particleCount: window.innerWidth < 768 ? 3200 : 6500,
        reducedMotion: reduced,
      });
      sceneRef.current = scene;
      // Fade the stage in without triggering a React render.
      if (canvasWrapRef.current) canvasWrapRef.current.style.opacity = "1";
    } catch {
      // WebGL unavailable — the CSS gradient backdrop stands in.
    }

    const mids: number[] = [];
    const measure = () => {
      sectionRefs.current.forEach((el, k) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        mids[k] = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
      });
    };

    const onScroll = () => {
      if (mids.length < 2) return;
      const s = window.scrollY;
      const vh = window.innerHeight;
      const last = mids.length - 1;
      let f: number;
      if (s <= mids[0]) f = 0;
      else if (s >= mids[last]) f = last;
      else {
        let k = 0;
        while (k < last - 1 && s > mids[k + 1]) k++;
        f = k + (s - mids[k]) / (mids[k + 1] - mids[k]);
      }
      scene?.setScroll(f);

      const a = Math.min(ACTS.length - 1, Math.round(f));
      if (a !== actRef.current) {
        actRef.current = a;
        setAct(a);
      }
      // Apple-style scrub: content eases in toward the viewport centre and
      // drifts out again, so each scene feels like passing through a space.
      if (!reduced) {
        sectionRefs.current.forEach((el, k) => {
          if (!el || k === 3) return; // the sticky act handles itself
          const c = contentRefs.current[k];
          if (!c) return;
          const r = el.getBoundingClientRect();
          const d = (r.top + r.height / 2 - vh / 2) / vh; // 0 when centred
          const abs = Math.abs(d);
          c.style.opacity = String(Math.max(0, 1 - Math.max(0, abs * 1.5 - 0.15)));
          c.style.transform = `translateY(${d * 54}px) scale(${1 - Math.min(0.1, abs * 0.09)})`;
        });
      }

      const loopEl = sectionRefs.current[3];
      if (loopEl) {
        const r = loopEl.getBoundingClientRect();
        const span = Math.max(1, r.height - vh);
        const lp = Math.min(1, Math.max(0, -r.top / span));
        const st = Math.min(4, Math.floor(lp * 5));
        if (st !== stepRef.current) {
          stepRef.current = st;
          setStep(st);
        }
      }
    };

    measure();
    onScroll();
    const settle = window.setTimeout(() => {
      measure();
      onScroll();
    }, 400);

    const onResize = () => {
      scene?.resize();
      measure();
      onScroll();
    };
    const onPointer = (e: PointerEvent) => {
      scene?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries)
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
      },
      { threshold: 0.2 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      io.disconnect();
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const goTo = (k: number) =>
    sectionRefs.current[k]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const hoverMaterial = (idx: number | null) => {
    setMaterial(idx);
    sceneRef.current?.setCrystalTint(idx === null ? null : MATERIALS[idx].tint);
  };

  return (
    <div ref={rootRef} className="relative">
      {/* ---- Fixed 3D stage ---- */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(47,107,240,0.2), transparent 60%), radial-gradient(ellipse 60% 45% at 85% 110%, rgba(255,92,157,0.1), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(55,230,160,0.07), transparent 60%)",
          }}
        />
        <div
          ref={canvasWrapRef}
          className="absolute inset-0 opacity-0 transition-opacity duration-1000"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(4,6,12,0.55) 100%)",
          }}
        />
      </div>

      {/* ---- Progress rail ---- */}
      <nav
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
        aria-label="Journey progress"
      >
        {ACTS.map((name, k) => (
          <button
            key={name}
            onClick={() => goTo(k)}
            aria-label={`Go to ${name}`}
            title={name}
            className={`rounded-full transition-all duration-300 ${
              act === k
                ? "h-7 w-2 bg-nova-blue shadow-[0_0_12px_rgba(47,107,240,0.8)]"
                : "h-2 w-2 bg-paper/25 hover:bg-paper/60"
            }`}
          />
        ))}
      </nav>

      {/* ================= ACT 1 · HERO ================= */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="relative z-10 flex min-h-svh items-center justify-center px-6"
      >
        <div
          ref={(el) => { contentRefs.current[0] = el; }}
          className="mx-auto max-w-6xl pt-24 text-center will-change-transform"
        >
          <div
            data-reveal
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-nova-blue/30 bg-nova-blue/10 px-5 py-2.5 font-mono text-xs font-bold tracking-widest text-electron backdrop-blur-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-nova-blue" />
            NOVATOM LABS · AUTONOMOUS DISCOVERY ENGINE
          </div>
          <h1 data-reveal style={delay(120)} className="display-xl mb-8">
            The lab that{" "}
            <span className="text-glow font-serif font-normal italic text-nova-blue">never</span>
            <br />
            sleeps.
          </h1>
          <p
            data-reveal
            style={delay(240)}
            className="mx-auto mb-12 max-w-3xl text-xl font-medium leading-relaxed text-paper/80 md:text-2xl"
          >
            It hypothesises, simulates, validates and learns millions of times a day.
            Scroll to watch a discovery happen.
          </p>
          <div
            data-reveal
            style={delay(360)}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => goTo(1)}
              className="w-full rounded-full bg-nova-blue px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-electron hover:shadow-[0_0_36px_rgba(47,107,240,0.6)] sm:w-auto"
            >
              Watch it work ↓
            </button>
            <Link
              href="/contact"
              className="w-full rounded-full border-2 border-paper/25 px-10 py-5 text-lg font-bold text-paper transition-all hover:scale-105 hover:border-paper/60 hover:bg-paper/5 sm:w-auto"
            >
              Request access
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-paper/40">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ================= ACT 2 · THE PROBLEM ================= */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="relative z-10 flex min-h-svh items-center px-6"
      >
        <div
          ref={(el) => { contentRefs.current[1] = el; }}
          className="mx-auto max-w-6xl text-center will-change-transform"
        >
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-ion">
            01 · THE SEARCH SPACE
          </div>
          <div
            data-reveal
            style={delay(100)}
            className="gradient-text-cool font-heading text-[clamp(7rem,24vw,18rem)] font-bold leading-none"
          >
            10
            <span className="align-super text-[0.45em]">8</span>
          </div>
          <p
            data-reveal
            style={delay(220)}
            className="mx-auto mt-6 max-w-3xl text-xl font-medium leading-relaxed text-paper/80 md:text-2xl"
          >
            candidate structures sit unexplored in every scientific domain, far beyond
            what any human team will ever screen.
          </p>
          <div
            data-reveal
            style={delay(340)}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            {["6–10 years per discovery", "$50M+ per program", "Bottleneck: human bandwidth"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-ion/25 bg-ion/5 px-6 py-3 font-mono text-base font-bold text-paper/90 backdrop-blur-sm transition-colors hover:border-ion/60 hover:text-ion"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ACT 3 · THE ENGINE ================= */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="relative z-10 flex min-h-svh items-center px-6"
      >
        <div
          ref={(el) => { contentRefs.current[2] = el; }}
          className="mx-auto w-full max-w-6xl will-change-transform"
        >
          <div className="mb-16 text-center">
            <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-electron">
              02 · THE ENGINE
            </div>
            <h2 data-reveal style={delay(100)} className="display-lg">
              Two minds.{" "}
              <span className="text-glow font-serif font-normal italic text-quantum">One loop.</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:gap-24 lg:gap-40">
            <div
              data-reveal
              style={delay(200)}
              className="group rounded-3xl border-2 border-nova-blue/25 bg-white/5 p-10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-nova-blue/70 hover:shadow-[0_0_50px_rgba(47,107,240,0.25)]"
            >
              <div className="mb-5 font-mono text-base font-bold tracking-widest text-nova-blue">
                LLM · ORCHESTRATOR
              </div>
              <h3 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                It writes the science.
              </h3>
              <p className="text-lg leading-relaxed text-paper/75">
                Generates novel, falsifiable hypotheses grounded in domain knowledge,
                and compiles each into a formal experiment specification.
              </p>
            </div>
            <div
              data-reveal
              style={delay(320)}
              className="group rounded-3xl border-2 border-quantum/25 bg-white/5 p-10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-quantum/70 hover:shadow-[0_0_50px_rgba(157,123,255,0.25)]"
            >
              <div className="mb-5 font-mono text-base font-bold tracking-widest text-quantum">
                LQM · SIMULATOR
              </div>
              <h3 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                It runs the physics.
              </h3>
              <p className="text-lg leading-relaxed text-paper/75">
                A physics-aware model predicting formation energy, bandgap and more in
                milliseconds, with every prediction carrying a calibrated uncertainty score.
              </p>
            </div>
          </div>
          <p data-reveal style={delay(440)} className="mt-14 text-center font-mono text-base font-bold tracking-widest">
            <span className="text-nova-blue">HYPOTHESISE</span>
            <span className="text-paper/40"> → </span>
            <span className="text-quantum">SIMULATE</span>
            <span className="text-paper/40"> → </span>
            <span className="text-plasma">LEARN</span>
            <span className="text-paper/40"> · A CLOSED LOOP THAT NEVER STOPS</span>
          </p>
        </div>
      </section>

      {/* ================= ACT 4 · THE LOOP (sticky steps) ================= */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        className="relative z-10 h-[280vh]"
      >
        <div className="sticky top-0 flex h-svh items-center px-6">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-fusion">
                03 · THE LOOP
              </div>
              <h2 data-reveal style={delay(100)} className="display-lg mb-8">
                Watch a<br />
                <span className="text-glow font-serif font-normal italic text-fusion">discovery</span>
                <br />
                happen.
              </h2>
              <p data-reveal style={delay(200)} className="max-w-md text-lg font-medium leading-relaxed text-paper/70">
                Thousands of candidates enter the funnel. Only the validated few reach
                the bottom. Keep scrolling. Each pass makes the engine smarter.
              </p>
            </div>
            <ol className="flex flex-col gap-3">
              {STEPS.map((s, k) => (
                <li
                  key={s.n}
                  className={`rounded-2xl border-2 p-6 transition-all duration-500 ${
                    step === k
                      ? "scale-100 border-fusion/60 bg-fusion/10 opacity-100 shadow-[0_0_40px_rgba(255,176,46,0.15)]"
                      : "scale-[0.98] border-paper/10 bg-white/[0.02] opacity-40"
                  }`}
                >
                  <div className="flex items-baseline gap-5">
                    <span className={`font-heading text-4xl font-bold ${step === k ? "text-fusion" : "text-paper/30"}`}>
                      {s.n}
                    </span>
                    <div>
                      <div className="font-heading text-2xl font-bold">{s.title}</div>
                      <p className={`text-base leading-relaxed text-paper/70 transition-all duration-500 ${step === k ? "mt-2 max-h-28 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
                        {s.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================= ACT 5 · NEXCON-03 ================= */}
      <section
        ref={(el) => { sectionRefs.current[4] = el; }}
        className="relative z-10 flex min-h-svh items-center px-6"
      >
        <div
          ref={(el) => { contentRefs.current[4] = el; }}
          className="mx-auto grid w-full max-w-6xl items-center gap-14 will-change-transform lg:grid-cols-2"
        >
          <div>
            <div
              data-reveal
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-plasma/15 px-5 py-2 font-mono text-sm font-bold tracking-widest text-plasma"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-plasma" />
              LIVE PRODUCT
            </div>
            <h2 data-reveal style={delay(100)} className="display-xl mb-8">
              NexCon<span className="text-glow text-plasma">-03</span>
            </h2>
            <p data-reveal style={delay(200)} className="mb-10 max-w-md text-xl font-medium leading-relaxed text-paper/80">
              Already discovering next-generation compound semiconductors: formation
              energy, bandgap, dopant energetics and synthesisability, evaluated
              autonomously.
            </p>
            <Link
              data-reveal
              style={delay(300)}
              href="/products"
              className="inline-flex items-center gap-2 text-lg font-bold text-plasma transition-all hover:gap-4 hover:text-ion"
            >
              See the full roadmap
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          <div data-reveal style={delay(250)}>
            <div className="grid grid-cols-2 gap-4">
              {MATERIALS.map((mat, k) => (
                <button
                  key={mat.name}
                  onMouseEnter={() => hoverMaterial(k)}
                  onMouseLeave={() => hoverMaterial(null)}
                  onFocus={() => hoverMaterial(k)}
                  onBlur={() => hoverMaterial(null)}
                  className={`rounded-2xl border-2 p-7 text-left backdrop-blur-md transition-all duration-300 ${
                    material === k
                      ? "scale-[1.04] border-current bg-white/10 shadow-[0_0_40px_-4px_currentColor]"
                      : "border-paper/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                  style={material === k ? { color: mat.tint } : undefined}
                >
                  <div className="font-heading text-3xl font-bold md:text-4xl">{mat.name}</div>
                  <div className="mt-2 font-mono text-[11px] font-bold tracking-widest text-paper/40">
                    MATERIAL FAMILY
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex min-h-14 items-center rounded-xl border border-paper/10 bg-white/[0.03] px-6 py-4 font-mono text-base font-medium text-paper/80">
              {material === null
                ? "Hover a material family to see the lattice respond"
                : MATERIALS[material].use}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACT 6 · HORIZON / CTA ================= */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        className="relative z-10 flex min-h-svh items-center px-6"
      >
        <div
          ref={(el) => { contentRefs.current[5] = el; }}
          className="mx-auto max-w-5xl py-24 text-center will-change-transform"
        >
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-photon">
            04 · HORIZON
          </div>
          <h2 data-reveal style={delay(100)} className="display-lg mb-12">
            One architecture.
            <br />
            <span className="gradient-text-warm font-serif font-normal italic">Many frontiers.</span>
          </h2>
          <div data-reveal style={delay(200)} className="mb-16 grid gap-4 sm:grid-cols-3">
            {ROADMAP.map((r) => (
              <div
                key={r.name}
                className="group rounded-2xl border-2 border-paper/10 bg-white/[0.03] p-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-paper/30"
              >
                <div className={`font-heading text-xl font-bold ${r.accent}`}>{r.name}</div>
                <div className="mt-2 text-base text-paper/70">{r.desc}</div>
                <div className="mt-4 font-mono text-sm font-bold tracking-widest text-paper/40">{r.when}</div>
              </div>
            ))}
          </div>
          <div data-reveal style={delay(320)} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="w-full rounded-full bg-nova-blue px-12 py-5 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-electron hover:shadow-[0_0_36px_rgba(47,107,240,0.6)] sm:w-auto"
            >
              Run your discovery session
            </Link>
            <Link
              href="/about"
              className="w-full rounded-full border-2 border-paper/25 px-12 py-5 text-lg font-bold text-paper transition-all hover:scale-105 hover:border-paper/60 hover:bg-paper/5 sm:w-auto"
            >
              Meet the team
            </Link>
          </div>
          <div data-reveal style={delay(440)} className="mt-16 font-mono text-sm font-bold tracking-[0.35em] text-paper/30">
            NX-LAB · ALL SYSTEMS NOMINAL · 24/7
          </div>
        </div>
      </section>

      {/* ================= OUR PARTNERS ================= */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-ion">
            OUR PARTNERS
          </div>
          <h2 data-reveal style={delay(100)} className="display-md mb-14">
            Built alongside{" "}
            <span className="text-glow font-serif font-normal italic text-ion">the best.</span>
          </h2>
          <div data-reveal style={delay(200)} className="grid gap-6 sm:grid-cols-2">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="group flex flex-col items-center gap-5 rounded-3xl border-2 border-paper/10 bg-white/[0.03] p-10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ion/60 hover:shadow-[0_0_44px_-8px_rgba(89,216,255,0.5)]"
              >
                <PartnerLogo name={p.name} logo={p.logo} initials={p.initials} />
                <div className="font-heading text-2xl font-bold">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
