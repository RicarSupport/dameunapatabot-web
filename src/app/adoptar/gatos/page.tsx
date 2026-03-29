import { CatAdoptionForm } from '@/components/forms/CatAdoptionForm'

export const metadata = {
  title: 'Adoptar Gato - Dame una Pata Paraguay',
  description: 'Formulario de adopción de gatos para Dame una Pata Paraguay',
}

export default function AdoptarGatosPage() {
  return (
    <div className="min-h-screen bg-[--background] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[--primary] mb-2">🐱 Formulario de Adopción - Gatos</h1>
          <p className="text-[--text-muted]">
            Completá el formulario y nos pondremos en contacto con vos.
          </p>
        </div>
        <CatAdoptionForm />
      </div>
    </div>
  )
}
