document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    let basePath = '';
    if (currentPath.includes('/src/pages/')) {
        basePath = '../../';  // If in /src/pages/, go up 2 levels to root
    }

    const currentPage = currentPath.split('/').pop();

    const headerHTML = `
        <nav class="navbar navbar-expand bg-body-tertiary sticky-top">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'index.html' ? 'active' : ''}" href="${basePath}index.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'songs.html' || currentPage == 'song.html' ? 'active' : ''}" href = "${basePath}src/pages/songs.html"> Songs</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'contact.html' ? 'active' : ''}" href="${basePath}src/pages/contact.html">Contact Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);
});
