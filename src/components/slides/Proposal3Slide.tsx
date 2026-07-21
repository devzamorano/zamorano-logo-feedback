import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Proposal3SlideProps {
  comentario: string
  onChange: (value: string) => void
}

export function Proposal3Slide({ comentario, onChange }: Proposal3SlideProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="comentario-p3">¿Cuáles son sus comentarios sobre esta propuesta? *</Label>
        <Textarea id="comentario-p3" value={comentario} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  )
}
