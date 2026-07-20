import type { FastifyInstance } from 'fastify'
import { pool } from './db.ts'

interface CriterionRatings {
  p1: number | null
  p2: number | null
  p3: number | null
}

interface ResponsePayload {
  palabras: [string, string, string]
  comentarioP1: string
  comentarioP2: string
  comentarioP3: string
  comentarioComparacion: string
  ratings: Record<string, CriterionRatings>
  preferida: '1' | '2' | '3' | null
  razonPreferida: string
  aspectoMejorar: string
  elementoIndispensable: string
  comentarioFinal: string
}

export async function registerRoutes(app: FastifyInstance) {
  app.post('/api/responses', async (request, reply) => {
    const body = request.body as ResponsePayload

    try {
      const result = await pool.query(
        `INSERT INTO logo_evaluations
          (palabras, comentario_p1, comentario_p2, comentario_p3, comentario_comparacion,
           ratings, preferida, razon_preferida, aspecto_mejorar, elemento_indispensable, comentario_final)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, created_at`,
        [
          body.palabras ?? [],
          body.comentarioP1 ?? null,
          body.comentarioP2 ?? null,
          body.comentarioP3 ?? null,
          body.comentarioComparacion ?? null,
          JSON.stringify(body.ratings ?? {}),
          body.preferida ? Number(body.preferida) : null,
          body.razonPreferida ?? null,
          body.aspectoMejorar ?? null,
          body.elementoIndispensable ?? null,
          body.comentarioFinal ?? null,
        ]
      )

      const row = result.rows[0] as { id: number; created_at: Date }
      return reply.status(201).send({ id: row.id, created_at: row.created_at })
    } catch (error) {
      app.log.error(error, 'failed to insert logo_evaluations row')
      return reply.status(500).send({ error: 'insert_failed' })
    }
  })

  app.get('/api/responses', async (_request, reply) => {
    try {
      const result = await pool.query('SELECT * FROM logo_evaluations ORDER BY created_at ASC')
      return reply.status(200).send(result.rows)
    } catch (error) {
      app.log.error(error, 'failed to fetch logo_evaluations rows')
      return reply.status(500).send({ error: 'fetch_failed' })
    }
  })
}
