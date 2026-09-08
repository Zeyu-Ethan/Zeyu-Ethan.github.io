const projects = [
  {
    image: "assets/images/covers/esp32-cover.png",
    alt: "ESP32 Light Sensor Alarm System",
    url: "projects/esp32.html",
    summary:
      "ESP32 Light Sensor Alarm System — Embedded alarm with local Wi-Fi monitoring and Python data logging.",
    gradient: "95, 90, 88"
  },
  {
    image: "assets/images/covers/racetrack-cover.jpg",
    alt: "Smart Electronic Toy Racetrack System",
    url: null,
    summary:
      "Smart Electronic Toy Racetrack System — PCB timer design and testing.",
    gradient: "35, 55, 78"
  },
  {
    image: "assets/images/covers/traffic-light-cover.png",
    alt: "JK Flip-Flop Traffic Light Controller",
    url: null,
    summary:
      "JK Flip-Flop Traffic Light Controller — Eight-state sequential controller designed and verified in Multisim.",
    gradient: "65, 61, 72"
  },
  {
    image: "assets/images/covers/ewb-cover.png",
    alt: "UK Chapter Design Challenge 2026",
    url: null,
    summary:
      "UK Chapter Design Challenge 2026 — CountryCare Kit for remote healthcare.",
    gradient: "112, 112, 120"
  },
  {
    image: "assets/images/covers/amplify-cover.png",
    alt: "AMplify Impact Challenge 2026",
    url: null,
    summary:
      "AMplify Impact Challenge 2026 — A low-waste pre-print checklist concept for schools and workshops.",
    gradient: "45, 93, 94"
  }
];

const heroFrame = document.getElementById("hero-frame");
const heroImage = document.getElementById("hero-image");
const heroProjectLink = document.getElementById(
  "hero-project-link"
);
const projectSummary = document.getElementById("project-summary");

const previousButton = document.getElementById("previous-project");
const nextButton = document.getElementById("next-project");

const thumbnails = Array.from(
  document.querySelectorAll(".thumbnail")
);

const dots = Array.from(
  document.querySelectorAll(".dot")
);

let currentProjectIndex = 0;

function showProject(index) {
  currentProjectIndex =
    (index + projects.length) % projects.length;

  const project = projects[currentProjectIndex];

  heroImage.src = project.image;
  heroImage.alt = project.alt;

  projectSummary.textContent = project.summary;

  if (project.url) {
    heroProjectLink.href = project.url;
    heroProjectLink.setAttribute(
      "aria-label",
      `Open ${project.alt}`
    );
    heroProjectLink.classList.remove("is-disabled");
  } else {
    heroProjectLink.removeAttribute("href");
    heroProjectLink.setAttribute(
      "aria-label",
      `${project.alt} details coming later`
    );
    heroProjectLink.classList.add("is-disabled");
  }

  heroFrame.style.setProperty(
    "--caption-rgb",
    project.gradient
  );

  thumbnails.forEach((thumbnail, thumbnailIndex) => {
    const isActive = thumbnailIndex === currentProjectIndex;

    thumbnail.classList.toggle("active", isActive);
    thumbnail.setAttribute(
      "aria-pressed",
      String(isActive)
    );
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentProjectIndex;

    dot.classList.toggle("active", isActive);
    dot.setAttribute(
      "aria-current",
      isActive ? "true" : "false"
    );
  });
}

previousButton.addEventListener("click", () => {
  showProject(currentProjectIndex - 1);
});

nextButton.addEventListener("click", () => {
  showProject(currentProjectIndex + 1);
});

thumbnails.forEach((thumbnail) => {
  const index = Number(thumbnail.dataset.index);

  thumbnail.addEventListener("mouseenter", () => {
    showProject(index);
  });

  thumbnail.addEventListener("focus", () => {
    showProject(index);
  });

  thumbnail.addEventListener("click", () => {
    const project = projects[index];

    if (project.url) {
      window.location.href = project.url;
    } else {
      showProject(index);
    }
  });
});

dots.forEach((dot) => {
  const index = Number(dot.dataset.index);

  dot.addEventListener("click", () => {
    showProject(index);
  });
});

/* Contact dropdown */

const contactMenu = document.querySelector(".contact-menu");
const contactToggle = document.getElementById("contact-toggle");

function closeContactMenu() {
  contactMenu.classList.remove("is-open");
  contactToggle.setAttribute("aria-expanded", "false");
}

contactToggle.addEventListener("click", (event) => {
  event.stopPropagation();

  const willOpen =
    !contactMenu.classList.contains("is-open");

  contactMenu.classList.toggle("is-open", willOpen);
  contactToggle.setAttribute(
    "aria-expanded",
    String(willOpen)
  );
});

document.addEventListener("click", (event) => {
  if (!contactMenu.contains(event.target)) {
    closeContactMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeContactMenu();
    contactToggle.focus();
  }
});

showProject(0);
