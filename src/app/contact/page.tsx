"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mgoqzwoq", {
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
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-20 animate-fade-in-up">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Request Access</h1>
        <p className="text-lg text-ink/70 dark:text-paper/70">
          Partner with NovAtom Labs or request access to the NexCon-03 platform.
        </p>
      </div>

      <div className="p-8 md:p-10 rounded-3xl glass-dark border border-ink/10 dark:border-paper/10 relative overflow-hidden">
        {status === "success" ? (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Transmission Received</h3>
            <p className="text-ink/70 dark:text-paper/70">We will be in touch shortly.</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-8 px-6 py-2 rounded-full border border-ink/20 dark:border-paper/20 hover:bg-ink/5 dark:hover:bg-paper/5 transition-colors text-sm"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 opacity-80">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                className="w-full px-4 py-3 rounded-xl bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 focus:outline-none focus:border-nova-blue transition-colors"
                placeholder="Dr. Jane Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 opacity-80">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                className="w-full px-4 py-3 rounded-xl bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 focus:outline-none focus:border-nova-blue transition-colors"
                placeholder="jane@university.edu"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 opacity-80">Message / Request</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 focus:outline-none focus:border-nova-blue transition-colors resize-none"
                placeholder="How can NovAtom Labs help accelerate your research?"
              />
            </div>

            {status === "error" && (
              <div className="text-red-500 text-sm">An error occurred. Please try again.</div>
            )}

            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full py-4 rounded-xl bg-nova-blue text-white font-semibold transition-all hover:bg-electron disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Transmitting..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
