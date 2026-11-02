import { loadSongs, songUrl } from "./data.js";

const searchInput = document.getElementById("song-search");
const searchResults = document.getElementById("search-results");

let songsData = null;
let debounceTimer = null;

loadSongs()
	.then((data) => (songsData = data))
	.catch((error) => console.error("Error loading songs data:", error));

const WHITESPACE = /\s/;
const COMBINING_MARKS = /[̀-ͯ]/g;
const NOT_SEARCHABLE = /[^\p{L}\p{N}]/gu;

// How much of the surrounding lyrics to show either side of a hit.
const PREVIEW_BEFORE = 24;
const PREVIEW_AFTER = 40;

// Drops the accent and lowercases, so "á" and "a" count as the same letter.
function fold(character) {
	return character.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase();
}

// Builds the text we actually search against: accents and punctuation gone,
// runs of whitespace collapsed to one space. `origin` maps every character of
// the result back to its index in the untouched text, so a hit can still be
// shown in the original spelling.
function searchable(text) {
	let normalized = "";
	const origin = [];
	let pendingSpace = false;

	for (let i = 0; i < text.length; i++) {
		if (WHITESPACE.test(text[i])) {
			// Line breaks and runs of spaces become a single space; leading
			// whitespace is dropped entirely.
			pendingSpace = normalized.length > 0;
			continue;
		}

		// Punctuation carries no weight, so "Bahá'u'lláh", "baha'u'llah" and
		// "bahaullah" all find each other.
		const letters = fold(text[i]).replace(NOT_SEARCHABLE, "");
		if (letters === "") {
			continue;
		}

		if (pendingSpace) {
			normalized += " ";
			origin.push(i);
			pendingSpace = false;
		}

		for (const letter of letters) {
			normalized += letter;
			origin.push(i);
		}
	}

	return { normalized, origin };
}

// Normalising every song on every keystroke would be wasted work.
const searchIndexes = new WeakMap();

function searchIndex(song) {
	let index = searchIndexes.get(song);
	if (!index) {
		index = searchable(song.lyrics);
		searchIndexes.set(song, index);
	}
	return index;
}

// A snippet of the original lyrics around the match, so the hit has some
// context. Split in three parts so the match itself can be highlighted.
function preview(lyrics, origin, matchStart, matchLength) {
	const from = origin[matchStart];
	const to = origin[matchStart + matchLength - 1] + 1;

	let start = Math.max(0, from - PREVIEW_BEFORE);
	let end = Math.min(lyrics.length, to + PREVIEW_AFTER);

	// Don't cut a word in half at either edge.
	while (start > 0 && !WHITESPACE.test(lyrics[start - 1])) {
		start--;
	}
	while (end < lyrics.length && !WHITESPACE.test(lyrics[end])) {
		end++;
	}

	// The preview is one line, so line breaks in the lyrics become spaces.
	const oneLine = (part) => part.replace(/\s+/g, " ");

	return {
		before:
			(start > 0 ? "…" : "") +
			oneLine(lyrics.slice(start, from)).trimStart(),
		match: oneLine(lyrics.slice(from, to)),
		after:
			oneLine(lyrics.slice(to, end)).trimEnd() +
			(end < lyrics.length ? "…" : ""),
	};
}

function matchingSongs(searchTerm) {
	const results = [];

	songsData.music.forEach((languageGroup) => {
		languageGroup.songs.forEach((song) => {
			const { normalized, origin } = searchIndex(song);
			const matchStart = normalized.indexOf(searchTerm);

			if (matchStart === -1) {
				return;
			}

			results.push({
				title: song.title,
				url: songUrl(song),
				preview: preview(
					song.lyrics,
					origin,
					matchStart,
					searchTerm.length,
				),
			});
		});
	});

	return results;
}

function renderResults(results) {
	searchResults.replaceChildren();

	if (results.length === 0) {
		const empty = document.createElement("p");
		empty.className = "search-no-results";
		empty.textContent = "No results found";
		searchResults.append(empty);
		return;
	}

	const list = document.createElement("ul");
	list.className = "search-results-list";

	results.forEach((result) => {
		const item = document.createElement("li");

		const link = document.createElement("a");
		link.href = result.url;

		const title = document.createElement("strong");
		title.className = "search-result-title";
		title.textContent = result.title;

		const highlight = document.createElement("mark");
		highlight.textContent = result.preview.match;

		const lyrics = document.createElement("span");
		lyrics.className = "search-result-lyrics";
		lyrics.append(result.preview.before, highlight, result.preview.after);

		link.append(title, lyrics);
		item.append(link);
		list.append(item);
	});

	searchResults.append(list);
}

function performSearch() {
	// The query goes through the same folding as the lyrics, so the two can be
	// compared character for character.
	const searchTerm = searchable(searchInput.value).normalized;

	if (!searchTerm || !songsData) {
		searchResults.hidden = true;
		return;
	}

	renderResults(matchingSongs(searchTerm));
	searchResults.hidden = false;
}

searchInput.addEventListener("input", function () {
	clearTimeout(debounceTimer); // Debounce to avoid searching on every keystroke
	debounceTimer = setTimeout(performSearch, 300);
});

searchInput.addEventListener("focus", function () {
	if (searchInput.value.trim() !== "") {
		performSearch();
	}
});

searchInput.form.addEventListener("submit", function (event) {
	event.preventDefault();
	performSearch();
});

document.addEventListener("click", function (event) {
	if (
		!searchInput.contains(event.target) &&
		!searchResults.contains(event.target)
	) {
		searchResults.hidden = true;
	}
});

document.addEventListener("keydown", function (event) {
	if (event.key === "Escape") {
		searchResults.hidden = true;
	}
});
