// contact form validation
document.addEventListener("DOMContentLoaded", function () {

    function sanitizeInput(value) {
        const tempDiv = document.createElement("div");
        tempDiv.textContent = value;
        return tempDiv.innerHTML;
    }

    function checkFormValidity(form, submitButton) {
        let isFormValid = true;

        form.querySelectorAll("input[required], select[required], textarea[required]").forEach((field) => {
            if (field.dataset.touched && !field.checkValidity()) {
                field.classList.add("is-invalid");
                isFormValid = false;
            } else if (field.dataset.touched) {
                field.classList.remove("is-invalid");
            }
        });

        submitButton.disabled = !isFormValid;
    }

    function attachValidationEvents(form, submitButton) {
        form.querySelectorAll("input[required], select[required], textarea[required]").forEach((field) => {
            field.addEventListener("input", function () {
                field.dataset.touched = true;
                field.value = sanitizeInput(field.value);
                checkFormValidity(form, submitButton);
            });

            field.addEventListener("blur", function () {
                field.dataset.touched = true;
                field.value = sanitizeInput(field.value);
                checkFormValidity(form, submitButton);
            });
        });
    }

    function sendEmail(subject, body) {
        const recepient = "bahaisongscontact@gmail.com";
        const mailToLink = `mailto:${recepient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailToLink;
    }

    function handleFormSubmit(event, formType) {
        event.preventDefault();

        const form = event.target;
        form.querySelectorAll("input, select, textarea").forEach((field) => {
            field.value = sanitizeInput(field.value);
        });

        if (formType === "contact") {
            const name = document.getElementById("contact-form-name").value.trim();
            const subject = document.getElementById("contact-form-subject").value;
            const msg = document.getElementById("contact-form-msg").value.trim();

            const body = `${msg}\n\nRegards,\n${name}`;
            sendEmail(subject, body);
        }

        if (formType === "song") {
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
    }

    function initForm(formId, btnId, formType) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitButton = document.getElementById(btnId);
        attachValidationEvents(form, submitButton);
        form.addEventListener("submit", (event) => handleFormSubmit(event, formType));
        checkFormValidity(form, submitButton);
    }

    initForm("contact-form", "contact-form-btn", "contact");
    initForm("song-form", "song-form-btn", "song");
});

// build list of songs by language
document.addEventListener("DOMContentLoaded", async function () {
    const songsContainer = document.getElementById("songs-container");
    if (songsContainer) {
        const songsData = "/src/data/songs.json";
        try {
            const response = await fetch(songsData);
            const data = await response.json();

            const panelGroup = document.createElement("div");
            panelGroup.id = "panel-group";

            data.music.forEach((val, index) => {

                const panel = document.createElement("div");
                panel.classList.add("panel", "panel-default");

                const panelHeading = document.createElement("div");
                panelHeading.classList.add("panel-heading");

                const panelTitle = document.createElement("h2");

                panelTitle.classList.add("panel-title", "mt-4");

                const panelAnchor = document.createElement("a");
                panelAnchor.setAttribute("data-bs-toggle", "collapse");
                panelAnchor.setAttribute("href", `#${val.language}-section`);
                panelAnchor.classList.add("songs-by-language");

                const panelAnchorArrow = document.createElement("i")
                panelAnchorArrow.classList.add("bi");
                if (index === 0) {
                    panelAnchorArrow.classList.add("bi-chevron-up");
                } else {
                    panelAnchorArrow.classList.add("bi-chevron-down");
                }

                const panelText = document.createTextNode(`${new Intl.DisplayNames(["en"], { type: "language" }).of(val.language)} Songs`);

                panelAnchor.appendChild(panelAnchorArrow);
                panelTitle.appendChild(panelText);
                panelTitle.appendChild(panelAnchor);
                panelHeading.appendChild(panelTitle);
                panel.appendChild(panelHeading);

                const collapsableSection = document.createElement("div");
                collapsableSection.id = `${val.language}-section`;
                collapsableSection.classList.add("panel-collapse", "collapse");
                if (index === 0) collapsableSection.classList.add("show");

                const list = document.createElement("ul");
                list.classList.add("list-group", "pb-1", "list-group-flush");

                val.songs.forEach((song, index) => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("list-group-item");

                    const songLink = document.createElement("a");
                    songLink.textContent = song.title;

                    songLink.href = `song.html?lang=${encodeURIComponent(val.language)}&id=${index}`;

                    listItem.appendChild(songLink);
                    list.appendChild(listItem);
                });

                collapsableSection.appendChild(list);
                panel.appendChild(collapsableSection);
                panelGroup.appendChild(panel);

                if (panelGroup) {
                    panelGroup.addEventListener("show.bs.collapse", (event) => {
                        toggleIcon(event.target, true);
                    });
                    panelGroup.addEventListener("hide.bs.collapse", (event) => {
                        toggleIcon(event.target, false);
                    });

                    function toggleIcon(collapsedElement, isExpanding) {
                        const panelAnchor = document.querySelector(`a[href="#${collapsedElement.id}"]`);

                        if (panelAnchor) {
                            const icon = panelAnchor.querySelector("i");

                            if (icon) {
                                icon.classList.toggle("bi-chevron-down", !isExpanding);
                                icon.classList.toggle("bi-chevron-up", isExpanding);
                            }
                        }
                    }
                }
            });
            songsContainer.insertBefore(panelGroup, songsContainer.firstChild);
        } catch (error) {
            console.error("Error loading song list:", error);
        }
    }
});

