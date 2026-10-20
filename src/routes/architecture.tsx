import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Patent Drawings — UCAS" },
      { name: "description", content: "Updated patent drawing sheets for the UCAS confidence-gated flight management architecture." },
      { property: "og:title", content: "Patent Drawings — UCAS" },
      { property: "og:description", content: "Aircraft platform, compute cluster, sensor array, safety gating and full system overview." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Figures,
});

const FIGS = [
  "Main view — uncrewed aircraft platform",
  "Exploded isometric view of onboard compute cluster & AI core (detail of 114)",
  "Detailed view of sensor array (100)",
  "AI planning with deterministic safety gating",
  "System overview — autonomy, safety, resilience and evidence",
];

const SHEETS = [
  { src: "/figures/sheet-1.jpg", title: "Sheet 1 — Figures 1–5 (combined)" },
  { src: "/figures/sheet-2.jpg", title: "Sheet 2 — Alternate detail views (platform, compute, sensors, health telemetry, evidence unit)" },
  { src: "/figures/sheet-3.jpg", title: "Sheet 3 — Integrated uncrewed aircraft platform block diagram" },
];

function Zoomable({ src, alt }: { src: string; alt: string }) {
  return (
    <a href={src} target="_blank" rel="noreferrer" className="block bg-paper p-2" title="Open full size">
      <img src={src} alt={alt} className="w-full" loading="lazy" />
    </a>
  );
}

function Figures() {
  return (
    <SiteShell>
      <PageTitle kicker="Drawing sheets · Rev. 2026-10-20" title="Patent drawings">
        Updated drawing set. Tap any drawing to open it full size.{" "}
        <a href="/docs/UCAS_Patent_Drawings_REV_2026-10-20.pdf" className="text-primary underline">Download all sheets (PDF)</a>
        {" · "}
        <a href="/docs/04_REVISED_PATENT_DRAWINGS.pdf" className="text-muted-foreground underline">Previous revision (Oct 6)</a>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        {FIGS.map((cap, i) => (
          <figure key={cap} className={`panel overflow-hidden ${i === 4 ? "md:col-span-2" : ""}`}>
            <Zoomable src={`/figures/fig-${i + 1}.jpg`} alt={`FIG. ${i + 1} — ${cap}`} />
            <figcaption className="p-4">
              <span className="font-mono text-xs text-primary">FIG. {i + 1}</span>
              <div className="mt-1 text-sm">{cap}</div>
            </figcaption>
          </figure>
        ))}
      </div>

      <h2 className="label-mono mb-4 mt-14 text-primary">Full sheets</h2>
      <div className="space-y-6">
        {SHEETS.map((s) => (
          <figure key={s.src} className="panel overflow-hidden">
            <Zoomable src={s.src} alt={s.title} />
            <figcaption className="p-4 text-sm">{s.title}</figcaption>
          </figure>
        ))}
      </div>
    </SiteShell>
  );
}
