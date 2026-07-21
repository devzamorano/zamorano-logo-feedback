import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SlideShellProps {
  step: number
  totalSteps: number
  title?: string
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  hideBack?: boolean
  hideNext?: boolean
  nextDisabled?: boolean
  nextHint?: string
  children: ReactNode
}

export function SlideShell({
  step,
  totalSteps,
  title,
  onBack,
  onNext,
  backLabel = 'Atrás',
  nextLabel = 'Siguiente',
  hideBack = false,
  hideNext = false,
  nextDisabled = false,
  nextHint = 'Complete todos los campos para continuar.',
  children,
}: SlideShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-8">
      <p className="mb-2 text-center text-sm font-medium text-white/90">
        Paso {step} de {totalSteps}
      </p>
      <Card>
        <CardContent className="space-y-6 p-6">
          {title ? <h1 className="text-xl font-semibold">{title}</h1> : null}
          {children}
          <div className="flex items-center justify-between pt-4">
            {hideBack ? <span /> : (
              <Button type="button" variant="outline" onClick={onBack}>
                {backLabel}
              </Button>
            )}
            {hideNext ? <span /> : (
              <Button type="button" onClick={onNext} disabled={nextDisabled}>
                {nextLabel}
              </Button>
            )}
          </div>
          {!hideNext && nextDisabled ? <p className="text-center text-xs text-red-600">{nextHint}</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}
