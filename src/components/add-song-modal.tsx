'use client'

import * as React from 'react'
import { Music } from 'lucide-react'
import { useParams } from 'next/navigation'

import { usePlayback } from '@/context/playback-context'
import { usePlaylist } from '@/context/playlist-context'
import { addToPlaylistAction } from '@/lib/actions'
import { Song } from '@/lib/db/types'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

export function AddSongModal({ currentTrack }: { currentTrack: Song }) {
  const params = useParams<{ id: string }>()
  const { playlists } = usePlaylist()

  const [open, setOpen] = React.useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const playlistId = formData.get('playlistId')

    try {
      await addToPlaylistAction({
        songId: currentTrack.id,
        playlistId: playlistId,
      })
    } catch (error) {
      // TODO: Handle error
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-7 gap-2 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white"
        >
          <Music className="h-4 w-4" />
          Add to playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to playlist</DialogTitle>
          <DialogDescription>Which playlist do you want to add this song to?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="playlistId">Playlist</Label>
            <Select name="playlistId">
              <SelectTrigger>
                <SelectValue placeholder="Select a playlist" />
              </SelectTrigger>
              <SelectContent>
                {playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
