'use client'

import * as React from 'react'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'

import { deletePlaylistSongAction } from '@/lib/actions'
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

// TODO: Handle forms better throughout this application.

export function RemoveSongModal({ currentTrack }: { currentTrack: Song }) {
  const { id: playlistId } = useParams()

  const [open, setOpen] = React.useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      // TODO: Display success in toast
      await deletePlaylistSongAction(playlistId as string, currentTrack.id)
      setOpen(false)
    } catch (error) {
      // TODO: Handle error
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-7 gap-2 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white w-full"
        >
          <Trash className="h-4 w-4" />
          Remove from playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Song From Playlist?</DialogTitle>
          <DialogDescription>
            Are you sure you would like to remove this song from the playlist? You can always add it
            back later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
