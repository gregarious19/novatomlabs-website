"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Technology", path: "/technology" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 z-50 group">
          <Image
            src="/assets/novatom-logo-horizontal.svg"
            alt="NovAtom Labs Logo"
            width={320}
            height={80}
            style={{ width: "320px", height: "auto" }}
            className="dark:hidden transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <Image
            src="/assets/novatom-logo-horizontal-white.svg"
            alt="NovAtom Labs Logo"
            width={320}
            height={80}
            style={{ width: "320px", height: "auto" }}
            className="hidden dark:block transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-nova-blue ${
                pathname === link.path ? "text-nova-blue" : "text-ink/70 dark:text-paper/70"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-ink dark:bg-paper text-paper dark:text-ink text-sm font-semibold transition-all hover:scale-105 hover:bg-nova-blue dark:hover:bg-nova-blue dark:hover:text-white"
          >
            Request Access
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-end">
            <span
              className={`h-0.5 bg-ink dark:bg-paper transition-all duration-300 ${
                mobileMenuOpen ? "w-6 rotate-45 translate-y-2.5" : "w-6"
              }`}
            />
            <span
              className={`h-0.5 bg-ink dark:bg-paper transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : "w-4"
              }`}
            />
            <span
              className={`h-0.5 bg-ink dark:bg-paper transition-all duration-300 ${
                mobileMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"
              }`}
            />
          </div>
        </button>

        {/* Mobile Nav Menu */}
        <div
          className={`fixed inset-0 bg-paper dark:bg-ink flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out md:hidden ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-2xl font-heading transition-colors hover:text-nova-blue ${
                pathname === link.path ? "text-nova-blue" : "text-ink dark:text-paper"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-4 px-8 py-4 rounded-full bg-ink dark:bg-paper text-paper dark:text-ink text-lg font-semibold transition-transform hover:scale-105"
            onClick={() => setMobileMenuOpen(false)}
          >
            Request Access
          </Link>
        </div>
      </div>
    </header>
  );
}
