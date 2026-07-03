import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-ink/40 backdrop-blur-md border-t border-ink/10 dark:border-paper/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-4 max-w-xs">
          <Link href="/">
            <Image
              src="/assets/novatom-logo-horizontal.svg"
              alt="NovAtom Labs Logo"
              width={140}
              height={35}
              style={{ width: "140px", height: "auto" }}
              className="dark:hidden"
            />
            <Image
              src="/assets/novatom-logo-horizontal-white.svg"
              alt="NovAtom Labs Logo"
              width={140}
              height={35}
              style={{ width: "140px", height: "auto" }}
              className="hidden dark:block"
            />
          </Link>
          <p className="text-sm text-ink/60 dark:text-paper/60">
            A hyperautomated research lab discovering new frontiers, 24/7.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-ink/40 dark:text-paper/40 tracking-wider">LAB</span>
            <Link href="/technology" className="hover:text-nova-blue transition-colors">Technology</Link>
            <Link href="/products" className="hover:text-nova-blue transition-colors">Products</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-ink/40 dark:text-paper/40 tracking-wider">COMPANY</span>
            <Link href="/about" className="hover:text-nova-blue transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-nova-blue transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-ink/40 dark:text-paper/40 tracking-wider">SYSTEM</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-ink/60 dark:text-paper/60">All Systems Normal</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-ink/5 dark:border-paper/5 text-xs text-ink/40 dark:text-paper/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} NovAtom Labs. All rights reserved.</p>
        <p className="font-mono tracking-widest">NX-LAB · v0.4.0</p>
      </div>
    </footer>
  );
}
