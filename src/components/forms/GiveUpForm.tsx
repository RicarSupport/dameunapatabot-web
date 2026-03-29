'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const giveUpSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  phone: z.string().min(8, 'El teléfono es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  animalType: z.enum(['perro', 'gato'], { required_error: 'Selecciona tipo de animal' }),
  breed: z.string().optional(),
  age: z.string().optional(),
  sex: z.enum(['macho', 'hembra'], { required_error: 'Selecciona el sexo' }),
  description: z.string().min(10, 'Cuéntanos más sobre tu mascota'),
})

type GiveUpFormData = z.infer<typeof giveUpSchema>

export function GiveUpForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const { register, handleSubmit, formState: { errors } } = useForm<GiveUpFormData>({
    resolver: zodResolver(giveUpSchema),
  })

  const onSubmit = async (data: GiveUpFormData) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const res = await fetch('/api/forms/give-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) throw new Error('Error al enviar')
      
      const { token } = await res.json()
      router.push(`/gracias?token=${token}&type=give-up`)
    } catch (e) {
      setError('Hubo un error. Intentá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[--primary]">Datos de contacto</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo *</label>
          <input {...register('name')} className="w-full p-3 border rounded-lg" placeholder="Tu nombre" />
          {errors.name && <p className="text-[--error] text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono / WhatsApp *</label>
          <input {...register('phone')} className="w-full p-3 border rounded-lg" placeholder="+595 9XX XXX XXX" />
          {errors.phone && <p className="text-[--error] text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input {...register('email')} type="email" className="w-full p-3 border rounded-lg" placeholder="tu@email.com" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[--primary]">Datos de tu mascota</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de animal *</label>
          <select {...register('animalType')} className="w-full p-3 border rounded-lg">
            <option value="">Seleccionar...</option>
            <option value="perro">🐶 Perro</option>
            <option value="gato">🐱 Gato</option>
          </select>
          {errors.animalType && <p className="text-[--error] text-sm mt-1">{errors.animalType.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Raza</label>
            <input {...register('breed')} className="w-full p-3 border rounded-lg" placeholder="Si se conoce" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Edad aproximada</label>
            <input {...register('age')} className="w-full p-3 border rounded-lg" placeholder="Ej: 3 años" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sexo *</label>
          <select {...register('sex')} className="w-full p-3 border rounded-lg">
            <option value="">Seleccionar...</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
          {errors.sex && <p className="text-[--error] text-sm mt-1">{errors.sex.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cuéntanos sobre tu mascota *</label>
          <textarea {...register('description')} rows={4} className="w-full p-3 border rounded-lg" placeholder="Personalidad, hábitos, estado de salud, vacunas..." />
          {errors.description && <p className="text-[--error] text-sm mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {error && <p className="text-[--error] text-center">{error}</p>}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[--primary] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[--primary-light] transition disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  )
}
