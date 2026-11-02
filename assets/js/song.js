import {
	loadSongs,
	findSong,
	randomSong,
	sectionId,
	urlTitle,
} from "./data.js";

const titleElement = document.getElementById("song-title");
const lyricsElement = document.getElementById("song-lyrics");
const authorElement = document.getElementById("song-author");
const audioElement = document.getElementById("song-audio");
const backLink = document.getElementById("back-to-songs");
const randomSongBtn = document.getElementById("random-song-btn");

function showNotFound() {
	titleElement.textContent = "Song not found";
	lyricsElement.textContent = "";
	authorElement.textContent = "";
	audioElement.hidden = true;
	document.title = "Song not found";
}

async function renderSong(titleFromUrl) {
	if (!titleFromUrl) {
		showNotFound();
		return;
	}

	const data = await loadSongs();
	const found = findSong(data, titleFromUrl);

	if (!found) {
		showNotFound();
		return;
	}

	const { song, language } = found;

	titleElement.textContent = song.title;

	lyricsElement.textContent = song.lyrics || "No lyrics available.";

	if (language === "Other") {
		lyricsElement.removeAttribute("lang");
	} else {
		lyricsElement.lang = language;
	}

	authorElement.textContent = song.author;

	if (song.audio) {
		audioElement.src = `/assets/audio/${song.audio}`;
		audioElement.hidden = false;
	} else {
		audioElement.removeAttribute("src");
		audioElement.hidden = true;
	}

	backLink.href = `/#${sectionId(language)}`;

	document.title = song.title;
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", `Lyrics to ${song.title}`);
}

async function renderFromUrl() {
	const params = new URLSearchParams(window.location.search);
	try {
		await renderSong(params.get("title"));
	} catch (error) {
		console.error("Error loading song:", error);
		titleElement.textContent = "Error loading song";
		document.title = "Error loading song";
	}
}

randomSongBtn.addEventListener("click", async function () {
	try {
		const next = await randomSong();
		const url = new URL(window.location.href);
		url.searchParams.set("title", urlTitle(next.title));
		window.history.pushState({}, "", url);
		await renderFromUrl();
	} catch (error) {
		console.error("Error picking random song:", error);
	}
});

window.addEventListener("popstate", renderFromUrl);

await renderFromUrl();
