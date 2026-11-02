import { loadSongs, languageName, songUrl, sectionId } from "./data.js";

const songsContainer = document.getElementById("songs-container");

// An explicit `behavior: "smooth"` wins over the `prefers-reduced-motion`
// override in style.css, so the preference has to be read here as well.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Shortcuts to each language section, above the list itself.
function buildLanguageNav(music) {
	const nav = document.createElement("nav");
	nav.id = "language-nav";
	nav.setAttribute("aria-label", "Languages");

	const list = document.createElement("ul");

	music.forEach((val) => {
		const item = document.createElement("li");

		const link = document.createElement("a");
		link.href = `#${sectionId(val.language)}`;
		link.textContent = languageName(val.language);

		// A fragment pointing at a <details> doesn't expand it, so a collapsed
		// section would only bring its summary into view. Opening it here runs
		// before the browser's jump, which then lands on the song list.
		link.addEventListener("click", function () {
			const section = document.getElementById(sectionId(val.language));
			if (section) {
				section.open = true;
			}
		});

		item.append(link);
		list.append(item);
	});

	nav.append(list);
	return nav;
}

// <details> gives us a collapsible section without any JS or CSS of our own.
function buildLanguageSection(val) {
	const section = document.createElement("details");
	section.id = sectionId(val.language);
	section.className = "language-section";
	section.open = true;

	const summary = document.createElement("summary");
	summary.textContent = `${languageName(val.language)} Songs`;

	const list = document.createElement("ul");
	list.className = "song-list";

	val.songs.forEach((song) => {
		const item = document.createElement("li");

		const link = document.createElement("a");
		link.href = songUrl(song);
		link.textContent = song.title;

		item.append(link);
		list.append(item);
	});

	section.append(summary, list);
	return section;
}

// Sections are rendered after load, so the browser can't honour the hash itself.
function scrollToHashedSection() {
	if (!window.location.hash) {
		return;
	}

	const section = document.querySelector(window.location.hash);
	if (section) {
		section.open = true;
		section.scrollIntoView({
			behavior: reducedMotion.matches ? "auto" : "smooth",
		});
	}
}

try {
	const data = await loadSongs();

	songsContainer.append(buildLanguageNav(data.music));
	data.music.forEach((val) => {
		songsContainer.append(buildLanguageSection(val));
	});

	scrollToHashedSection();
} catch (error) {
	console.error("Error loading song list:", error);
	songsContainer.textContent = "Could not load the songs.";
}
