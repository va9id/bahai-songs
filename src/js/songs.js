window.addEventListener("load", function () {
	const observer = new MutationObserver(() => {
		if (window.location.hash) {
			const section = document.querySelector(window.location.hash);
			if (section) {
				section.scrollIntoView({ behavior: "smooth" });
				observer.disconnect();
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
});
