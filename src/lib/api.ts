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

export async function postPalabras(palabras: [string, string, string]): Promise<PostResponseResult> {
  const res = await fetch('/api/responses/words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ palabras }),
  })

  if (!res.ok) {
    throw new Error('insert_failed')
  }

  return (await res.json()) as PostResponseResult
}

export async function updatePalabras(id: number, palabras: [string, string, string]): Promise<PostResponseResult> {
  const res = await fetch(`/api/responses/${id}/words`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ palabras }),
  })

  if (!res.ok) {
    throw new Error('update_failed')
  }

  return (await res.json()) as PostResponseResult
}

export async function updateResponse(
  id: number,
  payload: Omit<SurveyState, 'palabras'>
): Promise<PostResponseResult> {
  const res = await fetch(`/api/responses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('update_failed')
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

export interface WordCount {
  word: string
  count: number
}

export async function fetchWords(): Promise<WordCount[]> {
  const res = await fetch('/api/words')

  if (!res.ok) {
    throw new Error('fetch_failed')
  }

  return (await res.json()) as WordCount[]
}

export interface AdminState {
  maxUnlockedStep: number
}

export async function fetchAdminState(): Promise<AdminState> {
  const res = await fetch('/api/admin/state')

  if (!res.ok) {
    throw new Error('fetch_failed')
  }

  return (await res.json()) as AdminState
}

export async function advanceAdminState(pin: string): Promise<AdminState> {
  const res = await fetch('/api/admin/advance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })

  if (!res.ok) {
    throw new Error(res.status === 401 ? 'invalid_pin' : 'update_failed')
  }

  return (await res.json()) as AdminState
}

export async function resetAdminState(pin: string): Promise<AdminState> {
  const res = await fetch('/api/admin/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })

  if (!res.ok) {
    throw new Error(res.status === 401 ? 'invalid_pin' : 'update_failed')
  }

  return (await res.json()) as AdminState
}

export async function clearAllResponses(pin: string): Promise<void> {
  const res = await fetch('/api/admin/clear-responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })

  if (!res.ok) {
    throw new Error(res.status === 401 ? 'invalid_pin' : 'clear_failed')
  }
}
