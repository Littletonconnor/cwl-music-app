import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: ClassValue[]) {
	return twMerge(clsx(classes));
}

export function formatDuration(durationInSeconds: number) {
	if (isNaN(durationInSeconds) || durationInSeconds < 0) {
		return "0:00";
	}

	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = Math.floor(durationInSeconds % 60);
	const formattedSeconds = seconds.toString().padStart(2, "0");

	return `${minutes}:${formattedSeconds}`;
}

export function highlightText(text: string, query: string | undefined) {
	if (!query) return text;

	const parts = text.split(new RegExp(`(${query})`, "gi"));
	return parts.map((part, i) => {
		return part.toLowerCase() === query.toLowerCase() ? (
			<mark key={i} className="bg-yellow-200 text-black">
				{part}
			</mark>
		) : (
			part
		);
	});
}

/**
 * Currently only local files are supported. Once external data stores
 * are supported we can start checking the url for things like `blob`
 * to know whether to fetch externally or proxy to our API handler.
 */
export function getAudioSrc(url: string) {
	const filename = url.split("/").pop();
	return `/api/audio/${encodeURIComponent(filename || "")}`;
}

export const ENTER_KEY = "Enter";
export const SPACE_KEY = " ";

export function keyboardDownSelect(
	e: React.KeyboardEvent<HTMLTableRowElement>,
) {
	if (e.key === ENTER_KEY || e.key === SPACE_KEY) {
		return true;
	} else {
		return false;
	}
}
