const SONGS_URL = "/assets/data/songs.json";

let songsPromise = null;

// Fetched once per page load and shared by every module that needs it.
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

// "Other" is a catch-all for languages the Intl API doesn't name properly.
export function languageName(language) {
	if (language === "Other") {
		return "Other";
	}
	return new Intl.DisplayNames(["en"], { type: "language" }).of(language);
}

// Songs are identified in URLs by their title rather than by their position in
// songs.json, so adding or reordering songs can't quietly point an already
// shared link at a different song. Accents are folded to plain letters and
// everything else becomes a hyphen, to keep the URL readable and unescaped.
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

// Takes the title as it appears in the URL. Returns the song along with the
// language it was filed under, since the title alone doesn't say which group
// it came from.
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
