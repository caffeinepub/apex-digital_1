import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    name: "STARTER",
    price: "$200",
    period: "",
    description: "For simple business websites.",
    features: [
      "1 to 2 pages",
      "Mobile responsive",
      "Contact form",
      "Fast delivery",
    ],
    cta: "GET STARTED",
    highlight: false,
  },
  {
    name: "GROWTH",
    price: "$500",
    period: "",
    description: "For businesses that need more than just a website.",
    features: [
      "1 to 6 pages",
      "Custom design",
      "Forms with data capture",
      "Light backend functionality",
    ],
    cta: "START WITH GROWTH",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    name: "PRO",
    price: "$7,500+",
    period: "",
    description: "Full system, not just a website.",
    features: [
      "User accounts / login",
      "Admin dashboard",
      "CRM-style backend",
      "Custom workflows",
    ],
    cta: "START WITH PRO",
    highlight: false,
  },
  {
    name: "ENTERPRISE",
    price: "CUSTOM",
    period: "",
    description: "For advanced builds and unique requirements.",
    features: [
      "Unlimited scope",
      "Advanced backend logic",
      "Custom integrations",
      "Full ownership",
    ],
    cta: "CONTACT US",
    highlight: false,
  },
];

export default function PricingSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-28 md:py-36 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          INVESTMENT
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-none tracking-tight"
        >
          SIMPLE PRICING
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-xl mb-16 font-body"
        >
          No hidden costs. No ongoing headaches. Just clear pricing.
        </motion.p>

        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch"
          data-ocid="pricing.list"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex flex-col p-8 border ${
                plan.highlight
                  ? "border-orange glow-orange bg-[oklch(0.12_0_0)] md:scale-105"
                  : "border-[oklch(0.22_0_0)] bg-[oklch(0.10_0_0)]"
              }`}
              data-ocid={`pricing.item.${i + 1}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-orange text-white font-mono-label px-4 py-1 rounded-none">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <p className="font-mono-label text-muted-foreground mb-4">
                {plan.name}
              </p>

              <div className="mb-4 flex items-end gap-1">
                <span
                  className={`font-display font-bold text-5xl ${
                    plan.highlight ? "text-orange" : "text-foreground"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-muted-foreground mb-1 font-body">
                    {plan.period}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm mb-8 font-body">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm font-body"
                  >
                    <Check className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToContact}
                data-ocid={`pricing.primary_button.${i + 1}`}
                className={`w-full font-display font-bold text-sm tracking-wider py-6 rounded-none ${
                  plan.highlight
                    ? "bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white border-0"
                    : "bg-transparent border border-[oklch(0.3_0_0)] text-foreground hover:border-orange hover:text-orange"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-mono-label text-muted-foreground text-center mt-10 text-sm"
        >
          Built on the Internet Computer. No hosting fees, no plugin
          maintenance, no fragile stack.
        </motion.p>
      </div>
    </section>
  );
}
