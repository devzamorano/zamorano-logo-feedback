import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WordAssociationSlideProps {
  palabras: [string, string, string]
  onChange: (index: 0 | 1 | 2, value: string) => void
}

export function WordAssociationSlide({ palabras, onChange }: WordAssociationSlideProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Antes de ver las propuestas, escribí las primeras 3 palabras que se te vienen a la mente cuando
        pensás en la Universidad Zamorano.
      </p>
      {([0, 1, 2] as const).map((index) => (
        <div key={index} className="space-y-1">
          <Label htmlFor={`palabra-${index}`}>Palabra {index + 1}</Label>
          <Input
            id={`palabra-${index}`}
            value={palabras[index]}
            onChange={(event) => onChange(index, event.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
