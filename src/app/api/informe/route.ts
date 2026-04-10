import { NextResponse } from 'next/server'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

export async function GET() {
  const filePath = join(process.cwd(), 'public', 'INFORME_CITOLOGICO_Bella.pdf')
  
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
  
  const fileStream = createReadStream(filePath)
  
  return new NextResponse(fileStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="INFORME_CITOLOGICO_Bella.pdf"',
      'Content-Length': '2430',
    },
  })
}