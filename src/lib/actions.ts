import { v4 as uuidv4 } from 'uuid'

export async function addPlaylistAction() {
  const newPlaylistId = uuidv4()
  const newPlaylist = {
    id: newPlaylistId,
    name: 'New Playlist',
    coverUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  // TODO:
  // 1. Update playlist
  // 2. Prefetch next route
  // 3. Push route
}
