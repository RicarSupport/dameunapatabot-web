import { PrismaClient } from '@prisma/client'

// Lazy initialization to ensure env vars are loaded
let _prisma: PrismaClient | undefined

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    // @ts-ignore - Prisma 5 supports datasourceUrl
    _prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL
    })
  }
  return _prisma
}
