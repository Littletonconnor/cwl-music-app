import { asc } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

import { db } from './drizzle'
import { playlists, songs } from './schema'

export const getAllSongs = unstable_cache(
  async () => {
    return db.select().from(songs).orderBy(asc(songs.name))
  },
  ['all-songs'],
  { tags: ['songs'] },
)

export const getAllPlaylists = unstable_cache(
  async () => {
    return db.select().from(playlists).orderBy(playlists.createdAt)
  },
  ['all-playlists'],
  { tags: ['playlists'] },
)

export const searchSongs = async (query: string) => {
  return query
}
