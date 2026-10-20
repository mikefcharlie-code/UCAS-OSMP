import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageTitle, SiteShell } from "@/components/SiteShell";
import {
  CANDIDATES,
  appendLog,
  gate,
  loadLimit,
  reconcile,
  requiredMargin,
  select,
  verifyChain,
  type LinkState,
  type LogEntry,
  type MissionRecord,
} from "@/lib/ucas-sim";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Runtime Assurance Simulator — UCAS" },
      { name: "description", content: "Interactive demo of safety-envelope gating, health-aware limits, mission reconciliation and hash-chained evidence logs." },
      { property: "og:title", content: "Runtime Assurance Simulator — UCAS" },
      { property: "og:description", content: "Change sensor confidence, aircraft health and link state, and watch the safety envelope decide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Simulator,
});

const DECISION_CLS = { ACCEPT: "text-success", MODIFY: "text-warning", REJECT: "text-destructive" } as const;

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex justify-between label-mono">
        <span>{label}</span>
        <span className="text-foreground">{value.toFixed(2)}</span>
      </div>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-2 w-full accent-primary" />
    </label>
  );
}

function Simulator() {
  const [sensorConfidence, setConf] = useState(0.9);
  const [envUncertainty, setEnv] = useState(0.2);
  const [healthDegradation, setHealth] = useState(0.1);
  const [link, setLink] = useState<LinkState>("nominal");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [tampered, setTampered] = useState(false);

  const inputs = { sensorConfidence, envUncertainty, healthDegradation, link };
  const results = useMemo(() => CANDIDATES.map((c) => gate(c, inputs)), [sensorConfidence, envUncertainty, healthDegradation, link]);
  const chosen = select(results);

  const [remoteKind, setRemoteKind] = useState<MissionRecord["kind"]>("command");
  const [remoteAuth, setRemoteAuth] = useState(1);
  const local: MissionRecord = { seq: 7, time: 100, authority: 1, kind: "command", source: "local", summary: "Continue transit" };
  const remote: MissionRecord = { seq: 8, time: 104, authority: remoteAuth, kind: remoteKind, source: "remote", summary: remoteKind === "revocation" ? "Revoke mission" : "Re-route north" };
  const recon = reconcile(local, remote);

  function commit() {
    const ev = `conf=${sensorConfidence.toFixed(2)} health=${healthDegradation.toFixed(2)} link=${link} -> ${chosen ? `${chosen.candidate.id} ${chosen.decision}` : "FALLBACK HOLD"}`;
    setLog((l) => appendLog(l, ev));
  }
  function tamper() {
    if (!log.length) return;
    setLog((l) => l.map((e, i) => (i === 0 ? { ...e, event: e.event + " [edited]" } : e)));
    setTampered(true);
  }
  const chainOk = verifyChain(log);

  return (
    <SiteShell>
      <PageTitle kicker="Interactive demo · synthetic data" title="Runtime assurance simulator">
        Adjust the aircraft's situation. The AI planner proposes five candidates; the deterministic safety envelope
        decides which may reach flight control.
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="panel space-y-6 p-5">
          <div className="label-mono text-primary">Inputs</div>
          <Slider label="Sensor confidence (204)" value={sensorConfidence} onChange={setConf} />
          <Slider label="Environment uncertainty (206)" value={envUncertainty} onChange={setEnv} />
          <Slider label="Predicted degradation (214)" value={healthDegradation} onChange={setHealth} />
          <div>
            <div className="label-mono">Comms link (218)</div>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {(["nominal", "degraded", "lost"] as const).map((s) => (
                <button key={s} onClick={() => setLink(s)} className={`rounded border px-2 py-1.5 font-mono text-xs ${link === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t pt-4 font-mono text-xs">
            <div><div className="label-mono">g limit</div><div className="text-lg text-primary">{loadLimit(healthDegradation)}g</div></div>
            <div><div className="label-mono">Req. margin</div><div className="text-lg text-primary">{requiredMargin(inputs).toFixed(2)}</div></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="label-mono">
                <tr className="border-b"><th className="p-3">Candidate (210)</th><th className="p-3">Demand</th><th className="p-3">Gate (212)</th><th className="p-3">Reason</th></tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.candidate.id} className={`border-b last:border-0 ${chosen?.candidate.id === r.candidate.id ? "bg-secondary" : ""}`}>
                    <td className="p-3"><span className="font-mono text-xs text-muted-foreground">{r.candidate.id}</span> {r.candidate.label}</td>
                    <td className="p-3 font-mono text-xs">{r.candidate.loadFactor}g</td>
                    <td className={`p-3 font-mono text-xs font-bold ${DECISION_CLS[r.decision]}`}>{r.decision}</td>
                    <td className="p-3 text-xs text-muted-foreground">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
              <div>
                <div className="label-mono">To flight control (216)</div>
                <div className="font-mono text-primary">
                  {chosen ? `${chosen.candidate.id} · ${chosen.candidate.label} @ ${chosen.effectiveLoad}g` : "No safe candidate — fallback hold"}
                </div>
              </div>
              <button onClick={commit} className="rounded bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground">Log decision →</button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="panel p-5">
              <div className="label-mono text-primary">Reconciliation (222)</div>
              <div className="mt-3 space-y-1 font-mono text-xs">
                <div>LOCAL  seq 7 · auth 1 · command · "Continue transit"</div>
                <div>REMOTE seq 8 · auth {remoteAuth} · {remoteKind} · "{remote.summary}"</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setRemoteKind(remoteKind === "command" ? "revocation" : "command")} className="rounded border px-3 py-1.5 font-mono text-xs hover:border-primary">Toggle revocation</button>
                <button onClick={() => setRemoteAuth(remoteAuth === 1 ? 2 : 1)} className="rounded border px-3 py-1.5 font-mono text-xs hover:border-primary">Remote authority {remoteAuth === 1 ? "↑" : "↓"}</button>
              </div>
              <div className={`mt-4 font-mono text-sm font-bold ${recon === "CONFLICT_HELD" ? "text-destructive" : "text-success"}`}>
                {recon}{recon === "CONFLICT_HELD" && " — non-executable until supervisor review"}
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex items-center justify-between">
                <div className="label-mono text-primary">Evidence log (220)</div>
                <div className={`font-mono text-xs font-bold ${chainOk ? "text-success" : "text-destructive"}`}>{chainOk ? "CHAIN VERIFIED" : "TAMPER DETECTED"}</div>
              </div>
              <div className="mt-3 max-h-48 space-y-1 overflow-y-auto font-mono text-[11px]">
                {log.length === 0 && <div className="text-muted-foreground">Log a decision to begin the chain.</div>}
                {log.map((e) => (
                  <div key={e.idx} className="break-all"><span className="text-primary">{e.hash}</span> ← {e.prev} · {e.event}</div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={tamper} disabled={!log.length || tampered} className="rounded border px-3 py-1.5 font-mono text-xs hover:border-destructive disabled:opacity-40">Tamper entry #0</button>
                <button onClick={() => { setLog([]); setTampered(false); }} className="rounded border px-3 py-1.5 font-mono text-xs">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
