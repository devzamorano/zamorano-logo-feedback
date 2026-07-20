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

  if (broken) {
    return (
      <div
        className={cn(
          'flex aspect-video w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400',
          className
        )}
      >
        {label}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className={cn('aspect-video w-full rounded-md border border-gray-200 object-contain', className)}
    />
  )
}
