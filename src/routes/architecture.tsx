import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Patent Figures 1–8 — UCAS" },
      { name: "description", content: "Revised patent drawing sheets for the UCAS confidence-gated flight management architecture." },
      { property: "og:title", content: "Patent Figures 1–8 — UCAS" },
      { property: "og:description", content: "Platform, autonomy stack, sensor fusion, safety gating, health, comms, reconciliation and evidence logging." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Figures,
});

const FIGS = [
  "Uncrewed aircraft platform and principal subsystems",
  "Onboard compute and autonomy architecture",
  "Sensor fusion, confidence, provenance and environment uncertainty",
  "AI planning with deterministic safety gating",
  "Health prediction and health-aware reconfiguration",
  "Authenticated supervision and resilient communications",
  "Mission-state reconciliation",
  "Model lifecycle controls and evidence logging",
];

function Figures() {
  return (
    <SiteShell>
      <PageTitle kicker="Drawing sheets" title="Figures 1–8">
        Revised drawings with reconciled reference numerals.{" "}
        <a href="/docs/04_REVISED_PATENT_DRAWINGS.pdf" className="text-primary underline">Download PDF</a>
      </PageTitle>
      <div className="grid gap-6 md:grid-cols-2">
        {FIGS.map((cap, i) => (
          <figure key={cap} className="panel overflow-hidden">
            <div className="bg-paper p-2">
              <img src={`/figures/fig-${i + 1}.png`} alt={`FIG. ${i + 1} — ${cap}`} className="w-full" loading="lazy" />
            </div>
            <figcaption className="p-4">
              <span className="font-mono text-xs text-primary">FIG. {i + 1}</span>
              <div className="mt-1 text-sm">{cap}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </SiteShell>
  );
}
