import {
	attachValidationEvents,
	checkFormValidity,
	sanitizeInput,
	sendEmail,
} from "/src/js/form.js";

function handleSongFormSubmit(event) {
	event.preventDefault();

	const form = event.target;
	form.querySelectorAll("input, select, textarea").forEach((field) => {
		field.value = sanitizeInput(field.value);
	});

	const name = document.getElementById("form-name").value.trim();
	const language = document.getElementById("form-language").value;
	const songTitle = document.getElementById("form-song-title").value.trim();
	const songLyrics = document.getElementById("form-song-lyrics").value.trim();
	const additionalMsg = document
		.getElementById("form-additional-msg")
		.value.trim();

	const subject = `Song Request: ${songTitle} (${language})`;
	const body = additionalMsg
		? `${additionalMsg}\n\nLyrics:\n\n${songLyrics}\n\nRegards,\n${name}`
		: `Lyrics:\n\n${songLyrics}\n\nRegards,\n${name}`;

	sendEmail(subject, body);
}

// populate contact form language input based on song languages
async function languageOptions() {
	const languageInput = document.getElementById("form-language");
	const songsData = "/src/data/songs.json";
	try {
		const presetOption = document.createElement("option");
		presetOption.setAttribute("value", "");
		presetOption.setAttribute("disabled", "");
		presetOption.setAttribute("selected", "");
		presetOption.setAttribute("hidden", "");
		languageInput.appendChild(presetOption);

		const response = await fetch(songsData);
		const data = await response.json();

		data.music.forEach((val) => {
			const option = document.createElement("option");
			option.setAttribute("value", `${val.language}`);
			if (val.language === "Other") {
				option.textContent = `${val.language} (please specify in Message)`;
			} else {
				option.textContent = new Intl.DisplayNames(["en"], {
					type: "language",
				}).of(val.language);
			}
			languageInput.appendChild(option);
		});
	} catch (error) {
		console.error("Error fetching languages: ", error);
	}
}

function initSongForm() {
	const form = document.getElementById("song-form");
	if (!form) return;

	const submitButton = document.getElementById("song-form-btn");
	attachValidationEvents(form, submitButton);
	languageOptions();
	form.addEventListener("submit", handleSongFormSubmit);
	checkFormValidity(form, submitButton);
}

document.addEventListener("DOMContentLoaded", initSongForm);
