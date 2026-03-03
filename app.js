(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const slideIndexEl = document.getElementById("slideIndex");
  const slideTotalEl = document.getElementById("slideTotal");
  const progressBar = document.getElementById("progressBar");
  const btnFullscreen = document.getElementById("btnFullscreen");

  slideTotalEl.textContent = String(slides.length);

  let currentIndex = 0;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setActiveSlide(index) {
    slides.forEach((s, i) => {
      if (i === index) s.classList.add("is-active");
      else s.classList.remove("is-active");
    });
  }

  function updateUI(index) {
    slideIndexEl.textContent = String(index + 1);
    const pct = slides.length <= 1 ? 100 : ((index) / (slides.length - 1)) * 100;
    progressBar.style.width = `${pct}%`;
    setActiveSlide(index);
  }

  function goTo(index) {
    currentIndex = clamp(index, 0, slides.length - 1);
    slides[currentIndex].scrollIntoView({ behavior: "smooth", block: "start" });
    updateUI(currentIndex);
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // Observa cuál slide es el más visible (para contador + animación al hacer scroll)
  const observer = new IntersectionObserver((entries) => {
    let best = null;
    for (const e of entries) {
      if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    }
    if (best && best.isIntersecting) {
      const idx = slides.indexOf(best.target);
      if (idx >= 0 && idx !== currentIndex) {
        currentIndex = idx;
        updateUI(currentIndex);
      }
    }
  }, { threshold: [0.35, 0.5, 0.65, 0.8] });

  slides.forEach(s => observer.observe(s));

  // Botones dentro de slides
  document.addEventListener("click", (ev) => {
    const t = ev.target;
    if (!(t instanceof Element)) return;

    if (t.matches("[data-next]")) next();
    if (t.matches("[data-prev]")) prev();

    if (t.matches("[data-go]")) {
      const idx = Number(t.getAttribute("data-go"));
      if (!Number.isNaN(idx)) goTo(idx);
    }
  });

  // Teclado
  document.addEventListener("keydown", (ev) => {
    const key = ev.key;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

    if (key === "ArrowRight" || key === "ArrowDown" || key === "PageDown") {
      ev.preventDefault();
      next();
    } else if (key === "ArrowLeft" || key === "ArrowUp" || key === "PageUp") {
      ev.preventDefault();
      prev();
    } else if (key === "Home") {
      ev.preventDefault();
      goTo(0);
    } else if (key === "End") {
      ev.preventDefault();
      goTo(slides.length - 1);
    } else if (key.toLowerCase() === "f") {
      ev.preventDefault();
      toggleFullscreen();
    }
  });

  // Pantalla completa
  function toggleFullscreen() {
    const isFull = !!document.fullscreenElement;
    if (!isFull) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  btnFullscreen.addEventListener("click", toggleFullscreen);

  document.addEventListener("fullscreenchange", () => {
    const isFull = !!document.fullscreenElement;
    btnFullscreen.textContent = isFull ? "Salir de pantalla completa" : "Pantalla completa";
  });

  // Inicial
  updateUI(0);
  // Marca el primer slide activo desde el inicio
  setActiveSlide(0);
})();