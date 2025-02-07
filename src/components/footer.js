document.addEventListener("DOMContentLoaded", function () {
  const footerHTML = `
      <footer class="bg-body-tertiary text-center text-start mt-auto">
        <div id="footer" class="text-center p-3">
          <a id="legal" href="/src/pages/legal.html">Legal</a> -  
          © 2025 Copyright
          <a href="#">bahaisongs.ca</a> -
          <a class="mx-1" href="https://github.com/va9id/bahai-songs"><i class="bi bi-github"></i></a>
        </div>
      </footer>
    `;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
});

