const hamburger = document.getElementById("hamburger");
const menu = document.querySelector("nav ul");
const subToggle = document.querySelector(".sub-toggle");
const subMenu = document.querySelector(".sub-menu");

if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
        menu.classList.toggle("open");
    });
}

if (subToggle && subMenu) {
    subToggle.addEventListener("click", () => {
        subMenu.classList.toggle("open");
    });
}

const body = document.body;
const toggle = document.getElementById("themeToggle");
const icon = toggle.querySelector("i");

// Load saved theme
if (localStorage.theme === "dark") {
    body.classList.add("dark");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
}

// Toggle theme
toggle.onclick = () => {
    body.classList.toggle("dark");
    const dark = body.classList.contains("dark");

    localStorage.theme = dark ? "dark" : "light";

    if (dark) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
};

// manage legend popup clicks
document.getElementById('legend-btn').addEventListener('click', () => {
  const btn = document.getElementById('legend-btn');
  const popup = document.getElementById('legend-popup');

  popup.classList.toggle('show');
  btn.classList.toggle('show');
});
