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

            const btnGroupContainer = document.createElement("div");
            btnGroupContainer.classList.add("d-flex", "justify-content-center", "px-3", "pt-3");

            const btnGroup = document.createElement("div");
            btnGroup.classList.add("btn-group");
            btnGroup.setAttribute("role", "group");
            btnGroup.setAttribute("aria-label", "languages of songs");
            btnGroup.id = "lang-btns";

            data.music.forEach((val, index) => {

                const btnGroupElem = document.createElement("a");
                btnGroupElem.href = `#${val.language}-section-heading`;
                btnGroupElem.classList.add("px-2");
                btnGroupElem.textContent = `${new Intl.DisplayNames(["en"], { type: "language" }).of(val.language)}`;

                btnGroup.appendChild(btnGroupElem);

                const panel = document.createElement("div");
                panel.classList.add("panel", "panel-default");

                const panelHeading = document.createElement("div");
                panelHeading.classList.add("panel-heading");

                const panelTitle = document.createElement("h2");
                panelTitle.classList.add("panel-title", "mt-4");
                panelTitle.id = `${val.language}-section-heading`;

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

            btnGroupContainer.appendChild(btnGroup);
            songsContainer.insertBefore(btnGroupContainer, songsContainer.firstChild);
            songsContainer.insertBefore(panelGroup, songsContainer.children[1]);

            // Collapses the panel for the langauge you navigate to from the btn group
            btnGroup.addEventListener("click", function (event) {
                const target = event.target.closest("a");
                if (!target) return;
                const hash = target.getAttribute("href").replace("-heading", "");
                if (hash) {
                    const section = document.querySelector(hash);
                    if (section && section.classList.contains("collapse") && !section.classList.contains("show")) {
                        new bootstrap.Collapse(section, { toggle: true });
                    }
                }
            });

        } catch (error) {
            console.error("Error loading song list:", error);
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

// Load individual song page
async function loadSongContent(language, id) {
    const songTitleElement = document.getElementById("song-title");

    if (!language || isNaN(id)) {
        songTitleElement.textContent = "Song not found";
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

// Random button functionality based on what page you're on
document.addEventListener("DOMContentLoaded", async function () {
    const songTitleElement = document.getElementById("song-title");
    const randomSongBtn = document.getElementById("random-song-btn");

    if (songTitleElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const language = urlParams.get("lang");
        const id = parseInt(urlParams.get("id"), 10);
        await loadSongContent(language, id);
    }

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

                const isOnSongPage = window.location.pathname.includes('song.html');
                if (isOnSongPage) {
                    const newURL = new URL(window.location.href);
                    newURL.searchParams.set('lang', allSongs[randomIdx].language);
                    newURL.searchParams.set('id', allSongs[randomIdx].idx);
                    window.history.pushState({}, '', newURL);

                    await loadSongContent(allSongs[randomIdx].language, allSongs[randomIdx].idx);
                } else {
                    // clicked random from home page
                    window.location.href = `src/pages/song.html?lang=${encodeURIComponent(allSongs[randomIdx].language)}&id=${allSongs[randomIdx].idx}`;
                }

            } catch (error) {
                console.error("Error picking random song: ", error);
            }
        });
    }
});