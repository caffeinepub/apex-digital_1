import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useICPStats } from "@/hooks/useICPStats";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

const words = [
  { text: "NO HOSTING.", orange: false },
  { text: "NO PLUGINS.", orange: false },
  { text: "NO BREAKING.", orange: true },
];

function formatLarge(n: number | null): string {
  if (n === null) return "...";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const icpStats = useICPStats();

  const tickerItems = useMemo(
    () => [
      `ICP NETWORK: ${
        icpStats.status === "LOADING" ? "CONNECTING..." : icpStats.status
      }`,
      icpStats.canisterCount !== null
        ? `TOTAL CANISTERS: ${formatLarge(icpStats.canisterCount)}`
        : "TOTAL CANISTERS: ...",
      icpStats.subnetCount !== null
        ? `SUBNETS: ${formatLarge(icpStats.subnetCount)}`
        : "SUBNETS: ...",
      icpStats.blocksFinalized !== null
        ? `BLOCKS FINALIZED: ${formatLarge(icpStats.blocksFinalized)}`
        : "BLOCKS FINALIZED: ...",
      icpStats.icpPrice !== null
        ? `ICP PRICE: $${icpStats.icpPrice.toFixed(2)}`
        : "ICP PRICE: ...",
    ],
    [icpStats],
  );

  const allTicker = useMemo(
    () => [
      ...tickerItems.map((label, pos) => ({ id: `a-${pos}`, label })),
      ...tickerItems.map((label, pos) => ({ id: `b-${pos}`, label })),
    ],
    [tickerItems],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    const particles: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      vx: number;
      vy: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,240,240,${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollToNext = () => {
    document
      .getElementById("what-we-do")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const isOperational = icpStats.status === "OPERATIONAL";
  const isLoading = icpStats.status === "LOADING";

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      id="hero"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, oklch(0.08 0 0) 100%)",
          zIndex: 1,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-start w-full">
        {/* Live ICP Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <Badge
            variant="outline"
            data-ocid="hero.panel"
            className="border-orange text-orange font-mono-label px-4 py-1.5 rounded-full bg-transparent"
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 inline-block ${
                isLoading
                  ? "bg-yellow-500 animate-pulse"
                  : isOperational
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
              }`}
            />
            ICP NETWORK: {isLoading ? "CONNECTING" : icpStats.status}
          </Badge>

          {icpStats.blocksFinalized !== null && (
            <span className="font-mono-label text-[10px] text-muted-foreground/70 border border-[oklch(0.22_0_0)] px-3 py-1 rounded-full">
              BLOCKS FINALIZED: {formatLarge(icpStats.blocksFinalized)}
            </span>
          )}

          {icpStats.canisterCount !== null && (
            <span className="font-mono-label text-[10px] text-muted-foreground/70 border border-[oklch(0.22_0_0)] px-3 py-1 rounded-full">
              CANISTERS: {formatLarge(icpStats.canisterCount)}
            </span>
          )}

          {icpStats.icpPrice !== null && (
            <span className="font-mono-label text-[10px] text-muted-foreground/70 border border-[oklch(0.22_0_0)] px-3 py-1 rounded-full">
              ICP: ${icpStats.icpPrice.toFixed(2)}
            </span>
          )}
        </motion.div>

        <div className="mb-8">
          {words.map((word, i) => (
            <motion.div
              key={word.text}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1
                className={`font-display font-bold leading-none tracking-tight select-none
                  text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem]
                  ${word.orange ? "text-orange" : "text-foreground"}`}
              >
                {word.text}
              </h1>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-muted-foreground text-base md:text-lg max-w-xl mb-10 font-body leading-relaxed"
        >
          Websites and client systems built fully on the Internet Computer.
          Secure, stable, and built to last.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <Button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="hero.primary_button"
            className="bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-wider px-8 py-6 rounded-none border-0 group"
          >
            START A PROJECT
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="hero.secondary_button"
            className="border-foreground/30 text-foreground hover:bg-foreground/10 font-display font-bold text-sm tracking-wider px-8 py-6 rounded-none bg-transparent"
          >
            SEE PRICING
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="font-mono-label text-muted-foreground/60 text-xs"
        >
          Runs entirely on-chain. No servers. No maintenance headaches.
        </motion.p>
      </div>

      {/* Live ICP Stats Ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[oklch(0.22_0_0)] bg-[oklch(0.10_0_0/0.8)] py-3 overflow-hidden z-10">
        <div className="flex overflow-hidden">
          <div className="ticker-track">
            {allTicker.map(({ id, label }) => (
              <span
                key={id}
                className="font-mono-label text-muted-foreground flex items-center gap-4"
              >
                {label}
                <span className="text-orange">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-16 right-8 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors z-10"
        data-ocid="hero.button"
      >
        <span className="font-mono-label">SCROLL</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
