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
            var name = document.getElementById("person-name").value;
            var language = document.getElementById("song-language").value;
            var songTitle = document.getElementById("song-name").value;
            var songLyrics = document.getElementById("song-lyrics").value;
            var additionalMsg = document.getElementById("addtional-msg").value;

            var subject = encodeURIComponent(`Song Request: ${songTitle} (${language})`);
            var body = encodeURIComponent(`From: ${name}\n\n${additionalMsg}\n\nLyrics:\n\n${songLyrics}`);

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


document.addEventListener("DOMContentLoaded", async function () {
    const songsContainer = document.getElementById("songs-container");
    if (songsContainer) {
        const songsData = "/src/data/songs.json";
        try {
            const response = await fetch(songsData);
            const data = await response.json();

            data.music.forEach((val) => {
                const sectionTitle = document.createElement("h2");
                sectionTitle.textContent = val.language.name + " Songs";
                sectionTitle.classList.add("mt-4");

                const list = document.createElement("ul");
                list.classList.add("list-group", "pb-1", "list-group-flush");

                val.songs.forEach((song, index) => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("list-group-item");

                    const songLink = document.createElement("a");
                    songLink.textContent = song.title;

                    songLink.href = `song.html?lang=${encodeURIComponent(val.language.abbr)}&id=${index}`;

                    listItem.appendChild(songLink);
                    list.appendChild(listItem);
                });

                songsContainer.appendChild(sectionTitle);
                songsContainer.appendChild(list);
            });
        } catch (error) {
            console.error("Error loading song list:", error);
        }
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const songTitleElement = document.getElementById("song-title");
    if (songTitleElement) {

        const urlParams = new URLSearchParams(window.location.search);
        const languageParam = urlParams.get("lang");
        const idParam = parseInt(urlParams.get("id"), 10);

        if (!languageParam || isNaN(idParam)) {
            document.getElementById("song-title").textContent = "Song not found";
            return;
        }

        try {
            const response = await fetch("/src/data/songs.json");
            const data = await response.json();

            const category = data.music.find(l => l.language.abbr === languageParam);

            if (!category || !category.songs[idParam]) {
                songTitleElement.textContent = "Song not found";
                return;
            }

            const selectedSong = category.songs[idParam];

            songTitleElement.textContent = selectedSong.title;
            document.getElementById("song-lyrics").innerHTML = (selectedSong.lyrics || "No lyrics available.").replace(/\\n/g, "<br>");
            document.getElementById("song-submitted-by").textContent = "Submitted by: " + (selectedSong["submitted-by"] || "Unknown");


        } catch (error) {
            console.error(`Error loading song (language=${languageParam}, id=${idParam}): ${error}`);
            songTitleElement.textContent = "Error loading song/song details.";
        }
    }
});

