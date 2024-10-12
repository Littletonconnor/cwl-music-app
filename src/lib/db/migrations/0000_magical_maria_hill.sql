CREATE TABLE `playlist_songs` (
	`id` text PRIMARY KEY NOT NULL,
	`playlist_id` text NOT NULL,
	`song_id` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cover_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`artist` text NOT NULL,
	`album` text,
	`duration` integer NOT NULL,
	`genre` text,
	`bpm` integer,
	`key` text,
	`image_url` text,
	`audio_url` text NOT NULL,
	`isLocal` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_playlist_songs_playlist_id` ON `playlist_songs` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `idx_playlist_songs_song_id` ON `playlist_songs` (`song_id`);--> statement-breakpoint
CREATE INDEX `idx_playlist_songs_order` ON `playlist_songs` (`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `unq_playlist_song` ON `playlist_songs` (`playlist_id`,`song_id`);--> statement-breakpoint
CREATE INDEX `idx_playlists_name` ON `playlists` (`name`);--> statement-breakpoint
CREATE INDEX `idx_playlists_created_at` ON `playlists` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_songs_name` ON `songs` (`name`);--> statement-breakpoint
CREATE INDEX `idx_songs_artist` ON `songs` (`artist`);--> statement-breakpoint
CREATE INDEX `idx_songs_album` ON `songs` (`album`);--> statement-breakpoint
CREATE INDEX `idx_songs_genre` ON `songs` (`genre`);--> statement-breakpoint
CREATE INDEX `idx_songs_bpm` ON `songs` (`bpm`);--> statement-breakpoint
CREATE INDEX `idx_songs_key` ON `songs` (`key`);--> statement-breakpoint
CREATE INDEX `idx_songs_created_at` ON `songs` (`created_at`);