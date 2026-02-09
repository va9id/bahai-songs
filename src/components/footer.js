document.addEventListener("DOMContentLoaded", function () {
	const footerHTML = `
      <footer class="bg-body-tertiary text-center text-start mt-auto">
        <div id="footer" class="text-center p-2">
          <a id="about" href="/src/pages/about.html">About</a> - 
          <a id="legal" href="/src/pages/legal.html">Legal</a> - 
          <a class="mx-1" href="https://github.com/va9id/bahai-songs" target="_blank"><i class="bi bi-github"></i></a>
          <div>© 2025-2026  Copyright
            <a href="#">bahaisongs.ca</a>
          </div>
        </div>
      </footer>
    `;
	document.body.insertAdjacentHTML("beforeend", footerHTML);
});
