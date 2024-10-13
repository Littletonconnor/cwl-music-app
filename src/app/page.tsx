import { Suspense } from 'react'

import { getAllSongs, searchSongs } from '@/lib/db/queries'

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] pb-[69px] pt-2">
      <div className="min-w-max">
        <Suspense fallback={<div className="w-full">Loading...</div>}>
          <Tracks />
        </Suspense>
      </div>
    </div>
  )
}

interface TracksProps {
  searchParams?: Promise<{ q: string }>
}

async function Tracks({ searchParams }: TracksProps) {
  const query = (await searchParams)?.q
  const songs = query ? await searchSongs(query) : await getAllSongs()

  return <pre>{JSON.stringify(songs, null, 2)}</pre>
  // return <TrackTable query={query} playlist={{ songs }} />
}
