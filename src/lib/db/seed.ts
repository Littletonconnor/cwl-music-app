import fs from 'fs/promises'
import path, { FormatInputPathObject } from 'path'
import * as musicMetadata from 'music-metadata'
import { v4 as uuidv4 } from 'uuid'

import { db } from './drizzle'
import { playlists, playlistSongs, songs } from './schema'

const DEFAULT_COVER_URL = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'
const PLAYLIST_NAMES = ['Deep House']

async function seed() {
  console.time('🌱 Seeded database')
  await deleteDatabase()
  await seedSongs()
  await seedPlaylists()
  console.timeEnd('🌱 Seeded database')
}

async function seedSongs() {
  const tracksDir = path.join(process.cwd(), 'tracks')
  const files = await fs.readdir(tracksDir)

  for (let file of files) {
    const filePath = path.join(tracksDir, file)
    const buffer = await fs.readFile(filePath)
    const metadata = await musicMetadata.parseBuffer(buffer, { mimeType: 'audio/mpeg' })

    let imageUrl = ''
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      // TODO: store the image locally for local files and externally for external files.
    }

    const songData = {
      id: uuidv4(),
      name: metadata.common.title || path.parse(file).name,
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      duration: Math.round(metadata.format.duration || 0),
      genre: metadata.common.genre?.[0] || 'Unknown Genre',
      bpm: metadata.common.bpm ? Math.round(metadata.common.bpm) : null,
      key: metadata.common.key || null,
      imageUrl,
      audioUrl: filePath, // TODO: store as filePath only if local audio file, otherwise store externally.
      isLocal: true,
    }

    await db.insert(songs).values(songData)
  }
}

async function seedPlaylists() {
  for (const name of PLAYLIST_NAMES) {
    const [playlist] = await db
      .insert(playlists)
      .values({
        id: uuidv4(),
        name,
        coverUrl: DEFAULT_COVER_URL,
      })
      .returning()

    const allSongs = await db.select().from(songs)
    const max = allSongs.length - 1
    const min = 0

    await db.insert(playlistSongs).values({
      id: uuidv4(),
      playlistId: playlist.id,
      songId: allSongs[Math.floor(Math.random() * (max - min + 1)) + min].id,
      order: 0,
    })
  }
}

async function deleteDatabase() {
  console.time('🧹 Cleaned up the database')
  await db.delete(playlistSongs)
  await db.delete(playlists)
  await db.delete(songs)
  console.timeEnd('🧹 Cleaned up the database')
}

seed()
  .catch((error) => {
    console.error('❌ Seed process failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
