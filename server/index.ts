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

  await registerRoutes(app)

  const port = Number(process.env.PORT) || 3001
  await app.listen({ port })
}

main().catch((error) => {
  app.log.fatal(error, 'fatal error starting server')
  process.exit(1)
})
