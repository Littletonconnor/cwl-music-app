import { Suspense } from 'react'

import { ScrollArea, ScrollBar } from '@/components/scroll-area'
import { SongTable } from '@/components/song-table'
import { getAllSongs } from '@/lib/db/queries'

interface PageProps {
  searchParams: Promise<{ q: string }>
}

export default function Page({ searchParams }: PageProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px] pt-2">
      <ScrollArea className="flex-1">
        <div className="min-w-max">
          <Suspense fallback={<div className="w-full">Loading...</div>}>
            <Tracks searchParams={searchParams} />
          </Suspense>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

async function Tracks({ searchParams }: PageProps) {
  // TODO: Filtering would probably be faster on the server.
  const query = (await searchParams)?.q
  const songs = await getAllSongs()
  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().startsWith(query?.toLocaleLowerCase() ?? ''),
  )
  //@ts-ignore
  return <SongTable query={query} playlist={{ songs: filteredSongs }} />
}
