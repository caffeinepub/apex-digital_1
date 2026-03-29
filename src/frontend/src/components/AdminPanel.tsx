import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Contact, ProjectSubmission } from "../backend";
import { createActorWithConfig } from "../config";

const ADMIN_PASSWORD = "apex2026admin";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function paymentBadgeClass(status: string): string {
  if (status === "paid")
    return "bg-green-400/20 text-green-400 border-green-400/30";
  if (status === "pending")
    return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
  return "bg-zinc-700/50 text-zinc-400 border-zinc-600/30";
}

type Screen = "login" | "loading" | "dashboard" | "error";

export default function AdminPanel() {
  const [screen, setScreen] = useState<Screen>("login");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  async function fetchData() {
    setScreen("loading");
    setErrorMsg("");
    try {
      const actor = await createActorWithConfig();
      const [projectsData, contactsData] = await Promise.all([
        actor.getProjects(),
        actor.getContacts(),
      ]);
      setProjects(projectsData);
      setContacts(contactsData);
      setScreen("dashboard");
    } catch (e: unknown) {
      setErrorMsg(
        e instanceof Error
          ? e.message
          : "Failed to load data from the network.",
      );
      setScreen("error");
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setPasswordError("");
      fetchData();
    } else {
      setPasswordError("Incorrect password. Try again.");
    }
  }

  function handleSignOut() {
    setScreen("login");
    setPassword("");
    setProjects([]);
    setContacts([]);
    setExpandedProject(null);
  }

  // --- LOGIN SCREEN ---
  if (screen === "login") {
    return (
      <div
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
        data-ocid="admin.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <p className="text-[#FF5C00] text-xs font-mono tracking-[0.25em] uppercase mb-3">
              APEX DIGITAL
            </p>
            <h1 className="text-white font-bold text-4xl tracking-tight font-display">
              ADMIN ACCESS
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-body">
              Restricted area. Authorized personnel only.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
            data-ocid="admin.modal"
          >
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#111] border-zinc-700 text-white placeholder:text-zinc-600 h-12 pl-11 rounded-none focus-visible:ring-0 focus-visible:border-[#FF5C00] font-body"
                data-ocid="admin.input"
                autoFocus
              />
            </div>

            {passwordError && (
              <p
                className="text-red-400 text-xs font-mono"
                data-ocid="admin.error_state"
              >
                {passwordError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#FF5C00] hover:bg-[#e05200] text-white font-display font-bold text-sm tracking-[0.15em] rounded-none border-0"
              data-ocid="admin.submit_button"
            >
              ENTER
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- LOADING SCREEN ---
  if (screen === "loading") {
    return (
      <div
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col gap-4"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 text-[#FF5C00] animate-spin" />
        <p className="text-zinc-400 text-xs font-mono tracking-widest uppercase">
          CONNECTING TO NETWORK...
        </p>
      </div>
    );
  }

  // --- ERROR SCREEN ---
  if (screen === "error") {
    return (
      <div
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col gap-6 px-4"
        data-ocid="admin.error_state"
      >
        <AlertCircle className="w-10 h-10 text-red-400" />
        <div className="text-center">
          <p className="text-white font-display font-bold text-xl mb-2">
            LOAD FAILED
          </p>
          <p className="text-zinc-500 text-sm font-body max-w-xs">{errorMsg}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchData}
            className="bg-[#FF5C00] hover:bg-[#e05200] text-white rounded-none font-display font-bold tracking-widest text-sm"
            data-ocid="admin.primary_button"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            RETRY
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-zinc-700 text-zinc-400 hover:text-white rounded-none font-mono text-xs tracking-widest"
            data-ocid="admin.secondary_button"
          >
            SIGN OUT
          </Button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      data-ocid="admin.panel"
    >
      {/* Top bar */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#FF5C00] text-xs font-mono tracking-[0.25em] uppercase">
            APEX DIGITAL
          </p>
          <h1 className="text-white font-display font-bold text-xl tracking-tight">
            ADMIN PANEL
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="text-zinc-400 hover:text-white font-mono text-xs tracking-widest"
          data-ocid="admin.secondary_button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          SIGN OUT
        </Button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Tabs defaultValue="projects">
          <TabsList className="bg-[#111] border border-zinc-800 rounded-none mb-8 p-0">
            <TabsTrigger
              value="projects"
              className="rounded-none font-mono text-xs tracking-widest px-6 py-3 data-[state=active]:bg-[#FF5C00] data-[state=active]:text-white text-zinc-400"
              data-ocid="admin.tab"
            >
              PROJECTS ({projects.length})
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="rounded-none font-mono text-xs tracking-widest px-6 py-3 data-[state=active]:bg-[#FF5C00] data-[state=active]:text-white text-zinc-400"
              data-ocid="admin.tab"
            >
              CONTACTS ({contacts.length})
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {projects.length === 0 ? (
              <div
                className="border border-zinc-800 p-16 text-center"
                data-ocid="admin.empty_state"
              >
                <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">
                  NO PROJECTS YET
                </p>
              </div>
            ) : (
              <div className="border border-zinc-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      {[
                        "PROJECT ID",
                        "PACKAGE",
                        "NAME",
                        "EMAIL",
                        "BUSINESS",
                        "PAYMENT",
                        "DATE",
                      ].map((h) => (
                        <TableHead
                          key={h}
                          className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase py-3"
                        >
                          {h}
                        </TableHead>
                      ))}
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p, idx) => (
                      <>
                        <TableRow
                          key={p.projectId}
                          className="border-zinc-800 hover:bg-zinc-900/60 cursor-pointer"
                          onClick={() =>
                            setExpandedProject(
                              expandedProject === p.projectId
                                ? null
                                : p.projectId,
                            )
                          }
                          data-ocid={`admin.row.item.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-[#FF5C00] text-xs">
                            {p.projectId.substring(0, 8).toUpperCase()}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-white uppercase">
                            {p.package}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-300">
                            {p.clientName}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-400">
                            {p.email}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-400">
                            {p.businessName}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 border uppercase ${paymentBadgeClass(p.paymentStatus)}`}
                            >
                              {p.paymentStatus}
                            </span>
                          </TableCell>
                          <TableCell className="text-zinc-500 text-xs font-mono">
                            {formatTimestamp(p.timestamp)}
                          </TableCell>
                          <TableCell>
                            {expandedProject === p.projectId ? (
                              <ChevronUp className="w-4 h-4 text-zinc-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-zinc-500" />
                            )}
                          </TableCell>
                        </TableRow>

                        {expandedProject === p.projectId && (
                          <TableRow
                            key={`${p.projectId}-detail`}
                            className="border-zinc-800 bg-zinc-900/40"
                          >
                            <TableCell colSpan={8} className="py-6 px-6">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                {[
                                  ["Business Type", p.businessType],
                                  ["What They Need", p.whatTheyNeed],
                                  ["Description", p.projectDescription],
                                  ["Pages", p.numberOfPages],
                                  ["Timeline", p.timeline],
                                  ["Content Readiness", p.contentReadiness],
                                  ["Current Website", p.currentWebsite],
                                  ["Inspiration Links", p.inspirationLinks],
                                  [
                                    "Contact Form",
                                    p.needsContactForm ? "Yes" : "No",
                                  ],
                                  ["Booking", p.needsBooking ? "Yes" : "No"],
                                  [
                                    "Payment Integration",
                                    p.needsPaymentIntegration ? "Yes" : "No",
                                  ],
                                  [
                                    "Dashboard/Admin",
                                    p.needsDashboard ? "Yes" : "No",
                                  ],
                                  [
                                    "Content Writing",
                                    p.needsContentWriting ? "Yes" : "No",
                                  ],
                                  [
                                    "Branding/Assets",
                                    p.needsBranding ? "Yes" : "No",
                                  ],
                                  ["TX Hash", p.transactionHash || "N/A"],
                                  ["Additional Notes", p.additionalNotes],
                                ].map(([label, value]) => (
                                  <div key={label as string}>
                                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">
                                      {label}
                                    </p>
                                    <p className="text-zinc-300 font-body text-xs break-words">
                                      {String(value) || "—"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            {contacts.length === 0 ? (
              <div
                className="border border-zinc-800 p-16 text-center"
                data-ocid="admin.empty_state"
              >
                <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">
                  NO CONTACTS YET
                </p>
              </div>
            ) : (
              <div className="border border-zinc-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      {["NAME", "EMAIL", "MESSAGE", "DATE"].map((h) => (
                        <TableHead
                          key={h}
                          className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase py-3"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c, idx) => (
                      <TableRow
                        key={`${c.email}-${c.timestamp}`}
                        className="border-zinc-800 hover:bg-zinc-900/60"
                        data-ocid={`admin.row.item.${idx + 1}`}
                      >
                        <TableCell className="text-sm text-zinc-300 font-body">
                          {c.name}
                        </TableCell>
                        <TableCell className="text-sm text-zinc-400 font-body">
                          {c.email}
                        </TableCell>
                        <TableCell className="text-sm text-zinc-400 font-body max-w-xs">
                          <p className="truncate">{c.message}</p>
                        </TableCell>
                        <TableCell className="text-zinc-500 text-xs font-mono">
                          {formatTimestamp(c.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
