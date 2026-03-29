import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { name, phone, email, housingType, hasYard, currentPets, hasChildren, childrenAges, workHours, petInterest, adoptionReason } = body
    
    const token = randomUUID()
    
    const request = await prisma.request.create({
      data: {
        token,
        type: 'ADOPTION',
        status: 'PENDING',
        name,
        phone,
        email: email || null,
        data: {
          housingType,
          hasYard,
          currentPets,
          hasChildren,
          childrenAges,
          workHours,
          petInterest,
          adoptionReason,
        },
        files: [],
      },
    })
    
    return NextResponse.json({ token, id: request.id })
  } catch (error) {
    console.error('Error creating adoption request:', error)
    return NextResponse.json({ error: 'Error creating request' }, { status: 500 })
  }
}
