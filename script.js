// CUSTOM CURSOR
const dot = document.createElement("div");
dot.classList.add("cursor-dot");

const outline = document.createElement("div");
outline.classList.add("cursor-outline");

document.body.appendChild(dot);
document.body.appendChild(outline);

document.addEventListener("mousemove", (e) => {
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";

  outline.style.left = e.clientX + "px";
  outline.style.top = e.clientY + "px";
});

// SCROLL PROGRESS
const progress = document.createElement("div");
progress.classList.add("progress-bar");
document.body.appendChild(progress);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / height) * 100;
  progress.style.width = scrolled + "%";
});

// FADE IN
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// TYPING EFFECT
const text = "Modern Websites. Clean Code. Real Results.";
let i = 0;
const speed = 50;

function typeEffect() {
  if (i < text.length) {
    document.querySelector(".typing").textContent += text.charAt(i);
    i++;
    setTimeout(typeEffect, speed);
  }
}

typeEffect();
