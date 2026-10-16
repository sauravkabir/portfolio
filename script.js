// ---------- Helpers ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ---------- Footer year ----------
$("#year").textContent = new Date().getFullYear();

// ---------- Dark / light theme ----------
const themeToggle = $("#theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const menuBtn = $("#menu-btn");
const navLinks = $("#nav-links");

menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
$$("#nav-links a").forEach((link) =>
  link.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ---------- Typing effect ----------
const roles = ["Front-End Developer", "UI Enthusiast", "Web Designer", "Problem Solver"];
const typingEl = $("#typing");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];
  typingEl.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ---------- Header shadow, back-to-top & active link ----------
const header = $("#header");
const toTop = $("#to-top");
const sections = $$("main section[id]");
const navAnchors = $$("#nav-links a");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 500);

  let current = "home";
  sections.forEach((section) => {
    if (y >= section.offsetTop - 120) current = section.id;
  });
  navAnchors.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current)
  );
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Scroll reveal + skill bars ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
      });
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => observer.observe(el));

// ---------- Contact form validation ----------
const form = $("#contact-form");
const status = $("#form-status");

function setError(input, message) {
  const field = input.closest(".field");
  field.classList.toggle("invalid", Boolean(message));
  field.querySelector(".error").textContent = message || "";
}

function validate() {
  const name = form.name;
  const email = form.email;
  const message = form.message;
  let valid = true;

  if (name.value.trim().length < 2) {
    setError(name, "Please enter your name.");
    valid = false;
  } else setError(name, "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    valid = false;
  } else setError(email, "");

  if (message.value.trim().length < 10) {
    setError(message, "Message should be at least 10 characters.");
    valid = false;
  } else setError(message, "");

  return valid;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "";

  if (!validate()) return;

  // Demo only: no backend yet.
  status.textContent = "Thanks! Your message has been sent (demo).";
  form.reset();
});
