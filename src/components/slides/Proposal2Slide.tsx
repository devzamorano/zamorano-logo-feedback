import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Proposal2SlideProps {
  comentario: string
  onChange: (value: string) => void
}

export function Proposal2Slide({ comentario, onChange }: Proposal2SlideProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="comentario-p2">¿Cuáles son sus comentarios sobre esta propuesta? *</Label>
        <Textarea id="comentario-p2" value={comentario} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  )
}
