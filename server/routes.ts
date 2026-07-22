import type { FastifyInstance } from 'fastify'
import { pool } from './db.ts'
import { advanceMaxUnlockedStep, getMaxUnlockedStep, resetMaxUnlockedStep } from './adminState.ts'

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

interface PalabrasPayload {
  palabras: [string, string, string]
}

interface RestOfResponsePayload {
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
  app.post('/api/responses/words', async (request, reply) => {
    const { palabras } = request.body as PalabrasPayload

    try {
      const result = await pool.query(
        `INSERT INTO logo_evaluations (palabras) VALUES ($1) RETURNING id, created_at`,
        [palabras ?? []]
      )
      const row = result.rows[0] as { id: number; created_at: Date }
      return reply.status(201).send({ id: row.id, created_at: row.created_at })
    } catch (error) {
      app.log.error(error, 'failed to insert partial palabras row')
      return reply.status(500).send({ error: 'insert_failed' })
    }
  })

  app.patch('/api/responses/:id/words', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { palabras } = request.body as PalabrasPayload

    try {
      const result = await pool.query(
        `UPDATE logo_evaluations SET palabras = $1 WHERE id = $2 RETURNING id, created_at`,
        [palabras ?? [], id]
      )
      if (result.rowCount === 0) {
        return reply.status(404).send({ error: 'not_found' })
      }
      const row = result.rows[0] as { id: number; created_at: Date }
      return reply.status(200).send({ id: row.id, created_at: row.created_at })
    } catch (error) {
      app.log.error(error, 'failed to update palabras row')
      return reply.status(500).send({ error: 'update_failed' })
    }
  })

  app.patch('/api/responses/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = request.body as RestOfResponsePayload

    try {
      const result = await pool.query(
        `UPDATE logo_evaluations
         SET comentario_p1 = $1, comentario_p2 = $2, comentario_p3 = $3, comentario_comparacion = $4,
             ratings = $5, preferida = $6, razon_preferida = $7, aspecto_mejorar = $8,
             elemento_indispensable = $9, comentario_final = $10
         WHERE id = $11
         RETURNING id, created_at`,
        [
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
          id,
        ]
      )
      if (result.rowCount === 0) {
        return reply.status(404).send({ error: 'not_found' })
      }
      const row = result.rows[0] as { id: number; created_at: Date }
      return reply.status(200).send({ id: row.id, created_at: row.created_at })
    } catch (error) {
      app.log.error(error, 'failed to update logo_evaluations row')
      return reply.status(500).send({ error: 'update_failed' })
    }
  })

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

  app.get('/api/words', async (_request, reply) => {
    try {
      const result = await pool.query(
        `SELECT lower(trim(word)) AS word, count(*)::int AS count
         FROM logo_evaluations, unnest(palabras) AS word
         WHERE trim(word) <> ''
         GROUP BY lower(trim(word))
         ORDER BY count DESC, word ASC`
      )
      return reply.status(200).send(result.rows)
    } catch (error) {
      app.log.error(error, 'failed to aggregate word counts')
      return reply.status(500).send({ error: 'fetch_failed' })
    }
  })

  app.get('/api/admin/state', async (_request, reply) => {
    return reply.status(200).send({ maxUnlockedStep: getMaxUnlockedStep() })
  })

  app.post('/api/admin/advance', async (request, reply) => {
    const { pin } = request.body as { pin: string }
    if (pin !== process.env.ADMIN_PIN) {
      return reply.status(401).send({ error: 'invalid_pin' })
    }
    return reply.status(200).send({ maxUnlockedStep: advanceMaxUnlockedStep() })
  })

  app.post('/api/admin/reset', async (request, reply) => {
    const { pin } = request.body as { pin: string }
    if (pin !== process.env.ADMIN_PIN) {
      return reply.status(401).send({ error: 'invalid_pin' })
    }
    return reply.status(200).send({ maxUnlockedStep: resetMaxUnlockedStep() })
  })

  // Kept available while testing — clears all responses/words for a fresh test run.
  app.post('/api/admin/clear-responses', async (request, reply) => {
    const { pin } = request.body as { pin: string }
    if (pin !== process.env.ADMIN_PIN) {
      return reply.status(401).send({ error: 'invalid_pin' })
    }
    try {
      await pool.query('TRUNCATE TABLE logo_evaluations RESTART IDENTITY')
      return reply.status(200).send({ cleared: true })
    } catch (error) {
      app.log.error(error, 'failed to clear logo_evaluations')
      return reply.status(500).send({ error: 'clear_failed' })
    }
  })
}
