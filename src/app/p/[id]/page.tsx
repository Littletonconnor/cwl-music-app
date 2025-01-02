import { ChevronLeft, Shuffle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AddSongModal } from '@/components/add-song-modal'
import { Button } from '@/components/button'
import { ScrollArea, ScrollBar } from '@/components/scroll-area'
import { SongTable } from '@/components/song-table'
import { getPlaylistWithSongs } from '@/lib/db/queries'
import { formatDuration } from '@/lib/utils'

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const playlist = await getPlaylistWithSongs(id)

  if (!playlist) {
    return notFound()
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">
      <div className="flex items-center justify-between p-3 bg-[#OAOAOA]">
        <div className="flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <span className="text-xs">{playlist.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* TODO: hook up play all and shuffle functionality. */}
          <Button
            variant="secondary"
            className="h-7 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white"
          >
            Play All
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center py-3 px-4 space-x-3 bg-[#0A0A0A]">
        {/* TODO: hook up file upload functionality. */}
        {playlist.coverUrl && (
          <img
            src={playlist.coverUrl}
            alt="Playlist cover"
            className="size-16 sm:size-24 object-cover rounded-sm"
          />
        )}
        <div>
          {/* TODO: Make this clickable and add edit functionality. */}
          <p className="text-xl sm:text-2xl font-bold">{playlist.name}</p>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">
            {playlist.trackCount} tracks • {formatDuration(playlist.duration)}
          </p>
        </div>
      </div>

      <ScrollArea>
        <div className="min-w-max">
          <SongTable playlist={playlist} />
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  )
}
