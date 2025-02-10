import { attachValidationEvents, checkFormValidity, sanitizeInput, sendEmail } from "/src/js/form";

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
    const additionalMsg = document.getElementById("form-additional-msg").value.trim();

    const subject = `Song Request: ${songTitle} (${language})`;
    const body = additionalMsg
        ? `${additionalMsg}\n\nLyrics:\n\n${songLyrics}\n\nRegards,\n${name}`
        : `Lyrics:\n\n${songLyrics}\n\nRegards,\n${name}`;

    sendEmail(subject, body);
}

function initSongForm() {
    const form = document.getElementById("song-form");
    if (!form) return;

    const submitButton = document.getElementById("song-from-submit");
    attachValidationEvents(form, submitButton);
    form.addEventListener("submit", handleSongFormSubmit);
    checkFormValidity(form, submitButton);
}

document.addEventListener("DOMContentLoaded", initSongForm);