import type { SurveyState } from '@/types/survey'

export interface PostResponseResult {
  id: number
  created_at: string
}

export async function postResponse(payload: SurveyState): Promise<PostResponseResult> {
  const res = await fetch('/api/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('insert_failed')
  }

  return (await res.json()) as PostResponseResult
}

export async function fetchResponses(): Promise<Record<string, unknown>[]> {
  const res = await fetch('/api/responses')

  if (!res.ok) {
    throw new Error('fetch_failed')
  }

  return (await res.json()) as Record<string, unknown>[]
}
