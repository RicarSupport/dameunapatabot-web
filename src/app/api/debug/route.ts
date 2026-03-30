import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'UNDEFINED',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'UNDEFINED',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
  })
}
