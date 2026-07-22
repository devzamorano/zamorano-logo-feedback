import { CRITERIA, type Ratings, type SurveyState } from '@/types/survey'

export function countMissingRatings(ratings: Ratings): number {
  return CRITERIA.reduce((count, { slug }) => {
    const row = ratings[slug]
    return count + [row.p1, row.p2, row.p3].filter((value) => value === null).length
  }, 0)
}

export function getStep7MissingSummary(survey: SurveyState): string | undefined {
  const missing: string[] = []
  const missingRatings = countMissingRatings(survey.ratings)
  if (missingRatings > 0) {
    missing.push(`${missingRatings} calificación${missingRatings === 1 ? '' : 'es'} en la tabla de arriba`)
  }
  if (survey.preferida === null) missing.push('la propuesta preferida')
  if (survey.razonPreferida.trim().length === 0) missing.push('el motivo de su preferencia')
  if (survey.aspectoMejorar.trim().length === 0) missing.push('el aspecto a mejorar')
  if (survey.elementoIndispensable.trim().length === 0) missing.push('el elemento indispensable')
  if (survey.comentarioFinal.trim().length === 0) missing.push('el comentario final')

  if (missing.length === 0) return undefined
  return `Falta completar: ${missing.join(', ')}.`
}

export function isStepComplete(step: number, survey: SurveyState): boolean {
  switch (step) {
    case 2:
      return survey.palabras.every((word) => word.trim().length > 0)
    case 3:
      return survey.comentarioP1.trim().length > 0
    case 4:
      return survey.comentarioP2.trim().length > 0
    case 5:
      return survey.comentarioP3.trim().length > 0
    case 6:
      return survey.comentarioComparacion.trim().length > 0
    case 7:
      return (
        CRITERIA.every(({ slug }) => {
          const row = survey.ratings[slug]
          return row.p1 !== null && row.p2 !== null && row.p3 !== null
        }) &&
        survey.preferida !== null &&
        survey.razonPreferida.trim().length > 0 &&
        survey.aspectoMejorar.trim().length > 0 &&
        survey.elementoIndispensable.trim().length > 0 &&
        survey.comentarioFinal.trim().length > 0
      )
    default:
      return true
  }
}
