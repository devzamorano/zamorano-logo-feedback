import { useEffect, useRef, useState } from 'react'
import { fetchWords, type WordCount } from '@/lib/api'

const POLL_INTERVAL_MS = 4000
const MIN_FONT_PX = 16
const MAX_FONT_PX = 64

// Fixed 8-hue categorical palette — assigned by word identity, never by rank.
// Pastel tints (35% white mix) of the validated dataviz categorical palette — sober and
// elegant for a decorative live-session display, with more visible saturation than a
// 50% mix while still reading as pastel.
const CATEGORICAL_HUES = [
  '#75a7e4', // blue
  '#59ae59', // green
  '#f0a9c4', // magenta
  '#f3c259', // yellow
  '#6bcba9', // aqua
  '#f29d7b', // orange
  '#897fc6', // violet
  '#ed8988', // red
] as const

function magnitudeRatio(count: number, maxCount: number): number {
  if (maxCount <= 0) return 0
  return Math.sqrt(count) / Math.sqrt(maxCount)
}

function sizeFor(count: number, maxCount: number): number {
  return MIN_FONT_PX + magnitudeRatio(count, maxCount) * (MAX_FONT_PX - MIN_FONT_PX)
}

function colorFor(word: string): string {
  let hash = 0
  for (const char of word) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return CATEGORICAL_HUES[hash % CATEGORICAL_HUES.length]
}

interface ArrangedWord {
  word: string
  count: number
  isTop: boolean
}

function arrangeWithTopInMiddle(words: WordCount[]): ArrangedWord[] {
  if (words.length === 0) return []

  const alphabetical = [...words].sort((a, b) => a.word.localeCompare(b.word))
  const maxCount = Math.max(...words.map((word) => word.count))
  const topIndex = alphabetical.findIndex((word) => word.count === maxCount)
  const [topWord] = alphabetical.splice(topIndex, 1)

  const middleIndex = Math.floor(alphabetical.length / 2)
  const arranged = [...alphabetical.slice(0, middleIndex), topWord, ...alphabetical.slice(middleIndex)]

  return arranged.map((word) => ({ ...word, isTop: word.word === topWord.word }))
}

export function WordsPage() {
  const [words, setWords] = useState<WordCount[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const data = await fetchWords()
        if (!cancelled) setWords(data)
      } catch {
        // silent — the next poll retries
      }
    }

    void poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [])

  const maxCount = words.reduce((max, word) => Math.max(max, word.count), 0)
  const arrangedWords = arrangeWithTopInMiddle(words)

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-semibold text-white">
        ¿Qué se le viene a la mente con Universidad Zamorano?
      </h1>
      <div className="rounded-xl bg-white p-10 shadow">
        {arrangedWords.length === 0 ? (
          <p className="text-center text-gray-400">Todavía no hay palabras cargadas.</p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {arrangedWords.map(({ word, count, isTop }) => {
              const color = colorFor(word)
              return (
                <span
                  key={word}
                  className="animate-word-in font-bold leading-none transition-all duration-700 ease-out"
                  style={{
                    fontSize: `${sizeFor(count, maxCount)}px`,
                    color,
                    textShadow: isTop ? `0 0 18px ${color}66, 0 0 4px ${color}` : 'none',
                  }}
                  title={`${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  {word}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
