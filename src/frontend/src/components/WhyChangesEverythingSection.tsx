import { motion } from "motion/react";

const points = [
  "No servers to manage",
  "No hosting accounts",
  "No plugin vulnerabilities",
  "No database leaks",
];

export default function WhyChangesEverythingSection() {
  return (
    <section id="why-changes" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 dot-grid-bg opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-12 leading-none tracking-tight max-w-3xl"
        >
          WHY THIS CHANGES EVERYTHING
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-5 p-6 border border-[oklch(0.22_0_0)] bg-[oklch(0.10_0_0)]"
            >
              <span className="text-orange font-display font-bold text-xl shrink-0">
                0{i + 1}
              </span>
              <span className="font-body text-foreground text-base">
                {point}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-muted-foreground text-lg max-w-2xl border-l-2 border-orange pl-6"
        >
          Your website runs as one complete system. Frontend, backend, and
          storage all in one place.
        </motion.p>
      </div>
    </section>
  );
}
