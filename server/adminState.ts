// In-memory pacing state for the live session — the host advances it from /admin.
// Not persisted: a server restart resets it to the first waiting room (fail-open, never
// locks the room out on a crash — it just re-shows the waiting screen instead of skipping it).
// Sequence of meaningful gate values (skips steps that are never gated, like comparación):
// 2 = waiting room after the 3-words slide, 3/4/5 = Propuesta 1/2/3, 7 = Ficha de evaluación.
const GATE_SEQUENCE = [2, 3, 4, 5, 7]

let gateIndex = 0

export function getMaxUnlockedStep(): number {
  return GATE_SEQUENCE[gateIndex]
}

export function advanceMaxUnlockedStep(): number {
  gateIndex = Math.min(gateIndex + 1, GATE_SEQUENCE.length - 1)
  return GATE_SEQUENCE[gateIndex]
}

export function resetMaxUnlockedStep(): number {
  gateIndex = 0
  return GATE_SEQUENCE[gateIndex]
}
