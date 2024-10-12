import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export let songs = sqliteTable(
  'songs',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    artist: text('artist').notNull(),
    album: text('album'),
    duration: integer('duration').notNull(),
    genre: text('genre'),
    bpm: integer('bpm'),
    key: text('key'),
    imageUrl: text('image_url'),
    audioUrl: text('audio_url').notNull(),
    isLocal: integer('isLocal', { mode: 'boolean' }),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    nameIndex: index('idx_songs_name').on(table.name),
    artistIndex: index('idx_songs_artist').on(table.artist),
    albumIndex: index('idx_songs_album').on(table.album),
    genreIndex: index('idx_songs_genre').on(table.genre),
    bpmIndex: index('idx_songs_bpm').on(table.bpm),
    keyIndex: index('idx_songs_key').on(table.key),
    createdAtIndex: index('idx_songs_created_at').on(table.createdAt),
  }),
)

export let playlists = sqliteTable(
  'playlists',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    coverUrl: text('cover_url'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    nameIndex: index('idx_playlists_name').on(table.name),
    createdAtIndex: index('idx_playlists_created_at').on(table.createdAt),
  }),
)

export let playlistSongs = sqliteTable(
  'playlist_songs',
  {
    id: text('id').primaryKey(),
    playlistId: text('playlist_id')
      .notNull()
      .references(() => playlists.id),
    songId: text('song_id')
      .notNull()
      .references(() => songs.id),
    order: integer('order').notNull(),
  },
  (table) => ({
    playlistIdIndex: index('idx_playlist_songs_playlist_id').on(table.playlistId),
    songIdIndex: index('idx_playlist_songs_song_id').on(table.songId),
    orderIndex: index('idx_playlist_songs_order').on(table.order),
    uniquePlaylistSongIndex: uniqueIndex('unq_playlist_song').on(table.playlistId, table.songId),
  }),
)

export const songsRelations = relations(songs, ({ many }) => ({
  playlistSongs: many(playlistSongs),
}))

export const playlistsRelations = relations(playlists, ({ many }) => ({
  playlistSongs: many(playlistSongs),
}))

export const playlistSongsRelations = relations(playlistSongs, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistSongs.playlistId],
    references: [playlists.id],
  }),
  song: one(songs, {
    fields: [playlistSongs.songId],
    references: [songs.id],
  }),
}))
