import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | undefined

export function getPrisma(): PrismaClient {
  if (!prisma) {
    // Only set datasources if DATABASE_URL is defined
    const options: Record<string, unknown> = {}
    
    if (process.env.DATABASE_URL) {
      options.datasources = {
        db: {
          url: process.env.DATABASE_URL,
        },
      }
    }
    
    prisma = new PrismaClient(options as any)
  }
  return prisma
}
