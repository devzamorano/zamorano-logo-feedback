import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { advanceAdminState, clearAllResponses, fetchAdminState, resetAdminState } from '@/lib/api'

const POLL_INTERVAL_MS = 3000
const LAST_GATED_STEP = 6

const STEP_LABELS: Record<number, string> = {
  3: 'Propuesta 1',
  4: 'Propuesta 2',
  5: 'Propuesta 3',
  6: 'Comparación (todo abierto)',
}

export function AdminPage() {
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number | null>(null)
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const state = await fetchAdminState()
        if (!cancelled) setMaxUnlockedStep(state.maxUnlockedStep)
      } catch {
        // silent — the next poll retries
      }
    }

    void poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  async function handleAdvance() {
    setBusy(true)
    try {
      const state = await advanceAdminState(pin)
      setMaxUnlockedStep(state.maxUnlockedStep)
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'invalid_pin' ? 'PIN incorrecto.' : 'No se pudo avanzar.')
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    setBusy(true)
    try {
      const state = await resetAdminState(pin)
      setMaxUnlockedStep(state.maxUnlockedStep)
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'invalid_pin' ? 'PIN incorrecto.' : 'No se pudo reiniciar.')
    } finally {
      setBusy(false)
    }
  }

  async function handleClearResponses() {
    const confirmed = window.confirm(
      '¿Borrar TODAS las respuestas guardadas? Esta acción no se puede deshacer.'
    )
    if (!confirmed) return

    setBusy(true)
    try {
      await clearAllResponses(pin)
      toast.success('Respuestas borradas.')
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'invalid_pin' ? 'PIN incorrecto.' : 'No se pudo borrar.')
    } finally {
      setBusy(false)
    }
  }

  const currentLabel = maxUnlockedStep !== null ? (STEP_LABELS[maxUnlockedStep] ?? '—') : 'Cargando…'
  const isFullyOpen = maxUnlockedStep !== null && maxUnlockedStep >= LAST_GATED_STEP

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-xl font-semibold">Panel del presentador</h1>
        <p className="mb-6 text-sm text-gray-500">
          Controla cuándo los participantes pueden avanzar entre las propuestas de logo.
        </p>

        <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-500">Actualmente abierto</p>
          <p className="text-lg font-semibold">{currentLabel}</p>
        </div>

        <div className="mb-4 space-y-1">
          <Label htmlFor="admin-pin">PIN</Label>
          <Input
            id="admin-pin"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" onClick={() => void handleAdvance()} disabled={busy || isFullyOpen || !pin}>
            {isFullyOpen ? 'Ya está todo abierto' : 'Abrir siguiente propuesta →'}
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleReset()} disabled={busy || !pin}>
            Reiniciar a Propuesta 1
          </Button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="mb-2 text-xs text-gray-500">
            Zona de peligro: borra todas las respuestas guardadas de forma permanente.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => void handleClearResponses()}
            disabled={busy || !pin}
          >
            Borrar todas las respuestas
          </Button>
        </div>
      </div>
    </div>
  )
}
