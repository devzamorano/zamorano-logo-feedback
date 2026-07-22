import { CRITERIA, type Criterion, type Ratings } from '@/types/survey'
import { cn } from '@/lib/utils'

type ProposalKey = 'p1' | 'p2' | 'p3'
type Score = 1 | 2 | 3 | 4 | 5 | null

const PROPOSAL_COLUMNS: { key: ProposalKey; label: string }[] = [
  { key: 'p1', label: 'Propuesta 1' },
  { key: 'p2', label: 'Propuesta 2' },
  { key: 'p3', label: 'Propuesta 3' },
]

const SCORE_OPTIONS = [1, 2, 3, 4, 5] as const

interface EvaluationGridProps {
  ratings: Ratings
  onChange: (criterion: Criterion, proposal: ProposalKey, value: Score) => void
}

export function EvaluationGrid({ ratings, onChange }: EvaluationGridProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">1 = Muy bajo | 2 = Bajo | 3 = Medio | 4 = Alto | 5 = Muy alto</p>
      <p className="text-xs text-gray-500">Califique las 3 propuestas en los 8 criterios (todas las celdas son obligatorias). *</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b p-2 text-left font-medium">Criterio</th>
              {PROPOSAL_COLUMNS.map((column) => (
                <th key={column.key} className="border-b p-2 text-center font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map(({ slug, label }) => (
              <tr key={slug}>
                <td className="border-b p-2 text-left">{label}</td>
                {PROPOSAL_COLUMNS.map((column) => (
                  <td key={column.key} className="border-b p-2 text-center">
                    <select
                      className={cn(
                        'h-8 w-16 rounded-md border bg-white text-center text-sm',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900',
                        ratings[slug][column.key] === null
                          ? 'border-red-400 ring-1 ring-red-200'
                          : 'border-gray-300'
                      )}
                      value={ratings[slug][column.key] ?? ''}
                      onChange={(event) => {
                        const raw = event.target.value
                        const value = raw === '' ? null : (Number(raw) as Score)
                        onChange(slug, column.key, value)
                      }}
                    >
                      <option value="">—</option>
                      {SCORE_OPTIONS.map((score) => (
                        <option key={score} value={score}>
                          {score}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
