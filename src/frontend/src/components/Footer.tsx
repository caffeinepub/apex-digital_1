import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

const navLinks = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Why Us", href: "#why-us" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const handleNav = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[oklch(0.22_0_0)] bg-[oklch(0.07_0_0)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & tagline */}
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl mb-3">
              <span className="w-4 h-4 bg-orange rotate-45 inline-block" />
              <span className="text-foreground">APEX</span>
            </div>
            <p className="text-muted-foreground text-sm font-body max-w-xs leading-relaxed">
              Built once. Built properly. Simple if you need simple. Powerful if
              you need more.
            </p>
          </div>

          {/* Nav links */}
          <div className="md:text-center">
            <p className="font-mono-label text-muted-foreground mb-5">
              NAVIGATION
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="text-muted-foreground hover:text-orange transition-colors text-sm font-body"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <p className="font-mono-label text-muted-foreground mb-5">
              FOLLOW US
            </p>
            <div className="flex gap-4 md:justify-end">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[oklch(0.22_0_0)] flex items-center justify-center text-muted-foreground hover:text-orange hover:border-orange transition-colors"
                data-ocid="footer.link"
              >
                <SiX size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[oklch(0.22_0_0)] flex items-center justify-center text-muted-foreground hover:text-orange hover:border-orange transition-colors"
                data-ocid="footer.link"
              >
                <SiLinkedin size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[oklch(0.22_0_0)] flex items-center justify-center text-muted-foreground hover:text-orange hover:border-orange transition-colors"
                data-ocid="footer.link"
              >
                <SiGithub size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[oklch(0.18_0_0)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-body">
            &copy; {year} APEX Studio. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs font-body">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
