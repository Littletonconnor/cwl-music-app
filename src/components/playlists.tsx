"use client";

import React, { useRef } from "react";
import { MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/button";
import { SearchInput } from "@/components/search-input";
import { CreatePlaylistModal } from "@/components/create-playlist-modal";
import { usePlayback } from "@/context/playback-context";
import { usePlaylist } from "@/context/playlist-context";
import { addPlaylistAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Playlist } from "@/lib/db/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";

export function Playlists() {
	const pathname = usePathname();
	const { playlists } = usePlaylist();
	const playlistsContainerRef = useRef<HTMLDivElement>(null);
	const { registerPanelRef, setActivePanel, handleKeyNavigation } =
		usePlayback();

	React.useEffect(() => {
		registerPanelRef("sidebar", playlistsContainerRef);
	}, [registerPanelRef]);

	return (
		<div
			ref={playlistsContainerRef}
			className="hidden md:block w-56 bg-[#121212] h-[100dvh] overflow-auto"
			onClick={() => setActivePanel("sidebar")}
		>
			<div className="m-4">
				<SearchInput />
				<div className="mb-6">
					<Link
						href="/"
						className={cn(
							"block py-1 px-4 -mx-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400",
							pathname === "/" ? "bg-[#1A1A1A]" : "",
						)}
					>
						All Tracks
					</Link>
				</div>
				<div className="flex justify-between items-center mb-4">
					<Link
						href="/"
						className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm text-xs font-semibold text-gray-400 hover:text-white transition-colors"
					>
						Playlists
					</Link>
					<form action={addPlaylistAction}>
						<CreatePlaylistModal />
					</form>
				</div>
			</div>
			<ul
				className="space-y-0.5 text-xs mt-[1px]"
				onKeyDown={(e) => handleKeyNavigation("sidebar", e)}
			>
				{playlists.map((playlist) => (
					<PlaylistRow key={playlist.name} playlist={playlist} />
				))}
			</ul>
		</div>
	);
}

function PlaylistRow({ playlist }: { playlist: Playlist }) {
	const pathname = usePathname();

	async function handleDeletePlaylist() {
		// call deletePlaylist action
	}

	return (
		<li className="relative group">
			<Link
				prefetch={true}
				href={`/p/${playlist.id}`}
				className={cn(
					"block py-1 px-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400",
					pathname === `/p/${playlist.id}` ? "bg-[#1A1A1A]" : "",
				)}
				tabIndex={0}
			>
				{playlist.name}
			</Link>
			<div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 text-gray-400 hover:text-white focus:text-white"
						>
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">Playlist options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36">
						<DropdownMenuItem
							className="text-xs"
							onClick={() => handleDeletePlaylist()}
						>
							<Trash className="mr-2 size-3" />
							Delete Playlist
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</li>
	);
}