// build individual song page based on lang and id
document.addEventListener("DOMContentLoaded", async function () {
    const songTitleElement = document.getElementById("song-title");
    if (songTitleElement) {

        const urlParams = new URLSearchParams(window.location.search);
        const language = urlParams.get("lang");
        const id = parseInt(urlParams.get("id"), 10);

        if (!language || isNaN(id)) {
            document.getElementById("song-title").textContent = "Song not found";
            return;
        }

        try {
            const response = await fetch("/src/data/songs.json");
            const data = await response.json();

            const category = data.music.find(l => l.language === language);

            if (!category || !category.songs[id]) {
                songTitleElement.textContent = "Song not found";
                return;
            }

            const selectedSong = category.songs[id];

            songTitleElement.textContent = selectedSong.title;
            document.getElementById("song-lyrics").innerHTML = (selectedSong.lyrics || "No lyrics available.").replace(/\\n/g, "<br>");
            document.getElementById("song-author").textContent = selectedSong.author;

        } catch (error) {
            console.error(`Error loading song (language=${language}, id=${id}): ${error}`);
            songTitleElement.textContent = "Error loading song/song details.";
        }
    }
});

// populate contact form language input based on song languages
document.addEventListener("DOMContentLoaded", async function () {
    const languageInput = document.getElementById("form-language");
    if (languageInput) {
        const songsData = "/src/data/songs.json";
        try {
            const response = await fetch(songsData);
            const data = await response.json();

            data.music.forEach((val) => {
                const option = document.createElement("option");
                option.setAttribute("value", `${val.language}`);
                option.textContent = new Intl.DisplayNames(["en"], { type: "language" }).of(val.language);
                languageInput.appendChild(option);
            });

            const option = document.createElement("option");
            option.setAttribute("value", "new");
            option.textContent = "New Language";
            languageInput.appendChild(option);

            const presetOption = document.createElement("option");
            presetOption.setAttribute("value", "");
            presetOption.setAttribute("disabled", "");
            presetOption.setAttribute("selected", "");
            presetOption.setAttribute("hidden", "");
            languageInput.insertBefore(presetOption, languageInput.firstChild);

        } catch (error) {
            console.error("Error fetching languages: ", error);
        }
    }
});


// random song
document.addEventListener("DOMContentLoaded", function () {
    const randomSongBtn = document.getElementById("random-song-btn");
    if (randomSongBtn) {
        randomSongBtn.addEventListener("click", async function (event) {
            event.preventDefault();
            const songsData = "/src/data/songs.json";
            try {
                const response = await fetch(songsData);
                const data = await response.json();

                const allSongs = data.music.flatMap(val =>
                    val.songs.map((_, idx) => ({
                        language: val.language,
                        idx: idx
                    }))
                );
                const randomIdx = Math.floor(Math.random() * allSongs.length);

                window.location.href = `src/pages/song.html?lang=${encodeURIComponent(allSongs[randomIdx].language)}&id=${allSongs[randomIdx].idx}`;

            } catch (error) {
                console.error("Error picking random song: ", error);
            }
        });
    }
});