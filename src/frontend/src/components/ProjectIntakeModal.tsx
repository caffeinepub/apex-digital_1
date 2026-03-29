import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { backendInterface } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useEvmWallet } from "../hooks/useEvmWallet";
import WalletPickerModal from "./WalletPickerModal";

const OWNER_ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

const ETH_AMOUNTS: Record<string, string> = {
  STARTER: "0x2386F26FC10000",
  GROWTH: "0x5AF3107A4000",
  PRO: "0x16345785D8A0000",
  ENTERPRISE: "0",
};

interface ProjectIntakeModalProps {
  planName: string;
  planPrice: string;
  onClose: () => void;
}

type YesNo = "yes" | "no" | "";

interface FormData {
  clientName: string;
  email: string;
  businessName: string;
  currentWebsite: string;
  businessType: string;
  whatTheyNeed: string;
  projectDescription: string;
  numberOfPages: string;
  needsContactForm: YesNo;
  needsBooking: YesNo;
  needsPaymentIntegration: YesNo;
  needsDashboard: YesNo;
  needsContentWriting: YesNo;
  needsBranding: YesNo;
  inspirationLinks: string;
  timeline: string;
  contentReadiness: string;
  additionalNotes: string;
}

const initialForm: FormData = {
  clientName: "",
  email: "",
  businessName: "",
  currentWebsite: "",
  businessType: "",
  whatTheyNeed: "",
  projectDescription: "",
  numberOfPages: "",
  needsContactForm: "",
  needsBooking: "",
  needsPaymentIntegration: "",
  needsDashboard: "",
  needsContentWriting: "",
  needsBranding: "",
  inspirationLinks: "",
  timeline: "",
  contentReadiness: "",
  additionalNotes: "",
};

const TIMELINES = [
  "As soon as possible",
  "Within 2 weeks",
  "Within a month",
  "1 to 3 months",
  "Flexible",
];

const CONTENT_READINESS = [
  "Ready",
  "Mostly ready",
  "Need help creating content",
];

const labelClass =
  "font-mono-label text-[10px] tracking-widest text-[oklch(0.55_0_0)] uppercase";

