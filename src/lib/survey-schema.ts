import { z } from 'zod'
import { CRITERIA } from '@/types/survey'

const scoreSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])

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
  palabras: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
  comentarioP1: z.string().min(1),
  comentarioP2: z.string().min(1),
  comentarioP3: z.string().min(1),
  comentarioComparacion: z.string().min(1),
  ratings: z.object(ratingsShape),
  preferida: z.enum(['1', '2', '3']),
  razonPreferida: z.string().min(1),
  aspectoMejorar: z.string().min(1),
  elementoIndispensable: z.string().min(1),
  comentarioFinal: z.string().min(1),
})

export type SurveyPayload = z.infer<typeof surveyPayloadSchema>
