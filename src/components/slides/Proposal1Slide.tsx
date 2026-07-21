import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Proposal1SlideProps {
  comentario: string
  onChange: (value: string) => void
}

export function Proposal1Slide({ comentario, onChange }: Proposal1SlideProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="comentario-p1">¿Cuáles son sus comentarios sobre esta propuesta? *</Label>
        <Textarea id="comentario-p1" value={comentario} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  )
}
