import { loadSongs, languageName, songUrl, sectionId } from "./data.js";

const songsContainer = document.getElementById("songs-container");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
