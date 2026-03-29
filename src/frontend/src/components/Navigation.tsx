import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import WalletConnect from "./WalletConnect";

const links = [
  { label: "WHAT WE DO", href: "#what-we-do" },
  { label: "WHY US", href: "#why-us" },
  { label: "PRICING", href: "#pricing" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = links.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`);
          return;
        }
      }
      setActive("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const id = href.slice(1);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.08_0_0/0.85)] backdrop-blur-md border-b border-[oklch(0.22_0_0)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 font-display font-bold text-xl tracking-tight"
          data-ocid="nav.link"
        >
          <span className="w-5 h-5 bg-orange rotate-45 inline-block" />
          <span className="text-foreground">APEX</span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleNav(link.href)}
                data-ocid="nav.link"
                className={`font-mono-label text-xs transition-colors duration-200 ${
                  active === link.href
                    ? "text-orange border-b-2 border-orange pb-0.5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right side: WalletConnect + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <WalletConnect />
          <Button
            onClick={() => handleNav("#contact")}
            data-ocid="nav.primary_button"
            className="bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-wider px-6 rounded-none border-0"
          >
            GET STARTED
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[oklch(0.10_0_0)] border-b border-[oklch(0.22_0_0)]"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="font-mono-label text-xs text-muted-foreground hover:text-orange transition-colors"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="flex flex-col gap-3">
                <WalletConnect />
                <Button
                  onClick={() => handleNav("#contact")}
                  className="w-full bg-orange text-white font-display font-bold text-sm rounded-none"
                  data-ocid="nav.primary_button"
                >
                  GET STARTED
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
