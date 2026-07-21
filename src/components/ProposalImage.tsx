import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProposalImageProps {
  src: string
  alt: string
  label: string
  className?: string
}

export function ProposalImage({ src, alt, label, className }: ProposalImageProps) {
  const [broken, setBroken] = useState(false)

  return (
    <div
      className={cn(
        'flex aspect-video w-full items-center justify-center overflow-hidden rounded-md bg-zamorano',
        className
      )}
    >
      {broken ? (
        <span className="text-sm font-medium text-white/70">{label}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setBroken(true)}
          className="h-full w-full object-contain p-6"
        />
      )}
    </div>
  )
}
