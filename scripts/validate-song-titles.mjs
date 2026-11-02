// Fails when a song title can't be turned into a working song URL.
//
// Song URLs look like /song/?title=<derived title>, where the derived title
// comes from urlTitle() in assets/js/data.js. This imports that exact function
// rather than reimplementing the rules, so the check can never drift from what
// the site actually does.
//
// Run locally with:  node scripts/validate-song-titles.mjs
// Or against a copy: node scripts/validate-song-titles.mjs path/to/songs.json

import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { findSong, urlTitle } from "../assets/js/data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const songsPath = process.argv[2]
	? resolve(process.argv[2])
	: join(root, "assets/data/songs.json");

const data = JSON.parse(readFileSync(songsPath, "utf8"));
const songs = data.music.flatMap((group) =>
	group.songs.map((song) => ({ title: song.title, language: group.language })),
);

const problems = [];
const seen = new Map();

for (const { title, language } of songs) {
	const derived = urlTitle(title);

	// Nothing survives for titles written in a script that doesn't reduce to
	// the latin alphabet, which would leave the song with no usable URL.
	if (derived === "") {
		problems.push(
			`[${language}] "${title}" derives an empty URL title, so the song ` +
				`would be unreachable. A title needs at least one a-z letter ` +
				`or 0-9 digit once accents are folded.`,
		);
		continue;
	}

	if (encodeURIComponent(derived) !== derived) {
		problems.push(
			`[${language}] "${title}" derives "${derived}", which is not safe ` +
				`in a URL without escaping.`,
		);
		continue;
	}

	// Two titles differing only by accent or punctuation collide, and only the
	// first of them would ever be found.
	const clash = seen.get(derived);
	if (clash) {
		problems.push(
			`[${language}] "${title}" and [${clash.language}] "${clash.title}" ` +
				`both derive "${derived}", so one of them would be ` +
				`unreachable.`,
		);
		continue;
	}
	seen.set(derived, { title, language });

	// Backstop: the derived title must actually find this song again.
	const found = findSong(data, derived);
	if (!found || found.song.title !== title) {
		problems.push(
			`[${language}] "${title}" does not resolve back to itself from ` +
				`"${derived}".`,
		);
	}
}

const label =
	process.argv[2] || relative(root, songsPath).replace(/\\/g, "/");
console.log(`Checked ${songs.length} song titles in ${label}.`);

if (problems.length > 0) {
	console.error(`\n${problems.length} problem(s) found:\n`);
	for (const problem of problems) {
		console.error(`  - ${problem}`);
	}
	console.error(
		"\nReword the titles above, or give the song a distinct title.\n" +
			"Song URLs are derived from the title by urlTitle() in " +
			"assets/js/data.js.",
	);
	process.exit(1);
}

console.log("Every title derives a unique, resolvable song URL.");
