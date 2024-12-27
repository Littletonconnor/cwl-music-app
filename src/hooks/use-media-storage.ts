"use client ";

import * as React from "react";
import { usePlayback } from "@/context/playback-context";

export function useMediaSession() {
	const {
		audioRef,
		currentTrack,
		togglePlayPause,
		playPreviousTrack,
		playNextTrack,
		setCurrentTime,
	} = usePlayback();
	/**
	 * Use navigator media session property to be able to adjust music through
	 * operating system.
	 */

	React.useEffect(() => {
		if ("mediaSession" in navigator && currentTrack) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: currentTrack.name,
				artist: currentTrack.artist,
				album: currentTrack.album || undefined,
				artwork: [
					{ src: currentTrack.imageUrl!, sizes: "512x512", type: "image/jpeg" },
				],
			});

			navigator.mediaSession.setActionHandler("play", () => {
				audioRef.current?.play();
				togglePlayPause();
			});

			navigator.mediaSession.setActionHandler("pause", () => {
				audioRef.current?.pause();
				togglePlayPause();
			});

			navigator.mediaSession.setActionHandler(
				"previoustrack",
				playPreviousTrack,
			);
			navigator.mediaSession.setActionHandler("nexttrack", playNextTrack);
			navigator.mediaSession.setActionHandler("seekto", (details) => {
				if (audioRef.current && details.seekTime !== undefined) {
					audioRef.current.currentTime = details.seekTime;
					setCurrentTime(details.seekTime);
				}
			});

			const updatePositionState = () => {
				if (audioRef.current && !isNaN(audioRef.current.duration)) {
					try {
						navigator.mediaSession.setPositionState({
							duration: audioRef.current.duration,
							playbackRate: audioRef.current.playbackRate,
							position: audioRef.current.currentTime,
						});
					} catch (error) {
						console.error("Error updating position state:", error);
					}
				}
			};

			const handleLoadedMetadata = () => {
				updatePositionState();
			};

			audioRef.current?.addEventListener("timeupdate", updatePositionState);
			audioRef.current?.addEventListener(
				"loadedmetadata",
				handleLoadedMetadata,
			);

			return () => {
				audioRef.current?.removeEventListener(
					"timeupdate",
					updatePositionState,
				);
				audioRef.current?.removeEventListener(
					"loadedmetadata",
					handleLoadedMetadata,
				);
				navigator.mediaSession.setActionHandler("play", null);
				navigator.mediaSession.setActionHandler("pause", null);
				navigator.mediaSession.setActionHandler("previoustrack", null);
				navigator.mediaSession.setActionHandler("nexttrack", null);
				navigator.mediaSession.setActionHandler("seekto", null);
			};
		}
	}, [
		currentTrack,
		playPreviousTrack,
		playNextTrack,
		togglePlayPause,
		audioRef,
		setCurrentTime,
	]);
}
