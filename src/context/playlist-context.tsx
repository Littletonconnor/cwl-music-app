'use client'

import * as React from 'react'

import { Playlist } from '@/lib/db/types'

interface PlaylistContextType {
  playlists: Playlist[]
}

const PlaylistContext = React.createContext<PlaylistContextType | undefined>(undefined)

interface PlaylistProviderProps {
  children: React.ReactNode
  playlistsPromise: Promise<Playlist[]>
}

export function PlaylistProvider({ children, playlistsPromise }: PlaylistProviderProps) {
  const playlists = React.use(playlistsPromise)

  const value = React.useMemo(
    () => ({
      playlists,
    }),
    [playlists],
  )

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}

export function usePlaylist() {
  const context = React.useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }

  return context
}
