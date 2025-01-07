import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { getAllPlaylists } from '@/lib/db/queries'

import './globals.css'

import { NowPlaying } from '@/components/now-playing'
import { PlaybackControls } from '@/components/playback-controls'
import { Playlists } from '@/components/playlists'
import { PlaybackProvider } from '@/context/playback-context'
import { PlaylistProvider } from '@/context/playlist-context'

export const metadata: Metadata = {
  title: 'CWL-UI | Music Player',
  description: 'A local first music player',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
}

const inter = Inter({ subsets: ['latin'], preload: false })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const playlistsPromise = getAllPlaylists()

  return (
    <html lang="en" className={inter.className}>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <body className="dark flex flex-col md:flex-row h-[100dvh] text-gray-200 bg-[#0A0A0A]">
        <PlaybackProvider>
          <PlaylistProvider playlistsPromise={playlistsPromise}>
            <Playlists />
            {children}
            <NowPlaying />
            <PlaybackControls />
          </PlaylistProvider>
        </PlaybackProvider>
      </body>
    </html>
  )
}
