import { Lock, Server, Wrench } from "lucide-react";
import { motion } from "motion/react";

const reasons = [
  {
    icon: Server,
    title: "Built as One System",
    description:
      "No separate backend, database, or API glue. Everything runs together cleanly.",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description:
      "No servers to attack. No plugins to exploit. Security is not added. It is built in.",
  },
  {
    icon: Wrench,
    title: "No Maintenance Cycle",
    description:
      "No updates breaking things. No version conflicts. No constant fixes.",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-28 md:py-36 relative">
      <div className="absolute inset-0 dot-grid-bg opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          WHY CHOOSE US
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 leading-none tracking-tight max-w-3xl"
        >
          WHY THIS IS DIFFERENT
        </motion.h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-ocid="reasons.list"
        >
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-8 border border-[oklch(0.22_0_0)] bg-[oklch(0.10_0_0)]"
                data-ocid={`reasons.item.${i + 1}`}
              >
                <div className="w-10 h-10 flex items-center justify-center border border-orange/40 mb-5">
                  <Icon className="w-5 h-5 text-orange" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
