-- Zamorano 85th-Anniversary Logo Feedback App
-- logo_evaluations: one row per anonymous participant submission.

CREATE TABLE IF NOT EXISTS logo_evaluations (
  id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  palabras                TEXT[]      NOT NULL DEFAULT '{}',
  comentario_p1           TEXT,
  comentario_p2           TEXT,
  comentario_p3           TEXT,
  comentario_comparacion  TEXT,
  ratings                 JSONB       NOT NULL DEFAULT '{}'::jsonb,
  preferida               SMALLINT,   -- 1|2|3, nullable
  razon_preferida         TEXT,
  aspecto_mejorar         TEXT,
  elemento_indispensable  TEXT,
  comentario_final        TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
