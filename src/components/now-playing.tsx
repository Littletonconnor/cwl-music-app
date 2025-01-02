'use client'

import Image from 'next/image'

import placeholder from '@/app/placeholder.webp'
import { usePlayback } from '@/context/playback-context'
import { AddSongModal } from './add-song-modal'

export function NowPlaying() {
  const { currentTrack } = usePlayback()

  if (!currentTrack) return null

  return (
    <div className="hidden md:flex md:flex-col w-56 p-4 bg-[#121212] overflow-auto">
      <h2 className="mb-3 text-sm font-semibold text-gray-200">Now Playing</h2>
      {/* TODO: figure out a better way to add cover images */}
      <Image
        className="aspect-square rounded-sm mb-4"
        alt="current playing song"
        src={currentTrack.imageUrl ? currentTrack.imageUrl : placeholder}
      />
      <div className="space-y-2">
        <div>
          <AddSongModal currentTrack={currentTrack} />
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium truncate">Title</p>
          <p className="text-sm text-[#d1d5db] truncate">{currentTrack.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium">Artist</p>
          <p className="text-sm text-[#d1d5db]">{currentTrack.artist}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium">Genre</p>
          <p className="text-sm text-[#d1d5db]">{currentTrack.genre}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium">Album</p>
          <p className="text-sm text-[#d1d5db]">{currentTrack.album}</p>
        </div>
      </div>
    </div>
  )
}
