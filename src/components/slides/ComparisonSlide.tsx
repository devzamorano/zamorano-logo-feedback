import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ComparisonSlideProps {
  comentario: string
  onChange: (value: string) => void
}

export function ComparisonSlide({ comentario, onChange }: ComparisonSlideProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Ahora que viste las tres propuestas, ¿qué diferencias o similitudes notás entre ellas?
      </p>
      <div className="space-y-1">
        <Label htmlFor="comentario-comparacion">Comentario</Label>
        <Textarea
          id="comentario-comparacion"
          value={comentario}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}
