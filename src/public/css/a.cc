/* ------------------------------
   THEME VARIABLES
------------------------------ */

:root {
  --bg: #f5f5f5;
  --text: #222;
  --text-strong: #111;

  --card-bg: #ffffff;
  --surface: var(--card-bg);
  --surface-raised: #ffffff;

  --header-bg: #2e2e2e;
  --submenu-bg: #3a3a3a;

  --border-soft: rgba(0,0,0,0.2);

  --accent: #90a0fd;
  --accent-soft: rgba(144,160,253,0.35);

  --btn-showcase: #90a0fd;
  --btn-edit: #8be0a4;
  --btn-delete: #EF8354;
  --btn-new: #c2c2c2;
}

.dark {
  --bg: #1a1a1a;
  --text: #e6e6e6;
  --text-strong: #fff;

  --card-bg: #2a2a2a;
  --surface: var(--card-bg);
  --surface-raised: #2f2f2f;

  --header-bg: #111;
  --submenu-bg: #222;

  --border-soft: rgba(255,255,255,0.15);

  --accent: #90a0fd;
  --accent-soft: rgba(144,160,253,0.35);

  --btn-showcase: #90a0fd;
  --btn-edit: #4bbf6b;
  --btn-delete: #d96a3c;
  --btn-new: #a8a8a8;
}

/* ------------------------------
   Sticky footer layout
------------------------------ */

html, body {
  height: 100%;
  margin: 0;
}

body {
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  color: var(--text);
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

main > section {
  flex: 1;
}

/* Special background */
body:has(#special-element) {
  background-image: url("/images/hbd.png");
  background-repeat: repeat;
  background-position: top left;
}

/* ------------------------------
   Search + Dropdown
------------------------------ */

#search-sort-row {
  width: 80%;
  padding-left: 20px;
  margin-top: 5px;
}

#pageTitle {
  font-weight: bold;
  font-size: 2rem;
  padding-top: 10px;
  display: block;
  width: 100%;
  text-align: left;
}

#searchBox,
#sort {
  display: inline-block;
  margin: 8px 0.2rem 1rem;
  border-radius: 10px;
  padding: 10px;
  font-size: 1em;
}

/* ------------------------------
   Footer
------------------------------ */

footer {
  background: var(--header-bg);
  color: #fff;
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
}

/* ------------------------------
   Header
------------------------------ */

header {
  background: var(--header-bg);
  padding: 0 1rem;
  height: 80px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 9999;
}

nav ul {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

nav a {
  text-decoration: none;
  font-weight: 800;
  color: rgb(221, 221, 221);
}

nav a:hover {
  color: #eeea18;
}

/* ------------------------------
   Mobile Nav
------------------------------ */

@media (max-width: 600px) {
  nav ul {
    display: none;
    flex-direction: column;
    background: var(--header-bg);
    width: 100%;
    min-height: 100vh;
    position: absolute;
    top: 80px;
    left: 0;
  }

  nav ul.open {
    display: flex;
    padding-left: 20px;
  }
}

/* ------------------------------
   Showcase Grid
------------------------------ */

section > section {
  max-width: 1300px;
  margin: 0 auto;
  padding: 1rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  row-gap: 2rem;
  column-gap: 1rem;
}

/* ------------------------------
   Article Cards
------------------------------ */

article {
  box-shadow: 0 2px 6px rgba(0,0,0,.5);
  background: var(--card-bg);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
  margin: 0 auto;
}

.delete-btn[data-show="false"] {
  display: none;
}

/* ------------------------------
   EDIT FORM — FIXED + SCOPED
------------------------------ */

/* ⭐ ONLY the edit page gets constrained */
main > section:has(form) {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 1.2rem;
  box-sizing: border-box;
}

/* Form container */
main section form {
  width: 100%;
  max-width: 640px;
  margin: 1.6rem auto 2.6rem auto;
  padding: 1.8rem 1.4rem 2.4rem 1.4rem;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  background: var(--surface);
  box-shadow: 0 2px 6px rgba(0,0,0,.25);
}

/* Labels */
main section form label {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 1.4rem;
  margin-bottom: 0.5rem;
  color: var(--text-strong);
}

/* Inputs */
main section form input[type="text"],
main section form input[type="number"] {
  width: 100%;
  padding: 0.75rem 0.8rem;
  font-size: 1.1rem;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  background: var(--surface-raised);
  color: var(--text);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
}

main section form input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

/* Checkbox rows */
main section form .checkbox-row {
  margin-top: 1.2rem;
  padding: 0.8rem 0.6rem;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  background: var(--surface-raised);
}

/* Save button */
main section form button[type="submit"] {
  margin-top: 2.2rem;
  padding: 0.8rem 1.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  background: var(--btn-edit);
  color: #000;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

main section form button[type="submit"]:hover {
  transform: scale(1.05);
}

/* Mobile refinement */
@media (max-width: 600px) {
  main > section:has(form) {
    padding: 0.8rem 0.9rem;
  }

  main section form {
    padding: 1.2rem 1rem 1.6rem 1rem;
  }
}
