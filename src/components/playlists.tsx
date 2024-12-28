"use client";

import React, { useRef } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/button";
import { SearchInput } from "@/components/search-input";
import { usePlayback } from "@/context/playback-context";
import { usePlaylist } from "@/context/playlist-context";
import { addPlaylistAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function Playlists() {
	const pathname = usePathname();
	const { playlists } = usePlaylist();
	const playlistsContainerRef = useRef<HTMLDivElement>(null);
	const { registerPanelRef, setActivePanel } = usePlayback();

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
							"block py-1 px-4 -mx-4 text-xs text-[#d1d5db] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-[0.5px] focus:ring-gray-400",
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
						<Button
							variant="ghost"
							size="icon"
							className="w-5 h-5"
							type="submit"
						>
							<Plus className="w-3 h-3 text-gray-400" />
							<span className="sr-only">Add new playlist</span>
						</Button>
					</form>
				</div>
			</div>
			<ul className="space-y-0.5 text-xs mt-[1px]">
				{playlists.map((p) => (
					<li key={p.name}>{p.name}</li>
				))}
			</ul>
		</div>
	);
}
