"use client";

import * as React from "react";
import * as musicMetadata from "music-metadata";
import { Music } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";

interface State {
	title: string;
	artist: string;
	album: string;
	genre: string;
}

type Action =
	| {
			type: "update";
			key: keyof typeof initialState;
			value: string;
	  }
	| {
			type: "file-update";
			value: typeof initialState;
	  };

const initialState = {
	title: "",
	artist: "",
	album: "",
	genre: "",
};

export function AddSongModal() {
	const [open, setOpen] = React.useState(false);
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case "update":
				return { ...state, [action.key]: action.value };
			case "file-update":
				return { ...state, ...action.value };
			default:
				throw new Error("Unsupported action type");
		}
	}, initialState);

	const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
		e,
	) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const result = await musicMetadata.parseBlob(file);
			dispatch({
				type: "file-update",
				value: {
					title: result.common.title ?? "",
					artist: result.common.artist ?? "",
					album: result.common.album ?? "",
					genre: result.common.genre?.[0] ?? "",
				},
			});
		}
	};

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const file = formData.get("file");
		const title = formData.get("title");
		const artist = formData.get("artist");
		const album = formData.get("album");
		const genre = formData.get("genre");

		try {
			//await addSong(formData);
		} catch (error) {
			// TODO: Handle error
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="h-7 gap-2 text-xs bg-[#282828] hover:bg-[#3E3E3E] text-white"
				>
					<Music className="h-4 w-4" />
					Add Song
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Song</DialogTitle>
					<DialogDescription>
						Upload an MP3 file and add song details to your playlist.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="file">Audio File</Label>
						<Input
							id="file"
							name="file"
							type="file"
							accept=".mp3,audio/mpeg"
							required
							className="cursor-pointer"
							onChange={handleFileChange}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							name="title"
							value={state.title}
							onChange={(e) =>
								dispatch({
									type: "update",
									value: e.target.value,
									key: "title",
								})
							}
							placeholder="Enter song title"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="artist">Artist</Label>
						<Input
							id="artist"
							name="artist"
							value={state.artist}
							onChange={(e) =>
								dispatch({
									type: "update",
									value: e.target.value,
									key: "artist",
								})
							}
							placeholder="Enter artist name"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="album">Album</Label>
						<Input
							id="album"
							value={state.album}
							onChange={(e) =>
								dispatch({
									type: "update",
									value: e.target.value,
									key: "album",
								})
							}
							name="album"
							placeholder="Enter album name"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="genre">Genre</Label>
						<Input
							id="genre"
							value={state.genre}
							onChange={(e) =>
								dispatch({
									type: "update",
									value: e.target.value,
									key: "genre",
								})
							}
							name="genre"
							placeholder="Enter genre"
						/>
					</div>
					<Button type="submit" className="mt-4">
						Submit
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
