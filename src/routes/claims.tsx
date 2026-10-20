import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/claims")({
  head: () => ({
    meta: [
      { title: "Claims — UCAS Patent Draft" },
      { name: "description", content: "Draft claims for the UCAS uncrewed aircraft system with deterministic safety-envelope gating." },
      { property: "og:title", content: "Claims — UCAS Patent Draft" },
      { property: "og:description", content: "Independent and dependent claims from the revised U.S. utility specification draft." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Claims,
});

const CLAIMS = [
  "An uncrewed aircraft system comprising: an airframe; heterogeneous sensors; an onboard compute subsystem; a state-estimation engine generating a fused state with confidence and provenance information; an environment model with uncertainty; an AI planner generating candidate trajectories from the fused state, environment model and a machine-readable mission contract; a forward evaluator; a deterministic safety-envelope engine evaluating candidates against protected constraints dependent on confidence, uncertainty or health; and a flight-control interface exposing an action only after it is accepted, modified or replaced by the safety-envelope engine.",
  "Provenance identifies source sensors, acquisition times, calibration, estimator versions, model versions or state snapshots.",
  "A health-state estimator infers predicted degradation that updates planning constraints before trajectory selection.",
  "The planner selects between candidates according to predicted degradation and remaining operating margin.",
  "The safety-envelope engine may accept, modify, reject or select an alternative candidate.",
  "An independently computed safety controller prevents actions that violate protected aircraft limits.",
  "Mission contracts include mission and issuer identifiers, validity interval, action classes, constraints and revocation, with signature verification before the planner receives instructions.",
  "A communications manager restricts executable actions to previously authenticated action classes while degraded.",
  "A reconciliation engine compares local and remote mission-state records using sequence, time, authority and provenance after recovery.",
  "Unresolved conflicts are prevented from becoming executable.",
  "Authorized revocation takes precedence over a stale command under a defined authority policy.",
  "An evidence logger records model identifier, state snapshot, confidence, health, command provenance and safety decision.",
  "The evidence log is append-only or tamper-evident via hash chaining.",
  "The log records candidate identifiers with acceptance, modification, rejection or fallback outcomes.",
  "Model packages carry identifier, compatibility, validation status, signing and deployment scope, verified before activation.",
];

function Claims() {
  return (
    <SiteShell>
      <PageTitle kicker="Draft claims (summarized 2–15)" title="What is claimed">
        From the revised specification.{" "}
        <a href="/docs/01_US_Utility_Specification_Claims_Abstract_REVISED.pdf" className="text-primary underline">Full specification PDF</a>
        {" · "}
        <a href="/docs/07_Provisional_Application_Draft_REVISED.pdf" className="text-primary underline">Provisional draft PDF</a>
      </PageTitle>
      <ol className="space-y-3">
        {CLAIMS.map((c, i) => (
          <li key={i} className={`panel flex gap-4 p-4 ${i === 0 ? "border-primary" : ""}`}>
            <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
            <p className={`text-sm ${i === 0 ? "" : "text-muted-foreground"}`}>{c}</p>
          </li>
        ))}
      </ol>
    </SiteShell>
  );
}
