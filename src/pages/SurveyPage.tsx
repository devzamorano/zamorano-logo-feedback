import { useState } from 'react'
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
import { postResponse } from '@/lib/api'
import { emptySurveyState, type Criterion, type PreferredProposal, type SurveyState } from '@/types/survey'

const TOTAL_STEPS = 8

type ProposalKey = 'p1' | 'p2' | 'p3'
type Score = 1 | 2 | 3 | 4 | 5 | null

export function SurveyPage() {
  const [step, setStep] = useState(1)
  const [survey, setSurvey] = useState<SurveyState>(emptySurveyState())
  const [submitting, setSubmitting] = useState(false)

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
      await postResponse(survey)
      setStep(8)
    } catch {
      toast.error('No se pudo enviar tu respuesta. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleNext() {
    if (step === 7) {
      void handleSubmit()
      return
    }
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <SlideShell
      step={step}
      totalSteps={TOTAL_STEPS}
      onBack={handleBack}
      onNext={handleNext}
      hideBack={step === 1}
      hideNext={step === 8}
      nextLabel={step === 7 ? (submitting ? 'Enviando…' : 'Enviar') : 'Siguiente'}
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
