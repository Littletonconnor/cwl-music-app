'use server'

import { v4 as uuidv4 } from 'uuid'

import { db } from '@/lib/db/drizzle'
import { DEFAULT_COVER_URL } from './db/constants'
import { playlists } from './db/schema'

export async function addPlaylistAction() {
  const newPlaylistId = uuidv4()
  const newPlaylist = {
    id: newPlaylistId,
    name: 'New Playlist',
    coverUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  // TODO:
  // 1. Update playlist
  // 2. Prefetch next route
  // 3. Push route
}

export async function createPlaylistAction(_: any, formData: FormData) {
  const name = formData.get('playlist-name') as string

  if (!name) {
    throw new Error('Missing playlist name')
  }

  const playlistId = uuidv4()

  try {
    // TODO: need to add cover photo here as well.
    // In development we'll use some random unsplash photo or something
    // But in production we'll need to save this somewhere like in S3.
    await db.insert(playlists).values({
      id: playlistId,
      name,
      coverUrl: DEFAULT_COVER_URL,
    })

    return { success: true, playlistId: playlistId }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to add new Playlist')
  }
}
