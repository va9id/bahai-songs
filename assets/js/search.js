import { loadSongs, songUrl } from "./data.js";

const searchContainer = document.getElementById("site-search");
const searchInput = document.getElementById("song-search");
const searchResults = document.getElementById("search-results");
const searchToggle = document.getElementById("search-toggle");

let songsData = null;
let debounceTimer = null;

const WHITESPACE = /\s/;
const COMBINING_MARKS = /[̀-ͯ]/g;
const NOT_SEARCHABLE = /[^\p{L}\p{N}]/gu;

const PREVIEW_BEFORE = 24;
const PREVIEW_AFTER = 40;

function fold(character) {
	return character
		.normalize("NFD")
		.replace(COMBINING_MARKS, "")
		.toLowerCase();
}

function searchable(text) {
	let normalized = "";
	const origin = [];
	let pendingSpace = false;

	for (let i = 0; i < text.length; i++) {
		if (WHITESPACE.test(text[i])) {
			// Line breaks and runs of spaces become a single space, leaindg whitespace is dropped entirely.
			pendingSpace = normalized.length > 0;
			continue;
		}

		// Punctuation carries no weight
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

const searchIndexes = new WeakMap();

function searchIndex(song) {
	let index = searchIndexes.get(song);
	if (!index) {
		index = searchable(song.lyrics);
		searchIndexes.set(song, index);
	}
	return index;
}

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
	const searchTerm = searchable(searchInput.value).normalized;

	if (!searchTerm || !songsData) {
		searchResults.hidden = true;
		return;
	}

	renderResults(matchingSongs(searchTerm));
	searchResults.hidden = false;
}

function setCollapsed(collapse) {
	if (!searchToggle) {
		return;
	}

	searchContainer.toggleAttribute("data-collapsed", collapse);
	searchToggle.setAttribute("aria-expanded", String(!collapse));
}

function closeSearch() {
	searchResults.hidden = true;
	setCollapsed(true);
}

// The about and calendar pages have no search box and do not load this module.
if (searchInput) {
	loadSongs()
		.then((data) => (songsData = data))
		.catch((error) => console.error("Error loading songs data:", error));

	setCollapsed(true);

	searchInput.addEventListener("input", function () {
		clearTimeout(debounceTimer);
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

	if (searchToggle) {
		searchToggle.addEventListener("click", function () {
			const opening = searchContainer.hasAttribute("data-collapsed");
			setCollapsed(!opening);

			if (opening) {
				searchInput.focus();
			} else {
				searchResults.hidden = true;
			}
		});
	}

	document.addEventListener("click", function (event) {
		if (
			!searchInput.contains(event.target) &&
			!searchResults.contains(event.target) &&
			!(searchToggle && searchToggle.contains(event.target))
		) {
			closeSearch();
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") {
			closeSearch();
		}
	});
}
