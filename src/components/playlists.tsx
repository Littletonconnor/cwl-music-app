import { useRef } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/button'
import { addPlaylistAction } from '@/lib/actions'
import { cn } from '@/lib/utils'

function Playlists() {
  const pathname = usePathname()
  const playlistsContainerRef = useRef<HTMLUListElement>(null)

  return (
    <div className="hidden md:block w-56 bg-[#121212] h-[100dvh] overflow-auto">
      <div className="m-4">
        <SearchInput />
        <div className="mb-6">
          <Link
            href="/"
            className={cn(
              'text-xs font-semibold text-gray-400 hover:text-white transition-colors',
              pathname === '/' ? 'bg-[#1A1A1A]' : '',
            )}
          >
            All Tracks
          </Link>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Playlists
          </Link>
          <form action={addPlaylistAction}>
            <Button>
              <Plus className="w-3 h-3 text-gray-400" />
              <span className="sr-only">Add new playlist</span>
            </Button>
          </form>
        </div>
      </div>
      <ul className="space-y-0.5 text-xs mt-[1px]" ref={playlistsContainerRef}>
        {/* Playlists go here */}
      </ul>
    </div>
  )
}

function SearchInput() {
  return <div>Search</div>
}
