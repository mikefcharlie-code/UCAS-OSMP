import { describe, expect, it } from "vitest";
import { CANDIDATES, appendLog, gate, loadLimit, reconcile, verifyChain } from "@/lib/ucas-sim";

const nominal = { sensorConfidence: 0.9, envUncertainty: 0.1, healthDegradation: 0, link: "nominal" as const };

describe("UCAS runtime assurance", () => {
  it("rejects non pre-authorized action classes while link is degraded", () => {
    expect(gate(CANDIDATES[1]!, { ...nominal, link: "degraded" }).decision).toBe("REJECT");
    expect(gate(CANDIDATES[3]!, { ...nominal, link: "lost" }).decision).toBe("ACCEPT");
  });
  it("predicted degradation tightens limits and modifies over-limit candidates", () => {
    expect(loadLimit(0.5)).toBe(5);
    expect(gate(CANDIDATES[0]!, { ...nominal, healthDegradation: 0.25, sensorConfidence: 1, envUncertainty: 0 }).decision).toBe("MODIFY");
  });
  it("authorized revocation beats stale command", () => {
    const local = { seq: 5, time: 1, authority: 1, kind: "command" as const, source: "local" as const, summary: "transit" };
    const remote = { seq: 4, time: 0, authority: 2, kind: "revocation" as const, source: "remote" as const, summary: "revoke" };
    expect(reconcile(local, remote)).toBe("REMOTE_WINS");
  });
  it("holds unresolved conflicts", () => {
    const a = { seq: 5, time: 1, authority: 1, kind: "command" as const, source: "local" as const, summary: "A" };
    const b = { seq: 6, time: 2, authority: 1, kind: "command" as const, source: "remote" as const, summary: "B" };
    expect(reconcile(a, b)).toBe("CONFLICT_HELD");
  });
  it("detects tampering in the evidence chain", () => {
    let log = appendLog([], "a");
    log = appendLog(log, "b");
    expect(verifyChain(log)).toBe(true);
    log[0] = { ...log[0]!, event: "x" };
    expect(verifyChain(log)).toBe(false);
  });
});
