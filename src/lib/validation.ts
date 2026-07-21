import { CRITERIA, type SurveyState } from '@/types/survey'

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
