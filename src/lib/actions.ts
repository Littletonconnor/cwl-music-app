'use server'

import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/lib/db/drizzle'
import { COVER_URLS } from './db/constants'
import { playlists, playlistSongs } from './db/schema'

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

export async function createPlaylistAction(formData: FormData) {
  // TODO: refactor these actions to just handle server stuff and blow up
  // if an issue happens. Validation should happen prior to this and error handling
  // can be done on the client.
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
      coverUrl: COVER_URLS[Math.floor(Math.random() * COVER_URLS.length)],
    })
    revalidateTag('playlists')

    return { success: true, playlistId: playlistId }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to add new Playlist')
  }
}

export async function deletePlaylistAction(id: string) {
  await db.transaction(async (tx) => {
    await tx.delete(playlistSongs).where(eq(playlistSongs.playlistId, id)).execute()

    await tx.delete(playlists).where(eq(playlists.id, id)).execute()
  })
  revalidateTag('playlists')
}

export async function deletePlaylistSongAction(playlistId: string, songId: string) {
  await db
    .delete(playlistSongs)
    .where(and(eq(playlistSongs.playlistId, playlistId), eq(playlistSongs.songId, songId)))

  revalidateTag('playlists')
}

export async function addToPlaylistAction(playlistId: string, songId: string) {
  try {
    const existingEntry = await db
      .select()
      .from(playlistSongs)
      .where(and(eq(playlistSongs.playlistId, playlistId), eq(playlistSongs.songId, songId)))
      .execute()

    if (existingEntry.length > 0) {
      return { success: false, message: 'Song is already in the playlist' }
    }

    const maxOrderResult = await db
      .select({
        maxOrder: sql<number>`MAX(${playlistSongs.order})`,
      })
      .from(playlistSongs)
      .where(eq(playlistSongs.playlistId, playlistId))
      .execute()

    const newOrder = maxOrderResult[0].maxOrder + 1

    await db
      .insert(playlistSongs)
      .values({ id: uuidv4(), playlistId, songId, order: newOrder })
      .execute()

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Song added to playlist successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to add song',
    }
  }
}
