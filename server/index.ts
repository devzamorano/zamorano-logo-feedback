import 'dotenv/config'
import Fastify from 'fastify'
import { pool } from './db.ts'
import { registerRoutes } from './routes.ts'

const app = Fastify({ logger: true })

async function main() {
  try {
    await pool.query('select 1')
  } catch (error) {
    app.log.fatal(error, 'could not connect to Postgres — check DATABASE_URL')
    process.exit(1)
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logo_evaluations (
        id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        palabras                TEXT[]      NOT NULL DEFAULT '{}',
        comentario_p1           TEXT,
        comentario_p2           TEXT,
        comentario_p3           TEXT,
        comentario_comparacion  TEXT,
        ratings                 JSONB       NOT NULL DEFAULT '{}'::jsonb,
        preferida               SMALLINT,
        razon_preferida         TEXT,
        aspecto_mejorar         TEXT,
        elemento_indispensable  TEXT,
        comentario_final        TEXT,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)
  } catch (error) {
    app.log.fatal(error, 'could not ensure logo_evaluations table exists')
    process.exit(1)
  }

  await registerRoutes(app)

  const port = Number(process.env.PORT) || 3001
  await app.listen({ port, host: '0.0.0.0' })
}

main().catch((error) => {
  app.log.fatal(error, 'fatal error starting server')
  process.exit(1)
})
