// In-memory pacing state for the live session — the host advances it from /admin.
// Not persisted: a server restart resets it to step 3 (fail-open, never locks the room out).
const FIRST_GATED_STEP = 3
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
