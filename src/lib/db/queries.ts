import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "./drizzle";
import { playlists, playlistSongs, songs } from "./schema";

export const getAllSongs = unstable_cache(
	async () => {
		return db.select().from(songs).orderBy(asc(songs.name));
	},
	["all-songs"],
	{ tags: ["songs"] },
);

export const getAllPlaylists = unstable_cache(
	async () => {
		return db.select().from(playlists).orderBy(playlists.createdAt);
	},
	["all-playlists"],
	{ tags: ["playlists"] },
);

export const getPlaylistWithSongs = unstable_cache(
	async (id: string) => {
		const result = await db.query.playlists.findFirst({
			where: eq(playlists.id, id),
			with: {
				playlistSongs: {
					columns: {
						order: true,
					},
					with: {
						song: true,
					},
					orderBy: asc(playlistSongs.order),
				},
			},
		});

		if (!result) return null;

		const songs = result.playlistSongs.map((ps) => ({
			...ps.song,
			order: ps.order,
		}));
		const trackCount = songs.length;
		const duration = songs.reduce((total, s) => total + s.duration, 0);

		return {
			...result,
			songs,
			trackCount,
			duration,
		};
	},
	["playlist-with-songs"],
	{ tags: ["playlists", "songs"] },
);

export const searchSongs = async (query: string) => {
	return query;
};
