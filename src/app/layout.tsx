import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { getAllPlaylists } from '@/lib/db/queries'

import './globals.css'

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

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const playlistsPromise = getAllPlaylists()

  return (
    <html lang="en" className={inter.className}>
      <body className="dark flex flex-col md:flex-row h-[100dvh] text-gray-200 bg-[#0A0A0A]">
        {children}
      </body>
    </html>
  )
}
