export const CRITERIA = [
  { slug: 'identidad', label: 'Representa la identidad de la Universidad Zamorano' },
  { slug: 'celebracion_85', label: 'Comunica claramente la celebración de los 85 años' },
  { slug: 'legado', label: 'Refleja el legado y la trayectoria de la Universidad Zamorano' },
  { slug: 'impacto_visual', label: 'Genera impacto visual' },
  { slug: 'originalidad', label: 'Es original y diferenciadora' },
  { slug: 'facil_recordar', label: 'Es fácil de recordar' },
  { slug: 'orgullo_pertenencia', label: 'Genera orgullo y sentido de pertenencia' },
  { slug: 'versatilidad', label: 'Tiene versatilidad para utilizarse en diferentes formatos y aplicaciones' },
] as const

export type Criterion = (typeof CRITERIA)[number]['slug']

export const PREFERRED = { p1: '1', p2: '2', p3: '3' } as const

export type PreferredProposal = (typeof PREFERRED)[keyof typeof PREFERRED]

type Score = 1 | 2 | 3 | 4 | 5 | null

export interface CriterionRatings {
  p1: Score
  p2: Score
  p3: Score
}

export type Ratings = Record<Criterion, CriterionRatings>

export function emptyRatings(): Ratings {
  return CRITERIA.reduce((acc, { slug }) => {
    acc[slug] = { p1: null, p2: null, p3: null }
    return acc
  }, {} as Ratings)
}

export interface SurveyState {
  palabras: [string, string, string]
  comentarioP1: string
  comentarioP2: string
  comentarioP3: string
  comentarioComparacion: string
  ratings: Ratings
  preferida: PreferredProposal | null
  razonPreferida: string
  aspectoMejorar: string
  elementoIndispensable: string
  comentarioFinal: string
}

export function emptySurveyState(): SurveyState {
  return {
    palabras: ['', '', ''],
    comentarioP1: '',
    comentarioP2: '',
    comentarioP3: '',
    comentarioComparacion: '',
    ratings: emptyRatings(),
    preferida: null,
    razonPreferida: '',
    aspectoMejorar: '',
    elementoIndispensable: '',
    comentarioFinal: '',
  }
}
