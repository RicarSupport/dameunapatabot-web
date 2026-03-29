import Link from 'next/link'

export const metadata = {
  title: 'Voluntariado - Dame una Pata Paraguay',
}

export default function VoluntarioPage() {
  return (
    <div className="min-h-screen bg-[--background] py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-[--primary] mb-4">🤝 Voluntariado</h1>
        <p className="text-[--text-muted] mb-8">
          El formulario de voluntariado estará disponible pronto. Contactanos por WhatsApp para sumarte al equipo.
        </p>
        <a 
          href="https://wa.me/595991234567?text=Hola!%20Quiero%20ser%20voluntario"
          className="inline-block bg-[--primary] text-white px-6 py-3 rounded-lg font-medium hover:bg-[--primary-light] transition"
        >
          Contactar por WhatsApp
        </a>
        <div className="mt-8">
          <Link href="/" className="text-[--primary] hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
