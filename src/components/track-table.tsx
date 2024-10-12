import { PlaylistWithSongs } from '@/lib/db/types'

interface TrackTableProps {
  playlist: PlaylistWithSongs
  query?: string
}

export function TrackTable({ playlist, query }: TrackTableProps) {}
