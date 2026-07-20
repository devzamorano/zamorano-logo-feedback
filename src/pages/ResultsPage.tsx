import { useEffect, useState } from 'react'
import { fetchResponses } from '@/lib/api'

const COLUMNS = [
  'id',
  'palabras',
  'comentario_p1',
  'comentario_p2',
  'comentario_p3',
  'comentario_comparacion',
  'ratings',
  'preferida',
  'razon_preferida',
  'aspecto_mejorar',
  'elemento_indispensable',
  'comentario_final',
  'created_at',
] as const

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

export function ResultsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResponses()
      .then(setRows)
      .catch(() => setError('No se pudieron cargar las respuestas.'))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-xl font-semibold">Respuestas — Feedback de Logotipo Zamorano 85 Años</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="border-b p-2 text-left font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                {COLUMNS.map((column) => (
                  <td key={column} className="border-b p-2 align-top">
                    {formatCell(row[column])}
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
