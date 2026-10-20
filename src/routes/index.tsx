import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UCAS — Confidence-Gated Adaptive Flight Management" },
      { name: "description", content: "Patent showcase and interactive runtime-assurance simulator for AI-controlled uncrewed aircraft." },
      { property: "og:title", content: "UCAS — Confidence-Gated Adaptive Flight Management" },
      { property: "og:description", content: "Safety gating, health-aware planning, mission reconciliation and evidence logging for uncrewed aircraft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PILLARS = [
  ["204", "Confidence + provenance", "Fused state carries confidence and source lineage into planning."],
  ["212", "Deterministic safety envelope", "Every AI candidate is accepted, modified or rejected before flight control."],
  ["214", "Health-aware constraints", "Predicted degradation tightens limits before a trajectory is chosen."],
  ["208", "Authenticated mission contracts", "Signed, scoped, revocable instructions from the supervisor."],
  ["222", "Mission-state reconciliation", "Unresolved local/remote conflicts are held non-executable."],
  ["220", "Evidence logging", "Hash-chained, tamper-evident record of every decision."],
];

function Index() {
  return (
    <SiteShell>
      <section className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <div className="label-mono text-primary">U.S. Utility Patent Draft · Rev. 2026-10-06</div>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            AI-controlled uncrewed aircraft with <span className="text-primary">confidence-gated</span> flight management
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            An onboard architecture that turns uncertain sensing into a controlled flight state, while a deterministic
            safety layer constrains every AI-generated action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/simulator" className="rounded bg-primary px-5 py-2.5 font-mono text-sm font-bold text-primary-foreground">
              Run the simulator →
            </Link>
            <Link to="/architecture" className="rounded border px-5 py-2.5 font-mono text-sm hover:border-primary">
              View figures
            </Link>
          </div>
        </div>
        <div className="panel overflow-hidden bg-paper p-2">
          <img src="/figures/fig-1.jpg" alt="FIG. 1 — Uncrewed aircraft platform" className="w-full" />
        </div>
      </section>

      <section className="mt-16 grid gap-px overflow-hidden rounded border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map(([num, title, body]) => (
          <div key={num} className="bg-card p-6">
            <div className="font-mono text-xs text-primary">REF {num}</div>
            <h3 className="mt-2 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
