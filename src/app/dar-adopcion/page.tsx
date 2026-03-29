import Link from 'next/link'
import { GiveUpForm } from '@/components/forms/GiveUpForm'

export const metadata = {
  title: 'Dar en Adopción - Dame una Pata Paraguay',
  description: 'Formulario para dar en adopción tu mascota',
}

export default function DarAdopcionPage() {
  return (
    <div className="min-h-screen bg-[--background] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[--primary] mb-2">🏠 Formulario para Dar en Adopción</h1>
          <p className="text-[--text-muted]">
            Completá el formulario y te ayudaremos a encontrarle un nuevo hogar a tu mascota.
          </p>
        </div>
        <GiveUpForm />
      </div>
    </div>
  )
}
