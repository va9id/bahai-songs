// contact form validation
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("emailForm");
    const submitButton = document.getElementById("submit");

    if (form) {
        function sanitizeInput(value) {
            const tempDiv = document.createElement("div");
            tempDiv.textContent = value;
            return tempDiv.innerHTML;
        }

        function checkFormValidity() {
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

        function sendEmail() {
            var name = document.getElementById("form-name").value;
            var language = document.getElementById("form-language").value;
            var songTitle = document.getElementById("form-song-title").value;
            var songLyrics = document.getElementById("form-song-lyrics").value;
            var additionalMsg = document.getElementById("form-addtional-msg").value;

            var subject = encodeURIComponent(`Song Request: ${songTitle} (${language})`);
            var body = encodeURIComponent(`From: ${name}\n${additionalMsg}\nLyrics:\n\n${songLyrics}`);

            var mailtoLink = "mailto:testemail@gmail.com?subject=" + subject + "&body=" + body;
            window.location.href = mailtoLink;
        }

        form.querySelectorAll("input[required], select[required], textarea[required]").forEach((field) => {
            field.addEventListener("input", function () {
                field.dataset.touched = true;
                field.value = sanitizeInput(field.value);
                checkFormValidity();
            });

            field.addEventListener("blur", function () {
                field.dataset.touched = true;
                field.value = sanitizeInput(field.value);
                checkFormValidity();
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            form.querySelectorAll("input, select, textarea").forEach((field) => {
                field.value = sanitizeInput(field.value);
            });

            sendEmail();
        });

        checkFormValidity();
    }
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
            songsContainer.append(panelGroup);
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
            document.getElementById("song-submitted-by").textContent = "Submitted by: " + (selectedSong["submitted-by"] || "Unknown");


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
        } catch (error) {
            console.error("Error fetching languages: ", error);
        }
    }
});
