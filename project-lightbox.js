const lightbox = document.getElementById("image-lightbox");

if (lightbox) {
  const lightboxStage = document.getElementById("lightbox-stage");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxZoomOut = document.getElementById("lightbox-zoom-out");
  const lightboxZoomIn = document.getElementById("lightbox-zoom-in");
  const lightboxReset = document.getElementById("lightbox-reset");
  const expandableImages = Array.from(
    document.querySelectorAll("[data-lightbox]")
  );

  let lightboxScale = 1;
  let lightboxX = 0;
  let lightboxY = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let isDragging = false;
  let imageThatOpenedLightbox = null;

  function addExpandIndicator(image) {
    if (image.parentElement.classList.contains("expandable-image-frame")) {
      return;
    }

    const frame = document.createElement("div");
    frame.className = "expandable-image-frame";
    image.parentNode.insertBefore(frame, image);
    frame.appendChild(image);

    const indicator = document.createElement("span");
    indicator.className = "image-expand-indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="10.5" cy="10.5" r="6.5"></circle>
        <path d="M15.4 15.4L21 21"></path>
        <path d="M10.5 7.5v6M7.5 10.5h6"></path>
      </svg>
    `;
    frame.appendChild(indicator);
  }

  function updateLightboxTransform() {
    lightboxImage.style.transform =
      `translate(${lightboxX}px, ${lightboxY}px) scale(${lightboxScale})`;
    lightboxReset.textContent = `${Math.round(lightboxScale * 100)}%`;
    lightboxStage.classList.toggle("can-drag", lightboxScale > 1);
  }

  function resetLightboxView() {
    lightboxScale = 1;
    lightboxX = 0;
    lightboxY = 0;
    updateLightboxTransform();
  }

  function openLightbox(image) {
    imageThatOpenedLightbox = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    resetLightboxView();
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) {
      return;
    }

    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";

    if (imageThatOpenedLightbox) {
      imageThatOpenedLightbox.focus();
    }
  }

  function changeLightboxZoom(amount) {
    lightboxScale = Math.min(4, Math.max(0.5, lightboxScale + amount));

    if (lightboxScale <= 1) {
      lightboxX = 0;
      lightboxY = 0;
    }

    updateLightboxTransform();
  }

  expandableImages.forEach(function (image) {
    addExpandIndicator(image);

    image.addEventListener("click", function () {
      openLightbox(image);
    });

    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxZoomOut.addEventListener("click", function () {
    changeLightboxZoom(-0.25);
  });
  lightboxZoomIn.addEventListener("click", function () {
    changeLightboxZoom(0.25);
  });
  lightboxReset.addEventListener("click", resetLightboxView);

  lightboxStage.addEventListener(
    "wheel",
    function (event) {
      event.preventDefault();
      changeLightboxZoom(event.deltaY < 0 ? 0.25 : -0.25);
    },
    { passive: false }
  );

  lightboxStage.addEventListener("pointerdown", function (event) {
    if (lightboxScale <= 1) {
      return;
    }

    isDragging = true;
    dragStartX = event.clientX - lightboxX;
    dragStartY = event.clientY - lightboxY;
    lightboxStage.classList.add("is-dragging");
    lightboxStage.setPointerCapture(event.pointerId);
  });

  lightboxStage.addEventListener("pointermove", function (event) {
    if (!isDragging) {
      return;
    }

    lightboxX = event.clientX - dragStartX;
    lightboxY = event.clientY - dragStartY;
    updateLightboxTransform();
  });

  function finishLightboxDrag(event) {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    lightboxStage.classList.remove("is-dragging");

    if (lightboxStage.hasPointerCapture(event.pointerId)) {
      lightboxStage.releasePointerCapture(event.pointerId);
    }
  }

  lightboxStage.addEventListener("pointerup", finishLightboxDrag);
  lightboxStage.addEventListener("pointercancel", finishLightboxDrag);

  lightboxStage.addEventListener("dblclick", function () {
    if (lightboxScale === 1) {
      changeLightboxZoom(1);
    } else {
      resetLightboxView();
    }
  });

  lightboxStage.addEventListener("click", function (event) {
    if (event.target === lightboxStage) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "+" || event.key === "=") {
      changeLightboxZoom(0.25);
    } else if (event.key === "-") {
      changeLightboxZoom(-0.25);
    } else if (event.key === "0") {
      resetLightboxView();
    }
  });
}
