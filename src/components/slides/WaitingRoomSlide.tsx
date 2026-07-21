export function WaitingRoomSlide() {
  return (
    <div className="space-y-4 py-6 text-center">
      <div className="flex justify-center gap-1.5">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-zamorano [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-zamorano [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-zamorano" />
      </div>
      <p className="text-lg font-semibold text-gray-900">Estamos contando las palabras…</p>
      <p className="text-gray-600">
        En un momento el presentador va a habilitar la primera propuesta. Quedate en esta pantalla,
        avanza sola.
      </p>
    </div>
  )
}
