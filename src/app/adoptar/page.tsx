import Link from 'next/link'

export const metadata = {
  title: 'Adoptar - Dame una Pata Paraguay',
  description: 'Formulario de adopción de mascotas para Dame una Pata Paraguay',
}

export default function AdoptarPage() {
  return (
    <div className="min-h-screen bg-[--background] py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-[--primary] mb-2">🐾 Formulario de Adopción</h1>
        <p className="text-[--text-muted] mb-8">
          Seleccioná el tipo de mascota que te interesa adoptar
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/adoptar/perros"
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition group"
          >
            <div className="text-6xl mb-4">🐶</div>
            <h3 className="text-xl font-semibold mb-2 text-[--primary]">Quiero adoptar un Perro</h3>
            <p className="text-[--text-muted] text-sm">Completá el formulario de adopción para perros</p>
          </Link>

          <Link 
            href="/adoptar/gatos"
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition group"
          >
            <div className="text-6xl mb-4">🐱</div>
            <h3 className="text-xl font-semibold mb-2 text-[--primary]">Quiero adoptar un Gato</h3>
            <p className="text-[--text-muted] text-sm">Completá el formulario de adopción para gatos</p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-[--primary] hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
