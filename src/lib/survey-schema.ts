import { z } from 'zod'
import { CRITERIA } from '@/types/survey'

const scoreSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).nullable()

const criterionRatingsSchema = z.object({
  p1: scoreSchema,
  p2: scoreSchema,
  p3: scoreSchema,
})

const ratingsShape = CRITERIA.reduce(
  (acc, { slug }) => {
    acc[slug] = criterionRatingsSchema
    return acc
  },
  {} as Record<string, typeof criterionRatingsSchema>
)

export const surveyPayloadSchema = z.object({
  palabras: z.tuple([z.string(), z.string(), z.string()]),
  comentarioP1: z.string(),
  comentarioP2: z.string(),
  comentarioP3: z.string(),
  comentarioComparacion: z.string(),
  ratings: z.object(ratingsShape),
  preferida: z.enum(['1', '2', '3']).nullable(),
  razonPreferida: z.string(),
  aspectoMejorar: z.string(),
  elementoIndispensable: z.string(),
  comentarioFinal: z.string(),
})

export type SurveyPayload = z.infer<typeof surveyPayloadSchema>
