interface WaitingRoomSlideProps {
  message?: string
}

export function WaitingRoomSlide({ message = 'Estamos revisando tus respuestas…' }: WaitingRoomSlideProps) {
  return (
    <div className="space-y-4 py-6 text-center">
      <div className="flex justify-center gap-1.5">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-zamorano [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-zamorano [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-zamorano" />
      </div>
      <p className="text-lg font-semibold text-gray-900">{message}</p>
    </div>
  )
}
