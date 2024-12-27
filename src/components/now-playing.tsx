"use client";

import { usePlayback } from "@/context/playback-context";
import placeholder from "@/app/placeholder.webp";
import Image from "next/image";

export function NowPlaying() {
	const { currentTrack } = usePlayback();

	if (!currentTrack) return null;

	console.log("currentTrack", currentTrack);

	return (
		<div className="hidden md:flex md:flex-col w-56 p-4 bg-[#121212] overflow-auto">
			<h2 className="mb-3 text-sm font-semibold text-gray-200">Now Playing</h2>
			<Image
				className="aspect-square rounded-sm mb-4"
				alt="current playing song"
				src={currentTrack.imageUrl ? currentTrack.imageUrl : placeholder}
			/>
			<div className="space-y-2">
				<div>
					<p className="text-sm text-gray-400 font-medium truncate">Title</p>
					<p className="text-sm text-[#d1d5db] truncate">{currentTrack.name}</p>
				</div>
				<div>
					<p className="text-sm text-gray-400 font-medium">Artist</p>
					<p className="text-sm text-[#d1d5db]">{currentTrack.artist}</p>
				</div>
				<div>
					<p className="text-sm text-gray-400 font-medium">Genre</p>
					<p className="text-sm text-[#d1d5db]">{currentTrack.genre}</p>
				</div>
				<div>
					<p className="text-sm text-gray-400 font-medium">Album</p>
					<p className="text-sm text-[#d1d5db]">{currentTrack.album}</p>
				</div>
			</div>
		</div>
	);
}
