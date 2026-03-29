import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useSubmitContact } from "../hooks/useQueries";

const contactInfo = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "info@apexbuilders.xyz",
  },
  {
    icon: MapPin,
    label: "LOCATION",
    value: "Worldwide",
  },
];

function AnimatedCheckmark({ animate }: { animate: boolean }) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Message sent successfully"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        stroke="#FF5C00"
        strokeWidth="3"
        fill="transparent"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          animate
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M28 50 L44 66 L72 36"
        stroke="#FF5C00"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          animate
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
}

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { isFetching: actorLoading } = useActor();
  const { mutate, isPending } = useSubmitContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    mutate(
      { name, email, message },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  };

  const inputClass =
    "bg-[oklch(0.12_0_0)] border-[oklch(0.22_0_0)] text-foreground placeholder:text-muted-foreground focus:border-orange focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-12 font-body";

  return (
    <section id="contact" className="py-28 md:py-36 relative">
      <div className="absolute inset-0 bg-[oklch(0.09_0_0)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono-label text-orange mb-4"
        >
          GET IN TOUCH
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-foreground mb-16 leading-none tracking-tight"
        >
          LET'S BUILD SOMETHING THAT WORKS.
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground font-body mb-10 text-lg leading-relaxed">
              Tell us what you need. We'll help you build it clean, simple, and
              built to last.
            </p>

            <ul className="space-y-8">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <li key={info.label} className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-orange/40 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-orange" />
                    </div>
                    <div>
                      <p className="font-mono-label text-muted-foreground mb-1">
                        {info.label}
                      </p>
                      <p className="font-body text-foreground">{info.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ perspective: 1200 }}
            className="min-h-[480px]"
          >
            <motion.div
              animate={{ rotateY: submitted ? 180 : 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d", position: "relative" }}
              className="w-full h-full min-h-[480px]"
            >
              {/* Front face: form */}
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="absolute inset-0"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  data-ocid="contact.modal"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-name"
                      className="font-mono-label text-muted-foreground"
                    >
                      NAME
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      data-ocid="contact.input"
                      disabled={isPending || actorLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-email"
                      className="font-mono-label text-muted-foreground"
                    >
                      EMAIL
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      data-ocid="contact.input"
                      disabled={isPending || actorLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-message"
                      className="font-mono-label text-muted-foreground"
                    >
                      MESSAGE
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your project..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className={`${inputClass} h-auto resize-none`}
                      data-ocid="contact.textarea"
                      disabled={isPending || actorLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || actorLoading}
                    data-ocid="contact.submit_button"
                    className="w-full bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-wider py-6 rounded-none border-0 group"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {isPending && (
                    <p
                      className="font-mono-label text-muted-foreground text-center"
                      data-ocid="contact.loading_state"
                    >
                      TRANSMITTING...
                    </p>
                  )}
                </form>
              </div>

              {/* Back face: success */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[oklch(0.12_0_0)] border border-[oklch(0.22_0_0)] px-8"
                data-ocid="contact.success_state"
              >
                <AnimatedCheckmark animate={submitted} />

                <div className="text-center space-y-3">
                  <h3 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight">
                    MESSAGE SENT!
                  </h3>
                  <p className="font-body text-muted-foreground text-base leading-relaxed max-w-xs">
                    We'll review your message and get back to you with more
                    details shortly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  className="font-mono-label text-orange border border-orange/40 px-6 py-2 hover:bg-orange/10 transition-colors"
                  data-ocid="contact.secondary_button"
                >
                  SEND ANOTHER
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
