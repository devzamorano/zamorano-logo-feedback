import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SlideShell } from '@/components/SlideShell'
import { WelcomeSlide } from '@/components/slides/WelcomeSlide'
import { WordAssociationSlide } from '@/components/slides/WordAssociationSlide'
import { Proposal1Slide } from '@/components/slides/Proposal1Slide'
import { Proposal2Slide } from '@/components/slides/Proposal2Slide'
import { Proposal3Slide } from '@/components/slides/Proposal3Slide'
import { ComparisonSlide } from '@/components/slides/ComparisonSlide'
import { EvaluationSlide } from '@/components/slides/EvaluationSlide'
import { ClosingSlide } from '@/components/slides/ClosingSlide'
import { fetchAdminState, postPalabras, postResponse, updatePalabras, updateResponse } from '@/lib/api'
import { isStepComplete } from '@/lib/validation'
import { emptySurveyState, type Criterion, type PreferredProposal, type SurveyState } from '@/types/survey'

const TOTAL_STEPS = 8
const ADMIN_POLL_INTERVAL_MS = 3000
const GATED_STEPS = [3, 4, 5]
const ALREADY_SUBMITTED_KEY = 'zamorano-logo-survey-submitted'

type ProposalKey = 'p1' | 'p2' | 'p3'
type Score = 1 | 2 | 3 | 4 | 5 | null

export function SurveyPage() {
  const [step, setStep] = useState(1)
  const [survey, setSurvey] = useState<SurveyState>(emptySurveyState())
  const [submitting, setSubmitting] = useState(false)
  const [savingWords, setSavingWords] = useState(false)
  const [responseId, setResponseId] = useState<number | null>(null)
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(3)
  const [alreadySubmitted] = useState(() => localStorage.getItem(ALREADY_SUBMITTED_KEY) === 'true')

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const state = await fetchAdminState()
        if (!cancelled) setMaxUnlockedStep(state.maxUnlockedStep)
      } catch {
        // silent — the next poll retries
      }
    }

    void poll()
    const interval = setInterval(poll, ADMIN_POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  function updatePalabra(index: 0 | 1 | 2, value: string) {
    setSurvey((prev) => {
      const palabras: [string, string, string] = [...prev.palabras]
      palabras[index] = value
      return { ...prev, palabras }
    })
  }

  function updateRating(criterion: Criterion, proposal: ProposalKey, value: Score) {
    setSurvey((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [criterion]: { ...prev.ratings[criterion], [proposal]: value },
      },
    }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const { palabras: _palabras, ...rest } = survey
      if (responseId !== null) {
        await updateResponse(responseId, rest)
      } else {
        await postResponse(survey)
      }
      localStorage.setItem(ALREADY_SUBMITTED_KEY, 'true')
      setStep(8)
    } catch {
      toast.error('No se pudo enviar su respuesta. Intente de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveWords() {
    setSavingWords(true)
    try {
      if (responseId !== null) {
        await updatePalabras(responseId, survey.palabras)
      } else {
        const result = await postPalabras(survey.palabras)
        setResponseId(result.id)
      }
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
    } catch {
      toast.error('No se pudieron guardar las palabras. Intente de nuevo.')
    } finally {
      setSavingWords(false)
    }
  }

  function isGateOpen(currentStep: number): boolean {
    if (!GATED_STEPS.includes(currentStep)) return true
    return maxUnlockedStep > currentStep
  }

  function handleNext() {
    if (!isStepComplete(step, survey)) return
    if (!isGateOpen(step)) return
    if (step === 2) {
      void handleSaveWords()
      return
    }
    if (step === 7) {
      void handleSubmit()
      return
    }
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  if (alreadySubmitted) {
    return (
      <SlideShell step={TOTAL_STEPS} totalSteps={TOTAL_STEPS} hideBack hideNext>
        <div className="space-y-4 text-gray-700">
          <p className="font-semibold">Ya enviaste tu respuesta.</p>
          <p>Cada participante puede completar esta evaluación una sola vez. ¡Gracias por tu tiempo!</p>
        </div>
      </SlideShell>
    )
  }

  const fieldsIncomplete = !isStepComplete(step, survey)
  const gateClosed = !isGateOpen(step)

  return (
    <SlideShell
      step={step}
      totalSteps={TOTAL_STEPS}
      onBack={handleBack}
      onNext={handleNext}
      hideBack={step === 1}
      hideNext={step === 8}
      nextDisabled={fieldsIncomplete || gateClosed || (step === 7 && submitting) || (step === 2 && savingWords)}
      nextHint={
        gateClosed && !fieldsIncomplete
          ? 'Esperando a que el presentador habilite la siguiente propuesta…'
          : 'Complete todos los campos para continuar.'
      }
      nextLabel={
        step === 7 ? (submitting ? 'Enviando…' : 'Enviar') : step === 2 && savingWords ? 'Guardando…' : 'Siguiente'
      }
    >
      {step === 1 && <WelcomeSlide />}
      {step === 2 && <WordAssociationSlide palabras={survey.palabras} onChange={updatePalabra} />}
      {step === 3 && (
        <Proposal1Slide
          comentario={survey.comentarioP1}
          onChange={(value) => setSurvey((prev) => ({ ...prev, comentarioP1: value }))}
        />
      )}
      {step === 4 && (
        <Proposal2Slide
          comentario={survey.comentarioP2}
          onChange={(value) => setSurvey((prev) => ({ ...prev, comentarioP2: value }))}
        />
      )}
      {step === 5 && (
        <Proposal3Slide
          comentario={survey.comentarioP3}
          onChange={(value) => setSurvey((prev) => ({ ...prev, comentarioP3: value }))}
        />
      )}
      {step === 6 && (
        <ComparisonSlide
          comentario={survey.comentarioComparacion}
          onChange={(value) => setSurvey((prev) => ({ ...prev, comentarioComparacion: value }))}
        />
      )}
      {step === 7 && (
        <EvaluationSlide
          ratings={survey.ratings}
          onRatingChange={updateRating}
          preferida={survey.preferida}
          onPreferidaChange={(value: PreferredProposal) => setSurvey((prev) => ({ ...prev, preferida: value }))}
          razonPreferida={survey.razonPreferida}
          onRazonPreferidaChange={(value) => setSurvey((prev) => ({ ...prev, razonPreferida: value }))}
          aspectoMejorar={survey.aspectoMejorar}
          onAspectoMejorarChange={(value) => setSurvey((prev) => ({ ...prev, aspectoMejorar: value }))}
          elementoIndispensable={survey.elementoIndispensable}
          onElementoIndispensableChange={(value) =>
            setSurvey((prev) => ({ ...prev, elementoIndispensable: value }))
          }
          comentarioFinal={survey.comentarioFinal}
          onComentarioFinalChange={(value) => setSurvey((prev) => ({ ...prev, comentarioFinal: value }))}
        />
      )}
      {step === 8 && <ClosingSlide />}
    </SlideShell>
  )
}
