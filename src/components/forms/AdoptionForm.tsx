'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const adoptionSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  phone: z.string().min(8, 'El teléfono es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  housingType: z.enum(['casa', 'depto', 'otro'], { required_error: 'Selecciona tipo de vivienda' }),
  hasYard: z.boolean(),
  currentPets: z.string().optional(),
  hasChildren: z.boolean(),
  childrenAges: z.string().optional(),
  workHours: z.string().optional(),
  petInterest: z.string().min(1, 'Indica la mascota de interés'),
  adoptionReason: z.string().min(10, 'Cuéntanos por qué querés adoptar'),
})

type AdoptionFormData = z.infer<typeof adoptionSchema>

export function AdoptionForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const { register, handleSubmit, formState: { errors } } = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: {
      hasYard: false,
      hasChildren: false,
    }
  })

  const onSubmit = async (data: AdoptionFormData) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const res = await fetch('/api/forms/adoption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) throw new Error('Error al enviar')
      
      const { token } = await res.json()
      router.push(`/gracias?token=${token}&type=adoption`)
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
          {errors.email && <p className="text-[--error] text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[--primary]">Tu vivienda</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de vivienda *</label>
          <select {...register('housingType')} className="w-full p-3 border rounded-lg">
            <option value="">Seleccionar...</option>
            <option value="casa">Casa</option>
            <option value="depto">Departamento</option>
            <option value="otro">Otro</option>
          </select>
          {errors.housingType && <p className="text-[--error] text-sm mt-1">{errors.housingType.message}</p>}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('hasYard')} className="w-5 h-5" />
            <span>¿Tenés patio?</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('hasChildren')} className="w-5 h-5" />
            <span>¿Tenés niños en casa?</span>
          </label>
        </div>

        {errors.hasChildren && <p className="text-[--error] text-sm">{errors.hasChildren.message}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[--primary]">Mascota de interés</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">¿Qué mascota te interesa? *</label>
          <input {...register('petInterest')} className="w-full p-3 border rounded-lg" placeholder="Nombre o descripción del animal" />
          {errors.petInterest && <p className="text-[--error] text-sm mt-1">{errors.petInterest.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">¿Por qué querés adoptar? *</label>
          <textarea {...register('adoptionReason')} rows={4} className="w-full p-3 border rounded-lg" placeholder="Contanos tu historia con las mascotas y por qué querés adoptar..." />
          {errors.adoptionReason && <p className="text-[--error] text-sm mt-1">{errors.adoptionReason.message}</p>}
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
