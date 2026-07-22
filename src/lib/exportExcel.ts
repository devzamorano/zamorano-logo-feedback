import * as XLSX from 'xlsx'
import { CRITERIA, type Criterion } from '@/types/survey'

const CRITERION_SHORT_LABELS: Record<Criterion, string> = {
  identidad: 'Identidad Zamorano',
  celebracion_85: 'Celebración 85 años',
  legado: 'Legado/trayectoria',
  impacto_visual: 'Impacto visual',
  originalidad: 'Originalidad',
  facil_recordar: 'Fácil de recordar',
  orgullo_pertenencia: 'Orgullo/pertenencia',
  versatilidad: 'Versatilidad',
}

const PROPOSAL_KEYS = ['p1', 'p2', 'p3'] as const
const PROPOSAL_LABELS: Record<(typeof PROPOSAL_KEYS)[number], string> = {
  p1: 'Propuesta 1',
  p2: 'Propuesta 2',
  p3: 'Propuesta 3',
}

type ProposalKey = (typeof PROPOSAL_KEYS)[number]
type RatingsValue = Partial<Record<Criterion, Partial<Record<ProposalKey, number | null>>>>

function formatDate(value: unknown): string {
  if (typeof value !== 'string') return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('es-HN', { dateStyle: 'short', timeStyle: 'short' })
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : []
}

function asRatings(value: unknown): RatingsValue {
  return typeof value === 'object' && value !== null ? (value as RatingsValue) : {}
}

function buildResponsesSheet(rows: Record<string, unknown>[]): XLSX.WorkSheet {
  const data = rows.map((row) => {
    const palabras = asArray(row.palabras)
    const ratings = asRatings(row.ratings)
    const preferida = row.preferida !== null && row.preferida !== undefined ? String(row.preferida) : ''

    const ratingColumns: Record<string, number | null> = {}
    for (const { slug } of CRITERIA) {
      for (const proposalKey of PROPOSAL_KEYS) {
        const header = `${CRITERION_SHORT_LABELS[slug]} (${PROPOSAL_LABELS[proposalKey].replace('Propuesta ', 'P')})`
        ratingColumns[header] = ratings[slug]?.[proposalKey] ?? null
      }
    }

    return {
      ID: row.id,
      Fecha: formatDate(row.created_at),
      'Palabra 1': palabras[0] ?? '',
      'Palabra 2': palabras[1] ?? '',
      'Palabra 3': palabras[2] ?? '',
      'Comentario Propuesta 1': row.comentario_p1 ?? '',
      'Comentario Propuesta 2': row.comentario_p2 ?? '',
      'Comentario Propuesta 3': row.comentario_p3 ?? '',
      'Comentario Comparación': row.comentario_comparacion ?? '',
      ...ratingColumns,
      'Propuesta Preferida': preferida ? `Propuesta ${preferida}` : '',
      'Motivo de Preferencia': row.razon_preferida ?? '',
      'Aspecto a Mejorar': row.aspecto_mejorar ?? '',
      'Elemento Indispensable': row.elemento_indispensable ?? '',
      'Comentario Final': row.comentario_final ?? '',
    }
  })

  const sheet = XLSX.utils.json_to_sheet(data)
  sheet['!cols'] = Object.keys(data[0] ?? {}).map((key) =>
    ['ID', 'Fecha'].includes(key) ? { wch: 12 } : key.includes('Comentario') ? { wch: 40 } : { wch: 20 }
  )
  return sheet
}

function buildSummarySheet(rows: Record<string, unknown>[]): XLSX.WorkSheet {
  const criteriaRows = CRITERIA.map(({ slug, label }) => {
    const averages: Record<string, number | string> = {}
    for (const proposalKey of PROPOSAL_KEYS) {
      const scores = rows
        .map((row) => asRatings(row.ratings)[slug]?.[proposalKey])
        .filter((score): score is number => typeof score === 'number')
      averages[PROPOSAL_LABELS[proposalKey]] =
        scores.length > 0 ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2)) : '—'
    }
    return { Criterio: label, ...averages }
  })

  const preferenceCounts: Record<ProposalKey, number> = { p1: 0, p2: 0, p3: 0 }
  let totalPreferences = 0
  for (const row of rows) {
    const preferida = row.preferida !== null && row.preferida !== undefined ? String(row.preferida) : ''
    const key = (['1', '2', '3'] as const).find((value) => value === preferida)
    if (key) {
      preferenceCounts[`p${key}` as ProposalKey] += 1
      totalPreferences += 1
    }
  }

  const preferenceRows = PROPOSAL_KEYS.map((key) => ({
    Criterio: `Votos como preferida — ${PROPOSAL_LABELS[key]}`,
    'Propuesta 1': '',
    'Propuesta 2': '',
    'Propuesta 3': '',
    Votos: preferenceCounts[key],
    Porcentaje: totalPreferences > 0 ? `${Math.round((preferenceCounts[key] / totalPreferences) * 100)}%` : '—',
  }))

  const sheet = XLSX.utils.json_to_sheet([
    { Criterio: `Total de respuestas: ${rows.length}` },
    {},
    ...criteriaRows,
    {},
    ...preferenceRows,
  ])
  sheet['!cols'] = [{ wch: 45 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 12 }]
  return sheet
}

export function exportResponsesToExcel(rows: Record<string, unknown>[]): void {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, buildResponsesSheet(rows), 'Respuestas')
  XLSX.utils.book_append_sheet(workbook, buildSummarySheet(rows), 'Resumen')
  const today = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `zamorano-logo-feedback-${today}.xlsx`)
}
