'use client'

import * as React from 'react'
import Image from 'next/image'

import placeholder from '@/app/placeholder.webp'
import { usePlayback } from '@/context/playback-context'
import { PlaylistWithSongs, Song } from '@/lib/db/types'
import { cn, didKeyBoardSelect, formatDuration, highlightText } from '@/lib/utils'

interface TrackTableProps {
  playlist: PlaylistWithSongs
  query?: string
}

export function SongTable({ playlist, query }: TrackTableProps) {
  const { registerPanelRef, setActivePanel, setPlaylist } = usePlayback()

  const tableRef = React.useRef<HTMLTableElement>(null)
  const [selectedTrackId, setSelectedTrackId] = React.useState<string | null>(null)

  React.useEffect(() => {
    registerPanelRef('tracklist', tableRef)
  }, [registerPanelRef])

  React.useEffect(() => {
    setPlaylist(playlist.songs)
  }, [playlist.songs, setPlaylist])

  return (
    <table className="w-full text-xs" onClick={() => setActivePanel('tracklist')}>
      <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#282828]">
        <tr className="text-left text-gray-400">
          <th className="py-2 pl-3 pr-2 font-medium w-10">#</th>
          <th className="py-2 px-2 font-medium">Title</th>
          <th className="py-2 px-2 font-medium hidden sm:table-cell">Artist</th>
          <th className="py-2 px-2 font-medium hidden sm:table-cell">Album</th>
          <th className="py-2 px-2 font-medium hidden sm:table-cell">Duration</th>
          <th className="p-2 font-medium w-8" />
        </tr>
      </thead>
      <tbody className="mt-[1px]">
        {playlist.songs.map((track: Song, index: number) => (
          <TrackRow
            key={index}
            track={track}
            index={index}
            query={query}
            isSelected={selectedTrackId === track.id}
            onSelect={() => setSelectedTrackId(track.id)}
          />
        ))}
      </tbody>
    </table>
  )
}

interface TrackRowProps {
  track: Song
  index: number
  query?: string
  isSelected: boolean
  onSelect: () => void
}

function TrackRow({ track, index, query, isSelected, onSelect }: TrackRowProps) {
  const {
    currentTrack,
    togglePlayPause,
    isPlaying,
    setActivePanel,
    handleKeyNavigation,
    playTrack,
  } = usePlayback()
  const [isFocused, setIsFocused] = React.useState(false)

  const isCurrentTrack = currentTrack?.name === track.name
  const shouldHighlightRow = isSelected || isFocused

  const onClickTrackRow = (e: React.MouseEvent) => {
    e.preventDefault()
    setActivePanel('tracklist')
    onSelect()
    if (isCurrentTrack) {
      togglePlayPause()
    } else {
      playTrack(track)
    }
  }

  const onKeyDownTrackRow = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (didKeyBoardSelect(e)) {
      e.preventDefault()
      onSelect()
      if (isCurrentTrack) {
        togglePlayPause()
      } else {
        playTrack(track)
      }
    } else {
      handleKeyNavigation(e, 'tracklist')
    }
  }

  return (
    <tr
      className={cn(
        'group cursor-pointer hover:bg-[#1A1A1A] select-none relative',
        isCurrentTrack && 'bg-[#1A1A1A]',
      )}
      tabIndex={0}
      onClick={onClickTrackRow}
      onKeyDown={onKeyDownTrackRow}
    >
      <td className="py-[2px] pl-3 pr-2 tabular-nums w-10 text-center">
        {isCurrentTrack && isPlaying ? (
          <div className="flex items-end justify-center space-x-[2px] size-[0.65rem] mx-auto">
            <div className="w-1 bg-neutral-600 animate-now-playing-1" />
            <div className="w-1 bg-neutral-600 animate-now-playing-2 [animation-delay:0.2s]" />
            <div className="w-1 bg-neutral-600 animate-now-playing-3 [animation-delay:0.4s" />
          </div>
        ) : (
          <span className="text-gray-400">{index + 1}</span>
        )}
      </td>
      <td className="py-[2px] px-2">
        <div className="flex items-center">
          <div className="relative size-5 mr-2 rounded-sm overflow-hidden">
            <Image
              src={track.imageUrl || placeholder}
              alt={`${track.album} cover`}
              fill
              className="object-cover"
            />
          </div>
          <div className="font-medium truncate max-w-[180px] sm:max-w-[200px] text-[#d1d5db]">
            {highlightText(track.name, query)}
            <span className="sm:hidden text-gray-400 ml-2">
              • {highlightText(track.artist, query)}
            </span>
          </div>
        </div>
      </td>
      <td className="py-[2px] px-2 hidden sm:table-cell text-[#d1d5db] max-w-40 truncate">
        {highlightText(track.artist, query)}
      </td>
      <td className="py-[2px] px-2 hidden sm:table-cell text-[#d1d5db] max-w-40 truncate">
        {highlightText(track.album!, query)}
      </td>
      <td className="py-[2px] px-2 hidden sm:table-cell text-[#d1d5db] max-w-40 truncate">
        {formatDuration(track.duration)}
      </td>
      {shouldHighlightRow && (
        <td className="absolute inset-0 border border-[#1e3a8a] pointer-events-none" />
      )}
    </tr>
  )
}
