import { Check, X } from "lucide-react";
import { motion } from "motion/react";

const traditional = [
  "Hosting required",
  "Plugins break",
  "Constant updates",
  "Multiple systems",
];

const ourWay = [
  "One clean system",
  "No plugins",
  "Minimal maintenance",
  "Built to last",
];

export default function DifferentiatorSection() {
  return (
    <section id="differentiator" className="py-28 md:py-36 relative">
      <div className="absolute inset-0 dot-grid-bg opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 leading-none tracking-tight max-w-3xl"
        >
          WHY THIS IS DIFFERENT
        </motion.h2>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[oklch(0.22_0_0)] mb-0">
          {/* Left: Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 border-b md:border-b-0 md:border-r border-[oklch(0.22_0_0)] bg-[oklch(0.10_0_0)]"
          >
            <p className="font-mono-label text-muted-foreground mb-8">
              Traditional websites
            </p>
            <ul className="space-y-5">
              {traditional.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <X className="w-4 h-4 text-red-500/70" />
                  </div>
                  <span className="font-body text-muted-foreground">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: What we build */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 bg-[oklch(0.11_0_0)]"
          >
            <p className="font-mono-label text-orange mb-8">What we build</p>
            <ul className="space-y-5">
              {ourWay.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-orange" />
                  </div>
                  <span className="font-body text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border border-t-0 border-[oklch(0.22_0_0)] bg-[oklch(0.09_0_0)] px-10 py-8 text-center"
        >
          <p className="font-body text-muted-foreground mb-2">
            Most websites are patched together.
          </p>
          <p className="font-display font-bold text-xl md:text-2xl text-foreground tracking-tight">
            Ours are built as one complete system.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
