'use client'

import * as React from 'react'
import { Music, Trash } from 'lucide-react'

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

// TODO: Handle forms better throughout this application.

export function AddSongModal({ currentTrack }: { currentTrack: Song }) {
  const { playlists } = usePlaylist()
  const formMessageId = React.useId()

  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const playlistId = formData.get('playlistId') as string

    try {
      // TODO: Display success in toast
      const result = await addToPlaylistAction(playlistId, currentTrack.id)
      if (!result.success) {
        setError(result.message)
      } else {
        setOpen(false)
      }
    } catch (error) {
      // TODO: Handle error
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        setTimeout(() => {
          setError('')
        }, 500)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-7 gap-2 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white w-full"
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
              <SelectTrigger
                aria-describedby={error ? `${formMessageId}` : undefined}
                aria-invalid={!!error}
              >
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
            {error && (
              <p id={formMessageId} className="text-xs text-destructive font-medium">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
