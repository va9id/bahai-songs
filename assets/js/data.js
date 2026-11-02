const SONGS_URL = "/assets/data/songs.json";

let songsPromise = null;

export function loadSongs() {
	if (!songsPromise) {
		songsPromise = fetch(SONGS_URL).then((response) => {
			if (!response.ok) {
				throw new Error(`Could not load songs (${response.status})`);
			}
			return response.json();
		});
	}
	return songsPromise;
}

export function languageName(language) {
	if (language === "Other") {
		return "Other";
	}
	return new Intl.DisplayNames(["en"], { type: "language" }).of(language);
}

export function urlTitle(title) {
	return title
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function songUrl(song) {
	return `/song.html?title=${encodeURIComponent(urlTitle(song.title))}`;
}

export function sectionId(language) {
	return `${language}-section`;
}

export function findSong(data, titleFromUrl) {
	for (const group of data.music) {
		const song = group.songs.find(
			(val) => urlTitle(val.title) === titleFromUrl,
		);
		if (song) {
			return { song: song, language: group.language };
		}
	}
	return undefined;
}

export async function randomSong() {
	const data = await loadSongs();
	const allSongs = data.music.flatMap((val) => val.songs);
	return allSongs[Math.floor(Math.random() * allSongs.length)];
}
