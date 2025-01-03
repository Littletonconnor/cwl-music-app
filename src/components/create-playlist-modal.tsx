'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { createPlaylistAction } from '@/lib/actions'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Input } from './input'
import { Label } from './label'

export function CreatePlaylistModal() {
  const [open, setOpen] = useState(false)
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const router = useRouter()

  async function handleAction(formData: FormData) {
    try {
      const { playlistId } = await createPlaylistAction(formData)
      router.push(`/p/${playlistId}`)
      router.refresh()

      setOpen(false)
      setCoverPhoto(null)
    } catch (error) {
      // TODO: handle this error
      console.error(`error creating playlist: `, error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-5 h-5">
          <Plus className="w-3 h-3 text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Enter a name for your playlist and upload a cover photo.
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction}>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="playlist-name">Name</Label>
              <Input name="playlist-name" id="playlist-name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cover-photo">Cover Photo</Label>
              <div className="col-span-3">
                <Input
                  id="cover-photo"
                  name="cover-photo"
                  type="file"
                  className="text-right"
                  accept="image/*"
                  onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            {coverPhoto && (
              <div className="col-span-3 col-start-2">
                <div className="relative w-full h-32">
                  <img
                    src={URL.createObjectURL(coverPhoto)}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverPhoto(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create Playlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
