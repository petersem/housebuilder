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
        ariaLabel = "Dark Theme";
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        ariaLabel = "Light Theme";
    }
};

/**
 * Toggle the visibility of the legend popup when the legend button is clicked
 * and toggle the "show" class on the button itself for styling purposes.
 */
document.getElementById('legend-btn').addEventListener('click', () => {
    const btn = document.getElementById('legend-btn');
    const popup = document.getElementById('legend-popup');

    popup.classList.toggle('show');
    btn.classList.toggle('show');
});

/**
 * toast - generate toast notification
 * @param {String} message 
 * @param {Number} duration in milliseconds (default is 3000ms)
 * @param {String} msgType - null for normal, "error" for error (default is null)
 */
function toast(message, duration = 3000, msgType = "") {
    let col = "#000000";
    let brdr = "#222";
    if (msgType == "error") {
        col = "#ff0000";
        brdr = "#ff0000";
    }
    Toastify({
        text: message,
        duration: duration,
        close: true,
        gravity: "top", // top or bottom
        position: "right", // left, center or right
        style: {
            "background": "#ffffff",
            "color": col,
            "border-radius": "10px",
            "border": `1px solid ${brdr}`,
            "font-weight": "bold",
            "box-shadow": "0 0 10px rgba(0, 0, 0, 0.8)"
        },
        stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
}
