import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Check if admin already exists
    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    const admin = await prisma.admin.create({
      data: { email, password: hash }
    })

    return NextResponse.json({ success: true, email: admin.email })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
