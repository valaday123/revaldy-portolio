
// ===============================
// DARK & LIGHT MODE
// ===============================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function updateThemeIcon() {
  const isDark =
    document.documentElement.dataset.theme === "dark";

  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Aktifkan mode cerah" : "Aktifkan mode gelap"
  );
}

updateThemeIcon();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = next;

  try {
    localStorage.setItem("theme", next);
  } catch (error) {}

  updateThemeIcon();
});

// ===============================
// MOBILE NAVIGATION
// ===============================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// ===============================
// TYPING ANIMATION
// ===============================
const typingElement = document.getElementById("typing");

const words = [
  "Digital Business Enthusiast",
  "Creative Designer",
  "Communicator"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typingEffect() {
  const word = words[wordIndex];

  charIndex += deleting ? -1 : 1;
  typingElement.textContent = word.substring(0, charIndex);

  let delay = deleting ? 50 : 90;

  if (!deleting && charIndex === word.length) {
    deleting = true;
    delay = 1600;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 350;
  }

  setTimeout(typingEffect, delay);
}

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typingElement.textContent = words[0];
} else {
  typingEffect();
}

// ===============================
// SCROLL ANIMATION
// ===============================
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("active"));
}

// ===============================
// PHOTO LIGHTBOX
// ===============================
const galleryItems = [
  ...document.querySelectorAll(".gallery-item")
];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const imageCounter = document.getElementById("imageCounter");
const closeButton = document.getElementById("closeLightbox");
const prevButton = document.getElementById("prevImage");
const nextButton = document.getElementById("nextImage");

let currentImageIndex = 0;
let previousFocus = null;

function showImage(index) {
  currentImageIndex =
    (index + galleryItems.length) % galleryItems.length;

  const item = galleryItems[currentImageIndex];

  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxTitle.textContent = item.dataset.title;

  imageCounter.textContent =
    `${currentImageIndex + 1} / ${galleryItems.length}`;
}

function openLightbox(index) {
  previousFocus = document.activeElement;
  showImage(index);

  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
  lightboxImage.removeAttribute("src");

  if (previousFocus) previousFocus.focus();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

closeButton.addEventListener("click", closeLightbox);

prevButton.addEventListener("click", () => {
  showImage(currentImageIndex - 1);
});

nextButton.addEventListener("click", () => {
  showImage(currentImageIndex + 1);
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
  if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);

  if (event.key === "Tab") {
    const controls = [closeButton, prevButton, nextButton];
    const index = controls.indexOf(document.activeElement);

    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      controls[controls.length - 1].focus();
    } else if (!event.shiftKey &&
               index === controls.length - 1) {
      event.preventDefault();
      controls[0].focus();
    }
  }
});

// SWIPE FOTO DI HP
let touchStartX = 0;

lightbox.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", event => {
  if (lightbox.hidden) return;

  const difference =
    event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(difference) > 50) {
    showImage(currentImageIndex + (difference < 0 ? 1 : -1));
  }
}, { passive: true });

// ===============================
// VIDEO MANUAL
// ===============================
const projectVideos =
  document.querySelectorAll(".video-wrapper video");

projectVideos.forEach(video => {
  video.autoplay = false;

  video.addEventListener("play", () => {
    projectVideos.forEach(otherVideo => {
      if (otherVideo !== video) {
        otherVideo.pause();
      }
    });
  });
});

// ===============================
// COPYRIGHT
// ===============================
document.getElementById("year").textContent =
  new Date().getFullYear();
