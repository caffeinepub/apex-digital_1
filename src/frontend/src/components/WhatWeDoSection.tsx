import { ArrowRight, Code2, Layers, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Lightbulb,
    title: "Strategy & Consulting",
    description:
      "We define what actually needs to be built. No wasted features, no guesswork.",
  },
  {
    icon: Layers,
    title: "Product Design",
    description:
      "Clean, modern interfaces that are easy to use and built to convert.",
  },
  {
    icon: Code2,
    title: "Engineering & Development",
    description:
      "Stable systems built without the usual complexity, plugins, or fragile stacks.",
  },
];

export default function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="py-28 md:py-36 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          OUR SERVICES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-foreground mb-16 leading-none tracking-tight"
        >
          WHAT WE BUILD
        </motion.h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-ocid="services.list"
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="card-hover group p-8 border border-[oklch(0.22_0_0)] bg-[oklch(0.11_0_0)] relative overflow-hidden cursor-pointer"
                data-ocid={`services.item.${i + 1}`}
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-orange opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                <div className="mb-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-orange/30 mb-6 group-hover:border-orange transition-colors duration-300">
                    <Icon className="w-6 h-6 text-orange" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-body">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-orange font-mono-label opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
