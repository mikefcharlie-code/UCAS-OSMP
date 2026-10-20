// Illustrative model of the UCAS runtime-assurance chain (synthetic data only).

export type LinkState = "nominal" | "degraded" | "lost";
export type Decision = "ACCEPT" | "MODIFY" | "REJECT";

export interface SimInputs {
  sensorConfidence: number; // 0..1 fused-state confidence
  envUncertainty: number; // 0..1 environment-model uncertainty
  healthDegradation: number; // 0..1 predicted degradation
  link: LinkState;
}

export interface Candidate {
  id: string;
  label: string;
  actionClass: "transit" | "loiter" | "climb" | "return";
  loadFactor: number; // demanded g
  margin: number; // nominal operating margin 0..1
}

export const CANDIDATES: Candidate[] = [
  { id: "C1", label: "Aggressive direct transit", actionClass: "transit", loadFactor: 6.5, margin: 0.25 },
  { id: "C2", label: "Standard transit", actionClass: "transit", loadFactor: 3.5, margin: 0.55 },
  { id: "C3", label: "High-rate climb", actionClass: "climb", loadFactor: 5, margin: 0.35 },
  { id: "C4", label: "Hold / loiter", actionClass: "loiter", loadFactor: 1.5, margin: 0.85 },
  { id: "C5", label: "Return to recovery point", actionClass: "return", loadFactor: 2, margin: 0.8 },
];

/** Previously authenticated action classes allowed while link is degraded/lost. */
export const DEGRADED_ALLOWED: Candidate["actionClass"][] = ["loiter", "return"];

/** Health-aware constraint update: predicted degradation shrinks the g limit before selection. */
export function loadLimit(healthDegradation: number): number {
  return Math.round((7 - 4 * healthDegradation) * 10) / 10;
}

/** Required margin rises as confidence drops and uncertainty grows. */
export function requiredMargin(i: SimInputs): number {
  return Math.min(0.95, 0.2 + 0.4 * (1 - i.sensorConfidence) + 0.3 * i.envUncertainty);
}

export interface GateResult {
  candidate: Candidate;
  decision: Decision;
  reason: string;
  effectiveLoad: number;
}

export function gate(c: Candidate, i: SimInputs): GateResult {
  if (i.link !== "nominal" && !DEGRADED_ALLOWED.includes(c.actionClass)) {
    return { candidate: c, decision: "REJECT", reason: "Action class not pre-authorized for degraded link", effectiveLoad: 0 };
  }
  const margin = c.margin * (1 - 0.5 * i.healthDegradation);
  if (margin < requiredMargin(i)) {
    return { candidate: c, decision: "REJECT", reason: `Margin ${margin.toFixed(2)} below required ${requiredMargin(i).toFixed(2)}`, effectiveLoad: 0 };
  }
  const limit = loadLimit(i.healthDegradation);
  if (c.loadFactor > limit) {
    return { candidate: c, decision: "MODIFY", reason: `Load ${c.loadFactor}g clipped to ${limit}g health limit`, effectiveLoad: limit };
  }
  return { candidate: c, decision: "ACCEPT", reason: "All protected constraints satisfied", effectiveLoad: c.loadFactor };
}

/** Pick the first accepted candidate, else the first modified, else fallback hold. */
export function select(results: GateResult[]): GateResult | null {
  return results.find((r) => r.decision === "ACCEPT") ?? results.find((r) => r.decision === "MODIFY") ?? null;
}

// ---- Mission-state reconciliation ----
export interface MissionRecord {
  seq: number;
  time: number;
  authority: number; // higher = more authority
  kind: "command" | "revocation";
  source: "local" | "remote";
  summary: string;
}

export type ReconcileStatus = "AGREED" | "REMOTE_WINS" | "LOCAL_WINS" | "CONFLICT_HELD";

export function reconcile(local: MissionRecord, remote: MissionRecord): ReconcileStatus {
  if (local.seq === remote.seq && local.summary === remote.summary) return "AGREED";
  // An authorized revocation always beats a stale command.
  if (remote.kind === "revocation" && remote.authority >= local.authority) return "REMOTE_WINS";
  if (local.kind === "revocation" && local.authority >= remote.authority) return "LOCAL_WINS";
  if (remote.authority > local.authority && remote.seq > local.seq) return "REMOTE_WINS";
  if (local.authority > remote.authority && local.seq > remote.seq) return "LOCAL_WINS";
  return "CONFLICT_HELD"; // unresolved -> non-executable
}

// ---- Evidence log with hash chaining ----
export function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let k = 0; k < s.length; k++) {
    h ^= s.charCodeAt(k);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export interface LogEntry {
  idx: number;
  event: string;
  prev: string;
  hash: string;
}

export function appendLog(log: LogEntry[], event: string): LogEntry[] {
  const prev = log.length ? log[log.length - 1]!.hash : "00000000";
  const idx = log.length;
  return [...log, { idx, event, prev, hash: fnv1a(`${idx}|${prev}|${event}`) }];
}

export function verifyChain(log: LogEntry[]): boolean {
  return log.every((e, i) => {
    const prev = i === 0 ? "00000000" : log[i - 1]!.hash;
    return e.prev === prev && e.hash === fnv1a(`${e.idx}|${prev}|${e.event}`);
  });
}