function YesNoToggle({
  value,
  onChange,
  label,
  id,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
  label: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          data-ocid={`intake.${id}_yes`}
          onClick={() => onChange("yes")}
          className={`flex-1 py-2.5 font-mono-label text-xs tracking-wider border transition-colors duration-150 ${
            value === "yes"
              ? "bg-orange border-orange text-white"
              : "bg-transparent border-[oklch(0.25_0_0)] text-[oklch(0.5_0_0)] hover:border-[oklch(0.4_0_0)] hover:text-foreground"
          }`}
        >
          YES
        </button>
        <button
          type="button"
          data-ocid={`intake.${id}_no`}
          onClick={() => onChange("no")}
          className={`flex-1 py-2.5 font-mono-label text-xs tracking-wider border transition-colors duration-150 ${
            value === "no"
              ? "bg-[oklch(0.22_0_0)] border-[oklch(0.35_0_0)] text-foreground"
              : "bg-transparent border-[oklch(0.25_0_0)] text-[oklch(0.5_0_0)] hover:border-[oklch(0.4_0_0)] hover:text-foreground"
          }`}
        >
          NO
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>{label}</span>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[oklch(0.10_0_0)] border border-[oklch(0.22_0_0)] text-foreground font-body text-sm px-4 py-3 outline-none focus:border-orange transition-colors duration-150 rounded-none placeholder:text-[oklch(0.35_0_0)]";

const selectClass =
  "w-full bg-[oklch(0.10_0_0)] border border-[oklch(0.22_0_0)] text-foreground font-body text-sm px-4 py-3 outline-none focus:border-orange transition-colors duration-150 rounded-none";

const textareaClass =
  "w-full bg-[oklch(0.10_0_0)] border border-[oklch(0.22_0_0)] text-foreground font-body text-sm px-4 py-3 outline-none focus:border-orange transition-colors duration-150 rounded-none resize-none placeholder:text-[oklch(0.35_0_0)]";

export default function ProjectIntakeModal({
  planName,
  planPrice,
  onClose,
}: ProjectIntakeModalProps) {
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const [form, setForm] = useState<FormData>(initialForm);
  const [projectId, setProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const { actor } = useActor();
  const backend = actor as unknown as backendInterface;

  const { address, isConnected, isConnecting, connect } = useEvmWallet();

  const isEnterprise = planName === "ENTERPRISE";
  const isStarter = planName === "STARTER";

  const set = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a local project ID immediately so review always has one
    const localId = `APEX-${Date.now().toString(36).toUpperCase()}`;
    setProjectId(localId);

    // Attempt to persist to backend, but never block the review transition
    if (backend) {
      try {
        const id = await backend.submitProject(
          planName,
          form.clientName,
          form.email,
          form.businessName,
          form.currentWebsite,
          form.businessType,
          form.whatTheyNeed,
          form.projectDescription,
          form.numberOfPages,
          form.needsContactForm === "yes",
          form.needsBooking === "yes",
          form.needsPaymentIntegration === "yes",
          form.needsDashboard === "yes",
          form.needsContentWriting === "yes",
          form.needsBranding === "yes",
          form.inspirationLinks,
          form.timeline,
          form.contentReadiness,
          form.additionalNotes,
        );
        // Use backend-assigned ID if available
        setProjectId(id);
      } catch {
        // Backend unavailable — keep the local ID, still advance to review
      }
    }

    setIsSubmitting(false);
    setStep("review");
  };

  const doPayment = async () => {
    if (!isConnected || !address) {
      setWalletPickerOpen(true);
      return;
    }
    const value = ETH_AMOUNTS[planName] ?? ETH_AMOUNTS.PRO;
    setIsPaying(true);
    setPayError("");
    try {
      const txHash: string = await window.ethereum?.request({
        method: "eth_sendTransaction",
        params: [{ from: address, to: OWNER_ETH_ADDRESS, value }],
      });
      if (backend) {
        await backend.updatePaymentStatus(projectId, "paid", txHash);
      }
      setStep("success");
    } catch (err: any) {
      setPayError(err?.message ?? "Transaction failed or was rejected.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleMetaMaskConnect = async () => {
    await connect();
    setTimeout(() => doPayment(), 300);
  };

  const summaryEntries: { label: string; value: string }[] = [
    { label: "PACKAGE", value: `${planName} ${planPrice}` },
    { label: "PROJECT ID", value: projectId },
    { label: "NAME", value: form.clientName },
    { label: "EMAIL", value: form.email },
    { label: "BUSINESS", value: form.businessName },
    form.currentWebsite
      ? { label: "CURRENT WEBSITE", value: form.currentWebsite }
      : null,
    form.businessType ? { label: "INDUSTRY", value: form.businessType } : null,
    { label: "WHAT THEY NEED", value: form.whatTheyNeed },
    form.projectDescription
      ? { label: "PROJECT DESCRIPTION", value: form.projectDescription }
      : null,
    form.numberOfPages
      ? { label: "NUMBER OF PAGES", value: form.numberOfPages }
      : null,
    form.needsContactForm
      ? { label: "CONTACT FORM", value: form.needsContactForm.toUpperCase() }
      : null,
    form.needsBooking
      ? { label: "BOOKING", value: form.needsBooking.toUpperCase() }
      : null,
    form.needsPaymentIntegration
      ? {
          label: "PAYMENT INTEGRATION",
          value: form.needsPaymentIntegration.toUpperCase(),
        }
      : null,
    form.needsDashboard
      ? { label: "DASHBOARD", value: form.needsDashboard.toUpperCase() }
      : null,
    form.needsContentWriting
      ? {
          label: "CONTENT WRITING",
          value: form.needsContentWriting.toUpperCase(),
        }
      : null,
    form.needsBranding
      ? { label: "BRANDING", value: form.needsBranding.toUpperCase() }
      : null,
    form.inspirationLinks
      ? { label: "INSPIRATION", value: form.inspirationLinks }
      : null,
    form.timeline ? { label: "TIMELINE", value: form.timeline } : null,
    form.contentReadiness
      ? { label: "CONTENT READINESS", value: form.contentReadiness }
      : null,
    form.additionalNotes
      ? { label: "ADDITIONAL NOTES", value: form.additionalNotes }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        data-ocid="intake.modal"
      >
        <motion.div
          className="relative w-full max-w-2xl mx-4 my-12 bg-[oklch(0.10_0_0)] border border-[oklch(0.18_0_0)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-[oklch(0.16_0_0)]">
            <div>
              <p className="font-mono-label text-orange text-[10px] tracking-widest mb-1">
                {step === "form"
                  ? "START YOUR PROJECT"
                  : step === "review"
                    ? "REVIEW YOUR PROJECT"
                    : "PROJECT CONFIRMED"}
              </p>
              <h2 className="font-display font-bold text-2xl tracking-tight text-foreground">
                {planName} <span className="text-orange">{planPrice}</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-ocid="intake.close_button"
              className="text-[oklch(0.4_0_0)] hover:text-foreground transition-colors p-2"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2L18 18M18 2L2 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              {step === "form" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  data-ocid="intake.form"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name">
                      <input
                        className={inputClass}
                        required
                        placeholder="Jane Smith"
                        value={form.clientName}
                        onChange={(e) => set("clientName", e.target.value)}
                        data-ocid="intake.input"
                      />
                    </FormField>
                    <FormField label="Email Address">
                      <input
                        type="email"
                        className={inputClass}
                        required
                        placeholder="jane@company.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        data-ocid="intake.input"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Business Name">
                      <input
                        className={inputClass}
                        required
                        placeholder="Acme Co."
                        value={form.businessName}
                        onChange={(e) => set("businessName", e.target.value)}
                        data-ocid="intake.input"
                      />
                    </FormField>
                    {!isEnterprise && (
                      <FormField label="Current Website (if any)">
                        <input
                          className={inputClass}
                          placeholder="https://..."
                          value={form.currentWebsite}
                          onChange={(e) =>
                            set("currentWebsite", e.target.value)
                          }
                          data-ocid="intake.input"
                        />
                      </FormField>
                    )}
                  </div>

                  {!isStarter && !isEnterprise && (
                    <FormField label="Business Type / Industry">
                      <input
                        className={inputClass}
                        placeholder="e.g. Real estate, SaaS, Healthcare"
                        value={form.businessType}
                        onChange={(e) => set("businessType", e.target.value)}
                        data-ocid="intake.input"
                      />
                    </FormField>
                  )}

                  <FormField
                    label={
                      isEnterprise
                        ? "What do you need?"
                        : "What do you need built?"
                    }
                  >
                    <textarea
                      className={textareaClass}
                      rows={4}
                      required
                      placeholder="Describe your project..."
                      value={form.whatTheyNeed}
                      onChange={(e) => set("whatTheyNeed", e.target.value)}
                      data-ocid="intake.textarea"
                    />
                  </FormField>

                  {!isStarter && !isEnterprise && (
                    <FormField label="Detailed Project Description">
                      <textarea
                        className={textareaClass}
                        rows={4}
                        placeholder="More detail about features, users, goals..."
                        value={form.projectDescription}
                        onChange={(e) =>
                          set("projectDescription", e.target.value)
                        }
                        data-ocid="intake.textarea"
                      />
                    </FormField>
                  )}

                  {!isEnterprise && (
                    <>
                      <FormField label="Number of Pages">
                        <input
                          className={inputClass}
                          placeholder="e.g. 3"
                          value={form.numberOfPages}
                          onChange={(e) => set("numberOfPages", e.target.value)}
                          data-ocid="intake.input"
                        />
                      </FormField>

                      <div className="grid grid-cols-2 gap-4">
                        <YesNoToggle
                          id="contact_form"
                          label="Needs Contact Form"
                          value={form.needsContactForm}
                          onChange={(v) => set("needsContactForm", v)}
                        />
                        {!isStarter && (
                          <>
                            <YesNoToggle
                              id="booking"
                              label="Needs Booking"
                              value={form.needsBooking}
                              onChange={(v) => set("needsBooking", v)}
                            />
                            <YesNoToggle
                              id="payment"
                              label="Needs Payment Integration"
                              value={form.needsPaymentIntegration}
                              onChange={(v) =>
                                set("needsPaymentIntegration", v)
                              }
                            />
                            <YesNoToggle
                              id="dashboard"
                              label="Needs Dashboard / Admin"
                              value={form.needsDashboard}
                              onChange={(v) => set("needsDashboard", v)}
                            />
                            <YesNoToggle
                              id="content"
                              label="Needs Content Writing"
                              value={form.needsContentWriting}
                              onChange={(v) => set("needsContentWriting", v)}
                            />
                            <YesNoToggle
                              id="branding"
                              label="Needs Branding / Assets"
                              value={form.needsBranding}
                              onChange={(v) => set("needsBranding", v)}
                            />
                          </>
                        )}
                      </div>

                      {!isStarter && (
                        <FormField label="Inspiration Links">
                          <input
                            className={inputClass}
                            placeholder="Sites you like, separated by commas"
                            value={form.inspirationLinks}
                            onChange={(e) =>
                              set("inspirationLinks", e.target.value)
                            }
                            data-ocid="intake.input"
                          />
                        </FormField>
                      )}

                      {!isStarter && (
                        <FormField label="Content Readiness">
                          <select
                            className={selectClass}
                            value={form.contentReadiness}
                            onChange={(e) =>
                              set("contentReadiness", e.target.value)
                            }
                            data-ocid="intake.select"
                          >
                            <option value="">Select...</option>
                            {CONTENT_READINESS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </FormField>
                      )}
                    </>
                  )}

                  <FormField label="Project Timeline">
                    <select
                      className={selectClass}
                      value={form.timeline}
                      onChange={(e) => set("timeline", e.target.value)}
                      data-ocid="intake.select"
                    >
                      <option value="">Select timeline...</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Additional Notes">
                    <textarea
                      className={textareaClass}
                      rows={3}
                      placeholder="Anything else we should know..."
                      value={form.additionalNotes}
                      onChange={(e) => set("additionalNotes", e.target.value)}
                      data-ocid="intake.textarea"
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-ocid="intake.submit_button"
                    className="w-full py-4 bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-widest transition-colors duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? "SUBMITTING..." : "REVIEW MY PROJECT"}
                  </button>
                </motion.form>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  data-ocid="intake.panel"
                >
                  <div className="mb-6">
                    <span className="inline-block font-mono-label text-[10px] tracking-widest bg-orange text-white px-3 py-1 mb-3">
                      {planName} {planPrice}
                    </span>
                    <p className="font-mono-label text-[oklch(0.4_0_0)] text-xs">
                      PROJECT ID:{" "}
                      <span className="text-orange">{projectId}</span>
                    </p>
                  </div>

                  <div className="border border-[oklch(0.16_0_0)] divide-y divide-[oklch(0.14_0_0)] mb-6">
                    {summaryEntries.map((entry) => (
                      <div
                        key={entry.label}
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-4 py-3"
                      >
                        <span className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)] sm:w-40 shrink-0 pt-0.5">
                          {entry.label}
                        </span>
                        <span className="font-body text-sm text-foreground">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-start gap-3 mb-6 p-4 border border-[oklch(0.2_0_0)] bg-[oklch(0.12_0_0)]"
                    data-ocid="intake.checkbox"
                  >
                    <Checkbox
                      id="confirm"
                      checked={confirmed}
                      onCheckedChange={(v) => setConfirmed(!!v)}
                      className="mt-0.5 border-[oklch(0.35_0_0)] data-[state=checked]:bg-orange data-[state=checked]:border-orange rounded-none"
                    />
                    <label
                      htmlFor="confirm"
                      className="font-body text-sm text-[oklch(0.7_0_0)] cursor-pointer leading-relaxed"
                    >
                      I confirm the project details above are accurate and I am
                      ready to proceed.
                    </label>
                  </div>

                  {payError && (
                    <p
                      className="font-mono-label text-[10px] text-red-400 mb-4 tracking-wider"
                      data-ocid="intake.error_state"
                    >
                      {payError}
                    </p>
                  )}

                  {isEnterprise ? (
                    <button
                      type="button"
                      disabled={!confirmed}
                      onClick={() => setStep("success")}
                      data-ocid="intake.confirm_button"
                      className="w-full py-4 bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-widest transition-colors duration-200 disabled:opacity-30"
                    >
                      CONFIRM CONSULTATION REQUEST
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!confirmed || isPaying}
                      onClick={doPayment}
                      data-ocid="intake.primary_button"
                      className="w-full py-4 bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-widest transition-colors duration-200 disabled:opacity-30"
                    >
                      {isPaying
                        ? "PROCESSING PAYMENT..."
                        : "PAY & START PROJECT"}
                    </button>
                  )}
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-10"
                  data-ocid="intake.success_state"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-orange flex items-center justify-center mx-auto mb-6">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 14L10 20L24 8"
                        stroke="#FF5C00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-3xl text-foreground mb-2">
                    {isEnterprise
                      ? "CONSULTATION REQUESTED"
                      : "PROJECT STARTED"}
                  </h3>
                  <p className="font-mono-label text-orange text-xs tracking-widest mb-6">
                    {projectId}
                  </p>
                  <p className="font-body text-[oklch(0.6_0_0)] text-sm">
                    We will be in touch within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    data-ocid="intake.close_button"
                    className="mt-8 px-8 py-3 border border-[oklch(0.25_0_0)] font-mono-label text-xs tracking-widest text-[oklch(0.5_0_0)] hover:border-orange hover:text-orange transition-colors duration-150"
                  >
                    CLOSE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <WalletPickerModal
        open={walletPickerOpen}
        onOpenChange={setWalletPickerOpen}
        onSelectMetaMask={handleMetaMaskConnect}
        isConnecting={isConnecting}
      />
    </AnimatePresence>
  );
}
