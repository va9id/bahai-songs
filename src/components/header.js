document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    let basePath = '';
    if (currentPath.includes('/src/pages/')) {
        basePath = '../../';  // If in /src/pages/, go up 2 levels to root
    }

    const currentPage = currentPath.split('/').pop();

    const headerHTML = `
        <nav class="navbar navbar-expand-sm bg-body-tertiary sticky-top">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="d-flex position-relative ms-auto order-1 order-sm-2 col-9 col-sm-4 col-md-3 col-lg-5">
                    <div class="input-group">
                        <input class="form-control border-0" type="search" placeholder="Search" aria-label="Search" id="song-search" style="max-width: 100%;">
                    </div>
                    <div id="search-results" class="position-absolute bg-white shadow rounded p-2 mt-1 w-100" style="top: 100%; display: none; z-index: 1000; max-height: 300px; overflow-y: auto; max-width: 100%;"></div>
                </div>   

                <div class="collapse navbar-collapse order-2 order-sm-1" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'index.html' ? 'active' : ''}" href="${basePath}index.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'songs.html' || currentPage == 'song.html' ? 'active' : ''}" href = "${basePath}src/pages/songs.html">Songs</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'submit.html' ? 'active' : ''}" href="${basePath}src/pages/submit.html">Submit a Song</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'calendar.html' ? 'active' : ''}" href="${basePath}src/pages/calendar.html">Calendar</a>
                        </li>
                    </ul>
                </div>  
            </div>
        </nav>
        `;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);


    const searchInput = document.getElementById('song-search');
    const searchResults = document.getElementById('search-results');
    let songsData = null;

    fetch(`${basePath}src/data/songs.json`)
        .then(response => response.json())
        .then(data => songsData = data)
        .catch(error => console.error('Error loading songs data:', error));

    function cleanText(text) {
        return text
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\\n/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm || !songsData) {
            searchResults.style.display = 'none';
            return;
        }

        const results = [];

        songsData.music.forEach(languageGroup => {
            const language = languageGroup.language;

            languageGroup.songs.forEach((song, idx) => {
                const cleanedLyrics = cleanText(song.lyrics).toLowerCase();

                if (cleanedLyrics.includes(searchTerm)) {
                    let startIndex = cleanedLyrics.indexOf(searchTerm);
                    startIndex = Math.max(0, startIndex - 10); // Show 10 chars before match

                    let previewText = cleanedLyrics.substring(startIndex, startIndex + 40); // Show 10 chars before and 20 after
                    if (startIndex > 0) previewText = '...' + previewText;
                    if (startIndex + 30 < cleanedLyrics.length) previewText += '...';

                    results.push({ title: song.title, language: language, index: idx, author: song.author, lyrics: previewText }
                    );
                }
            });
        });

        if (results.length > 0) {
            searchResults.innerHTML = results.map(song => `
                <div class="search-result-item p-2 border-bottom hover-bg-light">
                <a class="search-result-list" href="${basePath}src/pages/song.html?lang=${song.language}&id=${song.index}">
                    <strong class="search-result-title">${song.title}</strong>
                    <div class="search-result-lyrics small text-muted">${song.lyrics}</div>
                </a>
                </div>
            `).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-no-result -p-2">No results found</div>';
            searchResults.style.display = 'block';
        }
    }

    searchInput.addEventListener('input', function () {
        clearTimeout(searchInput.debounceTimer); // Debounce to avoid too many searches
        searchInput.debounceTimer = setTimeout(performSearch, 300);
    });

    searchInput.addEventListener('focus', function () {
        // Show results again if there's text in the input
        if (searchInput.value.trim() !== '') {
            performSearch();
        }
    });

    document.addEventListener('click', function (event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
});
