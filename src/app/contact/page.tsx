"use client";

import { useState } from "react";
import AmbientBackground from "@/components/experience/AmbientBackground";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mojoyejy", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border-2 border-paper/10 bg-white/5 px-5 py-4 text-lg font-medium backdrop-blur-sm transition-all focus:border-photon focus:shadow-[0_0_28px_rgba(255,92,157,0.25)] focus:outline-none";

  return (
    <>
      <AmbientBackground accent="#ff5c9d" secondary="#9d7bff" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-16 text-center">
          <div data-reveal className="mb-6 font-mono text-sm font-bold tracking-[0.35em] text-photon">
            REQUEST ACCESS
          </div>
          <h1 data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="display-lg mb-8">
            Run your
            <br />
            <span className="text-glow font-serif font-normal italic text-photon">discovery</span>{" "}
            session.
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
            className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-paper/80"
          >
            Partner with NovAtom Labs or request access to the NexCon-03 platform.
          </p>
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
          className="relative overflow-hidden rounded-3xl border-2 border-photon/20 bg-white/5 p-8 backdrop-blur-md md:p-12"
        >
          {status === "success" ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-plasma/20 text-plasma">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-3xl font-bold md:text-4xl">Transmission received.</h3>
              <p className="text-lg text-paper/70">We will be in touch shortly.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-10 rounded-full border-2 border-paper/20 px-8 py-3 text-base font-bold transition-all hover:scale-105 hover:border-paper/60 hover:bg-paper/5"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label htmlFor="name" className="mb-3 block font-mono text-sm font-bold tracking-widest text-paper/60">
                  NAME
                </label>
                <input type="text" id="name" name="name" required className={inputClass} placeholder="Dr. Jane Doe" />
              </div>

              <div>
                <label htmlFor="email" className="mb-3 block font-mono text-sm font-bold tracking-widest text-paper/60">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={inputClass}
                  placeholder="jane@university.edu"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-3 block font-mono text-sm font-bold tracking-widest text-paper/60">
                  MESSAGE / REQUEST
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className={`${inputClass} resize-none`}
                  placeholder="How can NovAtom Labs help accelerate your research?"
                />
              </div>

              {status === "error" && (
                <div className="text-base font-bold text-photon">An error occurred. Please try again.</div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-gradient-to-r from-photon to-quantum py-5 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(255,92,157,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Transmitting…" : "Send message →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
