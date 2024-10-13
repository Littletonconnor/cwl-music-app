'use client'

import * as React from 'react'

import { Playlist } from '@/lib/db/types'

interface PlaylistContextType {
  playlists: Playlist[]
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void
  deletePlaylist: (id: string) => void
}

const PlaylistContext = React.createContext<PlaylistContextType | undefined>(undefined)

interface PlaylistProviderProps {
  children: React.ReactNode
  playlistsPromise: Promise<Playlist[]>
}

type OptimisticAction =
  | { type: 'update'; id: string; updates: Partial<Playlist> }
  | { type: 'delete'; id: string }

export function PlaylistProvider({ children, playlistsPromise }: PlaylistProviderProps) {
  const initialPlaylists = React.use(playlistsPromise)

  const [playlists, dispatch] = React.useReducer((state: Playlist[], action: OptimisticAction) => {
    switch (action.type) {
      case 'update':
        return state.map((playlist) =>
          playlist.id === action.id ? { ...playlist, ...action.updates } : playlist,
        )
      case 'delete':
        return state.filter((playlist) => playlist.id !== action.id)
      default:
        return state
    }
  }, initialPlaylists)

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    dispatch({ type: 'update', id, updates })
  }

  const deletePlaylist = (id: string) => {
    dispatch({ type: 'delete', id })
  }

  const value = React.useMemo(
    () => ({
      playlists,
      updatePlaylist,
      deletePlaylist,
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
