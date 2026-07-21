// In-memory pacing state for the live session — the host advances it from /admin.
// Not persisted: a server restart resets it to the waiting room (fail-open, never locks
// the room out on a crash — it just re-shows the waiting screen instead of skipping it).
// Step 2 = waiting room after the 3-words slide; 3/4/5 = Propuesta 1/2/3; 6 = comparación.
const FIRST_GATED_STEP = 2
const LAST_GATED_STEP = 6

let maxUnlockedStep = FIRST_GATED_STEP

export function getMaxUnlockedStep(): number {
  return maxUnlockedStep
}

export function advanceMaxUnlockedStep(): number {
  maxUnlockedStep = Math.min(maxUnlockedStep + 1, LAST_GATED_STEP)
  return maxUnlockedStep
}

export function resetMaxUnlockedStep(): number {
  maxUnlockedStep = FIRST_GATED_STEP
  return maxUnlockedStep
}
