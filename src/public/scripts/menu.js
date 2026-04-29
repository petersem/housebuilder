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


