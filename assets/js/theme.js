const STORAGE_KEY = "theme";
const DOCUMENT_COLORS = { light: "#faf5ec", dark: "#1d1a16" };

const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("theme-icon-sun");
const moonIcon = document.getElementById("theme-icon-moon");
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
	return root.dataset.theme || (systemDark.matches ? "dark" : "light");
}

/* The button offers the theme you are not in, so it shows that theme's icon. */
function syncToggle() {
	const dark = currentTheme() === "dark";

	toggle.setAttribute(
		"aria-label",
		dark ? "Switch to light theme" : "Switch to dark theme",
	);
	// toggleAttribute, not .hidden: the hidden IDL property belongs to
	// HTMLElement, so assigning it on an SVG element does nothing.
	sunIcon.toggleAttribute("hidden", !dark);
	moonIcon.toggleAttribute("hidden", dark);
	themeColor.setAttribute("content", DOCUMENT_COLORS[dark ? "dark" : "light"]);
}

toggle.addEventListener("click", function () {
	const next = currentTheme() === "dark" ? "light" : "dark";

	root.dataset.theme = next;
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch (error) {
		/* Private browsing can block storage; the choice lasts this page only. */
	}

	syncToggle();
});

/* Keep following the system while no choice has been pinned. */
systemDark.addEventListener("change", syncToggle);

syncToggle();
