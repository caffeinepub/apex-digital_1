import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  Contact,
  ProjectSubmission,
  backendInterface,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

const ADMIN_PASSWORD = "apex2026admin";
const FETCH_TIMEOUT_MS = 6000;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

function formatTimestamp(ts: bigint): string {
  try {
    const ms = Number(ts / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown";
  }
}

function statusColor(status: string) {
  if (status === "paid") return "text-green-400";
  if (status === "pending") return "text-yellow-400";
  return "text-[oklch(0.45_0_0)]";
}

function ProjectRow({ project }: { project: ProjectSubmission }) {
  const [expanded, setExpanded] = useState(false);

  const details: { label: string; value: string }[] = [
    { label: "Business Name", value: project.businessName },
    { label: "Current Website", value: project.currentWebsite || "N/A" },
    { label: "Business Type", value: project.businessType || "N/A" },
    { label: "What They Need", value: project.whatTheyNeed },
    {
      label: "Project Description",
      value: project.projectDescription || "N/A",
    },
    { label: "Number of Pages", value: project.numberOfPages || "N/A" },
    { label: "Contact Form", value: project.needsContactForm ? "Yes" : "No" },
    { label: "Booking", value: project.needsBooking ? "Yes" : "No" },
    {
      label: "Payment Integration",
      value: project.needsPaymentIntegration ? "Yes" : "No",
    },
    { label: "Dashboard", value: project.needsDashboard ? "Yes" : "No" },
    {
      label: "Content Writing",
      value: project.needsContentWriting ? "Yes" : "No",
    },
    { label: "Branding", value: project.needsBranding ? "Yes" : "No" },
    { label: "Inspiration Links", value: project.inspirationLinks || "N/A" },
    { label: "Timeline", value: project.timeline || "N/A" },
    { label: "Content Readiness", value: project.contentReadiness || "N/A" },
    { label: "Additional Notes", value: project.additionalNotes || "N/A" },
    { label: "Transaction Hash", value: project.transactionHash || "N/A" },
  ];

  return (
    <>
      <TableRow
        className="border-[oklch(0.16_0_0)] hover:bg-[oklch(0.13_0_0)] cursor-pointer transition-colors"
        onClick={() => setExpanded((v) => !v)}
        data-ocid="admin.projects.row"
      >
        <TableCell className="font-mono-label text-xs text-orange">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            {project.projectId}
          </div>
        </TableCell>
        <TableCell className="font-mono-label text-xs text-[oklch(0.6_0_0)]">
          {project.package_}
        </TableCell>
        <TableCell className="font-body text-sm text-foreground">
          {project.clientName}
        </TableCell>
        <TableCell className="font-body text-sm text-[oklch(0.6_0_0)]">
          {project.email}
        </TableCell>
        <TableCell className="font-body text-sm text-[oklch(0.6_0_0)]">
          {project.businessName}
        </TableCell>
        <TableCell>
          <span
            className={`font-mono-label text-[10px] tracking-wider ${statusColor(
              project.paymentStatus,
            )}`}
          >
            {project.paymentStatus.toUpperCase() || "PENDING"}
          </span>
        </TableCell>
        <TableCell className="font-mono-label text-[10px] text-[oklch(0.4_0_0)]">
          {formatTimestamp(project.timestamp)}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="border-[oklch(0.16_0_0)] bg-[oklch(0.09_0_0)]">
          <TableCell colSpan={7} className="py-4 px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {details.map((d) => (
                <div key={d.label}>
                  <p className="font-mono-label text-[9px] tracking-widest text-[oklch(0.4_0_0)] mb-0.5">
                    {d.label.toUpperCase()}
                  </p>
                  <p className="font-body text-xs text-[oklch(0.65_0_0)] break-words">
                    {d.value}
                  </p>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { actor, isFetching } = useActor();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(null);
    } else {
      setPasswordError("Incorrect password.");
    }
  };

  useEffect(() => {
    if (!authed) return;
    // Actor still initializing — wait for it
    if (isFetching) return;
    // Actor failed to load
    if (!actor) {
      setLoading(false);
      setError("Could not connect to backend.");
      return;
    }

    const backend = actor as unknown as backendInterface;
    setLoading(true);
    setError(null);

    withTimeout(
      Promise.all([backend.getProjects(), backend.getContacts()]),
      FETCH_TIMEOUT_MS,
      [[], []] as [ProjectSubmission[], Contact[]],
    )
      .then(([p, c]) => {
        setProjects(p);
        setContacts(c);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  }, [authed, actor, isFetching]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="font-mono-label text-orange text-[10px] tracking-widest mb-2">
            APEX DIGITAL
          </p>
          <h1 className="font-display font-bold text-3xl text-foreground mb-8">
            ADMIN ACCESS
          </h1>
          <form
            onSubmit={handleLogin}
            className="space-y-4"
            data-ocid="admin.form"
          >
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError("");
              }}
              className="w-full bg-[oklch(0.10_0_0)] border border-[oklch(0.22_0_0)] text-foreground font-body text-sm px-4 py-3 outline-none focus:border-orange transition-colors rounded-none placeholder:text-[oklch(0.35_0_0)]"
              data-ocid="admin.input"
            />
            {passwordError && (
              <p
                className="font-mono-label text-[10px] text-red-400"
                data-ocid="admin.error_state"
              >
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-orange hover:bg-[oklch(0.6_0.22_37)] text-white font-display font-bold text-sm tracking-widest transition-colors"
              data-ocid="admin.submit_button"
            >
              ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Waiting for actor to initialize after login
  if (authed && isFetching) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p
          className="font-mono-label text-[10px] tracking-widest text-orange animate-pulse"
          data-ocid="admin.loading_state"
        >
          CONNECTING...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <div className="border-b border-[oklch(0.14_0_0)] px-8 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono-label text-orange text-[10px] tracking-widest">
            APEX DIGITAL
          </p>
          <h1 className="font-display font-bold text-xl tracking-tight">
            ADMIN PANEL
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setAuthed(false)}
          data-ocid="admin.secondary_button"
          className="font-mono-label text-[10px] tracking-widest text-[oklch(0.4_0_0)] hover:text-orange transition-colors"
        >
          SIGN OUT
        </button>
      </div>

      <div className="px-8 py-8">
        {loading ? (
          <div
            className="font-mono-label text-[10px] tracking-widest text-[oklch(0.4_0_0)] py-20 text-center"
            data-ocid="admin.loading_state"
          >
            LOADING...
          </div>
        ) : (
          <>
            {error && (
              <p
                className="font-mono-label text-[10px] tracking-widest text-red-400 mb-6"
                data-ocid="admin.error_state"
              >
                {error}
              </p>
            )}
            <Tabs defaultValue="projects" data-ocid="admin.tab">
              <TabsList className="bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] rounded-none p-1 mb-8">
                <TabsTrigger
                  value="projects"
                  className="font-mono-label text-xs tracking-widest rounded-none data-[state=active]:bg-orange data-[state=active]:text-white"
                  data-ocid="admin.projects.tab"
                >
                  PROJECTS ({projects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="font-mono-label text-xs tracking-widest rounded-none data-[state=active]:bg-orange data-[state=active]:text-white"
                  data-ocid="admin.contacts.tab"
                >
                  CONTACTS ({contacts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                {projects.length === 0 ? (
                  <div
                    className="text-center py-20 font-mono-label text-[10px] tracking-widest text-[oklch(0.35_0_0)]"
                    data-ocid="admin.projects.empty_state"
                  >
                    NO PROJECTS YET
                  </div>
                ) : (
                  <div
                    className="border border-[oklch(0.16_0_0)] overflow-x-auto"
                    data-ocid="admin.projects.table"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[oklch(0.18_0_0)] hover:bg-transparent">
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            PROJECT ID
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            PACKAGE
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            NAME
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            EMAIL
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            BUSINESS
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            PAYMENT
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            DATE
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <ProjectRow
                            key={project.projectId}
                            project={project}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contacts">
                {contacts.length === 0 ? (
                  <div
                    className="text-center py-20 font-mono-label text-[10px] tracking-widest text-[oklch(0.35_0_0)]"
                    data-ocid="admin.contacts.empty_state"
                  >
                    NO CONTACTS YET
                  </div>
                ) : (
                  <div
                    className="border border-[oklch(0.16_0_0)] overflow-x-auto"
                    data-ocid="admin.contacts.table"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[oklch(0.18_0_0)] hover:bg-transparent">
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            NAME
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            EMAIL
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            MESSAGE
                          </TableHead>
                          <TableHead className="font-mono-label text-[9px] tracking-widest text-[oklch(0.45_0_0)]">
                            DATE
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact) => (
                          <TableRow
                            key={contact.email + String(contact.timestamp)}
                            className="border-[oklch(0.16_0_0)] hover:bg-[oklch(0.13_0_0)]"
                            data-ocid="admin.contacts.row"
                          >
                            <TableCell className="font-body text-sm text-foreground">
                              {contact.name}
                            </TableCell>
                            <TableCell className="font-body text-sm text-[oklch(0.6_0_0)]">
                              {contact.email}
                            </TableCell>
                            <TableCell className="font-body text-sm text-[oklch(0.55_0_0)] max-w-xs truncate">
                              {contact.message}
                            </TableCell>
                            <TableCell className="font-mono-label text-[10px] text-[oklch(0.4_0_0)]">
                              {formatTimestamp(contact.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
