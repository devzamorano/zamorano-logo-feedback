import { ProposalImage } from '@/components/ProposalImage'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Proposal3SlideProps {
  comentario: string
  onChange: (value: string) => void
}

export function Proposal3Slide({ comentario, onChange }: Proposal3SlideProps) {
  return (
    <div className="space-y-4">
      <ProposalImage src="/propuesta-3.png" alt="Propuesta 3" label="Propuesta 3" />
      <div className="space-y-1">
        <Label htmlFor="comentario-p3">¿Qué te parece esta propuesta?</Label>
        <Textarea id="comentario-p3" value={comentario} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  )
}
