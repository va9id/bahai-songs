window.addEventListener("load", function () {
    const observer = new MutationObserver(() => {
        if (window.location.hash) {
            const section = document.querySelector(window.location.hash);
            if (section) {
                if (section && section.classList.contains("collapse") && !section.classList.contains("show")) {
                    new bootstrap.Collapse(section, { toggle: true });
                }

                section.scrollIntoView({ behavior: "smooth" });
                observer.disconnect();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
