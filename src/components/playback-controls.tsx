'use client'

import * as React from 'react'
import { Heart, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

import placeholder from '@/app/placeholder.webp'
import { Button } from '@/components/button'
import { usePlayback } from '@/context/playback-context'
import { formatDuration } from '@/lib/utils'

export function PlaybackControls() {
  const {
    currentTrack,
    audioRef,
    setCurrentTime,
    setDuration,
    playPreviousTrack,
    playNextTrack,
    togglePlayPause,
  } = usePlayback()

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      console.log(`[PlaybackControls]: updateTime ${audio.currentTime}`)

      setCurrentTime(audio.currentTime)
    }

    const updateDuration = () => {
      console.log(`[PlaybackControls]: updateDuration ${audio.duration}`)

      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [setCurrentTime, setDuration])

  /**
   * Use navigator media session property to be able to adjust music through
   * operating system.
   */

  React.useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artist,
        album: currentTrack.album || undefined,
        artwork: [{ src: currentTrack.imageUrl!, sizes: '512x512', type: 'image/jpeg' }],
      })

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play()
        togglePlayPause()
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause()
        togglePlayPause()
      })

      navigator.mediaSession.setActionHandler('previoustrack', playPreviousTrack)
      navigator.mediaSession.setActionHandler('nexttrack', playNextTrack)
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (audioRef.current && details.seekTime !== undefined) {
          audioRef.current.currentTime = details.seekTime
          setCurrentTime(details.seekTime)
        }
      })

      const updatePositionState = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audioRef.current.duration,
              playbackRate: audioRef.current.playbackRate,
              position: audioRef.current.currentTime,
            })
          } catch (error) {
            console.error('Error updating position state:', error)
          }
        }
      }

      const handleLoadedMetadata = () => {
        updatePositionState()
      }

      audioRef.current?.addEventListener('timeupdate', updatePositionState)
      audioRef.current?.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        audioRef.current?.removeEventListener('timeupdate', updatePositionState)
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata)
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
        navigator.mediaSession.setActionHandler('seekto', null)
      }
    }
  }, [currentTrack, playPreviousTrack, playNextTrack, togglePlayPause, audioRef, setCurrentTime])

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] bg-[#181818] border-t border-[#282828]">
      <audio ref={audioRef} />
      <TrackInfo />
      <div className="flex flex-col items-center w-1/3">
        <PlaybackButtons />
        <ProgressBar />
      </div>
      <div className="flex items-center justify-end space-x-2 w-1/3">
        <Volume />
      </div>
    </div>
  )
}

export function PlaybackButtons() {
  const { isPlaying, togglePlayPause, playPreviousTrack, playNextTrack, currentTrack } =
    usePlayback()

  return (
    <div className="flex items-center space-x-2">
      <Button size="icon" className="h-8 w-8" variant="ghost" onClick={playPreviousTrack}>
        <SkipBack className="w-4 h-4 stroke-[1.5]" />
      </Button>
      <Button
        size="icon"
        className="h-8 w-8"
        variant="ghost"
        onClick={togglePlayPause}
        disabled={!currentTrack}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 stroke-[1.5]" />
        ) : (
          <Play className="w-5 h-5 stroke-[1.5]" />
        )}
      </Button>
      <Button size="icon" className="h-8 w-8" variant="ghost" onClick={playNextTrack}>
        <SkipForward className="w-4 h-4 stroke-[1.5]" />
      </Button>
    </div>
  )
}

export function ProgressBar() {
  const { currentTime, duration, audioRef, setCurrentTime } = usePlayback()

  const progressBarRef = React.useRef<HTMLDivElement>(null)

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const newTime = (percentage / 100) * duration

    console.log(`[ProgressBar]: newTime ${newTime}`)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div className="flex items-center w-full mt-1">
      <span className="text-xs tabular-nums text-gray-400">{formatDuration(currentTime)}</span>
      <div
        ref={progressBarRef}
        className="flex-grow mx-2 h-1 bg-[#3E3E3E] rounded-full cursor-pointer relative"
        onClick={handleProgressChange}
      >
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-gray-400">{formatDuration(duration)}</span>
    </div>
  )
}

export function TrackInfo() {
  const { currentTrack } = usePlayback()

  return (
    <div className="flex items-center space-x-3 w-1/3">
      {currentTrack && (
        <>
          <div className="overflow-hidden rounded-sm">
            <img
              className="w-10 h-10 object-cover"
              src={currentTrack.imageUrl || placeholder.src}
              alt="Now playing"
            />
          </div>
          <div className="flex-shrink min-w-0">
            <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] text-gray-200">
              {currentTrack.name}
            </div>
            <div className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
              {currentTrack.artist}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 sm:flex">
            <Heart className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  )
}

export function Volume() {
  const { audioRef, currentTrack } = usePlayback()

  const [volume, setVolume] = React.useState(100)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isVolumeVisible, setIsVolumeVisible] = React.useState(false)
  const volumeBarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted, audioRef])

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return

    const rect = volumeBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setVolume(percentage)
    if (audioRef.current) {
      audioRef.current.volume = percentage / 100
      setIsMuted(percentage === 0)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume / 100
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const toggleVolumeVisibility = () => {
    setIsVolumeVisible((prev) => !prev)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => {
          toggleMute()
          toggleVolumeVisibility()
        }}
        disabled={!currentTrack}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-gray-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-gray-400" />
        )}
      </Button>
      {isVolumeVisible && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#282828] rounded-md shadow-lg">
          <div
            ref={volumeBarRef}
            onClick={handleVolumeChange}
            className="w-20 h-1 bg-[#3E3E3E] rounded-full cursor-pointer relative"
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
