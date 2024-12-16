'use client'

import * as React from 'react'

import { playlists } from '@/lib/db/schema'
import { Song } from '@/lib/db/types'
import { getAudioSrc } from '@/lib/utils'

type Panel = 'sidebar' | 'tracklist'

interface PlaybackContextType {
  isPlaying: boolean
  currentTrack: Song | null
  currentTime: number
  duration: number
  togglePlayPause: () => void
  playTrack: (track: Song) => void
  playNextTrack: () => void
  playPreviousTrack: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setPlaylist: (songs: Song[]) => void
  audioRef: React.RefObject<HTMLAudioElement>
  activePanel: Panel
  setActivePanel: (panel: Panel) => void
  registerPanelRef: (panel: Panel, ref: React.RefObject<HTMLElement>) => void
  handleKeyNavigation: (e: React.KeyboardEvent, panel: Panel) => void
}

const PlaybackContext = React.createContext<PlaybackContextType | undefined>(undefined)

interface PlaybackProviderProps {
  children: React.ReactNode
}

export function PlaybackProvider({ children }: PlaybackProviderProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTrack, setCurrentTrack] = React.useState<Song | null>(null)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [playlist, setPlaylist] = React.useState<Song[]>([])
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const togglePlayPause = React.useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const playTrack = React.useCallback((track: Song) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.src = getAudioSrc(track.audioUrl)
      audioRef.current.play()
    }
    // TODO: setActivePanel to tracklist
  }, [])

  const playNextTrack = React.useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIdx = playlist.findIndex((track) => {
        return track.id === currentTrack.id
      })
      const nextIdx = (currentIdx + 1) % playlist.length
      playTrack(playlist[nextIdx])
    }
  }, [currentTrack])

  const playPreviousTrack = React.useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIdx = playlist.findIndex((track) => {
        return currentTrack.id === track.id
      })
      const prevIdx = (currentIdx - 1) % playlist.length
      playTrack(playlist[prevIdx])
    }
  }, [currentTrack])

  const value = {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    togglePlayPause,
    playTrack,
    playNextTrack,
    playPreviousTrack,
    setCurrentTime,
    setDuration,
    setPlaylist,
    audioRef,
    activePanel: 'sidebar' as const,
    setActivePanel: () => {},
    registerPanelRef: () => {},
    handleKeyNavigation: () => {},
  }

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
}

export function usePlayback() {
  const context = React.useContext(PlaybackContext)
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider')
  }

  return context
}
