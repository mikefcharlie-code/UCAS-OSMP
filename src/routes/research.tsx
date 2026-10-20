import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Paper — UCAS Runtime Assurance" },
      { name: "description", content: "Confidence-aware, health-adaptive runtime assurance for uncrewed aircraft: architecture and verification protocol." },
      { property: "og:title", content: "Research Paper — UCAS Runtime Assurance" },
      { property: "og:description", content: "Design-science architecture paper with proposed staged verification protocol." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Research,
});

const STAGES = ["Simulation", "Software-in-the-loop", "Hardware-in-the-loop", "Approved flight test"];

function Research() {
  return (
    <SiteShell>
      <PageTitle kicker="Technical research draft · v1.0 · 15 Oct 2026" title="Confidence-aware, health-adaptive runtime assurance">
        An integrated architecture for safety gating, mission-state reconciliation and evidence logging.
      </PageTitle>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <article className="panel p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="label-mono mb-3 text-primary">Abstract</h2>
          <p>
            Autonomous uncrewed aircraft must reconcile uncertain sensor observations, evolving vehicle health, mission
            constraints, remote authority, and real-time control. The architecture associates fused state estimates with
            confidence and provenance; maintains a distinct uncertain environment model; generates and forward-evaluates
            candidate trajectories; and places a deterministic safety envelope between AI-assisted planning and flight
            control. Cross-layer mechanisms update planning constraints in response to predicted degradation,
            authenticate supervisory inputs, hold unresolved local/remote mission-state conflicts in a non-executable
            state, and record decision evidence with optional cryptographic integrity protection.
          </p>
          <p className="mt-4 rounded border border-warning/40 p-3 text-foreground">
            Evidence status: no source code, dataset, simulation output or flight-test measurement is reported. No
            empirical performance or certification claim is made.
          </p>
          <a href="/docs/UCAS_Research_Paper.pdf" className="mt-6 inline-block rounded bg-primary px-5 py-2.5 font-mono text-sm font-bold text-primary-foreground">
            Download full paper (PDF)
          </a>
        </article>
        <aside className="panel p-6">
          <h2 className="label-mono mb-4 text-primary">Verification protocol</h2>
          <ol className="space-y-4">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary font-mono text-xs text-primary">{i + 1}</span>
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted-foreground">
            With fault injection for sensor degradation, health changes, communication loss, stale commands and logging faults.
          </p>
        </aside>
      </div>
    </SiteShell>
  );
}
