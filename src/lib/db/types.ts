import { playlists, playlistSongs, songs, songsRelations } from './schema'

export type Song = typeof songs.$inferInsert
export type NewSong = typeof songs.$inferInsert
export type Playlist = typeof playlists.$inferInsert
export type NewPlaylist = typeof playlists.$inferInsert
export type PlaylistSong = typeof playlistSongs.$inferInsert
export type NewPlaylistSong = typeof playlistSongs.$inferInsert
export type PlaylistWithSongs = Playlist & {
  songs: (Song & { order: number })[]
  trackCount: number
  duration: number
}
