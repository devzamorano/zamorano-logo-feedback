import { EvaluationGrid } from '@/components/EvaluationGrid'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { PREFERRED, type Criterion, type PreferredProposal, type Ratings } from '@/types/survey'

type ProposalKey = 'p1' | 'p2' | 'p3'
type Score = 1 | 2 | 3 | 4 | 5 | null

interface EvaluationSlideProps {
  ratings: Ratings
  onRatingChange: (criterion: Criterion, proposal: ProposalKey, value: Score) => void
  preferida: PreferredProposal | null
  onPreferidaChange: (value: PreferredProposal) => void
  razonPreferida: string
  onRazonPreferidaChange: (value: string) => void
  aspectoMejorar: string
  onAspectoMejorarChange: (value: string) => void
  elementoIndispensable: string
  onElementoIndispensableChange: (value: string) => void
  comentarioFinal: string
  onComentarioFinalChange: (value: string) => void
}

export function EvaluationSlide({
  ratings,
  onRatingChange,
  preferida,
  onPreferidaChange,
  razonPreferida,
  onRazonPreferidaChange,
  aspectoMejorar,
  onAspectoMejorarChange,
  elementoIndispensable,
  onElementoIndispensableChange,
  comentarioFinal,
  onComentarioFinalChange,
}: EvaluationSlideProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="font-semibold">Ficha de evaluación</h2>
        <EvaluationGrid ratings={ratings} onChange={onRatingChange} />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Priorización</h2>
        <div className="space-y-1">
          <Label>¿Cuál propuesta prefiere? *</Label>
          <RadioGroup
            value={preferida ?? undefined}
            onValueChange={(value) => onPreferidaChange(value as PreferredProposal)}
            className="grid-flow-col justify-start gap-6"
          >
            {(Object.values(PREFERRED) as PreferredProposal[]).map((value) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`preferida-${value}`} />
                <Label htmlFor={`preferida-${value}`}>Propuesta {value}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-1">
          <Label htmlFor="razon-preferida">¿Por qué? *</Label>
          <Textarea
            id="razon-preferida"
            value={razonPreferida}
            onChange={(event) => onRazonPreferidaChange(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="aspecto-mejorar">
            ¿Cuál es el principal aspecto que debería mejorarse o fortalecerse? *
          </Label>
          <Textarea
            id="aspecto-mejorar"
            value={aspectoMejorar}
            onChange={(event) => onAspectoMejorarChange(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="elemento-indispensable">
            ¿Qué elemento o característica considera indispensable? *
          </Label>
          <Textarea
            id="elemento-indispensable"
            value={elementoIndispensable}
            onChange={(event) => onElementoIndispensableChange(event.target.value)}
          />
        </div>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">Comentario final</h2>
        <Label htmlFor="comentario-final">
          Si pudiera hacer una recomendación final al equipo responsable del desarrollo del logotipo,
          ¿cuál sería? *
        </Label>
        <Textarea
          id="comentario-final"
          value={comentarioFinal}
          onChange={(event) => onComentarioFinalChange(event.target.value)}
        />
      </section>
    </div>
  )
}
