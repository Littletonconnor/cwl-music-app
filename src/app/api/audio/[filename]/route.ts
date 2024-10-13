import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

/**
 * Take a music file name, and response with the actual file location of the music file so that we can
 * Load it. We're using an API here instead of an external data source like Blob storage because
 * We need a node like environment to actually grab the file.
 */
export async function GET(_: any, { params }: { params: Promise<{ filename: string }> }) {
  const filename = (await params).filename
  const audioDirectory = path.join(process.cwd(), 'tracks')
  const filePath = path.join(audioDirectory, filename)

  try {
    const fileBuffer = await fs.readFile(filePath)
    const response = new NextResponse(fileBuffer)

    response.headers.set('Content-Type', 'audio/mpeg')
    response.headers.set('Content-Lenght', fileBuffer.byteLength.toString())

    return response
  } catch (error) {
    return new NextResponse('File not found', { status: 404 })
  }
}
